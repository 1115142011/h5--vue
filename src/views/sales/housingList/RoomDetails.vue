<template>
  <section class="v_page" v-loading="loading" data-mu-loading-text="加载中...">
    <!-- 顶部导航 -->
    <mu-paper class="v_topNav" :z-depth="4">
      <mu-appbar color="#fdd835" textColor="#000">
        <mu-button icon slot="left" @click="goBack">
          <mu-icon value="arrow_back"></mu-icon>
        </mu-button>房间详情
        <div slot="right">
          <mu-button icon @click="toUpdateImage(selfRoomData.room_id)">
            <mu-icon value="add_a_photo"></mu-icon>
          </mu-button>
          <mu-button icon>
            <mu-icon value="share"></mu-icon>
          </mu-button>
        </div>
      </mu-appbar>
      <!-- 隐藏的tab 卡 -->
      <transition name="tab_fade">
        <mu-tabs
          :value.sync="active"
          full-width
          color="#fdd835"
          indicator-color="#489CFF"
          v-show="fixed"
        >
          <mu-tab
            v-for="(item,index) in tabs"
            :key="index"
            :value="index"
            class="v_ellipsis"
          >{{item.name}}</mu-tab>
        </mu-tabs>
      </transition>
    </mu-paper>
    <!-- 内容区 -->
    <div class="v_mainContainer skipRem" :class="{noFooter:!permission}" ref="scrollBox">
      <mu-load-more
        @refresh="refresh"
        :refreshing="refreshing"
        :loading="shareLoading"
        @load="load"
        :loaded-all="shareLoadAll"
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
            <div class="houseName">
              <status-tag :state="selfRoomData.status"></status-tag>
              <status-tag :state="10000" v-if="selfRoomData.inadv_lease_info"></status-tag>
              <span>{{selfRoomData.full_name}}</span>
            </div>
            <div class="price">

              <div class="activity-price"  v-if="selfRoomData.leaseBenefitSpecialVO.benefitPrice">
                <!-- <span class="price-hint">限时</span> -->
                <span>{{selfRoomData.leaseBenefitSpecialVO.benefitPrice}}元
                  <span class="smallFont">/月</span>
                </span>
                <!-- <span class="price-hint">(季付/年签)</span> -->
              </div>
              <div :class="{'original-price':selfRoomData.leaseBenefitSpecialVO.benefitPrice}">
                <span>￥</span>
                <span>{{selfRoomData.sale_price}}元</span>
                <span class="smallFont">/月</span>
              </div>
              <attach-tags :tagsArr="selfRoomData.targArray"></attach-tags>
            </div>
          </div>
        </div>
        <!-- tab选项  卡 -->
        <mu-paper class="tabBox whiteType" :z-depth="4">
          <mu-tabs :value.sync="active" full-width inverse indicator-color="#489CFF">
            <mu-tab
              v-for="(item,index) in tabs"
              :key="index"
              :value="index"
              class="v_ellipsis"
            >{{item.name}}</mu-tab>
          </mu-tabs>
        </mu-paper>
        <div class="tabsContainer">
          <!-- 签约要求 -->
          <tab-sign v-if="selfRoomData&&active===0" :myData="selfRoomData"></tab-sign>
          <!-- 租约信息 -->
          <div v-show="active===1">
            <tab-lease
              :leaseParam="selfRoomData.lease_info"
              ref="leaseComponent"
              v-if="selfRoomData&&selfRoomData.lease_info"
            ></tab-lease>
            <!-- 历史租约 -->
            <mu-paper @click="nextPage(selfRoomData.room_id)" :z-depth="1" class="linkBlock">
              <mu-ripple class="link_title" color="#cccccc" :opacity="0.7">
                <span class="titleText">历史租约</span>
                <span class="icon">
                  <mu-icon value="keyboard_arrow_right" color="#AAAAAA" :size="28" right></mu-icon>
                </span>
              </mu-ripple>
            </mu-paper>
          </div>
          <!-- 房源租客 -->
          <div class="room_resource" v-show="active===2">
            <tenant-msg :listData="tenantArray"></tenant-msg>
          </div>
          <!-- 共享信息· -->
          <div class="share_box" v-if="active===3">
            <share-msg :listData="shareDataList"></share-msg>
            <div class="v_footerHint" v-show="shareLoadAll">没有数据了~</div>
          </div>
        </div>
      </mu-load-more>
    </div>
    <!-- 底部导航条 -->
    <mu-paper class="footerNav" :z-depth="4" v-if="permission">
      <div v-if="!isAddMsg">
        <!-- 预定已付款 -->
        <div v-if="leaseStatus===8&&signer">
          <mu-button
            class="btn"
            flat
            color="primary"
            @click="toOrderFlow('/sales/orderFlow/ChangeReserve',true)"
          >预定变更</mu-button>
          <mu-button
            class="btn"
            textColor="#333333"
            @click="toOrderFlow('/sales/orderFlow/reserveSinger',true)"
            color="#fdd835"
          >在线签约</mu-button>
        </div>
        <!-- 预定未付款 -->
        <mu-button
          class="btn"
          color="#797979"
          textColor="#ffffff"
          v-if="leaseStatus===9"
          @click="cancelMyReserv"
        >取消预定</mu-button>
        <!-- 租约在租中 -->
        <div v-if="leaseStatus===1">
          <mu-button
            class="btn"
            flat
            color="primary"
            v-if="isAdvance"
            @click="toOrderFlow('/sales/orderFlow/inadvance/reserve')"
          >提前预定</mu-button>
          <!-- <mu-button
              class="btn"
              flat
              color="primary"
              @click="toOrderFlow('/sales/orderFlow/transform')"
            >换租</mu-button>
            <mu-button
              class="btn"
              flat
              color="primary"
              @click="toOrderFlow('/sales/orderFlow/sublease')"
          >转租</mu-button>-->
          <mu-button
            class="btn"
            color="#fdd835"
            textColor="#333333"
            v-if="duty"
            @click="toOrderFlow('/sales/orderFlow/quitLease',true)"
          >退租</mu-button>
          <mu-button
            class="btn"
            color="#fdd835"
            textColor="#333333"
            v-if="residueLeaseResidue&&duty"
            @click="toOrderFlow('/sales/orderFlow/continuous',true)"
          >续租</mu-button>
        </div>
        <!-- 租约办理中 -->
        <div class="btn_group" v-if="leaseStatus===7&&(duty||signer)">
          <mu-button class="btn" color="#797979" textColor="#ffffff" @click="cancelMyOrder">取消租约</mu-button>
        </div>
        <!-- 房间空置状态 空置房源暂时放开 -->
        <div class="btn_group" v-if="emptyHouse">
          <mu-button
            class="btn"
            flat
            color="primary"
            @click="toOrderFlow('/sales/orderFlow/reserve')"
          >预定</mu-button>
          <mu-button
            class="btn"
            textColor="#333333"
            @click="toOrderFlow('/sales/orderFlow/onlineReserve')"
            color="#fdd835"
          >在线签约</mu-button>
        </div>
      </div>
      <!-- //添加共享信息 -->
      <div v-else-if="isAddMsg">
        <mu-button
          class="btn"
          textColor="#333333"
          color="#fdd835"
          full-width
          @click="goAddMsg"
        >添加共享信息</mu-button>
      </div>
    </mu-paper>
  </section>
</template>
<script>
import Carousel from '@/components/Carousel';
import StatusTag from './children/StatusTag';
import AttachTags from './children/AttachTags';
import TabSign from './children/TabSign';
import TenantMsg from './children/TenantMsg'; // 服务记录
import TabLease from './children/TabLease';
import ShareMsg from './children/ShareMsg';
import {
  getHouseRoom,
  cancelReservOrder,
  cancelMyOrder,
  queryTenan,
  queryShareInfo
} from '@/api/salesApi';
import Moment from 'moment';

export default {
  components: {
    Carousel,
    StatusTag,
    AttachTags,
    TabSign,
    TabLease,
    TenantMsg,
    ShareMsg
  },
  data () {
    return {
      pic: require('@/assets/images/noImageList.png'), // 轮播占位图
      roomID: '',
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
          name: '签约要求',
          type: 'require'
        },
        {
          name: '租约',
          type: 'serve'
        },
        {
          name: '房源租客',
          type: 'room'
        },
        {
          name: '共享信息',
          type: 'serve'
        }
      ],
      // 房间详情数据
      selfRoomData: undefined,
      // --------共享信息参数
      shareLoadAll: false,
      refreshing: false,
      shareLoading: false,
      shareDataList: [],
      shareParams: {
        pageNo: 1,
        pageSize: 10
      },
      sharePageIndex: 1
    };
  },
  created () {
    this.active = this.$store.state.sales.roomDetailTab;
    this.roomID = this.$route.query.roomid;
    this.houseId = this.$route.query.houseId;
    this.getRoomData(this.roomID);
    this.getroomList(this.houseId);
  },
  computed: {
    // 计算登陆人是否为责任销售
    duty () {
      if (!this.selfRoomData) return false;
      if (this.selfRoomData.status === 2) return false;
      let visitorId = Number(localStorage.getItem('personId'));
      let dutySaleid = this.selfRoomData.house_info.sale_id;
      return visitorId === dutySaleid;
    },
    // 计算登陆人是否是签约销售
    signer () {
      if (!this.selfRoomData || !this.selfRoomData.lease_info) return false;
      if (this.selfRoomData.lease_info.rent_mode === 1) return false;
      let visitorId = Number(localStorage.getItem('personId'));
      let signerSaleid = this.selfRoomData.lease_info.salerId;
      return visitorId === signerSaleid;
    },
    // 计算是否为空置房源
    emptyHouse () {
      if (!this.selfRoomData) return false;
      return this.selfRoomData.status === 0;
    },
    // 计算租约剩余时间是否小于30天
    residueLeaseResidue () {
      if (
        !this.selfRoomData ||
        !this.selfRoomData.lease_info ||
        this.selfRoomData.status !== 1
      ) {
        return false;
      }
      let start = Moment();
      let entTime = Moment(this.selfRoomData.lease_info.expire_date);
      let residueDays = Math.ceil(entTime.diff(start, 'days', true));
      return residueDays < 30;
    },
    // 计算是否可以操作提前预定
    isAdvance () {
      return this.residueLeaseResidue && !this.selfRoomData.inadv_lease_info;
    },
    // 计算房源是否有操作权限
    permission () {
      let longtype = Number(localStorage.getItem('loginType'));
      if (longtype === 1) {
        return (
          this.duty ||
          this.signer ||
          this.emptyHouse ||
          this.isAdvance ||
          this.isAddMsg
        );
      } else {
        return false;
      }
    },
    // 是否为共享信息tab
    isAddMsg () {
      return this.active === 3;
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
    // 跳转添加共享信息
    goAddMsg () {
      this.$router.push('/sales/addsharemsg');
    },
    // 回到列表页
    goBack () {
      this.$store.commit('change_Action', 'pop');
      this.$router.go(-1);
    },
    // 跳转更新房源图片
    toUpdateImage (roomid) {
      this.$store.commit('change_Action', 'push');
      this.$router.push({
        path: '/sales/UpdateDetailImage',
        query: {
          roomid
        }
      });
    },
    // 跳转租约流程
    toOrderFlow (path, flag) {
      this.setLeaseFormData(path, flag);
    },
    // 跳转到历史租约
    nextPage (roomId) {
      this.$store.commit('change_Action', 'push');
      this.$router.push({
        path: '/sales/historyLease',
        query: {
          id: roomId
        }
      });
    },
    // 跳转租约流程设置缓存数据
    /*
     * @param:{path} string//路由路径
     * @param:{flag}  Boolean // 判断流程是否预设用户/租约信息
     */
    setLeaseFormData (path, flag) {
      // 新租状态的租约表单数据
      let obj = {
        leaseId: '',
        specialBenefitHouseId: this.selfRoomData.leaseBenefitSpecialVO
          .benefitHouseId, // 是否有特价优惠信息
        electSignFlag: 1, // 固定值1 电子签约
        submitType: 0, // 0 空置 --1续租
        roomId: this.selfRoomData.room_id,
        extendFlag: 0, // -0新签 --1续签
        leaseType: 0, // --0新租 --1换租--2转租
        custSource: '', // 客户来源
        saler: localStorage.getItem('personName'), // 销售名称
        salerId: localStorage.getItem('personId'), // 销售id
        beginDate: undefined, // 开始时间
        endDate: undefined, // 截止时间
        level1BenefitPlanId: undefined,
        leaseBenefitSpecialVO: this.selfRoomData.leaseBenefitSpecialVO,
        leaseCost: {
          rentDeposit: '', // 押金
          cardDeposit: '', // 卡押金
          otherDeposit: '', // 其它押金
          rent: '', // 租金
          payMode: undefined, // 支付方式
          costInfoList: undefined
        },
        timeDuration: '', // 租期时长，
        pay: undefined, // 支付时间,
        additionalInfo: undefined, // 附加信息
        recommend: {
          // 推荐人信息
          name: '',
          mobile: '',
          career: '', // 职业
          relationLeaseId: '', // 推荐人关联的租约
          bankAccount: '', // 银行卡号
          bank: '', // 开户行
          room_name: ''
        }
      };

      let customer = flag
        ? this.$refs.leaseComponent.customer
        : {
          name: '',
          mobile: '',
          idCard: ''
        };

      let pathType; // -- 用于流程标题辨别流程类型 --新租/转租/续租
      let status; // --地址栏携带的其他它参数 1，提前预定
      switch (path) {
        case '/sales/orderFlow/onlineReserve': // 新租
          pathType = 1;
          break;
        case '/sales/orderFlow/continuous': // 续租
          obj.submitType = 1;
          obj.leaseType = 3;
          obj.leaseId = this.selfRoomData.lease_info.lease_id;
          obj.extendFlag = 1; // -0新签 --1续签
          obj.beginDate = Moment(this.selfRoomData.lease_info.expire_date)
            .add(1, 'days')
            .format('YYYY-MM-DD');
          pathType = 2;
          break;
        case '/sales/orderFlow/quitLease': // 退租
          this.$store.commit('sales/mergeQuitFormData', {
            leaseId: this.selfRoomData.lease_info.lease_id
          });
          pathType = 3;
          break;
        case '/sales/orderFlow/reserve': // 预定
          pathType = 4;
          break;
        case '/sales/orderFlow/inadvance/reserve': // 提前预定
          pathType = 4;
          status = 1;
          break;
        case '/sales/orderFlow/ChangeReserve': // 预定变更
          obj.leaseId = this.selfRoomData.lease_info.lease_id;
          pathType = 5;
          break;
        case '/sales/orderFlow/reserveSinger': // 预定转签约
          obj.submitType = 3;
          obj.leaseId = this.selfRoomData.lease_info.lease_id;
          pathType = 1;
          break;
        default:
          break;
      }
      this.$store.commit('sales/setCustomerMsg', customer);
      this.$store.commit('sales/writeInFormData', obj);
      this.$router.push({
        path: path,
        query: {
          type: pathType,
          status: status
        }
      });
    },
    // 判断是否为数组
    changString (value) {
      if (!Array.isArray(value)) return [];
      return value;
    },
    // 获取房屋详情数据
    getRoomData (roomId) {
      this.loading = true;
      getHouseRoom(roomId).then(res => {
        this.loading = false;
        this.selfRoomData = res.data;
        this.selfRoomData.targArray = this.changString(this.selfRoomData.leaseBenefitVOList);
        if (this.selfRoomData.lease_info) {
          this.leaseStatus = this.selfRoomData.lease_info.status;
        }
        this.$store.commit('sales/setRoomParams', this.selfRoomData);
        this.$store.commit(
          'sales/setOrderFlowName',
          this.selfRoomData.full_name
        );

        // 租约参数
      });
    },
    // 取消预定
    cancelMyReserv () {
      this.$confirm('确认取消预定？', '提示').then(val => {
        if (val.result) {
          let reserveId = this.selfRoomData.lease_info.lease_id;
          cancelReservOrder(reserveId).then(res => {
            this.$router.push('/sales/transfer');
          });
        }
      });
    },
    // 取消租约
    cancelMyOrder () {
      this.$confirm('确认将租约作废？', '提示').then(val => {
        if (val.result) {
          let reserveId = this.selfRoomData.lease_info.lease_id;
          cancelMyOrder(reserveId).then(res => {
            this.$router.push('/sales/transfer');
          });
        }
      });
    },
    // 查询房间列表带租客
    getroomList (houseId) {
      queryTenan(houseId).then(res => {
        this.tenantArray = res.data.rooms;
        this.$store.commit('sales/setTenantArray', res.data.rooms);
      });
    },
    // 加载更新
    refresh () {
      if (this.active !== 3) return;
      this.refreshing = true;
      this.shareLoadAll = false;
      this.shareDataList = [];
      this.$refs.scrollBox.scrollTop = this.$refs.heightBox.offsetHeight + 10;
      this.sharePageIndex = 1;
      this.getShareData(this.shareParams, this.sharePageIndex);
    },
    // 加载列表数据api
    load () {
      // 滚动触发
      if (this.active !== 3) {
        this.shareLoading = false;
        return;
      }
      this.getShareData(this.shareParams, this.sharePageIndex);
    },
    getShareData (pram, index) {
      let data = pram;
      data.houseId = this.houseId;
      data.pageNo = index || 1;
      this.shareLoading = true;
      queryShareInfo(data).then(res => {
        if (!res.data.list || res.data.list.length === 0) {
          this.shareLoadAll = true;
        } else {
          this.sharePageIndex += 1;
          this.refreshing = false;
          this.shareLoading = false;
          let tempArr = res.data.list.map(item => {
            item.imageArray = this.setPicArr(item.images);
            return item;
          });
          this.shareDataList = this.shareDataList.concat(tempArr);
          if (res.data.totalCount === this.shareDataList.length) {
            this.shareLoadAll = true;
          }
        }
      });
    },
    // 设置图片地址数组
    setPicArr (str) {
      if (str) return str.split(',');
      return [];
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
      }
      // 执行滚动加载函数
      if (newVal === 3) {
        this.load();
      } else {
        this.refreshing = false;
        this.shareLoading = false;
        this.shareLoadAll = false;
        this.shareDataList = [];
        this.sharePageIndex = 1;
      }
    }
  },
  beforeDestroy () {
    // tab 卡状态暂存清理
    this.$store.commit('sales/setRoomDetailCurrentTab', this.active);
    this.$refs.scrollBox.onscroll = null;
  }
};
</script>
<style lang="less" scoped>
.v_mainContainer {
  padding: 0;
  &.skipRem {
    height: calc(100% - 113px);
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
      top: 10px;
      text-align: center;
      /deep/.swiper-pagination-bullet {
        background: #000000;
        margin-right: 5px;
        &.swiper-pagination-bullet-active {
          background: rgb(253, 216, 53);
        }
      }
    }
    .houseName {
      font-size: 16px;
      color: #000000;
      font-weight: 600;
    }
    .price {
      color: #eca835;
      font-size: 20px;
      display: flex;
      flex-direction: column;
      .smallFont {
        font-size: 12px;
        transform: scale(0.7);
      }
      .original-price {
        text-decoration: line-through;
        color: #b1b1b1;
        font-size: 14px;
        font-weight: 400;
      }
      .activity-price {
        color: #ff1b37;
        .price-hint {
          font-size: 12px;
        }
      }
    }
  }
  .tabsContainer {
    width: 100%;
    padding: 10px 8px;
    min-height: 600px;
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
.footerNav {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 10px;
  z-index: 1;
  text-align: right;
  .btn {
    margin-right: 5px;
  }
  /deep/.mu-flat-button {
    min-width: 50px;
  }
}
// 导航栏下的tab黄色卡
/deep/.v_topNav {
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
</style>
