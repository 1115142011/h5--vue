<template>
  <swiper :options="swiperOption">
    <swiper-slide class="slidBox" v-for="(item,index) in imgList" :key="index" >
      <img :src="item.url?item.url:item" :alt="[item.name?item.name+'图片':'图片'+index]" />
      <span class="tag">{{item.name?item.name:'图片'+index}}</span>
    </swiper-slide>
  </swiper>
</template>
<script>
export default {
  props: {
    imgList: {
      type: Array
    }
  },
  data () {
    return {
      swiperOption: {
        autoplay: {
          delay: 3000,
          disableOnInteraction: false // 用户操作后可继续轮播
        }, // 自动切换
        loop: true, // 循环轮播
        slidesPerView: 1, // 视口中展示几个slide
        preventLinksPropagation: true, // 拖动释放时不会输出信息，阻止click冒泡。拖动Swiper时阻止click事件。
        pagination: {
          el: '#swiper_pagination'
          // dynamicBullets: true, // 设置动态分页器
          // dynamicMainBullets: 5 // 动态分页器展示数量
        }
      }
    };
  }
};
</script>
<style lang="less" scoped>
.slidBox {
  width: 100%;
  height: 253px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .tag {
    padding: 5px 10px;
    background: rgba(0, 0, 0, 0.507);
    color: #ffffff;
    position: absolute;
    border-radius: 5px;
    right: 10px;
    top: 10px;
  }
}
</style>
