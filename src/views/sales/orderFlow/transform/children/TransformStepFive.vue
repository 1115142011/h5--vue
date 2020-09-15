<template>
  <div class="outerBox">
    <mu-paper class="v_block" :z-depth="1">
      <mu-form ref="first_step" :model="formMsg" class="step_form">
        <div class="title" ref="test">请核对账单</div>
        <div class="attchMsg">一级优惠：【军安5-1-1601】可短租</div>
        <mu-form-item label="可选二级优惠">
          <mu-select chips v-model="formMsg.secondCoupon" full-width>
            <mu-option
              v-for="(item,index) in options2"
              :key="index"
              :label="item.lable"
              :value="item.value"
              ripple
            ></mu-option>
          </mu-select>
        </mu-form-item>
      </mu-form>
    </mu-paper>
    <!-- 账单 -->
    <div class="bill">
      <mu-expansion-panel v-for="(item,index) in arr" :key="index">
        <div slot="header" class="panel_title">
          <span class="title_tag" :class="setClass(index)">待支付</span>
          <div class="title_text v_ellipsis">
            <span class="font_weight">1/12期</span>
            <span class="time_msg v_ellipsis">结算时间：2019.12.21</span>
          </div>
          <div class="right_price">￥950</div>
        </div>
        <div slot="default" class="panel_content">
          <div class="list_item">
            <div class="title_text v_ellipsis">
              <span class="font_weight listTitle">租客押金</span>
              <span class="time_msg v_ellipsis">结算时间：2019.12.21</span>
            </div>
            <div class="right_price listPrice">￥950</div>
          </div>
        </div>
      </mu-expansion-panel>
    </div>
    <!-- 按钮 -->
    <mu-paper class="btn" :z-depth="4" v-show="showBtn">
      <mu-button color="#fdd835" textColor="#333333" @click="changeStep('prev')" class="leftBtn">上一步</mu-button>
      <mu-button color="#fdd835" textColor="#333333" @click="changeStep('next')">下一步</mu-button>
    </mu-paper>
  </div>
</template>
<script>
export default {
  data () {
    return {
      arr: [1, 1, 1, 1, 1, 1],
      showBtn: true,
      usernameRules: [
        { validate: val => !!val, message: '必须填写用户名' },
        { validate: val => val.length >= 3, message: '用户名长度大于2' }
      ],
      formMsg: {
        secondCoupon: '' // 二级优惠
      },
      options2: [
        // 租客来源参数
        {
          lable: '二级优惠卷1',
          value: 1
        },
        {
          lable: '优惠卷2',
          value: 2
        },
        {
          lable: '超级大礼包',
          value: 3
        },
        {
          lable: '国庆活动总价立减300',
          value: 4
        }
      ]
    };
  },
  methods: {
    setClass (number) {
      let classList = ['yellow', 'blue', 'green'];
      return classList[number % 3];
    },
    submit () {
      this.$refs.first_step.validate().then(result => {
        console.log('form valid: ', result);
      });
    },
    // 按钮点击
    changeStep (direction) {
      if (direction === 'next') {
        this.$emit('addStep');
      } else {
        this.$emit('minusStep');
      }
    }
  }
};
</script>
<style lang="less" scoped>
.outerBox {
  padding-bottom: 30px;
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
  /deep/.mu-expansion-panel-header {
    padding: 5px 20px;
    border-radius: 10px;
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
    .green {
      background: #8bc34a;
    }
    .listPrice {
      color: #000000;
    }
  }
}
.btn {
  width: 100%;
  padding: 10px;
  text-align: right;
  left: 0;
  position: fixed;
  bottom: 0;
  & .leftBtn {
    margin-right: 10px;
  }
}
</style>
