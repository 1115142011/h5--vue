<template>
  <mu-form ref="first_step" :model="formMsg" class="step_form">
    <div class="title" ref="test">填写退租信息</div>
    <mu-form-item label="退租时间" label-float prop="endTime" :rules="nameRules">
      <mu-date-input
        v-model="formMsg.endTime"
        no-display
        value-format="YYYY-MM-DD"
        prop="endTime"
        action-icon="date_range"
        full-width
      ></mu-date-input>
    </mu-form-item>
    <mu-form-item label="退租类型">
      <mu-select chips v-model="formMsg.quiteType" full-width>
        <mu-option
          v-for="(item,index) in typeOptions"
          :key="index"
          :label="item.label"
          :value="item.value"
          ripple
        ></mu-option>
      </mu-select>
    </mu-form-item>
    <mu-form-item label="退款银行卡" label-float prop="bankCard" :rules="bankCard">
      <mu-text-field
        v-model="formMsg.bankCard"
        @input="bankCardTest($event)"
        full-width
        prop="bankCard"
        @blur="showBtn=true"
      ></mu-text-field>
    </mu-form-item>
    <mu-form-item label="开户行" label-float prop="bankName" :rules="nameRules">
      <mu-text-field v-model="formMsg.bankName" full-width @blur="showBtn=true"></mu-text-field>
    </mu-form-item>
    <mu-form-item label="户名" label-float prop="name" :rules="nameRules">
      <mu-text-field v-model="formMsg.name" full-width @blur="showBtn=true"></mu-text-field>
    </mu-form-item>
    <mu-paper class="btn" :z-depth="4" v-show="showBtn">
      <mu-button flat small textColor="#448AFF" @click="changeStep('prev')">上一步</mu-button>
      <mu-button color="#fdd835" textColor="#333333" @click="changeStep('next')">下一步</mu-button>
    </mu-paper>
  </mu-form>
</template>
<script>
export default {
  data () {
    return {
      showBtn: true,
      // 退租类型参数
      typeOptions: [
        {
          label: '结算中心',
          value: 0
        },
        {
          label: '蘑菇',
          value: 1
        }
      ],
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
      bankCard: [
        {
          validate: val => /^\d{16}|\d{19}$/.test(val),
          message: '请填写正确的银行卡卡号'
        }
      ],
      formMsg: {
        name: '',
        mobile: '',
        bankCard: '',
        bankName: '',
        endTime: undefined,
        quiteType: 0
      }
    };
  },
  created () {
    this.roomId = this.$store.state.sales.roomParams.room_id;
  },
  methods: {
    submit () {
      this.$refs.first_step.validate().then(result => {
        if (result) {
          this.leaseReserve();
        }
      });
    },
    // 银行卡号处理
    bankCardTest (value) {
      if (/\S{5}/.test(value)) {
        this.formMsg.bankCard = value
          .replace(/\s/g, '')
          .replace(/(.{4})/g, '$1 ');
      }
    },
    // 按钮点击
    changeStep (direction) {
      if (direction === 'next') {
        //   console.log('11')
        //   this.$refs.first_step.validate().then((result) => {
        //     if (result) {
        //       console.log('222')

        //       this.leaseReserve()
        //     }
        //   })
        this.$emit('addStep');
      } else {
        this.$emit('minusStep');
      }
    },
    // 请求验证
    leaseReserve () {
      //   let param = {
      //     roomId: this.roomId,
      //     customer: this.formMsg
      //   }
      console.log('333');

      //   RoomReserveOne(param).then(res => {
      //     console.log(res.data)
      //   })
    }
  }
};
</script>
<style lang="less" scoped>
.step_form {
  padding: 20px 20px 50px;
  .title {
    font-size: 14px;
    font-weight: 600;
  }
  .btn {
    width: 100%;
    padding: 10px;
    text-align: right;
    left: 0;
    position: fixed;
    bottom: 0;
  }
  /deep/.mu-form-item {
    margin-bottom: 0;
  }
}
</style>
