<template>
  <div
    class="box"
    v-loading="true"
    data-mu-loading-text="加载中..."
  ></div>
</template>
<script>
export default {
  created () {
    this.$router.go(-1);
  }
};
</script>
<style lang="less" scoped>
.box {
  width: 100%;
  height: 100%;
}
</style>
