<template>
  <section class="clean" >
    <!-- 顶部导航 -->
    <mu-appbar
      style="width: 100%"
      class="appbar fixed"
      color="#fdd835"
      textColor="#000"
      title="保洁工单"
    >
      <mu-button icon slot="left" @click="returnIndex" v-show="!searching">
        <mu-icon size="30" value="apps"></mu-icon>
      </mu-button>
         <mu-button v-show="!searching" flat slot="right" @click.stop="searching = true">
          <mu-icon color="#000" value="search" size="26"></mu-icon>
        </mu-button>
      <!-- 搜索框 -->
      <div class="search_wrap" slot="default" v-if="searching">
        <div class="searchBox skipRem" ref="searchBox" @click.stop>
          <mu-text-field
            v-model="params.houseName"
            placeholder="房屋名字"
            solo
            action-icon="cancel"
            :action-click="clearInput"
            :full-width="true"
          ></mu-text-field>
        </div>
        <mu-button class="cancle skipRem" flat @click="cancleSearch">取消</mu-button>
      </div>
    </mu-appbar>
    <mu-tabs
      class="topTabs fixed"
      :value.sync="params.currentTabIndex"
      color="yellow600"
      indicator-color="blue500"
      full-width
      @change="changeTabIndex"
    >
      <mu-tab>
        <mu-badge
          :content="String(allOrder.waitNum || '0')"
          :circle="allOrder.allNum < 100"
          :color="params.currentTabIndex === 0 ? 'blue500' : 'grey600'"
          class="icon-badge"
        >
          <span class="c1010">未完成</span>
        </mu-badge>
      </mu-tab>
      <mu-tab>
        <mu-badge
          :content="String(allOrder.finishNum || '0')"
          :circle="allOrder.allNum < 100"
          :color="params.currentTabIndex === 1 ? 'blue500' : 'grey600'"
          class="icon-badge"
        >
          <span class="c1010">已完成</span>
        </mu-badge>
      </mu-tab>
    </mu-tabs>
    <!-- 主内容 -->
    <div class="mainContent" ref="container">
      <mu-load-more
        :refreshing="refreshing"
        :loading="loading"
        @refresh="refresh"
        @load="load"
        :loaded-all="loadAll"
      >
        <!-- 小区 -->
        <swiper
          class="inlineList"
          ref="mySwiper"
          v-show="params.currentTabIndex === 0"
          :options="swiperOption"
        >
          <swiper-slide
            class="itemTile"
            :class="params.communityId === tile.communityId ? '_highlight' : ''"
            v-for="tile in allOrder.communityStats"
            :key="tile.communityId"
            @click.native="chooseCommunity(tile.communityId)"
          >
            <div class="title v_ellipsis">{{tile.communityCount}}</div>
            <div class="subTitle v_ellipsis">{{tile.communityName}}</div>
          </swiper-slide>
        </swiper>
        <!-- 保洁类型 -->
        <swiper class="inlineList" :options="swiperOption">
          <swiper-slide
            class="itemChip"
            :class="params.currentCleanTypeId === chip.typeId ? '_highlight' : ''"
            v-for="chip in allOrder.cleanTypeStats"
            :key="chip.typeId"
            @click.native="chooseCleanType(chip.typeId)"
          >
            <div class="title">{{chip.typeName}}</div>
            <!-- <div v-if="!params.currentTabIndex" class="number">{{chip.typeCount}}</div> -->
          </swiper-slide>
        </swiper>
        <!-- 时间 -->
        <div v-show="params.currentTabIndex === 1" class="timeTable">
          <div class="timeLine">
            <VueHotelDatepicker
              minDate="2018-1-1"
              :maxDate="new Date()"
              format="YYYY-MM-DD"
              @confirm="gotDateFilter"
              :startDate="beginDate"
              :endDate="endDate"
              :weekList="['周一', '周二', '周三', '周四', '周五', '周六', '周日']"
              :monthList="['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']"
              fromText="从"
              toText="到"
              resetText="重设"
              confirmText="确定"
              mobile="mobile"
            />
            <mu-icon @click="chooseDate = true" size="30" color="grey" value="calendar_today"></mu-icon>
          </div>
          <div class="detail" v-show="!loading">
            <div class="section">
              <div class="title">完成单量</div>
              <div class="number">{{allOrder.cleanFnishStats.finishNum}}</div>
            </div>
            <div class="section">
              <div class="title">超时完工</div>
              <div class="number">{{allOrder.cleanFnishStats.overTimeNum}}</div>
            </div>
            <div class="section">
              <div class="title">复工单量</div>
              <div class="number">{{allOrder.cleanFnishStats.returnNum}}</div>
            </div>
            <div class="section">
              <div class="title">待结算</div>
              <div class="number">{{allOrder.cleanFnishStats.goodNum}}</div>
            </div>
            <div class="section">
              <div class="title">投诉量</div>
              <div class="number">{{allOrder.cleanFnishStats.complainNum}}</div>
            </div>
            <div class="section">
              <div class="title">差评单量</div>
              <div class="number">{{allOrder.cleanFnishStats.negativeNum}}</div>
            </div>
          </div>
          <!-- <mu-date-picker
          class="date-picker"
          :class="chooseDate ? '' : '_hide'"
          @change="chooseDate = false"
          ></mu-date-picker>-->
        </div>
        <!-- 工单列表 -->
        <Card class="card" v-for="(item,index ) in list" :key="index+'z'" :item="item" />
        <div class="v_footerHint" v-if="loadAll">没有数据了~</div>
      </mu-load-more>
    </div>
  </section>
</template>

<script>
import VueHotelDatepicker from '@northwalker/vue-hotel-datepicker';
import { getAllOrder, getOrder } from '@/api/cleanApi';
import { formatTime3 } from '@/utils/date';
import Card from './Card';
export default {
  components: { Card, VueHotelDatepicker },
  data: () => ({
    swiperOption: {
      slidesPerView: 'auto',
      spaceBetween: 8,
      freeMode: true
    },
    loadAll: false,
    searching: false,
    refreshing: false,
    pageIndex: 1,
    time_out: null, // 延时搜索
    loading: true,
    endDate: null,
    beginDate: null,
    numList: {},
    allOrder: {
      waitNum: 0,
      finishNum: 0,
      communityStats: null,
      cleanFnishStats: {}
    },
    params: {
      currentTabIndex: 0,
      pageSize: 10,
      communityId: undefined,
      houseName: '',
      currentCleanTypeId: undefined
    },
    list: [],
    chooseDate: false,
    finishTimeStart: 0,
    finishTimeEnd: new Date()
  }),
  methods: {
    gotDateFilter ({ start, end }) {
      this.beginDate = start;
      this.endDate = end;
      this.pageIndex = 1;
      this.list = [];
      this.getOrderList(this.params, this.pageIndex);
      getAllOrder({ status: 2, beginDate: start, endDate: end }).then(
        ({ code, data }) => {
          if (code !== 200) return;
          const { cleanFnishStats, cleanTypeStats } = data;
          this.allOrder.cleanTypeStats = cleanTypeStats;
          this.allOrder.cleanFnishStats = cleanFnishStats || {
            finishNum: 0,
            waitSettleNum: 0,
            overTimeNum: 0,
            returnNum: 0,
            goodNum: 0,
            complainNum: 0,
            negativeNum: 0
          };
        }
      );
    },
    formatTime3,
    chooseCommunity (id) {
      this.params.communityId = this.params.communityId === id ? undefined : id;
    },
    chooseCleanType (id) {
      this.params.currentCleanTypeId =
        this.params.currentCleanTypeId === id ? undefined : id;
    },
    returnIndex () {
      this.$router.push('/index');
    },
    refresh () {
      this.refreshing = true;
      this.loadAll = false;
      this.$refs.container.scrollTop = 0;
      this.list = [];
      this.pageIndex = 1;
      this.getAllOrder(this.params.currentTabIndex);
      this.getOrderList(this.params, this.pageIndex);
    },
    load () {
      this.loading = true;
      this.getOrderList(this.params, this.pageIndex);
    },
    getOrderList (params, index) {
      this.loading = true;
      let data = {
        ...params,
        pageNo: index,
        beginDate: this.params.currentTabIndex ? this.beginDate : undefined,
        endDate: this.params.currentTabIndex ? this.endDate : undefined,
        // currentTabIndex：0未完成，id为1；1已完成，id为2
        status: this.params.currentTabIndex + 1,
        typeId: this.params.currentCleanTypeId
      };
      getOrder(data).then(({ data }) => {
        this.pageIndex += 1;
        this.list = this.list.concat(data.list);
        this.loading = false;
        this.refreshing = false;
        if (data.fullListSize === this.list.length) this.loadAll = true;
      });
    },
    getAllOrder (type) {
      getAllOrder({ status: 0 }).then(({ code, data }) => {
        if (code !== 200) return;
        const { waitNum, finishNum, allNum } = data;
        this.allOrder.waitNum = waitNum;
        this.allOrder.finishNum = finishNum;
        this.allOrder.allNum = allNum;
      });
      getAllOrder({ status: 1 }).then(({ code, data }) => {
        if (code !== 200) return;
        const { communityStats, cleanTypeStats } = data;
        this.allOrder.communityStats = communityStats;
        if (!type) {
          this.allOrder.cleanTypeStats = cleanTypeStats;
        }
      });
      getAllOrder({
        status: 2,
        beginDate: this.beginDate,
        endDate: this.endDate
      }).then(({ code, data }) => {
        if (code !== 200) return;
        const { cleanTypeStats } = data;
        if (type) {
          this.allOrder.cleanTypeStats = cleanTypeStats;
        }
        const { cleanFnishStats } = data;
        this.allOrder.cleanFnishStats = cleanFnishStats || {
          finishNum: 0,
          waitSettleNum: 0,
          overTimeNum: 0,
          returnNum: 0,
          goodNum: 0,
          complainNum: 0,
          negativeNum: 0
        };
      });
    },
    changeTabIndex (value) {
      this.pageIndex = 1;
      this.params.communityId = undefined;
      this.params.currentCleanTypeId = undefined;
      this.params.houseName = '';
      this.$store.commit('clean/setTabIndex', value);
      this.getAllOrder(value);
    },
    // 清除输入
    clearInput () {
      this.params.houseName = '';
    },
    // 取消搜索
    cancleSearch () {
      this.params.houseName = '';
      this.searching = false;
    }
  },
  created () {
    this.params.currentTabIndex = this.$store.state.clean.tabIndex;
    let time = new Date();
    this.endDate = formatTime3(time, 'Y-MM-dd');
    this.beginDate = formatTime3(time.setDate(time.getDate() - 77), 'Y-MM-dd');
    this.getAllOrder();
  },
  watch: {
    params: {
      handler: function (newVal, oldVal) {
        if (this.time_out) clearTimeout(this.time_out);
        this.time_out = setTimeout(() => {
          this.refreshing = false;
          this.list = [];
          this.pageIndex = 1;
          this.loadAll = false;
          this.load();
        }, 200);
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="less" scoped>
.appbar {
  height: 56px;
}
// 搜索框
.search_wrap {
  display: flex;
  align-items: baseline;
  width: 100%;
  // 搜索框
  .cancle.skipRem {
    height: 30px;
  }
  .searchBox {
    flex: 1;
    // 搜索框调整
    &/deep/.mu-input {
      .mu-text-field {
        width: 100%;
        background: #ffffff;
        border-radius: 5px;
        padding-left: 10px;
        line-height: 100%;
        box-shadow: 0px 2px 2px 0px rgba(16, 16, 16, 0.3);
      }
    }
  }
}
.topTabs {
  top: 50px;
  height: 50px;
  z-index: 100;
  box-shadow: 0px 2px 2px 0px rgba(16, 16, 16, 0.3);
}
.icon-badge {
  padding: 0 16px;
}
.mainContent {
  padding-top: 106px;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}
.inlineList {
  padding: 4px 8px;
  display: flex;
}
.itemTile {
  flex-shrink: 0;
  flex-grow: 0;
  height: 68px;
  width: 30%;
  border-radius: 10px;
  text-align: center;
  background: #fff;
  padding: 8px;
  // + .itemTile {
  //   margin-left: 8px;
  // }
  .title {
    font-size: 22px;
    font-weight: 900;
    color: #2196f3;
  }
  &._highlight {
    .title {
      color: #fff;
    }
    .subTitle {
      opacity: 0.7;
    }
    background: #2196f3;
    color: #fff;
  }
}

.itemChip {
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  flex-grow: 0;
  font-size: 12px;
  border-radius: 99rem;
  padding: 8px 8px 8px 12px;
  background: #cfcfcf;
  width: 26%;
  .title,
  .number {
    display: inline-block;
    vertical-align: middle;
  }
  .number {
    margin-left: 4px;
    line-height: 16px;
    width: 16px;
    border-radius: 100%;
    font-size: 10px;
    text-align: center;
    background: #9a9a9a;
    color: #cfcfcf;
  }
  &._highlight {
    .title {
      opacity: 0.7;
    }
    .number {
      opacity: 0.95;
      background: #fff;
      color: #2196f3;
    }
    background: #2196f3;
    color: #fff;
  }
}

.timeTable {
  margin: 8px;
  background: #fff;
  box-shadow: 0px 2px 2px 0px rgba(16, 16, 16, 0.3);
  border-radius: 4px;
  .timeLine {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    font-size: 16px;
  }
  .detail {
    border-top: 1px solid #cfcfcf;
    display: flex;
    flex-wrap: wrap;
    padding: 16px;
    .section {
      width: 33%;
      text-align: center;
    }
    .number {
      font-size: 24px;
      font-weight: 600;
      color: #2196f3;
      margin-bottom: 8px;
    }
  }
}
</style>
