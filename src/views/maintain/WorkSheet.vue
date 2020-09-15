<template>
  <div class="maintain">
    <mu-appbar class="fixed" style="width: 100%;" color="#fdd835" z-depth="5" textColor="#000">
      <mu-button icon slot="left" @click="backListPage">
        <mu-icon size="30" value="keyboard_backspace"></mu-icon>
      </mu-button>
      {{source?'定责完成':'工单详情'}}
    </mu-appbar>
    <div class="space"></div>
    <!--标题部分-->
    <div class="eachPanel">
      <div class="titleInfo ft14 bold">{{orderInfo.houseName}}</div>
      <div class="centerInfo">
        <span v-if="orderInfo.type==1" class="leftRow bg1 ft10">
          日常
          <br />维修
        </span>
        <span v-if="orderInfo.type==2" class="leftRow bg2 ft10">
          工程
          <br />维修
        </span>
        <span v-if="orderInfo.type==3" class="leftRow bg3 ft10">
          外协
          <br />维修
        </span>
        <span v-if="orderInfo.type==4" class="leftRow bg4 ft10">
          更换
          <br />配件
        </span>
        <div class="rightRow">
          <span class="ft16">{{orderInfo.bigName}}-{{orderInfo.smallName}}</span>
          <span class="ft12 c7474">报修时间：{{orderInfo.startTime}}</span>
        </div>
      </div>
    </div>
    <!--带定责-->
    <div class="content">
      <div class="eachRow">
        <span class="ft15 bold">发起人</span>
        <span class="ft14">{{orderInfo.operator}}</span>
      </div>
      <div class="eachRow">
        <span class="ft15 bold">联系人</span>
        <span class="ft14">{{orderInfo.name}}</span>
      </div>
      <div class="eachRow">
        <span class="ft15 bold">联系电话</span>
        <span @click="call(orderInfo.mobile)" class="ft14 blue">{{orderInfo.mobile}}</span>
      </div>
      <div class="eachRow">
        <span class="ft15 bold">类别</span>
        <span class="ft14">{{orderInfo.typeName}}</span>
      </div>
      <div class="eachRow">
        <span class="ft15 bold">房间</span>
        <span class="ft14">{{orderInfo.roomName}}</span>
      </div>
      <div class="eachRow">
        <span class="ft15 bold">发起时间</span>
        <span class="ft14">{{orderInfo.startTime}}</span>
      </div>
      <div class="eachRow">
        <span class="ft15 bold">描述</span>
        <span class="ft14"></span>
      </div>
      <div class="text ft14">{{orderInfo.descs}}</div>
      <div class="imgContainer">
        <div v-for="(item,index) in orderInfo.startFile" :key="index" class="eachImg">
          <img v-image-preview class="img" :src="item.visitPath" />
        </div>
      </div>
      <div class="border"></div>
      <div v-if="orderInfo.status">
        <div class="eachRow mt10">
          <span class="ft15 bold">责任方</span>
          <span class="ft14">{{orderInfo.dutyTypeName}}</span>
        </div>
        <!--<div class="eachRow">
                                      <span class="ft15 bold">变更原因</span>
                                      <span class="ft14">{{orderInfo.descs}}</span>
        </div>-->
        <div v-if="orderInfo.status<4" class="eachRow">
          <span class="ft15 bold">最新备注</span>
          <span class="ft14">{{orderInfo.dutyMemo}}</span>
        </div>
        <div v-if="orderInfo.status<4" class="eachRow">
          <span class="ft15 bold">最新照片</span>
          <span class="ft14"></span>
        </div>
        <div v-if="orderInfo.status<4" class="imgContainer">
          <div class="eachImg" v-for="(item,index) in orderInfo.dutyFile" :key="index">
            <img v-image-preview class="img" :src="item.visitPath" />
          </div>
        </div>
        <!--完成的时候-->
        <div v-if="orderInfo.status==4" class="eachRow">
          <span class="ft15 bold">最新备注</span>
          <span class="ft14">{{orderInfo.checkDesc}}</span>
        </div>
        <div v-if="orderInfo.status==4" class="eachRow">
          <span class="ft15 bold">完成照片</span>
          <span class="ft14"></span>
        </div>
        <div v-if="orderInfo.status==4" class="imgContainer">
          <div class="eachImg" v-for="(item,index) in orderInfo.checkFile" :key="index">
            <img v-image-preview class="img" :src="item.visitPath" />
          </div>
        </div>
      </div>

      <!--未定责-->
      <div v-if="!orderInfo.status" class="bottomContainer">
        <mu-button color="#f59a23" textColor="#fff" @click="duty">定责</mu-button>
        <span class="ml15 blue" @click="pass">退回</span>
      </div>

      <div v-if="orderInfo.status==1" class="bottomContainer">
        <mu-button color="#fdd835" textColor="#000" @click="finish">维修完成</mu-button>
        <span class="ml15 blue" @click="unFinished">未完成</span>
        <span class="ml15 blue" @click="pass">退回</span>
      </div>
      <!--工程维修-->
      <div v-if="orderInfo.status==2&&orderInfo.type==2" class="bottomContainer">
        <mu-button color="#fdd835" textColor="#000" @click="repair">发起维修</mu-button>
        <span class="ml15 blue" @click="pass">退回</span>
      </div>
    </div>
    <div v-if="orderInfo.status" class="bottom ft14" @click="toDetail">
      <span>费用详情</span>
      <mu-icon value="keyboard_arrow_right"></mu-icon>
    </div>
  </div>
</template>
<script>
import { orderDetail, project } from '@/api/maintainApi';
import { formatTime3 } from '@/utils/date';
import Moment from 'moment';

export default {
  data () {
    return {
      onclick: false,
      source: false, // 判断是否是定责完成 跳转过来
      orderInfo: {}
    };
  },
  methods: {
    // 未完成
    unFinished () {
      this.$router.push('/notFinishedOne');
    },
    // 定责
    duty () {
      this.$router.push('/fixDuty');
    },
    // 退回
    pass () {
      this.$router.push('/returnOne');
    },
    // 发起工程维修
    repair () {
      if (this.onClick) return;
      this.onClick = true;
      let para = this.orderInfo.orderId;
      let page = this;
      this.$confirm('开始维修？', {}).then(({ result }) => {
        if (result) {
          project(para)
            .then(res => {
              this.onClick = false;
              if (res.code === 200) {
                page.$toast.success('发起成功');
                setTimeout(() => {
                  page.$router.replace('/repair');
                }, 2000);
              }
            })
            .catch(errMsg => {
              this.onClick = false;
            });
        }
      });
    },
    // 完成
    finish () {
      if (this.orderInfo.dutyType === 2) {
        // 租客责任
        let flag = Moment().isAfter('2020-05-31 23:59:59');
        if (flag) {
          localStorage.setItem('orderInfo', JSON.stringify(this.orderInfo));
          this.$router.push('/finishOne');
        } else {
          this.$alert('6月1日前暂不能验收 租客责任 的工单,有疑问请联系管家', '提示');
        }
      } else {
        localStorage.setItem('orderInfo', JSON.stringify(this.orderInfo));
        this.$router.push('/finishOne');
      }
      // localStorage.setItem('orderInfo', JSON.stringify(this.orderInfo));
      // this.$router.push('/finishOne');
    },
    // 电话
    call (e) {
      window.location.href = 'tel:' + e;
    },
    // 费用详情
    toDetail () {
      localStorage.setItem('orderInfo', JSON.stringify(this.orderInfo));
      this.$router.push('/feelDetail');
    },
    // 返回列表页
    backListPage () {
      this.$router.push('/repair');
    }
  },
  created () {
    this.source = this.$route.query.source || false;
    let para = {
      id: localStorage.getItem('orderId')
    };
    let page = this;
    orderDetail(para).then(res => {
      if (res.code === 200) {
        page.orderInfo = res.data;
        page.orderInfo.startTime = formatTime3(
          page.orderInfo.startTime,
          'Y-MM-dd'
        );
      }
    });
  }
};
</script>

<style lang="less" scoped>
.eachPanel {
  width: 95%;
  margin: 0 auto;
  margin-top: 20px;
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
  align-items: center;
  height: 68px;
  background: #fff;
  padding: 0 15px;
  border-bottom: 1px solid #e1e1e1;
}

.leftRow {
  padding-top: 6px;
  width: 40px;
  line-height: 12px;
  height: 40px; // line-height: 18px;
  color: #fff;
  text-align: center;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0);
}

.rightRow {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 8px;
}

.content {
  background: #ffffff;
  padding: 20px 40px;
  width: 95%;
  margin: 0 auto;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.24);
}

.eachRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 25px;
}

.text {
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
  border-radius: 5px;
  width: 31%;
  height: 65px;
}

.img {
  width: 90%;
  height: 90%;
}

.border {
  height: 1px;
  background: #e1e1e1;
  width: 100%;
}

.bottomContainer {
  display: flex;
  align-items: center;
  height: 50px;
  padding-top: 15px;
}

.bottom {
  margin: 0 auto;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.24);
  margin-bottom: 30px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background: #fff;
  width: 95%;
}
</style>
