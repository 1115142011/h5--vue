<template>
  <mu-dialog
    width="70%"
    scrollable
    lock-scroll
    :open="open"
    @close="cancel"
    dialog-class="tagDialog"
  >
    <div slot="title" class="dialogTitle">
    <span>  筛选</span>
     <mu-button flat color="primary" small @click="resetSelect">重置</mu-button>
      </div>
    <div class="contentBox">
      <div class="itemBox" v-for="(item,index) in tempData" :key="index">
        <div class="name">{{item.name}}</div>
        <div class="tagBox">
          <mu-chip
            class="chip"
            @click="select(value)"
            :selected="item.selected"
            :class="{selected:value.selected}"
            v-for="(value,i) in item.tags"
            :key="i"
          >{{value.name}}</mu-chip>
        </div>
      </div>
    </div>
    <div class="footerBox" slot="actions">
      <mu-button flat color="primary" small @click="cancel">取消</mu-button>
      <mu-button flat color="primary" small @click="confirm">好的</mu-button>
    </div>
  </mu-dialog>
</template>
<script>
export default {
  props: ['show'],
  data () {
    return {
      tempData: undefined // 拷贝状态用于独立维护
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
    },
    tagDatas: function () {
      return this.$store.state.sales.tags;
    }
  },
  created () {
    this.tempData = JSON.parse(JSON.stringify(this.tagDatas));
  },
  methods: {
    select (item) {
      item.selected = !item.selected;
    },
    // 取消--或通过遮罩关闭
    cancel () {
      this.tempData = JSON.parse(JSON.stringify(this.tagDatas));
      this.$emit('update:show', false); // 关闭弹框
    },
    // 确定
    confirm () {
      this.$store.commit('sales/setTagsData', this.tempData);
      this.$emit('changeData', this.eachValue(this.tempData));
      this.$emit('update:show', false); // 关闭弹框
    },
    // 重置选中项
    resetSelect () {
      this.tempData.forEach(item => {
        item.tags.forEach(list => {
          list.selected = false;
        });
      });
    },
    // 获取选中项
    eachValue (arr) {
      let obj = {
        rent_mode: [],
        room_type: []
      };
      arr.forEach(item => {
        item.tags.forEach(list => {
          if (list.selected) {
            obj[list.type].push(list.value);
          }
        });
      });
      return obj;
    }
  }
};
</script>
<style lang="less" scoped>
.tagDialog {
  .contentBox {
    .itemBox {
      .tagBox {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        .chip {
          transform: scale(0.8);
        }
        .selected {
          background: #448aff;
          color: #ffffff;
        }
      }
      .name {
        margin: 5px 0;
      }
    }
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
    padding-right: 0;
    border-bottom: solid 1px #cccccc; // header 边框线
  }
  .mu-dialog-actions {
    border-top: solid 1px #cccccc; // footer 边框线
  }
  .dialogTitle {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
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
