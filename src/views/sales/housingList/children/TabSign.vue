<template>
  <div v-if="myData.house_info">
    <mu-paper class="listBox v_block" :z-depth="1">
      <!-- 定价 -->
      <div class="item">
        <span class="leftText v_ellipsis">定价</span>
        <span class="rightText v_ellipsis">{{myData.sale_price}}元/月</span>
      </div>
      <!-- 费用标准 -->
      <div class="item">
        <span class="leftText v_ellipsis">费用标准</span>
        <span
          class="rightText v_ellipsis"
        >{{myData.house_info.house_cost.cost_name}}{{myData.house_info.house_cost.cost}}元/月</span>
      </div>
      <div class="item_title_box">
        <!-- 杂费 -->
        <div class="item" v-for="(item,index) in topList" :key="index">
          <span class="leftText v_ellipsis thin_font">{{item.type_name}}</span>
          <span class="rightText v_ellipsis thin_font">{{item.rightMgs}}</span>
        </div>
      </div>
      <!-- 房东 -->
      <div class="item topSpace">
        <span class="leftText v_ellipsis">业主名</span>
        <span
          class="rightText v_ellipsis"
          v-if="myData.house_info.owner_name"
        >{{myData.house_info.owner_name}}</span>
        <span class="rightText v_ellipsis" v-if="!myData.house_info.owner_name">--</span>
      </div>
      <!-- 项目名称 -->
      <div class="item">
        <span class="leftText v_ellipsis">项目</span>
        <span
          class="rightText v_ellipsis"
          v-if="myData.house_info.project_name"
        >{{myData.house_info.project_name}}</span>
        <span class="rightText v_ellipsis" v-if="!myData.house_info.project_name">--</span>
      </div>
      <!-- 到期时间 -->
      <div class="item">
        <span class="leftText v_ellipsis">房源到期</span>
        <span class="rightText v_ellipsis">{{myData.house_info.expire_date}}</span>
      </div>
      <!-- 销售信息 -->
      <div class="item topSpace">
        <span class="leftText v_ellipsis">销售团队</span>
        <span class="rightText v_ellipsis">{{myData.house_info.team_name}}</span>
      </div>
      <div class="item">
        <span class="leftText v_ellipsis">责任销售</span>
        <span class="rightText v_ellipsis">{{myData.house_info.sale_name}}</span>
      </div>
      <div class="item">
        <span class="leftText v_ellipsis">责任管家</span>
        <span class="rightText v_ellipsis">{{myData.house_info.manager_name}}</span>
      </div>
    </mu-paper>
    <!-- 优惠信息导航 -->
    <mu-paper @click="nextPage" :z-depth="1" class="linkBlock">
      <mu-ripple class="title" color="#cccccc" :opacity="0.7">
        <span class="titleText">
          <span>可选优惠</span>
          <span class="amountSpan">{{amount}}</span>
        </span>
        <span class="icon iconSpan">
          <mu-icon value="keyboard_arrow_right" color="#AAAAAA" :size="28" right></mu-icon>
        </span>
      </mu-ripple>
    </mu-paper>
  </div>
</template>
<script>
import { getLeaseBenefitLeveOne } from '@/api/salesApi';

export default {
  props: {
    myData: {
      type: Object
    }
  },
  data () {
    return {
      benefits: [],
      amount: 0
    };
  },
  computed: {
    topList () {
      return this.setListData(this.myData.house_info.houseCosts);
    }
  },
  created () {
    this.getDiscountOne();
  },
  methods: {
    // 跳转到优惠详情页
    nextPage () {
      this.$store.commit('change_Action', 'push');
      this.$router.push('/sales/DiscountCoupon');
    },
    // 设置数据
    setListData (arr) {
      if (!arr || arr.length === 0) return [];
      let tempArr = [];
      arr.forEach(item => {
        switch (item.recv_mode) {
          case 1:
            item.rightMgs = `包干${item.cost}元/月`;
            break;
          case 2:
            item.rightMgs = `租客自缴`;
            break;
          case 3:
            item.rightMgs = `公司代缴`;
            break;
          default:
            break;
        }
        tempArr.push(item);
      });
      return tempArr;
    },
    // 获取一级优惠信息
    getDiscountOne () {
      let loginType = Number(localStorage.getItem('loginType'));
      let id = loginType === 1 ? localStorage.getItem('personId') : '';
      let param = {
        roomId: this.myData.room_id,
        salerId: id
      };
      getLeaseBenefitLeveOne(param).then(res => {
        this.amount = res.data ? res.data.benefits.length : 0;
        // this.benefits = res.data.benefits;
      });
    }
  }
};
</script>
<style lang="less" scoped>
.listBox {
  padding: 20px 30px;
  .item_title_box {
    width: 100%;
    margin: 10px auto;
    padding: 10px 0;
    border-bottom: solid 1px #cccccc;
    border-top: solid 1px #cccccc;
  }
  .item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
    &.topSpace {
      margin-top: 10px;
    }
    .leftText {
      flex: 3;
      font-size: 14px;
      color: #000000;
      font-weight: 600;
    }
    .rightText {
      flex: 7;
      font-size: 12px;
      text-align: right;
    }
    .thin_font {
      color: #797979;
    }
  }
}
.linkBlock {
  margin-top: 10px;
  border-radius: 10px;
}
.title {
  width: 100%;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: bottom;
  position: relative;
  .iconSpan {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .titleText {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #797979;
    .amountSpan {
      margin-left: 5px;
      font-size: 12px;
      padding: 0 5px;
      background: #8bc34a;
      border-radius: 7px;
      color: #ffffff;
    }
  }
}
</style>
