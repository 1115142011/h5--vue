<template>
  <section class="WorkGroupBox">
    <!-- 标题导航链接 -->
    <div @click="nextPage">
      <mu-ripple   class="title" color="#cccccc" :opacity="0.7">
        <span class="titleText">{{title}}</span>
        <span class="icon">
          <mu-icon value="keyboard_arrow_right" color="#AAAAAA" :size="28" right></mu-icon>
        </span>
      </mu-ripple>
    </div>
    <!-- 表格标题 -->
    <div class="tabBox">
      <div class="tabItem tabHeader" :class="{long:state===1}">
        <span
          class="name"
          :class="{target:index===1,finsh:index===2,percent:index===3}"
          v-for="(val,index) in myTitle"
          :key="index"
        >{{val}}</span>
      </div>
      <!-- 表格内容 -->
      <div class="tabItem" :class="{long:state===1}" v-for="(item,index) in myData" :key="index">
        <!-- 名称 -->
        <span class="name">{{item.name}}</span>
        <!-- 目标 -->
        <span class="target">{{item.target}}</span>
        <!-- 已完成 -->
        <span class="finsh">{{item.finsh}}</span>
        <!-- 完成率 -->
        <span class="percent">{{item.state}}</span>
      </div>
      <div class="no_data" v-if="!myData||myData.length===0">暂无数据~</div>
    </div>
  </section>
</template>
<script>
export default {
  name: 'WorkGroup',
  props: {
    listData: Array,
    title: String,
    state: {
      // 决定跳转链接 0-跳转团队组员详情，1---跳转团队楼盘详情
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      personTitle: ['组员', '当月目标', '已完成', '完成率'],
      houseTitle: ['楼盘', '总间数', '在租', '空置']
    };
  },
  computed: {
    myData () {
      return this.setData(this.listData);
    },
    myTitle () {
      let tempArr = this.state === 0 ? this.personTitle : this.houseTitle;
      return tempArr;
    }
  },
  methods: {
    nextPage () {
      this.$store.commit('change_Action', 'push');
      if (this.state) {
        this.$router.push('/sales/home/HouseDetails');
      } else {
        // this.$router.push('/sales/home/WorkDetails');

      }
    },
    setData (arr) {
      if (!arr || arr.length === 0) return [];
      let tempArr = [];
      arr.forEach(item => {
        for (let key in item) {
          switch (key) {
            // 团队业绩排名
            case 'sale_goal_num':
              tempArr.push({
                name: item.person_name,
                target: item.sale_goal_num,
                finsh: item.sale_num,
                state: this.countNum(item.sale_num, item.sale_goal_num)
              });
              break;
            case 'communityId':
              tempArr.push({
                name: item.communityName,
                target: item.totalRoomNum,
                finsh: item.serviceRoomNum,
                state: item.freeRoomNum
              });
              break;
            default:
              break;
          }
        }
      });
      return tempArr;
    },
    // 计算百分比
    countNum (current, plan) {
      let suffix;
      if (plan === 0 && current > plan) {
        suffix = 100;
      } else if (plan === 0 && current === 0) {
        suffix = 0;
      } else {
        suffix = (current / plan * 100).toFixed(1);
      }
      return suffix + '%';
    }
  }
};
</script>
<style lang="less" scoped>
.WorkGroupBox {
  width: 100%;
  padding-bottom: 10px;
  .title {
    width: 100%;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    position: relative;
    span {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
  .tabBox {
    padding: 5px 25px 5px 20px;
    border-top: solid 1px rgb(204, 204, 204);
    .tabItem {
      width: 100%;
      display: flex;
      font-size: 12px;
      color: #000000;
      margin-top: 5px;
      .name {
        flex: 4;
        text-align: left;
      }
      .target,
      .finsh,
      .percent {
        flex: 3;
        text-align: right;
      }
      &.tabHeader {
        color: #858585;
      }
      &.long {
        .name {
          flex: 4;
        }
        .target,
        .finsh,
        .percent {
          flex: 2;
        }
      }
    }
  }
  .no_data {
    width: 100%;
    padding-top: 40px;
    text-align: center;
    color: #797979;
    font-size: 14px;
  }
}
</style>
