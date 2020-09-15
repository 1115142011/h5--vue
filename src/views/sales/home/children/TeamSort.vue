<template>
  <section class="teamSortBox" v-if="listData&&listData.length>0">
    <div class="silverBox picBox shrink">
      <!-- 银牌 -->
      <div class="picWrap">
        <img class="bgImg" :src="silver" alt="银牌" />
        <div class="userPic">
          <img :src="[listData[1].saler.avatar?item.saler.avatar:header]" alt="头像" />
        </div>
      </div>
      <div class="teamName">{{listData[1].saler.group.group_name}}</div>
      <div class="salesNumber silver">{{listData[1].sale_num}}</div>
    </div>
    <!-- 金牌 -->
    <div class="picBox">
      <div class="picWrap">
        <img class="bgImg" :src="gold" alt="金牌" />
        <div class="userPic">
          <img :src=" [listData[0].saler.avatar?item.saler.avatar:header]" alt="头像" />
        </div>
      </div>
      <div class="teamName">{{listData[0].saler.group.group_name}}</div>
      <div class="salesNumber gold">{{listData[0].sale_num}}</div>
    </div>
    <!-- 铜牌 -->
    <div class="copperBox picBox shrink">
      <div class="picWrap">
        <img class="bgImg" :src="copper" alt="铜牌" />
        <div class="userPic">
          <img :src="[listData[2].saler.avatar?item.saler.avatar:header]" alt="头像" />
        </div>
      </div>
      <div class="teamName">{{listData[2].saler.group.group_name}}</div>
      <div class="salesNumber copper">{{listData[2].sale_num}}</div>
    </div>
  </section>
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
      silver: require('@/assets/images/sales/silver.svg'), // 银牌冠军图标
      gold: require('@/assets/images/sales/gold.svg'), // 金牌冠军图标
      copper: require('@/assets/images/sales/copper.svg'), // 铜牌冠军图标
      header: require('@/assets/images/user.png') // 默认头像
    };
  }
};
</script>
<style lang="less" scoped>
.teamSortBox {
  width: 100%;
  min-height: 160px;
  padding: 10px 0 5px;
  display: flex;
  align-items: center;
  overflow: hidden;
  text-align: center;
  .picBox {
    width: 33.33%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .picWrap {
      width: 100%;
      height: 100px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      transform: translateY(10px);
      .bgImg {
        position: absolute;
        width: 120%;
        height: 120%;
        left: -12%;
        top: -23%;
      }
      .userPic {
        top: 50%;
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
    .teamName {
      font-size: 12px;
      font-weight: 600;
    }
    .salesNumber {
      margin-top: 5px;
      font-size: 24px;
      font-weight: bold;
    }
  }
  .gold {
    color: #fdc128;
  }
  .copper {
    color: #fda959;
  }
  .silver {
    color: #989898;
  }
  // 位置调整
  .shrink {
    transform: scale(0.8);
  }
}
</style>
