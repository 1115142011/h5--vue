<template>
  <section class="v_page">
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000">
      <mu-button icon slot="left" @click="goBack">
        <mu-icon value="arrow_back"></mu-icon>
      </mu-button>提前预定租约
    </mu-appbar>
    <!-- 账单 -->
    <section class="v_mainContainer skipRem">
      <mu-paper class="v_block" :z-depth="1">
        <reserve-order @getUserMsg="keepMsg" @setPayMode='changeShow' :btn="false" :ownLeaseId="leaseId"></reserve-order>
      </mu-paper>
    </section>
    <!-- 操作 按钮-->
    <mu-paper class="form_footer_btn" :z-depth="4" v-if="showBtn">
      <mu-button
        class="btn"
        flat
        small
        color="primary"
        @click="toOrderFlow('/sales/orderFlow/ChangeReserve',true)"
      >预定变更</mu-button>
      <!-- <mu-button
        class="btn"
        textColor="#333333"
        @click="toOrderFlow('/sales/orderFlow/reserveSinger',true)"
        color="#fdd835"
      >在线签约</mu-button> -->
      <!-- <mu-button class="btn" color="#545454" textColor="#ffffff">删除预定</mu-button> -->
    </mu-paper>
  </section>
</template>
<script>
import ReserveOrder from '../orderFlow/components/ReserveOrder';
export default {
  components: { ReserveOrder },
  data () {
    return {
      leaseId: undefined,
      customer: undefined,
      showBtn: false
    };
  },
  created () {
    this.leaseId = Number(this.$route.query.id);
  },
  methods: {
    // 回到上一级菜单
    goBack () {
      this.$store.commit('change_Action', 'pop');
      this.$router.go(-1);
    },
    // 计算该租约是否可操作
    changeShow (status) {
      this.showBtn = status && this.$route.query.handle;
    },
    // 签约
    toOrderFlow (path) {
      // 新租状态的租约表单数据
      let roomMsg = this.$store.state.sales.roomParams;
      let obj = {
        leaseId: this.leaseId,
        electSignFlag: 1, // 固定值1 电子签约
        submitType: 0, // 0 空置 --1续租
        roomId: roomMsg.room_id,
        extendFlag: 0, // -0新签 --1续签
        leaseType: 0, // --0新租 --1换租--2转租
        custSource: '', // 客户来源
        saler: localStorage.getItem('personName'), // 销售名称
        salerId: localStorage.getItem('personId'), // 销售id
        beginDate: undefined, // 开始时间
        endDate: undefined, // 截止时间
        level1BenefitPlanId: undefined,
        leaseCost: {
          rentDeposit: '', // 押金
          cardDeposit: '', // 卡押金
          otherDeposit: '', // 其它押金
          rent: '', // 租金
          payMode: undefined, // 支付方式
          costInfoList: undefined
        },
        timeDuration: '', // 租期时长，
        pay: undefined, // 支付时间,
        additionalInfo: undefined, // 附加信息
        recommend: {
          // 推荐人信息
          name: '',
          mobile: '',
          career: '', // 职业
          relationLeaseId: '', // 推荐人关联的租约
          bankAccount: '', // 银行卡号
          bank: '', // 开户行
          room_name: ''
        }
      };
      this.$store.commit('sales/setCustomerMsg', this.customer);
      this.$store.commit('sales/setOrderFlowName', roomMsg.full_name);
      this.$store.commit('sales/writeInFormData', obj);
      this.$router.push({
        path: path,
        query: {
          type: 5
        }
      });
    },
    // 保存
    keepMsg (obj) {
      this.customer = obj;
    }
  }
};
</script>
<style lang="less" scoped>
</style>
