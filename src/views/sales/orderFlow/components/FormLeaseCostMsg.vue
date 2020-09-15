<template>
  <div
    class="outer_wrap"
    v-loading="loading"
    data-mu-loading-overlay-color="transparent"
    data-mu-loading-text="计算中..."
  >
    <div v-if="responseMsg">
      <lease-title></lease-title>
      <mu-paper class="v_block" :z-depth="1">
        <mu-form ref="step_form" :model="formMsg" class="step_form">
          <div class="steper">
            <mu-stepper :active-step="activeStep">
              <mu-step>
                <mu-step-label>押金&租金</mu-step-label>
              </mu-step>
              <mu-step>
                <mu-step-label>生活费用</mu-step-label>
              </mu-step>
            </mu-stepper>
          </div>
          <!-- 第一步 -->
          <section v-show="activeStep===0">
            <mu-form-item
              label="房屋押金"
              label-float
              prop="rentDeposit"
              :rules="deposit"
              :help-text="`最低${minDeposit}元`"
            >
              <mu-text-field
                v-model="formMsg.rentDeposit"
                full-width
                @input="inputVal($event,'rentDeposit')"
              ></mu-text-field>
            </mu-form-item>
            <!-- <mu-select v-model="formMsg.depositPayMode" full-width>
                <mu-option
                  v-for="(item,index) in priceOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  ripple
                ></mu-option>
            </mu-select>-->
            <!-- </mu-form-item> -->
            <mu-form-item
              label="钥匙&门禁卡"
              label-float
              prop="cardDeposit"
              :rules="minCard"
              :help-text="`最低${responseMsg.cardDeposit}元`"
            >
              <mu-text-field
                v-model="formMsg.cardDeposit"
                full-width
                @input="inputVal($event,'cardDeposit')"
              ></mu-text-field>
            </mu-form-item>
            <mu-form-item
              label="其他押金"
              label-float
              prop="otherDeposit"
              :help-text="`最低${responseMsg.otherDeposit}元`"
            >
              <mu-text-field
                v-model="formMsg.otherDeposit"
                full-width
                @input="inputVal($event,'otherDeposit')"
              ></mu-text-field>
            </mu-form-item>
            <mu-form-item
              label="房屋月租金"
              label-float
              prop="rent"
              :rules="minRent"
              :help-text="`定价${responseMsg.rent}元/月`"
            >
              <mu-text-field v-model="formMsg.rent" @input="inputVal($event,'rent')" full-width></mu-text-field>
            </mu-form-item>
            <div class="steperBtn">
              <mu-button color="#fdd835" textColor="#333333" @click="next">下一步</mu-button>
            </div>
          </section>
          <!-- 第二步 -->
          <section v-if="activeStep >0">
            <mu-form-item
              :label="item.name"
              :help-text="item.explain"
              v-for="(item,index) in costInfoList"
              :key="index+'item'"
            >
              <mu-text-field v-model="item.roomCost" full-width disabled></mu-text-field>
            </mu-form-item>
            <div class="steperBtn">
              <div class v-show="activeStep<=1">
                <mu-button color="#fdd835" textColor="#333333" @click="finsh">完成</mu-button>
                <mu-button color="#fdd835" textColor="#448AFF" flat small @click="prive">上一步</mu-button>
              </div>
              <div class="v_footerHint" v-show="activeStep>1">填写完成,请前往下一步</div>
            </div>
          </section>
        </mu-form>
      </mu-paper>

      <mu-paper class="form_footer_btn" :z-depth="4" v-show="!resizeChange">
        <mu-button
          color="#fdd835"
          class="leftBtn"
          textColor="#333333"
          @click="changeStep('prev')"
        >上一步</mu-button>
        <mu-button
          color="#fdd835"
          textColor="#333333"
          :disabled="activeStep<=1"
          @click="changeStep('next')"
        >下一步</mu-button>
      </mu-paper>
    </div>
  </div>
</template>
<script>
import { getLeaseCost, submitInitialLease } from "@/api/salesApi";
import LeaseTitle from "./LeaseTitle";
export default {
  components: { LeaseTitle },
  data() {
    return {
      onClick: false,
      activeStep: 0,
      minRent: [
        {
          validate: val => {
            return val >= this.minMoney;
          },
          message: `租金收取不得低于最小值`
        }
      ],
      deposit: [
        {
          validate: val => {
            return val >= this.minDeposit;
          },
          message: `押金收取不得小于最小值`
        }
      ],
      minCard: [
        {
          validate: val => {
            return val >= this.responseMsg.cardDeposit;
          },
          message: `钥匙&卡押金不能低于最小值`
        }
      ],
      minOther: [
        {
          validate: val => {
            return val >= this.responseMsg.otherDeposit;
          },
          message: `其它押金不能低于最小值`
        }
      ],
      loading: false,
      responseMsg: undefined, // 请求回来的数据
      oldLeaseCost: undefined, // 旧的账单
      costInfoList: null, //

      formMsg: {
        depositPayMode: "1", // 押金默认1个月
        rentDeposit: "", // 押金
        cardDeposit: "", // 钥匙/卡押金
        otherDeposit: "", // 其它押金
        rent: "" // 租金
      },
      priceOptions: [
        // 押金
        {
          label: "1个月",
          value: "1"
        }
      ]
    };
  },
  computed: {
    resizeChange() {
      return this.$store.state.reiseChange;
    },
    minDeposit() {
      if (!this.responseMsg) return 0;
      if (!this.oldLeaseCost.rentDeposit) return this.responseMsg.rentDeposit;
      if (this.responseMsg.rentDeposit > this.oldLeaseCost.rentDeposit) {
        return this.responseMsg.rentDeposit;
      } else {
        return this.oldLeaseCost.rentDeposit;
      }
    },
    minMoney() {
      const tempRent = this.$store.state.sales.leaseFormData
        .leaseBenefitSpecialVO;
      return tempRent.benefitPrice || this.responseMsg.rent;
    }
  },
  created() {
    this.formMsg = Object.assign(
      this.formMsg,
      JSON.parse(
        JSON.stringify(this.$store.state.sales.leaseFormData.leaseCost)
      )
    );
    this.getRentCost();
  },
  methods: {
    // 获取房源基本信息
    getRentCost() {
      this.loading = true;
      let obj = {
        roomId: this.$store.state.sales.leaseFormData.roomId,
        leaseId: this.$store.state.sales.leaseFormData.leaseId || ""
      };
      getLeaseCost(obj).then(res => {
        this.loading = false;
        this.costInfoList = this.setListData(res.data.leaseCostDTO.costInfoMap);
        this.responseMsg = res.data.leaseCostDTO;
        this.oldLeaseCost = res.data.preLeaseCostDTO;
        if (!this.formMsg.costInfoList) {
          this.initFormMsg();
        }
      });
    },
    // 生成租约
    generateLeaseid() {
      if (this.onClick) return;
      this.onClick = true;
      this.loading = true;
      let customer = this.$store.state.sales.customer;
      let param = this.$store.state.sales.leaseFormData;
      param.custName = customer.name;
      param.custIdCard = customer.idCard;
      param.custMobile = customer.mobile;
      param.leaseCost.payMode = Number(param.payMode);
      submitInitialLease(param).then(res => {
        this.loading = false;
        this.onClick = false;
        this.$emit("getNewLeaseId", res.data.leaseId);
        this.$emit("addStep");
      });
    },
    // 初始化表单信息
    initFormMsg() {
      this.formMsg.rentDeposit = this.rentDeposit; // 押金
      this.formMsg.cardDeposit = this.responseMsg.cardDeposit; // 钥匙/卡押金
      this.formMsg.otherDeposit = this.responseMsg.otherDeposit; // 其它押金
      const tempData = this.$store.state.sales.leaseFormData
        .leaseBenefitSpecialVO; // 特价活动
      this.formMsg.rent = tempData.benefitPrice || this.responseMsg.rent; // 租金
    },
    // 按钮点击
    changeStep(direction) {
      if (direction === "next") {
        this.generateLeaseid();
      } else {
        this.$emit("minusStep");
      }
    },
    // 设置 费用类型值
    setListData(obj) {
      if (typeof obj !== "object") return [];
      let tempArr = [];
      for (let key in obj) {
        switch (obj[key].recvMode) {
          case 1:
            obj[key].explain = `包干${obj[key].roomCost}元/月`;
            break;
          case 2:
            obj[key].explain = `租客自缴`;
            break;
          case 3:
            obj[key].explain = `公司代缴`;
            break;
          default:
            break;
        }
        tempArr.push(obj[key]);
      }
      return tempArr;
    },
    // 输入时替换非数字字符
    inputVal(val, key) {
      this.formMsg[key] = val.replace(/\D/gi, "");
    },
    // 填写完成
    finsh() {
      this.activeStep += 1;
      this.formMsg.costInfoList = this.costInfoList;
      let obj = {
        leaseCost: this.formMsg
      };
      this.$store.commit("sales/writeInFormData", obj);
    },
    // 步进条--下一步
    next() {
      this.$refs.step_form.validate().then(result => {
        if (result) {
          this.activeStep += 1;
        }
      });
    },
    // 步进条--上一步
    prive() {
      this.activeStep -= 1;
    }
  },
  watch: {
    minDeposit: function(newVal, oldVal) {
      this.formMsg.rentDeposit = newVal;
    }
  }
};
</script>
<style lang="less" scoped>
.outer_wrap {
  position: relative;
  min-height: 260px;
  .step_form {
    padding: 20px 20px 50px;
    .steper {
      /deep/.mu-step-label {
        height: auto;
      }
    }
    .steperBtn {
      margin-top: 20px;
    }
  }
  .v_footerHint {
    color: #448aff;
  }
}
</style>
