<template>
  <section>
    <lease-title></lease-title>
    <mu-paper class="v_block" :z-depth="1">
      <mu-form ref="step_form" :model="formMsg" class="step_form">
        <div class="title" ref="test">请登记租约信息</div>
        <mu-form-item label="优惠选择" prop="level1BenefitPlanId" label-float>
          <mu-select v-model="formMsg.level1BenefitPlanId" full-width>
            <mu-option
              v-for="(item,index) in benefits"
              :key="'item'+index"
              :label="item.name"
              :value="item.planId"
              ripple
            ></mu-option>
          </mu-select>
        </mu-form-item>
         <mu-form-item label="合同类型" prop="leaseType" :rules="leaseTypeValidate" label-float>
          <mu-select v-model="formMsg.leaseType" full-width :disabled='formMsg.leaseType===3'>
            <mu-option
              v-for="(item,index) in leaseTypeOptions"
              :key="'item'+index"
              :label="item.name"
              :value="item.value"
              :disabled="item.value===3"
              ripple
            ></mu-option>
          </mu-select>
        </mu-form-item>
        <mu-form-item label="租客来源" label-float prop="custSource" :rules="message" v-if="!isRelet">
          <mu-select chips v-model="formMsg.custSource" full-width>
            <mu-option
              v-for="(item,index) in customerSource"
              :key="'item'+index"
              :label="item.name"
              :value="item.value"
              ripple
            ></mu-option>
          </mu-select>
        </mu-form-item>
        <!-- 转介绍额外必填信息 -->
        <div class="attch_msg" v-if="formMsg.custSource==='5'||formMsg.custSource==='11'">
          <mu-form-item label="推荐人姓名" prop="recommend.name" :rules="message">
            <mu-text-field v-model="formMsg.recommend.name" full-width></mu-text-field>
          </mu-form-item>
          <mu-form-item label="推荐人职业" prop="recommend.career" :rules="message">
            <mu-text-field v-model="formMsg.recommend.career" full-width></mu-text-field>
          </mu-form-item>
          <mu-form-item
            label="租客租住房间"
            v-if="formMsg.custSource==='5'"
            prop="recommend.room_name"
            :rules="message"
          >
            <mu-text-field
              v-model="formMsg.recommend.room_name"
              @focus="selectSponsor($event)"
              full-width
            ></mu-text-field>
          </mu-form-item>
          <mu-form-item label="推荐人电话" prop="recommend.mobile" :rules="phoneNumber">
            <mu-text-field v-model="formMsg.recommend.mobile" full-width></mu-text-field>
          </mu-form-item>
          <mu-form-item label="推荐人银行卡号" prop="recommend.bankAccount" :rules="bankCard">
            <mu-text-field
              v-model="formMsg.recommend.bankAccount"
              full-width
              @input="backCardHandler($event)"
            ></mu-text-field>
          </mu-form-item>
          <mu-form-item label="开户行" prop="recommend.bank" :rules="message">
            <mu-text-field v-model="formMsg.recommend.bank" full-width ></mu-text-field>
          </mu-form-item>
        </div>
        <div class="timeBox">
          <mu-form-item label="合同开始时间" prop="beginDate" label-float :rules="message">
            <mu-date-input
              @change="startDateChange"
              v-model="formMsg.beginDate"
              format="YYYY-MM-DD"
              action-icon="date_range"
              :should-disable-date="startDateDisable"
              :disabled="isRelet"
              no-display
              full-width
            ></mu-date-input>
          </mu-form-item>
          <span class="cutOff">-</span>
          <mu-form-item
            label="合同结束时间"
            prop="endDate"
            label-float
            :help-text="'房源截止：'+roomMsg.house_info.expire_date.replace(/\-/g,'.')"
            :rules="endTimeRules"
          >
            <mu-date-input
              v-model="formMsg.endDate"
              no-display
              full-width
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              action-icon="date_range"
              :should-disable-date="endDisableDate"
            ></mu-date-input>
          </mu-form-item>
        </div>
        <mu-form-item>
          <div class="step_btn">
            <!-- <mu-button color="primary" small class="timeBtn" @click="addLeaseEndTime(6)">6个月</mu-button> -->
            <mu-button
              color="primary"
              small
              class="timeBtn btnSpace"
              @click="addLeaseEndTime(12)"
            >12个月</mu-button>
            <mu-button
              color="primary"
              small
              class="timeBtn"
              @click="addLeaseEndTime(roomMsg.house_info.expire_date)"
            >到房源截止</mu-button>
          </div>
        </mu-form-item>
        <mu-form-item label="租期时长">
          <mu-text-field v-model="leaseTime" disabled></mu-text-field>
        </mu-form-item>
        <mu-form-item label="付款方式" label-float prop="payMode" :rules="message">
          <mu-select v-model="formMsg.payMode" full-width>
            <mu-option
              v-for="(item,index) in payOptions"
              :key="index"
              :label="item.name"
              :value="item.value"
              v-show="item.show"
              ripple
            ></mu-option>
          </mu-select>
        </mu-form-item>
        <!-- 补充约定 -->
            <mu-form-item label="合同补充协议：" prop="additionalInfo">
           <mu-text-field v-model="formMsg.additionalInfo" multi-line :rows-max="30" :rows="2"    placeholder="甲方xxx"  full-width></mu-text-field>
          </mu-form-item>

            <!-- <textarea  v-model="additionalInfo"  class="textarea" placeholder="备注：xxx"></textarea> -->
      </mu-form>
    </mu-paper>
    <mu-paper class="form_footer_btn" :z-depth="4" v-show="!resizeChange">
      <mu-button color="#fdd835" textColor="#333333" @click="changeStep('prev')" class="leftBtn">上一步</mu-button>
      <mu-button color="#fdd835" textColor="#333333" @click="changeStep('next')">下一步</mu-button>
    </mu-paper>
    <introducer-model
      v-if="openDialog"
      :show.sync="openDialog"
      @changeData="changeTagsData"
      :keyWords="formMsg.recommend.name"
    ></introducer-model>
  </section>
</template>
<script>
import { getLeaseBenefitLeveOne, getLeaseCatalog } from '@/api/salesApi';
import IntroducerModel from './IntroducerModel';
import LeaseTitle from './LeaseTitle';
import Moment from 'moment';
export default {
  components: { IntroducerModel, LeaseTitle },
  data () {
    return {
      openDialog: false, // 选取租约弹框状态
      message: [{ validate: val => !!val, message: '该选项为必填项' }],
      leaseTypeValidate: [{ validate: (val) => {
        return val >= 0 && val <= 3;
      },
      message: '请选择合同类型' }],
      phoneNumber: [
        { validate: val => !!val, message: '该选项为必填项' },
        {
          validate: val => /^1[3456789]\d{9}$/.test(val),
          message: '请填写正确的电话号码'
        }
      ],
      bankCard: [
        { validate: val => !!val, message: '该选项为必填项' },
        {
          validate: val => /^\d{16}|\d{19}$/.test(val.replace(/\s*/g, '')),
          message: '请填写正确的银行卡卡号'
        }
      ],
      // 合同结束日期 合同时长验证
      endTimeRules: [
        { validate: val => !!val, message: '该选项为必填项' },
        {
          validate: (val, model) => {
            if (val && model.beginDate) {
              let roomEndtime = Moment(
                this.roomMsg.house_info.expire_date + ' 23:59:59'
              );
              let end = Moment(val + ' 23:59:59');
              let roomResidue = Math.ceil(roomEndtime.diff(end, 'days', true)); // 租约结束日期与房源结束日期的差值
              return roomResidue >= 0;
            } else {
              return true;
            }
          },
          message: '不能超出房源截止日期'
        },
        {
          validate: (val, model) => {
            let flag = false;
            if (val && model.beginDate) {
              let roomEndtime = Moment(
                this.roomMsg.house_info.expire_date + ' 23:59:59'
              );
              // 表单填写的开始时间
              let start = Moment(model.beginDate);
              // 表单填写的结束时间
              let end = Moment(val + ' 23:59:59');
              // 租期时长有多少个月--整数月
              let calcDiffMonths = end.diff(start, 'month');
              // 计算租期时长除去整数月还剩多少天
              let daysDiffBegin = start.add(calcDiffMonths, 'M');
              let diffDays = Math.ceil(end.diff(daysDiffBegin, 'days', true));
              // 计算表单填写的结束日期的那个月最后一天是几号
              let monthLastDate = parseInt(end.endOf('month').format('DD'));
              // 当余下的天数大于30或者等于本月的最后一天时 时长月数+1
              calcDiffMonths =
                diffDays === monthLastDate || diffDays >= 30
                  ? calcDiffMonths + 1
                  : calcDiffMonths;
              // 判断结束日期月份是否是3月--二月份日期不准确补正
              let currentMouth = Moment(end).month() + 1;
              if (Number(currentMouth) === 3) {
                let FebLastDay = Moment(end).month(Moment(end).month() - 1).endOf('month').format('DD');
                if (diffDays === Number(FebLastDay)) {
                  diffDays = 0;
                  calcDiffMonths = calcDiffMonths + 1;
                }
              }
              // 租约结束日期与房源结束日期的差值--以天为单位
              let roomResidue = Math.ceil(roomEndtime.diff(end, 'days', true));
              // 当租约结束日期与房源截止日期相差小月3天,则放行 否则判断是否满足最短租约要求
              flag =
                roomResidue <= 3
                  ? true
                  : calcDiffMonths >= this.minDurationTime;
            }
            if (!flag) {
              this.$toast.warning(`租期时长不少于${this.minDurationTime}个月`);
            }
            return flag;
          },
          message: `租期时长不合格`
        }
      ],
      formMsg: {
        leaseId: '',
        leaseType: undefined,
        electSignFlag: 1,
        submitType: 0,
        level1BenefitPlanId: undefined,
        custSource: '', // 客户来源
        beginDate: undefined, // 开始时间
        endDate: undefined, // 截止时间
        timeDuration: '', // 租期时长，
        payMode: undefined, // 付款方式,
        additionalInfo: '', // 补充约定
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
      },
      // 租客来源参数
      customerSource: [],
      // 一级优惠信息参数
      benefits: [
        {
          min_cust_pay_type: 3,
          min_rent_period: 12,
          name: '无',
          planId: 'xxx'
        }
      ],
      // 合同类型数据
      leaseTypeOptions: [
        {
          name: '新租',
          value: 0
        },
        {
          name: '换租',
          value: 1
        },
        {
          name: '转租',
          value: 2
        },
        {
          name: '续租',
          value: 3
        }
      ],
      // 支付周期
      payOptions: [],
      // 租期时长暂存
      leaseTime: '',
      // 租期时长阈值暂存--单位月默认值12
      minDurationTime: 12,
      // 月付方式阈值暂存
      minPayPeriod: 3
    };
  },
  computed: {
    roomMsg () {
      return this.$store.state.sales.roomParams;
    },
    resizeChange () {
      return this.$store.state.reiseChange;
    },
    selectEndTime () {
      return this.formMsg.endDate;
    },
    isRelet () {
      return this.formMsg.leaseType === 3;
    }
  },
  created () {
    this.formMsg = Object.assign(
      this.formMsg,
      JSON.parse(JSON.stringify(this.$store.state.sales.leaseFormData))
    );
    if (!this.formMsg.custSource) {
      this.formMsg.custSource = '1';
    }
    this.getDiscountOne();
    this.getCustomerSource(); // 获取租客来源
    this.getCostTime(); // 获取支付周期
  },
  methods: {
    // 获取一级优惠信息
    getDiscountOne () {
      let param = {
        roomId: this.roomMsg.room_id,
        salerId: localStorage.getItem('personId')
      };
      getLeaseBenefitLeveOne(param).then(res => {
        this.benefits = this.benefits.concat(res.data.benefits);
      });
    },
    // 获取租客来源
    getCustomerSource () {
      getLeaseCatalog('CUST_SOURCE').then(res => {
        this.customerSource = res.data;
      });
    },
    // 获取收费周期表
    getCostTime () {
      getLeaseCatalog('PAY_TYPE').then(res => {
        this.payOptions = this.setOptionsDisabled(res.data, this.minPayPeriod);
      });
    },
    // 选择准介绍人租约
    selectSponsor (e) {
      this.openDialog = true;
    },
    // 转介绍人租约选定
    changeTagsData (obj) {
      this.formMsg.recommend.room_name = obj.room_name;
      this.formMsg.recommend.relationLeaseId = obj.lease_id;
      this.$refs.step_form.clear();
    },
    // 填写的银行卡号添加空格
    backCardHandler (value) {
      if (/\S{5}/.test(value)) {
        this.formMsg.recommend.bankAccount = value
          .replace(/\s/g, '')
          .replace(/(.{4})/g, '$1 ');
      }
    },
    // 合同开始日期禁用
    startDateDisable (date) {
      let minTime;
      let maxTime;
      if (this.roomMsg.lease_info) { // 预定的租约已生效
        minTime = Moment(this.roomMsg.lease_info.reserve_date);
        let continuous = Moment(this.roomMsg.lease_info.reserve_date + ' 23:59:59').add(4, 'days'); // 自己计算的5天
        let endtime = Moment(this.roomMsg.lease_info.expire_date + ' 23:59:59'); // 合同有效截止时间
        maxTime = continuous >= endtime ? continuous : endtime;
      } else { // 空置状态
        maxTime = Moment(minTime).add(5, 'days').format('YYYY-MM-DD');
        minTime = Moment().format('YYYY-MM-DD'); // 当前日期
      }
      return !Moment(date).isBetween(minTime, maxTime);// 判断是否在阈值之内
    },
    // 合同开始日期改变
    startDateChange () {
      this.formMsg.endDate = undefined;
    },
    // 结束日期禁用
    endDisableDate (date) {
      let mindate = new Date(this.formMsg.beginDate);
      let maxDate = new Date(this.roomMsg.house_info.expire_date);
      let now = date.getTime();
      return maxDate <= now || mindate >= now;
    },
    // 添加结束日期快捷操作
    addLeaseEndTime (val) {
      if (this.formMsg.beginDate) {
        if (typeof val === 'number') {
          this.formMsg.endDate = Moment(this.formMsg.beginDate)
            .add(val, 'month')
            .subtract(1, 'days')
            .format('YYYY-MM-DD');
        } else {
          this.formMsg.endDate = val;
        }
        this.$refs.step_form.clear();
      }
    },
    // 合同期时长计算
    setLeaseCycle (origin, terminal) {
      let start = Moment(origin);
      let end = Moment(terminal + ' 23:59:59');
      // 计算开始与结束相差多少个月/年
      let calcDiffMonths = end.diff(start, 'month');
      let diffYear = parseInt(calcDiffMonths / 12);
      let diffMonth = parseInt(calcDiffMonths) % 12;
      // 计算开始于结束减去相差的月份还有多少天
      let daysDiffBegin = start.add(calcDiffMonths, 'M');// 整月时间点的结束日期
      let diffDays = Math.ceil(end.diff(daysDiffBegin, 'days', true));
      // 结束时间月份的最后一天
      let monthLastDate = parseInt(end.endOf('month').format('DD'));
      // 判断结束日期月份是否是3月--二月份日期不准确补正
      let currentMouth = Moment(terminal).month() + 1;
      if (Number(currentMouth) === 3) {
        let FebLastDay = Moment(terminal).month(Moment(terminal).month() - 1).endOf('month').format('DD');
        if (diffDays === Number(FebLastDay)) {
          diffDays = 0;
          diffMonth = diffMonth + 1;
        }
      }
      // 多余天数大于等于当月最后一天，月分+1
      diffYear = diffYear ? diffYear + '年' : '';
      diffMonth = (diffDays === monthLastDate || diffDays >= 30) ? diffMonth + 1 + '个月' : diffMonth + '个月';
      diffDays = (diffDays === monthLastDate || diffDays >= 30) ? '0天' : diffDays + '天';
      return diffYear + diffMonth + diffDays;
    },
    // 支付方式禁用项计算
    setOptionsDisabled (arr, min) {
      if (!arr || arr.length.length === 0) return [];
      let tempArr = [];
      arr.forEach(item => {
        item.show = true;
        if (item.value < min) {
          item.show = false;
        }
        tempArr.push(item);
      });
      return tempArr;
    },
    // 按钮点击
    changeStep (direction) {
      if (direction === 'next') {
        this.$refs.step_form.validate().then(result => {
          if (result) {
            this.formMsg.level1BenefitPlanId =
              this.formMsg.level1BenefitPlanId === 'xxx'
                ? undefined
                : this.formMsg.level1BenefitPlanId;
            this.formMsg.beginDate = Moment(this.formMsg.beginDate).format('YYYY-MM-DD');
            this.$store.commit('sales/writeInFormData', this.formMsg);
            this.$emit('addStep');
          } else {
            this.$toast.error('信息填写不完整！请检查必填项');
          }
        });
      } else {
        this.$emit('minusStep');
      }
    }
  },
  watch: {
    selectEndTime: function (newVal, oldVal) {
      if (newVal) {
        this.leaseTime = this.setLeaseCycle(
          this.formMsg.beginDate,
          this.formMsg.endDate
        );
      }
    },
    minPayPeriod: function (newVal, oldVal) {
      this.formMsg.payMode = undefined;
      this.payOptions = this.setOptionsDisabled(this.payOptions, newVal);
    },
    'formMsg.level1BenefitPlanId': {
      handler: function (newVal, oldVal) {
        this.benefits.forEach(item => {
          if (item.planId === newVal) {
            this.minDurationTime = item.min_rent_period;
            this.minPayPeriod = item.min_cust_pay_type;
            this.formMsg.level1Name = item.name;
          }
        });
        this.$refs.step_form.clear();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.step_form {
  padding: 20px 20px 30px;
  .title {
    font-size: 14px;
    font-weight: 600;
  }
  .timeBox {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    & .cutOff {
      margin: 0 5px;
    }
  }
  .step_btn {
    width: 100%;
    margin-top: 15px;
    display: flex;
    align-items: center;
    .btnSpace {
      margin: 0 8px;
    }
  }
}
// 样式重写

/deep/.mu-raised-button {
  min-width: 60px;
}
/deep/.mu-form-item {
  margin-bottom: 0;
}
// 选项弹框样式调整
/deep/.selectDialog {
  border-radius: 8px;
  .mu-dialog-title {
    border-bottom: solid 1px #cccccc; // header 边框
  }
  .mu-dialog-body {
    padding-bottom: 0;
  }
  .mu-radio-label {
    font-size: 14px;
  }
  // 弹框底部样式重写
  .mu-dialog-actions {
    border-top: solid 1px #cccccc; // footer 边框线
  }
}
</style>
