<template>
  <section
    class="quit_wrap"
    v-loading="loading"
    data-mu-loading-text="加载中..."
  >
    <lease-title></lease-title>
    <mu-paper class="v_block" :z-depth="1">
      <mu-form ref="step_form" :model="formMsg" class="step_form">
        <div class="title" ref="test">填写退租信息</div>
        <mu-form-item label="退租时间" label-float prop="checkoutDate" :rules="message">
          <mu-date-input
            v-model="formMsg.checkoutDate"
            no-display
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :should-disable-date="endDisableDate"
            action-icon="date_range"
            full-width
          ></mu-date-input>
        </mu-form-item>
        <mu-form-item label="退租类型" label-float prop="selectCheckoutType" :rules="message">
          <mu-select chips v-model="formMsg.selectCheckoutType" full-width>
            <mu-option
              v-for="(item,index) in typeOptions"
              :key="index"
              :label="item.label"
              :value="item"
              ripple
            ></mu-option>
          </mu-select>
        </mu-form-item>
        <mu-form-item label="退租方式" label-float prop="refundType" :rules="message">
          <mu-select chips v-model="formMsg.refundType" full-width>
            <mu-option
              v-for="(item,index) in wayOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
              ripple
            ></mu-option>
          </mu-select>
        </mu-form-item>
        <!-- --银行卡退租 -->
        <div v-if="formMsg.refundType===2">
          <mu-form-item label="退款银行卡号" label-float prop="refundBankAccount" :rules="bankCard">
            <mu-text-field
              v-model="formMsg.refundBankAccount"
              @input="bankCardTest($event,'refundBankAccount')"
              full-width
              prop="bankCard"
            ></mu-text-field>
          </mu-form-item>
          <mu-form-item label="开户行" label-float prop="refundBank" :rules="message">
            <mu-text-field v-model="formMsg.refundBank" full-width ></mu-text-field>
          </mu-form-item>
          <mu-form-item label="银行卡户名" label-float prop="refundAccountName" :rules="message">
            <mu-text-field
              v-model="formMsg.refundAccountName"
              full-width
            ></mu-text-field>
          </mu-form-item>
        </div>
      </mu-form>
    </mu-paper>

    <mu-paper class="form_footer_btn" :z-depth="4" v-show="!resizeChange">
      <mu-button color="#fdd835" textColor="#333333" @click="changeStep('next')">下一步</mu-button>
    </mu-paper>
  </section>
</template>
<script>
import { getQuitLeaseType, getQuitLeaseID } from '@/api/salesApi';
import LeaseTitle from '../../components/LeaseTitle';
export default {
  components: { LeaseTitle },
  data () {
    return {
      loading: false,
      roomParams: undefined, // 缓存的房间参数
      // 退租方式参数
      wayOptions: [
        {
          label: '结算中心',
          value: 3
        },
        {
          label: '蘑菇',
          value: 1
        },
        {
          label: '银行卡',
          value: 2
        }
      ],
      // 退租类型参数
      typeOptions: [],
      message: [{ validate: val => !!val, message: '该选项为必填项' }],
      bankCard: [
        { validate: val => !!val, message: '该选项为必填项' },
        {
          validate: val => /^\d{16}|\d{19}$/.test(val.replace(/\s*/g, '')),
          message: '请填写正确的银行卡卡号'
        }
      ],
      formMsg: {
        checkoutId: '',
        checkoutDate: undefined, // 退租时间
        selectCheckoutType: undefined, // 退租类型
        recheckoutType: 0, // 0 默认不是 1 是退租驳回再次提交
        refundType: undefined, // 退租方式--银行卡，结算中心
        refundBankAccount: '', // 退款账号
        refundBank: '', // 退款开户行
        refundAccountName: '' // 退款户名
      }
    };
  },
  computed: {
    resizeChange () {
      return this.$store.state.reiseChange;
    },
    roomMsg () {
      return this.$store.state.sales.roomParams;
    }
  },
  created () {
    let leaseid = this.$route.query.id;
    if (this.$route.query.isAgan) {
      this.formMsg.checkoutDate = localStorage.getItem('outTime');
    }
    this.getcheckoutId(leaseid);
  },
  methods: {
    // 获取退租id
    getcheckoutId (leaseid) {
      this.loading = true;
      let obj = {
        leaseId: leaseid || this.roomMsg.lease_info.lease_id
      };
      getQuitLeaseID(obj).then(res => {
        this.loading = false;
        this.formMsg.checkoutId = res.data.checkoutId;
        // 处理结算方式-- 不一致
        if (this.$route.query.isAgan) {
          this.getQuitType(this.formMsg.checkoutDate);
        }
      });
    },
    // 获取退租类型
    getQuitType (date) {
      let obj = {
        checkoutId: this.formMsg.checkoutId,
        checkoutDate: date
      };
      getQuitLeaseType(obj).then(res => {
        this.typeOptions = res.data;
      });
    },
    // 日期禁用处理
    endDisableDate (date) {
      let minDate;
      if (this.$route.query.isAgan) { // 退租重新发起判定
        let oldTime = localStorage.getItem('outTime');
        minDate = this.Moment(oldTime).format('YYYY-MM-DD HH:mm:ss');
      } else {
        minDate = this.Moment().subtract(2, 'days').format('YYYY-MM-DD');
      }
      return this.Moment(date).isBefore(minDate);
    },
    // 银行卡号处理
    bankCardTest (value, key) {
      if (/\S{5}/.test(value)) {
        this.formMsg[key] = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ');
      }
    },
    // 按钮点击
    changeStep (direction) {
      if (direction === 'next') {
        this.$refs.step_form.validate().then(result => {
          if (result) {
            this.formMsg.checkoutType = this.formMsg.selectCheckoutType.value;
            this.formMsg.typeName = this.formMsg.selectCheckoutType.label;
            this.$store.commit('sales/mergeQuitFormData', this.formMsg);
            this.$emit('addStep');
          }
        });
      } else {
        this.$emit('minusStep');
      }
    }
  },
  watch: {
    'formMsg.checkoutDate': {
      handler: function (newVal, oldVal) {
        if (!this.formMsg.checkoutId) return;
        this.formMsg.selectCheckoutType = undefined;
        this.getQuitType(newVal);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.quit_wrap {
  .step_form {
    width: 100%;
    height: 100%;
    padding: 20px 20px 50px;
    .title {
      font-size: 14px;
      font-weight: 600;
    }
    /deep/.mu-form-item {
      margin-bottom: 0;
    }
  }
}
</style>
