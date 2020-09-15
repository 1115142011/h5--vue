<template>
  <section class="v_page">
    <mu-paper class="v_topNav topNav" :z-depth="4">
      <!-- 顶部导航 -->
      <mu-appbar color="#fdd835" title="房源管理" textColor="#000">
        <!-- 导航图标 -->
        <mu-button icon slot="left" @click="goBack" v-show="!searchState">
          <mu-icon value="apps"></mu-icon>
        </mu-button>
        <div slot="right" class="right_solt" v-show="!searchState">
          <mu-button icon @click.stop="showBox">
            <mu-icon value="search"></mu-icon>
          </mu-button>
        </div>
        <!-- 搜索框 -->
        <div class="search_wrap" slot="default" v-if="searchState">
          <div class="searchBox skipRem" ref="searchBox" @click.stop>
            <mu-text-field
              v-model="params.queryTerm"
              placeholder="请输入小区名/房号"
              solo
              action-icon="cancel"
              :action-click="clearInput"
              :full-width="true"
              type="text"
              v-focus
            ></mu-text-field>
          </div>
          <mu-button class="cancle skipRem" flat @click="cancleSearch">取消</mu-button>
        </div>
      </mu-appbar>
      <!-- 条件选项 卡 -->
      <div class="state_tabs" v-show="showStatusbar">
        <mu-tabs color="#fdd835" :value.sync="active" indicator-color="#448AFF" full-width>
          <mu-tab
            v-for="(item,index) in tabsOptions"
            :key="index"
            :value="index"
            @click="setSIzer(item,index)"
            class="v_ellipsis"
          >
            <div class="tabs_item">
              <mu-text-field
                full-width
                disabled
                solo
                action-icon="arrow_drop_down"
                :placeholder="item.name"
                v-model="item.currentKey"
              ></mu-text-field>
            </div>
          </mu-tab>
        </mu-tabs>
      </div>
    </mu-paper>
    <!-- 房源列表 -->
    <div class="mainContent skipRem" :class="{maxBox:!showStatusbar||resizeChange}" ref="container">
      <mu-load-more
        @refresh="refresh"
        :refreshing="refreshing"
        :loading="loading"
        @load="load"
        :loaded-all="loadAll"
      >
        <mu-paper
          :z-depth="2"
          class="todo_house v_block"
          @click="changeTodo"
          :class="{isClick:params.completeFlag===0}"
        >
          <mu-ripple color="#4289ff" class="content_box" :opacity="0.5">
            <div class="left_box">
              <img :src="editIcon" class="editIconImg" />
              <span class="text">待完善房源</span>
            </div>
            <span class="right_badge center">{{improvedNum}}</span>
          </mu-ripple>
        </mu-paper>

        <list-item :listData="listData"></list-item>
      </mu-load-more>
      <!-- 数据加载完毕提示 -->
      <div class="v_footerHint" v-if="loadAll">没有更多数据了~</div>
    </div>
    <mu-paper class="footer_bar skipRem" :z-depth="10" v-if="!resizeChange">
      <mu-button color="#fdd835" full-width textColor="#333333" @click="goAdd">添加新房源</mu-button>
    </mu-paper>
    <sizer-modal
      v-if="openSizer"
      :show.sync="openSizer"
      :currentValue="selectValue"
      :currentKey="tempOptionsKey"
      :optionsArry="tempOptionsList"
      @changeValue="changeParam"
    ></sizer-modal>
  </section>
</template>
<script>
import ListItem from '../components/ListItem';
import sizerModal from '../components/sizerModal';
import { queryHouseList, queryHouseListNum } from '@/api/proprietorApi';

export default {
  components: { ListItem, sizerModal },
  data () {
    return {
      editIcon: require('@/assets/images/edit.svg'),
      showStatusbar: true,
      openSizer: false,
      containerScrollTop: 0, // 列表容器滚动条高度
      improvedNum: 0, // 待完善数量
      time_out: null,
      listData: [],
      loadAll: false,
      refreshing: false,
      loading: false,
      searchState: false,
      active: 0, // tab 卡选中项
      params: {
        queryTerm: undefined, // 收索关键词参数
        status: undefined, // 房间-0已上架/1未上架
        completeFlag: -1, // 是否完善 1已完善 --0待完善
        mgtFlag: undefined, // // 0其它人 1本人
        mode: 2, // 1包租，2托管，3闪租
        // page_no: 1, // 当前page-index
        page_size: 10
      },
      pageIndex: 1,
      tempOptionsList: [],
      tempOptionsKey: '按类型',
      selectValue: undefined,
      selectPattern: undefined,
      tabsOptions: [
        {
          name: '按类型',
          model: 'mode',
          currentKey: '托管',
          list: [
            {
              label: '托管',
              value: 2
            },
            {
              label: '闪租',
              value: 3
            }
          ]
        },
        {
          name: '按状态',
          model: 'status',
          currentKey: '',
          list: [
            {
              label: '上架中',
              value: 1
            },
            {
              label: '未上架',
              value: 0
            }
          ]
        },
        {
          name: '负责人',
          model: 'mgtFlag',
          currentKey: '',
          list: [
            {
              label: '我负责的',
              value: 1
            },
            {
              label: '其它',
              value: 0
            }
          ]
        }
      ]
    };
  },
  created () {
    this.getListData(this.params);
  },
  computed: {
    resizeChange () {
      return this.$store.state.reiseChange;
    }
  },
  methods: {
    // 开启筛选器
    setSIzer (item) {
      this.selectValue = this.params[item.model];
      this.selectPattern = item.model;
      this.tempOptionsKey = item.name;
      this.tempOptionsList = item.list;
      this.openSizer = true;
    },
    // 更改参数
    changeParam (val) {
      if (!val.isChange) return;
      this.params[this.selectPattern] = val.value;
      this.tabsOptions = this.tabsOptions.map(item => {
        if (item.model === this.selectPattern) {
          item.currentKey = this.getStr(val.label);
        }
        return item;
      });
    },
    // 截取字符串
    getStr (str) {
      if (!str) return '';
      let tempStr = '';
      if (str.length > 4) {
        tempStr = str.substring(0, 3) + '..';
      } else {
        tempStr = str;
      }
      return tempStr;
    },
    // 跳转添加房源
    goAdd () {
      this.$router.push('/proprietor/addHouse');
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
    // 清除输入
    clearInput () {
      this.params.queryTerm = '';
    },
    // 搜索取消
    cancleSearch () {
      this.params.queryTerm = '';
      this.searchState = false;
    },
    // 改变搜索状态-待完善房源
    changeTodo () {
      this.params.completeFlag = this.params.completeFlag === -1 ? 0 : -1;
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
      this.loading = true;
      queryHouseList(data).then(res => {
        if (!res.data.houses || res.data.houses.length === 0) {
          this.loadAll = true;
        } else {
          this.pageIndex += 1;
          this.refreshing = false;
          this.loading = false;
          this.listData = this.listData.concat(res.data.houses);
          if (res.data.total_count === this.listData.length) {
            this.loadAll = true;
          }
        }
      });
      this.getTotalMun();
    },
    // 查询待完善房源数量
    getTotalMun () {
      queryHouseListNum().then(res => {
        this.improvedNum = res.data.houseNum || 0;
      });
    }
  },
  activated () {
    this.$refs.container.scrollTop = this.$store.state.proprietor.houseScrollTop;
    this.$refs.container.addEventListener('scroll', this.handleScroll);
  },
  deactivated () {
    this.$refs.container.removeEventListener('scroll', this.handleScroll);
    this.$store.commit('proprietor/setHouseScroll', this.containerScrollTop);
  },
  directives: {
    focus: {
      // 指令的定义
      inserted: function (el) {
        let input = el.getElementsByTagName('input');
        input[0].focus();
      }
    }
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
    'params.completeFlag': function (newV, oldV) {
      if (newV === 0) {
        this.params.queryTerm = undefined; // 收索关键词参数
        this.params.status = undefined; // 房间-0已上架/1未上架
        this.params.mgtFlag = 1; // // 0其它人 1本人
        this.showStatusbar = false;
      } else {
        this.showStatusbar = true;
        this.params.mgtFlag = undefined; // // 0其它人 1本人
      }
    }
  }
};
</script>
<style lang="less" scoped>
.v_page {
  background: rgba(238, 238, 238, 1);
}
.topNav {
  .right_solt {
    display: flex;
    align-items: center;
  }
  .search_wrap {
    display: flex;
    align-items: center;
    width: 100%;
    // 搜索框
    .cancle.skipRem {
      height: 33px;
      margin: 0;
      font-size: 16px;
      transform: translateY(3px);
    }
    .searchBox {
      flex: 1;
      padding: 0;
      align-items: center;
      // 搜索框调整
      &/deep/.mu-input {
        min-height: 30px;
        padding: 0;
        margin: 0;
        align-items: center;
        .mu-text-field {
          padding: 0;
          margin: 0;
          width: 100%;
          background: #ffffff;
          line-height: 32px;
          border-radius: 5px;
          padding-left: 10px;
          line-height: 100%;
          box-shadow: 0px 2px 2px 0px rgba(16, 16, 16, 0.3);
          input::-webkit-input-placeholder {
            line-height: 20px;
          }
        }
        &.is-solo {
          margin: 0;
        }
      }
    }
  }
  /deep/.tabs_item {
    padding-left: 15px;
    .mu-text-field-input {
      text-align: center;
      color: rgb(0, 0, 0);
    }

    .mu-input-action-icon {
      margin-bottom: 0;
    }
  }

  // tab 卡样式重写
  /deep/.state_tabs {
    background: #fdd835;
    .mu-tab {
      color: #797979;
      &.mu-tab-active {
        color: #000000;
      }
    }
    .mu-tab-wrapper {
      padding: 0;
    }
    .mu-input {
      font-size: 16px;
    }
    .mu-select-input {
      text-align: center;
    }
  }
}

// 房源列表区
.mainContent {
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 5px 8px 0;
  &.skipRem {
    height: calc(100% - 158px);
  }
  &.maxBox {
    height: calc(100% - 112px);
  }
}
.todo_house {
  position: relative;
  padding: 15px 25px;
  margin-top: 10px;
  margin-bottom: 3px;
  .content_box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .right_badge {
      height: 16px;
      min-width: 16px;
      font-size: 10px;
      font-weight: bolder;
      border: solid 1px #d20000;
      border-radius: 8px;
      padding-left: 6px;
      padding-right: 6px;
      padding-top: 2px;
      color: rgba(255, 255, 255, 0.87);

      background: #fc3b3b;
    }
  }

  .left_box {
    display: flex;
    align-items: center;
    .icon {
      position: relative;
      top: -3px;
    }
    .text {
      margin-left: 20px;
      font-weight: bold;
    }
  }
  &.isClick {
    background: #4289ff;
    color: #ffffff;
  }
}
.editIconImg{
  width: 25px;
  height: 25px;
}
/deep/.mu-radio {
  margin-right: 10px;
}
</style>
