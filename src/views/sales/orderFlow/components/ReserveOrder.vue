<template>
  <div class="listBox" v-if="leaseData">
    <div class="title" v-if="titleType==='reserve'">
      <span class="tag">预定</span>
      <span class="text">{{roomMsg.full_name}}</span>
    </div>
    <div class="border_title" v-if="titleType==='detail'">预定信息</div>
    <div class="container">
      <!-- 預定人 -->
      <div class="item">
        <span class="leftText v_ellipsis">预定人</span>
        <span class="rightText v_ellipsis">{{leaseData.customer.name}}</span>
      </div>
      <!-- 定金 -->
      <div class="item">
        <span class="leftText v_ellipsis">定金金额</span>
        <span class="rightText v_ellipsis">{{leaseData.bond}} 元</span>
      </div>
      <!-- 预定时间 -->
      <div class="item">
        <span class="leftText v_ellipsis">预定时间</span>
        <span class="rightText v_ellipsis">{{leaseData.begin_date}}</span>
      </div>
      <!-- 失效时间 -->
      <div class="item">
        <span class="leftText v_ellipsis">失效时间</span>
        <span class="rightText v_ellipsis">{{leaseData.end_date}}</span>
      </div>
      <!-- 距离失效 -->
      <div class="item" v-if="leaseData.status===9">
        <span class="leftText v_ellipsis">距离失效</span>
        <span class="rightText v_ellipsis red">{{countTime}}</span>
      </div>
      <!-- 支付状态 -->
      <div class="item">
        <span class="leftText v_ellipsis">状态</span>
        <span
          class="rightText v_ellipsis"
          :class="[!payState?'orange':'green']"
        >{{!payState?'未支付':'已支付'}}</span>
      </div>
      <div v-if="!payState">
        <div class="item">
          <span class="leftText v_ellipsis">定金付款码</span>
        </div>
        <!-- 二维码  -->
        <div
          class="code_box"
          v-loading="codeLoding"
          data-mu-loading-text="请求中..."
          data-mu-loading-overlay-color="transparent"
        >
          <pay-code :myCode="codeContent" :logoSrc="logoSrc" v-if="codeContent&&!codeLoding"></pay-code>
          <div class="v_footerHint" v-if="!codeContent&&!codeLoding">付款码加载失败！请稍后再试</div>
        </div>
      </div>
      <mu-paper class="btn" :z-depth="4" v-if="btn">
        <mu-button color="#fdd835" textColor="#333333" @click="back">返回</mu-button>
      </mu-paper>
    </div>
  </div>
</template>
<script>
import Moment from 'moment';
import { getRoomLease, getPayCode } from '@/api/salesApi';
import PayCode from '@/components/Code';
export default {
  components: { PayCode },
  props: {
    titleType: {
      type: String,
      default: 'reserve' // 标题状态 reserve--预定信息 detail---租约详情
    },
    btn: {
      type: Boolean,
      default: true
    },
    ownLeaseId: Number
  },
  data () {
    return {
      logoSrc: require('@/assets/images/bottomLogo.svg'),
      leaseData: '',
      countTime: '',
      codeContent: '',
      codeLoding: true,
      timer: undefined,
      payState: false
    };
  },
  computed: {
    roomMsg () {
      return this.$store.state.sales.roomParams;
    }
  },
  created () {
    this.getOrderMsg(this.ownLeaseId);
  },
  methods: {
    // 返回
    back () {
      this.$store.commit('change_Action', 'pop');
      this.$router.go(-1);
    },
    // 计算预定是否支付
    isPay (status) {
      let payMode = false;
      switch (status) {
        case 8:
        case 12:
          payMode = true;
          break;
        case 9:
        case 11:
          payMode = false;
          break;
        default:
          break;
      }
      return payMode;
    },
    // 获取预定租约信息
    getOrderMsg (leaseid) {
      getRoomLease(leaseid).then(res => {
        this.leaseData = res.data.lease;
        this.payState = this.isPay(this.leaseData.status);
        this.$emit('setPayMode', this.payState);
        this.$emit('getUserMsg', res.data.lease.customer);
        this.setMytTimer(this.payState);
      });
    },
    // 获取支付二维码
    getMyCode (leaseid) {
      this.codeLoding = true;
      getPayCode(leaseid).then(res => {
        this.codeContent = res.data.payQRCode;
        this.codeLoding = false;
      });
    },
    // 计算剩余时间
    residueTime (end) {
      let startTime = Moment();
      let endTime = Moment(end);
      let minuteCount = endTime.diff(startTime, 'minute'); // 计算相差的分钟数
      let hour = parseInt(minuteCount / 60);
      hour = hour > 0 ? hour + '小时' : '';
      let minute = minuteCount % 60;
      minute = minute > 0 ? minute + '分钟' : '00分钟';
      return hour + minute;
    },
    // 轮询是否已支付
    setMytTimer (status) {
      if (!status) {
        this.countTime = this.residueTime(this.leaseData.end_date);
        if (!this.codeContent) {
          this.getMyCode(this.ownLeaseId);
        }
        this.timer = setTimeout(() => {
          this.getOrderMsg(this.ownLeaseId);
        }, 30000);
      }
    }
  },
  beforeDestroy () {
    window.clearTimeout(this.timer);
  }
};
</script>
<style lang="less" scoped>
.listBox {
  .title {
    padding: 8px 15px;
    display: flex;
    font-size: 16px;
    align-items: center;
    background: #4cb58f;
    color: #ffffff;
    .tag {
      font-size: 13px;
      background: rgb(4, 148, 95);
      padding: 0 10px;
      line-height: 28px;
      border-radius: 13px;
      margin-right: 10px;
    }
  }
  .container {
    padding: 15px 35px;
    .item {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 5px;
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
         user-select: text;
        -webkit-user-select:text;
      }
      .red {
        color: red;
        font-weight: 800;
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
.code_box {
  min-height: 190px;
  position: relative;
}
.btn {
  width: 100%;
  padding: 10px;
  text-align: right;
  left: 0;
  position: fixed;
  bottom: 0;
}
.border_title {
  border-bottom: solid 1px #cccccc;
  padding: 15px;
  font-size: 16px;
}
</style>
