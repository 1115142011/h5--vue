<template>
  <section class="v_page">
    <!-- 顶部导航条 -->
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000">
      <mu-button icon slot="left" @click="goBack">
        <mu-icon value="arrow_back"></mu-icon>
      </mu-button>楼盘项详情
    </mu-appbar>
    <!-- 主内容区 -->
    <!-- --notice -->
    <div class="v_mainContainer skipRem">
      <mu-paper :z-depth="1" class="v_block bottom_padding">
        <title-msg :msg="userMsg.teamName"></title-msg>
        <more-column-tabs :msgData="bordData" :column="'four'" :weight="true"></more-column-tabs>
      </mu-paper>
      <!-- 单独楼盘详情数据 -->
      <mu-paper :z-depth="1" class="v_block bottom_padding" v-for="(item,index) in listData" :key="index">
        <div class="titleBox">
          <div class="houseName">{{item.communityName}}</div>
          <!-- <div class="persons">
            责任销售：{{item.dutydSales.toString()}}
          </div> -->
        </div>
        <more-column-tabs :msgData="item.lis" :column="'four'"></more-column-tabs>
      </mu-paper>
      <!-- page 底部提示信息 -->
      <div class="v_footerHint">没有更多信息了~</div>
    </div>
  </section>
</template>
<script>
import MoreColumnTabs from './children/MoreColumnTabs';
import TitleMsg from './children/TitleMsg';
import { getSalesTeamHouse, getHouseSaleCommunity } from '@/api/salesApi';
export default {
  name: 'HouseDetails',
  components: { MoreColumnTabs, TitleMsg },
  data () {
    return {
      bordData: undefined,
      listData: []
    };
  },
  computed: {
    userMsg () {
      return this.$store.state.sales.userData;
    }
  },
  created () {
    this.getListData(this.userMsg.group_id);
    this.getHouseData(this.userMsg.group_id);
  },
  methods: {
    // 返回上一级
    goBack () {
      this.$store.commit('change_Action', 'pop');
      this.$router.go(-1);
    },
    // 看板--数据
    getListData (groupId) {
      getSalesTeamHouse(groupId).then(res => {
        this.bordData = this.setBordKey(res.data);
      });
    },
    // 获取团队的楼盘数据
    getHouseData (id) {
      let param = {
        teamId: id,
        pageSize: 500,
        pageNo: 1
      };
      getHouseSaleCommunity(param).then(res => {
        this.listData = this.changeListsTructure(res.data.items);
      });
    },
    // 遍历设置看板数据
    setBordKey (obj) {
      if (Object.keys(obj).length === 0) return [];
      let tempArr = [];
      for (let key in obj) {
        switch (key) {
          case 'communityNum':
            tempArr.push({
              title: '楼盘数',
              value: obj[key]
            });
            break;
          case 'houseNum':
            tempArr.push({
              title: '房源数',
              value: obj[key]
            });
            break;
          case 'roomNum':
            tempArr.push({
              title: '房间数',
              value: obj[key]
            });
            break;
          case 'usedRoomNum':
            tempArr.push({
              title: '在租数',
              value: obj[key]
            });
            break;
          case 'freeRoomNum':
            tempArr.push({
              title: '空置数',
              value: obj[key]
            });
            break;
          case 'notUseRoomNum':
            tempArr.push({
              title: '不可租数',
              value: obj[key]
            });
            break;
          case 'freeRatio':
            tempArr.push({
              title: '综合空置率',
              value: this.setMinNumber(obj[key]),
              sub: this.setSub(obj[key])
            });
            break;
          case 'rentFreeRatio':
            tempArr.push({
              title: '租金空置率',
              value: this.setMinNumber(obj[key]),
              sub: this.setSub(obj[key])
            });
            break;
            // 设置列表key
          default:
            break;
        }
      }
      return tempArr;
    },
    // 遍历设置列表数据key
    setListKey (obj) {
      if (Object.keys(obj).length === 0) return [];
      let tempArr = [];
      for (let key in obj) {
        switch (key) {
          case 'totalHouseNum':
            tempArr.push({
              title: '套数',
              value: obj[key]
            });
            break;
          case 'totalRoomNum':
            tempArr.push({
              title: '房间',
              value: obj[key]
            });
            break;
          case 'freeRoomNum':
            tempArr.push({
              title: '空置间数',
              value: obj[key]
            });
            break;
          case 'freeRatio':
            tempArr.push({
              title: '空置率',
              value: this.setMinNumber(obj[key]),
              sub: this.setSub(obj[key])
            });
            break;
          case 'reserveNum':
            tempArr.push({
              title: '预定中',
              value: obj[key]
            });
            break;
          case 'notUsedRoomNum':
            tempArr.push({
              title: '不可租',
              value: obj[key]
            });
            break;
          case 'toExpireHouseNum':
            tempArr.push({
              title: '房源快到期',
              value: obj[key]
            });
            break;
          case 'toExpireLeaseNum':
            tempArr.push({
              title: '租约快到期',
              value: obj[key]
            });
            break;
          default:
            break;
        }
      }
      return tempArr;
    },
    // 判断看板数据阈值
    setMinNumber (value) {
      return value <= 0 ? '--' : value.toFixed(1);
    },
    // 判断百分号是否显示
    setSub (value) {
      return value > 0;
    },
    // 改变 列表数据结构
    changeListsTructure (arr) {
      if (!arr || arr.length === 0) return [];
      return arr.map(item => {
        item.lis = this.setListKey(item);
        return item;
      });
    }
  }
};
</script>
<style lang="less" scoped>
.titleBox {
  width: 100%;
  padding: 5px 0;
  border-bottom: solid 1px #cccccc;
  .houseName {
    padding-left: 20px;
    font-size: 16px;
    color: #333333;
  }
  .persons {
    padding-left: 20px;
    width: 100%;
    color: #7c7c7c;
    font-size: 12px;
    transform: scale(0.84) translateX(-8%);
  }
}
.bottom_padding{
  padding-bottom: 20px;
}
</style>
