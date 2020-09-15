<template>
  <section class="v_page">
    <!-- 顶部导航条 -->
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000">
      <mu-button icon slot="left" @click="goBack">
        <mu-icon value="close"></mu-icon>
      </mu-button>编辑房源
    </mu-appbar>
    <!-- 主内容区 -->
    <div
      class="v_mainContainer skipRem"
      ref="container"
      v-loading="loading"
      data-mu-loading-overlay-color="transparent"
      data-mu-loading-color="#FDD835"
    >
      <mu-paper class="v_block n-padding" :z-depth="1">
        <house-title :text="houseName"></house-title>
      </mu-paper>
      <div>
        <div class="edit-content">
          <mu-paper
            class="edit-item"
            :class="{succeed:item.state==1}"
            :z-depth="1"
            v-for="(item,index) in listData"
            :key="index+'p'"
            @click="goEditPage(item)"
          >
            <span class="text v_ellipsis">{{item.name}}</span>
            <span class="status">{{item.state==1?'已完善':'待完善'}}</span>
          </mu-paper>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import houseTitle from '../components/houseTitle';
import { queryInputState } from '@/api/proprietorApi';
export default {
  components: { houseTitle },
  data () {
    return {
      houseId: '',
      listData: [],
      loading: false
    };
  },
  computed: {
    houseName () {
      return this.$store.state.proprietor.editHouseName;
    }
  },
  created () {
    this.houseId = this.$route.query.houseId;
    this.queryMsgIsFull(this.houseId);
  },
  methods: {
    // 返回上一级
    goBack () {
      this.$router.push({
        path: '/proprietor/houseDetails',
        query: {
          houseId: this.houseId
        }
      });
    },
    // 查询信息完成度
    queryMsgIsFull (houseId) {
      this.loading = true;
      queryInputState(houseId).then(res => {
        this.loading = false;
        this.listData = res.data;
      });
    },
    // 跳转编辑项
    goEditPage (item) {
      switch (item.code) {
        case 5:
          this.$store.commit('proprietor/setRegisterStep', 6);
          this.$store.commit('proprietor/writeFormParam', {
            houseId: this.houseId
          });
          this.$router.push({
            path: '/proprietor/houseRegister',
            query: {
              edit: item.code
            }
          });
          break;
        case 6:
          this.$store.commit('proprietor/setRegisterStep', 7);
          this.$store.commit('proprietor/writeFormParam', {
            houseId: this.houseId
          });
          this.$router.push({
            path: '/proprietor/houseRegister',
            query: {
              edit: item.code
            }
          });
          break;
        case 7:
        case 8:
        case 9:
        case 10:
          this.$router.push({
            path: '/proprietor/updateHouseFile',
            query: {
              edit: item.code,
              houseId: this.houseId
            }
          });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.v_mainContainer{
 position: relative;
}
.n-padding {
  padding-bottom: 0;
}
.edit-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  width: 95px;
  height: 90px;
  margin: 8px;
  padding: 5px;
  .text {
    width: 100%;
    font-weight: bold;
    text-align: center;
    font-size: 14px;
  }
  .status {
    margin-top: 5px;
    color: #ff9b39;
  }
}
.succeed {
  background: #8dc952;
  color: #ffffff;
  .status {
    color: #ffffff;
  }
}
.edit-content {
  display: flex;
  padding-top: 10px;
  flex-wrap: wrap;
}
</style>
