<template>
  <div class="maintain">
    <mu-appbar class="fixed" style="width: 100%;" color="#fdd835" z-depth="5" textColor="#000">
      <mu-button @click="back" icon slot="left">
        <mu-icon size="30" value="keyboard_backspace"></mu-icon>
      </mu-button>完成(1/3)
    </mu-appbar>
    <div class="space"></div>
    <div class="container">
      <mu-stepper :active-step="vactiveStep" orientation="vertical">
        <mu-step>
          <mu-step-label class="bold">请拍几张完成的照片</mu-step-label>
          <mu-step-content>
            <div class="imgContainer">
              <div v-for="(item,index) in file" :key="'p'+index" class="img_box">
                <img class="pic" @click="lookHand(index)" :src="item.privePath" />
                <img class="delet" @click="delImg(index)" :src="delet" />
              </div>
              <upLoadImg @keepNewPic="keepNewPic" :fileList="file"></upLoadImg>
            </div>
            <mu-button @click="vhandleNext" textColor="#000" color="#fdd835">下一步</mu-button>
          </mu-step-content>
        </mu-step>
        <mu-step>
          <mu-step-label class="bold">请提供一些信息</mu-step-label>
          <mu-step-content>
            <mu-text-field label="备注" v-model="memo"></mu-text-field>
            <br />
            <mu-button
              class="demo-step-button"
              textColor="#000"
              @click="vhandleNext"
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
      <div class="bottom">
        <mu-button v-if="vfinished" color="#fdd835" @click="next" textColor="#000">下一步</mu-button>
        <mu-button v-else color="#999" textColor="#fff">下一步</mu-button>
      </div>
    </div>
  </div>
</template>

<script>
import delet from '@/assets/images/delet.svg';
import upLoadImg from '@/components/upLoadImg';
export default {
  components: { upLoadImg },
  data () {
    return {
      viewBox: null,
      vactiveStep: 0,
      delet,
      file: [],
      memo: '',
      loading: false
    };
  },
  computed: {
    vfinished () {
      return this.vactiveStep > 1;
    }
  },
  methods: {
    back () {
      this.$router.go(-1);
    },
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

    next () {
      let para = {
        file: this.file,
        memo: this.memo
      };
      if (para.file.length < 1) {
        this.$toast.error('请拍照');
      } else {
        localStorage.setItem('finishInfo', JSON.stringify(para));
        this.$router.push('/finishTwo');
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
    },
    beforeDestroy () {
      if (this.viewBox) this.viewBox.close();
    }
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
  margin-bottom: 10px;
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
  width: 35%;
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
  padding: 10px;
  align-items: center;
  justify-content: flex-end;
  box-shadow: 5px 5px 5px 5px rgba(16, 16, 16, 0.3);
}
</style>
