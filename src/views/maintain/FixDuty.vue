<template>
  <div class="maintain">
    <mu-appbar class="fixed" style="width: 100%;" color="#fdd835" z-depth="5" textColor="#000">
      <mu-button @click="back" icon slot="left">
        <mu-icon size="30" value="keyboard_backspace"></mu-icon>
      </mu-button>
      定责
    </mu-appbar>
    <div class="space"></div>
    <div class="container">
      <mu-form ref="form" :model="validateForm">
        <mu-stepper :active-step="vactiveStep" orientation="vertical">
          <mu-step>
            <mu-step-label class="bold">
              请拍几张现场的照片
            </mu-step-label>
            <mu-step-content>
              <div class="imgContainer">
                <div v-for="(item,index) in file" :key="'p'+index" class="img_box">
                  <img class="pic" @click="lookHand(index)" :src="item.privePath" />
                  <img class="delet" @click="delImg(index)" :src="delet" />
                </div>
                <upLoadImg  @keepNewPic="keepNewPic" :fileList='file'></upLoadImg>
              </div>
              <mu-button @click="vhandleNext" textColor="#000" class="topSpace" color="#fdd835">下一步</mu-button>
            </mu-step-content>
          </mu-step>
          <mu-step>
            <mu-step-label class="bold">
              谁的责任?
            </mu-step-label>
            <mu-step-content>
              <div class="column">
                <mu-radio class="eachRadio ft10" v-model="validateForm.dutyType" value="1" label="公司责任"></mu-radio>
                <mu-radio class="eachRadio" v-model="validateForm.dutyType" value="2" label="租客责任"></mu-radio>
              </div>
              <mu-button @click="vhandleNext" textColor="#000" color="#fdd835">下一步</mu-button>
              <mu-button color="rgb(33, 150, 243)" flat class="demo-step-button" @click="vhandlePrev">上一步</mu-button>
            </mu-step-content>
          </mu-step>
          <mu-step>
            <mu-step-label class="bold">
              租客是否同意修理
            </mu-step-label>
            <mu-step-content>
              <div class="column">
                <mu-radio class="eachRadio ft10" v-model="validateForm.dutyStatus" value="1" label="同意修理"></mu-radio>
                <mu-radio class="eachRadio" v-model="validateForm.dutyStatus" value="2" label="拒绝修理"></mu-radio>
              </div>
              <mu-button @click="vhandleNext" textColor="#000" color="#fdd835">下一步</mu-button>
              <mu-button color="rgb(33, 150, 243)" flat class="demo-step-button" @click="vhandlePrev">上一步</mu-button>
            </mu-step-content>
          </mu-step>
          <mu-step>
            <mu-step-label class="bold">
              有什么要补充的吗
            </mu-step-label>
            <mu-step-content>
              <div class="column">
                <mu-text-field label="备注" v-model="validateForm.dutyMemo"></mu-text-field><br/>
              </div>
              <mu-button v-if="validateForm.dutyStatus==1" @click="submit" textColor="#000" color="#fdd835">完成</mu-button>
              <mu-button v-if="validateForm.dutyStatus==2" @click="finish" textColor="#000" color="#fdd835">结束工单</mu-button>
              <mu-button color="rgb(33, 150, 243)" flat class="demo-step-button" @click="vhandlePrev">上一步</mu-button>
            </mu-step-content>
          </mu-step>
        </mu-stepper>
      </mu-form>
    </div>
  </div>
</template>

<script>
import delet from '@/assets/images/delet.svg';
import { duty } from '@/api/maintainApi';
import upLoadImg from '@/components/upLoadImg';
export default {
  components: { upLoadImg },
  data () {
    return {
      viewBox: null, // 图片预览
      vactiveStep: 0,
      file: [],
      delet,
      loading: false,
      validateForm: {
        dutyType: '1',
        dutyStatus: '1',
        dutyMemo: '',
        file: ''
      }
    };
  },
  computed: {
    vfinished () {
      return this.vactiveStep > 3;
    }
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
    back () {
      this.$router.go(-1);
    },
    // 删除图片
    delImg (index) {
      this.file.splice(index, 1);
      this.limit++;
    },

    // 完成上交
    submit () {
      let para = this.validateForm;
      let that = this;
      para.file = this.file;
      if (para.file.length < 1) {
        this.$toast.error('请拍照');
      } else {
        para.orderId = localStorage.getItem('orderId');
        duty(para).then(res => {
          if (res.code === 200) {
            this.$router.push({
              path: '/workSheet',
              query: {
                source: 1
              }
            });
          }
        });
      }
    },

    // 结束工单
    finish () {
      let para = this.validateForm;
      // let that = this
      para.file = this.file;
      if (para.file.length < 1) {
        this.$toast.error('请拍照');
      } else {
        para.orderId = localStorage.getItem('orderId');
        localStorage.setItem('refuseInfo', JSON.stringify(para));
        this.$router.push('/refuseTwo');
      }
    },

    vhandleNext () {
      this.vactiveStep++;
    },
    vhandlePrev () {
      this.vactiveStep--;
    },
    vreset () {
      this.vactiveStep = 0;
    }
  },
  beforeDestroy () {
    if (this.viewBox) this.viewBox.close();
  }
};
</script>
<style lang='less' scoped>
.container {
  width: 95%;
  margin: 20px auto;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 2px 2px 0px rgba(16, 16, 16, 0.3);
}

.mu-step-label.active {
  font-weight: bold;
}

.imgContainer {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  align-items: center;
}
// 修改
.img_box {
  width: 75px;
  height: 75px;
  margin: 10px 10px 0 0;
  position: relative;
  .pic{
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }
}
.column {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.eachRadio {
  width: 35%;
  margin-top: 15px;
  color: rgb(33, 150, 243)
}
.topSpace{
  margin-top: 10px;
}
</style>
