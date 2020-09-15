<template>
  <section class="v_page">
    <!-- 顶部导航条 -->
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000" v-show="step<6">
      <mu-button icon slot="left" @click="goBack">
        <mu-icon value="close"></mu-icon>
      </mu-button>
      换租 ({{step+1}}/7)
    </mu-appbar>
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000" v-show="step>=6">
      <div slot="default" class="finsh_topNav">信息变更</div>
    </mu-appbar>
    <!-- 主内容区 -->
    <div class="v_mainContainer skipRem">
      <lease-title></lease-title>

      <!-- step1 -->
      <mu-paper class="v_block" :z-depth="1" v-if="step===0">
        <transform-step-one @addStep="increaseStep" @minusStep="minishStep"></transform-step-one>
      </mu-paper>
      <!-- step2 -->
      <mu-paper class="v_block" :z-depth="1" v-if="step===1">
        <transform-step-two @addStep="increaseStep" @minusStep="minishStep"></transform-step-two>
      </mu-paper>
      <!-- step3 -->
      <div v-if="step===2">
        <transform-step-three @addStep="increaseStep" @minusStep="minishStep"></transform-step-three>
      </div>
      <!-- step4 -->
      <mu-paper class="v_block" :z-depth="1" v-if="step===3">
        <transform-step-four @addStep="increaseStep" @minusStep="minishStep"></transform-step-four>
      </mu-paper>
      <!-- step5 -->
      <div v-if="step===4">
        <transform-step-five @addStep="increaseStep" @minusStep="minishStep"></transform-step-five>
      </div>
      <!-- step6 -->
      <div v-if="step===5">
        <transform-step-six @addStep="increaseStep" @minusStep="minishStep"></transform-step-six>
      </div>
      <!-- step7 -->
      <div v-if="step===6">
        <transform-step-Seven></transform-step-Seven>
      </div>
    </div>
  </section>
</template>
<script>
import TransformStepOne from './children/TransformStepOne';
import TransformStepTwo from './children/TransformStepTwo';
import TransformStepThree from './children/TransformStepThree';
import TransformStepFour from './children/TransformStepFour';
import TransformStepFive from './children/TransformStepFive';
import TransformStepSix from './children/TransformStepSix';
import TransformStepSeven from './children/TransformStepSeven';
import LeaseTitle from '../components/LeaseTitle';

export default {
  components: {
    TransformStepOne,
    TransformStepTwo,
    TransformStepThree,
    TransformStepFour,
    TransformStepFive,
    TransformStepSix,
    TransformStepSeven,
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
