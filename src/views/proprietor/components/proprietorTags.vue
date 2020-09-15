<template>
  <div class="tag_box">
    <div
      class="badge center"
      :class="{isBold:item.isBold}"
      v-for="(item,index) in tagsArray"
      :key="index+'s'"
      :style="{color:item.color,background:item.bg}"
    >
      <span class="text">{{item.text}}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    tagsArray: {
      type: Array,
      default: function () {
        return [];
      }
    }
  }
};
</script>
<style lang="less" scoped>
.tag_box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.badge {
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 3px;
  margin-bottom: 3px;
  padding-top: 2px;
  font-size: 12px;
  margin-top: 6px;
  margin-right: 6px;
}
.isBold{
  font-weight: bold;
}
</style>
