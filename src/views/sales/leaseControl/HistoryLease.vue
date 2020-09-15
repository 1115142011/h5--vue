<template>
  <section class="v_page" >
    <mu-paper class="v_topNav topNav" :z-depth="4">
      <!-- 顶部导航 -->
      <mu-appbar color="#fdd835" title="历史租约" textColor="#000">
        <!-- 导航图标 -->
        <mu-button icon slot="left" @click="goBack">
          <mu-icon value="arrow_back"></mu-icon>
        </mu-button>
      </mu-appbar>
    </mu-paper>
    <!-- 房源列表 -->
    <div class="v_mainContainer skipRem" ref="container">
      <mu-load-more
        @refresh="refresh"
        :refreshing="refreshing"
        :loading="loading"
        @load="load"
        :loaded-all="loadAll"
      >
        <lease-list :listData="listData"></lease-list>
      </mu-load-more>
      <div class="v_footerHint" v-if="loadAll">没有更多数据了~</div>
    </div>
  </section>
</template>
<script>
import LeaseList from './children/LeaseList';

import { queryHistoryLease } from '@/api/salesApi';

export default {
  components: { LeaseList },
  data () {
    return {
      time_out: null,
      listData: [],
      loadAll: false,
      refreshing: false,
      loading: false,
      params: {
        roomId: '',
        pageSize: 50
      },
      pageIndex: 1
      // tab 卡选项
    };
  },
  created () {
    this.params.roomId = this.$route.query.id;
  },
  methods: {
    // 返回首页
    goBack () {
      this.$store.commit('change_Action', 'pop');
      this.$router.go(-1);
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
      queryHistoryLease(data).then(res => {
        if (!res.data || res.data.length === 0) {
          this.loadAll = true;
        } else {
          this.pageIndex += 1;
          this.refreshing = false;
          this.loading = false;
          this.listData = this.listData.concat(res.data);
          if (res.data.totalCount === this.listData.length) {
            this.loadAll = true;
          }
        }
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
}
</style>
