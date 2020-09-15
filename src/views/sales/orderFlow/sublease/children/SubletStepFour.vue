<template>
  <div class="outer_wrap">
    <!-- 第一步 -->
    <mu-form ref="first_step" :model="formMsg" class="step_form" v-show="activeStep===0">
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
      <mu-form-item label="房屋押金" props="assureMoney" help-text="定价850元/月">
        <mu-select v-model="formMsg.assureMoney" full-width>
          <mu-option
            v-for="(item,index) in priceOptions"
            :key="index"
            :label="item.lable"
            :value="item.vaule"
            ripple
          ></mu-option>
        </mu-select>
      </mu-form-item>
      <mu-form-item label="钥匙&门禁卡" label-float prop="keysMoney" :rules="phoneNumber">
        <mu-text-field
          v-model="formMsg.keysMoney"
          pattern="[0-9]*"
          type="number"
          full-width
          prop="keysMoney"
          @blur="showBtn=true"
        ></mu-text-field>
      </mu-form-item>
      <mu-form-item label="其他押金" label-float prop="otherMoney" :rules="userCard">
        <mu-text-field
          v-model="formMsg.otherMoney"
          prop="otherMoney"
          pattern="[0-9]*"
          full-width
          type="number"
          @blur="showBtn=true"
        ></mu-text-field>
      </mu-form-item>
      <mu-form-item
        label="房屋月租金"
        label-float
        prop="rentMoney"
        :rules="userCard"
        help-text="定价850元/月"
      >
        <mu-text-field
          v-model="formMsg.rentMoney"
          prop="rentMoney"
          pattern="[0-9]*"
          full-width
          type="number"
          @blur="showBtn=true"
        ></mu-text-field>
      </mu-form-item>
      <div class="steperBtn">
        <mu-button color="#fdd835" textColor="#333333" @click="next">下一步</mu-button>
      </div>
      <mu-paper class="btn" :z-depth="4" v-show="showBtn">
        <mu-button
          color="#fdd835"
          textColor="#333333"
          :disabled="activeStep<=1"
          @click="changeStep('next')"
        >下一步</mu-button>
      </mu-paper>
    </mu-form>
    <!-- 第二部 -->
    <mu-form ref="second_step" :model="formMsg" class="step_form" v-show="activeStep !==0">
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
      <mu-form-item label="物业费" props="property_fee" label-float help-text="包干850元/月">
        <mu-text-field
          v-model="formMsg.otherMoney"
          prop="otherMoney"
          pattern="[0-9]*"
          full-width
          type="number"
        ></mu-text-field>
      </mu-form-item>
      <mu-form-item
        label="垃圾亲运费"
        label-float
        prop="rubbishMoney"
        :rules="phoneNumber"
        help-text="包干850元/月"
      >
        <mu-text-field
          v-model="formMsg.rubbishMoney"
          pattern="[0-9]*"
          type="number"
          full-width
          prop="keysMoney"
          @blur="showBtn=true"
        ></mu-text-field>
      </mu-form-item>
      <mu-form-item label="宽带费" label-float prop="otherMoney" :rules="userCard" help-text="代缴">
        <mu-text-field
          v-model="formMsg.otherMoney"
          prop="otherMoney"
          pattern="[0-9]*"
          full-width
          type="number"
          @blur="showBtn=true"
        ></mu-text-field>
      </mu-form-item>
      <mu-form-item label="清洁费" label-float prop="rentMoney" :rules="userCard" help-text="租客自缴">
        <mu-text-field
          v-model="formMsg.rentMoney"
          prop="rentMoney"
          pattern="[0-9]*"
          full-width
          type="number"
          @blur="showBtn=true"
        ></mu-text-field>
      </mu-form-item>
      <mu-form-item label="水费" label-float prop="rentMoney" :rules="userCard" help-text="定价850元/月">
        <mu-text-field
          v-model="formMsg.rentMoney"
          prop="rentMoney"
          pattern="[0-9]*"
          full-width
          type="number"
          @blur="showBtn=true"
        ></mu-text-field>
      </mu-form-item>
      <mu-form-item label="电费" label-float prop="rentMoney" :rules="userCard" help-text="定价850元/月">
        <mu-text-field
          v-model="formMsg.rentMoney"
          prop="rentMoney"
          pattern="[0-9]*"
          full-width
          type="number"
          @blur="showBtn=true"
        ></mu-text-field>
      </mu-form-item>
      <mu-form-item label="燃气费" label-float prop="rentMoney" :rules="userCard" help-text="租客自缴">
        <mu-text-field
          v-model="formMsg.rentMoney"
          prop="rentMoney"
          pattern="[0-9]*"
          full-width
          type="number"
          @blur="showBtn=true"
        ></mu-text-field>
      </mu-form-item>
      <div class="steperBtn">
        <div class v-show="activeStep<=1">
          <mu-button color="#fdd835" textColor="#333333" @click="next">完成</mu-button>
          <mu-button color="#fdd835" textColor="#448AFF" flat small @click="prive">上一步</mu-button>
        </div>
        <div class="v_footerHint" v-show="activeStep>1">填写完成请前往确认账单</div>
      </div>
    </mu-form>
    <mu-paper class="btn" :z-depth="4" v-show="showBtn">
      <mu-button color="#fdd835" class="leftBtn" textColor="#333333" @click="changeStep('prev')">上一步</mu-button>
      <mu-button
        color="#fdd835"
        textColor="#333333"
        :disabled="activeStep<=1"
        @click="changeStep('next')"
      >下一步</mu-button>
    </mu-paper>
  </div>
</template>
<script>
export default {
  data () {
    return {
      activeStep: 0,
      showBtn: true,
      usernameRules: [
        { validate: val => !!val, message: '必须填写用户名' },
        { validate: val => val.length >= 3, message: '用户名长度大于2' }
      ],
      phoneNumber: [
        { validate: val => !!val, message: '请填写正确的金额' },
        { validate: val => /\d/.test(val), message: '请填写正确的金额' }
      ],
      userCard: [
        { validate: val => /\d/.test(val), message: '亲填写正确的金额' }
      ],
      formMsg: {
        username: '',
        phone: '',
        rentMoney: '', // 房屋月租金
        otherMoney: '', // 其他押金
        keysMoney: '', // 钥匙门禁
        assureMoney: '', // 押金
        property_fee: '', // 物业费
        rubbishMoney: '' // 垃圾清运费
      },
      priceOptions: [
        // 押金
        {
          lable: '1个月',
          value: 1
        },
        {
          lable: '6个月',
          value: 2
        },
        {
          lable: '12个月',
          value: 3
        },
        {
          lable: '24个月',
          value: 4
        }
      ]
    };
  },
  methods: {
    submit () {
      this.$refs.first_step.validate().then(result => {
        console.log('form valid: ', result);
      });
    },
    // 按钮点击
    changeStep (direction) {
      if (direction === 'next') {
        this.$emit('addStep');
      } else {
        this.$emit('minusStep');
      }
    },
    // 步进条--下一步
    next () {
      this.activeStep += 1;
    },
    // 步进条--上一步
    prive () {
      this.activeStep -= 1;
    }
  }
};
</script>
<style lang="less" scoped>
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
  /deep/.mu-form-item {
    margin-bottom: 0;
  }
}
.btn {
  width: 100%;
  padding: 10px;
  text-align: right;
  left: 0;
  position: fixed;
  bottom: 0;
  & .leftBtn {
    margin-right: 10px;
  }
}
</style>
