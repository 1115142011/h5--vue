<template>
  <section class="lineList sales">
    <div class="itemBox" v-for="(item,index) in listData" :key="index">
      <span class="text">{{item.house_name}}</span>
      <span class="number" :style="initColor(index)">{{item.free_day?item.free_day:0}}</span>
      <div class="no_data" v-if="!listData||listData.length===0">暂无数据~</div>
    </div>
  </section>
</template>
<script>
export default {
  name: 'VacancyList',
  props: ['listData'],
  methods: {
    initColor (i) {
      let opacity = 1 - i / 10;
      if (i === 0) {
        return `color:rgb(226, 89, 89, ${opacity});fontWeight:bold;`;
      } else {
        return `color:rgb(226, 89, 89, ${opacity});`;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.lineList {
  width: 100%;
  padding: 0 25px 10px;
  font-size: 12px;
  color: #000000;
  .itemBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
    .number {
      font-size: 14px;
    }
  }
  .no_data {
    width: 100%;
    padding-top: 40px;
    text-align: center;
    color: #797979;
    font-size: 14px;
  }
}
</style>
