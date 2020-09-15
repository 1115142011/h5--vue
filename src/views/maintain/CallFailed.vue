<template>
    <div class="maintain">
        <mu-appbar class="fixed" style="width: 100%;text-align:center" color="#fdd835" z-depth="5" textColor="#000">
            未拨通
        </mu-appbar>
        <div class="space"></div>
        <!--标题部分-->
        <div class="eachPanel">
            <div class="titleInfo ft14 bold">
                {{orderInfo.houseName}}
            </div>
            <div class="failed">
                未完成验证，请稍后再拨~
            </div>
            <div class="centerInfo">
                <span class="leftRow1 yz ft10">待验证</span>
                <div class="rightRow">
                    <span class="ft16">{{orderInfo.bigName}}-{{orderInfo.smallName}}</span>
                    <span class="ft12 c7474">报修时间：{{orderInfo.startTime}}</span>
                </div>
            </div>
        </div>
        <!--中间文字部分-->
        <div class="content">
            <div class="bottomContainer">
                <mu-button color="#fdd835" @click='submit' textColor="#000">好的</mu-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      orderInfo: {}
    };
  },
  methods: {
    submit () {
      this.$router.push('/repair');
    }
  },
  created () {
    this.orderInfo = JSON.parse(localStorage.getItem('orderInfo'));
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
    height: 610px8px;
    background: #fff;
    padding: 0 15px;
    padding-bottom: 30px;
    border-bottom: 1px solid #d1d1d1;
}

.leftRow1 {
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

.failed {
    background: #fff;
    height: 100px;
    line-height: 40px;
    text-align: center;
    font-size: 18px;
    color: orangered;
    font-weight: bold;
    width: 100%;
    padding-top: 40px;
}

.content {
    background: #ffffff;
    padding: 10px 30px;
    width: 95%;
    margin: 0 auto;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.24);
}

.border {
    height: 1px;
    background: #e1e1e1;
    width: 100%;
}

.bottomContainer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 50px;
}
</style>
