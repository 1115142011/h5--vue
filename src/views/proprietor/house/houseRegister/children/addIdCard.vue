<template>
  <section>
    <!-- 上传身份证 -->
    <mu-paper class="v_block outside-box" :z-depth="1" v-if="edit===7">
      <div class="title">身份证照片</div>
      <div class="line-item" v-for="(item,index) in picList" :key="index+'id'">
        <div class="person-name v_ellipsis">业主-{{item.name}}</div>
        <div class="idCard-group">
          <div class="pic-content">
            <div
              class="pic-content border"
              @click="chooseIdCard(index,'idCardFrontImg')"
              v-if="!item.idCardFrontImg"
            >
              <mu-icon value="ic_add" :size="24" class="icon"></mu-icon>
              <mu-icon value="face" :size="64" class="icon"></mu-icon>
              <div class="hint-msg">提交身份证人像面</div>
            </div>
            <img
              class="img"
              :src="item.idCardFrontImg"
              @click="chooseIdCard(index,'idCardFrontImg')"
              alt="证件照正面"
              v-if="item.idCardFrontImg"
            />
          </div>
          <div class="pic-content m-top">
            <div
              class="pic-content border"
              @click="chooseIdCard(index,'idCardBackImg')"
              v-if="!item.idCardBackImg"
            >
              <mu-icon value="ic_add" :size="24" class="icon"></mu-icon>
              <img :src="iconPic" class="icon-image skipRem" alt />
              <div class="hint-msg">提交身份证国徽面</div>
            </div>
            <img
              class="img"
              :src="item.idCardBackImg"
              @click="chooseIdCard(index,'idCardBackImg')"
              alt="证件照反面"
              v-if="item.idCardBackImg"
            />
          </div>
        </div>
      </div>
    </mu-paper>

    <!-- 上传房源附件 -->
    <mu-paper class="v_block outside-box" :z-depth="1" v-if="edit!=7">
      <div class="title">{{accessoryTitle}}</div>
      <div v-if="edit===9">
        <mu-select label="照片类型" v-model="subType" full-width>
          <mu-option v-for="(option,index) in options" :key="index+'o'" :label="option.name" :value="option.value"></mu-option>
        </mu-select>
      </div>
      <div class="pic_box">
        <div class="prive_image" v-for="(val,i) in picList" :key="'item'+i">
          <img @click="lookHand(i,picList)" class="img" :src="val.fileUrl" />
          <mu-button color="primary" class="delet_icon" icon small @click="deleteImage(val,i)">
            <mu-icon value="cancel" color="red"></mu-icon>
          </mu-button>
        </div>
        <div class="prive_image pic-content border" @click="choosePic">
          <div class="right-icon">
            <mu-icon value="ic_add" :size="24" class="icon"></mu-icon>
          </div>
          <mu-icon value="style" :size="50" class="icon"></mu-icon>
          <div class="hint-msg">提交房产证件照片</div>
        </div>
      </div>
    </mu-paper>
    <upLoadImg v-show="false" ref="uploadImg" @keepNewPic="keepNewPic"></upLoadImg>
  </section>
</template>
<script>
import upLoadImg from '@/components/upLoadImg';

export default {
  props: {
    edit: {
      type: Number,
      default: 0
    },
    picList: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  components: { upLoadImg },
  data () {
    return {
      viewBox: null,
      iconPic: require('@/assets/images/badge.svg'),
      subType: 3,
      remark: '商品房网签合同查询记录',
      idCardIndex: undefined,
      idCardKey: '',
      options: [
        {
          name: '房屋所有权证',
          value: 1
        },
        {
          name: '不动产权证',
          value: 2
        },
        {
          name: '商品房网签合同查询记录',
          value: 3
        }
      ]
    };
  },
  computed: {
    accessoryTitle () {
      switch (this.edit) {
        case 8:
          return '合同';
        case 9:
          return '房屋产权证件';
        case 10:
          return '委托证明';
        default:
          return '其它证件';
      }
    }
  },
  methods: {
    // 选择照片
    choosePic () {
      this.$refs.uploadImg.chooseFile();
    },
    chooseIdCard (index, key) {
      if (this.picList[index].identity) return;
      this.idCardIndex = index;
      this.idCardKey = key;
      this.$refs.uploadImg.chooseFile();
    },
    // 上传图片成功
    keepNewPic (item) {
      if (this.edit === 9) {
        item.subType = this.subType;
        item.remark = this.remark;
      }
      if (this.idCardIndex >= 0 && this.idCardKey) {
        this.$emit('updateIdCard', item, this.idCardIndex, this.idCardKey);
      } else {
        this.$emit('submitImage', item);
      }
    },
    // 图片预览
    lookHand (index, arr) {
      let list = [];
      arr.forEach(item => {
        list.push(item.fileUrl);
      });
      if (list.length === 0) return;
      this.viewBox = this.$Prive({
        imgList: list,
        current: index
      });
    },
    deleteImage (val, index) {
      this.$emit('delete', val, index);
    }
  },
  watch: {
    subType: function (newV, oldV) {
      this.options.forEach(item => {
        if (item.value === newV) {
          this.remark = item.name;
        }
      });
    }
  },
  beforeDestroy () {
    if (this.viewBox) this.viewBox.close();
  }
};
</script>
<style lang="less" scoped>
.outside-box {
  padding: 20px 28px;
  margin-bottom: 20px;
}
.title {
  font-weight: bold;
  color: #000000;
  font-size: 14px;
}
.person-name {
  margin: 5px 0;
}
.pic-content {
  width: 100%;
  height: 182px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #f6f6f6;
  color: #d1cfcf;
  position: relative;
  overflow: hidden;
  .img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.hint-msg {
  margin-top: 5px;
}
.m-top {
  margin-top: 10px;
}
.pic_box {
  display: flex;
  flex-wrap: wrap;
}
.prive_image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 135px;
  height: 175px;
  border-radius: 5px;
  position: relative;
  margin: 10px 8px 0 0;
  .delet_icon {
    top: -10px;
    right: -5px;
    width: 20px;
    height: 20px;
    position: absolute;
  }
  .img {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    vertical-align: middle;
  }
}
.right-icon {
  width: 100%;
}
.border {
  border: dashed 1px #d1cfcf;
}
.icon-image.skipRem {
  width: 60px;
}
</style>
