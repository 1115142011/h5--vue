<template>
  <mu-paper :z-depth="1" class="v_block">
    <div class="content_flat" v-if="myData">
      <div class="title">
        <span class="tag">退租</span>
        <span>{{myData.houseName}}</span>
      </div>
      <div class="status_box">退租完成</div>
      <div class="container">
        <!-- 退组人 -->
        <div class="item">
          <span class="leftText v_ellipsis">姓名</span>
          <span class="rightText v_ellipsis">{{myData.customer.name}}</span>
        </div>
        <!-- 身份证 -->
        <div class="item">
          <span class="leftText v_ellipsis">身份证号</span>
          <span class="rightText v_ellipsis">{{myData.customer.idCard}}</span>
        </div>
        <!-- 手机 -->
        <div class="item">
          <span class="leftText v_ellipsis">手机号</span>
          <span class="rightText v_ellipsis">{{myData.customer.mobile}}</span>
        </div>
        <!-- 状态 -->
        <div class="item">
          <span class="leftText v_ellipsis">状态</span>
          <span class="rightText v_ellipsis orange">结算中</span>
        </div>
        <!-- 退租时间 -->
        <div class="item topSpace">
          <span class="leftText v_ellipsis">退租时间</span>
          <span class="rightText v_ellipsis">{{myData.checkoutTime}}</span>
        </div>
        <!-- 结算方式 -->
        <div class="item">
          <span class="leftText v_ellipsis">结算方式</span>
          <span class="rightText v_ellipsis">{{myData.refundTypeName}}</span>
        </div>
        <!-- 结算金额 -->
        <div class="item">
          <span class="leftText v_ellipsis">结算金额</span>
          <span class="rightText v_ellipsis green" v-if="total>0">（收）{{total}}元</span>
          <span class="rightText v_ellipsis orange" v-if="total<0">（支）{{Math.abs(total)}}元</span>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <mu-paper class="btn" :z-depth="4">
      <mu-button color="#fdd835" textColor="#333333" @click="back">返回列表</mu-button>
    </mu-paper>
  </mu-paper>
</template>
<script>
import { getCheckoutTotal } from '@/api/salesApi';

export default {
  data () {
    return {
      myData: undefined,
      total: 0
    };
  },
  created () {
    this.getTotal(this.quitData.checkoutId);
  },
  computed: {
    quitData: function () {
      return this.$store.state.sales.quitFormData;
    }
  },
  methods: {
    // 按钮点击
    back () {
      this.$store.commit('change_Action', 'pop');
      this.$router.go(-1);
    },
    // 获取最终账单
    getTotal (checkoutId) {
      getCheckoutTotal(checkoutId).then(res => {
        this.myData = res.data;
        this.total = this.countAllPrice(res.data.bills);
      });
    },
    // 计算总价格
    countAllPrice (arr) {
      if (!arr || arr.length === 0) return 0;
      let total = 0;
      arr.forEach(item => {
        total += Number(item.money.toFixed(2));
      });
      total = total.toFixed(2);
      return total;
    }
  }
};
</script>
<style lang="less" scoped>
.v_block {
  padding-bottom: 30px;
  .title {
    display: flex;
    align-items: center;
    color: #ffffff;
    background: #b383e2;
    font-size: 16px;
    padding: 10px;
    .tag {
      font-size: 12px;
      height: 32px;
      line-height: 32px;
      padding: 0 10px;
      border-radius: 16px;
      background: rgb(132, 93, 170);
      margin-right: 10px;
    }
  }
  .status_box {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #b383e2;
    width: 100%;
    height: 100px;
    font-size: 18px;
    font-weight: 600;
    border-bottom: solid 1px #cccccc;
  }
  .container {
    font-size: 14px;
    padding: 10px 30px 20px;
    color: #000000;
    .item {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 5px;
      &.topSpace {
        margin-top: 20px;
      }
      .leftText {
        flex: 3;
        font-size: 14px;
        color: #000000;
        font-weight: 700;
      }
      .rightText {
        flex: 7;
        font-size: 12px;
        text-align: right;
      }
      .orange {
        color: #f57f17;
        font-weight: 800;
      }
      .green {
        color: green;
        font-weight: 800;
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
