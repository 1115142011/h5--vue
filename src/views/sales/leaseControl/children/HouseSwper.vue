<template>
  <swiper :options="swiperOption" ref="mySwiper">
    <swiper-slide class="slidBox" v-for="(item,index) in swperListData" :key="'swper'+index">
      <mu-paper
        :z-depth="1"
        class="ststus_item"
        :class="{selected:selected===index}"
        @click="selectTag(index)"
      >
        <span class="number">{{item.leaseNum}}</span>
        <span class="name v_ellipsis">{{item.communityName}}</span>
      </mu-paper>
    </swiper-slide>
  </swiper>
</template>
<script>

import { queryStatByHouse } from '@/api/salesApi';
export default {
  data () {
    return {
      selected: undefined,
      swperListData: [],
      swiperOption: {
        slidesPerView: 'auto', // 视口中展示几个slide
        roundLengths: true, // slide宽高4舍5入
        spaceBetween: 10, // slide的间距
        slidesOffsetBefore: 10, // 首个左侧偏移量
        slidesOffsetAfter: 10 // 尾部偏移
      }
    };
  },
  created () {
    this.getListData();
  },
  methods: {
    // 查询责任楼盘和租约数
    getListData () {
      queryStatByHouse().then(res => {
        this.swperListData = this.sortArr(res.data);
      });
    },
    //  选中
    selectTag (index) {
      if (this.selected === index) {
        this.selected = undefined;
      } else {
        this.selected = index;
      }
    },
    // 排序
    sortArr (arr) {
      if (!arr || arr.length === 0) return;
      return arr.sort(function (prev, next) {
        if (prev.leaseNum - next.leaseNum > 0) {
          return -1;
        } else {
          return 1;
        }
      });
    }
  },
  watch: {
    selected: function (newVal, oldVal) {
      let param = newVal === undefined ? '' : this.swperListData[newVal].cid;
      this.$emit('changeHouseParam', param);
    }
  }
};
</script>
<style lang="less" scoped>
.ststus_item {
  width: 120px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  border-radius: 8px;
  .number {
    color: #19a1f3;
    font-size: 16px;
    font-weight: 600;
  }
  .name {
    width: 100%;
    text-align: center;
  }
}
/deep/.slidBox {
  width: auto !important;
  padding: 5px 0;
  .selected {
    background: #448aff;
    color: #ffffff;
    .number {
      color: #ffffff;
    }
  }
}
</style>
