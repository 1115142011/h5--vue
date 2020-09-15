<template>
  <div class="maintain">
    <mu-appbar class="fixed" style="width: 100%;" color="#fdd835" z-depth="5" textColor="#000">
      <mu-button @click="back" icon slot="left">
        <mu-icon size="30" value="keyboard_backspace"></mu-icon>
      </mu-button>
      拒修(2/3)
    </mu-appbar>
    <div class="space"></div>
    <div class="content" v-for="(item,index) in feelList" :key="index">
      <div class="eachTag">
        <div class="topTag">
          <div class="lfetText">
            <div v-if="item.costType==1" class="ft16">材料费用</div>
            <div v-if="item.costType==2" class="ft16">人工费用</div>
            <div class="ft14 c7474">{{item.costTime}}</div>
            <div class="ft12 c8e8e">描述：{{item.descs}}</div>
          </div>
          <div class="rightText">
            <div>
              ￥{{item.cost}}
            </div>
            <div @click="viewImg(item)">
              <mu-icon class="ml10" color="#999" value="image"></mu-icon>
            </div>
          </div>
        </div>
        <div class="btn">
          <mu-button slot="action" @click="deleteFeel(item)" flat color="primary">删除</mu-button>
        </div>
      </div>
    </div>
    <div class="addFeel">
      <div class="addTitle" @click="changeStatus">添加费用+</div>
      <div v-if="addStatus" class="addContent">
        <mu-form ref="form" :model="validateForm">
          <mu-form-item class="eachRow" prop="cost" label-float label="费用金额(元)" :rules="costRules">
            <mu-text-field type="number" v-model="validateForm.cost"></mu-text-field>
          </mu-form-item>
          <mu-form-item prop="descs" color="#2196f3" label-float label="描述" :rules="descsRules">
            <mu-text-field v-model="validateForm.descs" color="#2196f3"></mu-text-field><br/>
          </mu-form-item>
          <mu-form-item class="eachRow" prop="costTime" label-float label="产生时间" :rules="timeRules">
            <mu-date-input v-model="validateForm.costTime" container="bottomSheet" label-float full-width no-display></mu-date-input>
          </mu-form-item>
          <mu-form-item class="eachRow" prop="costType" label-float label="费用类型" :rules="costTypeRules">
            <mu-select v-model="validateForm.costType" ull-width>
              <mu-option v-for="item in select" :key="item.value" :label="item.label" :value="item.value"></mu-option>
            </mu-select>
          </mu-form-item>
          <div class="imgContainer">
            <div v-for="(item,index) in file" :key="item.thumbnailVisitPath" class="eachImg">
              <img class="img" :src="item.thumbnailVisitPath" />
              <img class="delet" @click="delImg(index)" :src="delet" />
            </div>
            <div data-mu-loading-color="blue" class="loading" color="#000" v-loading="loading" data-mu-loading-size="24"></div>
            <div class="addImg" @click="chooseType">
              <mu-icon size="30" color="blue" value="add_a_photo"></mu-icon>
              <input capture="camera" @change="fileChange($event)" type="file" id="upload_file" multiple style="display: none" />
            </div>
          </div>
        </mu-form>
      </div>
      <div v-if="addStatus" class="addBottom">
        <span @click="addFeel" class="mr20">添加</span>
        <span @click="changeStatus" class="mr20">取消</span>
      </div>
    </div>
    <div class="space"></div>
    <div class="bottom">
      <span class="blue" @click="back">上一步</span>
      <mu-button v-if="nextStatus" class="ml20" color="#fdd835" @click='next' textColor="#000">下一步</mu-button>
      <mu-button v-else class="ml20" color="#666" textColor="#fff">下一步</mu-button>
    </div>
    <div @click="viewStatus = !viewStatus" v-if="viewStatus" class="layer">
    </div>
    <div v-if="viewStatus" class="imgContent">
      <mu-icon color="#fff" @click="changeImg('delet')" size="30" value="keyboard_arrow_left"></mu-icon>
      <img @click="viewStatus = !viewStatus" class="layerImg" :src="viewImgSrc" />
      <mu-icon color="#fff" @click="changeImg('add')" size="30" value="keyboard_arrow_right"></mu-icon>
    </div>
  </div>
</template>

<script>
import { addFeel, uploadImg, duty } from '@/api/maintainApi';
import Exif from 'exif-js';
// import { formatTime3 } from '@/utils/date'
import delet from '@/assets/images/delet.svg';
// import Message from 'muse-ui-message';
export default {
  data () {
    return {
      onClick: false,
      addStatus: false,
      feelList: [],
      viewStatus: false,
      delet,
      file: [],
      viewImgSrc: '',
      nextStatus: true,
      loading: false,
      costRules: [
        { validate: val => !!val, message: '请填写金额' }
      ],
      descsRules: [
        { validate: val => !!val, message: '请填写费用描述' }
      ],
      timeRules: [
        { validate: val => !!val, message: '请选择时间' }
      ],
      costTypeRules: [
        { validate: val => !!val, message: '请选择费用类型' }
      ],
      validateForm: {
        cost: '',
        descs: '',
        costTime: '',
        costType: ''
      },
      select: [
        {
          value: '1',
          label: '材料费用'
        },
        {
          value: '2',
          label: '人工费用'
        }
      ]
    };
  },
  methods: {
    changeImg (e) {
      // let viewImgSrc = this.viewImgSrc
      let imgIndex = this.imgIndex;
      if (e === 'add' && ((this.imgFile.length - imgIndex) > 1)) {
        this.imgIndex = this.imgIndex + 1;
        this.viewImgSrc = this.imgFile[this.imgIndex].visitPath;
      }
      if (e === 'delet' && (imgIndex > 0)) {
        this.imgIndex = this.imgIndex - 1;
        this.viewImgSrc = this.imgFile[this.imgIndex].visitPath;
      }
    },
    viewImg (e) {
      this.viewStatus = !this.viewStatus;
      this.imgIndex = 0;
      this.imgFile = e.file;
      this.viewImgSrc = e.file[this.imgIndex].visitPath;
    },
    changeStatus () {
      this.addStatus = !this.addStatus;
      this.nextStatus = !this.nextStatus;
    },
    deleteFeel (e) {
      this.feelList.splice(e, 1);
    },
    back () {
      this.$router.go(-1);
    },
    // 添加费用
    addFeel () {
      let page = this;
      page.$refs.form.validate().then(result => {
        if (result) {
          if (page.file.length < 1) {
            this.$toast.error('请拍照');
          } else {
            let para = this.validateForm;
            para.file = page.file;
            let formatDate = function (date) {
              let y = date.getFullYear();
              let m = date.getMonth() + 1;
              m = m < 10 ? '0' + m : m;
              let d = date.getDate();
              d = d < 10 ? ('0' + d) : d;
              return y + '-' + m + '-' + d;
            };
            para.costTime = formatDate(para.costTime);
            page.feelList.push(para);
            page.addStatus = !page.addStatus;
            page.file = [];
            page.validateForm = {
              cost: '',
              descs: '',
              costTime: '',
              costType: ''
            };
            page.nextStatus = true;
          }
        }
      });
    },
    next () {
      if (this.onClick) return;
      this.onClick = true;
      let param = {
        orderId: localStorage.getItem('orderId'),
        costInfos: this.feelList
      };
      let page = this;
      // 添加费用
      addFeel(param).then(res => {
        if (res.code === 200) {
          let para = JSON.parse(localStorage.getItem('refuseInfo'));
          duty(para).then(data => {
            this.onClick = false;
            if (data.code === 200) {
              page.$router.push('/refuseThree');
            }
          })
            .catch(errMsg => {
              this.onClick = false;
            });
        }
      })
        .catch(errMsg => {
          this.onClick = false;
        });
    },

    chooseType () {
      document.getElementById('upload_file').click();
    },
    fileChange (e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.picValue = files[0];
      this.imgPreview(this.picValue);
      this.loading = !this.loading;
    },
    imgPreview (file) {
      let self = this;
      let Orientation;
      // 去获取拍照时的信息，解决拍出来的照片旋转问题
      Exif.getData(file, function () {
        Orientation = Exif.getTag(this, 'Orientation');
      });
      // 看支持不支持FileReader
      if (!file || !window.FileReader) return;

      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function () {
          let result = this.result;
          let img = new Image();
          img.src = result;
          // 判断图片是否大于100K,是就直接上传，反之压缩图片
          if (this.result.length <= (100 * 1024)) {
            self.headerImage = this.result;
            self.postImg();
          } else {
            img.onload = function () {
              let data = self.compress(img, Orientation);
              self.headerImage = data;
              self.postImg();
            };
          }
        };
      }
    },
    postImg () {
      // 这里写接口
      let img = this.headerImage;
      let that = this;
      // let imgUrl = img.split(',')[1]
      let para = {
        data: img.split(',')[0].split(';')[0].split('/')[1],
        base64: img.split(',')[1]
      };
      uploadImg(para).then(res => {
        this.loading = !this.loading;
        that.file.push(res.data);
      });
    },
    rotateImg (img, direction, canvas) {
      // 最小与最大旋转方向，图片旋转4次后回到原方向
      const minStep = 0;
      const maxStep = 3;
      if (img == null) return;
      // img的高度和宽度不能在img元素隐藏后获取，否则会出错
      let height = img.height;
      let width = img.width;
      let step = 2;
      if (step == null) {
        step = minStep;
      }
      if (direction === 'right') {
        step++;
        // 旋转到原位置，即超过最大值
        step > maxStep && (step = minStep);
      } else {
        step--;
        step < minStep && (step = maxStep);
      }
      // 旋转角度以弧度值为参数
      let degree = step * 90 * Math.PI / 180;
      let ctx = canvas.getContext('2d');
      switch (step) {
        case 0:
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
          break;
        case 1:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, 0, -height);
          break;
        case 2:
          canvas.width = width;
          canvas.height = height;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, -height);
          break;
        case 3:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, 0);
          break;
      }
    },
    compress (img, Orientation) {
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      // 瓦片canvas
      let tCanvas = document.createElement('canvas');
      let tctx = tCanvas.getContext('2d');
      // let initSize = img.src.length
      let width = img.width;
      let height = img.height;
      // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if ((ratio = width * height / 4000000) > 1) {
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
      //        铺底色
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // 如果图片像素大于100万则使用瓦片绘制
      let count;
      if ((count = width * height / 1000000) > 1) {
        count = ~~(Math.sqrt(count) + 1); // 计算要分成多少块瓦片
        //            计算每块瓦片的宽和高
        let nw = ~~(width / count);
        let nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      // 修复ios上传图片的时候 被旋转的问题
      if (Orientation !== '' && Orientation !== 1) {
        switch (Orientation) {
          case 6:// 需要顺时针（向左）90度旋转
            this.rotateImg(img, 'left', canvas);
            break;
          case 8:// 需要逆时针（向右）90度旋转
            this.rotateImg(img, 'right', canvas);
            break;
          case 3:// 需要180度旋转
            this.rotateImg(img, 'right', canvas);// 转两次
            this.rotateImg(img, 'right', canvas);
            break;
        }
      }
      // 进行最小压缩
      let ndata = canvas.toDataURL('image/jpeg', 0.1);
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
      return ndata;
    },
    // 删除图片
    delImg (index) {
      this.file.splice(index, 1);
    }
  },
  watch: {
    viewImgSrc: function (val, oldVal) {
    }
  },
  created () {
    let riqi = new Date();
    let years = riqi.getFullYear();
    let months = ('0' + (riqi.getMonth() + 1)).slice(-2);
    let days = ('0' + (riqi.getDate() + 1)).slice(-2);
    let shijian = years + '-' + months + '-' + days;
    shijian = Date.parse(shijian);
    shijian = new Date(shijian);
    this.date = shijian;
  }
};
</script>

<style lang='less' scoped>
.content {
  width: 95%;
  margin: 20px auto;
}

.mu-paper {
  border-radius: 10px !important;
  box-shadow: 0px 2px 2px 0px rgba(16, 16, 16, 0.3);
}

.addFeel {
  text-align: center;
}

.addContent {
  width: 80%;
  margin: 0 auto;
  margin-top: 10px;
}

.imgContainer {
  display: flex;
  padding: 10px 0;
  flex-wrap: wrap;
  align-items: center;
}

.eachImg {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eee;
  width: 31%;
  height: 70px;
  border-radius: 2px;
  position: relative;
  margin-right: 5px;
}

.img {
  width: 90%;
  height: 85%;
}

.addImg {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 15px;
  width: 50px;
  height: 50px;
  border-radius: 5px;
  border: 2px solid rgb(33, 150, 243)
}

.bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  display: flex;
  padding: 10px;
  justify-content: flex-end;
  align-items: center;
  box-shadow: 5px 5px 5px 5px rgba(16, 16, 16, 0.3);
}

.content {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 2px 2px 0px rgba(16, 16, 16, 0.3);
  margin-top: 20px;
}

.eachTag {
  justify-content: space-around;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.topTag {
  width: 100%;
  justify-content: space-between;
  display: flex;
  padding: 15px 30px;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.lfetText {
  display: flex;
  flex-direction: column;
}

.rightText {
  display: flex;
}

.btn {
  text-align: right;
  width: 100%;
}

.addFeel {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 95%;
  margin: 20px auto;
  background: #fff;
  border-radius: 10px !important;
  margin-bottom: 76px;
  box-shadow: 0px 2px 2px 0px rgba(16, 16, 16, 0.3);
}

.addTitle {
  height: 46px;
  line-height: 46px;
  color: rgb(33, 150, 243);
  border-bottom: 1px solid rgba(0, 0, 0, .12);
  width: 100%;
}

.addBottom {
  display: flex;
  justify-content: flex-end;
  color: rgb(33, 150, 243);
  height: 46px;
  line-height: 46px;
  width: 100%;
  border-top: 1px solid rgba(0, 0, 0, .12);
}

.layer {
  position: absolute;
  top: 0;
  z-index: 300;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0.6;
}

.imgContent {
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: fixed;
  top: 35%;
  z-index: 400;
  width: 100%;
}

.layerImg {
  width: 300px;
  height: 200px;
  z-index: 400;
}
</style>
