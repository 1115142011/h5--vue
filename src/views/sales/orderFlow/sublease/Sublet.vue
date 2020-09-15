<template>
  <section class="v_page">
    <!-- 顶部导航条 -->
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000" v-show="step<6">
      <mu-button icon slot="left" @click="goBack">
        <mu-icon value="close"></mu-icon>
      </mu-button>
      转租 ({{step+1}}/7)
    </mu-appbar>
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000" v-show="step>=6">
      <div slot="default" class="finsh_topNav">信息变更</div>
    </mu-appbar>
    <!-- 主内容区 -->
    <div class="v_mainContainer skipRem">
      <lease-title></lease-title>

      <!-- step1 -->
      <mu-paper class="v_block" :z-depth="1" v-if="step===0">
        <sublet-step-one @addStep="increaseStep" @minusStep="minishStep"></sublet-step-one>
      </mu-paper>
      <!-- step2 -->
      <mu-paper class="v_block" :z-depth="1" v-if="step===1">
        <sublet-step-two @addStep="increaseStep" @minusStep="minishStep"></sublet-step-two>
      </mu-paper>
      <!-- step3 -->
      <div v-if="step===2">
        <sublet-step-three @addStep="increaseStep" @minusStep="minishStep"></sublet-step-three>
      </div>
      <!-- step4 -->
      <mu-paper class="v_block" :z-depth="1" v-if="step===3">
        <sublet-step-four @addStep="increaseStep" @minusStep="minishStep"></sublet-step-four>
      </mu-paper>
      <!-- step5 -->
      <div v-if="step===4">
        <sublet-step-five @addStep="increaseStep" @minusStep="minishStep"></sublet-step-five>
      </div>
      <!-- step6 -->
      <div v-if="step===5">
        <sublet-step-six @addStep="increaseStep" @minusStep="minishStep"></sublet-step-six>
      </div>
      <!-- step7 -->
      <div v-if="step===6">
        <sublet-step-Seven></sublet-step-Seven>
      </div>
    </div>
  </section>
</template>
<script>
import SubletStepOne from './children/SubletStepOne';
import SubletStepTwo from './children/SubletStepTwo';
import SubletStepThree from './children/SubletStepThree';
import SubletStepFour from './children/SubletStepFour';
import SubletStepFive from './children/SubletStepFive';
import SubletStepSix from './children/SubletStepSix';
import SubletStepSeven from './children/SubletStepSeven';
import LeaseTitle from '../components/LeaseTitle';
export default {
  components: {
    SubletStepOne,
    SubletStepTwo,
    SubletStepThree,
    SubletStepFour,
    SubletStepFive,
    SubletStepSix,
    SubletStepSeven,
    LeaseTitle
  },
  data () {
    return {
      step: 0
    };
  },
  computed: {
    roomMsg: function () {
      return this.$store.state.sales.roomParams;
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
      console.log('点击了下一步');
      this.step += 1;
    },
    // 减小
    minishStep () {
      this.step -= 1;
      console.log('点击了上一步');
    }
  }
};
</script>
<style lang="less" scoped>
.v_mainContainer.skipRem {
  height: calc(100% - 113px);
}
.finsh_topNav {
  display: block;
  width: 100%;
  text-align: center;
}
/deep/.mu-popover {
  max-width: 99%;
}
</style>
