<template>
  <section class="box" v-loading="submitLoading">
    <mu-paper :z-depth="2" class="v_block form_box">
      <div class="title">托管周期</div>
      <mu-form ref="step_form" :model="formMsg" class="step_form">
        <mu-form-item label="起始时间" prop="beginDate" label-float :rules="msgRules">
          <mu-date-input
            :disabled="formDisable"
            v-model="formMsg.beginDate"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            action-icon="date_range"
            full-width
          ></mu-date-input>
        </mu-form-item>
        <mu-form-item
          label="截止时间"
          label-float
          class="line-form-group"
          prop="endDate"
          :rules="msgRules"
        >
          <div class="left-box">
            <mu-date-input
              v-model="formMsg.endDate"
              :disabled="formDisable"
              full-width
              format="YYYY-MM-DD"
              :should-disable-date="startDateDisable"
              value-format="YYYY-MM-DD"
              action-icon="date_range"
            ></mu-date-input>
          </div>
          <div class="right-box">
            <div class="button">
              <mu-button color="primary" @click="addLeaseEndTime(1)" round full-width>一年</mu-button>
            </div>
            <div class="button">
              <mu-button color="primary" @click="addLeaseEndTime(3)" round full-width>三年</mu-button>
            </div>
          </div>
        </mu-form-item>
        <mu-form-item label="合同时长">
          <mu-text-field v-model="formMsg.leaseTime" disabled></mu-text-field>
        </mu-form-item>
        <div class="item-group">
          <mu-form-item label="类别" label-float prop="servFeeMode" class="item">
            <span>固定比率</span>
          </mu-form-item>
          <mu-form-item label="费率" label-float prop="servFee" class="item" :rules="numberRules">
            <mu-text-field pattern="[0-9]*" type="number" v-model="formMsg.servFee" suffix="%"></mu-text-field>
          </mu-form-item>
        </div>
        <mu-form-item prop="trustServ" class="item" :rules="trustServRules">
          <div slot="label" class="bold label">托管业务（多选）</div>
          <div class="tags-box">
            <mu-chip
              class="chip"
              :class="{select:formMsg.trustServ.indexOf(item.label)!=-1}"
              v-for="(item,index) in tags"
              @click="changeTrustServ(index,item)"
              :key="index+'i'"
            >{{item.label}}</mu-chip>
          </div>
        </mu-form-item>
        <mu-form-item prop="signMode" class="item">
          <div slot="label" class="bold label">签署信息</div>
          <div class="tags-box">
            <mu-chip
              class="chip"
              :class="{select:formMsg.signMode===item.value}"
              v-for="(item,index) in sourceType"
              @click="changeSignMode(item)"
              :key="index+'i'"
            >{{item.label}}</mu-chip>
          </div>
        </mu-form-item>
        <div v-if="formMsg.signMode===2">
          <mu-form-item label="委托人" label-float prop="signPerson" :rules="msgRules">
            <mu-text-field :disabled="formDisable" v-model="formMsg.signPerson" prop="signPerson"></mu-text-field>
          </mu-form-item>
          <mu-form-item label="身份证号" label-float prop="signPersonIdCard" :rules="userCard">
            <mu-text-field
              :disabled="formDisable"
              v-model="formMsg.signPersonIdCard"
              prop="signPersonIdCard"
              full-width
            ></mu-text-field>
          </mu-form-item>
          <mu-form-item label="联系电话" label-float prop="signPersonMobile" :rules="phoneNumber">
            <mu-text-field
              v-model="formMsg.signPersonMobile"
              :disabled="formDisable"
              pattern="[0-9]*"
              type="number"
              full-width
              prop="signPersonMobile"
            ></mu-text-field>
          </mu-form-item>
        </div>
      </mu-form>
    </mu-paper>
    <mu-paper class="footer_bar skipRem" :z-depth="4" v-show="!resizeChange">
      <div class="left-btn">
        <mu-button color="#B3B3B3" full-width textColor="#ffffff" @click="goStep('prev')">上一步</mu-button>
      </div>
      <div class="right-btn">
        <mu-button
          color="#fdd835"
          :disabled="submitLoading"
          full-width
          textColor="#333333"
          @click="goStep('next')"
        >{{ formMsg.subTrustType?'下一步':'提交信息'}}</mu-button>
      </div>
    </mu-paper>
    <search-house-model :open.sync="serachHouse"></search-house-model>
  </section>
</template>
<script>
import searchHouseModel from '../children/searchHouseModel';
import Moment from 'moment';
import { submitTrustMsg } from '@/api/proprietorApi';

export default {
  components: { searchHouseModel },
  data () {
    return {
      submitLoading: false,
      serachHouse: false,
      formMsg: {
        beginDate: undefined, // 开始时间
        endDate: undefined, // 结束时间
        servFeeMode: 1, // 托管服务费类型
        servFee: 10, // 托管服务费率
        trustServ: [], // 托管业务列表
        signMode: 1, // 签署人 1本人 2委托
        signPerson: '', // 签约人
        signPersonIdCard: '', // 签约人证件证号
        signPersonMobile: '', // 签约人联系电话
        houseId: '',
        subTrustType: false,
        leaseTime: '' // 租期时长
      },
      msgRules: [{ validate: val => !!val, message: '请填写该信息' }],
      trustServRules: [
        {
          validate: val => {
            return val.length > 0;
          },
          message: '请填写该信息'
        }
      ],
      numberRules: [
        {
          validate: val => {
            return /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(val);
          },
          message: '请输入>0正数'
        }
      ],
      phoneNumber: [
        { validate: val => !!val, message: '必须填写电话号码' },
        {
          validate: val => /^1[3456789]\d{9}$/.test(val),
          message: '请填写正确的电话号码'
        }
      ],
      userCard: [
        {
          validate: val => /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val),
          message: '身份证号码不正确'
        }
      ],
      costOptions: [
        {
          label: '固定比率',
          id: 1,
          disable: false,
          value: 0.1
        },
        {
          label: '浮动比率',
          id: 2,
          disable: true,
          value: 0.17
        }
      ],
      tags: [
        {
          label: '装修',
          selected: false
        },
        {
          label: '出租',
          selected: false
        },
        {
          label: '保洁',
          selected: false
        },
        {
          label: '维修',
          selected: false
        },
        {
          label: '代缴',
          selected: false
        }
      ],
      sourceType: [
        {
          label: '本人签署',
          value: 1
        },
        {
          label: '委托签署',
          value: 2
        }
      ]
    };
  },
  created () {
    this.formMsg = Object.assign(
      this.formMsg,
      JSON.parse(JSON.stringify(this.$store.state.proprietor.formParams))
    );
  },
  computed: {
    resizeChange () {
      return this.$store.state.reiseChange;
    },
    formDisable () {
      return this.formMsg.subTrustType;
    }
  },
  methods: {
    changeDate (value) {
      console.log('时间改变', value);
    },
    // 禁止输入框获取焦点
    openSearchModel (e) {
      e.target.blur();
      this.serachHouse = true;
    },
    // 底部按钮点击
    goStep (direction, stepNumber = 1) {
      if (direction === 'next') {
        this.$refs.step_form.validate().then(result => {
          if (result) {
            // 判断 书否已提交过
            if (this.formMsg.subTrustType) {
              this.$store.commit('proprietor/changeRegisterStep', {
                direction,
                stepNumber
              });
            } else {
              this.submitLoading = true;
              let param = {
                ...this.formMsg
              };
              param.servFee = +this.formMsg.servFee / 100;
              // 提交基本信息
              submitTrustMsg(param).then(res => {
                this.submitLoading = false;
                this.formMsg.subTrustType = true;
                this.formMsg.houseId = res.data.houseId;
                this.$store.commit('proprietor/writeFormParam', this.formMsg);
                this.$store.commit('proprietor/changeRegisterStep', {
                  direction,
                  stepNumber
                });
              });
            }
          }
        });
      } else {
        this.$store.commit('proprietor/changeRegisterStep', {
          direction,
          stepNumber
        });
      }
    },
    // 托管服务项目改变
    changeTrustServ (index, item) {
      if (this.formDisable) return;
      item.selected = !item.selected;
      this.formMsg.trustServ = [];
      this.tags.forEach(val => {
        if (val.selected) {
          this.formMsg.trustServ.push(val.label);
        }
      });
    },
    changeSignMode (item) {
      if (this.formDisable) return;
      this.formMsg.signMode = item.value;
    },
    // 合同开始日期禁用
    startDateDisable (date) {
      let minTime = Moment().format('YYYY-MM-DD');
      return Moment(minTime).isAfter(date);
    },
    // 添加结束日期快捷操作
    addLeaseEndTime (val) {
      if (this.formDisable) return;
      if (this.formMsg.beginDate) {
        if (typeof val === 'number') {
          this.formMsg.endDate = Moment(this.formMsg.beginDate)
            .add(val, 'year')
            .subtract(1, 'days')
            .format('YYYY-MM-DD');
        } else {
          this.formMsg.endDate = val;
        }
        this.$refs.step_form.clear();
      } else {
        this.$toast.warning('请填写起始时间');
      }
    },
    // 合同期时长计算
    setLeaseCalc (origin, terminal) {
      let start = Moment(origin);
      let end = Moment(terminal + ' 23:59:59');
      // 计算开始与结束相差多少个月/年
      let calcDiffMonths = end.diff(start, 'month');
      let diffYear = parseInt(calcDiffMonths / 12);
      let diffMonth = parseInt(calcDiffMonths) % 12;
      // 计算开始于结束减去相差的月份还有多少天
      let daysDiffBegin = start.add(calcDiffMonths, 'M'); // 整月时间点的结束日期
      let diffDays = Math.ceil(end.diff(daysDiffBegin, 'days', true));
      // 结束时间月份的最后一天
      let monthLastDate = parseInt(end.endOf('month').format('DD'));
      // 判断结束日期月份是否是3月--二月份日期不准确补正
      let currentMouth = Moment(terminal).month() + 1;
      if (Number(currentMouth) === 3) {
        let FebLastDay = Moment(terminal)
          .month(Moment(terminal).month() - 1)
          .endOf('month')
          .format('DD');
        if (diffDays === Number(FebLastDay)) {
          diffDays = 0;
          diffMonth = diffMonth + 1;
        }
      }
      // 多余天数大于等于当月最后一天，月分+1
      diffYear = diffYear || 0; // 年
      diffMonth =
        diffDays === monthLastDate || diffDays >= 30
          ? diffMonth + 1
          : diffMonth; // 月数
      diffDays = diffDays === monthLastDate || diffDays >= 30 ? 0 : diffDays; // 天数

      if (diffMonth >= 12) {
        diffYear += 1;
        diffMonth = 0;
      }

      return (
        (diffYear ? diffYear + '年' : '') + diffMonth + '个月' + diffDays + '天'
      );
    }
  },
  watch: {
    'formMsg.endDate': function (newVal, oldVal) {
      if (newVal && this.formMsg.beginDate) {
        this.formMsg.leaseTime = this.setLeaseCalc(
          this.formMsg.beginDate,
          this.formMsg.endDate
        );
      }
    },
    'formMsg.beginDate': function (newV, oldV) {
      if (newV && this.formMsg.endDate) {
        this.formMsg.leaseTime = this.setLeaseCalc(
          this.formMsg.beginDate,
          this.formMsg.endDate
        );
      }
    },
    'formMsg.signMode': function (newV, oldV) {
      if (newV === 1) {
        this.formMsg.signPerson = ''; // 签约人
        this.formMsg.signPersonIdCard = ''; // 签约人证件证号
        this.formMsg.signPersonMobile = ''; // 签约人联系电话
      }
    }
  }
};
</script>
<style lang="less" scoped>
.box {
  margin-bottom: 20px;
}
.title {
  font-weight: bold;
}
.form_box {
  padding: 15px 26px;
}
.item-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .item {
    flex: 1;
    margin-right: 10px;
  }
}
.tags-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .chip {
    margin-right: 5px;
    margin-top: 5px;
  }
  .select {
    background: #448aff;
    color: #ffffff;
  }
}
.line-form-group {
  .left-box {
    flex: 5;
  }
  .right-box {
    display: flex;
    align-items: center;
    flex: 4;
    .explanation {
      height: 34px;
      width: 80px;
      border-bottom: solid 1px #0000001f;
    }
    .button {
      width: 55px;
      margin-left: 5px;
      border-radius: 12px;
      /deep/.mu-button {
        margin: 0;
        min-width: 55px;
        height: 32px;
        .mu-button-wrapper {
          padding-left: 0;
          padding-right: 0;
        }
      }
    }
  }
}
.label {
  font-size: 12px;
  color: #000000;
}
/deep/.mu-form-item {
  margin-bottom: 0;
}
</style>
