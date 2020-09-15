<template>
  <div class="v_block">
    <div>
      <mu-paper :z-depth="1" class="title">
        <span class="tag">办理</span>
        <span>{{roomMsg.full_name}}</span>
      </mu-paper>
      <mu-paper :z-depth="1" class="msg_container" v-if="myData">
        <div class="item">
          <span class="leftText v_ellipsis">签约销售</span>
          <span class="rightText v_ellipsis">{{myData.saler}}</span>
        </div>
        <div class="item">
          <span class="leftText v_ellipsis">租客姓名</span>
          <span class="rightText v_ellipsis">{{myData.customer.name}}</span>
        </div>
        <div class="item">
          <span class="leftText v_ellipsis">身份证号</span>
          <span class="rightText v_ellipsis">{{myData.customer.idCard}}</span>
        </div>
        <div class="item">
          <span class="leftText v_ellipsis">手机号</span>
          <span class="rightText v_ellipsis">{{myData.customer.mobile}}</span>
        </div>
        <div class="item">
          <span class="leftText v_ellipsis">起止时间</span>
          <span class="rightText v_ellipsis">{{myData.begin_date+'~'+myData.end_date}}</span>
        </div>
        <div class="item">
          <span class="leftText v_ellipsis">状态</span>
          <span class="rightText v_ellipsis orange">{{myData.statusName}}</span>
        </div>
        <div class="item topSpace">
          <span class="leftText v_ellipsis">付款方式</span>
          <span class="rightText v_ellipsis">{{setPayModelName(myData.pay_mode)}}</span>
        </div>
        <div class="item">
          <span class="leftText v_ellipsis">房租</span>
          <span class="rightText v_ellipsis">{{myData.rent}}元/月</span>
        </div>
        <div class="item">
          <span class="leftText v_ellipsis">房屋押金</span>
          <span class="rightText v_ellipsis">{{myData.deposit}}元</span>
        </div>
        <div class="item">
          <span class="leftText v_ellipsis">钥匙&门卡押金</span>
          <span class="rightText v_ellipsis">{{myData.card_deposit}}元</span>
        </div>
        <div class="item">
          <span class="leftText v_ellipsis">其它押金</span>
          <span class="rightText v_ellipsis">{{myData.other_deposit}}元</span>
        </div>
        <!-- 优惠信息 -->
        <div class="discount_box">
          <div class="category_title">优惠信息</div>
          <!-- 一级优惠 -->
          <div class="item" v-if="myData.level_1_benefit">
            <span class="leftText v_ellipsis">{{myData.level_1_benefit.name}}</span>
            <span class="rightText v_ellipsis">{{myData.level_1_benefit.desc}}</span>
          </div>
          <!-- 二级优惠 -->
          <div class="item" v-if="myData.level_2_benefit">
            <span class="leftText v_ellipsis">{{myData.level_2_benefit.name}}</span>
            <span class="rightText v_ellipsis">{{myData.level_2_benefit.desc}}</span>
          </div>
          <!-- 无优惠信息 -->
          <div class="item" v-if="!myData.level_1_benefit&&!myData.level_2_benefit">
            <span class="leftText v_ellipsis">--</span>
            <span class="rightText v_ellipsis">--</span>
          </div>
        </div>
        <!-- 费用信息 -->
        <div class="cost_box">
          <div class="category_title">费用信息</div>
          <div class="item" v-for="(val,index) in costData" :key="index">
            <span class="leftText v_ellipsis">{{val.name}}</span>
            <span class="rightText v_ellipsis">{{val.rightMgs}}</span>
          </div>
        </div>
      </mu-paper>
    </div>

    <!-- 底部按钮 -->
    <mu-paper class="form_footer_btn" :z-depth="4">
      <mu-button
        color="rgba(0, 0, 0, 0.75)"
        textColor="#ffffff"
        @click="changeStep('cancle')"
        class="leftBtn"
      >作废</mu-button>
      <mu-button color="#fdd835" textColor="#333333" @click="changeStep('next')">确认租约</mu-button>
    </mu-paper>
  </div>
</template>
<script>
import { getRoomLease, confirmLease, cancelLease } from '@/api/salesApi';
export default {
  props: ['leaseid'],
  data () {
    return {
      onClick: false,
      myData: undefined
    };
  },
  computed: {
    roomMsg () {
      return this.$store.state.sales.roomParams;
    }
  },
  created () {
    this.getLease(this.leaseid);
  },
  methods: {
    // 按钮点击
    changeStep (direction) {
      if (this.onClick) return;
      this.onClick = true;
      if (direction === 'next') {
        this.fixedLease(this.leaseid);
      } else {
        this.$confirm('确认将租约作废？', '提示').then(val => {
          if (val.result) {
            this.cancleNewLease(this.leaseid);
            this.$store.commit('change_Action', 'pop');
            this.$router.go(-1);
          }
        });
      }
    },
    // 获取租约信息
    getLease (leaseId) {
      getRoomLease(leaseId).then(res => {
        this.myData = res.data.lease;
        this.costData = this.setListData(this.myData.lease_costs);
      });
    },
    // 确认租约
    fixedLease (leaseId) {
      confirmLease(leaseId).then(res => {
        this.onClick = false;
        this.$emit('addStep');
      });
    },
    // 取消租约
    cancleNewLease (leaseId) {
      this.onClick = false;
      cancelLease(leaseId).then(res => {});
    },
    // 设置支付数据
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
    // 设定付款方式
    setPayModelName (status) {
      let name;
      switch (status) {
        case 1:
          name = '月付';
          break;
        case 2:
          name = '双月付';
          break;
        case 3:
          name = '季付';
          break;
        case 6:
          name = '半年付';
          break;
        case 12:
          name = '年付';
          break;
        case 24:
          name = '两年付';
          break;
        default:
          name = status + '个月付';
          break;
      }
      return name;
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
    background: #5677fc;
    font-size: 16px;
    padding: 5px 10px;
    .tag {
      font-size: 12px;
      height: 32px;
      line-height: 32px;
      padding: 0 10px;
      border-radius: 16px;
      background: rgba(3, 30, 138, 0.432);
      margin-right: 10px;
    }
  }
}
.msg_container {
  padding: 15px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  .category_title {
    font-size: 14px;
    color: #000000;
    padding: 10px 15px;
    margin-bottom: 10px;
    border-bottom: solid 1px #cccccc;
  }
  .item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 25px;
    &.topSpace {
      margin-top: 10px;
    }
    .leftText {
      flex: 4;
      font-size: 14px;
      color: #000000;
      font-weight: 600;
    }
    .rightText {
      flex: 7;
      font-size: 12px;
      text-align: right;
    }
  }
  .cost_box {
    .item {
      padding: 5px 10px;
    }
  }
  .discount_box {
    .item {
      padding: 5px 15px;
    }
  }
}
.orange {
  color: #f57f17;
  font-weight: 600;
}
</style>
