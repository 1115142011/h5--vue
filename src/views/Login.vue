<template>
  <div class="Container maintain">
    <!-- 顶部logo -->
    <div class="topCanvas">
      <img class="topLogo" :src="imgUrl" />
    </div>

    <!-- 中间表单 -->
    <mu-container class="middlePart">
      <!-- 账号 -->
      <mu-form ref="form" :model="validateForm" class="loginForm">
        <!-- 系统选择 -->
        <mu-form-item prop="type" label="类型" :label-position="'left'" :rules="typeRules">
          <mu-radio
            v-for="(item,index) in typeOptions"
            :key="index+'t'"
            :value="item.type"
            v-model="validateForm.type"
            :label="item.name"
          ></mu-radio>
        </mu-form-item>
        <mu-form-item prop="account" label-float label="账号" :rules="accountRules">
          <mu-text-field
            v-model="validateForm.account"
            class="loginInputContainer"
            color="rgb(33, 150, 243)"
          ></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="secret" label-float label="密码" :rules="secretRules">
          <mu-text-field
            v-model="validateForm.secret"
            type="password"
            class="loginInputContainer"
            color="rgb(33, 150, 243)"
          ></mu-text-field>
        </mu-form-item>
        <mu-form-item class="submitCon">
          <mu-button color="#fdd835" @click="submit" textColor="#000">登录</mu-button>
        </mu-form-item>
      </mu-form>
    </mu-container>

    <!-- 底部 -->
    <div v-show="!resizeChange" class="bottomPart">
      <img :src="bottomLogo" />
    </div>
  </div>
</template>

<script>
import imgUrl from '@/assets/images/login.gif';
import bottomLogo from '@/assets/images/bottomLogo.svg';
import { salesLogin } from '@/api/globalApi';
export default {
  data () {
    return {
      imgUrl,
      bottomLogo,
      time: null, // 倒计时
      currentTime: 60,
      openSimple: false,
      validateForm: {
        account: '',
        secret: '',
        type: undefined
      },
      typeOptions: [
        {
          name: '销售',
          type: 1
        },
        {
          name: '维修',
          type: 3
        },
        {
          name: '保洁',
          type: 4
        }
      ],
      accountRules: [{ validate: val => !!val, message: '必须填写账号' }],
      secretRules: [{ validate: val => !!val, message: '必须填写密码' }],
      typeRules: [{ validate: val => !!val, message: '请选择账号类型' }]
    };
  },
  computed: {
    resizeChange () {
      return this.$store.state.reiseChange;
    }
  },
  // 登录过后就跳转首页
  beforeCreate: function () {
    // 如果有缓存 表示已经登录过 直接跳转首页
    if (localStorage.getItem('currentUserToken')) {
      this.$router.push('/index');
      this.$store.commit('sales/setFooterNavStatus', 'serve');
    }
  },
  methods: {
    submit () {
      this.$refs.form.validate().then(result => {
        // 表单验证都通过在去请求
        if (result) {
          salesLogin(this.validateForm).then(res => {
            if (res.code === 200) {
              let { token, refreshToken } = res.data;
              localStorage.setItem('currentUserToken', token);
              localStorage.setItem('refreshToken', refreshToken);
              localStorage.setItem('personId', res.data.userId);
              // 登录成功 跳转到首页
              if (this.validateForm.type === 1) {
                this.$store.commit('sales/setFooterNavStatus', 'performance');
              } else {
                this.$store.commit('sales/setFooterNavStatus', 'serve');
              }
              localStorage.setItem('loginType', this.validateForm.type);
              this.$router.push('/index');
            }
          });
        }
      });
    }
  }
};
</script>

<style lang='less' scoped>
// 重写样式 form-item label的颜色
.mu-form-item {
  margin-bottom: 5px;
  padding-bottom: 0;
}

// form-item focus时候 label的颜色
.mu-form-item__focus {
  color: rgb(33, 150, 243) !important;
}

// checkbox右边距
.mu-checkbox {
  margin-right: 5px !important;
}

// button边距重写
.mu-form-item .mu-button {
  margin: 6px 0;
  margin-bottom: -20px;
}

.loginForm {
  width: 90%;
  margin: 0 auto;
}

/***重写结束***/

/**页面样式 start**/

.Container {
  display: flex;
  width: 100%;
  height: 100%;
  background: #fff;
  flex-direction: column; // 头部
  .topCanvas {
    width: 100%;
    height: 260px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fdd835;
    .topLogo {
      width: 200px;
    }
  } // form表单
  .middlePart {
    height: 330px;
    padding: 15px;
    width: 100%;
    background: #fff;
    margin-top: -15px;
    border-radius: 5%;
    .formWaper {
      width: 100%;
      height: 100%;
      padding: 5px 15px;
      .phoneContainer {
        position: relative; // 获取验证码按钮
        .codeBtn {
          color: #f57f17;
          font-size: 14px;
          position: absolute;
          right: 20px;
          top: 30px;
        }
      }
      .loginInputContainer {
        width: 100%;
      }
      .agreementContainer {
        min-height: 0; // 为了重写mu的样式
        .agreement {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
      }
    }
  } // 底部
  .bottomPart {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
}
</style>
