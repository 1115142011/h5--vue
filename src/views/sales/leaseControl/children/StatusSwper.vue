<template>
  <swiper :options="swiperOption" ref="mySwiper">
    <swiper-slide class="slidBox" v-for="(item,index) in myList" :key="'swper'+index">
      <mu-paper
        :z-depth="1"
        class="ststus_item"
        :class="{selected:init===item.value}"
        @click="selectTag(item.value)"
      >
        <span class="content">{{item.name}}</span>
        <span class="sup" v-if="item.number>=0">{{item.number}}</span>
      </mu-paper>
    </swiper-slide>
  </swiper>
</template>
<script>
export default {
  props: ['show', 'init'],
  data () {
    return {
      swperListData: [
        {
          name: '责任租约',
          value: 1,
          selected: false,
          type: [0]
        },
        {
          name: '我的签约',
          value: 2,
          selected: false,
          type: [0]
        },
        {
          name: '待催缴',
          value: 3,
          selected: false,
          type: [3]
        },
        {
          name: '即将到期',
          value: 5,
          selected: false,
          type: [3]
        },
        {
          name: '已支付',
          value: 6,
          selected: false,
          type: [1]
        },
        {
          name: '未支付',
          value: 7,
          selected: false,
          type: [1]
        },
        {
          name: '租约超期',
          value: 8,
          selected: false,
          type: [3]
        },
        {
          name: '急需清退',
          value: 9,
          selected: false,
          type: [3]
        },
        {
          name: '预定快到期',
          value: 10,
          selected: false,
          type: [1]
        }
      ],
      swiperOption: {
        slidesPerView: 'auto', // 视口中展示几个slide
        roundLengths: true, // slide宽高4舍5入
        spaceBetween: 10, // slide的间距
        slidesOffsetBefore: 10, // 首个左侧偏移量
        slidesOffsetAfter: 10 // 尾部偏移
      }
    };
  },
  computed: {
    myList () {
      return this.filter(this.swperListData, this.show);
    }
  },
  methods: {
    selectTag (val) {
      this.$emit('changeAttachPram', val);
    },
    // 筛查数据长度
    filter (arr, type) {
      if (!arr || arr.length === 0) return [];
      let NumbrArr = this.$store.state.sales.leaseControlTagNumber || [];
      let tempArr = [];
      arr.forEach(item => {
        NumbrArr.forEach(val => {
          if (val.leaseState === item.value) {
            item.number = val.value;
          }
        });
        if (item.type.indexOf(type) > -1) {
          tempArr.push(item);
        }
      });
      return tempArr;
    }
  }
};
</script>
<style lang="less" scoped>
.ststus_item {
  background: rgba(0, 0, 0, 0.12);
  padding: 5px 10px;
  border-radius: 15px;
  .sup {
    padding: 0 5px;
    margin-left: 5px;
    background: rgba(0, 0, 0, 0.24);
    border-radius: 10px;
    color: #ffffff;
  }
}
/deep/.slidBox {
  width: auto !important;
  padding: 5px 0;
  .selected {
    background: #448aff;
    color: #ffffff;
  }
}
</style>
