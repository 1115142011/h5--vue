<template>
  <section class="box" v-loading="submitLoading">
    <mu-paper :z-depth="2" class="v_block form_box">
      <div class="title">
        <span class="big-font">整租</span>收取标准
      </div>
      <mu-form
        ref="category_form"
        :model="val"
        v-for="(val,index) in formMsg.costInfoList"
        :key="index+'f'"
      >
        <mu-form-item
          :label="val.name+'(整租)'"
          prop="fullRentRecvMode"
          @change="test(val)"
          :rules="textRules"
        >
          <div class="tags-box">
            <mu-chip
              class="chip"
              :class="{select:val.fullRentRecvMode===item.value}"
              v-for="(item,index) in tags"
              @click="changeValue(val,item)"
              :key="index+'i'"
            >{{item.label}}</mu-chip>
          </div>
        </mu-form-item>
        <mu-form-item
          label="金额"
          v-if="val.fullRentRecvMode===1"
          label-float
          prop="actualCost"
          :rules="numberRules"
        >
          <mu-text-field
            v-model="val.actualCost"
            :disabled="formDisable"
            pattern="[0-9]*"
            type="number"
            full-width
            prop="mobile"
          ></mu-text-field>
        </mu-form-item>
      </mu-form>
    </mu-paper>
    <mu-paper class="footer_bar skipRem" :z-depth="4" v-show="!resizeChange">
      <div class="left-btn">
        <mu-button color="#B3B3B3" full-width textColor="#ffffff" @click="goStep('prev')">上一步</mu-button>
      </div>
      <div class="right-btn">
        <mu-button
          color="#fdd835"
          :disabled="submitLoading"
          full-width
          textColor="#333333"
          @click="goStep('next')"
        >{{formMsg.costSubmit?'下一步':'提交信息'}}</mu-button>
      </div>
    </mu-paper>
  </section>
</template>
<script>
import { submitCostMsg } from '@/api/proprietorApi';
export default {
  data () {
    return {
      submitLoading: false,
      formMsg: {
        stepNum: 1,
        costSubmit: false,
        costInfoList: [
          {
            type: 1, // 类别/名称- 1 物业 2 垃圾 3 宽带 4 清洁 5 水费 6 电费7 气费
            name: '物业费',
            fullRentRecvMode: 1, // 缴费类型-整租 1 包干 2代缴 3 自缴 4无
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
            fullRentRecvMode: 1, // 缴费类型-整租 1 包干 2代缴 3 自缴 4无
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
            fullRentRecvMode: 1, // 缴费类型-整租 1 包干 2代缴 3 自缴 4无
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
            fullRentRecvMode: 1, // 缴费类型-整租 1 包干 2代缴 3 自缴 4无
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
            fullRentRecvMode: 1, // 缴费类型-整租 1 包干 2代缴 3 自缴 4无
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
            fullRentRecvMode: 1, // 缴费类型-整租 1 包干 2代缴 3 自缴 4无
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
            fullRentRecvMode: 1, // 缴费类型-整租 1 包干 2代缴 3 自缴 4无
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
      numberRules: [
        {
          validate: val => {
            return /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(val) && val > 0;
          },
          message: '请输入>0正数'
        }
      ],
      textRules: [
        {
          validate: val => {
            if (val === 0) return true;
            return !!val;
          },
          message: '请填写该信息'
        }
      ],
      tags: [
        {
          label: '包干',
          value: 1
        },
        {
          label: '代缴',
          value: 2
        },
        {
          label: '自缴',
          value: 3
        },
        {
          label: '无',
          value: 4
        }
      ]
    };
  },
  computed: {
    resizeChange () {
      return this.$store.state.reiseChange;
    },
    formDisable () {
      return this.formMsg.costSubmit;
    }
  },
  created () {
    this.formMsg = Object.assign(
      this.formMsg,
      JSON.parse(JSON.stringify(this.$store.state.proprietor.formParams))
    );
  },
  updated () {
    this.clearCostValidate();
  },
  methods: {
    changeValue (val, item) {
      if (this.formDisable) return;
      val.fullRentRecvMode = item.value;
      val.actualCost = '';
      // 1 包干 2代缴 3 自缴 4无
      // if (val.fullRentRecvMode === 1 || val.fullRentRecvMode === 2) {
      //   // 2代缴，4-无
      //   val.payMode = 2;
      // } else {
      //   val.payMode = 4;
      // }
    },
    // 底部按钮点击
    goStep (direction, stepNumber = 1) {
      if (direction === 'next') {
        this.costValidate().then(result => {
          if (result) {
            if (this.formMsg.costSubmit) {
              this.$store.commit('proprietor/changeRegisterStep', {
                direction,
                stepNumber
              });
            } else {
              this.submitLoading = true;
              this.formMsg.costInfoList = this.formMsg.costInfoList.map(val => {
                // 1 包干 2代缴 3 自缴 4无
                if (val.fullRentRecvMode === 1 || val.fullRentRecvMode === 2) {
                  // 2代缴，4-无
                  val.payMode = 2;
                } else {
                  val.payMode = 4;
                }
                return val;
              });
              submitCostMsg(this.formMsg).then(res => {
                this.formMsg.costSubmit = true;
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
        stepNumber = this.formMsg.rentMode === 1 ? 2 : 1;
        this.$store.commit('proprietor/changeRegisterStep', {
          direction,
          stepNumber
        });
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
.title {
  font-weight: bold;
  .big-font {
    font-size: 20px;
    margin-right: 10px;
    color: #ff8700;
  }
}
.form_box {
  padding: 15px 26px;
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
.label {
  font-size: 12px;
  color: #000000;
}
/deep/.mu-form-item {
  margin-bottom: 0;
}
</style>
