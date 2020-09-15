<template>
  <mu-dialog
    width="100%"
    max-width="100%"
    dialog-class="modal-box"
    :open.sync="open"
    transition="slide-top"
    @close="cloceModel"
  >
    <div class="content-box">
      <div class="column-box">
        <mu-list>
          <div>{{currentKey}}筛选</div>
          <mu-list-item
            button
            :ripple="true"
            v-for="(val, index) in optionsArry"
            :key="index+'a'"
            @click="changeSelected(val)"
          >
            <mu-list-item-action>
              <mu-radio
                disabled
                color="#ff4081"
                uncheck-icon="check_box_outline_blank"
                checked-icon="check_box"
                v-model="currentSelect"
                :value="val.value"
              ></mu-radio>
            </mu-list-item-action>
            <mu-list-item-title>
              <span :class="{orange:val.value===currentSelect}">{{val.label}}</span>
            </mu-list-item-title>
          </mu-list-item>
        </mu-list>
      </div>
    </div>
    <div class="btn-box" slot="actions">
      <mu-button flat color="#2196f3" @click="confimValue">{{hasValue?'确定':'收起'}}</mu-button>
    </div>
  </mu-dialog>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    optionsArry: {
      type: Array,
      default: function () {
        return [];
      }
    },
    currentKey: {
      type: String,
      default: '按类型'
    },
    currentValue: {
      type: Number,
      default: undefined
    }
  },
  data () {
    return {
      currentSelect: undefined, // 父列表当前选中项
      selectOption: null
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
    hasValue () {
      if (this.currentSelect !== undefined) return true;
      return false;
    }
  },
  created () {
    this.currentSelect = this.currentValue;
  },
  methods: {
    // 选中
    changeSelected (item) {
      if (this.currentSelect === item.value) {
        this.currentSelect = undefined;
        this.selectOption = null;
      } else {
        this.currentSelect = item.value;
        this.selectOption = item;
      }
    },
    cloceModel () {
      this.open = false;
      this.currentSelect = undefined;
      this.selectOption = null;
    },
    confimValue () {
      let param = {
        value: undefined,
        label: undefined,
        isChange: false
      };
      if (this.selectOption !== null) {
        param.label = this.selectOption.label;
        param.value = this.selectOption.value;
        param.isChange = true;
      }
      if (this.currentSelect !== this.currentValue) {
        param.isChange = true;
      }
      this.$emit('changeValue', param);
      this.cloceModel();
    }
  }
};
</script>
<style lang="less" scoped>
.mu-dialog-wrapper {
  display: flex;
  align-items: flex-start;
}
.content-box {
  display: flex;
  align-items: stretch;
  min-height: 180px;
  padding-left: 15px;
  .column-box {
    flex: 1;
    overflow: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    .row-btn {
      width: 100%;
    }
  }
}
.btn-box {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.orange {
  color: #ff8949;
}
/deep/.mu-flat-button {
  min-width: 30px;
  margin: 0 8px;
}
input::placeholder {
  text-indent: 2em;
}

/deep/.mu-dialog-actions {
  border-top: solid 1px #ececec;
}
/deep/.mu-dialog-body {
  padding: 20px 8px 8px;
}
/deep/.mu-dialog {
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
/deep/.mu-radio.disabled {
  color: #ff8949;
}
/deep/.mu-radio-icon-uncheck {
  color: #797979;
}
</style>
