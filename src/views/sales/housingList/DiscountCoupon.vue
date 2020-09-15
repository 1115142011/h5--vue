<template>
  <section class="v_page">
    <!-- 顶部导航条 -->
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000">
      <mu-button icon slot="left" @click="goBack">
        <mu-icon value="arrow_back"></mu-icon>
      </mu-button>优惠信息详情
    </mu-appbar>
    <!-- 主内容区 -->
    <div
      class="v_mainContainer"
      v-loading="loading"
      data-mu-loading-text="加载中..."
    >
      <mu-paper class="v_block" :z-depth="1">
        <div class="contentBox">
          <div class="title">一级优惠</div>
          <div
            class="item"
            :class="{topSpace:item.type===2}"
            v-for="(item,index) in benefits"
            :key="index"
          >
            <span class="leftText v_ellipsis">{{item.name}}</span>
            <!-- <span class="rightText v_ellipsis">{{item.name}}</span> -->
          </div>
          <div class="v_footerHint" v-if="benefits.length===0 &&!loading">该房间暂无优惠信息</div>
        </div>
      </mu-paper>
    </div>
  </section>
</template>
<script>
import { getLeaseBenefitLeveOne } from '@/api/salesApi';
export default {
  data () {
    return {
      loading: false,
      benefits: []
    };
  },
  computed: {
    roomMsg () {
      return this.$store.state.sales.roomParams;
    }
  },
  created () {
    this.getDiscountOne();
  },
  methods: {
    // 返回上级菜单
    goBack () {
      this.$store.commit('change_Action', 'pop');
      this.$router.go(-1);
    },
    // 获取一级优惠信息
    getDiscountOne () {
      let loginType = Number(localStorage.getItem('loginType'));
      let id = loginType === 1 ? localStorage.getItem('personId') : '';
      let param = {
        roomId: this.roomMsg.room_id,
        salerId: id
      };
      this.loading = true;
      getLeaseBenefitLeveOne(param).then(res => {
        this.loading = false;
        this.benefits = this.benefits.concat(res.data.benefits);
      });
    }
  }
};
</script>
<style lang="less" scoped>
.v_block {
  padding-top: 15px;
  padding-bottom: 25px;
}
.contentBox {
  width: 100%;
  padding: 10px 15px;
  .title {
    font-size: 14px;
    color: #000000;
    font-weight: 600;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: solid 1px #cccccc;
  }
}
.item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  .leftText {
    flex: 1;
    font-size: 14px;
    color: #000000;
    font-weight: 600;
  }
  .rightText {
    flex: 1;
    font-size: 12px;
    text-align: right;
  }
}
</style>
