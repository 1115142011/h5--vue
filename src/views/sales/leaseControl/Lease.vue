<template>
  <section class="v_page">
    <mu-paper class="v_topNav topNav" :z-depth="4">
      <!-- 顶部导航 -->
      <mu-appbar color="#fdd835" title="租约管理" textColor="#000">
        <!-- 导航图标 -->
        <mu-button icon slot="left" @click="goBack" v-show="!searchState">
          <mu-icon value="apps"></mu-icon>
        </mu-button>
        <div slot="right" class="right_solt" v-show="!searchState">
          <mu-button icon @click.stop="showBox">
            <mu-icon value="group"></mu-icon>
          </mu-button>
          <mu-button icon @click.stop="showBox">
            <mu-icon value="search"></mu-icon>
          </mu-button>
        </div>
        <!-- 搜索框 -->
           <div class="search_wrap" slot="default" v-if="searchState">
        <div
          class="searchBox skipRem"
          ref="searchBox"
          @click.stop
        >
          <mu-text-field
            v-model="params.queryTerm"
            placeholder="房源/租客姓名"
            solo
            action-icon="cancel"
            :action-click="clearInput"
            :full-width="true"
          ></mu-text-field>
        </div>
           <mu-button class="cancle skipRem" flat @click="cancleSearch">取消</mu-button>
           </div>
      </mu-appbar>
      <!-- tab选项  卡 -->
      <mu-tabs
        color="#fdd835"
        :value.sync="params.status"
        indicator-color="#448AFF"
        full-width
        center
      >
        <mu-tab v-for="(item,index) in tabs" :key="index" :value="item.value" class="v_ellipsis">
          <div class="tabs_item" @click="changeValue">
            <!-- <span class="sup" v-if="index!=0">{{item.total}}</span> -->
            {{item.name}}
          </div>
        </mu-tab>
      </mu-tabs>
    </mu-paper>
    <!-- 房源列表 -->
    <div class="mainContent skipRem" ref="container">
      <!-- 状态筛选 -->
      <div class="swperBox">
        <status-swper @changeAttachPram='setAttachStatus' :init='params.addiCons' :show='params.status'></status-swper>
      </div>
      <!-- 小区滑屏筛选 -->
      <div class="swperBox">
        <HouseSwper @changeHouseParam='setHousParam'></HouseSwper>
      </div>
      <mu-load-more
        @refresh="refresh"
        :refreshing="refreshing"
        :loading="loading"
        @load="load"
        :loaded-all="loadAll"
      >
        <div class="list_container">
          <lease-list :listData="listData" @changeList='changeList'></lease-list>
        </div>
      </mu-load-more>
      <div class="v_footerHint" v-if="loadAll">没有更多数据了~</div>
    </div>
  </section>
</template>
<script>
import LeaseList from './children/LeaseList';
import StatusSwper from './children/StatusSwper';
import HouseSwper from './children/HouseSwper';
import { queryAllLease } from '@/api/salesApi';

export default {
  components: { LeaseList, StatusSwper, HouseSwper },
  data () {
    return {
      leasesListScrollTop: 0,
      time_out: null,
      listData: [],
      loadAll: false,
      refreshing: false,
      loading: false,
      searchState: false,
      active: 0, // tab 卡选中项
      params: {
        queryTerm: undefined, // 收索关键词参数
        status: undefined, // 房间状态--tab 选中项参数
        pageSize: 5,
        cid: '', // 楼盘id
        addiCons: ''// 租约附加筛选状态
      },
      pageIndex: 1,
      // tab 卡选项
      tabs: [
        {
          name: '全部',
          value: 0
        },
        {
          name: '预定中',
          value: 1
        },
        {
          name: '办理中',
          value: 2
        },
        {
          name: '在租中',
          value: 3
        }
      ]
    };
  },
  methods: {
    // 滚动监测
    handleScroll () {
      this.leasesListScrollTop = this.$refs.container.scrollTop;
    },
    changeValue () {
      this.params.addiCons = '';
    },
    // 返回首页
    goBack () {
      this.$store.commit('change_Action', 'pop');
      this.$router.push('/index');
    },
    // 点击搜素按钮
    showBox () {
      this.searchState = true;
    },
    // 清除输入
    clearInput () {
      this.params.queryTerm = '';
    },
    // q取消搜索
    cancleSearch () {
      this.params.queryTerm = '';
      this.searchState = false;
    },
    // 筛选标签确认
    changeTagsData (obj) {
      this.params.rent_mode = obj.rent_mode.toString();
      this.params.room_type = obj.room_type.toString();
    },
    // 加载更新
    refresh () {
      this.refreshing = true;
      this.loadAll = false;
      this.listData = [];
      this.$refs.container.scrollTop = 0;
      this.pageIndex = 1;
      this.getListData(this.params, this.pageIndex);
    },
    // 加载列表数据api
    load () {
      this.getListData(this.params, this.pageIndex);
    },
    // 加载 列表
    getListData (pram, index) {
      let data = pram;
      data.pageNo = index || 1;
      this.loading = true;
      queryAllLease(data).then(res => {
        if (!res.data.leases || res.data.leases.length === 0) {
          this.loadAll = true;
        } else {
          this.pageIndex += 1;
          this.refreshing = false;
          this.loading = false;
          this.listData = this.listData.concat(res.data.leases);
          if (res.data.totalCount === this.listData.length) {
            this.loadAll = true;
          }
        }
      });
    },
    // 责任楼盘参数改变
    setHousParam (val) {
      this.params.cid = val;
    },
    // 附加状态参数改变
    setAttachStatus (val) {
      this.params.addiCons = val;
    },
    // 改变列表数据
    changeList (index) {
      this.listData.splice(index, 1);
    }
  },

  activated () {
    this.$refs.container.scrollTop = this.$store.state.sales.leasePageScrollTop;
    this.params = Object.assign(this.params, this.$store.state.sales.leasePageParam);
    this.$refs.container.addEventListener('scroll', this.handleScroll);
  },
  deactivated () {
    this.$refs.container.removeEventListener('scroll', this.handleScroll);
    this.$store.commit('sales/setLeaseScroll', this.leasesListScrollTop);
  },
  watch: {
    params: {
      handler: function (newVal, oldVal) {
        this.$store.commit('sales/mergeLeaseParam', newVal);
        if (this.time_out) {
          clearTimeout(this.time_out);
        }
        this.time_out = setTimeout(() => {
          this.listData = [];
          this.pageIndex = 1;
          this.refreshing = false;
          this.loadAll = false;
          this.load();
        }, 600);
      },
      deep: true
    }
  }
};
</script>
<style lang="less" scoped>
.topNav {
  .right_solt {
    display: flex;
    align-items: center;
  }
  .tabs_item {
    position: relative;
    .sup {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      padding: 2px 4px;
      line-height: 12px;
      border-radius: 8px;
      background: #c6a700;
      color: #ffffff;
      position: absolute;
      top: -12px;
      right: -8px;
    }
  }
}
// 列表区
.mainContent {
  width: 100%;
  padding-top: 10px;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 15px;
  .list_container {
    padding: 0 10px;
  }
  &.skipRem {
    height: calc(100% - 104px);
  }
}
// tab 卡样式重写
/deep/.mu-tab {
  color: #797979;
  min-width: auto;
  &.mu-tab-active {
    color: #000000;
  }
}
// 搜索框样式调整
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
</style>
