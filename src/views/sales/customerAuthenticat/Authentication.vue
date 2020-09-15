<template>
  <section
    class="v_page"
    v-loading="codeLoading"
    data-mu-loading-overlay-color="transparent"
    data-mu-loading-text="请求中..."
  >
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000">
      <mu-button icon slot="left" @click="goBack">
        <mu-icon value="apps"></mu-icon>
      </mu-button>租客认证
    </mu-appbar>
    <div class="v_mainContainer" :class="{isBig:resizeChange}">
      <mu-paper class="v_block" :z-depth="1">
        <mu-form ref="userForm" :model="formMsg" class="userCard">
          <div class="title" ref="test">请输证件号码</div>
          <mu-form-item label="证件类型" prop="certType" :rules="messageRules">
            <mu-select v-model="formMsg.certType" full-width>
              <mu-option
                v-for="(item,index) in selectedOptions"
                :key="'item'+index"
                :label="item.label"
                :value="item.value"
                ripple
              ></mu-option>
            </mu-select>
          </mu-form-item>
          <mu-form-item label="手机号:" label-float prop="mobile" help-text='接收验证码及像素服务登录' :rules="phoneNumber">
            <mu-text-field v-model="formMsg.mobile" prop="mobile" full-width></mu-text-field>
          </mu-form-item>
          <mu-form-item label="证件号码:" label-float prop="idCard">
            <mu-text-field v-model="formMsg.idCard" prop="idCard" full-width></mu-text-field>
          </mu-form-item>
          <mu-form-item label="证件号码确认" label-float prop="idCardConfirm" :rules="userCardConfirm">
            <mu-text-field v-model="formMsg.idCardConfirm" full-width prop="idCardConfirm"></mu-text-field>
          </mu-form-item>
        </mu-form>
      </mu-paper>
    </div>

    <!-- 底部按钮 -->
    <mu-paper class="btn" :z-depth="4" v-if="!resizeChange">
      <mu-button class="left" color="#fdd835" textColor="#333333" @click="openMyCode(0)">生成二维码</mu-button>
      <mu-button color="#fdd835" textColor="#333333" @click="openMyCode(1)">开始认证</mu-button>
    </mu-paper>
    <!-- 二维码弹框 -->
    <mu-dialog max-width="90%" :open.sync="openDialog">
      <div class="code_container">
        <div slot="title" class="top_icon">
          <img class="myLogo" :src="logo" alt="像素公寓logo" />
          <img class="friendLogn" :src="fadada" alt="法大大logo" />
        </div>
        <div class="_code">
          <component-code :myCode="codeContainar"></component-code>
        </div>
        <div class="code_footer">扫码开始认证</div>
      </div>
    </mu-dialog>
  </section>
</template>
<script>
import { userAuthenticate } from "@/api/salesApi";
import componentCode from "@/components/Code";
export default {
  components: { componentCode },
  data() {
    return {
      onClick: false,
      openDialog: false,
      codeLoading: false,
      fadada: require("@/assets/images/fadada.svg"),
      logo: require("@/assets/images/xsgu_logo.svg"),
      userCard: [
        {
          validate: (val) =>
            /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val),
          message: "身份证号码格式不正确",
        },
      ],
      messageRules: [
        {
          validate: (val) => {
            if (val === 0) return true;
            return !!val;
          },
          message: "该选项为必填项",
        },
      ],
      userCardConfirm: [
        {
          validate: (val) => val === this.formMsg.idCard,
          message: "两次输入不一致",
        },
      ],
      phoneNumber: [
        { validate: (val) => !!val, message: "必须填写电话号码" },
        {
          validate: (val) => /^1[3456789]\d{9}$/.test(val),
          message: "请填写正确的电话号码",
        },
      ],
      formMsg: {
        idCard: "",
        idCardConfirm: "",
        certType: 0,
        mobile: "",
      },
      selectedOptions: [
        {
          label: "身份证",
          value: 0,
        },
        {
          label: "其他证件类型",
          value: 1,
        },
      ],
      codeContainar: "",
    };
  },
  computed: {
    resizeChange() {
      return this.$store.state.reiseChange;
    },
  },
  methods: {
    // 回到上一级菜单
    goBack() {
      this.$router.go(-1);
    },
    // 打开二维码弹框
    openMyCode(type) {
      this.$refs.userForm.validate().then((result) => {
        if (result) {
          this.authenticate(type);
        }
      });
    },
    // 请求验证
    authenticate(statue) {
      if (this.onClick) return;
      this.onClick = true;
      // status 0 --生成二维码 1 跳转三方地址
      this.codeLoading = true;
      let url;
      if (statue === 1) {
        url = window.location.href;
      } else {
        url = "";
      }
      let param = {
        idCard: this.formMsg.idCardConfirm,
        certType: this.formMsg.certType,
        mobile:this.formMsg.mobile,
        returnUrl: url,
      };
      userAuthenticate(param)
        .then((res) => {
          this.onClick = false;
          if (statue === 0) {
            this.codeContainar = res.data.authUrl;
            this.openDialog = true;
            this.codeLoading = false;
          } else {
            window.location.href = res.data.authUrl;
          }
        })
        .catch((e) => {
          this.onClick = false;
          this.codeLoading = false;
        });
    },
  },
};
</script>
<style lang="less" scoped>
.v_page {
  overflow: hidden;
}
.v_mainContainer {
  height: calc(100% - 113px);
  &.isBig {
    height: calc(100% - 57px);
  }
  .userCard {
    padding: 20px 20px 50px;
    .title {
      font-size: 14px;
      font-weight: 600;
    }
    /deep/.mu-form-item {
      margin-bottom: 0;
    }
  }
}
.code_container {
  .top_icon {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: -40px;
    .myLogo {
      height: 100px;
      margin-left: -15px;
    }
    .friendLogn {
      width: 55px;
      height: 30px;
    }
  }
  .code {
    margin-top: -40px;
    width: 100%;
    min-height: 140px;
    position: relative;
    z-index: 3;
  }
  .code_footer {
    text-align: center;
    font-size: 14px;
  }
}
// 二维码弹框
/deep/.mu-dialog {
  background: #fdd835;
  border-radius: 15px;
  overflow: hidden;
}
.btn {
  width: 100%;
  padding: 10px;
  text-align: right;
  left: 0;
  position: fixed;
  bottom: 0;
  z-index: 10;
  .left {
    margin-right: 10px;
  }
}
</style>
