<template>
  <mu-paper class="v_block" :z-depth="1">
    <div class="step_them v_ellipsis">{{text}}：{{roomMsg}}</div>
  </mu-paper>
</template>
<script>
export default {
  data () {
    return {
      text: ''
    };
  },
  created () {
    let status = this.$route.query.type;
    this.text = this.setText(status);
  },
  computed: {
    roomMsg () {
      return this.$store.state.sales.roomMsgName;
    }
  },
  methods: {
    setText (state) {
      let str = '';
      switch (state) {
        case 1:
          str = '新租';
          break;
        case 2:
          str = '续租';
          break;
        case 3:
          str = '退租';
          break;
        case 4:
          str = '预定';
          break;
        case 5:
          str = '变更';
          break;
        default:
          break;
      }
      return str;
    }
  }
};
</script>
<style lang="less" scoped>
.v_block {
  padding-bottom: 0;
  .step_them {
    padding: 10px 20px;
    font-size: 16px;
  }
}
</style>
