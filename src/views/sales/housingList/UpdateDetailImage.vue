<template>
  <section class="v_page" v-loading="loading">
    <!-- 顶部导航条 -->
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000">
      <mu-button icon slot="left" @click="goBack">
        <mu-icon value="arrow_back"></mu-icon>
      </mu-button>更新照片
    </mu-appbar>
    <!-- 主内容区 -->
    <div class="v_mainContainer skipRem" v-if="listData.length>0">
      <mu-paper class="v_block" :z-depth="1">
        <div class="item" v-for="(item,index) in listData" :key="'item'+index">
          <div class="pic_title">{{item.roomName}}（大于{{item.leastNumber}}张小于10张）</div>
          <div class="pic_box">
            <!-- <div v-for="(val,i) in item.items" :key="'item'+i" class="prive_image" :style="{ backgroundImage:`url(${val.url})`}"> -->
            <div v-for="(val,i) in item.items" :key="'item'+i" class="prive_image">
              <img @click="lookHand(i,item.items)" class="img" v-lazy="val.url" />
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
            <upLoad-img :fileList="item.items" @keepNewPic="keepNewPic(item,arguments)" :multiple="true"></upLoad-img>
          </div>
        </div>
      </mu-paper>
    </div>
  </section>
</template>
<script>
import upLoadImg from '@/components/upLoadImg';
import {
  queryRoomImage,
  HouseAddImage,
  HouseDeleteImage
} from '@/api/salesApi';
export default {
  components: { upLoadImg },
  data () {
    return {
      listData: [],
      roomId: '',
      loading: false,
      viewBox: undefined
    };
  },
  created () {
    this.roomId = this.$route.query.roomid;
    this.getRoomPicList(this.roomId);
  },
  methods: {
    // 回到详情页
    goBack () {
      this.$store.commit('change_Action', 'pop');
      this.$router.go(-1);
    },
    // 查询房间图片列表
    getRoomPicList (roomid) {
      this.loading = true;
      queryRoomImage(roomid).then(res => {
        this.loading = false;
        this.listData = res.data;
      });
    },
    // 删除图片
    deleteImage (item, val, index) {
      let imageid = val.imageId;
      HouseDeleteImage(imageid).then(res => {
        item.items.splice(index, 1);
      });
    },
    // 上传图片成功
    keepNewPic (item, param) {
      this.submitImage(item, param[0]);
    },
    // 提交添加的照片
    submitImage (item, param) {
      let obj = {
        houseId: item.houseId,
        roomCode: item.roomCode,
        url: param.filePath
      };
      HouseAddImage(obj)
        .then(res => {
          let obj = {
            url: param.visitPath + param.filePath,
            imageId: res.data.imageId
          };
          item.items.push(obj);
        });
    },
    // 图片预览
    lookHand (index, arr) {
      let list = [];
      arr.forEach((item) => {
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
      }
    }
  }
}
</style>
