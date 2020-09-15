<template>
  <!-- 主内容区 -->
  <div class="wrap" v-loading="loading">
    <mu-paper class="v_block"  :z-depth="1">
      <div class="them-title">
        <span class="left-text">编辑照片</span>
        <mu-button flat small @click="goStep('next')" color="primary">稍后完善</mu-button>
      </div>
     <div v-if="listData.length>0">
        <div class="item" v-for="(item,index) in listData" :key="'item'+index">
        <div class="pic_title">{{item.roomName}}（>={{item.leastNumber}}）</div>
        <div class="pic_box">
          <div  v-for="(val,i) in item.items" :key="val.url" class="prive_image">
            <img @click="lookHand(i,item.items)" class="img" :src="val.url" />
            <mu-button
              color="primary"
              class="delet_icon"
              icon
              small
              @click="deleteImage(item,val,i)"
            >
              <mu-icon value="cancel" color="red"></mu-icon>
            </mu-button>
          </div>
          <upLoad-img
            :fileList="item.items"
            @keepNewPic="keepNewPic(item,arguments)"
            :multiple="true"
          ></upLoad-img>
        </div>
      </div>
     </div>
    </mu-paper>
    <mu-paper class="footer_bar skipRem" :z-depth="4">
      <div class="left-btn" v-if="edit<6">
        <mu-button color="#B3B3B3" full-width textColor="#ffffff" @click="goStep('prev')">上一步</mu-button>
      </div>
      <div class="right-btn">
        <mu-button
          color="#fdd835"
          full-width
          textColor="#333333"
          @click="goStep('next')"
          :disabled="!full"
        >下一步</mu-button>
      </div>
    </mu-paper>
  </div>
</template>
<script>
import upLoadImg from '@/components/upLoadImg';
import { getPicType, submitImageMsg, deletePic } from '@/api/proprietorApi';

export default {
  components: { upLoadImg },
  data () {
    return {
      listData: [],
      edit: undefined, // 是否为从编辑页进来
      roomId: '',
      loading: false,
      viewBox: undefined
    };
  },
  created () {
    this.edit = this.$route.query.edit || 0;
    let houseId = this.$store.state.proprietor.formParams.houseId;
    this.getRoomPicList(houseId);
  },
  computed: {
    full () {
      return this.listData.every(val => {
        return val.items.length >= val.leastNumber;
      });
    }
  },
  methods: {
    // 底部按钮点击
    goStep (direction, stepNumber = 1) {
      this.$store.commit('proprietor/changeRegisterStep', {
        direction,
        stepNumber
      });
    },

    // 查询房间图片列表
    getRoomPicList (roomid) {
      this.loading = true;
      getPicType(roomid).then(res => {
        this.loading = false;
        this.listData = res.data;
      })
        .catch(e => {
          this.loading = false;
        });
    },
    // 删除图片
    deleteImage (item, val, index) {
      let imageid = val.imageId;
      deletePic(imageid).then(res => {
        item.items.splice(index, 1);
      });
    },
    // 上传图片成功
    keepNewPic (item, param) {
      this.submitImage(item, param[0]);
    },
    // 提交添加的照片
    submitImage (item, param) {
      let ob = {
        houseId: item.houseId,
        roomCode: item.roomCode,
        type: item.roomCode,
        url: param.filePath
      };
      submitImageMsg(ob).then(res => {
        let obj = {
          url: res.data.imageUrl,
          imageId: res.data.imageId,
          houseId: item.houseId,
          roomCode: item.roomCode
        };
        item.items.push(obj);
      });
    },
    // 图片预览
    lookHand (index, arr) {
      let list = [];
      arr.forEach(item => {
        if (item.url) {
          list.push(item.url);
        }
      });
      if (list.length === 0) return;
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
.them-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px 0 0;
  .left-text {
    font-weight: bold;
    font-size: 14px;
  }
}
.wrap {
  margin-bottom: 20px;
}
.v_mainContainer {
  padding-bottom: 20px;
}
.v_block {
  padding-left: 10px;
  .item {
    padding-bottom: 20px;
    .pic_title {
      padding: 8px 0;
      margin-bottom: 10px;
      font-size: 14px;
      border-bottom: 1px solid #cccccc;
    }
    .pic_box {
      display: flex;
      flex-wrap: wrap;
    }
    .prive_image {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 75px;
      height: 75px;
      border-radius: 5px;
      background-size: cover;
      background-position: center;
      position: relative;
      margin: 10px 6px 0 0;
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
        object-fit: cover;
      }
    }
  }
}
</style>
