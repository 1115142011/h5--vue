<template>
  <section class="v_page" v-loading="loading" data-mu-loading-text="加载中...">
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000">
      <mu-button icon slot="left" @click="goBack">
        <mu-icon value="arrow_back"></mu-icon>
      </mu-button>账单信息
    </mu-appbar>
    <!-- 账单 -->
    <section class="v_mainContainer skipRem">
      <div class="bill">
        <mu-expansion-panel v-for="(item,index) in billArr" :key="'item'+index">
          <div slot="header" class="panel_title">
            <span
              class="title_tag"
              :class="[item.payStatus === 0 ? 'yellow' : 'blue']"
            >{{item.payStatus===0?'未支付':'已支付'}}</span>
            <div class="title_text v_ellipsis">
              <span class="font_weight">{{(item.period?item.period:'--')+' / '+(item.totalPeriod)}}期</span>
              <span class="time_msg v_ellipsis">结算时间：{{item.payableDate}}</span>
            </div>
            <div class="right_price">￥{{item.amount}}</div>
          </div>
          <div slot="default" class="panel_content">
            <div class="list_item" v-for="(val,index ) in item.itemList" :key="index+'list'">
              <div class="title_text v_ellipsis">
                <span class="font_weight listTitle">{{val.itemName}}</span>
                <span class="time_msg v_ellipsis">{{val.beginDate + ' ~ '+ val.endDate }}</span>
              </div>
              <div class="right_price listPrice">￥{{val.amount}}</div>
            </div>
          </div>
        </mu-expansion-panel>
      </div>
      <div class="v_footerHint" v-if="(!billArr||billArr.length===0)&&!loading">抱歉没有查到账单~请联系管理员</div>
    </section>
  </section>
</template>
<script>
import { queryLeaseBill, queryOldLeaseBill } from '@/api/salesApi';

export default {
  data () {
    return {
      loading: false,
      billArr: [] // 账单数
    };
  },
  created () {
    let leaseId = this.$route.query.id;
    let type = this.$route.query.type;
    this.getBill(leaseId, type);
  },
  methods: {
    // 获取账单
    getBill (leaseId, type) {
      this.loading = true;
      // type 0-旧合同 ， -1 新合同
      if (type) {
        queryLeaseBill(leaseId).then(res => {
          this.loading = false;
          this.billArr = res.data.custPayBills;
        });
      } else {
        queryOldLeaseBill(leaseId).then(res => {
          this.loading = false;
          this.billArr = res.data.financeBills;
        });
      }
    },
    // 回到上一级菜单
    goBack () {
      this.$store.commit('change_Action', 'pop');
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less" scoped>
.bill {
  margin-top: 10px;
  width: 100%;
  padding-bottom: 20px;
  /deep/.mu-expansion-panel-header {
    padding: 10px 25px 10px 15px;
  }
  //按钮样式重写
  /deep/.mu-expansion-toggle-btn {
    padding: 0;
    width: auto;
    margin-right: -20px;
  }
  /deep/.mu-icon-button {
    height: 24px;
  }
  .list_item,
  .panel_title {
    width: 100%;
    display: flex;
    align-items: center;
    .title_tag {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      font-size: 12px;
      line-height: 40px;
      white-space: nowrap;
      text-align: center;
      color: #ffffff;
    }
    .title_text {
      height: 100%;
      flex: 8;
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      .font_weight {
        font-size: 16px;
        color: #000000;
      }
      .time_msg {
        font-size: 12px;
        color: #797979;
      }
      .listTitle {
        font-size: 14px;
      }
    }
    .right_price {
      flex: 2;
      font-size: 16px;
      color: #797979;
    }
    .yellow {
      background: #f57f17;
    }
    .blue {
      background: #5677fc;
    }
    .listPrice {
      color: #000000;
    }
  }
  .panel_content {
    .time_msg {
      padding: 5px 0;
      transform: scale(0.8) translateX(-12%);
    }
  }
}
</style>
