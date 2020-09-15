<template>
  <span class="titleIcon" :style="setBgColor(state)">{{text}}</span>
</template>
<script>
export default {
  props: {
    state: {
      type: Number,
      default: 2
    }
  },
  computed: {
    text () {
      return this.setText(this.state);
    }
  },
  methods: {
    // 设置徽标颜色
    setBgColor (state) {
      let color = '#cccccc';
      switch (state) {
        case 0:
          color = '#FF6D7F';
          break;
        case 1:
          color = '#8BC34A';
          break;
        case 6:
        case 2:
          color = '#8BC34A';
          break;
        case 5:
          color = '#5677FC';
          break;
        case 10000:
          color = '#4CAEB5';
          break;
        default:
          break;
      }
      return `background:${color}`;
    },
    // 过滤状态文本
    setText (number) {
      let str = '下';
      switch (number) {
        case 0:
          str = '空';
          break;
        case 1:
          str = '租';
          break;
        case 6:
        case 2:
          str = '预';
          break;
        case 5:
          str = '办';
          break;
        case 10000:
          str = '提前';
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
.titleIcon {
  display: inline-block;
  color: #ffffff;
  padding: 5px;
  text-align: center;
  line-height: 16px;
  border-radius: 6px;
  transform: scale(0.75);
}
</style>
