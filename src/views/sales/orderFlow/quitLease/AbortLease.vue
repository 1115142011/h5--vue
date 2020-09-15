<template>
  <section class="v_page">
    <!-- 顶部导航条 -->
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000" v-show="step<2">
      <mu-button icon slot="left" @click="goBack">
        <mu-icon value="close"></mu-icon>
      </mu-button>
      退租 ({{step+1}}/3)
    </mu-appbar>
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000" v-show="step===2">
      <div slot="default" class="finsh_topNav">退租申请完成</div>
    </mu-appbar>
    <!-- 主内容区 -->
    <div class="v_mainContainer skipRem" :class="{changRsize:resizeChange}">
      <!-- step1 -->
        <quit-step-one v-if="step===0" @addStep="increaseStep" @minusStep="minishStep"></quit-step-one>
      <!-- step2 -->
      <div v-if="step===1">
        <quit-step-two @addStep="increaseStep" @minusStep="minishStep"></quit-step-two>
      </div>
      <!-- step3 -->
      <div v-if="step===2">
        <quit-step-three @addStep="increaseStep" @minusStep="minishStep"></quit-step-three>
      </div>
    </div>
  </section>
</template>
<script>
import QuitStepOne from './children/QuitStepOne';
import QuitStepTwo from './children/QuitStepTwo';
import QuitStepThree from './children/QuitStepThree';

export default {
  components: { QuitStepOne, QuitStepTwo, QuitStepThree },
  data () {
    return {
      step: 0,
      roomParams: undefined
    };
  },
  created () {
    this.roomParams = this.$store.state.sales.roomParams;
  },
  computed: {
    roomMsg: function () {
      return this.$store.state.sales.roomParams;
    },
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
    this.$store.commit('sales/initquitFormData');
  }
};
</script>
<style lang="less" scoped>
.v_mainContainer.skipRem {
   height: calc(100% - 56px);
   padding-bottom: 70px;
  &.changRsize {
    padding: 0;
  }
  .v_block {
    padding-bottom: 0;
  }
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
