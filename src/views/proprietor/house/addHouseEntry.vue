<template>
  <section class="v_page">
    <!-- 顶部导航条 -->
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000">
      <mu-button icon slot="left" @click="goBack">
        <mu-icon value="close"></mu-icon>
      </mu-button>添加房源
    </mu-appbar>
    <!-- 主内容区 -->
    <div class="v_mainContainer skipRem">
      <mu-paper :z-depth="1" class="title">选择类型</mu-paper>
      <div class="content">
        <mu-paper
          :z-depth="current==1?10:1"
          class="left-box"
          :class="{selected:current==1}"
          @click="goNext(1)"
        >
          <img class="icon_img" :src="left_pic" alt="图标" />
          <div class="name">闪租出租</div>
          <!-- <div class="dec orange">一句解释的话</div> -->
        </mu-paper>
        <mu-paper
          :z-depth="current==2?10:1"
          class="right-box"
          :class="{selected:current==2}"
          @click="goNext(2)"
        >
          <!-- <mu-ripple color="#a0a0a0" :opacity="0.5"></mu-ripple> -->
          <img class="icon_img" :src="right_pic" alt="图标" />
          <div class="name">托管房源</div>
          <!-- <div class="dec pink">一句解释的话</div> -->
        </mu-paper>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data () {
    return {
      left_pic: require('@/assets/images/Lightning.svg'),
      right_pic: require('@/assets/images/entrust.svg'),
      current: undefined
    };
  },
  methods: {
    // 返回上一级
    goBack () {
      this.$router.go(-1);
    },
    goNext (type) {
      this.current = type;
      setTimeout(() => {
        if (type === 1) {
          this.$toast.warning('闪电出租暂未开放');
        } else if (type === 2) {
        // 托管
          this.$store.commit('proprietor/writeFormParam', {
            mode: type,
            project: 'TG'
          });
          this.$store.commit('proprietor/resetRegisterStep');
          this.$router.push('/proprietor/houseRegister');
        }
      }, 200);
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.mu-paper-round {
  border-radius: 0;
}
.title {
  margin-top: 16px;
  padding: 15px 20px;
  font-weight: bold;
  color: rgba(81, 81, 81, 1);
  font-size: 16px;
  background: rgba(246, 246, 244, 1);
  border-bottom: solid 1px #eeeeee;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.left-box,
.right-box {
  height: 161px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 20px 10px;
  position: relative;
  background: rgba(246, 246, 244, 1);
  .name {
    font-weight: bold;
    margin-bottom: 5px;
  }
}
.left-box {
  border-bottom-left-radius: 10px;
  .icon_img {
    width: 60px;
  }
}
.right-box {
  border-bottom-right-radius: 10px;
  .icon_img {
    width: 60px;
  }
}
.orange {
  color: #ff9b39;
}
.pink {
  color: #f39696;
}
.selected {
  height: 168px;
  transform: rotateX(5deg);
}

</style>
