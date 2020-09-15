<template>
  <section class="box" v-loading="submitLoading">
    <mu-paper :z-depth="2" class="v_block form_box">
      <div class="them-title title">
        <div class="left-text">
          <span class="big-font">缴纳</span>支出标准
        </div>
        <mu-button flat small @click="skipStep('next')" v-if="!formDisable" color="primary">稍后完善</mu-button>
      </div>
      <mu-form
        ref="category_form"
        :model="val"
        v-for="(val,index) in formMsg.costInfoList"
        :key="index+'f'"
      >
        <mu-form-item :label="val.name" prop="payMode" :rules="textRules">
          <div class="tags-box">
             <!-- @click="changePayMode(val,item)" -->
            <mu-chip
              class="chip"
              :class="{select:val.payMode===item.value}"
              v-for="(item,index) in tags"
              :key="index+'i'"
            >{{item.label}}</mu-chip>
          </div>
        </mu-form-item>
        <mu-form-item
          label="单价/月"
          class="item"
          v-if="val.payMode==2"
          prop="price"
          label-float
          :rules="numberRules"
        >
          <mu-text-field :disabled="formDisable" v-model="val.price" pattern="[0-9]*" type="number"></mu-text-field>
        </mu-form-item>
        <div class="isCard-box"  v-if="val.type>=5">
          <mu-form-item prop="cardType" :rules="textRules">
            <div class="tags-box">
              <mu-chip
                class="chip"
                :class="{select:val.cardType===item.value}"
                v-for="(item,index) in isCard"
                @click="cardTypeChange(val,item)"
                :key="index+'i'"
              >{{item.label}}</mu-chip>
            </div>
          </mu-form-item>
          <mu-form-item
            label="卡号"
            label-float
            prop="cardNo"
            :rules="numberRules"
            v-if="val.cardType===1"
          >
            <mu-text-field :disabled="formDisable" v-model="val.cardNo" pattern="[0-9]*" type="number" full-width></mu-text-field>
          </mu-form-item>
        </div>
        <mu-form-item
          label="当前读数"
          class="item"
          v-if="val.type>=5&&val.cardType === 0"
          prop="latestMeterNum"
          label-float
          :rules="numberRules"
        >
          <mu-text-field :disabled="formDisable" v-model="val.latestMeterNum" pattern="[0-9]*" type="number"></mu-text-field>
        </mu-form-item>
        <mu-form-item label="截止时间" prop="expiredDate" label-float :rules="textRules">
          <mu-date-input
            v-model="val.expiredDate"
            :disabled="formDisable"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            action-icon="date_range"
            no-display
            full-width
          ></mu-date-input>
        </mu-form-item>
      </mu-form>
    </mu-paper>
    <mu-paper class="footer_bar skipRem" :z-depth="4" v-show="!resizeChange">
      <div class="left-btn" v-if="edit<5">
        <mu-button color="#B3B3B3" full-width textColor="#ffffff" @click="goStep('prev')">上一步</mu-button>
      </div>
      <div class="right-btn">
        <mu-button
          color="#fdd835"
          :disabled="submitLoading"
          full-width
          textColor="#333333"
          @click="goStep('next')"
        >{{formMsg.paySubmit?'下一步':'提交信息'}}</mu-button>
      </div>
    </mu-paper>
  </section>
</template>
<script>
import { submitPayMsg, queryHouseCost } from '@/api/proprietorApi';
export default {
  data () {
    return {
      submitLoading: false,
      edit: undefined,
      formMsg: {
        paySubmit: false,
        costInfoList: [
          {
            type: 1, // 类别/名称- 1 物业 2 垃圾 3 宽带 4 清洁 5 水费 6 电费7 气费
            name: '物业费',
            fullRentRecvMode: '', // 缴费类型-整租 1 包干 2代缴 3 自缴 4无
            actualCost: '', // 整租金额
            recvMode: '', // 缴费类型-分租
            roomCost: '', // 分租金额
            price: '', // 单价
            expiredDate: undefined, // 截止日期
            payMode: '' // 2代缴，4-无
          },
          {
            type: 2, // 类别/名称- 1 物业 2 垃圾 3 宽带 4 清洁 5 水费 6 电费7 气费
            name: '垃圾费',
            fullRentRecvMode: '', // 缴费类型-整租 1 包干 2代缴 3 自缴 4无
            actualCost: '', // 整租金额
            recvMode: '', // 缴费类型-分租
            roomCost: '', // 分租金额
            price: '', // 单价
            expiredDate: undefined, // 截止日期
            payMode: '' // 2代缴，4-无
          },
          {
            type: 3, // 类别/名称- 1 物业 2 垃圾 3 宽带 4 清洁 5 水费 6 电费7 气费
            name: '宽带费',
            fullRentRecvMode: '', // 缴费类型-整租 1 包干 2代缴 3 自缴 4无
            actualCost: '', // 整租金额
            recvMode: '', // 缴费类型-分租
            roomCost: '', // 分租金额
            price: '', // 单价
            expiredDate: undefined, // 截止日期
            payMode: '' // 2代缴，4-无
          },
          {
            type: 4, // 类别/名称- 1 物业 2 垃圾 3 宽带 4 清洁 5 水费 6 电费7 气费
            name: '清洁费',
            fullRentRecvMode: '', // 缴费类型-整租 1 包干 2代缴 3 自缴 4无
            actualCost: '', // 整租金额
            recvMode: '', // 缴费类型-分租
            roomCost: '', // 分租金额
            price: '', // 单价
            expiredDate: undefined, // 截止日期
            payMode: '' // 2代缴，4-无
          },
          {
            type: 5, // 类别/名称- 1 物业 2 垃圾 3 宽带 4 清洁 5 水费 6 电费7 气费
            name: '水费',
            fullRentRecvMode: '', // 缴费类型-整租 1 包干 2代缴 3 自缴 4无
            actualCost: '', // 整租金额
            recvMode: '', // 缴费类型-分租
            roomCost: '', // 分租金额
            price: '', // 单价
            expiredDate: undefined, // 截止日期
            payMode: '', // 2代缴，4-无
            cardType: 1, // 是否有卡 0 无 1 有
            latestMeterNum: '', // 当前读数
            cardNo: '' // 卡编号
          },
          {
            type: 6, // 类别/名称- 1 物业 2 垃圾 3 宽带 4 清洁 5 水费 6 电费7 气费
            name: '电费',
            fullRentRecvMode: '', // 缴费类型-整租 1 包干 2代缴 3 自缴 4无
            actualCost: '', // 整租金额
            recvMode: '', // 缴费类型-分租
            roomCost: '', // 分租金额
            price: '', // 单价
            expiredDate: undefined, // 截止日期
            payMode: '', // 2代缴，4-无
            cardType: 1, // 是否有卡 0 无 1 有
            latestMeterNum: '', // 当前读数
            cardNo: '' // 卡编号
          },
          {
            type: 7, // 类别/名称- 1 物业 2 垃圾 3 宽带 4 清洁 5 水费 6 电费7 气费 8
            name: '气费',
            fullRentRecvMode: '', // 缴费类型-整租 1 包干 2代缴 3 自缴 4无
            actualCost: '', // 整租金额
            recvMode: '', // 缴费类型-分租
            roomCost: '', // 分租金额
            price: '', // 单价
            expiredDate: undefined, // 截止日期
            payMode: '', // 2代缴，4-无
            cardType: 1, // 是否有卡 0 无 1 有
            latestMeterNum: '', // 当前读数
            cardNo: '' // 卡编号
          }
        ]
      },
      textRules: [
        {
          validate: val => {
            if (val === 0) return true;
            return !!val;
          },
          message: '请填写该信息'
        }
      ],
      numberRules: [
        {
          validate: val => {
            return /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(val);
          },
          message: '请输入>0正数'
        }
      ],
      tags: [
        {
          label: '代缴',
          value: 2
        },
        {
          label: '不代缴',
          value: 4
        }
      ],
      isCard: [
        {
          label: '有卡',
          value: 1
        },
        {
          label: '无卡',
          value: 0
        }
      ]
    };
  },
  created () {
    this.formMsg = Object.assign(
      this.formMsg,
      JSON.parse(JSON.stringify(this.$store.state.proprietor.formParams))
    );
    this.formMsg.stepNum = 2;
    this.edit = Number(this.$route.query.edit) || 0;
    if (this.edit === 5) {
      this.queryEditBeforeMsg();
    }
  },
  updated () {
    this.clearCostValidate();
  },
  computed: {
    resizeChange () {
      return this.$store.state.reiseChange;
    },
    formDisable () {
      return this.formMsg.paySubmit;
    }
  },
  methods: {
    // 底部按钮点击
    goStep (direction, stepNumber = 1) {
      if (direction === 'next') {
        this.costValidate().then(result => {
          if (result) {
            if (this.formMsg.paySubmit) {
              this.$store.commit('proprietor/changeRegisterStep', {
                direction,
                stepNumber
              });
            } else {
              this.submitLoading = true;
              submitPayMsg(this.formMsg).then(res => {
                this.formMsg.paySubmit = true;
                this.submitLoading = false;
                this.formMsg.houseId = res.data.houseId;
                this.$store.commit('proprietor/writeFormParam', this.formMsg);
                this.$store.commit('proprietor/changeRegisterStep', {
                  direction,
                  stepNumber
                });
              });
            }
          } else {
            this.$toast.error('信息填写不完整！请检查必填项');
          }
        });
      } else {
        this.$store.commit('proprietor/changeRegisterStep', {
          direction,
          stepNumber
        });
      }
    },
    // 跳过当前信息验证
    skipStep () {
      this.$store.commit('proprietor/changeRegisterStep', {
        direction: 'next',
        stepNumber: 1
      });
    },
    // 编辑时查询编辑前的信息
    queryEditBeforeMsg () {
      queryHouseCost(this.formMsg.houseId).then(({ data }) => {
        this.formMsg.costInfoList = this.formMsg.costInfoList.map(val => {
          data.forEach(item => {
            if (val.type === item.type) {
              this.changeValue(val, item);
            }
          });
          return val;
        });
      });
    },
    // 缴费方式改变
    changePayMode (val, item) {
      if (this.formDisable) return;
      val.payMode = item.value;
      if (val.payMode === 4) {
        val.price = undefined;
      }
    },
    // 有无卡状态改变
    cardTypeChange (val, item) {
      if (this.formDisable) return;
      val.cardType = item.value;
      if (val.cardType === 0) {
        val.cardNo = undefined;
      } else {
        val.latestMeterNum = undefined;
      }
    },
    changeValue (val, item) {
      // 1 包干 2代缴 3 自缴 4无
      val.fullRentRecvMode = item.fullRentRecvMode;
      if (item.fullRentRecvMode === 1 || item.fullRentRecvMode === 2) {
        // 2代缴，4-无
        val.payMode = 2;
      } else {
        val.payMode = 4;
      }
    },
    // 清除费用信息 表单验证
    async clearCostValidate () {
      await this.$refs.category_form.forEach(item => {
        item.clear();
      });
    },
    // 房间信息表单验证
    async costValidate () {
      let tempArry = [];
      for (let i = 0; i < this.$refs.category_form.length; i++) {
        await this.$refs.category_form[i].validate().then(result => {
          tempArry.push(result);
        });
      }
      return tempArry.indexOf(false) === -1;
    }
  }
};
</script>
<style lang="less" scoped>
.box {
  margin-bottom: 20px;
}
.them-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px 0 0;
  .left-text {
    font-weight: bold;
    font-size: 14px;
  }
  .big-font {
    font-size: 20px;
    margin-right: 10px;
    color: #c6a700;
  }
}
.form_box {
  padding: 15px 26px;
}
.item-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .item {
    flex: 1;
    margin-right: 10px;
  }
}
.tags-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .chip {
    margin-right: 5px;
    margin-top: 5px;
  }
  .select {
    background: #448aff;
    color: #ffffff;
  }
}
.line-form-group {
  .left-box {
    flex: 5;
  }
  .right-box {
    display: flex;
    align-items: center;
    flex: 4;
    .explanation {
      height: 34px;
      width: 80px;
      border-bottom: solid 1px #0000001f;
    }
  }
  .button {
    flex: 1;
    background: #d2d2d2;
    color: #ffffff;
    padding: 5px 8px;
    margin-left: 5px;
    border-radius: 12px;
  }
}
.label {
  font-size: 12px;
  color: #000000;
}
/deep/.mu-form-item {
  margin-bottom: 0;
}
</style>
