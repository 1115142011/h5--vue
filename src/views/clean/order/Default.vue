<template>
  <div class="order">
    <mu-appbar
      style="width: 100%"
      class="appbar fixed"
      :class="(progress === 3 || progress === 5) ? '_center' : ''"
      color="#fdd835"
      textColor="#000"
    >
      <mu-button v-if="(progress !== 3 && progress !== 5)" icon slot="left" @click="clickBack">
        <mu-icon
          v-if="progress === 0&&!(this.progress===0 &&this.item.status === 2)"
          size="30"
          value="keyboard_backspace"
        ></mu-icon>
        <mu-icon
          v-if="progress === 0&&(this.progress===0 &&this.item.status === 2)"
          size="30"
          value="apps"
        ></mu-icon>
        <mu-icon v-if="progress !== 0" size="30" value="clear"></mu-icon>
      </mu-button>
      {{title}}
    </mu-appbar>
    <div class="mainContent skipRem" :class="{noFooter:progress === 0}">
      <Card
        ref="cardComponent"
        v-if="progress === 0 || progress === 3"
        @startClean="startClean"
        :item="item"
        :locationInfo="{locationDetail, locationBref}"
        @finishClean="finishClean"
      />
      <TakePicture
        v-if="progress === 1"
        :item="item"
        @finishTakingPicture="finishTakingBeforePicture"
        :start="true"
      />
      <Location v-if="progress === 2" :item="item" @finishLocate="finishLocate" />
      <TakePicture
        v-show="progress === 4"
        :item="item"
        @finishTakingPicture="finishTakingPicture"
        :start="false"
      />
      <Finished v-if="progress === 5" :item="item" @finish="returnIndex" />
    </div>
  </div>
</template>
<script>
import { orderDetail, startHandle, endHandle } from '@/api/cleanApi';
import Card from './Card';
import Location from './Location';
import TakePicture from './TakePicture';
import Finished from './Finished';
export default {
  data () {
    return {
      refreshing: false,
      loading: true,
      progress: -1,
      item: {
        'orderId': 4,
        'redoFlag': 0,
        'houseId': 18840,
        'houseName': '仁美大源印象（公）2-1-2408',
        'roomName': null,
        'type': 2,
        'typeName': '空房保洁',
        'name': '杨',
        'mobile': '13980585548',
        'reservationTime': '2019-11-15',
        'startTime': 1573802887000,
        'residueTime': null,
        'cleanMinute': 25,
        'descs': null,
        'status': 1,
        'evaluation': 0,
        'beginTime': null,
        'endTime': null,
        'evaluationPoint': 0,
        'handleStatus': 0,
        'returnStatus': 0,
        'complainStatus': 0,
        'settlementStatus': 0,
        'dismiss': null,
        'applyFile': [
          {
            'name': '1566286587125_1407',
            'visitPath': 'http://47.98.211.218:8080/admin/data//store/upload/2019-08-20/1566286587125_1407.png',
            'thumbnailVisitPath': 'http://47.98.211.218:8080/admin/data/store/upload/2019-08-20/1566286587125_1407_thumbnail.jpg'
          }
        ],
        'lobbyFile': [],
        'kitchenFile': [],
        'passageFile': [],
        'toiletFile': [],
        'roomFile': [],
        'evaluationInfos': []
      },
      locationDetail: '',
      locationBref: '',
      beforePic: {
        roomFiles: [],
        lobbyFiles: [],
        kitchenFiles: [],
        passageFiles: [],
        toiletFiles: [],
        doorFiles: []
      },
      afterPic: {
        roomFiles: [],
        lobbyFiles: [],
        kitchenFiles: [],
        passageFiles: [],
        toiletFiles: [],
        doorFiles: []
      }
    };
  },
  components: {
    Card,
    Location,
    TakePicture,
    Finished
  },
  mounted () {
    this.getOrder();
  },
  methods: {
    getOrder () {
      this.loading = true;
      orderDetail({ id: this.$route.params.orderId }).then(({ code, data }) => {
        if (code !== 200) return;
        this.item = data;
        if (this.item.status === 3) {
          this.item.afterPic = this.setAfterPic(data);
          this.item.beforePic = this.setbeforePic(data);
        }
        this.loading = false;
        this.refreshing = false;
        this.progress = 0;
      });
    },
    finishTakingBeforePicture (picObj) {
      this.setClaim('beforePic', picObj);
      this.item.status = 2;
      this.progress = 2;
    },
    finishTakingPicture (picObj) {
      this.setClaim('afterPic', picObj);
      endHandle({ orderId: this.item.orderId,
        ...this.afterPic
      }).then(({ code, msg }) => {
        if (this.progress === 1) {
          this.progress = 2;
        } else {
          this.progress = 5;
        }
      });
    },
    startClean () {
      this.progress = 1;
    },
    finishClean () {
      this.progress = 4;
    },
    finishLocate ({ locationBref, locationDetail }) {
      startHandle({
        orderId: this.item.orderId,
        address: locationBref + locationDetail,
        ...this.beforePic
      }).then(({ code, msg }) => {
        this.locationBref = locationBref;
        this.locationDetail = locationDetail;
        this.$router.push('/sales/transfer');
        // this.item.status = 2;
        // this.progress = 0;
        // this.$refs.cardComponent.showAgreement = false;
      });
    },
    returnIndex () {
      this.$store.commit('change_Action', 'pop');
      if (this.progress === 5 || (this.progress === 0 && this.item.status === 2)) {
        this.$router.push('/index');
      } else {
        this.$router.back();
      }
    },
    clickBack () {
      if (this.progress === 4) this.progress = 0;
      else this.returnIndex();
    },
    // 保存图片
    setClaim (phase, picObj) {
      this[phase].doorFiles = this[phase].doorFiles.concat(this.setArrValue(picObj, 0)); // 门牌1张
      if (this.item.areaName === '公共区域' || this.item.areaName.indexOf('套') !== -1) {
        this[phase].lobbyFiles = this[phase].lobbyFiles.concat(this.setArrValue(picObj, 1)); // 客厅 1张
        this[phase].kitchenFiles = this[phase].kitchenFiles.concat(this.setArrValue(picObj, 2));// 厨房1张
        // this[phase].passageFiles = this[phase].passageFiles.concat(this.setArrValue(picObj, 3, 4)); // 过道
        this[phase].toiletFiles = this[phase].toiletFiles.concat(this.setArrValue(picObj, 3, 4));// 卫生间2张
        if (picObj.length > 5) this[phase].roomFiles = this[phase].roomFiles.concat(this.setArrValue(picObj, 5, picObj.length - 1));
      } else {
        this[phase].roomFiles = this[phase].roomFiles.concat(this.setArrValue(picObj, 1, picObj.length - 1));
      }
    },
    // 给数组添加值
    setArrValue (source, min, max = min) {
      if (typeof (min) !== 'number' || !Array.isArray(source)) return [];
      let tempArr = [];
      if (max < min) max = min;
      for (let i = min; i <= max; i++) {
        tempArr.push(source[i]);
      }
      return tempArr;
    },
    // 已完成设置保洁后的照片
    setAfterPic (data) {
      let list = [];
      if (data.status === 3) {
        let { doorFile, roomFile, lobbyFile, kitchenFile, passageFile, toiletFile } = data;
        list.push(...doorFile, ...roomFile, ...lobbyFile, ...kitchenFile, ...passageFile, ...toiletFile);
      }
      return list;
    },
    // 设置已完成状态，保洁前图片
    setbeforePic (data) {
      let list = [];
      if (data.status === 3) {
        let { doorFileBefore, lobbyFileBefore, kitchenFileBefore, passageFileBefore, toiletFileBefore, roomFileBefore } = data;
        list.push(...doorFileBefore, ...roomFileBefore, ...lobbyFileBefore, ...kitchenFileBefore, ...passageFileBefore, ...toiletFileBefore);
      }
      return list;
    }
  },
  computed: {
    title () {
      return [
        '工单详情',
        '开始保洁（1/3）',
        '开始保洁（2/3）',
        '保洁开始',
        '完成保洁（1/2）',
        '已完成'
      ][this.progress];
    }
  }
};
</script>
<style lang="less" scoped>
.mainContent {
  height: 100vh;
  padding: 8px;
  &.skipRem {
    padding-top: 72px;
    padding-bottom: 68px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  &.noFooter{
       padding-bottom: 10px;
  }
}
._center {
  text-align: center;
}
</style>
