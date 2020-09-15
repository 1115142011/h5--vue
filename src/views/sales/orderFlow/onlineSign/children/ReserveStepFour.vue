<template>
  <div
    class="outerBox"
    v-loading="loading"
    :data-mu-loading-text="loadText"
  >
    <lease-title></lease-title>
    <mu-paper class="v_block" :z-depth="1">
      <mu-form ref="first_step" :model="formMsg" class="step_form">
        <div class="title" ref="test">请核对账单</div>
        <div class="attchMsg">一级优惠：{{level1Name?level1Name:'无'}}</div>
        <mu-form-item label="可选二级优惠" label-float prop="secondCoupon">
          <mu-select @click.native="getLeaseBenefit" v-model="formMsg.secondCoupon" full-width>
            <mu-option
              v-for="(item,index) in options2"
              :key="index"
              :label="item.name"
              :value="item.planId"
              ripple
            ></mu-option>
          </mu-select>
        </mu-form-item>
      </mu-form>
    </mu-paper>
    <!-- 账单 -->
    <div class="bill">
      <mu-expansion-panel v-for="(item,index) in billArr" :key="'item'+index">
        <div slot="header" class="panel_title">
          <span
            class="title_tag"
            :class="[item.payStatus === 0 ? 'yellow' : 'blue']"
          >{{item.payStatusMsg}}</span>
          <div class="title_text v_ellipsis">
            <span class="font_weight">{{(item.period)+' / '+(item.totalPeriod)}}期</span>
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
    <!-- 按钮 -->
    <mu-paper class="form_footer_btn" :z-depth="4">
      <mu-button color="#fdd835" textColor="#333333" @click="changeStep('prev')" class="leftBtn">上一步</mu-button>
      <mu-button color="#fdd835" textColor="#333333" @click="changeStep('next')">下一步</mu-button>
    </mu-paper>
  </div>
</template>
<script>
import { getLeaseBenefitLeveTow, getLeaseBill } from '@/api/salesApi';
import LeaseTitle from '../../components/LeaseTitle';

export default {
  props: ['newLeaseId'],
  components: { LeaseTitle },
  data () {
    return {
      loading: false,
      loadText: '生成账单中...',
      billArr: [], // 账单数据
      formMsg: {
        secondCoupon: undefined // 二级优惠
      },
      level1Name: '', // 一级优惠名
      // 二级优惠参数
      options2: [
        {
          name: '无',
          planId: 'xxx'
        }
      ]
    };
  },
  created () {
    this.formMsg = Object.assign(
      this.formMsg,
      JSON.parse(JSON.stringify(this.$store.state.sales.leaseFormData))
    );
    this.level1Name = this.formMsg.level1Name;
    this.getBill();
  },
  methods: {
    // 获取二级优惠
    getLeaseBenefit () {
      if (this.options2.length === 1) {
        this.loadText = '加载中...';
        this.loading = true;
        let obj = {
          leaseId: this.newLeaseId
        };
        getLeaseBenefitLeveTow(obj).then(res => {
          this.loading = false;
          this.options2 = this.options2.concat(res.data.benefits);
        });
      }
    },
    // 获取账单
    getBill () {
      this.loading = true;
      this.loadText = '生成账单中...';
      let obj = {
        leaseId: this.newLeaseId,
        benefitPlanId: this.formMsg.secondCoupon === 'xxx' ? '' : this.formMsg.secondCoupon
      };
      getLeaseBill(obj).then(res => {
        this.loading = false;
        this.billArr = res.data.custPayBills;
      });
    },
    // 按钮点击
    changeStep (direction) {
      if (direction === 'next') {
        this.$store.commit('sales/writeInFormData', this.formMsg);
        this.$emit('addStep');
      } else {
        this.$emit('minusStep');
      }
    }
  },
  watch: {
    'formMsg.secondCoupon': {
      handler: function (newVal, oldVal) {
        this.billArr = [];
        this.getBill();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.outerBox {
  padding-bottom: 30px;
  .v_block {
    padding-bottom: 0;
    .step_them {
      padding: 10px 20px;
      font-size: 16px;
    }
  }
}
.step_form {
  margin-top: 20px;
  padding: 20px 20px;
  .title {
    font-size: 14px;
    font-weight: 600;
  }
  .attchMsg {
    padding: 10px 0;
  }
  /deep/.mu-form-item {
    margin-bottom: 0;
  }
}
.bill {
  margin-top: 10px;
  width: 100%;
  /deep/.mu-expansion-panel-header {
    padding: 10px 25px 10px 15px;
  }
  //按钮样式重写
  /deep/.mu-expansion-toggle-btn {
    padding: 0;
    width: auto;
    margin-right: -20px;
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
