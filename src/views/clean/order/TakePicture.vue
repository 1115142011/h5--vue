<template>
  <div class="takePictureContainer">
    <div class="card">
      <b>日常：</b>
      {{item.houseName+'—'+item.areaName}}
    </div>
    <div class="card">
      <div class="title">请拍保洁{{start ? '前' : '后'}}的照片</div>
      <div class="picBox">
        <div v-for="(val,i) in pictureArr" :key="'item'+i" class="priveImage">
          <div class="content-box" v-if="srcArr[i]">
            <img class="previewImg" :src="srcArr[i]" @click="lookHand(srcArr[i])" />
            <mu-button color="primary" class="deleteIcon" icon small @click="deleteImage(i)">
              <mu-icon value="cancel" color="red"></mu-icon>
            </mu-button>
          </div>
          <upload-img v-show="!srcArr[i]" :camera="true" @keepNewPic="e => keepNewPic(e, i,val)"></upload-img>
          <p class="imgName">{{val}}</p>
        </div>
      </div>
    </div>
    <mu-paper class="controlPanel" :z-depth="10">
      <mu-button
        color="warning"
        style="float: right"
        textColor="#000"
        @click="finishTakingPicture"
        :disabled="!srcArrFilled"
      >提交</mu-button>
    </mu-paper>
  </div>
</template>

<script>
import UploadImg from '@/components/upLoadImg.vue';
export default {
  props: ['item', 'start'],
  data () {
    return {
      srcArr: [],
      objArr: [],
      viewBox: undefined, // 预览图片
      keyStandard: {
        '公共区域': ['门牌-1', '客厅-1', '厨房-1', '卫生间-1', '卫生间-2'],
        alone: ['门牌-1', '房间-1', '房间-2', '房间-3'],
        '整套房源': ['门牌-1', '客厅-1', '厨房-1', '卫生间-1', '卫生间-2']
      }
    };
  },
  components: {
    UploadImg
  },
  methods: {
    deleteImage (index) {
      this.$set(this.srcArr, index, '');
    },
    finishTakingPicture () {
      this.$emit('finishTakingPicture', this.objArr);
    },
    keepNewPic (e, i, key) {
      const src = e.visitPath + e.filePath;
      e.name = key;
      this.$set(this.srcArr, i, src);
      this.$set(this.objArr, i, e);
    },
    // 图片预览
    lookHand (url) {
      let list = [];
      let currentIndex = 0;
      this.srcArr.forEach(item => {
        if (item) {
          list.push(item);
          if (item === url) {
            currentIndex = list.length - 1;
          }
        }
      });
      this.viewBox = this.$Prive({
        imgList: list,
        current: currentIndex
      });
    },
    // 设置要求张片的数组长度
    setClaim (key, option) {
      if (!key) return option.alone;
      if (key.indexOf('套') !== -1) {
        return option['整套房源'].concat(this.getRoomKey(this.item.roomNum));
      } else if (key === '公共区域') {
        return option['公共区域'];
      } else {
        return option.alone;
      }
    },
    // 动态生成房间名称
    getRoomKey (number) {
      if (!number) return [];
      let suffix = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
      let keyArr = [];
      for (let i = 0; i < number; i++) {
        keyArr.push(`房间${suffix[i]}`, `房间${suffix[i]}`);
      }
      return keyArr;
    }
  },
  computed: {
    pictureArr () {
      return this.setClaim(this.item.areaName, this.keyStandard);
      // if (this.item.type === 1)
      // return ['门牌-1', '客厅-1', '客厅-2', '厨房-1', '厨房-2', '过道-1', '卫生间-1', '卫生间-2'];
      // return ['门牌-1'];
    },
    srcArrFilled () {
      return this.srcArr.filter(i => !!i).length === this.pictureArr.length;
    }
  },
  beforeDestroy () {
    if (this.viewBox) this.viewBox.close();
  }
};
</script>

<style lang="less" scoped>
.card {
  font-size: 14px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 2px 2px 0px rgba(16, 16, 16, 0.3);
  + .card {
    margin-top: 8px;
  }
}
.controlPanel {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 8px;
  z-index: 2;
  background: #fff;
}
.picBox {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.content-box {
  width: 75px;
  height: 75px;
  margin: 10px 6px 0 0;
  position: relative;
}
.priveImage {
  position: relative;
  display: inline-block;
  padding-left: 6px;
  max-width: 90px;
  .deleteIcon {
    position: absolute;
    top: -12px;
    right: -12px;
  }
  .previewImg {
    width: 75px;
    height: 75px;
    object-fit: cover;
    border-radius: 5px;
    vertical-align: middle;
  }
  .imgName {
    text-align: center;
    color: rgba(16, 16, 16, 0.6);
    font-size: 12px;
  }
}
</style>
