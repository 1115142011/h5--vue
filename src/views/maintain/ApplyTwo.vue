<template>
    <div class="maintain">
        <mu-appbar class="fixed" style="width: 100%;text-align:center" color="#fdd835" z-depth="5" textColor="#000">
            申请成功
        </mu-appbar>
        <div class="space"></div>
        <!--标题部分-->
        <div class="eachPanel">
            <div class="titleInfo ft14 bold">
                {{applyInfo.houseName}}
            </div>
            <div class="failed">
                已发起申请，请等待~
            </div>
            <div class="centerInfo">
                <span class="leftRow yp ft10">预判中</span>
                <div class="rightRow">
                    <span class="ft16">{{applyInfo.bigName}}-{{applyInfo.smallName}}</span>
                    <span class="ft12 c7474">报修时间：{{applyInfo.startTime}}</span>
                </div>
            </div>
        </div>
        <!--中间文字部分-->
        <div class="content">
            <div class="eachRow">
                <span class="ft15 bold">发起人</span>
                <span class="ft14">{{applyInfo.operator}}</span>
            </div>
            <div class="eachRow">
                <span class="ft15 bold">联系人</span>
                <span class="ft14">{{applyInfo.name}}</span>
            </div>
            <div class="eachRow">
                <span class="ft15 bold">联系电话</span>
                <span class="ft14">{{applyInfo.mobile}}</span>
            </div>
            <div class="eachRow">
                <span class="ft15 bold">类别</span>
                <span class="ft14">{{applyInfo.typeName}}</span>
            </div>
            <div class="eachRow">
                <span class="ft15 bold">房间</span>
                <span class="ft14">{{applyInfo.roomName}}</span>
            </div>
            <div class="eachRow">
                <span class="ft15 bold">发起时间</span>
                <span class="ft14">{{applyInfo.startTime}}</span>
            </div>
            <div class="eachRow">
                <span class="ft15 bold">描述</span>
                <span class="ft14"></span>
            </div>
            <div class="text ft14">
                {{applyInfo.descs}}
            </div>
            <div class="imgContainer">
                <div class="eachImg" v-for="(item,index) in applyInfo.startFile" :key="index">
                    <img v-image-preview class="img" :src="item.visitPath">
                </div>
            </div>
            <div class="border"></div>
            <div class="bottomContainer">
                <mu-button color="#fdd835" textColor="#000" @click="back">好的</mu-button>
            </div>
        </div>
    </div>
</template>
<script>
import { formatTime3 } from '@/utils/date';
export default {
  data () {
    return {
      applyInfo: {}
    };
  },
  methods: {
    back () {
      this.$router.push('/index');
    }
  },
  created () {
    this.applyInfo = JSON.parse(localStorage.getItem('applyInfo'));
    this.applyInfo.startTime = formatTime3(this.applyInfo.startTime, 'Y-MM-dd');
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

.failed {
    background: #fff;
    height: 100px;
    line-height: 40px;
    text-align: center;
    font-size: 18px;
    color: #00bc8a;
    font-weight: bold;
    width: 100%;
    padding-top: 40px;
}

.centerInfo {
    display: flex;
    align-items: center;
    height: 68px;
    background: #fff;
    padding: 0 15px;
    border-bottom: 1px solid #d1d1d1;
}

.leftRow {
    line-height: 40px;
    width: 40px;
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
    padding: 20px 30px;
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
    background: #d1d1d1;
    width: 100%;
}

.bottomContainer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 50px;
    padding-top: 15px;
}
</style>
