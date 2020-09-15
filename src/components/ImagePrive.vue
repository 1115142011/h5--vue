<template>
  <div class="bg" v-if="show">
    <div class="close_box">
      <mu-button small fab color="rgb(253, 216, 53)" @click="close">
        <mu-icon value="close"></mu-icon>
      </mu-button>
    </div>
    <div class="content_box">
      <div class="title_box">
        <span>{{index}}/</span>
        <span>{{imgList.length}}</span>
      </div>
      <swiper :options="swiperOption" class="swiper_wrap">
        <swiper-slide class="slidBox center" v-for="(item,index) in imgList" :key="index">
          <img v-lazy="item" :alt="`图片${index+1}`" />
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>
<script>
let vm;
export default {
  name: 'myImgPrive',
  props: {
    imgList: {
      type: Array
    },
    current: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      show: true,
      index: 1,
      swiperOption: {
        slidesPerView: 1, // 视口中展示几个slide
        preventLinksPropagation: true, // 拖动释放时不会输出信息，阻止click冒泡。拖动Swiper时阻止click事件。
        initialSlide: 0, // 初始时显示第几个
        roundLengths: true,
        watchOverflow: true, // 只有1个时滑动会失效
        observeParents: true,
        on: {
          slideChange: function () {
            vm.index = this.activeIndex + 1;
          }
        }
      }
    };
  },
  created () {
    vm = this;
    this.index = this.initNumber + 1;
    this.swiperOption.initialSlide = this.initNumber;
  },
  computed: {
    initNumber () {
      return this.current > this.imgList.length
        ? 0
        : this.current < 0
          ? 0
          : this.current;
    }
  },
  methods: {
    close () {
      this.show = false;
    }
  }
};
</script>
<style lang="less" scoped>
.bg {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  .close_box {
    padding: 10px 5px;
    text-align: right;
    color: red;
  }
  .content_box {
    width: 100%;
    height: calc(100% - 160px);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .title_box {
      padding: 10px;
      display: flex;
      font-size: 18px;
      justify-content: center;
      align-items: center;
    }
  }
  .swiper_wrap {
    width: 100%;
    max-height: 100%;
    overflow: hidden;
  }
}
.slidBox {
  width: 100%;
  height: 100%;
  img {
    max-width: 96%;
    max-height: 100%;
    vertical-align: middle;
  }
}
</style>
