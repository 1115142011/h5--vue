<template>
  <div class="title">
    <span class="nameMsg" :class="{weight:weight}">{{msg.name}}</span>
    <div class="smileFont">
      <span>本月目标：{{msg.target}}</span>
      <span class="lastTag">达成率：{{msg.finsh}}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    msg: {
      type: Object
    },
    weight: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style lang="less" scoped>
.title {
  width: 100%;
  padding: 6px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #cccccc;
  .nameMsg {
    font-size: 16px;
    color: #333333;
    &.weight {
      font-weight: 600;
    }
  }
  .smileFont {
    color: #919191;
    font-size: 12px;
    padding-top: 5px;
  }
  .lastTag {
    margin-left: 20px;
  }
}
</style>
