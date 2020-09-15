<template>
  <section class="v_page" v-loading="loading" data-mu-loading-text="加载中...">
    <!-- 顶部导航 -->
    <mu-paper class="v_topNav" :z-depth="fixed?4:0">
      <mu-appbar color="#fdd835" textColor="#000">
        <mu-button icon slot="left" @click="goBack">
          <mu-icon value="arrow_back"></mu-icon>
        </mu-button>房源详情
        <div slot="right">
          <mu-button icon @click="toUpdateImage()">
            <mu-icon value="add_a_photo"></mu-icon>
          </mu-button>
        </div>
      </mu-appbar>
      <!-- 隐藏的tab 卡 -->
      <transition name="tab_fade">
        <div class="tabBox bg hidden" ref="top_scroll" :class="{show:fixed}">
          <mu-tabs :value.sync="active" color="#fdd835" indicator-color="#489CFF">
            <mu-tab
              v-for="(item,index) in tabs"
              :key="index+'t'"
              :value="item.value"
              class="v_ellipsis"
            >{{item.name}}</mu-tab>
          </mu-tabs>
        </div>
      </transition>
    </mu-paper>
    <!-- 内容区 -->
    <div class="v_mainContainer skipRem" :class="{noFooter:permission}" ref="scrollBox">
      <mu-load-more
        @refresh="refresh"
        :refreshing="refreshing"
        :loading="leaseLoading"
        @load="load"
        :loaded-all="leaseLoadAll"
      >
        <div class="heightBox" ref="heightBox" v-if="selfRoomData">
          <!-- 轮播图区 -->
          <div class="slidBox">
            <img
              class="defaultImage"
              :src="pic"
              alt="图片"
              v-if="!selfRoomData.images||selfRoomData.images.length===0"
            />
            <carousel :imgList="selfRoomData.images"></carousel>
          </div>
          <!-- 房源基础信息 -->
          <div class="houseMsg">
            <!-- 轮播小点 -->
            <div id="swiper_pagination"></div>
            <div class="other_msg">
              <div class="houseName">
                <span>{{selfRoomData.name}}</span>
              </div>
              <span>{{selfRoomData.distinctName}}</span>
              <span class="cutOff">|</span>
              <span>{{selfRoomData.area?selfRoomData.area:'--'}}</span>
              <span class="cutOff">|</span>
              <span>{{selfRoomData.layout?selfRoomData.layout:'--'}}</span>
              <proprietor-tags :tagsArray="setTypeTag(selfRoomData)"></proprietor-tags>
            </div>
          </div>
        </div>
        <!-- tab选项  卡 -->
        <mu-paper class="tabBox whiteType" ref="bottom_scroll" :z-depth="4">
          <mu-tabs :value.sync="active" inverse indicator-color="#489CFF">
            <mu-tab
              v-for="(item,index) in tabs"
              :key="index"
              :value="item.value"
              class="v_ellipsis"
            >{{item.name}}</mu-tab>
          </mu-tabs>
        </mu-paper>
        <div class="tabsContainer">
          <serve-msg :data="selfRoomData" v-if="active===0"></serve-msg>

          <div v-show="active===3">
            <lease :listData="leaseDataList"></lease>
             <div class="v_footerHint" v-show="leaseLoadAll&&leaseDataList.length===0">暂无已生效租约~</div>
             <!-- 历史租约 -->
            <mu-paper @click="toHistoryLease(selfRoomData.houseId)" :z-depth="1" class="linkBlock">
            <mu-ripple class="link_title" color="#cccccc" :opacity="0.7">
              <span class="titleText">历史租约</span>
              <span class="icon">
                <mu-icon value="keyboard_arrow_right" color="#AAAAAA" :size="28" right></mu-icon>
              </span>
            </mu-ripple>
          </mu-paper>
          </div>
        </div>
      </mu-load-more>
    </div>
    <!-- 底部导航条 -->
    <mu-paper class="footer_bar skipRem">
      <div class="operator_btn">
        <div class="small-btn">
          <mu-button full-width color="rgba(255, 255, 255, 1)" @click="toEdit">
            <div class="edit-btn-content">
              <img :src="editIcon" class="editIconImg">
              <!-- <mu-icon color="rgba(255, 183, 77, 1)" size="18" value="create"></mu-icon> -->
              <span class="text">编辑房源</span>
            </div>
          </mu-button>
        </div>

        <a href="tel:18780071650">
          <mu-button textColor="#333333" color="#fdd835">联系业主</mu-button>
        </a>
      </div>
    </mu-paper>
  </section>
</template>
<script>
import Carousel from '@/components/Carousel';
import lease from './children/lease';
import proprietorTags from '../../components/proprietorTags';
import { queryHouseDetail, queryLeaseByHouse } from '@/api/proprietorApi';
import serveMsg from './children/serveMsg';
export default {
  components: {
    Carousel,
    proprietorTags,
    serveMsg,
    lease
  },
  data () {
    return {
      editIcon: require('@/assets/images/edit.svg'),
      pic: require('@/assets/images/noImageList.png'), // 轮播占位图
      houseId: '',
      loading: false,
      scrollTop: undefined, // 记录滚动条位置
      fixed: false, // 是否固定tabs
      active: 0, // tab卡选中项
      leaseStatus: 0,
      tenantArray: [],
      // tab 卡选项
      tabs: [
        {
          name: '服务信息',
          value: 0
        },
        {
          name: '租约',
          value: 3
        }
      ],
      // 房间详情数据
      selfRoomData: undefined,
      // --------共享信息参数
      leaseLoadAll: false,
      refreshing: false,
      leaseLoading: false,
      leaseDataList: [],
      leaseParams: {
        rentStatus: 1,
        pageNo: 1,
        pageSize: 100
      },
      leasePageIndex: 1
    };
  },
  created () {
    this.active = this.$store.state.proprietor.roomDetailTab;
    this.houseId = this.$route.query.houseId;
    this.getRoomData(this.houseId);
  },
  computed: {
    // 计算房源是否有操作权限
    permission () {
      return false;
    }
  },
  mounted () {
    // 记录滚动条位置
    let vm = this;
    this.$refs.scrollBox.onscroll = function () {
      vm.scrollTop = this.scrollTop;
    };
  },
  methods: {
    // 回到列表页
    goBack () {
      this.$router.push('/proprietor');
    },
    // 编辑房源
    toEdit () {
      this.$router.push({
        path: '/proprietor/editFlat',
        query: {
          houseId: this.houseId
        }
      });
      this.$store.commit('proprietor/setEditHouseName', this.selfRoomData.name);
    },
    // 跳转更新房源图片
    toUpdateImage () {
      this.$store.commit('proprietor/setRegisterStep', 7);
      this.$store.commit('proprietor/writeFormParam', {
        houseId: this.houseId
      });
      this.$router.push({
        path: '/proprietor/houseRegister',
        query: {
          edit: 6
        }
      });
    },

    // 跳转到历史租约
    toHistoryLease (houseId) {
      this.$router.push({
        path: '/proprietor/historyLease',
        query: {
          hid: houseId
        }
      });
    },
    // 获取房屋详情数据
    getRoomData (roomId) {
      this.loading = true;
      queryHouseDetail(roomId).then(res => {
        this.loading = false;
        this.selfRoomData = res.data;
      });
    },
    // 加载更新
    refresh () {
      if (this.active !== 3) return;
      this.refreshing = true;
      this.leaseLoadAll = false;
      this.leaseDataList = [];
      this.$refs.scrollBox.scrollTop = this.$refs.heightBox.offsetHeight + 10;
      this.leasePageIndex = 1;
      this.getShareData(this.leaseParams, this.leasePageIndex);
    },
    // 加载列表数据api
    load () {
      // 滚动触发
      if (this.active !== 3) {
        this.leaseLoading = false;
        return;
      }
      this.getShareData(this.leaseParams, this.leasePageIndex);
    },
    getShareData (pram, index) {
      let data = pram;
      data.hid = this.houseId;
      data.pageNo = index || 1;
      this.leaseLoading = true;
      queryLeaseByHouse(data).then(res => {
        if (!res.data.leases || res.data.leases.length === 0) {
          this.leaseLoadAll = true;
        } else {
          this.leasePageIndex += 1;
          this.refreshing = false;
          this.leaseLoading = false;
          let tempArr = res.data.leases.map(item => {
            item.imageArray = this.setPicArr(item.images);
            return item;
          });
          this.leaseDataList = this.leaseDataList.concat(tempArr);
          if (res.data.totalCount === this.leaseDataList.length) {
            this.leaseLoadAll = true;
          }
        }
      });
    },
    // 设置图片地址数组
    setPicArr (str) {
      if (str) return str.split(',');
      return [];
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
  },
  watch: {
    // 设置 tab卡固定
    scrollTop: function (newVal, oldVal) {
      let height = this.$refs.heightBox.offsetHeight;
      if (newVal >= height) {
        this.fixed = true;
      } else {
        this.fixed = false;
      }
    },
    // tab切换监听 --设置切换时滚动条高度固定
    active (newVal, oldVal) {
      if (this.fixed) {
        this.$refs.scrollBox.scrollTop = this.$refs.heightBox.offsetHeight + 10;
        this.$refs.bottom_scroll.scrollLeft = this.$refs.top_scroll.scrollLeft;
      } else {
        this.$refs.top_scroll.scrollLeft = this.$refs.bottom_scroll.scrollLeft;
      }
      // 执行滚动加载函数
      if (newVal === 3) {
        this.load();
      } else {
        this.refreshing = false;
        this.leaseLoading = false;
        this.leaseLoadAll = false;
        this.leaseDataList = [];
        this.leasePageIndex = 1;
      }
    }
  },
  beforeDestroy () {
    // tab 卡状态暂存清理
    this.$store.commit('proprietor/setRoomDetailCurrentTab', this.active);
    this.$refs.scrollBox.onscroll = null;
  }
};
</script>
<style lang="less" scoped>
.hidden {
  opacity: 0;
}
.v_mainContainer {
  padding: 0;
  &.skipRem {
    height: calc(100% - 110px);
    margin-top: 56px;
    &.noFooter {
      height: calc(100% - 56px);
    }
  }
  .heightBox,
  .slidBox {
    width: 100%;
    position: relative;
    z-index: 1;
    min-height: 250px;
    overflow: hidden;
    .defaultImage {
      width: 100%;
      position: relative;
      z-index: 1;
    }
  }
  .houseMsg {
    width: 100%;
    background: #ffffff;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    padding: 30px 20px 10px;
    margin-top: -50px;
    position: relative;
    z-index: 2;
    #swiper_pagination {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      left: 0;
      top: 16px;
      text-align: center;
      /deep/.swiper-pagination-bullet {
        background: #000000;
        margin-right: 5px;
        &.swiper-pagination-bullet-active {
          background: #aaaaaa;
        }
      }
    }
    .houseName {
      font-size: 16px;
      color: #000000;
      font-weight: 600;
    }
    .other_msg {
      margin: 5px 0;
      padding-left: 20px;
    }
  }
  .tabsContainer {
    width: 100%;
    padding: 10px 8px;
    min-height: 600px;
    margin-bottom: 10px;
  }
  .linkBlock {
    margin-top: 10px;
    border-radius: 10px;
    .link_title {
      width: 100%;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: bottom;
      position: relative;
      span {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .titleText {
        font-size: 14px;
        color: #797979;
      }
    }
  }
}
// 分割符
.cutOff {
  padding: 0 4px;
}
.tabBox {
  overflow-y: hidden;
  overflow-x: auto;
  &.show {
    opacity: 1;
  }
  &.bg {
    background: #fdd835;
  }
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    background-color: transparent;
  }
}
.footer_bar {
  background: rgba(255, 255, 255, 1);
  .operator_btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .small-btn {
      // width: px;
      /deep/.mu-button-wrapper {
        padding: 0 5px;
      }
    }
    .edit-btn-content {
      height: 40px;
      color: rgba(154, 154, 154, 1);
      background: rgba(255, 255, 255, 1);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .text {
        height: 16px;
        line-height: 16px;
        font-size: 12px;
      }
    }
  }
}
.editIconImg{
  width: 25px;
  height: 20px;
}

// 导航栏下的tab黄色卡
/deep/.v_topNav {
  background: transparent;
  position: fixed;
  width: 100%;
  top: 0;
  .mu-tab {
    color: #797979;
  }
  .mu-tab-active {
    color: #000000;
  }
  .tab_fade-enter-active {
    transition: opacity 0.1s;
  }
  .tab_fade-enter,
  .tab_fade-leave-to {
    opacity: 0.1;
  }
}
// tab 卡白色模式
/deep/.whiteType {
  position: relative;
  z-index: 1;
  .mu-tabs-inverse {
    background: #ffffff;
  }
  .mu-tab-active {
    color: #489cff;
  }
}
/deep/.mu-raised-button {
  min-width: 50px;
}
/deep/.mu-tabs {
  overflow: visible;
}
</style>
