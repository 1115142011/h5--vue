<template>
  <div class="tag small">
    <span class="tagItem activity"   v-for="(item,index) in tagsArr" :key="index">{{item.name}}</span>
  </div>
</template>
<script>
export default {
  props: ['tagsArr']
};
</script>
<style lang="less" scoped>
// 标签
.tag {
  width: 110%;
  display: flex;
  flex-wrap: wrap;
  min-height: 10px;
  .tagItem {
    font-size: 12px;
    padding: 3px 6px;
    background: #eeeeee;
    margin: 5px 5px;
    border-radius: 3px;
    color: #797979;
    &.activity{
      background: #FDD835;
      color: #000000;
    }
  }
}
.small {
  transform: scale(0.83) translateX(-10%);
}
</style>
