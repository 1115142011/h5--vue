<template>
  <div class="maintain">
    <mu-appbar class="fixed" style="width: 100%;" color="#fdd835" z-depth="5" textColor="#000">
      <mu-button @click="back" icon slot="left">
        <mu-icon size="30" value="keyboard_backspace"></mu-icon>
      </mu-button>退回(1/2)
    </mu-appbar>
    <div class="space"></div>
    <div class="container">
      <mu-stepper :active-step="vactiveStep" orientation="vertical">
        <mu-step>
          <mu-step-label class="bold">为什么要退回工单?</mu-step-label>
          <mu-step-content>
            <mu-text-field label="备注" v-model="returnMemo"></mu-text-field>
            <br />
            <mu-button @click="vhandleNext" textColor="#000" color="#fdd835">下一步</mu-button>
          </mu-step-content>
        </mu-step>
        <mu-step>
          <mu-step-label class="bold">展示退回原因的照片</mu-step-label>
          <mu-step-content>
            <div class="imgContainer">
              <div v-for="(item,index) in file" :key="'p'+index" class="img_box">
                <img class="pic" @click="lookHand(index)" :src="item.privePath" />
                <img class="delet" @click="delImg(index)" :src="delet" />
              </div>
              <upLoadImg @keepNewPic="keepNewPic" :fileList="file"></upLoadImg>
            </div>
            <mu-button
              class="demo-step-button"
              @click="vhandleNext"
              textColor="#000"
              color="#fdd835"
            >完成</mu-button>
            <mu-button
              flat
              class="demo-step-button"
              @click="vhandlePrev"
              color="rgb(33, 150, 243)"
            >上一步</mu-button>
          </mu-step-content>
        </mu-step>
      </mu-stepper>
      <p v-if="vfinished" class="ml20">
        <a href="javascript:;" class="blue" @click="vreset">填写完成</a>
      </p>
    </div>
    <div class="bottom">
      <mu-button v-if="vfinished" color="#fdd835" @click="next" textColor="#000">下一步</mu-button>
      <mu-button v-else color="#999" textColor="#fff">下一步</mu-button>
    </div>
  </div>
</template>
<script>
import { pass } from '@/api/maintainApi';
import delet from '@/assets/images/delet.svg';
import upLoadImg from '@/components/upLoadImg';
export default {
  components: { upLoadImg },
  data () {
    return {
      onClick: false,
      viewBox: null,
      vactiveStep: 0,
      file: [],
      returnMemo: '',
      delet,
      loading: false
    };
  },
  computed: {
    vfinished () {
      return this.vactiveStep > 1;
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
    // 删除图片
    delImg (index) {
      this.file.splice(index, 1);
    },
    // 返回
    back () {
      this.$router.go(-1);
    },
    // 下一步
    next () {
      if (this.onClick) return;
      this.onClick = true;
      let page = this;
      let para = {
        orderId: localStorage.getItem('orderId'),
        file: page.file,
        returnMemo: page.returnMemo
      };
      if (para.file.length < 1) {
        page.$toast.error('请拍照');
        this.onClick = false;
      } else {
        pass(para).then(res => {
          this.onClick = false;
          if (res.code === 200) {
            page.$router.push('/returnTwo');
          }
        })
          .catch(errMsg => {
            this.onClick = false;
          });
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
  margin-bottom: 10px;
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
  .pic {
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
  width: 50%;
  text-align: left;
  margin-top: 15px;
  color: rgb(33, 150, 243);
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
</style>
