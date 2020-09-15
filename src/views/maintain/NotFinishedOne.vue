<template>
  <div class="maintain">
    <mu-appbar class="fixed" style="width: 100%;" color="#fdd835" z-depth="5" textColor="#000">
      <mu-button @click="back" icon slot="left">
        <mu-icon size="30" value="keyboard_backspace"></mu-icon>
      </mu-button>未完成(1/3)
    </mu-appbar>
    <div class="space"></div>
    <div class="container">
      <mu-stepper :active-step="vactiveStep" orientation="vertical">
        <mu-step v-if="orderInfo.type!=4">
          <mu-step-label class="bold">为什么未完成?</mu-step-label>
          <mu-step-content>
            <div class="column" v-if="orderInfo.type==2">
              <mu-radio class="eachRadio ft10" v-model="checkType" value="2" label="验收不通过"></mu-radio>
              <mu-radio class="eachRadio" v-model="checkType" value="3" label="更换配件"></mu-radio>
            </div>
            <div class="column" v-else>
              <mu-radio class="eachRadio ft10" v-model="checkType" value="2" label="任务类型不匹配"></mu-radio>
              <mu-radio class="eachRadio" v-model="checkType" value="3" label="更换配件"></mu-radio>
            </div>
            <mu-button @click="vhandleNext" textColor="#000" color="#fdd835">下一步</mu-button>
          </mu-step-content>
        </mu-step>
        <mu-step>
          <mu-step-label class="bold">有什么需要备注的吗?</mu-step-label>
          <mu-step-content>
            <mu-text-field label="备注" v-model="memo"></mu-text-field>
            <br />
            <mu-button @click="vhandleNext" textColor="#000" color="#fdd835">下一步</mu-button>
            <mu-button
              color="rgb(33, 150, 243)"
              flat
              class="demo-step-button"
              @click="vhandlePrev"
            >上一步</mu-button>
          </mu-step-content>
        </mu-step>
        <mu-step>
          <mu-step-label class="bold">请拍几张现场的照片</mu-step-label>
          <mu-step-content>
            <div class="imgContainer">
              <div v-for="(item,index) in file" :key="'p'+index" class="img_box">
                <img class="pic" @click="lookHand(index)" :src="item.privePath" />
                <img class="delet" @click="delImg(index)" :src="delet" />
              </div>
              <upLoadImg @keepNewPic="keepNewPic" :fileList="file"></upLoadImg>
            </div>
            <mu-button @click="vhandleNext" textColor="#000" class="topSpace" color="#fdd835">下一步</mu-button>
          </mu-step-content>
        </mu-step>
      </mu-stepper>
      <p v-if="vfinished" class="ml20">
        <a href="javascript:;" class="blue" @click="vreset">填写完成（查看）</a>
      </p>
    </div>
    <div class="bottom">
      <mu-button v-if="vfinished" color="#fdd835" @click="next" textColor="#000">下一步</mu-button>
      <mu-button v-else color="#999" textColor="#fff">下一步</mu-button>
    </div>
  </div>
</template>

<script>
import { orderDetail } from '@/api/maintainApi';
import delet from '@/assets/images/delet.svg';
import upLoadImg from '@/components/upLoadImg';
export default {
  components: { upLoadImg },
  data () {
    return {
      delet,
      viewBox: null,
      vactiveStep: 0,
      checkType: '3',
      file: [],
      memo: '',
      loading: false,
      orderInfo: {}
    };
  },
  computed: {
    vfinished () {
      if (this.orderInfo.type === 4) {
        return this.vactiveStep > 1;
      } else {
        return this.vactiveStep > 2;
      }
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
        memo: this.memo,
        checkResult: 2
      };
      // 更换配件默认不匹配
      if (this.orderInfo.type === 4) {
        para.checkType = 2;
      }
      // 外协和日常
      if (this.orderInfo.type < 4) {
        para.checkType = this.checkType;
      }
      if (para.file.length < 1) {
        this.$toast.error('请拍照');
      } else {
        localStorage.setItem('notFinishedInfo', JSON.stringify(para));
        this.$router.push('/notFinishedTwo');
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
  created () {
    let para = {
      id: localStorage.getItem('orderId')
    };
    let page = this;
    orderDetail(para).then(res => {
      if (res.code === 200) {
        page.orderInfo = res.data;
      }
    });
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

.img {
  width: 90%;
  height: 85%;
}

.column {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.eachRadio {
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
