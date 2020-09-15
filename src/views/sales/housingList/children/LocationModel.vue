<template>
  <mu-dialog scrollable :open.sync="open" max-width="99%" lock-scroll dialog-class="locationDialog">
    <div slot="title" class="dialogTitle">位置</div>
    <div class="content">
      <!-- 位置类型 -->
      <div class="itemBox widthSort">
        <mu-button
          flat
          small
          class="v_ellipsis"
          :class="{selected:index===typeSelected}"
          v-for="(item,index) in typeData"
          :key="index"
          @click="setClass('typeSelected',index)"
        >{{item.name}}</mu-button>
      </div>
      <!-- 区域一级 -->
      <div class="itemBox widthSort border" v-loading="areaLoading" data-mu-loading-overlay-color="transparent">
        <mu-button
          flat
          small
          class="v_ellipsis"
          :class="{selected:index===parentSelected}"
          v-for="(item,index) in area"
          :key="index"
          @click="setClass('parentSelected',index,item)"
        >{{item.name}}</mu-button>
        <span class="hintMsg" v-if="area.length===0 && areaLoading===false">暂无区域信息</span>
      </div>
      <!-- 区域二级 -->
      <div class="itemBox widthWide" data-mu-loading-overlay-color="transparent" v-loading="childLoading">
        <mu-button
          flat
          small
          class="v_ellipsis"
          :class="{selected:index===childSelect}"
          v-for="(item,index) in childData"
          :key="index"
          @click="setClass('childSelect',index)"
        >{{item.name}}</mu-button>
        <span class="hintMsg" v-if="childData.length===0 && childLoading===false">暂无区域信息</span>
      </div>
    </div>
    <!-- 弹框底部按钮 -->
    <div class="footerBox" slot="actions">
      <mu-button flat color="primary" small @click="cancel">取消</mu-button>
      <mu-button flat color="primary" small @click="confirm">好的</mu-button>
    </div>
  </mu-dialog>
</template>
<script>
import { getSalesDistrict, getSalesCommunity } from '@/api/salesApi';

export default {
  props: ['show'],
  data () {
    return {
      areaLoading: false,
      childLoading: true,
      parentSelected: undefined, // 父列表当前选中项
      childSelect: undefined, // 子列表当前选中项
      typeSelected: 0, // 类型当前选中项
      typeData: [
        // 位置类型数据
        {
          name: '按区域',
          type: 1
        },
        {
          name: '按地铁',
          type: 2
        }
      ],
      area: [], // 一级区域数据
      childData: []
    };
  },
  created () {
    // 设置一级区域数据
    this.getDistrict();
  },
  computed: {
    open: {
      get () {
        return this.show;
      },
      set (val) {
        this.$emit('update:show', val);
      }
    }
  },
  methods: {
    // 获取 区域信息
    getDistrict () {
      this.areaLoading = true;
      getSalesDistrict().then(res => {
        this.area = res.data || [];
        this.getCommunity(res.data[0].id);
        this.areaLoading = false;
      });
    },
    // 获取二级位置信息
    getCommunity (locationId) {
      this.childLoading = true;
      getSalesCommunity(locationId).then(res => {
        this.childData = res.data || [];
        this.childLoading = false;
      });
    },
    // 设置选中项的样式
    setClass (current, number) {
      this[current] = number;
    },
    // 取消--或通过遮罩关闭
    cancel () {
      this.$emit('update:show', false); // 关闭弹框
    },
    // 确定
    confirm () {
      if (this.childSelect >= 0) {
        // 子区域有选中项
        this.$emit('changeLocation', this.childData[this.childSelect], 'child');
      } else if (this.parentSelected >= 0) {
        // 父区域的选中项
        this.$emit('changeLocation', this.area[this.parentSelected], 'father');
      } else {
        this.$emit('changeLocation', '', '');
      }
      this.$emit('update:show', false); // 关闭弹框
    }
  },
  watch: {
    typeSelected: function (newVal, oldVal) {
      // 位置类型切换
      if (newVal === 1) {
        this.area = [];
        this.childData = [];
        this.childSelect = undefined;
        this.parentSelected = undefined;
      } else {
        this.childSelect = undefined;
        this.parentSelected = undefined;
        // 获取一级区域数据
        this.getDistrict();
      }
    },
    parentSelected: function (newVal, oldVal) {
      // 一级区域切换
      if (newVal === undefined) return;
      this.childSelect = undefined;
      this.childData = this.area[newVal].child || [];
      this.getCommunity(this.area[newVal].id);
    }
  }
};
</script>
<style lang="less" scoped>
.content {
  width: 290px;
  height: 300px;
  display: flex;
  // padding: 0 10px;
  align-items: stretch;
  .itemBox {
    padding: 0 5px;
    min-width: 80px;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    font-size: 13px;
    overflow-x: hidden;
    overflow-y: auto;
    color: #000000;
    position: relative;
    &.border {
      height: auto;
      border-right: solid 1px #cccccc;
      border-left: solid 1px #cccccc;
    }
  }
  .selected {
    color: #448aff;
  }
  .hintMsg {
    min-width: 88px;
    margin-top: 80px;
    color: #797979;
  }
}
.widthSort{
  width: 80px;
}
.widthWide{
  width: 130px;
}
// 选项弹框样式调整
/deep/.locationDialog {
  border-radius: 8px;
  .mu-dialog-title {
    border-bottom: solid 1px #cccccc; // header 边框线
  }
  .mu-dialog-actions {
    border-top: solid 1px #cccccc; // footer 边框线
  }
  .mu-dialog-body {
    padding: 0;
  }
  .mu-flat-button {
    min-width: 60px;
  }
  // 弹框底部样式重写
  .footerBox {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .mu-button {
      min-width: 50px;
    }
  }
}
</style>
