<template>
  <swiper :options="swiperOption" ref="mySwiper" v-if="listData&&listData.length>0">
    <!-- slides -->
    <swiper-slide v-for="(item,index) in listData" :key="index">
      <mu-paper class="itemBox" :z-depth="1">
        <!-- 滑动模块标题栏 -->
        <div class="itemTitle">
          <div
            class="mounth v_ellipsis yellow"
            :class="[item.rank_num===2?'silver':item.rank_num===3?'cuprum':'']"
          >
            {{month}}
            <span v-if="item.rank_num===1">月销售冠军</span>
            <span v-else-if="item.rank_num===2">月销售亚军</span>
            <span v-else-if="item.rank_num===3">月销售季军</span>
          </div>
          <span class="v_ellipsis smileFont">{{item.saler.group.group_name}}</span>
        </div>
        <!-- 滑动模块内容区 -->
        <div class="personMsg">
          <!-- 用户头像 -->
          <div class="picWrap">
            <img class="bgImg" :src="[item.rank_num===2?silver:item.rank_num===3?copper:gold]" alt />
            <div class="userPic">
              <img :src="[item.saler.avatar?item.saler.avatar:header]" alt="头像" />
            </div>
          </div>
          <!-- 用户信息 -->
          <div class="textMsg">
            <div class="personName">{{item.saler.name}}</div>
            <div>{{item.saler.role.role_name?item.saler.role.role_name:'暂无职称'}}</div>
            <div class="smileFont v_ellipsis">入职时间:{{item.saler.entry_date}}</div>
            <div class="tag smileFont v_ellipsis">
              <span class="tagName" v-for="(val,index) in item.saler.tags" :key="index">{{val}}</span>
              <!-- <span class="tagName" v-if="item.saler.tags||item.saler.tags.length===0"></span> -->
            </div>
          </div>
          <!-- 签约量 -->
          <div class="salesNumber">
            <span>签约量</span>
            <span
              class="fontWWeight yellow"
              :class="{silver:item.rank_num===2,cuprum:item.rank_num===3}"
            >{{item.sale_num}}</span>
          </div>
        </div>
      </mu-paper>
    </swiper-slide>
  </swiper>
</template>
<script>
export default {
  props: {
    listData: {
      type: Array
    }
  },
  data () {
    return {
      month: '',
      silver: require('@/assets/images/sales/silver.svg'), // 银牌冠军图标
      gold: require('@/assets/images/sales/gold.svg'), // 金牌冠军图标
      copper: require('@/assets/images/sales/copper.svg'), // 铜牌冠军图标
      header: require('@/assets/images/user.png'), // 默认头像
      swiperOption: {
        slidesPerView: 1.1, // 视口中展示几个slide
        roundLengths: true, // slide宽高4舍5入
        spaceBetween: 10, // slide的间距
        slidesOffsetAfter: 10 // 右侧偏移量
      }
    };
  },
  created () {
    this.month = this.getTime();
  },
  methods: {
    // 获取时间
    getTime () {
      let month = new Date().getMonth();
      if (month === 0) {
        month = 12;
      }
      return month;
    }
  }
};
</script>
<style lang="less" scoped>
.itemBox {
  width: 100%;
  height: 148px;
  border-radius: 10px;
  margin: 5px;
  font-size: 10px;
  .itemTitle {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    align-items: bottom;
    border-bottom: 1px #cccccc solid;
    span {
      flex: 1;
      text-align: right;
    }
    .mounth {
      font-size: 16px;
      text-align: left;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      span {
        text-align: left;
      }
    }
    .smileFont {
      transform: scale(0.8) translateX(12%) translateY(25%);
    }
  }
  .personMsg {
    display: flex;
    align-items: stretch;
    // 头像
    .picWrap {
      width: 33%;
      height: 100px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      transform: translateY(10%);
      // 皇冠头像定位
      .bgImg {
        position: absolute;
        width: 120%;
        height: 120%;
        left: -12%;
        top: -23%;
      }
      .userPic {
        width: 56px;
        height: 56px;
        border-radius: 26px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    //文本信息
    .textMsg {
      width: 48%;
      margin-left: -8px;
      padding-top: 15px;
      color: #787878;
      .personName {
        font-size: 14px;
        color: #000000;
        font-weight: 600;
      }
      .tag {
        display: flex;
        overflow: hidden;
        .tagName {
          padding: 3px 8px;
          border-radius: 3px;
          background: rgba(120, 120, 120, 0.295);
        }
      }
      // 设置小字体
      .smileFont {
        transform: scale(0.75) translateX(-12%);
      }
    }
    // 签约量
    .salesNumber {
      padding-top: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .fontWWeight {
        font-size: 32px;
        transform: translateX(-10%);
      }
    }
  }
  .yellow {
    color: #fdc128;
  }
  .silver {
    color: #dbdbdb;
  }
  .cuprum {
    color: #fda959;
  }
}
</style>
