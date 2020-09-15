<template>
  <div>
    <Instruction @continue="$emit('startClean')" v-if="showAgreement" />
    <div v-else class="card" :style="`background-color: ${mainColor[item.type]}`">
      <div class="mainInfo">
        <div class="type">{{cleanTypeStats[item.type]}}</div>
        <div class="houseName">{{item.houseName+'—'+item.areaName}}</div>
        <div class="iconRight"></div>
      </div>
      <div class="details">
        <div class="cleanning" v-if="item.status === 2">
          <img :src="cleanningGif" />
          <div class="countTime">{{countTime(nowTime)}}</div>
          <div class="mainText">保洁开始，加油哦～</div>
          <div class="hint">保洁标准时长为{{item.cleanMinute}}分钟，{{standard? '已': '未'}}达标</div>
        </div>
        <div class="table">
          <!-- TODO: 判断是否为租客 -->
          <div class="line" v-if="item.status === 1">
            <b class="title">发起人</b>
            <span>{{item.name}}</span>
          </div>
          <div class="line" v-if="item.status !== 2">
            <b class="title">发起时间</b>
            <span>{{item.startTime}}</span>
          </div>
          <div class="line" v-if="item.status === 1">
            <b class="title">考核时间</b>
            <span>{{item.checkTime}}</span>
          </div>
          <div class="line" v-if="item.status === 1">
            <b class="title" v-html="difference.type ? '已经超时':'考核剩余'"></b>
            <span :class="{red:difference.type}">{{difference.text}}</span>
          </div>

          <div class="line" v-if="item.status !== 2">
            <b class="title">最低时长</b>
            <span>{{item.cleanMinute}}分钟</span>
          </div>
          <div class="line" v-if="item.status === 3">
            <b class="title">完工时间</b>
            <span class="red">{{item.endTime}}</span>
          </div>
          <div class="line" v-if="item.status !== 2">
            <b class="title">保洁状态</b>
            <span
              :style="`color: ${statusColor[item.status]}; font-weight: 600`"
            >{{statusArray[item.status]}}</span>
          </div>
          <div v-if="item.descs" class="descs">描述：{{item.descs}}</div>
          <!-- 工作内容 -->
          <div class="step_hint" v-if="jobContent.length>0&&item.status !=1">
            <div class="title">工作内容</div>
            <div>
              <div v-for="(str,limit) in jobContent" :key="limit+'i'">{{str}}</div>
            </div>
          </div>
        </div>
        <div v-if="item.status !== 1 && locationInfo.locationBref" class="infoContainer">
          <div class="title">定位</div>
          <div class="info">
            <div class="main">{{locationInfo.locationBref}}</div>
            <div class="sub">{{locationInfo.locationDetail}}</div>
          </div>
        </div>
        <div v-if="item.status === 3" class="infoContainer">
          <div class="title">用时</div>
          <div class="info">
            <div class="main">{{countTime(item.endTime)}}</div>
            <div class="sub">保洁标准时长为{{item.cleanMinute}}分钟，{{standard? '已': '未'}}达标</div>
          </div>
        </div>
        <!-- 照片显示 -->
        <div v-if="item.status === 3" class="img_container">
          <!-- 完成前照片 -->
          <div class="img_title">保洁前照片</div>
          <div class="picBox">
            <img
              v-for="(val,index) in item.beforePic"
              :key="'img'+index"
              class="previewImg"
              :src="val.visitPath"
              @click="lookHand('beforePic',index)"
            />
          </div>
          <div class="img_title">保洁后照片</div>
          <div class="picBox">
            <img
              v-for="(img,i) in item.afterPic"
              :key="'url'+i"
              class="previewImg"
              :src="img.visitPath"
              @click="lookHand('afterPic',i)"
            />
          </div>
        </div>
        <!-- 按钮 -->
        <div class="controlPanel">
          <mu-button
            v-if="item.status === 1"
            color="warning"
            class="button"
            textColor="#000"
            @click="showAgreement = true"
          >开始保洁</mu-button>
          <mu-button
            v-if="item.status === 2"
            color="warning"
            class="button"
            textColor="#000"
            @click="$emit('finishClean')"
            :disabled="!standard"
          >完成保洁</mu-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { formatTime3 } from '@/utils/date';
import cleanningGif from '@/assets/images/u492.gif';
import Instruction from './Instruction';
import Moment from 'moment';

export default {
  props: ['item', 'locationInfo'],
  components: { Instruction },
  data () {
    return {
      viewBox: undefined,
      showAgreement: false,
      initTime: +new Date(),
      nowTime: +new Date(),
      cleanningGif,
      statusArray: { 1: '未完成', 2: '待复工', 3: '已完成' },
      statusColor: { 1: '#A9A9A9', 2: '#A9A9A9', 3: '#65AD08' },
      cleanTypeStats: { 1: '日常', 2: '空房', 3: '退租', 4: '品质' },
      mainColor: { 1: '#7475FF', 2: '#FF6174', 3: '#AA78DE', 4: '#2196f3' }
    };
  },
  computed: {
    showBtn () {
      return Moment(this.nowTime).isAfter('2020-04-1 10:31:00');
    },
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
    standard () {
      const sec = this.nowTime - Moment(this.item.beginTime).format('x');
      return sec > this.item.cleanMinute * 60000;
    },
    jobContent () {
      const st = this.item.content;
      if (!st) return [];
      return st.split('||');
    }
  },
  mounted () {
    setInterval(() => {
      this.nowTime += 1000;
    }, 1000);
  },
  methods: {
    countTime (time) {
      time = Moment(time).format('x');
      const beginTime = Number(Moment(this.item.beginTime).format('x'));
      const pad2 = num => (num <= 9 ? '0' + num : num);
      const sec = ((time - (beginTime || this.initTime)) / 1000) >> 0;
      const min = (sec / 60) >> 0;
      const hour = (min / 60) >> 0;
      return `${pad2(hour)}:${pad2(min % 60)}:${pad2(sec % 60)}`;
    },
    // 图片预览
    lookHand (key, index) {
      let list = this.item[key].map(item => {
        return item.visitPath;
      });
      this.viewBox = this.$Prive({
        imgList: list,
        current: index
      });
    }
  },
  beforeDestroy () {
    if (this.viewBox) this.viewBox.close();
  }
};
</script>

<style lang="less" scoped>
.card {
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
    .cleanning {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #cfcfcf;
      img {
        width: 40%;
      }
      .countTime {
        font-size: 26px;
        font-weight: 600;
        color: #f65822;
      }
      .mainText {
        font-size: 20px;
        font-weight: 600;
        color: #7576ff;
      }
    }
    .table {
      font-size: 14px;
      margin: 0 16px;
      .line + .line {
        margin-top: 4px;
      }
      .line {
        display: flex;
        align-items: center;
        justify-content: space-between;
        &.preview img {
          width: 90px;
          height: 90px;
        }
        .red {
          color: #c3253e;
          font-weight: 600;
        }
      }
      .title {
        font-size: 14px;
        margin-right: 24px;
      }
    }
  }
  .infoContainer {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #cfcfcf;
    .info {
      text-align: right;
      color: #3b7fff;
      .main {
        font-size: 16px;
        line-height: 24px;
      }
      .sub {
        font-size: 12px;
        line-height: 16px;
        color: rgba(16, 16, 16, 0.5);
      }
    }
  }
  .title {
    font-weight: 600;
    font-size: 16px;
  }
  .descs {
    word-wrap: break-word;
    background: #fff;
    padding: 8px 0;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  .controlPanel {
    padding: 12px 0;
  }
}
.img_container {
  width: 100%;
  .img_title {
    font-weight: 600;
    margin-top: 10px;
  }
  .picBox {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .previewImg {
      width: 75px;
      height: 75px;
      border-radius: 5px;
      margin: 10px 6px 0 0;
    }
  }
}
.step_content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    font-weight: 600;
    flex: 4;
  }
  .right {
    flex: 6;
  }
}
</style>
