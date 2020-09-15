<template>
  <section class="v_page">
    <!-- 顶部导航条 -->
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000" v-show="step<2">
      <mu-button icon slot="left" @click="goBack">
        <mu-icon value="close"></mu-icon>
      </mu-button>
      预定 ({{step+1}}/3)
    </mu-appbar>
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000" v-show="step>=2">
      <div slot="default" class="finsh_topNav">签约完成</div>
    </mu-appbar>
    <!-- 主内容区 -->
    <div class="v_mainContainer skipRem" :class="{changRsize:resizeChange}">
      <!-- step1 -->
      <div v-if="step===0">
        <form-customer-msg @addStep="increaseStep" @minusStep="minishStep"></form-customer-msg>
      </div>
      <!-- step2 -->
      <div v-if="step===1">
        <prev-reserve-two  @addStep="increaseStep" @minusStep="minishStep" @getLeaseId="setLeaseId"></prev-reserve-two>
      </div>
      <!-- step3 -->
      <mu-paper class="v_block" :z-depth="1" v-if="step===2">
        <reserve-order :ownLeaseId="leaseId" @addStep="increaseStep" @minusStep="minishStep"></reserve-order>
      </mu-paper>
    </div>
  </section>
</template>
<script>
import FormCustomerMsg from '../components/FormCustomerMsg';
import PrevReserveTwo from './children/PrevReserveTwo';
import ReserveOrder from '../components/ReserveOrder';
export default {
  components: {
    ReserveOrder,
    FormCustomerMsg,
    PrevReserveTwo
  },
  data () {
    return {
      step: 0,
      leaseId: ''
    };
  },
  computed: {
    roomMsg: function () {
      return this.$store.state.sales.roomParams;
    },
    resizeChange: function () {
      return this.$store.state.reiseChange;
    }
  },
  methods: {
    // 回到上一级菜单
    goBack () {
      this.$confirm(
        '返回后填写的数据将不会被保存请确认是否继续？',
        '提示'
      ).then(val => {
        if (val.result) {
          this.$store.commit('change_Action', 'pop');
          this.$router.go(-1);
        }
      });
    },
    // 改变不当前step 增加
    increaseStep () {
      this.step += 1;
    },
    // 减小
    minishStep () {
      this.step -= 1;
    },
    // 保存租约id？
    setLeaseId (val) {
      this.leaseId = val;
    }
  }
};
</script>
<style lang="less" scoped>
.v_mainContainer.skipRem {
  height: calc(100% - 56px);
  padding-bottom: 70px;
  &.changRsize {
    padding-bottom: 0;
  }
}
.finsh_topNav {
  display: block;
  width: 100%;
  text-align: center;
}
</style>
