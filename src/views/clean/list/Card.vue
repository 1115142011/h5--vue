<template>
  <div class="card">
    <div class="mainInfo" :style="`background-color: ${mainColor[item.type]}`">
      <div class="type">{{cleanTypeStats[item.type]}}</div>
      <div class="houseName">{{item.houseName+'—'+item.areaName}}</div>
      <div class="iconRight"></div>
    </div>
    <div class="details">
      <div class="table">
        <!-- <div class="line">
          <b class="title" v-html="item.mobile ? '租客' : '发起人'"></b>
          <span>{{item.name}}</span>
        </div>
        <div class="line" v-show="item.mobile">
          <b class="title">联系电话</b>
          <span>{{item.mobile}}</span>
        </div>-->
        <div class="line">
          <b class="title">发起时间</b>
          <span>{{item.startTime}}</span>
        </div>
        <div class="line" v-show="item.status === 1">
          <b class="title">考核时间</b>
          <span>{{item.checkTime}}</span>
        </div>
        <div class="line" v-show="item.status === 1">
          <b class="title" v-html="difference.type ? '已经超时':'考核剩余'"></b>
          <span :class="{red:difference.type}">{{difference.text}}</span>
        </div>
        <div class="line" v-show="item.status === 3">
          <b class="title">完工时间</b>
          <span>{{item.endTime}}</span>
        </div>
        <div class="line">
          <b class="title">保洁状态</b>
          <span
            :style="`color: ${statusColor[item.status]}; font-weight: 600`"
          >{{statusArray[item.status]}}</span>
        </div>
      </div>
      <mu-button
        v-if="showBtn"
        :color="item.redoFlag ? '#F47317' : 'warning'"
        class="button"
        :textColor="item.redoFlag ? '#ffffff' : '#424242'"
        @click="startClean"
        v-html="buttonText"
      ></mu-button>
    </div>
    <div class="descs">描述：{{item.descs}}</div>
  </div>
</template>

<style lang="less" scoped>
.card {
  margin: 12px 8px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 2px 2px 0px rgba(16, 16, 16, 0.3);
  .mainInfo {
    position: relative;
    padding: 8px 16px 8px 8px;
    .type,
    .houseName,
    .iconRight {
      display: inline-block;
      color: #fff;
    }
    .type {
      border-radius: 99px;
      background: rgba(16, 16, 16, 0.3);
      opacity: 0.7;
      padding: 4px 12px;
    }
    .houseName {
      margin-left: 8px;
      font-size: 14px;
      opacity: 0.9;
    }
    .iconRight {
      position: absolute;
      top: 14px;
      right: 12px;
      border-right: 2px solid #fff;
      border-bottom: 2px solid #fff;
      height: 10px;
      width: 10px;
      opacity: 0.7;
      transform: rotate(-45deg);
    }
  }
  .details {
    position: relative;
    background: #fff;
    padding: 16px;
    .line + .line {
      margin-top: 4px;
    }
    .line {
      .red {
        color: #c3253e;
        font-weight: 600;
      }
    }
    .title {
      min-width: 120px;
      font-size: 14px;
      margin-right: 24px;
    }
    span {
      font-size: 12px;
    }
    .button {
      position: absolute;
      right: 12px;
      bottom: 12px;
    }
  }
  .descs {
    font-size: 12px;
    border-top: 1px solid #cfcfcf;
    background: #fff;
    padding: 8px 16px;
    word-wrap: break-word;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
}
</style>

<script>
import Moment from 'moment';

export default {
  props: ['item'],
  data () {
    return {
      statusArray: { 1: '未完成', 2: '待复工', 3: '已完成' },
      statusColor: { 1: '#A9A9A9', 2: '#A9A9A9', 3: '#65AD08' },
      cleanTypeStats: { 1: '日常', 2: '空房', 3: '退租', 4: '品质' },
      mainColor: { 1: '#7475FF', 2: '#FF6174', 3: '#AA78DE', 4: '#2196f3' }
    };
  },
  methods: {
    startClean () {
      this.$router.push('/order/' + this.item.orderId);
    }
  },
  computed: {
    difference () {
      let now = Moment();
      let end = Moment(this.item.checkTime, 'YYYY-MM-DD hh:mm:ss');
      let calcHour = end.diff(now, 'minute'); // 时间差
      let type = calcHour < 0; // 是否超时
      let minute = Math.abs(calcHour);
      let hour = parseInt(minute / 60); // 小时
      let h, d, m;
      h = parseInt(minute / 60) % 24;
      if (hour > 0) {
        d = parseInt(hour / 24);
      } else {
        d = 0;
      }

      m = minute % 60;
      return {
        text: `${d ? d + '天' : ''}${h || 0}小时${m}分钟`,
        type
      };
    },
    showBtn () {
      return Moment().isAfter(this.item.startTime);
    },
    buttonText () {
      return this.item.redoFlag && this.item.status !== 3
        ? '开始复工'
        : this.item.status === 3
          ? '查看详情'
          : this.item.status === 2
            ? '继续工作'
            : '开始保洁';
    }
  }
};
</script>
