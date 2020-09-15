<template>
  <section class="v_page">
    <!-- 导航 -->
    <mu-appbar class="v_topNav" :title="topNavTitle" color="#fdd835" textColor="#000">
      <mu-button icon slot="left" @click="openLayOutModel">
        <mu-icon value="menu"></mu-icon>
      </mu-button>
    </mu-appbar>
    <!-- 内容区 -->
    <div class="v_mainContainer skipRem" :class="{have_bottom_bar:longType===1}">
      <serve-page v-if="navState==='serve'"></serve-page>
      <Performance v-if="navState==='performance'"></Performance>
      <div class="v_footerHint" v-show="navState==='self'">该功能暂未开放</div>
    </div>
    <!-- 底部栏 -->
    <mu-paper class="footerNav" :z-depth="10" v-if="longType===1">
      <mu-bottom-nav :value.sync="navState" @change="keepStatus">
        <mu-bottom-nav-item title="业绩" icon="insert_chart" value="performance"></mu-bottom-nav-item>
        <mu-bottom-nav-item title="服务" icon="build" value="serve"></mu-bottom-nav-item>
        <mu-bottom-nav-item title="我的" icon="face" value="self"></mu-bottom-nav-item>
      </mu-bottom-nav>
    </mu-paper>

    <mu-dialog width="50%" transition="slide-left" class="exit-model"  :open.sync="open">
       <mu-list>
        <mu-list-item button @click="logout">
          <div class="logout">
            <mu-icon class="icon" value="exit_to_app"></mu-icon>退出
          </div>
        </mu-list-item>
      </mu-list>
    </mu-dialog>
    <!-- <mu-drawer class="mydrawer" :append-body="true" :open.sync="open" width="50%" :docked="false">
      <mu-list>
        <mu-list-item button @click="logout">
          <div class="logout">
            <mu-icon class="icon" value="exit_to_app"></mu-icon>退出
          </div>
        </mu-list-item>
      </mu-list>
    </mu-drawer>-->
  </section>
</template>
<script>
// @ is an alias to /src
import ServePage from '@/components/ServePage';
import Performance from '@/views/sales/home/Default';
export default {
  components: { ServePage, Performance },
  data () {
    return {
      open: false,
      navState: '',
      topNavTitle: '',
      longType: 0
    };
  },
  created () {
    this.navState = this.$store.state.sales.footerNavStatus;
    this.longType = Number(localStorage.getItem('loginType'));
  },
  methods: {
    openLayOutModel () {
      this.open = !this.open;
      setTimeout(() => {
        let tag = document.getElementsByClassName('.mu-overlay');
        console.log('遮罩', tag);
      }, 500);
    },
    // 退出
    logout () {
      this.$confirm('确定要退出？', '提示', {}).then(({ result }) => {
        if (result) {
          localStorage.clear('currentUserToken');
          this.$router.push('/');
        } else {
          this.open = false;
        }
      });
    },
    // 缓存导航状态
    keepStatus (value) {
      this.$store.commit('sales/setFooterNavStatus', value);
    }
  },
  watch: {
    navState: function (newVal, oldVal) {
      this.topNavTitle =
        newVal === 'performance'
          ? '业绩'
          : newVal === 'serve'
            ? '服务'
            : '我的';
    }
  }
};
</script>

<style lang="less" scoped>
.exit-model{
  height: 100%;
  justify-content: flex-start;
  /deep/.mu-dialog{
    height: 100%;
    .mu-dialog-body{
      padding: 0;
    }
  }
}
.v_mainContainer.skipRem.have_bottom_bar {
  padding-top: 0;
  height: calc(100% - 100px);
}
.footerNav {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 2;
}
.logout {
  padding: 20px 10px;
  display: flex;
  align-items: center;
  .icon {
    margin-right: 10px;
  }
}
</style>
