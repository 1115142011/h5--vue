<template>
    <div class="maintain">
        <mu-appbar class="fixed" style="width: 100%;" color="#fdd835" z-depth="5" textColor="#000">
            <mu-button @click="back" icon slot="left">
                <mu-icon size="30" value="keyboard_backspace"></mu-icon>
            </mu-button>
            完成(3/4)
        </mu-appbar>
        <div class="space"></div>
        <div class="addFeel">
            <div class="eachRow">
                <span>租客姓名</span>
                <span>{{orderInfo.name}}</span>
            </div>
            <div class="eachRow">
                <span>联系电话</span>
                <span>{{orderInfo.mobile}}</span>
            </div>
            <!-- <mu-text-field class="code" label="租客验证码" v-model="authCode"></mu-text-field> -->
            <div class="addBottom">
                <!-- <span @click="call" class="mr20 blue">拨打电话</span>
                <span @click="toOther" class="mr20">未拨通</span> -->
            </div>
        </div>
        <div class="bottom">
            <span v-if="orderType!='unCall'" @click="back" class="blue">上一步</span>
            <mu-button class="ml20" color="#fdd835" @click='next' textColor="#000">下一步</mu-button>
        </div>
    </div>
</template>

<script>
import { code, check, orderDetail } from '@/api/maintainApi';
export default {
  data () {
    return {
      onClick: false,
      orderInfo: {},
      authCode: ''
    };
  },
  methods: {
    back () {
      this.$router.go(-1);
    },
    call () {
      let orderId = this.orderInfo.orderId;
      let page = this;
      code(orderId).then(res => {
        if (res.code === 200) {
          window.location.href = 'tel:' + page.orderInfo.mobile;
        }
      });
    },
    toOther () {
      let page = this;
      //   let orderType = this.orderType
      if (page.orderType === 'unCall') {
        // let para = page.orderInfo
        page.$router.go(-1);
      } else {
        let para = JSON.parse(localStorage.getItem('finishInfo'));
        para.orderId = page.orderId;
        para.checkResult = 1;
        check(para).then(res => {
          if (res.code === 200) {
            page.$router.push('/callFailed');
          }
        });
      }
    },
    next () {
      if (this.onClick) return;
      this.onClick = true;
      let page = this;
      if (page.orderType === 'unCall') {
        let para = page.orderInfo;
        para.authCode = page.authCode;
        check(para).then(res => {
          this.onClick = false;
          if (res.code === 200) {
            page.$router.push('/finishFour');
          }
        })
          .catch(errMsg => {
            this.onClick = false;
          });
      } else {
        let para = JSON.parse(localStorage.getItem('finishInfo'));
        para.authCode = page.authCode;
        para.orderId = page.orderId;
        para.checkResult = 1;
        check(para).then(res => {
          this.onClick = false;
          if (res.code === 200) {
            page.$router.push('/finishFour');
          }
        })
          .catch(errMsg => {
            this.onClick = false;
          });
      }
    }
  },
  created () {
    let orderType = localStorage.getItem('orderType');
    let orderId = localStorage.getItem('orderId');
    this.orderId = orderId;
    this.orderType = orderType;
    let page = this;
    if (orderType === 'unCall') {
      let para = {
        id: orderId
      };
      orderDetail(para).then(res => {
        if (res.code === 200) {
          let orderInfo = {};
          orderInfo.orderId = orderId;
          orderInfo.checkResult = res.data.checkResult;
          orderInfo.checkType = res.data.checkType;
          orderInfo.mobile = res.data.mobile;
          orderInfo.name = res.data.name;
          page.orderInfo = orderInfo;
        }
      });
    } else {
      page.orderInfo = JSON.parse(localStorage.getItem('orderInfo'));
    }
  }
};
</script>

<style lang='less' scoped>
.addFeel {
    text-align: center;
}

.code {
    margin: 10px 0;
    width: 80%;
}

.bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    display: flex;
    padding: 10px;
    align-items: center;
    justify-content: flex-end;
    box-shadow: 5px 5px 5px 5px rgba(16, 16, 16, 0.3);
}

.eachRow {
    width: 80%;
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.addFeel {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 95%;
    margin: 20px auto;
    background: #fff;
    border-radius: 10px !important;
    margin-bottom: 76px;
    box-shadow: 0px 2px 2px 0px rgba(16, 16, 16, 0.3);
}

.addBottom {
    display: flex;
    justify-content: flex-end;
    height: 46px;
    line-height: 46px;
    width: 100%;
    border-top: 1px solid rgba(0, 0, 0, .12);
}
</style>
