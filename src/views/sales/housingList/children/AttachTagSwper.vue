<template>
  <swiper :options="swiperOption" ref="mySwiper">
    <swiper-slide class="slidBox" v-for="(item,index) in list" :key="index">
      <mu-chip
        class="demo-chip"
        :selected="current !==undefined"
        :class="{selected:current===index}"
        @click="selectTag(index)"
      >{{item.name}}</mu-chip>
    </swiper-slide>
  </swiper>
</template>
<script>
export default {
  props: ['list', 'current'],
  data () {
    return {
      currentSelected: undefined,
      swiperOption: {
        slidesPerView: 'auto', // 视口中展示几个slide
        roundLengths: true, // slide宽高4舍5入
        spaceBetween: 10, // slide的间距
        slidesOffsetBefore: 10, // 首个左侧偏移量
        slidesOffsetAfter: 10 // 尾部偏移
      }
    };
  },
  methods: {
    selectTag (index) {
      if (this.current === index) {
        this.$emit('changeBenefittype', { benefit_code: '', benefit_type: '', current: undefined });
      } else {
        let value = this.list[index];
        value.current = index;
        this.$emit('changeBenefittype', value);
      }
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.slidBox {
  width: auto !important;
  .demo-chip {
    margin: 5px auto;
    text-align: center;
  }
  .selected {
    background: #448aff;
    color: #ffffff;
  }
}
</style>
