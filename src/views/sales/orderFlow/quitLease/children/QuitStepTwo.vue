<template>
  <div class="outerBox" v-loading="loading" data-mu-loading-text="加载中...">
    <lease-title></lease-title>

    <!-- 主体内容 -->
    <section v-if="baseBills.length>0">
      <!-- 账单 -->
      <div class="bill">
        <mu-expansion-panel :expand.sync="pnaelOpen">
          <div slot="header" class="panel_title">
            <div class="panel_title_left">
              <div class="title_tag" :class="[totalPrice>=0?'green':'orange']">
                <span class="small_text">{{totalPrice>=0?'应收款':'应支款'}}</span>
              </div>
              <div class="title_text v_ellipsis">
                <span class="font_weight">系统</span>
                <span class="time_msg v_ellipsis">结算时间：{{baseBills[0].endDate}}</span>
              </div>
            </div>

            <div class="right_price">￥{{Math.abs(totalPrice)}}</div>
          </div>
          <!-- 费用列表 -->
          <div slot="default" class="panel_content">
            <div class="list_item" v-for="(item,index) in baseBills" :key="'item'+index">
              <div class="title_text v_ellipsis">
                <span class="font_weight listTitle">{{item.typeName}}</span>
                <span class="time_msg v_ellipsis">{{item.beginDate}}-{{item.endDate}}</span>
                <span
                  class="msg_type"
                  :class="[item.inOut===1?'green':'orange']"
                >{{item.inOut===1?'应收':'应支'}}</span>
              </div>
              <div class="right_price listPrice">￥{{Math.abs(item.amount)}}</div>
            </div>
          </div>
        </mu-expansion-panel>
      </div>
      <!-- 新添加的费用信息 -->
      <transition-group tag="div" name="list-fade">
        <mu-paper
          :z-depth="1"
          class="new_msg v_block"
          v-for="(item,index) in roomLeaseBillList"
          :key="'item'+index"
        >
          <div class="container">
            <div class="left_msg">
              <span class="msg_name">{{item.typeName}}</span>
              <span class="msg_time">产生时间：{{item.beginDate}}-{{item.endDate}}</span>
              <span
                class="msg_type"
                :class="[item.inOut===1?'green':'orange']"
              >{{item.inOut===1?'应收':'应支'}}</span>
            </div>
            <div class="right_msg">￥{{Math.abs(item.amount)}}</div>
          </div>
          <div class="delete_btn">
            <mu-button flat small color="primary" @click="deleteroomLeaseBillList(index)">删除</mu-button>
          </div>
        </mu-paper>
      </transition-group>
      <!-- 添加费用操作入口 -->
      <mu-paper :z-depth="1" class="add_cost_box">
        <div class="add_cost_btn" @click="addCostOpen">
          <mu-ripple color="#448AFF">
            <span>+添加费用</span>
          </mu-ripple>
        </div>
        <!-- 添加的费用信息输入 -->
        <transition name="falls">
          <div class="cost_msg_box" v-show="addOpen">
            <div class="add_cost_msg">
              <mu-form ref="add_cost_form" :model="formMsg" class="step_form">
                <mu-form-item label="费用类型" prop="selectTempVal" :rules="msgRules">
                  <mu-select chips v-model="formMsg.selectTempVal" full-width>
                    <mu-option
                      v-for="(item,index) in priceTypeOptions"
                      :key="index"
                      :label="item.name"
                      :value="item"
                      ripple
                    ></mu-option>
                  </mu-select>
                </mu-form-item>
                <mu-form-item label="费用金额" label-float prop="amount" :rules="msgRules">
                  <mu-text-field
                    v-model="formMsg.amount"
                    full-width
                    @input="testVal($event,'amount')"
                  ></mu-text-field>
                </mu-form-item>
                <mu-form-item label="产生时间">
                  <div class="timeBox">
                    <mu-date-input
                      v-model="formMsg.beginDate"
                      action-icon="date_range"
                      no-display
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                      full-width
                    ></mu-date-input>
                    <span class="cutOff">~</span>
                    <mu-date-input
                      v-model="formMsg.endDate"
                      action-icon="date_range"
                      label-float
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                      no-display
                      full-width
                    ></mu-date-input>
                  </div>
                </mu-form-item>
                <mu-form-item label="收/支" prop="inOut" :rules="msgRules">
                  <mu-select chips v-model="formMsg.inOut" full-width>
                    <mu-option
                      v-for="(item,index) in priceType"
                      :key="index"
                      :label="item.lable"
                      :value="item.value"
                      ripple
                    ></mu-option>
                  </mu-select>
                </mu-form-item>
              </mu-form>
            </div>
            <div class="add_footer_btn">
              <mu-button textColor="#448AFF" flat small @click="closeAddOpen">取消</mu-button>
              <mu-button textColor="#448AFF" flat small @click="confimAdd">确定</mu-button>
            </div>
          </div>
        </transition>
      </mu-paper>
      <!-- 添加费用操作面板 -->
      <mu-paper :z-depth="1" class="add_cost_box">
        <div class="add_cost_btn" @click="remarShow=true">
          <mu-ripple color="#448AFF">
            <span>+添加备注信息</span>
          </mu-ripple>
        </div>
        <!-- 添加备注信息 -->
        <transition name="falls">
          <div class="cost_remark" v-show="remarShow">
            <div class="add_cost_msg">
              <!-- <textarea class="remark_msg" v-model="remark"></textarea> -->
              <textarea v-model="remark" class="textarea" placeholder="备注：xxx"></textarea>
            </div>
            <div class="add_footer_btn">
              <mu-button textColor="#448AFF" flat small @click="remarkCancle">取消</mu-button>
              <mu-button textColor="#448AFF" flat small @click="remarConfim">确定</mu-button>
            </div>
          </div>
        </transition>
      </mu-paper>
    </section>
    <!-- 按钮 -->
    <mu-paper class="btn" :z-depth="4" v-show="!resizeChange">
      <div class="totalPrice v_ellipsis">
        <span>总计：</span>
        <span
          class="v_ellipsis"
          v-if="!isNaN(bottomTotalPrice)"
          :class="[bottomTotalPrice>=0?'green':'orange']"
        >{{bottomTotalPrice>=0?`(收) ${Math.abs(bottomTotalPrice)}`:`(支) ${Math.abs(bottomTotalPrice)}`}}</span>
        <span style="color:red" v-if="isNaN(bottomTotalPrice)">--参数出错！</span>
      </div>
      <div class="nav_btn">
        <mu-button textColor="#448AFF" small flat @click="changeStep()" class="leftBtn">上一步</mu-button>
        <mu-button color="#fdd835" :disabled="onClick" v-loading="onClick" data-mu-loading-text="请稍后..." textColor="#333333" @click="quitConfirm">确认退租</mu-button>
      </div>
    </mu-paper>
  </div>
</template>
<script>
import {
  getCheckoutBills,
  getLeaseCatalog,
  submitCheckout
} from '@/api/salesApi';
import LeaseTitle from '../../components/LeaseTitle';
export default {
  components: { LeaseTitle },
  data () {
    return {
      onClick: false,
      loading: false,
      pnaelOpen: true, // 系统账单展开状态
      addOpen: false, // 添加费用填写状态
      totalPrice: '',
      remarShow: false,
      baseBills: [], // 基础账单
      // 额外费用信息
      roomLeaseBillList: [], // 手工新增费用
      bottomTotalPrice: 0,
      // 收/支选择
      priceType: [
        {
          lable: '应收',
          value: 1
        },
        {
          lable: '应支',
          value: 2
        }
      ],
      remark: '',
      msgRules: [{ validate: val => !!val, message: '该选项为必填项' }],
      formMsg: {
        selectTempVal: '',
        typeName: '',
        amount: '',
        beginDate: undefined,
        endDate: undefined,
        inOut: undefined
      },
      // 费用类型下拉参数
      priceTypeOptions: []
    };
  },
  created () {
    this.paramMsg = this.$store.state.sales.quitFormData;
    this.getBills();
    this.getCatalog();
  },
  computed: {
    resizeChange () {
      return this.$store.state.reiseChange;
    },
    roomMsg () {
      return this.$store.state.sales.roomParams;
    }
  },
  methods: {
    // 获取账单信息
    getBills () {
      this.loading = true;
      let obj = {
        checkoutId: this.paramMsg.checkoutId,
        checkoutType: this.paramMsg.checkoutType,
        checkoutDate: this.paramMsg.checkoutDate
      };
      getCheckoutBills(obj).then(res => {
        this.loading = false;
        this.baseBills = this.changeKey(res.data);
        this.totalPrice = this.countAllPrice(this.baseBills);
        this.bottomTotalPrice = this.totalPrice;
      });
    },
    // 获取费用类类型配置参数
    getCatalog () {
      getLeaseCatalog('FINANCE_BILL_TYPE/LEASE').then(({ data }) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].value === '49') {
            continue;
          }
          this.priceTypeOptions.push(data[i]);
        }
      });
    },
    // 提交退租账单
    emitBill () {
      if (this.onClick) return;
      this.onClick = true;
      this.paramMsg.roomLeaseCKBillList = this.getInteger(this.baseBills); // 原始
      this.paramMsg.roomLeaseBillList = this.getInteger(this.roomLeaseBillList);
      this.paramMsg.remark = this.remark;
      if (this.$route.query.id) {
        this.paramMsg.recheckoutType = 1;
        this.paramMsg.leaseId = this.$route.query.id;
      }
      submitCheckout(this.paramMsg).then(res => {
        this.onClick = false;
        this.$emit('addStep');
      })
        .catch(msg => {
          this.onClick = false;
        });
    },
    // 替换 money 为  // amount
    changeKey (arr) {
      if (!arr || arr.length === 0) return [];
      let tempArr = [];
      arr.forEach(item => {
        item.amount = Number(item.money.toFixed(2));
        tempArr.push(item);
      });
      return tempArr;
    },
    // 输入验证
    testVal (val, key) {
      // 当开头现多个0 时替换为1个0  ---并去掉非数字字符
      val = val.replace(/^0{2,}/, '0').replace(/[^\d.]/g, '');
      // 不允许小数点开头且连续出现小数点的时候只保留1个小数点
      val = val.replace(/^\./g, '').replace(/\.{2,}/g, '.');
      // 小数点后面只能输入2位
      val = val
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
      this.formMsg[key] = val;
    },
    // 按钮点击
    changeStep () {
      this.$emit('minusStep');
    },
    // 点击添加费用按钮
    addCostOpen () {
      this.addOpen = true;
    },
    // 添加费用取消
    closeAddOpen () {
      this.$refs.add_cost_form.clear();
      this.addOpen = false;
      this.formMsg = {
        selectTempVal: undefined,
        type: '',
        typeName: '',
        amount: '',
        beginDate: undefined,
        endDate: undefined,
        inOut: undefined
      };
    },
    // 添加费用确认
    confimAdd () {
      this.$refs.add_cost_form.validate().then(result => {
        if (result) {
          let obj = this.formMsg;
          obj.typeName = this.formMsg.selectTempVal.name;
          obj.type = this.formMsg.selectTempVal.value;
          obj.amount =
            obj.inOut === 1
              ? Number(this.formMsg.amount)
              : Number(-this.formMsg.amount);
          this.roomLeaseBillList.push(obj);
          this.formMsg = {
            selectTempVal: undefined,
            type: '',
            typeName: '',
            amount: '',
            beginDate: undefined,
            endDate: undefined,
            inOut: undefined
          };
          this.addOpen = false;
        }
      });
    },
    // 备注信息取消
    remarkCancle () {
      this.remarShow = false;
      this.remark = '';
    },
    // 备注信息确认
    remarConfim () {
      this.remarShow = false;
    },
    // 计算总价格
    countAllPrice (arr) {
      if (!arr || arr.length === 0) return 0;
      let total = 0;
      arr.forEach(item => {
        total += Number(item.amount.toFixed(2));
      });
      total = total.toFixed(2);
      return total;
    },
    // 删除额外的费用信息
    deleteroomLeaseBillList (index) {
      this.roomLeaseBillList.splice(index, 1);
    },
    // 退租确认
    quitConfirm () {
      this.$confirm('确认退租？', '提示').then(val => {
        if (val.result) {
          this.emitBill();
        }
      });
    },
    // 将负数转换为正数
    getInteger (arr) {
      if (!arr || arr.length === 0) return [];
      let tempArr = [];
      arr.forEach(item => {
        item.amount = Math.abs(item.amount);
        tempArr.push(item);
      });
      return tempArr;
    }
  },
  directives: {
    focus: function (el, binding) {
      el.focus();
    }
  },
  watch: {
    roomLeaseBillList: {
      handler: function (newVal, oldVal) {
        this.bottomTotalPrice =
          Number(this.countAllPrice(newVal)) + Number(this.totalPrice);
        this.bottomTotalPrice = this.bottomTotalPrice.toFixed(2);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.outerBox {
  padding-bottom: 20px;
  margin-top: 10px;
  .bill {
    margin-top: 10px;
  }
}
.list_item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-top: solid 1px #cccccc;
  .title_text {
    height: 100%;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    .font_weight {
      font-size: 16px;
      color: #000000;
    }
    .time_msg {
      margin-top: 5px;
      font-size: 12px;
      color: #797979;
      transform: scale(0.8) translateX(-12%);
    }
  }
  .listPrice {
    color: #000000;
    font-weight: 500;
  }
}
.panel_title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .panel_title_left {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title_tag {
      width: 45px;
      height: 45px;
      border-radius: 23px;
      display: flex;
      justify-content: center;
      align-items: center;
      &.green {
        border: solid 2px #32ae7e;
        .small_text {
          color: #32ae7e;
        }
      }
      &.orange {
        border: solid 2px #d87500;
        .small_text {
          color: #d87500;
        }
      }
      .small_text {
        font-size: 12px;
        line-height: 12px;
        transform: scale(0.8);
      }
    }
    .title_text {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      .time_msg {
        margin-top: 5px;
        font-size: 12px;
        color: #797979;
        transform: scale(0.8) translateX(-12%);
      }
    }
  }
  .right_price {
    font-size: 16px;
    font-weight: 500;
    color: rgba(121, 121, 121, 0.651);
  }
}
//添加的信息展示
.new_msg {
  .container {
    padding: 20px 20px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left_msg {
      display: flex;
      flex-direction: column;
      font-size: 16px;
      .msg_time {
        font-size: 12px;
        transform: scale(0.75) translateX(-16%);
      }
    }
    .right_msg {
      font-size: 18px;
    }
  }
  .delete_btn {
    border-top: solid 1px #cccccc;
    display: flex;
    justify-content: flex-end;
    padding: 5px 5px 0;
  }
}
// 添加费用操作
.add_cost_box {
  border-radius: 10px;
  margin-top: 10px;
  .add_cost_btn {
    position: relative;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #448aff;
  }
  .add_cost_msg {
    padding: 20px;
    border-top: 1px solid #cccccc;
    border-bottom: 1px solid #cccccc;
    .timeBox {
      width: 100%;
      display: flex;
      justify-content: space-between;
      & .cutOff {
        margin: 0 20px;
      }
    }
  }
  .add_footer_btn {
    display: flex;
    justify-content: flex-end;
    padding: 5px;
  }
}
// 备注信息输入框
.textarea {
  width: 100%;
  min-height: 100px;
  outline: 0;
  border: 1px solid #397eff;
  -webkit-user-modify: read-write-plaintext-only;
  font-size: 14px;
  line-height: 26px;
  text-indent: 0.7rem;
}
.green {
  color: #32ae7e;
}
.orange {
  color: #d87500;
}
// 底部导航按钮
.btn {
  width: 100%;
  padding: 10px;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .totalPrice {
    width: 160px;
    display: flex;
    flex-direction: column;
  }
  & .leftBtn {
    margin-right: 10px;
    min-width: 50px;
  }
}
// panel样式重写
/deep/.mu-expansion-panel {
  border-radius: 15px;
  overflow: hidden;
  .mu-expansion-panel-header {
    padding: 10px 25px 10px 15px;
  }
  .mu-expansion-panel-content {
    padding: 0 0 10px;
  }
  .mu-icon-button {
    height: auto !important;
  }
}
// 表单样式重写
/deep/.mu-form-item {
  margin-bottom: 0;
}
//按钮样式重写
/deep/.mu-expansion-toggle-btn {
  padding: 0;
  width: auto;
  margin-right: -20px;
}
// input 字体调整
/deep/input {
  font-size: 12px;
}
</style>
