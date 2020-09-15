<template>
  <div class="repair-box">
    <mu-paper class="v_block item-box" :z-depth="1" v-for="(item,index) in listData" :key="index+'i'">
      <div class="order-title v_ellipsis">{{item.houseName}}</div>
      <div class="order-content">
        <div class="left-tag center" v-html="disposeTypeName(item.typeName)" :style="{background:setBg(item.type)}">
          日常
          <br />维修
        </div>
        <div class="middle-msg">
          <div class="order-name">{{item.roomName}}-{{item.bigName}}-{{item.smallName}}</div>
          <div class="start-time">报修时间：{{item.startTime?Moment(item.startTime).format('YYYY-MM-DD'):'--'}}</div>
        </div>
        <div class="right-icon">
          <mu-button icon color="#ADADAD" @click="toDetails(item.orderId,item)">
            <mu-icon :size="36" value="chevron_right"></mu-icon>
          </mu-button>
        </div>
      </div>
      <div class="order-desc">
        {{item.descs}}
      </div>
    </mu-paper>
  </div>
</template>
<script>
import Moment from 'moment';

export default {
  props: {
    listData: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  data () {
    return {};
  },
  methods: {
    Moment,
    // 设置工单类型名称
    disposeTypeName (str) {
      if (typeof str === 'string') {
        if (str.length >= 4) {
          return `${str.substring(0, 2)}<br /> ${str.substring(2, 5)}`;
        } else {
          return str;
        }
      } else {
        return '维修<br />名称';
      }
    },
    // 设置背景颜色
    setBg (status) {
      switch (status) {
        case 1: // 1 日常维修
          return '#8080FF';
        case 2: // 2 工程维修
          return '#EC808D';
        case 3: // 3 外协维修
          return '#81D3F8';
        case 4: // 4 更换配件
          return '#00BFBF';
        default:
          return '#cccccc';
      }
    },
    // 跳转详情
    toDetails (orderId, param) {
      this.$store.commit('maintain/setEditReiectCost', param);
      this.$router.push({
        path: '/rejectCost/rejectDetail',
        query: {
          orderId
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.order-title {
  width: 100%;
  padding: 8px 14px;
  font-size: 16px;
  font-weight: bold;
  background: #4F4F4F;
  color: #ffffff;
}
.order-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 5px;
}
.left-tag {
  width: 50px;
  height: 50px;
  color: #ffffff;
  border-radius: 25px;
  background: #cccccc;
  margin:10px 10px 5px;
}
.middle-msg {
  flex: 1;
  margin-top: 5px;
  min-height: 50px;
  .order-name {
    font-size: 16px;
  }
  .start-time {
    margin-top: 5px;
    font-size: 12px;
    color: #7b7b7b;
  }
}
.order-desc {
  text-indent: 1.5em;
  border-top: solid 1px #cccccc;
  padding: 10px 10px 5px;
}
</style>
