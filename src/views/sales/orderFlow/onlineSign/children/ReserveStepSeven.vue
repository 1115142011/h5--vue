<template>
  <mu-paper :z-depth="1" class="v_block">
    <div class="container">
      <div class="hit_msg">租约正在办理中</div>
      <div class="code_pic_box">
        <div class="code_title">
          <span class="left_msg v_ellipsis">新房源</span>
          <span class="right_msg v_ellipsis">{{roomMsg.full_name}}</span>
        </div>
        <div class="pic">
          <div class="code_bg">
            <img :src="codeImg" alt="公众号图片" />
          </div>
        </div>
        <div class="v_footerHint">请关注公众号确认~</div>
      </div>
    </div>
    <!-- 底部按钮 -->
    <mu-paper class="btn" :z-depth="4">
      <mu-button color="#fdd835" textColor="#333333" @click="toHomeList">返回列表</mu-button>
    </mu-paper>
  </mu-paper>
</template>
<script>
export default {
  data () {
    return {
      codeImg: require('@/assets/images/xscode.jpg')
    };
  },
  computed: {
    roomMsg () {
      return this.$store.state.sales.roomParams;
    }
  },
  methods: {
    // 按钮点击
    toHomeList () {
      this.$store.commit('change_Action', 'pop');
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less" scoped>
.v_block {
  .container {
    .hit_msg {
      width: 100%;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #5677fc;
      font-size: 18px;
      font-weight: 600;
      border-bottom: solid 1px #cccccc;
    }
    .code_pic_box {
      .code_title {
        width: 100%;
        padding: 20px 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left_msg {
          font-size: 14px;
          color: #000000;
          font-weight: 600;
        }
        .right_msg {
          font-size: 14px;
        }
      }
    }
    .pic {
      width: 100%;
      display: flex;
      justify-content: center;
      .code_bg {
        width: 50%;
        padding: 20px;
        background: #fdd835;
        border-radius: 10px;
        img {
          width: auto;
          max-width: 100%;
          vertical-align: middle;
          border-radius: 10px;
        }
      }
    }
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
