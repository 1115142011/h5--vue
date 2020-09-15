<template>
  <div class="outer_wrap">
    <!-- 第一步 -->
    <mu-form ref="first_step" :model="formMsg" class="step_form" v-show="activeStep===0">
      <div class="steper">
        <mu-stepper :active-step="activeStep">
          <mu-step>
            <mu-step-label>原租客信息</mu-step-label>
          </mu-step>
          <mu-step>
            <mu-step-label>新租客信息</mu-step-label>
          </mu-step>
        </mu-stepper>
      </div>
      <mu-form-item label="租客姓名" label-float prop="name" :rules="nameRules">
        <mu-text-field v-model="formMsg.name" prop="name"></mu-text-field>
      </mu-form-item>
      <mu-form-item label="租客电话" label-float prop="mobile" :rules="phoneNumber">
        <mu-text-field
          v-model="formMsg.mobile"
          pattern="[0-9]*"
          type="number"
          full-width
          prop="mobile"
          @blur="showBtn=true"
        ></mu-text-field>
      </mu-form-item>
      <mu-form-item label="身份证号" label-float prop="idCard" :rules="userCard">
        <mu-text-field
          v-model="formMsg.idCard"
          prop="idCard"
          pattern="[0-9]*"
          full-width
          type="number"
          @blur="showBtn=true"
        ></mu-text-field>
      </mu-form-item>
      <mu-form-item label="转租原因" label-float prop="idCard" :rules="userCard">
        <mu-text-field
          v-model="formMsg.idCard"
          prop="idCard"
          pattern="[0-9]*"
          full-width
          type="number"
          @blur="showBtn=true"
        ></mu-text-field>
      </mu-form-item>
      <div class="steperBtn">
        <mu-button color="#fdd835" textColor="#333333" @click="next">下一步</mu-button>
      </div>
    </mu-form>
    <!-- 第二步 -->
    <mu-form ref="second_step" :model="formMsg" class="step_form" v-show="activeStep !==0">
      <div class="steper">
        <mu-stepper :active-step="activeStep">
          <mu-step>
            <mu-step-label>原租客信息</mu-step-label>
          </mu-step>
          <mu-step>
            <mu-step-label>新租客信息</mu-step-label>
          </mu-step>
        </mu-stepper>
      </div>
      <mu-form-item label="新租客姓名:" label-float prop="name" :rules="nameRules">
        <mu-text-field v-model="formMsg.name" prop="name"></mu-text-field>
      </mu-form-item>
      <mu-form-item label="新租客电话:" label-float prop="mobile" :rules="phoneNumber">
        <mu-text-field
          v-model="formMsg.mobile"
          pattern="[0-9]*"
          type="number"
          full-width
          prop="mobile"
          @blur="showBtn=true"
        ></mu-text-field>
      </mu-form-item>
      <mu-form-item label="身份证号:" label-float prop="idCard" :rules="userCard">
        <mu-text-field
          v-model="formMsg.idCard"
          prop="idCard"
          pattern="[0-9]*"
          full-width
          type="number"
          @blur="showBtn=true"
        ></mu-text-field>
      </mu-form-item>
      <mu-form-item label="租客来源" label-float prop="idCard" :rules="nameRules">
        <mu-select chips v-model="formMsg.userResouce" full-width>
          <mu-option
            v-for="(item,index) in options2"
            :key="index"
            :label="item.lable"
            :value="item.value"
            ripple
          ></mu-option>
        </mu-select>
      </mu-form-item>
      <!-- 转介绍额外必填信息 -->
      <div class="attch_msg">
        <mu-form-item label="推荐人姓名:" label-float prop="endTimeRules" :rules="phoneNumber">
          <mu-text-field v-model="formMsg.other_room" full-width prop="endTimeRules"></mu-text-field>
        </mu-form-item>
        <mu-form-item label="推荐人职业:" label-float prop="endTimeRules" :rules="phoneNumber">
          <mu-text-field v-model="formMsg.other_room" full-width prop="endTimeRules"></mu-text-field>
        </mu-form-item>
        <mu-form-item label="租客租住房间:" label-float prop="endTimeRules" :rules="phoneNumber">
          <mu-text-field v-model="formMsg.other_room" full-width prop="endTimeRules"></mu-text-field>
        </mu-form-item>
        <mu-form-item label="推荐人电话:" label-float prop="endTimeRules" :rules="phoneNumber">
          <mu-text-field v-model="formMsg.other_room" full-width prop="endTimeRules"></mu-text-field>
        </mu-form-item>
        <mu-form-item label="推荐人银行卡号:" label-float prop="endTimeRules" :rules="phoneNumber">
          <mu-text-field v-model="formMsg.other_room" full-width prop="endTimeRules"></mu-text-field>
        </mu-form-item>
        <mu-form-item label="开户行信息:" label-float prop="endTimeRules" :rules="phoneNumber">
          <mu-text-field v-model="formMsg.other_room" full-width prop="endTimeRules"></mu-text-field>
        </mu-form-item>
      </div>

      <div class="steperBtn">
        <div class v-show="activeStep<=1">
          <mu-button color="#fdd835" textColor="#333333" @click="next">完成</mu-button>
          <mu-button color="#fdd835" textColor="#448AFF" flat small @click="prive">上一步</mu-button>
        </div>
        <div class="v_footerHint" v-show="activeStep>1">填写完成请前往下一步</div>
      </div>
    </mu-form>
    <mu-paper class="btn" :z-depth="4" v-show="showBtn">
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
      nameRules: [
        { validate: val => !!val, message: '必须填写用户名' },
        { validate: val => val.length >= 3, message: '用户名长度大于2' }
      ],
      phoneNumber: [
        { validate: val => !!val, message: '必须填写电话号码' },
        {
          validate: val => /^1[3456789]\d{9}$/.test(val),
          message: '请填写正确的电话号码'
        }
      ],
      userCard: [
        {
          validate: val => /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val),
          message: '身份证号码不正确'
        }
      ],
      // 租客来源参数
      options2: [
        {
          lable: '58同城',
          value: 1
        },
        {
          lable: '赶集网',
          value: 2
        },
        {
          lable: '安居客',
          value: 3
        },
        {
          lable: '蘑菇',
          value: 4
        }
      ],
      formMsg: {
        name: '',
        mobile: '',
        idCard: '',
        username: '',
        phone: ''
      },
      newUserMsg: {},
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
