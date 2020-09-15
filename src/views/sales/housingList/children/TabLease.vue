<template>
  <div v-if="leaseParam" class="lease_outer_box">
    <!-- 在组中的租约 -->
    <mu-paper class="leaseBox v_block" :z-depth="1" v-if="leaseParam.rent_mode===1&&myData">
      <div class="them_title">
        <span>合同信息</span>
        <div class="btn_box">
          <span class="circle" @click="toLeaseBill(myData)">账单</span>
          <span class="circle" @click="examineContract(myData)">电子合同</span>
          <span class="circle" @click="goPartner"  v-if="myData.fellows.length>0" >同住人</span>

        </div>
      </div>
      <div class="msg_container">
        <div class="item">
          <span class="leftText v_ellipsis">签约销售</span>
          <span class="rightText v_ellipsis">{{myData.saler}}</span>
        </div>
        <div class="item">
          <span class="leftText v_ellipsis">租客姓名</span>
          <span class="rightText ">{{myData.customer.name}}</span>
        </div>
        <div class="item">
          <span class="leftText v_ellipsis">身份证号</span>
          <span class="rightText ">{{myData.customer.idCard}}</span>
        </div>
        <div class="item">
          <span class="leftText v_ellipsis">手机号</span>
          <span class="rightText ">{{myData.customer.mobile}}</span>
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
            :style="setColor(myData.status)"
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
        <div class="relation_box" v-if="myData.emergContact">
           <div class="category_title">紧急联系人</div>
            <div class="item">
            <span class="leftText v_ellipsis">与签约人关系</span>
            <span class="rightText  v_ellipsis">{{judgePartner(myData.emergContact.relation)}}</span>
          </div>
          <div class="item">
            <span class="leftText v_ellipsis">姓名</span>
            <span class="rightText v_ellipsis">{{myData.emergContact.name}}</span>
          </div>
          <div class="item">
            <span class="leftText v_ellipsis">电话</span>
            <span class="rightText v_ellipsis">{{myData.emergContact.mobile}}</span>
          </div>
        </div>
      </div>
    </mu-paper>
    <!----------- 预定状态的租约 ------------->
    <mu-paper class="v_block" :z-depth="1" v-if="leaseParam.rent_mode===0">
      <reserve-order :btn="false" :titleType="'detail'" @getUserMsg="keepMsg" :ownLeaseId="leaseParam.lease_id"></reserve-order>
    </mu-paper>
  </div>
</template>
<script>
import ReserveOrder from '@/views/sales/orderFlow/components/ReserveOrder';
import { getRoomLease, leaseContract } from '@/api/salesApi';
import Moment from 'moment';

export default {
  components: { ReserveOrder },
  props: ['leaseParam'],
  data () {
    return {
      myData: '',
      customer: null,
      costData: '',
      hint: '逾x天',
      hintStatue: false
    };
  },
  created () {
    if (this.leaseParam.rent_mode === 1) {
      this.getLease(this.leaseParam.lease_id);
    }
  },
  methods: {
    // 查看电子合同
    examineContract (data) {
      // 0纸质合同 1电子合同
      if (data.electFlag) {
        leaseContract(data.lease_id).then(res => {
          window.location.href = res.data.url;
          // this.$router.push({
          //   path: '/sales/Contract',
          //   params: {
          //     url: res.data.url
          //   }
          // });
        });
      } else {
        this.$toast.warning('该租约没有电子合同，如需查看请联系管理员！');
      }
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
    // 获取租约信息
    getLease (leaseId) {
      getRoomLease(leaseId).then(res => {
        this.myData = res.data.lease;
        this.customer = res.data.lease.customer;
        this.costData = this.setListData(this.myData.lease_costs);
        this.setNextPayTime(this.myData.next_pay_date);
      });
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
    // 根据租约状态设置颜色
    setColor (state) {
      let color = '#cccccc';
      switch (state) {
        case 5:
          color = 'red'; // 红色
          break;
        case 6:
        case 9:
          color = '#f57f17'; // 黄色
          break;
        case 7:
        case 8:
        case 1:
          color = '#5677FC'; // 蓝色
          break;
        default:
          break;
      }
      return `color:${color}`;
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
    // 跳转账单
    toLeaseBill (data) {
      this.$store.commit('change_Action', 'push');
      this.$router.push({
        path: '/sales/leaseBill',
        query: {
          id: data.lease_id,
          type: data.electFlag
        }
      });
    },
    // 判断同住人的关细
    judgePartner (value) {
      let str = '--';
      switch (value) {
        case 1:
          str = '朋友';
          break;
        case 2:
          str = '家人';
          break;
        case 3:
          str = '情侣';
          break;
        case 4:
          str = '同事';
          break;
        default:
          break;
      }
      return str;
    },
    // 保存租客信息
    keepMsg (obj) {
      this.customer = obj;
    },
    // 跳转同住人页面
    goPartner () {
      this.$store.commit('sales/setpartnerArry', this.myData.fellows);
      this.$router.push('/sales/partner');
    }
  }
};
</script>
<style lang="less" scoped>
.leaseBox {
  padding: 20px 0;
  .them_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px 8px;
    font-size: 16px;
    font-weight: 600;
    border-bottom: solid #cccccc 1px;
    .btn_box {
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: 500;
      color: #797979;
      .circle {
        padding: 5px 10px;
        margin-left: 10px;
        border: solid 1px #cccccc;
        border-radius: 12px;
      }
    }
  }
  .msg_container {
    padding: 5px;
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
        user-select: text;
        -webkit-user-select:text;
      }
    }
    .discount_box {
      .item {
        padding: 5px 15px;
      }
    }
  }
}

.blue {
  color: #5677fc;
}
.yellow {
  color: #f57f17;
}
.red {
  color: red;
}
</style>
