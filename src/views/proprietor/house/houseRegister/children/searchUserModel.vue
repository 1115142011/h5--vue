<template>
  <mu-bottom-sheet class="wrap" :open.sync="show">
    <div class="top-search skipRem">
      <div class="btn">
        <mu-button flat small color="primary" @click="cancle">取消</mu-button>
      </div>
      <div class="input-box">
        <mu-text-field
          full-width
          v-model="params.queryItem"
          :placeholder="placeholder"
          action-icon="search"
        ></mu-text-field>
      </div>
      <div class="btn">
        <mu-button flat small color="primary" @click="confirm">确认</mu-button>
      </div>
    </div>
    <div class="list-content" ref="container">
      <mu-load-more
        @refresh="refresh"
        :refreshing="refreshing"
        :loading="loading"
        @load="load"
        :loaded-all="loadAll"
      >
        <mu-list>
          <mu-list-item
            class="list-item"
            button
            @click="selectedItem(index,item)"
            v-for="(item,index) in listData"
            :key="index+'item'"
          >
            <mu-list-item-action>
              <mu-radio :value="index" v-model="selected"></mu-radio>
            </mu-list-item-action>
            <mu-list-item-title>
              <mu-icon :value="icon" class="left-icon" :size="15" color="#009DBC"></mu-icon>
              <span>{{item.name}}</span>
              <mu-icon
                value="phone_iphone"
                class="right-icon"
                :size="15"
                color="#009DBC"
                v-if="item.mobile"
              ></mu-icon>
              <span>{{item.mobile}}</span>
            </mu-list-item-title>
          </mu-list-item>
        </mu-list>
        <div class="center hint" v-if="loadAll">没有数据了~</div>
      </mu-load-more>
      <div class="center hint" v-if="!loadAll&&listData.length==0&&!loading">请输入关键词进行搜索~</div>
    </div>
  </mu-bottom-sheet>
</template>
<script>
// import { queryProprietor } from '@/api/globalApi';
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '已认证的业主信息'
    },
    queryApi: {
      type: Function
    },
    icon: {
      type: String,
      default: 'person'
    }
  },

  data () {
    return {
      selected: undefined,
      params: {
        queryItem: '',
        page_size: 10
      },
      userParam: undefined,
      time_out: null,
      listData: [],
      loadAll: false,
      loading: false,
      refreshing: false,
      pageIndex: 1
    };
  },
  computed: {
    show: {
      get () {
        return this.open;
      },
      set (val) {
        this.$emit('update:open', val);
      }
    }
  },
  methods: {
    // 取消
    cancle () {
      this.$emit('update:open', false);
    },
    // 确认
    confirm () {
      if (this.userParam) {
        this.$emit('chooseChange', this.userParam);
      }
      this.$emit('update:open', false);
    },
    // 选项点击
    selectedItem (index, param) {
      this.selected = index;
      this.userParam = param;
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
      // queryProprietor
      this.queryApi(data).then(res => {
        if (!res.data || res.data.length === 0) {
          this.loadAll = true;
        } else {
          this.pageIndex += 1;
          this.refreshing = false;
          this.loading = false;
          this.listData = this.listData.concat(res.data);
          if (res.data === this.listData.length) {
            this.loadAll = true;
          }
        }
      });
    }
  },
  watch: {
    params: {
      handler: function (newV, oldV) {
        if (!newV.queryItem) return;
        if (this.time_out) {
          clearTimeout(this.time_out);
        }
        this.time_out = setTimeout(() => {
          this.selected = undefined;
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
.wrap {
  height: 65%;
  padding-bottom: 10px;
}
.top-search {
  &.skipRem {
    height: 56px;
    padding: 0 5px;
  }
  display: flex;
  justify-content: space-between;
  align-items: center;
  .input-box {
    flex: 1;
  }
  .btn {
    margin: 5px;
  }
}
.list-content {
  height: 320px;
  overflow-x: hidden;
  overflow-y: auto;
}
.hint {
  margin: 15px 0;
}
/deep/.mu-input {
  margin-bottom: 0;
}
/deep/.mu-flat-button {
  min-width: 40px;
}
/deep/.mu-item-action {
  min-width: 35px;
}
/deep/.mu-item-title {
  display: flex;
  align-items: center;
  .left-icon {
    margin-right: 5px;
  }
  .right-icon {
    margin-left: 5px;
  }
}
</style>
