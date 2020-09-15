<template>
  <div class="maintain">
    <mu-appbar class="fixed" style="width: 100%;" color="#fdd835" z-depth="5" textColor="#000">
      <mu-button @click="back" icon slot="left">
        <mu-icon size="30" value="keyboard_backspace"></mu-icon>
      </mu-button>
      费用详情
    </mu-appbar>
    <div class="space"></div>

    <div v-if="feelList.length>0" class="eachPanel">
      <div class="titleInfo ft14 bold">
        {{orderInfo.houseName}}
      </div>
      <div class="centerInfo">
        <div class="leftBlock">
          <span v-if="orderInfo.dutyType==2" class="leftRow ft10">租客<br />责任</span>
          <span v-if="orderInfo.dutyType==1" class="leftRow ft10">公司<br />责任</span>
          <div class="rightRow">
            <span class="ft16">{{orderInfo.bigName}}-{{orderInfo.smallName}}</span>
            <span class="ft12 c7474">报修时间：{{orderInfo.startTime}}</span>
          </div>
        </div>
        <span class="allCost mr20">￥{{costAll}}</span>
      </div>
      <div class="content">
        <div class="eachTag" v-for="(item,index) in feelList" :key="index">
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
          <div class="border"></div>
        </div>
      </div>
    </div>
    <div v-else class="top">
      <img class="nobill" src="../../assets/images/noBill.gif" />
      <div style="margin-bottom:20px">该工单无费用</div>
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
import { orderFeel } from '@/api/maintainApi'
import { formatTime3 } from '@/utils/date'
export default {
  data () {
    return {
      feelList: [],
      costAll: '',
      orderInfo: {},
      viewStatus: false,
      viewImgSrc: ''
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    changeImg (e) {
      // let viewImgSrc = this.viewImgSrc
      let imgIndex = this.imgIndex
      if (e === 'add' && ((this.imgFile.length - imgIndex) > 1)) {
        this.imgIndex = this.imgIndex + 1
        this.viewImgSrc = this.imgFile[this.imgIndex].visitPath
      }
      if (e === 'delet' && (imgIndex > 0)) {
        this.imgIndex = this.imgIndex - 1
        this.viewImgSrc = this.imgFile[this.imgIndex].visitPath
      }
    },
    viewImg (e) {
      this.viewStatus = !this.viewStatus
      this.imgIndex = 0
      this.imgFile = e.file
      this.viewImgSrc = e.file[this.imgIndex].visitPath
    }
  },
  watch: {
    viewImgSrc: function (val, oldVal) {
    }
  },
  created () {
    let para = localStorage.getItem('orderId')
    let page = this
    this.orderInfo = JSON.parse(localStorage.getItem('orderInfo'))
    orderFeel(para).then(res => {
      if (res.code === 200) {
        page.feelList = res.data
        let a = 0
        page.feelList.map(i => {
          i.costTime = formatTime3(i.costTime, 'Y-MM-dd')
          i.cost = i.cost / 1000
          a = a + i.cost
        })
        page.costAll = a
      }
    })
  }
}
</script>

<style lang="less" scoped>
.eachPanel {
  width: 95%;
  margin: 0 auto;
  margin-top: 20px;
}

.top {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 15px;
  background: #fff;
  width: 95%;
  margin: 0 auto;
  margin-top: 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 2px 0px rgba(16, 16, 16, 0.3);
}

.nobill {
  height: 158px;
  width: 112px;
  margin-bottom: 10px;
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

.titleInfo {
  padding-left: 10px;
  width: 100%;
  background-color: #545454;
  color: #fff;
  height: 32px;
  line-height: 32px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.centerInfo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 68px;
  background: #fff;
  padding: 0 15px;
  border-bottom: 1px solid #eee;
}

.leftBlock {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.leftRow {
  padding-top: 7px;
  width: 45px;
  line-height: 12px;
  height: 45px; // line-height: 18px;
  color: #dc1544;
  text-align: center;
  font-weight: bold;
  border-radius: 50%;
  border: 3px solid #dc1544;
}

.allCost {
  color: #797979;
  font-weight: bold;
}

.rightRow {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 8px;
}

.content {
  background: #fff;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  box-shadow: 0px 2px 2px 0px rgba(16, 16, 16, 0.3);
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
}

.lfetText {
  display: flex;
  flex-direction: column;
}

.rightText {
  display: flex;
}

.border {
  height: 1px;
  background: #eee;
  width: 94%;
  margin: 0 auto;
}
</style>
