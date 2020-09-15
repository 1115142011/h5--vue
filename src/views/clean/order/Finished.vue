<template>
  <div class="card" :style="`background-color: ${mainColor[item.type]}`">
    <div class="mainInfo">
      <div class="type">{{cleanTypeStats[item.type]}}</div>
      <div class="houseName">{{item.houseName+'—'+item.areaName}}</div>
      <div class="iconRight"></div>
    </div>
    <div class="details">
      <img :src="require('@/assets/images/u608.gif')">
      <div class="mainText">保洁完成，辛苦啦～</div>
      <div class="controlPanel">
        <mu-button
          color="warning"
          class="button"
          textColor="#000"
          @click="goList"
        >返回列表</mu-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['item'],
  data () {
    return {
      cleanTypeStats: { 1: '日常', 2: '空房', 3: '退租', 4: '品质' },
      mainColor: { 1: '#7475FF', 2: '#FF6174', 3: '#AA78DE', 4: '#2196f3' }
    };
  },
  methods: {
    goList () {
      this.$router.push('/clean');
    }
  }
};
</script>

<style lang="less" scoped>
.card {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 2px 2px 0px rgba(16, 16, 16, 0.3);
  .mainInfo {
    position: relative;
    padding: 8px 16px 8px 8px;
    .type,
    .houseName,
    .iconRight {
      display: inline-block;
      color: #fff;
    }
    .type {
      border-radius: 99px;
      background: rgba(16, 16, 16, 0.3);
      opacity: .7;
      padding: 4px 12px;
    }
    .houseName {
      margin-left: 8px;
      font-size: 14px;
      opacity: .9;
    }
    .iconRight {
      position: absolute;
      top: 14px;
      right: 12px;
      border-right: 2px solid #fff;
      border-bottom: 2px solid #fff;
      height: 10px;
      width: 10px;
      opacity: .7;
      transform: rotate(-45deg);
    }
  }
  .details {
    position: relative;
    background: #fff;
    padding: 16px;
    text-align: center;
    img {
      width: 35%;
      margin: 60px 0 20px;
    }
    .mainText {
      font-size: 20px;
      font-weight: 600;
      color: #3B7FFF;
      margin-bottom: 20px;
    }
  }
  .controlPanel {
    padding-top: 16px;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid grey;
  }
}
</style>
