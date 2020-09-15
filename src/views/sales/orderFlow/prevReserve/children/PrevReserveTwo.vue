<template>
  <section v-loading="loading" data-mu-loading-text="加载中...">
    <lease-title></lease-title>
    <mu-paper class="v_block" :z-depth="1">
      <mu-form ref="step_form" :model="formMsg" class="step_form">
        <div class="title" ref="test">{{$store.state.sales.roomParams.full_name}}</div>
        <div class="user_msg">
          <div class="msg_row">
            <span class="left_msg">预定人</span>
            <span class="right_msg">{{customer.name}}</span>
          </div>
          <div class="msg_row">
            <span class="left_msg">支付有效期</span>
            <span class="right_msg column">
              <span>{{startTime}}至</span>
            <span>  {{endTime}}</span>
            </span>
          </div>
          <mu-form-item
            label="定金"
            label-float
            prop="pricing"
            :rules="pricing"
            :help-text="'定金不小于'+minPrice+'元'"
          >
            <mu-text-field
              v-model="formMsg.pricing"
              @input="testVal($event,'pricing')"
              full-width
            ></mu-text-field>
          </mu-form-item>
        </div>

        <!-- 步骤按钮 -->
        <mu-paper class="form_footer_btn" :z-depth="4">
          <mu-button
            color="#fdd835"
            textColor="#333333"
            @click="changeStep('prev')"
            class="leftBtn"
            v-show="!resizeChange"
          >上一步</mu-button>
          <mu-button color="#fdd835" textColor="#333333" @click="changeStep('next')">下一步</mu-button>
        </mu-paper>
      </mu-form>
    </mu-paper>
  </section>
</template>
<script>
import Moment from 'moment';
import { generateReserveOrder, generateInadvanceOrder } from '@/api/salesApi';
import LeaseTitle from '../../components/LeaseTitle';
export default {
  components: { LeaseTitle },
  data () {
    return {
      onClick: false,
      loading: false,
      endTime: '',
      startTime: '',
      status: undefined, // 区分预定状态 1 提前预定 other 预定
      pricing: [
        { validate: val => !!val, message: '该选项为必填项' },
        {
          validate: val => val >= this.minPrice,
          message: '金额必须大于最低要求'
        }
      ],
      formMsg: {
        pricing: ''
      }
    };
  },
  computed: {
    customer () {
      return this.$store.state.sales.customer;
    },
    minPrice () {
      let type = this.$store.state.sales.roomParams.code.toLowerCase();
      return type === 'z' ? 500 : 200;
    },
    resizeChange () {
      return this.$store.state.reiseChange;
    }
  },
  created () {
    this.status = this.$route.query.status;
    this.endTime = this.getSpell();
    this.startTime = Moment().format('YYYY.MM.DD  HH:mm');
  },
  methods: {
    // 按钮点击
    changeStep (direction) {
      if (this.onClick) return;
      this.onClick = true;
      if (direction === 'next') {
        this.$refs.step_form.validate().then(result => {
          if (result) {
            this.loading = true;
            let param = {
              roomId: this.$store.state.sales.roomParams.room_id,
              customer: this.$store.state.sales.customer,
              bond: this.formMsg.pricing,
              sellerId: localStorage.getItem('personId'),
              seller: localStorage.getItem('personName')
            };
            if (this.status) {
              this.createdInadvance(param);
            } else {
              this.createdReserveOrder(param);
            }
          }
        });
      } else {
        this.$emit('minusStep');
      }
    },
    // 生成租约有效时间
    getSpell () {
      let endTime = Moment()
        .add(12, 'hour')
        .format('YYYY.MM.DD  HH:mm');
      return endTime;
    },
    // 创建预定租约
    createdReserveOrder (param) {
      generateReserveOrder(param).then(res => {
        this.loading = false;
        this.onClick = false;
        this.$emit('getLeaseId', res.data.reserveId);
        this.$emit('addStep');
      });
    },
    // 创建提前预定的租约
    createdInadvance (param) {
      generateInadvanceOrder(param)
        .then(res => {
          this.loading = false;
          this.onClick = false;
          this.$emit('getLeaseId', res.data.reserveId);
          this.$emit('addStep');
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 输入时替换非数字字符
    testVal (val, key) {
      this.formMsg[key] = val.replace(/\D/gi, '');
    }
  }
};
</script>
<style lang="less" scoped>
.step_form {
  padding-bottom: 20px;
  .title {
    font-size: 16px;
    padding: 10px 20px;
    color: #000000;
    border-bottom: solid 1px #cccccc;
  }
  .user_msg {
    padding: 20px 40px;
    .msg_row {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 0;
      .left_msg {
        width: 40%;
        font-size: 14px;
        font-weight: 600;
      }
      .right_msg {
        width: 60%;
      }
    }
  }
  /deep/.mu-form-item {
    margin-bottom: 0;
  }
  .column{
    display: flex;
    flex-direction: column;
  }
}
</style>
