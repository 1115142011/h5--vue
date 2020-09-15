<template>
  <section class="v_page">
      <mu-appbar color="#fdd835" class="v_topNav topNav" title="维修费用驳回" textColor="#000">
        <mu-button icon slot="left" @click="goBack" v-show="!searchState">
          <mu-icon value="arrow_back"></mu-icon>
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
              v-model="params.houseName"
              placeholder="请输入房屋名称"
              solo
              action-icon="cancel"
              :action-click="clearInput"
              :full-width="true"
            ></mu-text-field>
          </div>
          <mu-button class="cancle skipRem" flat @click="cancleSearch">取消</mu-button>
        </div>
      </mu-appbar>
    <!-- 列表 -->
    <div class="v_mainContainer skipRem" ref="container">
      <repair-list :listData="listData"></repair-list>
      <div class="v_footerHint">没有数据了~</div>
    </div>
  </section>
</template>
<script>
import { queryRejectOrder } from '@/api/maintainApi';
import repairList from '../children/repairList';
export default {
  components: { repairList },
  data () {
    return {
      time_out: null,
      listData: [],
      loadAll: false,
      loading: false,
      searchState: false,
      active: 0, // tab 卡选中项
      params: {
        houseName: '' // 收索关键词参数
      }
    };
  },
  created () {
    this.getListData(this.params);
  },
  methods: {
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
      this.params.houseName = '';
    },
    // 搜索取消
    cancleSearch () {
      this.params.houseName = '';
      this.searchState = false;
    },
    // 获取数据
    getListData (pram) {
      this.loading = true;
      queryRejectOrder(pram).then(({ data }) => {
        this.loading = false;
        this.listData = data || [];
      });
    }
  },
  watch: {
    params: {
      handler: function (newVal, oldVal) {
        if (this.time_out) {
          clearTimeout(this.time_out);
        }
        this.time_out = setTimeout(() => {
          this.getListData(this.params);
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
  .tabs_item {
    padding-left: 15px;
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
  }
}
/deep/.mu-radio {
  margin-right: 10px;
}
</style>
