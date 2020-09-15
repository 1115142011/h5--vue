<template>
  <mu-dialog
    max-width="95%"
    scrollable
    lock-scroll
    :open="open"
    @close="cancel"
    dialog-class="tagDialog"
  >
    <div slot="title" class="dialogTitle">推荐人当前在租列表</div>
    <div
      class="contentBox"
      v-loading="loading"
      data-mu-loading-text="加载中..."
    >
      <div class="v_footerHint" v-if="!keyWords">推荐人姓名不能为空!</div>
      <div class="v_footerHint" v-if="keyWords&&selectOptions.length===0&&!loading">未查询到租约</div>
      <mu-list>
        <mu-list-item v-for="(item,index) in selectOptions" :key="'IN'+index">
          <mu-list-item-content>
            <mu-radio :label="item.room_name" :value="item" v-model="currentVal"></mu-radio>
          </mu-list-item-content>
        </mu-list-item>
      </mu-list>
    </div>
    <div class="footerBox" slot="actions">
      <mu-button flat color="primary" small @click="cancel">取消</mu-button>
      <mu-button flat color="primary" small @click="confirm">好的</mu-button>
    </div>
  </mu-dialog>
</template>
<script>
import { getLeaseIntroducer } from '@/api/salesApi';
export default {
  props: ['show', 'keyWords'],
  data () {
    return {
      loading: false,
      currentVal: '',
      selectOptions: [] // 转介绍人租约列表
    };
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
  created () {
    if (this.keyWords) {
      this.getIntroducer(this.keyWords);
    }
  },
  methods: {
    // 获取转介绍人的在租合约
    getIntroducer (key) {
      this.loading = true;
      let obj = {
        cust_name: key
      };
      getLeaseIntroducer(obj).then(res => {
        this.loading = false;
        this.selectOptions = res.data;
      });
    },
    // 取消--或通过遮罩关闭
    cancel () {
      this.$emit('update:show', false); // 关闭弹框
    },
    // 确定
    confirm () {
      if (this.currentVal) {
        this.$emit('changeData', this.currentVal);
      }
      this.$emit('update:show', false); // 关闭弹框
    }
  }
};
</script>
<style lang="less" scoped>
.tagDialog {
  .contentBox {
    min-height: 120px;
    position: relative;
  }
}
// 弹框样式调整
/deep/.tagDialog {
  border-radius: 8px;
  .name {
    font-size: 12px;
    color: #000000;
  }
  .mu-dialog-title {
    border-bottom: solid 1px #cccccc; // header 边框线
  }
  .mu-dialog-actions {
    border-top: solid 1px #cccccc; // footer 边框线
  }
  .mu-dialog-body {
    padding: 0 10px 0 0;
  }
  .dialogTitle {
    width: 100%;
  }
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
