<template>
  <section
    class="v_page"
    v-loading="submitLoading"
    data-mu-loading-text="请求中..."
  >
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000">
      <mu-button icon slot="left" @click="goBack">
        <mu-icon value="arrow_back"></mu-icon>
      </mu-button>
      <div slot="default">变更信息</div>
      <!-- <div slot="default"> 变更信息</div> -->
    </mu-appbar>
    <div class="v_mainContainer">
      <lease-title></lease-title>
      <mu-paper :z-depth="4" class="outer_box v_block">
        <!-- 第一步--变更信息填写 -->
        <mu-form ref="first_step" :model="formMsg" class="step_form" v-if="step===1">
          <div class="title" ref="test">请选择新房源</div>
          <mu-form-item label="变更房源" label-float prop="room" :rules="room">
            <mu-text-field v-model="formMsg.room" prop="room" @focus="openSearch($event)"></mu-text-field>
          </mu-form-item>
        </mu-form>
        <!-- 第二步--预定变更成功 -->
        <div class="change_finsh" v-if="step===2">
          <div class="hit_msg">预定变更成功</div>
          <div class="hit_title">房源变更</div>
          <div class="item topSpace">
            <span class="leftText v_ellipsis">原房源</span>
            <span class="rightText v_ellipsis">{{roomMsg.full_name}}</span>
          </div>
          <div class="item topSpace">
            <span class="leftText v_ellipsis">变更房源</span>
            <span class="rightText v_ellipsis">{{selectValue.full_name}}</span>
          </div>
        </div>
      </mu-paper>
      <!-- 变更房源收索弹框 -->
      <mu-bottom-sheet :open.sync="open">
        <div class="search_container">
          <div class="input">
            <mu-text-field
              v-model="params.query_term"
              full-width
              action-icon="search"
              placeholder="请输入房源名称"
            ></mu-text-field>
          </div>
          <div class="radio_list" ref="container">
            <mu-load-more
              @refresh="refresh"
              :refreshing="refreshing"
              :loading="loading"
              @load="load"
              :loaded-all="loadAll"
            >
              <div class="select-control-row" v-for="(item,index) in radioData" :key="index">
                <mu-radio :value="item" v-model="selectValue" :label="item.full_name">
                  <!--  -->
                  <!-- <span slot>{{item.full_name}}---------------</span> -->
                </mu-radio>
              </div>
            </mu-load-more>
            <div class="v_footerHint" v-if="loadAll">没有更多数据了~</div>
          </div>
          <div class="footer_btn">
            <mu-button color="#fdd835" textColor="#333333" class="confim_btn" @click="confim">确定</mu-button>
          </div>
        </div>
      </mu-bottom-sheet>
    </div>
     <!-- 按钮 -->
      <mu-paper class="form_footer_btn" :z-depth="4">
        <mu-button
          color="#fdd835"
          textColor="#333333"
          @click="changeStep('next')"
          v-show="step===1"
        >下一步</mu-button>

        <mu-button
          color="#fdd835"
          textColor="#333333"
          @click="changeStep('back')"
          v-show="step===2"
        >返回列表</mu-button>
      </mu-paper>
  </section>
</template>
<script>
import { getSalesHouseList, myReserveChange } from '@/api/salesApi';
import LeaseTitle from '../components/LeaseTitle';
export default {
  components: { LeaseTitle },
  data () {
    return {
      onClick: false, // 记录是否点击
      submitLoading: false,
      step: 1,
      selectValue: undefined,
      open: false, // 打开搜索弹框
      params: {
        query_term: undefined, // 收索关键词参数
        status: 1, // 房间状态
        // page_no: 1, // 当前page-index
        page_size: 10
      },
      pageIndex: 1,
      radioData: [],
      time_out: undefined, // 请求延时器
      loadAll: false, // --滚动加载相关
      refreshing: false,
      loading: false,
      room: [{ validate: val => !!val, message: '必须选择变更的房源' }],
      formMsg: {
        room: ''
      }
    };
  },
  computed: {
    roomMsg () {
      return this.$store.state.sales.roomParams;
    }
  },
  methods: {
    // 返回
    goBack () {
      this.$store.commit('change_Action', 'pop');
      this.$router.go(-1);
    },
    // 按钮点击
    changeStep (direction) {
      if (direction === 'next') {
        this.$refs.first_step.validate().then(result => {
          if (result) {
            let obj = {
              reserveId: this.$store.state.sales.leaseFormData.leaseId,
              roomId: this.selectValue.room_id
            };
            this.submitChange(obj);
          }
        });
      } else {
        this.$store.commit('change_Action', 'pop');
        this.$router.go(-1);
      }
    },
    // 打开搜索弹框
    openSearch (e) {
      this.open = true;
      e.target.blur();
      if (!this.radioData || this.radioData.length === 0) {
        this.getListData(this.params);
      }
    },
    // 弹框选中确认
    confim () {
      if (this.selectValue) {
        this.formMsg.room = this.selectValue.full_name;
        this.$refs.first_step.clear();
      }
      this.open = false;
    },
    // 加载更新-----弹框列表
    refresh () {
      this.refreshing = true;
      this.loadAll = false;
      this.radioData = [];
      this.$refs.container.scrollTop = 0;
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
      getSalesHouseList(data).then(res => {
        if (!res.data.rooms || res.data.rooms.length === 0) {
          this.loadAll = true;
        } else {
          this.pageIndex += 1;
          this.refreshing = false;
          this.loading = false;
          this.radioData = this.radioData.concat(res.data.rooms);
          if (res.data.total_count === this.radioData.length) {
            this.loadAll = true;
          }
        }
      });
    },
    // 提交租约变更
    submitChange (obj) {
      if (this.onClick) return;
      this.onClick = true;
      this.submitLoading = true;
      myReserveChange(obj).then(res => {
        this.onClick = false;
        this.submitLoading = false;
        this.step += 1;
      })
        .catch(() => {
          this.onClick = false;
          this.submitLoading = false;
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
          this.radioData = [];
          this.pageIndex = 1;
          this.refreshing = false;
          this.loadAll = false;
          this.load();
        }, 800);
      },
      deep: true
    }
  }
};
</script>
<style lang="less" scoped>
.step_form {
  padding: 20px 20px 50px;
  .title {
    font-size: 14px;
    font-weight: 600;
  }
  /deep/.mu-form-item {
    margin-bottom: 0;
  }
}
.change_finsh {
  padding-bottom: 40px;
  .hit_msg {
    padding: 30px 20px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #4cb58f;
    font-size: 18px;
    font-weight: 600;
  }
  .hit_title {
    font-size: 16px;
    padding: 15px;
    border-bottom: solid 1px #cccccc;
  }
  .item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 20px;
    &.topSpace {
      margin-top: 10px;
    }
    .leftText {
      flex: 3;
      font-size: 16px;
      color: #000000;
      font-weight: 600;
    }
    .rightText {
      flex: 7;
      font-size: 14px;
      text-align: right;
    }
  }
}
//  搜索弹框样式
.search_container {
  height: 335px;
  .input {
    display: flex;
    // padding: 10px 20px 0;

    align-items: center;
    & /deep/.full-width {
      margin: 0;
      .mu-text-field {
        padding-left: 20px;
        padding-right: 20px;
      }
    }
  }
  .radio_list {
    height: 220px;
    overflow: auto;
    .select-control-row {
      padding: 0 20px;
      /deep/.mu-radio-label {
        font-size: 14px;
      }
    }
  }
  // 改变弹框按钮大小
  .footer_btn {
    display: flex;
    justify-content: flex-end;
    padding: 10px 10px 0;
    border-top: solid 1px #cccccc;
    /deep/.mu-raised-button {
      min-width: 60px;
    }
  }
}
</style>
