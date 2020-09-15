<template>
  <section class="v_page">
    <mu-paper class="v_topNav topNav" :z-depth="4">
      <!-- 顶部导航 -->
      <mu-appbar color="#fdd835" title="房源查询" textColor="#000">
        <!-- 导航图标 -->
        <mu-button icon slot="left" @click="goBack" v-show="!searchState">
          <mu-icon value="apps"></mu-icon>
        </mu-button>
        <div slot="right" class="right_solt" v-show="!searchState">
          <span class="typeBtn" @click="changListType">{{params.team_flag===1?'本组':'他组'}}</span>
          <mu-button icon @click.stop="showBox">
            <mu-icon value="search"></mu-icon>
          </mu-button>
        </div>
        <!-- 搜索框 -->
        <div class="search_wrap" slot="default" v-if="searchState">
          <div class="searchBox skipRem" ref="searchBox" @click.stop>
            <mu-text-field
              v-model="params.query_term"
              placeholder="请输入小区名/房号"
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
      <mu-tabs color="#fdd835" :value.sync="active" indicator-color="#448AFF" full-width>
        <mu-tab
          @click="showDialog(index,item)"
          v-for="(item,index) in tabs"
          :key="index"
          :value="index"
          class="v_ellipsis"
        >{{item.name}}</mu-tab>
      </mu-tabs>
    </mu-paper>
    <!-- 房源列表 -->
    <div class="mainContent skipRem" ref="container">
      <mu-load-more
        @refresh="refresh"
        :refreshing="refreshing"
        :loading="loading"
        @load="load"
        :loaded-all="loadAll"
      >
        <!-- 滑屏组件 -->
        <div class="swperBox">
          <attach-tag-swper @changeBenefittype='changeTagParam' :list="swperListData" :current='currentDiscounts'></attach-tag-swper>
        </div>
        <!-- 它组房源 分割线 -->
        <div class="cutOff" v-show="params.team_flag===2">
          <span class="bar"></span>
          <span class="cutOffText">以下房源为其他组房源</span>
          <span class="bar"></span>
        </div>
        <list-item :listData="listData" :type="params.team_flag"></list-item>
      </mu-load-more>
      <!-- 标签筛选弹框 -->
      <tag-model :show.sync="tagsModel" @changeData="changeTagsData"></tag-model>
      <!-- 租期弹框 -->
      <tabs-duration-dialog
        :show.sync="openDurationDialog"
        :current="params.period_type"
        @changeValue="changeDurationValue"
      ></tabs-duration-dialog>
      <!-- 位置选项弹框 -->
      <location-model :show.sync="openLocation" @changeLocation="setLoction" v-if="openLocation"></location-model>
      <!-- 数据加载完毕提示 -->
      <div class="v_footerHint" v-if="loadAll">没有更多数据了~</div>
    </div>
    <!-- tab卡切换选项 状态/租金 弹框 -->
    <mu-dialog
      scrollable
      :open.sync="openDialog"
      width="70%"
      dialog-class="selectDialog"
      lock-scroll
      v-if="openDialog"
    >
      <div slot="title" class="dialogTitle">
        <div>{{selectMenu.title}}</div>
        <div class="priceInputBox" v-if="selectMenu.show">
          <div class="minInput">
            <mu-text-field
              v-model="input.min_rent"
              type="number"
              @input="priceInput('min_rent')"
              pattern="[0-9]*"
              full-width
              placeholder="最小金额"
            ></mu-text-field>
            <br />
          </div>
          <span class="cutOff">~</span>
          <div class="maxInput">
            <mu-text-field
              v-model="input.max_rent"
              type="number"
              @input="priceInput('max_rent')"
              pattern="[0-9]*"
              full-width
              placeholder="最大金额"
            ></mu-text-field>
            <br />
          </div>
        </div>
      </div>
      <!-- 单选列表 -->
      <div class="dailogContent">
        <mu-list>
          <mu-list-item v-for="(item,index) in selectMenu.options" :key="index">
            <mu-list-item-content>
              <mu-radio :label="item.name" :value="item" v-model="selectMenu.value"></mu-radio>
            </mu-list-item-content>
          </mu-list-item>
        </mu-list>
      </div>
      <div slot="actions" class="footerBox">
        <span class="priceHint" v-if="selectMenu.show">范围:{{selectMenu.value.name}}</span>
        <div class="btnBox">
          <mu-button flat color="primary" small @click="closeDialog">取消</mu-button>
          <mu-button flat color="primary" small @click="confirm">好的</mu-button>
        </div>
      </div>
    </mu-dialog>
  </section>
</template>
<script>
import ListItem from './children/ListItem';
import AttachTagSwper from './children/AttachTagSwper'; // 状态 滑屏选项
import TagModel from './children/TagModel';
import LocationModel from './children/LocationModel';
import { getSalesHouseList, getSpecialList } from '@/api/salesApi';
import tabsDurationDialog from './children/tabsDurationDialog';
export default {
  name: 'keep-houseList',
  components: { ListItem, TagModel, LocationModel, tabsDurationDialog, AttachTagSwper },
  data () {
    return {
      swperListData: [],
      containerScrollTop: 0, // 列表容器滚动条高度
      time_out: null,
      listData: [],
      input: {
        name: '',
        min_rent: '', // 价格最大输入
        max_rent: '' // 价格最小输入
      },
      loadAll: false,
      refreshing: false,
      loading: false,
      searchState: false,
      active: 0, // tab 卡选中项
      params: {
        district_id: '', // 一级区域id
        community_id: '', // 二级区域id
        query_term: undefined, // 收索关键词参数
        status: '', // 房间状态
        team_flag: 1, // 1，本组--2，他组/默认
        min_rent: '', // 最小租金
        max_rent: '', // 最大租金
        rent_mode: '', // 0--整租/1--分租
        room_type: '', // 房间类型
        period_type: undefined, // 租期时长筛选
        benefit_code: '', // 优惠编码
        benefit_type: '', // 特价活动
        // page_no: 1, // 当前page-index
        page_size: 10
      },
      pageIndex: 1,
      tabs: [
        // tab 卡选项
        {
          name: '状态',
          type: 'state'
        },
        {
          name: '租金',
          type: 'rental'
        },
        {
          name: '位置',
          type: 'location'
        },
        {
          name: '租期',
          type: 'duration'
        },
        {
          name: '筛选',
          type: 'tags'
        }
      ],
      openDialog: false, // 打开模态框--状态/价格
      openLocation: false, // 打开位置选择弹框
      tagsModel: false, // 打开标签选项弹框开启状态
      selectMenu: undefined, // 弹框渲染数据--单选列表
      openDurationDialog: false, // 租期时长数据
      currentDiscounts: undefined, // swper选中项
      // 状态
      state: {
        title: '状态',
        value: '全部',
        options: [
          {
            name: '全部',
            value: ''
          },
          {
            name: '空置',
            value: 1
          },
          {
            name: '办理中',
            value: 4
          },
          {
            name: '预定中',
            value: 5
          },
          {
            name: '在租中',
            value: 3
          },
          {
            name: '即将到期',
            value: 2
          }
        ]
      },
      // 租金
      rental: {
        title: '租金',
        value: {
          name: '不限',
          min_rent: '',
          max_rent: ''
        },
        show: true,
        options: [
          {
            name: '不限',
            min_rent: '',
            max_rent: ''
          },
          {
            name: '0-500元',
            min_rent: 0,
            max_rent: 500
          },
          {
            name: '500-1000元',
            min_rent: 500,
            max_rent: 1000
          },
          {
            name: '1000-1500元',
            min_rent: 1000,
            max_rent: 1500
          },
          {
            name: '1500-2000元',
            min_rent: 1500,
            max_rent: 2000
          },
          {
            name: '2000-3000元',
            min_rent: 2000,
            max_rent: 3000
          },
          {
            name: '3000-5000元',
            min_rent: 3000,
            max_rent: 5000
          },
          {
            name: '5000以上',
            min_rent: 5000,
            max_rent: ''
          }
        ]
      }
    };
  },
  created () {
    this.querySwperData();
    this.getListData(this.params);
  },
  // 从首页进初始化参数
  beforeRouteEnter (to, from, next) {
    let fromPath = from.fullPath;
    next(vm => {
      if (fromPath === '/index') {
        vm.active = 0; // tab 卡选中项
        vm.params = {
          district_id: '', // 一级区域id
          community_id: '', // 二级区域id
          query_term: undefined, // 收索关键词参数
          status: '', // 房间状态
          team_flag: 1, // 1，本组--2，他组/默认
          min_rent: '', // 最小租金
          max_rent: '', // 最大租金
          rent_mode: '', // 0--整租/1--分租
          room_type: '', // 房间类型
          period_type: undefined, // 租期时筛选
          benefit_code: '', // 优惠编码
          benefit_type: '', // 特价活动
          page_size: 10
        };
        vm.searchState = false;
        vm.input = {
          name: '',
          min_rent: '', // 价格最大输入
          max_rent: '' // 价格最小输入
        };
        vm.pageIndex = 1;
        vm.tabs = [
          // tab 卡选项
          {
            name: '状态',
            type: 'state'
          },
          {
            name: '租金',
            type: 'rental'
          },
          {
            name: '位置',
            type: 'location'
          },
          {
            name: '租期',
            type: 'duration'
          },
          {
            name: '筛选',
            type: 'tags'
          }
        ];
        // 状态
        vm.state = {
          title: '状态',
          value: '全部',
          options: [
            {
              name: '全部',
              value: ''
            },
            {
              name: '空置',
              value: 1
            },
            {
              name: '办理中',
              value: 4
            },
            {
              name: '预定中',
              value: 5
            },
            {
              name: '在租中',
              value: 3
            },
            {
              name: '即将到期',
              value: 2
            }
          ]
        };
        vm.currentDiscounts = undefined;
        // 租金
        vm.rental = {
          title: '租金',
          value: {
            name: '不限',
            min_rent: '',
            max_rent: ''
          },
          show: true,
          options: [
            {
              name: '不限',
              min_rent: '',
              max_rent: ''
            },
            {
              name: '0-500元',
              min_rent: 0,
              max_rent: 500
            },
            {
              name: '500-1000元',
              min_rent: 500,
              max_rent: 1000
            },
            {
              name: '1000-1500元',
              min_rent: 1000,
              max_rent: 1500
            },
            {
              name: '1500-2000元',
              min_rent: 1500,
              max_rent: 2000
            },
            {
              name: '2000-3000元',
              min_rent: 2000,
              max_rent: 3000
            },
            {
              name: '3000-5000元',
              min_rent: 3000,
              max_rent: 5000
            },
            {
              name: '5000以上',
              min_rent: 5000,
              max_rent: ''
            }
          ]
        };
      }
    });
  },
  methods: {
    // 获取 swper数据
    querySwperData () {
      getSpecialList().then(res => {
        this.swperListData = res.data.benefits;
      });
    },
    // 滚动监测
    handleScroll () {
      this.containerScrollTop = this.$refs.container.scrollTop;
    },
    // 返回首页
    goBack () {
      this.$router.push('/index');
    },
    // 点击搜素按钮
    showBox () {
      this.searchState = true;
    },
    // 改变房源列表数据源--本组/它组
    changListType () {
      this.params.team_flag = this.params.team_flag === 1 ? 2 : 1;
    },
    // 清除输入
    clearInput () {
      this.params.query_term = '';
    },
    // 搜索取消
    cancleSearch () {
      this.params.query_term = '';
      this.searchState = false;
    },
    // 开启对话框
    showDialog (index, item) {
      switch (item.type) {
        case 'tags':
          this.tagsModel = true;
          break;
        case 'location':
          this.openLocation = true;
          break;
        case 'rental':
        case 'state':
          this.selectMenu = this[item.type];
          this.openDialog = true;
          break;
        case 'duration':
          this.openDurationDialog = true;
        default:
          break;
      }
    },
    // 选项确定
    confirm () {
      let type = this.tabs[this.active].type;
      if (type === 'rental') {
        // 租金
        this.params.min_rent = this.selectMenu.value.min_rent;
        this.params.max_rent = this.selectMenu.value.max_rent;
      } else if (type === 'state') {
        // 状态
        this.params.status = this.selectMenu.value.value;
      }
      this.tabs[this.active].name = this.selectMenu.value.name; // 单选选中后数据回填到tab卡
      this.openDialog = false;
    },
    // 取消对话框单选更改
    closeDialog () {
      this.openDialog = false;
    },
    // 价格区间选择手动的输入
    priceInput (type) {
      this.input[type] = this.input[type].replace(/\D/, ''); // 去除非数字字符
      switch (true) {
        case Boolean(!this.input.min_rent && !this.input.max_rent):
          this.input.name = '不限租金';
          break;
        case Boolean(!this.input.min_rent && this.input.max_rent):
          this.input.name = `${this.input.max_rent}元以下`;
          break;
        case Boolean(this.input.min_rent && !this.input.max_rent):
          this.input.name = `${this.input.min_rent}元以上`;
          break;
        default:
          this.input.name = `${this.input.min_rent} - ${this.input.max_rent}元`;
          break;
      }
      this.selectMenu.value = this.input;
    },
    // 筛选标签确认
    changeTagsData (obj) {
      this.params.rent_mode = obj.rent_mode.toString();
      this.params.room_type = obj.room_type.toString();
    },
    // 滑动筛选项更改
    changeTagParam (item) {
      this.currentDiscounts = item.current;
      this.params.benefit_code = item.planId;
      this.params.benefit_type = item.type;
    },
    // 位置信息改变
    setLoction (value, type) {
      if (type === 'father') {
        this.params.district_id = value.id;
        this.tabs[this.active].name = this.getStr(value.name);
      } else if (type === 'child') {
        this.params.community_id = value.id;
        this.tabs[this.active].name = this.getStr(value.name);
      } else {
        this.params.district_id = '';
        this.params.community_id = '';
        this.tabs[this.active].name = '位置';
      }
    },
    // 租期条件改变
    changeDurationValue (value) {
      console.log('触发', value);
      this.params.period_type = value.value;
      this.tabs[this.active].name = this.getStr(value.name);
    },
    // 截取字符串
    getStr (str) {
      let tempStr = '';
      if (str.length > 4) {
        tempStr = str.substring(0, 3) + '...';
      } else {
        tempStr = str;
      }
      return tempStr;
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
    getListData (pram, index) {
      let data = pram;
      data.page_no = index || 1;
      data.loginType = Number(localStorage.getItem('loginType'));
      this.loading = true;
      getSalesHouseList(data).then(res => {
        if (!res.data.rooms || res.data.rooms.length === 0) {
          this.loadAll = true;
        } else {
          this.pageIndex += 1;
          this.refreshing = false;
          this.loading = false;
          this.listData = this.listData.concat(res.data.rooms);
          if (res.data.total_count === this.listData.length) {
            this.loadAll = true;
          }
        }
      });
    }
  },
  activated () {
    this.$refs.container.scrollTop = this.$store.state.sales.houseScrollTop;
    this.$refs.container.addEventListener('scroll', this.handleScroll);
  },
  deactivated () {
    this.$refs.container.removeEventListener('scroll', this.handleScroll);
    this.$store.commit('sales/setHouseScroll', this.containerScrollTop);
  },
  watch: {
    params: {
      handler: function (newVal, oldVal) {
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
    },
    'params.team_flag': {
      handler: function (newVal, oldVal) {
        localStorage.setItem('team_flag', newVal);
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style lang="less" scoped>
.topNav {
  .right_solt {
    display: flex;
    align-items: center;
    .typeBtn {
      padding: 5px 10px;
      background: #000000;
      color: #fdd835;
      border-radius: 14px;
    }
  }
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
  // tab 卡样式重写
  /deep/.mu-tab {
    color: #797979;
    &.mu-tab-active {
      color: #000000;
    }
  }
}
// 房源列表区
.mainContent {
  width: 100%;
  padding-top: 10px;
  overflow-x: hidden;
  overflow-y: auto;
  &.skipRem {
    height: calc(100% - 104px);
  }
  // swper
  .swperBox {
    padding: 5px 0;
  }
  // 分割线
  .cutOff {
    width: 100%;
    padding: 10px;
    display: flex;
    font-size: 12px;
    color: #797979;
    justify-content: center;
    align-items: center;
    .cutOffText {
      margin: 0 5px;
    }
    .bar {
      width: 20px;
      border-bottom: solid 1px #797979;
    }
  }
}
// 区域选择
.locationContent {
  width: 100%;
  display: flex;
  .box {
    flex: 1;
    border-right: solid 1px #cccccc;
  }
}
// 选项弹框样式调整
/deep/.selectDialog {
  border-radius: 8px;
  .mu-dialog-title {
    border-bottom: solid 1px #cccccc; // header 边框线
    .priceInputBox {
      display: flex;
      justify-content: space-around;
      flex-wrap: nowrap;
      .cutOff {
        margin: 0 8px;
      }
      .mu-input {
        margin: 0;
        margin-bottom: -20px;
      }
      input {
        font-size: 12px;
      }
    }
  }
  .dialogTitle {
    width: 100%;
  }
  .mu-dialog-body {
    padding-bottom: 0;
  }
  // 弹框底部样式重写
  .mu-dialog-actions {
    border-top: solid 1px #cccccc; // footer 边框线
  }
  .footerBox {
    width: 100%;
    padding: 10px 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    // 金额提示
    .priceHint {
      width: 55%;
      font-size: 12px;
      font-weight: 600;
      word-wrap: break-word;
      color: #000000;
    }
    .btnBox {
      display: flex;
      flex-wrap: nowrap;
      min-width: 100px;
      .mu-button {
        min-width: 50px;
      }
    }
  }
}
</style>
