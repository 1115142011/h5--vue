<template>
  <section
    class="wrap"
  >
      <mu-paper class="v_block" :z-depth="1" v-if="listData.length==0">
        <!-- 无数据 -->
        <div class="title v_ellipsis">{{roomMsg}}</div>
        <div class="noMsg">暂未打卡</div>
      </mu-paper>
      <!-- 有数据 -->
      <mu-paper class="v_block" :z-depth="1" v-for="(item,index) in listData" :key="index+'a'">
        <div class="title v_ellipsis">{{roomMsg}}</div>
        <div class="msg_item">
          <span class="left_msg">租客</span>
          <span class="right_msg" v-if="item.customerType===1">{{getstr(item.customerName)}}</span>
          <span class="right_msg" v-if="item.customerType===2">{{getstr(item.customerName)}} 同住人</span>
        </div>
        <div class="msg_item">
          <span class="left_msg">打卡时间</span>
          <span class="right_msg">{{item.createTime}}</span>
        </div>
        <div class="msg_item">
          <span class="left_msg">目前健康状况</span>
          <span class="right_msg">{{setStatus(item)}}</span>
        </div>
        <div class="msg_item" v-if="item.healthStatus==2&&item.feverDesc">
          <span class="left_msg">健康情况说明</span>
          <span class="right_msg v_ellipsis">{{item.feverDesc}}</span>
        </div>
        <div class="msg_item" v-if="item.healthStatus==2&&item.recordFile">
          <span class="left_msg">说明附件</span>
          <span class="lookPic" @click="lookHand(item.recordFile)">查看附件</span>
        </div>
        <div class="msg_item">
          <span class="left_msg">现居住地</span>
          <span class="right_msg">{{getArea(item)}}</span>
        </div>
        <div class="msg_item">
          <span class="left_msg">放假是否离开成都</span>
          <span class="right_msg">{{item.leaveFlag==0?'否':'是'}}</span>
        </div>
        <div class="msg_item" v-if="item.leaveFlag==1">
          <span class="left_msg">是否已返回成都</span>
          <span class="right_msg">{{item.returnFlag==0?'否':'是'}}</span>
        </div>
        <div class="msg_item" v-if="item.leaveFlag==1&&item.returnFlag==1">
          <span class="left_msg">返回地</span>
          <span class="right_msg">{{item.returnSource}}</span>
        </div>
        <div class="msg_item" v-if="item.leaveFlag==1&&item.returnFlag==1">
          <span class="left_msg">返蓉时间</span>
          <span class="right_msg">{{geyDay(item.returnTime)}}</span>
        </div>
        <div class="msg_item">
          <span class="left_msg">是否在湖北停留</span>
          <span class="right_msg">{{item.contactWuhanFlag==0?'否':'是'}}</span>
        </div>
        <div class="msg_item">
          <span class="left_msg">有无病例接触史</span>
          <span class="right_msg">{{item.contactPatientFlag==0?'无':'有'}}</span>
        </div>
        <div class="msg_item">
          <span class="left_msg">是否复工</span>
          <span class="right_msg">{{item.returnWorkFlag==0?'无':'有'}}</span>
        </div>

        <div class="msg_item" v-if="item.passCardFile">
          <span class="left_msg">通行证</span>
          <div class="right_msg">
            <span class="check-file link" @click="lookHand(item.passCardFile)">查看</span>
          </div>
        </div>
        <div class="msg_item" v-if="item.healthCardFile">
          <span class="left_msg">健康证</span>
          <div class="right_msg">
            <span class="check-file link" @click="lookHand(item.healthCardFile)">查看</span>
          </div>
        </div>
      </mu-paper>
  </section>
</template>
<script>
import Moment from 'moment';
export default {
  props: ['listData'],
  data () {
    return {
      loading: false, // 上传图片 loading
      filenName: '', // 上传文件名称
      headerImage: null, // 文件对象
      imgParam: {
        id: '',
        type: '',
        file: ''
      },
      viewBox: undefined,
      mobile: undefined
    };
  },
  computed: {
    roomMsg () {
      return this.$store.state.sales.roomMsgName;
    }
  },
  methods: {
    getstr (str) {
      return str[0] + '**';
    },
    // 判断健康状况
    setStatus (item) {
      switch (item.healthStatus) {
        case 1:
          return '健康';
        case 2:
          return '发烧/咳嗽';
        case 3:
          return item.healthDesc;
        default:
          return '--';
      }
    },
    // 判断居住点
    getArea (item) {
      switch (item.customerLocation) {
        case 1:
          return '当前租赁房屋';
        case 2:
          return item.customerLocationDesc;
        default:
          return '--';
      }
    },
    // 判断相差多少天
    geyDay (time) {
      let end = Moment(time);
      let start = Moment();
      let diffDays = Math.ceil(start.diff(end, 'days', true));
      if (diffDays <= 14) {
        return '未满14天';
      } else {
        return '已满14天';
      }
    },
    // 图片预览
    lookHand (arr) {
      let picList = arr.split(',');
      if (picList.length === 0) return;
      this.viewBox = this.$Prive({
        imgList: picList,
        current: 0
      });
    }
  },
  beforeDestroy () {
    if (this.viewBox) this.viewBox.close();
  }
};
</script>
<style lang="less" scoped>
.lookPic {
  color: #10aeff;
}
.v_block {
  padding-left: 20px;
  padding-bottom: 20px;
}
.title {
  font-size: 16px;
  font-weight: 600;
  padding: 15px 0;
  color: #000000;
  border-bottom: 1px solid #e1e1e1;
}
.msg_item {
  padding: 3px 15px;
  display: flex;
  align-items: center;
  .left_msg {
    flex: 1;
    font-size: 16px;
    color: #707070;
    font-weight: 700;
  }
  .right_msg {
    flex: 1;
    text-align: right;
  }
}
.noMsg {
  padding: 10px;
  text-align: center;
  font-size: 16px;
  color: #ff7600;
}
.item_btn {
  margin-top: 15px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  /deep/.mu-raised-button {
    min-width: 50px;
  }
  .btn {
    margin: 0 5px;
  }
}
.link {
  color: #ff7600;
  margin: 0 15px;
}
</style>
