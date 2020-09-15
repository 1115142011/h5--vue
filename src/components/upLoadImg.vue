<template>
  <div class="outerBox">
    <div
      class="icon"
      @click="chooseFile"
      v-show="fileList.length<limit"
      v-loading="loading"
      data-mu-loading-overlay-color="transparent"
    >
      <mu-icon size="30" color="blue" value="add_a_photo" v-show="!loading"></mu-icon>
    </div>
   <div ref='inputBox'>
      <input
      @change="getFile($event)"
      type="file"
      accept="image/*"
      ref="upload_file"
      style="display: none"
      :multiple='multiple'
    />
   </div>
  </div>
</template>
<script>
import Exif from 'exif-js';
import { uploadFile } from '@/api/globalApi';
const imageConversion = require('image-conversion');
export default {
  props: {
    limit: {
      type: Number,
      default: 10
    },
    fileList: {
      // 记录已有的长度
      type: Array,
      default: function () {
        return [];
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    camera: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      headerImage: null,
      picValue: null,
      filenName: ''
    };
  },
  mounted () {
    if (this.camera) {
      this.$refs.upload_file.setAttribute('capture', 'camera');
    }
  },
  methods: {
    chooseFile () {
      this.$refs.upload_file.click();
    },
    getFile (e) {
      let files = e.target.files;
      if (!files.length) return;
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        this.filenName = file.name;
        this.compress(file);
      }

      this.loading = !this.loading;
    },
    // 处理图片
    compress (file) {
      let self = this;
      let rotate;
      // 去获取拍照时的信息，解决拍出来的照片旋转问题
      Exif.getData(file, function () {
        rotate = Exif.getTag(this, 'Orientation');
        imageConversion.compressAccurately(file, {
          size: 200, // The compressed image size is 100kb
          accuracy: 0.9, // the accuracy of image compression size,range 0.8-0.99,default 0.95;
          // this means if the picture size is set to 1000Kb and the
          // accuracy is 0.9, the image with the compression result
          // of 900Kb-1100Kb is considered acceptable;
          orientation: rotate,
          type: 'image/jpeg',
          width: 1440,
          scale: 0.5
        }).then(res => {
          self.headerImage = res;
          self.postImg();
        });
      });
    },
    // 这里写接口
    async postImg () {
      let file = this.headerImage;
      let formData = new window.FormData();
      formData.append('file', file, this.filenName);
      try {
        await uploadFile(formData).then(res => {
          this.$emit('keepNewPic', res.data);
          this.loading = false;
        });
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.outerBox {
  // width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  .icon {
    width: 75px;
    height: 75px;
    border: solid 2px rgb(33, 150, 243);
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 6px 0 0;
    position: relative;
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
    .delet_icon {
      top: -10px;
      right: -5px;
      width: 20px;
      height: 20px;
      position: absolute;
    }
  }
}
</style>
