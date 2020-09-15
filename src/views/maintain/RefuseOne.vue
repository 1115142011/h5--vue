<template>
  <div class="maintain">
    <mu-appbar class="fixed" style="width: 100%;" color="#fdd835" z-depth="5" textColor="#000">
      <mu-button @click="back" icon slot="left">
        <mu-icon size="30" value="keyboard_backspace"></mu-icon>
      </mu-button>
      拒修(1/3)
    </mu-appbar>
    <div class="space"></div>
    <div class="container">
      <mu-form ref="form" :model="validateForm">
        <div class="bold ft14">租客为何拒修？</div>
        <mu-form-item prop="dutyMemo" color="#2196f3" label-float label="备注" :rules="dutyMemoRules">
          <mu-text-field v-model="validateForm.dutyMemo" color="#2196f3"></mu-text-field><br/>
        </mu-form-item>
      </mu-form>
    </div>
    <div class="bottom">
      <mu-button color="#fdd835" @click='next' textColor="#000">下一步</mu-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      validateForm: {
        dutyMemo: null
      },
      dutyMemoRules: [
        { validate: val => !!val, message: '请填写拒修原因' }
      ]
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    next () {
      let page = this
      page.$refs.form.validate().then(result => {
        let para = JSON.parse(localStorage.getItem('refuseInfo'))
        para.dutyMemo = page.validateForm.dutyMemo
        localStorage.setItem('refuseInfo', JSON.stringify(para))
        page.$router.push('/refuseTwo')
      })
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  width: 95%;
  margin: 20px auto;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 2px 2px 0px rgba(16, 16, 16, 0.3);
}

.bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 10px;
  justify-content: flex-end;
  box-shadow: 5px 5px 5px 5px rgba(16, 16, 16, 0.3);
}
</style>
