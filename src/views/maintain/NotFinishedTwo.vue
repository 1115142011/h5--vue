<template>
  <div class="maintain">
    <mu-appbar class="fixed" style="width: 100%;" color="#fdd835" z-depth="5" textColor="#000">
      <mu-button @click="back" icon slot="left">
        <mu-icon size="30" value="keyboard_backspace"></mu-icon>
      </mu-button>未完成(2/3)
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
            <div>￥{{item.cost}}</div>
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
            <mu-text-field v-model="validateForm.descs" color="#2196f3"></mu-text-field>
            <br />
          </mu-form-item>
          <mu-form-item class="eachRow" prop="costTime" label-float label="产生时间" :rules="timeRules">
            <mu-date-input
              container="bottomSheet"
              v-model="validateForm.costTime"
              label-float
              full-width
              no-display
            ></mu-date-input>
          </mu-form-item>
          <mu-form-item
            class="eachRow"
            prop="costType"
            label-float
            label="费用类型"
            :rules="costTypeRules"
          >
            <mu-select v-model="validateForm.costType" ull-width>
              <mu-option
                v-for="item in select"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></mu-option>
            </mu-select>
          </mu-form-item>
          <div class="imgContainer">
            <div v-for="(item,index) in file" :key="'p'+index" class="img_box">
              <img class="pic" @click="lookHand(index)" :src="item.privePath" />
              <img class="delet" @click="delImg(index)" :src="delet" />
            </div>
            <upLoadImg @keepNewPic="keepNewPic" :fileList="file"></upLoadImg>
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
      <mu-button v-if="nextStatus" class="ml20" color="#fdd835" @click="next" textColor="#000">下一步</mu-button>
      <mu-button v-else class="ml20" color="#666" textColor="#fff">下一步</mu-button>
    </div>
    <div @click="viewStatus = !viewStatus" v-if="viewStatus" class="layer"></div>
    <div v-if="viewStatus" class="imgContent">
      <mu-icon color="#fff" @click="changeImg('delet')" size="30" value="keyboard_arrow_left"></mu-icon>
      <img @click="viewStatus = !viewStatus" class="layerImg" :src="viewImgSrc" />
      <mu-icon color="#fff" @click="changeImg('add')" size="30" value="keyboard_arrow_right"></mu-icon>
    </div>
  </div>
</template>

<script>
import { addFeel, check } from '@/api/maintainApi';
import upLoadImg from '@/components/upLoadImg';
import delet from '@/assets/images/delet.svg';
export default {
  components: { upLoadImg },
  data () {
    return {
      viewBox: null,
      addStatus: false,
      feelList: [],
      nextStatus: true,
      viewStatus: false,
      viewImgSrc: '',
      delet,
      file: [],
      loading: false,
      costRules: [{ validate: val => !!val, message: '请填写金额' }],
      descsRules: [{ validate: val => !!val, message: '请填写费用描述' }],
      timeRules: [{ validate: val => !!val, message: '请选择时间' }],
      costTypeRules: [{ validate: val => !!val, message: '请选择费用类型' }],
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
    // 暂存图片
    keepNewPic (e) {
      e.privePath = e.visitPath + e.filePath;
      this.file.push(e);
    },
    // 图片预览
    lookHand (index) {
      let list = this.file.map(item => {
        return item.privePath;
      });
      if (list.length === 0) return;
      this.viewBox = this.$Prive({
        imgList: list,
        current: index
      });
    },
    changeImg (e) {
      //   let viewImgSrc = this.viewImgSrc
      let imgIndex = this.imgIndex;
      if (e === 'add' && this.imgFile.length - imgIndex > 1) {
        this.imgIndex = this.imgIndex + 1;
        this.viewImgSrc = this.imgFile[this.imgIndex].privePath;
      }
      if (e === 'delet' && imgIndex > 0) {
        this.imgIndex = this.imgIndex - 1;
        this.viewImgSrc = this.imgFile[this.imgIndex].privePath;
      }
    },
    viewImg (e) {
      this.viewStatus = !this.viewStatus;
      this.imgIndex = 0;
      this.imgFile = e.file;
      this.viewImgSrc = e.file[this.imgIndex].privePath;
    },
    changeStatus () {
      this.addStatus = !this.addStatus;
      this.nextStatus = !this.nextStatus;
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
              d = d < 10 ? '0' + d : d;
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
    // 删除费用
    deleteFeel (e) {
      this.feelList.splice(e, 1);
    },
    next () {
      let param = {
        orderId: localStorage.getItem('orderId'),
        costInfos: this.feelList
      };
      let page = this;
      // 添加费用
      addFeel(param).then(res => {
        if (res.code === 200) {
          let para = JSON.parse(localStorage.getItem('notFinishedInfo'));
          para.orderId = localStorage.getItem('orderId');
          // 验收
          check(para).then(data => {
            if (data.code === 200) {
              page.$router.push('/notFinishedThree');
            }
          });
        }
      });
    },
    // 删除图片
    delImg (index) {
      this.file.splice(index, 1);
    }
  },
  watch: {
    viewImgSrc: function (val, oldVal) {}
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
    // this.getFeel()
  },
  beforeDestroy () {
    if (this.viewBox) this.viewBox.close();
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
// 修改
.img_box {
  width: 75px;
  height: 75px;
  margin: 10px 10px 0 0;
  position: relative;
  .pic {
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }
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
  border: 2px solid rgb(33, 150, 243);
}

.bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 10px;
  justify-content: flex-end;
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
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  width: 100%;
}

.addBottom {
  display: flex;
  justify-content: flex-end;
  color: rgb(33, 150, 243);
  height: 46px;
  line-height: 46px;
  width: 100%;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
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
