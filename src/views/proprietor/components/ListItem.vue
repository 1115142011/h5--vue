<template>
  <section class="listBox">
    <mu-paper :z-depth="2" class="listItem v_block" v-for="(item,index) in listData" :key="index">
      <!-- 左侧图片 -->
      <div class="leftPic">
        <img v-lazy="item.image?item.image:pic" alt="封面图片" />
      </div>
      <!-- 右侧文本 -->
      <div class="rightText" @click="goDetail(item.houseId)">
        <!-- 标题 -->
        <div class="title">
          <span class="boldText">{{item.name}}</span>
        </div>
        <!-- 其他详情 -->
        <div class="msg small thinColor">
          <span>{{item.distinctName +'-'+item.areaName}}</span>
          <span class="cutOff">|</span>
          <span>{{item.area?item.area+'㎡':'--'}}</span>
          <span class="cutOff">|</span>
          <span>{{item.layout}}</span>
        </div>
        <proprietor-tags :tagsArray="setTypeTag(item)"></proprietor-tags>
        <div class="small red" v-if="item.status==7 ">预计重新上架时间：{{item.toSaleDate}}</div>
      </div>
    </mu-paper>
  </section>
</template>
<script>
import proprietorTags from './proprietorTags';
export default {
  components: { proprietorTags },
  props: {
    listData: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  data () {
    return {
      pic: require('@/assets/images/noImageList.png')
    };
  },
  methods: {
    // 跳转详情页
    goDetail (houseId) {
      this.$store.commit('proprietor/setRoomDetailCurrentTab', 0);
      this.$router.push({
        path: '/proprietor/houseDetails',
        query: {
          houseId
        }
      });
    },
    // 设置类型标签
    setTypeTag (item) {
      let tags = [];
      // 托管类型
      switch (item.mode) {
        case 1:
          tags.push({
            text: '包租',
            bg: 'rgba(198, 220, 254, 1)',
            color: 'rgba(66, 137, 255, 1)',
            isBold: true
          });
          break;
        case 2:
          tags.push({
            text: '全托管',
            bg: 'rgba(192, 243, 141, 1)',
            color: 'rgba(81, 187, 48, 1)',
            isBold: true
          });
          break;
        case 3:
          tags.push({
            text: '闪电租',
            bg: '#FAD639',
            color: '#4C400F',
            isBold: true
          });
          break;

        default:
          break;
      }
      // 负责人
      if (item.manager) {
        if (item.manager === localStorage.getItem('personName')) {
          tags.push({
            text: '我的责任房',
            bg: 'rgba(247, 247, 247, 1)',
            color: 'rgba(123, 123, 123, 1)'
          });
        } else {
          tags.push({
            text: item.manager,
            bg: 'rgba(247, 247, 247, 1)',
            color: 'rgba(123, 123, 123, 1)'
          });
        }
      }
      // 已完善/待完善
      switch (item.completeFlag) {
        case 0:
          tags.push({
            text: '待完善',
            bg: 'rgba(247, 247, 247, 1)',
            color: 'rgba(123, 123, 123, 1)'
          });
          break;
        case 1:
          tags.push({
            text: '已完善',
            bg: 'rgba(247, 247, 247, 1)',
            color: 'rgba(123, 123, 123, 1)'
          });
          break;
        default:
          break;
      }
      // 上架状态 statusName
      switch (item.statusName) {
        case '上架中':
          tags.push({
            text: item.statusName,
            bg: 'rgba(223, 243, 147, 1)',
            color: 'rgba(109, 137, 0, 1)'
          });
          break;
        default:
          tags.push({
            text: item.statusName,
            bg: '#FF7777',
            color: '#ffffff'
          });
          break;
      }
      // 整租/合租
      switch (item.rentMode) {
        case 1:
          tags.push({
            text: '整租',
            bg: 'rgba(247, 247, 247, 1)',
            color: 'rgba(123, 123, 123, 1)'
          });
          break;
        case 2:
          tags.push({
            text: '合租',
            bg: 'rgba(247, 247, 247, 1)',
            color: 'rgba(123, 123, 123, 1)'
          });
          break;
        default:
          break;
      }

      return tags;
    }
  }
};
</script>
<style lang="less" scoped>
.listBox {
  width: 100%;
  margin: 0 auto;
  background: transparent;
  .listItem {
    padding: 10px;
    display: flex;
    .leftPic {
      width: 96px;
      height: 72px;
      position: relative;
      margin-right: 8px;
      overflow: hidden;
      border-radius: 4px;
      margin-top: 4px;
      background: #eeeeee;
      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        object-fit: cover;
      }
    }
    .rightText {
      width: 245px;
      overflow: hidden;
      .title {
        color: #000000;
        font-weight: bold;
        font-size: 14px;
        .boldText {
          font-size: 12px;
          font-weight: 600;
        }
      }
      .small {
        width: 120%;
        transform: scale(0.8) translateX(-12%);
      }
      // 分割符
      .cutOff {
        padding: 0 4px;
      }
    }
  }
  .listItem:last-child {
    margin-bottom: 15px;
  }
}
.red {
  color: #ff7777;
}
</style>
