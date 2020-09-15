<template>
  <div class="title-box">
    <mu-icon class="icon" :value="icon" :size="20" color="#009DBC"></mu-icon>
    <span class="text v_ellipsis">{{text}}</span>
    <span class="fixed-tag" v-if="showTag">{{stateName}}</span>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: '像素公寓托管房源..（房源名称获取失败）'
    },
    icon: {
      type: String,
      default: 'location_city'
    },
    stateName: {
      type: String,
      default: '全托管'
    },
    showTag: {
      type: Boolean,
      default: true
    }
  }
};
</script>
<style lang="less" scoped>
.title-box {
  display: flex;
  align-items: center;
  padding: 20px 10px 20px 20px;
  border-bottom: solid 1px #e1e1e1;
  position: relative;
}
.icon {
  margin-right: 5px;
}
.text {
  font-size: 14px;
  font-weight: bold;
  color: #666666;
}
.fixed-tag{
  position: absolute;
  right: 0;
  top: 0;
  background: #C0F38D;
  color: #51BB30;
  font-size: 12px;
  padding: 0 10px;
  border-bottom-left-radius:8px ;
}
</style>
