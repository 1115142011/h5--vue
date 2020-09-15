<template>
  <section class="v_page">
    <mu-paper class="v_topNav topNav" :z-depth="4">
      <!-- 顶部导航 -->
      <mu-appbar color="#fdd835" title="同住人列表" textColor="#000">
        <!-- 导航图标 -->
        <mu-button icon slot="left" @click="goBack">
          <mu-icon value="arrow_back"></mu-icon>
        </mu-button>
      </mu-appbar>
    </mu-paper>
    <!-- 列表 -->
    <div class="v_mainContainer skipRem" ref="container">
      <mu-paper
        :z-depth="1"
        class="msg-box v_block"
        v-for="(item,index) in listData"
        :key="index+'a'"
      >
        <div class="partner-title">
          <mu-icon value="home" color="#1890FF"></mu-icon>
          <span class="thin-font">同住人 {{index+1}}</span>
        </div>
        <div class="container">
          <div class="left-pic">
            <img :src="showSex(item.idCard)" alt="头像" />
          </div>
          <div class="right-text">
            <div class="partner-item">
              <span class="left-msg">与签约人关系</span>
              <span class="right-msg">{{judgePartner(item.relation)}}</span>
            </div>
            <div class="partner-item">
              <span class="left-msg">姓名</span>
              <span class="right-msg"> {{item.name}}</span>
            </div>
            <div class="partner-item">
              <span class="left-msg">电话</span>
              <span class="right-msg">{{item.mobile}}</span>
            </div>
            <div class="partner-item">
              <span class="left-msg">身份证号</span>
              <span class="right-msg">{{item.idCard}}</span>
            </div>
          </div>
        </div>
      </mu-paper>
    </div>
  </section>
</template>
<script>
export default {
  data () {
    return {
      listData: [],
      man: require('@/assets/images/man.png'),
      laday: require('@/assets/images/lady.png')
    };
  },
  created () {
    this.listData = this.$store.state.sales.partnerArry;
  },
  methods: {
    // 返回首页
    goBack () {
      this.$store.commit('sales/setpartnerArry', []);
      this.$router.go(-1);
    },
    // 判紧急联系人关系
    judgePartner (value) {
      let str = '--';
      switch (value) {
        case 1:
          str = '朋友';
          break;
        case 2:
          str = '家人';
          break;
        case 3:
          str = '情侣';
          break;
        case 4:
          str = '同事';
          break;
        default:
          break;
      }
      return str;
    },
    // 身份证号判断性别
    showSex (idCard) {
      let length = idCard.length;
      let number = 1;
      if (length === 15) {
        number = idCard.charAt(length - 1);
      } else if (length === 18) {
        number = idCard.charAt(length - 2);
      }
      if (number % 2 > 0) {
        return this.man;
      } else {
        return this.laday;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.msg-box {
  padding: 10px;
}
.partner-title {
  display: flex;
  align-items: flex-end;
  .thin-font {
    font-size: 12px;
  }
}

.container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .left-pic {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    img {
      width: 100%;
      height: auto;
    }
  }
  .right-text {
    flex: 8;
  }
  .partner-item {
    display: flex;
    margin-top: 5px;
    justify-content: space-between;
    align-items: center;
    .left-msg {
      flex: 4;
      font-weight: bold;
      color: #000000;
    }
    .right-msg {
      flex: 6;
      color: #797979;
    }
  }
}
</style>
