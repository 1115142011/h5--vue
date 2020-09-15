<template>
  <div class="title">{{msg}}</div>
</template>
<script>
export default {
  name: 'titleMsg',
  props: ['msg']
};
</script>
<style lang="less" scoped>
.title {
  margin: 0;
  padding: 0;
  width: 100%;
  padding: 10px;
  padding-left: 20px;
  border-bottom: solid 1px #cccccc;
  font-size: 16px;
  font-weight: 500;
}
</style>
