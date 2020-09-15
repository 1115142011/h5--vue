<template>
  <section class="v_page">
    <!-- 顶部导航条 -->
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000" v-show="step<6">
      <mu-button icon slot="left" @click="goBack">
        <mu-icon value="close"></mu-icon>
      </mu-button>
      在线签约 ({{step+1}}/7)
    </mu-appbar>
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000" v-show="step>=6">
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
        <form-lease-base-msg @addStep="increaseStep" @minusStep="minishStep"></form-lease-base-msg>
      </div>
      <!-- step3 -->
      <div v-if="step===2">
        <form-lease-cost-msg
          @addStep="increaseStep"
          @minusStep="minishStep"
          @getNewLeaseId="keepLeaseId"
        ></form-lease-cost-msg>
      </div>
      <!-- step4 -->
      <div v-if="step===3">
        <reserve-step-four @addStep="increaseStep" @minusStep="minishStep" :newLeaseId="newLeaseId"></reserve-step-four>
      </div>
      <!-- step5 -->
      <div v-if="step===4">
        <form-room-devices @addStep="increaseStep" @minusStep="minishStep"></form-room-devices>
      </div>
      <!-- step6 -->
      <div v-if="step===5">
        <reserve-step-six @addStep="increaseStep" :leaseid="newLeaseId"></reserve-step-six>
      </div>
      <!-- step7 -->
      <div v-if="step===6">
        <reserve-step-seven></reserve-step-seven>
      </div>
    </div>
  </section>
</template>
<script>
import FormCustomerMsg from '../components/FormCustomerMsg';
import FormLeaseBaseMsg from '../components/FormLeaseBaseMsg';
import FormLeaseCostMsg from '../components/FormLeaseCostMsg';
import ReserveStepFour from './children/ReserveStepFour';
import FormRoomDevices from '../components/FormRoomDevices';
import ReserveStepSix from './children/ReserveStepSix';
import ReserveStepSeven from './children/ReserveStepSeven';

export default {
  components: {
    FormCustomerMsg,
    FormLeaseBaseMsg,
    FormLeaseCostMsg,
    ReserveStepFour,
    FormRoomDevices,
    ReserveStepSix,
    ReserveStepSeven
  },
  data () {
    return {
      step: 0,
      newLeaseId: ''
    };
  },
  computed: {
    resizeChange () {
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
    // 保存新生成的租约id
    keepLeaseId (val) {
      this.newLeaseId = val;
    },
    // 改变不当前step 增加
    increaseStep () {
      this.step += 1;
    },
    // 减小
    minishStep () {
      this.step -= 1;
    }
  },
  beforeDestroy () {
    this.$store.commit('sales/initleaseFormData');
  }
};
</script>
<style lang="less" scoped>
.v_mainContainer.skipRem {
  height: calc(100% - 56px);
  padding-bottom: 70px;
  &.changRsize {
    // height: calc(100% - 113px);
     padding-bottom: 0;
  }
}
.v_topNav {
  display: flex;
  align-items: center;
}
.finsh_topNav {
  display: block;
  width: 100%;
  text-align: center;
}
/deep/.mu-form-item {
  margin-bottom: 0;
}
</style>
