<template>
  <section
    class="v_page"
    v-loading="loading"
    data-mu-loading-text="加载中..."
  >
    <!-- 顶部导航条 -->
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000">
      <mu-button icon slot="left" @click="goBack">
        <mu-icon value="arrow_back"></mu-icon>
      </mu-button>租约详情
    </mu-appbar>
    <div class="v_mainContainer skipRem">
      <div class="v_block" v-if="myData">
        <div>
          <mu-paper :z-depth="1" class="title" :style="{backgroundColor:setColor(myData.status)}">
            <span class="tag">{{getStr(myData.statusName)}}</span>
            <span>{{myData.roomInfo.full_name}}</span>
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
              <span
                class="rightText v_ellipsis"
                v-if="!hintStatue"
                :style="{color:setColor(myData.status)}"
              >{{myData.statusName}}</span>
              <span class="rightText v_ellipsis red" v-if="hintStatue">{{hint}}</span>
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
      </div>
    </div>
    <mu-paper class="form_footer_btn" :z-depth="4">
      <mu-button
        color="#fdd835"
        class="leftBtn"
        textColor="#333333"
        @click="toNext('contract')"
      >电子合同</mu-button>
      <mu-button color="#fdd835" textColor="#333333" @click="toNext('bill')">账单</mu-button>
    </mu-paper>
  </section>
</template>
<script>
import { getRoomLease } from '@/api/salesApi';
import Moment from 'moment'; // 时间处理插件

export default {
  data () {
    return {
      loading: false,
      leaseid: '',
      myData: undefined,
      hint: '逾x天',
      hintStatue: false
    };
  },
  created () {
    this.leaseid = this.$route.query.id;
    this.getLease(this.leaseid);
  },
  methods: {
    goBack () {
      this.$store.commit('change_Action', 'pop');
      this.$router.go(-1);
    },
    // 获取租约信息
    getLease (leaseId) {
      this.loading = true;
      getRoomLease(leaseId).then(res => {
        this.loading = false;
        this.myData = res.data.lease;
        this.setNextPayTime(this.myData.next_pay_date);
        this.costData = this.setListData(this.myData.lease_costs);
      });
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
    },
    // 计算支付是否超期
    setNextPayTime (end) {
      if (!end) return true;
      let now = Moment();
      let taget = Moment(end + ' 23:59:59');
      let diffDays = Math.ceil(now.diff(taget, 'days', true));
      this.hint = `逾期 ${diffDays} 天未缴费`;
      this.hintStatue = diffDays > 0;
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
    //  截取字符串
    getStr (str) {
      let tempStr = '';
      if (str.length > 2) {
        tempStr = str.substring(0, 1);
      } else {
        tempStr = str;
      }
      return tempStr;
    },
    // 设置标题背景颜色
    setColor (status) {
      let color;
      switch (status) {
        case 4: // 解约 紫色
        case 6: // 驳回
          color = '#B383E2';
          break;
        case 1: // 在租中 草青色
          color = '#8BC34A';
          this.setNextPayTime();
          break;
        case 3: // 续租 青色
        case 0: // 未生效
          color = '#4CAEB5';
          break;
        case 7: // 办理中 蓝色
        case 5: // 待审核
          color = '#5677FC';
          break;
        case 10: // 预定取消 灰色
        case 2: // 解约
          color = '#797979';
          break;
        case 8: // 预定 --绿色
        case 9: // 驳回
          color = '#4CB58F';
          break;
        default:
          break;
      }
      return color;
    },
    // 跳转电子合同或账单
    toNext (type) {
      if (type === 'bill') {
        this.$store.commit('change_Action', 'push');
        this.$router.push({
          path: '/sales/leaseBill',
          query: {
            id: this.leaseid
          }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.v_mainContainer.skipRem {
  height: calc(100% - 113px);
}
.v_block {
  padding-bottom: 30px;
  .title {
    display: flex;
    align-items: center;
    color: #ffffff;
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
.red {
  color: red;
  font-weight: 600;
}
</style>
