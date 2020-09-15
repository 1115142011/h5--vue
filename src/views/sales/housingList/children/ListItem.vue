<template>
  <section class="listBox">
    <div class="listItem" v-for="(item,index) in myData" :key="index">
      <!-- 左侧图片 -->
      <div class="leftPic">
        <img v-lazy="item.image?item.image:pic" alt="封面图片" />
        <span class="photoIcon skipRem">
          <mu-icon value="add_a_photo" size="12" color="#ffffff"></mu-icon>
        </span>
        <span class="lockIcon skipRem" v-if="type===2">
          <mu-icon value="lock" size="12" color="#ffffff" ></mu-icon>
        </span>
        <!-- 已空置天数 -->
        <span class="hintText" v-if="item.status===0">{{item.last_used_time|setDateDays}}</span>
      </div>
      <!-- 右侧文本 -->
      <div class="rightText" @click="goDetail(item.room_id,item.house_info.house_id)">
        <!-- 标题 -->
        <div class="title">
          <status-tag :state="item.status"></status-tag>
          <status-tag :state="10000" v-if="item.inadv_lease_info"></status-tag>
          <span class="boldText room-name">{{item.full_name}}</span>
        </div>
        <!-- 其他详情 -->
        <div class="detialText">
          <div class="msg small">
            <div>
              {{item.house_info.community.area_name}}
              <span class="cutOff">|</span>
              面积{{item.area?item.area:'--'}}㎡
            </div>
            <div class="thinColor">
              {{item.house_info.layout}}
              <span class="cutOff">|</span>
              {{item.house_info.house_cost.cost_name+item.house_info.house_cost.cost}}
            </div>
          </div>
          <div class="price">
             <div class="activity-price" v-if="item.leaseBenefitSpecialVO.benefitPrice">
               <!-- <span class="price-hint">限时</span> -->
               <span>{{item.leaseBenefitSpecialVO.benefitPrice}}元/月</span>
             </div>
              <div :class="{'original-price':item.leaseBenefitSpecialVO.benefitPrice}">{{item.sale_price}}元/月</div>

          </div>
        </div>
        <!-- 剩余时间 -->
        <div class="surplusTime small v_ellipsis thinColor">
          <div v-show="!item.hit">
            <span>房源剩余{{setDateMore(item,item.house_info.expire_date)}}</span>
            <span class="cutOff">|</span>
            <!-- 租约剩余 -->
            <span v-if="item.lease_info">租约剩余{{setDateMore(item,item.lease_info.expire_date)}}</span>
          </div>
          <span
            v-show="item.hit"
            class="red_hint"
          >请注意房源将于{{setDateMore(item,item.house_info.expire_date)}}后到期</span>
        </div>
        <!-- 标签 -->
        <attach-tags :tagsArr="item.tagsArr"></attach-tags>
      </div>
    </div>
  </section>
</template>
<script>
import StatusTag from './StatusTag';
import AttachTags from './AttachTags';
import Moment from 'moment';

export default {
  props: {
    listData: {
      type: Array,
      default: function () {
        return [];
      }
    },
    type: {
      type: Number,
      default: 0
    }
  },
  components: { StatusTag, AttachTags },
  data () {
    return {
      pic: require('@/assets/images/noImageList.png')
    };
  },
  computed: {
    myData () {
      return this.changeList(this.listData);
    }
  },
  methods: {
    // 跳转详情页
    goDetail (roomid, houseId) {
      this.$store.commit('sales/setRoomDetailCurrentTab', 0);
      this.$router.push({
        path: '/sales/RoomDetails',
        query: {
          roomid,
          houseId
        }
      });
    },
    // 遍历列表 添加属性
    changeList (arr) {
      if (!arr || arr.length === 0) return [];
      let tempArr = arr.map(item => {
        item.hit = false;
        item.tagsArr = [].concat(this.getStringArray(item.leaseBenefitVOList));
        return item;
      });
      return tempArr;
    },
    /* 计算时间 多少年-多少月 -多少天
     */
    setDateMore (item, endTime) {
      let end = Moment(endTime);
      let start = Moment();
      let calcDiffMonths = end.diff(start, 'month');
      let diffYear = parseInt(calcDiffMonths / 12);
      let diffMonth = parseInt(calcDiffMonths) % 12;
      let daysDiffBegin = start.add(calcDiffMonths, 'M');
      let diffDays = Math.ceil(end.diff(daysDiffBegin, 'days', true));
      let time;
      if (diffYear === 0) {
        time = +diffMonth + '个月' + +diffDays + '天';
        if (diffMonth <= 2 && item.status === 0) {
          item.hit = true;
        }
      } else {
        time = diffYear + '年' + diffMonth + '个月' + diffDays + '天';
      }
      return time;
    },
    // 数组判断
    getStringArray (list) {
      if (!Array.isArray(list)) return [];
      return list;
    }
  },
  filters: {
    //   计算时间-相差多少天
    setDateDays (endTime) {
      // 获取当前时间
      let m1 = Moment();
      // 获取需要对比的时间
      let m2 = Moment(endTime);
      // 计算相差多少天 day可以是second minute
      let days = m1.diff(m2, 'day');
      return `已空置 ${days} 天`;
    }
  }
};
</script>
<style lang="less" scoped>
.listBox {
  width: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background: #ffffff;
  .listItem {
    border-bottom: solid 1px #cccccc;
    padding: 8px 10px 5px;
    display: flex;
    &:last-child {
      border: none;
    }
    .leftPic {
      width: 96px;
      height: 72px;
      position: relative;
      margin-right: 8px;
      overflow: hidden;
      border-radius: 4px;
      img {
        width: 100%;
        height: 100%;
      }
      .photoIcon.skipRem {
        position: absolute;
        left: 0;
        top: 0;
        padding: 2px 4px 0 2px;
        border-top-left-radius: 6px;
        border-bottom-right-radius: 6px;
        background: #5677fc;
      }
      .lockIcon.skipRem {
        position: absolute;
        right: 0;
        top: 0;
        padding: 2px 3px 0;
        border-top-right-radius: 6px;
        border-bottom-left-radius: 6px;
        background: #797979;
      }
      .hintText {
        width: 120%;
        padding-top: 5px;
        background: rgba(0, 0, 0, 0.596);
        color: #ffffff;
        text-align: center;
        font-weight: 200;
        position: absolute;
        bottom: 0;
        left: 0;
        transform: scale(0.85) translateX(-10%) translateY(10%);
      }
    }
    .rightText {
      width: 245px;
      overflow: hidden;
      .title {
        color: #000000;
        .boldText {
          font-size: 12px;
          font-weight: 600;
          &.room-name{
            font-size: 14px;
            font-weight:bold
          }
        }
      }
      .detialText {
        width: 100%;
        display: flex;
        align-items: center;
        .price {
          margin-left: 5px;
          color: #eca835;
          font-size: 16px;
          white-space: nowrap;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .original-price{
            text-decoration: line-through;
            color: #B1B1B1;
            font-size: 14px;
            font-weight: 400;
          }
          .activity-price{
            color: #FF1B37;
            .price-hint{
              font-size: 12px;
            }
          }
        }
      }
      // 10 号字体
      .small {
        width: 120%;
        transform: scale(0.83) translateX(-10%);
      }
      // 浅色字体
      .thinColor {
        color: #797979;
      }
      // 分割符
      .cutOff {
        padding: 0 4px;
      }
      .red_hint {
        color: red;
      }
    }
  }
}
</style>
