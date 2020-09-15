<template>
  <section class="v_page">
    <!-- 顶部导航条 -->
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000">
      <mu-button icon slot="left" @click="goBack">
        <mu-icon value="close"></mu-icon>
      </mu-button>房源登记
    </mu-appbar>
    <!-- 主内容区 -->
    <div class="v_mainContainer skipRem" ref="container" :class="{maxBox:resizeChange}">
      <mu-paper class="v_block step-box" v-if="step>0&&step<=7" :z-depth="1">
        <house-title :text="houseName"></house-title>
        <self-steper></self-steper>
      </mu-paper>
      <form-house-base-msg v-if="step===0"></form-house-base-msg>
      <form-owner-msg v-if="step===1"></form-owner-msg>
      <form-escrow-period v-if="step===2"></form-escrow-period>
      <form-pricing v-if="step===3"></form-pricing>
      <form-charge-group v-if="step===4"></form-charge-group>
      <form-charge v-if="step===5"></form-charge>
      <form-expendNorm v-if="step===6"></form-expendNorm>
      <add-house-image v-if="step===7"></add-house-image>
      <mu-paper class="v_block" v-if="step>7" :z-depth="1">
        <house-title :text="houseName"></house-title>
        <div class="finsh-pic-box center">
          <img :src="fins_pic" class="finsh-pic" alt />
          <div class="hint-msg">房源已成功提交</div>
        </div>
        <div class="botton-box">
          <mu-button color="#FDD835" textColor="#594B0D" @click="backList">返回列表</mu-button>
          <mu-button class="m-left" flat color="primary" @click="godetail">查看详情</mu-button>
        </div>
      </mu-paper>
    </div>
  </section>
</template>
<script>
import formHouseBaseMsg from './children/formHouseBaseMsg';
import formOwnerMsg from './children/formOwnerMsg';
import selfSteper from '../../components/selfSteper';
import houseTitle from '../../components/houseTitle';
import formEscrowPeriod from './children/formEscrowPeriod';
import formPricing from './children/formPricing';
import formCharge from './children/formCharge';
import addHouseImage from './children/addHouseImage';
import formChargeGroup from './children/formChargeGroup';
import formExpendNorm from './children/formExpendNorm';
export default {
  components: {
    formHouseBaseMsg,
    formOwnerMsg,
    selfSteper,
    houseTitle,
    formEscrowPeriod,
    formPricing,
    formCharge,
    addHouseImage,
    formChargeGroup,
    formExpendNorm
  },
  data () {
    return {
      fins_pic: require('@/assets/images/trusteeship_sc.svg')
    };
  },
  computed: {
    step () {
      return this.$store.state.proprietor.registerStep;
    },
    resizeChange () {
      return this.$store.state.reiseChange;
    },
    houseName () {
      return this.$store.state.proprietor.editHouseName;
    }
  },
  methods: {
    // 返回上一级
    goBack () {
      this.$router.go(-1);
    },
    // 返回列表
    backList () {
      this.$router.push('/proprietor');
    },
    // 跳转详情
    godetail () {
      this.$router.push({
        path: '/proprietor/houseDetails',
        query: {
          houseId: this.$store.state.proprietor.formParams.houseId
        }
      });
    }
  },
  watch: {
    step: function () {
      this.$refs.container.scrollTop = 0;
    }
  },
  beforeDestroy () {
    this.$store.commit('proprietor/resetRegisterStep');
    this.$store.commit('proprietor/resetFormParam');
  }
};
</script>
<style lang="less" scoped>
.v_mainContainer {
  &.skipRem {
    height: calc(100% - 110px);
  }
  &.maxBox{
     height: calc(100% - 56px);
  }
}
.finsh-pic-box {
  height: 154px;
  flex-direction: column;
  .finsh-pic {
    width: 85px;
    height: 55px;
  }
  .hint-msg {
    margin-top: 10px;
    font-weight: bold;
  }
}
.botton-box {
  display: flex;
  align-items: center;
  width: 90%;
  margin: 0 auto;
  padding: 20px 0;
  border-top: solid 1px #e3e3e3;
  .m-left {
    margin-left: 5px;
  }
}
.step-box{
  padding-bottom: 0;
}
</style>
