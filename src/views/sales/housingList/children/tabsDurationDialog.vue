<template>
  <mu-dialog scrollable :open.sync="open" max-width="99%" lock-scroll dialog-class="locationDialog">
    <div slot="title" class="dialogTitle">租期</div>
    <div class="content">
      <mu-container>
        <div class="select-control-group">
          <mu-flex class="select-control-row" :key="'radio ' + i" v-for="(item,i) in typeData">
            <mu-radio :value="i" v-model="typeSelected" :label="item.name"></mu-radio>
          </mu-flex>
        </div>
      </mu-container>
    </div>
    <!-- 弹框底部按钮 -->
    <div class="footerBox" slot="actions">
      <mu-button flat color="primary" small @click="resetValue">重置</mu-button>
      <div>
        <mu-button flat color="primary" small @click="cancel">取消</mu-button>
        <mu-button flat color="primary" small @click="confirm">好的</mu-button>
      </div>
    </div>
  </mu-dialog>
</template>
<script>
export default {
  props: ['show', 'current'],
  data () {
    return {
      typeSelected: undefined, // 类型当前选中项
      typeData: [
        // 位置类型数据
        {
          name: '不足1个月',
          value: 1
        },
        {
          name: '不足3个月',
          value: 3
        },
        {
          name: '不足6个月',
          value: 6
        },
        {
          name: '不足12个月',
          value: 12
        }
      ]
    };
  },
  created () {
    // 设置一级区域数据
    this.typeSelected = this.current;
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
    // 取消--或通过遮罩关闭
    cancel () {
      this.typeSelected = undefined;
      this.$emit('update:show', false); // 关闭弹框
    },
    // 重置选中项
    resetValue () {
      this.typeSelected = undefined;
    },
    // 确定
    confirm () {
      if (this.typeSelected === undefined) {
        this.$emit('changeValue', { name: '租期', value: undefined });
      } else {
        this.$emit('changeValue', this.typeData[this.typeSelected]);
      }
      this.cancel(); // 关闭弹框
    }
  }
};
</script>
<style lang="less" scoped>
.content {
  width: 290px;
  height: 300px;
  padding-left: 30px;
  display: flex;
  align-items: stretch;
}
.select-control-row {
  padding: 8px 0;
}
.select-control-group {
  margin: 16px 0;
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
    padding-left: 20px;
    justify-content: space-between;
    align-items: center;
    .mu-button {
      min-width: 50px;
    }
  }
}
</style>
