<template>
  <div class="maintain">
    <!--<mu-slide-left-transition>-->
    <mu-appbar v-show="show2" style="width: 100%; z-index:200" class="fixed" color="#fdd835" z-depth="0" textColor="#000">
      <mu-button @click="returnIndex" icon slot="left">
        <mu-icon size="30" value="apps"></mu-icon>
      </mu-button>
      维修工单
      <div slot="right" class="topRight">
        <div class="topTime" @click="timeListStatus=!timeListStatus">{{time}}</div>
        <div class="timeList">
          <span @click="chooseTime(item)" v-show="timeListStatus" v-for="(item,index) in timeList" :key="index" class="eachTime">{{item}}</span>
        </div>
        <div class="sortList">
          <span @click="chooseSort(item)" v-show="showP" v-for="(item,index) in sortList" :key="index" class="eachSort">{{item}}</span>
        </div>
        <mu-icon value="sort" @click="showP = !showP" size="26"></mu-icon>
        <mu-icon value="search" size="26" class="search" color="#000" @click="show2 = !show2"></mu-icon>
      </div>
    </mu-appbar>
    <!--</mu-slide-left-transition>                                                                                                                                                                                                                              <mu-slide-right-transition>-->
    <div v-show="!show2" class="searchTab fixed">
      <div class="topSearch">
        <input placeholder="房屋名字" @keyup="search($event.target)" />
        <mu-icon color="#666" @click="close" value="cancel"></mu-icon>
      </div>
    </div>
    <!--</mu-slide-right-transition>-->
    <div class="space"></div>
    <div class="topTabs fixed">
      <div @click="changeTabs($event)" value="0" :class="[active==0?'active':'normal']">全部
        <span :class="[active==0?(numList.allNum>99?'numActiveMax ft10':'numActive ft10'):(numList.allNum>99?'numNormalMax ft10':'numNormal ft10')]">{{numList.allNum}}</span>
      </div>
      <div @click="changeTabs($event)" value="1" :class="[active==1?'active':'normal']">未定责
        <span :class="[active==1?(numList.runNum>99?'numActiveMax ft10':'numActive ft10'):(numList.runNum>99?'numNormalMax ft10':'numNormal ft10')]">{{numList.runNum}}</span>
      </div>
      <div @click="changeTabs($event)" value="2" :class="[active==2?'active':'normal']">已定责
        <span :class="[active==2?(numList.checkNum>99?'numActiveMax ft10':'numActive ft10'):(numList.checkNum>99?'numNormalMax ft10':'numNormal ft10')]">{{numList.checkNum}}</span>
      </div>
      <div @click="changeTabs($event)" value="5" :class="[active==5?'active':'normal']">待验证
        <span :class="[active==5?(numList.waitAuthNum>99?'numActiveMax ft10':'numActive ft10'):(numList.waitAuthNum>99?'numNormalMax ft10':'numNormal ft10')]">{{numList.waitAuthNum}}</span>
      </div>
      <div @click="changeTabs($event)" value="4" :class="[active==4?'active':'normal']">已完成
        <span :class="[active==4?(numList.finishNum>99?'numActiveMax ft10':'numActive ft10'):(numList.finishNum>99?'numNormalMax ft10':'numNormal ft10')]">{{numList.finishNum}}</span>
      </div>
    </div>
    <div class="space"></div>
    <mu-load-more ref="container"  @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load">
      <div v-for="(item,index) in list" :key="index" @click="toDetail(index)" class="eachPanel">
        <div class="titleInfo ft14 bold">
          {{item.houseName}}
        </div>
        <div class="centerInfo">
          <div class="leftBlock">
            <span v-if="item.type==1&&item.status<3" class="leftRow bg1 ft10">日常<br />维修</span>
            <span v-if="item.type==2&&item.status<3" class="leftRow bg2 ft10">工程<br />维修</span>
            <span v-if="item.type==3&&item.status<3" class="leftRow bg3 ft10">外协<br />维修</span>
            <span v-if="item.type==4&&item.status<3" class="leftRow bg4 ft10">更换<br />配件</span>
            <span v-if="item.status==5" class="leftRow1 yz ft10">待验证</span>
            <span v-if="item.status==3" class="leftRow1 hf ft10">待评价</span>
            <span v-if="item.status==4" class="leftRow1 wc ft10">已完成</span>
            <div class="rightRow">
              <span class="ft16">{{item.smallName}}</span>
              <span class="ft12 c7474">报修时间：{{item.Time}}</span>
            </div>
          </div>
          <mu-icon color="#9f9f9f" value="keyboard_arrow_right"></mu-icon>
        </div>
        <div class="fz12 bottomText">
          {{item.descs}}
        </div>
      </div>
    </mu-load-more>
  </div>
</template>
<script>
// @ is an alias to /src
import { getOrder, orderNum } from '@/api/maintainApi';
import { formatTime3 } from '@/utils/date';
export default {
  data () {
    return {
      active: 0,
      show2: true,
      pageNo: 1,
      pageSize: 5,
      refreshing: false,
      loading: false,
      timeListStatus: false,
      showP: false,
      list: [],
      totalList: '',
      houseName: '',
      numList: {},
      scrollTop: 1,
      // 30、60、90、180
      timeList: ['30天', '60天', '90天', '180天'],
      sortList: ['时间升序', '时间降序'],
      time: '60天',
      order: 0
    };
  },
  methods: {
    // 改变tab
    changeTabs (event) {
      this.active = event.target.getAttribute('value');
      this.list = [];
      this.scrollTop = 0;
      this.pageNo = 1;
      this.getOrder();
      this.orderNum();
    },
    // 筛选时间
    chooseTime (e) {
      this.time = e;
      this.timeListStatus = !this.timeListStatus;
      let myDate = new Date();
      if (e === '7天') {
        this.beginDate = formatTime3(myDate.setDate(myDate.getDate() - 7), 'Y-MM-dd');
      }
      if (e === '30天') {
        this.beginDate = formatTime3(myDate.setDate(myDate.getDate() - 30), 'Y-MM-dd');
      }
      if (e === '60天') {
        this.beginDate = formatTime3(myDate.setDate(myDate.getDate() - 60), 'Y-MM-dd');
      }
      if (e === '90天') {
        this.beginDate = formatTime3(myDate.setDate(myDate.getDate() - 90), 'Y-MM-dd');
      }
      if (e === '180天') {
        this.beginDate = formatTime3(myDate.setDate(myDate.getDate() - 180), 'Y-MM-dd');
      }
      this.getOrder();
      this.orderNum();
    },
    // 排序
    chooseSort (e) {
      this.showP = !this.showP;
      this.list = [];
      this.scrollTop = 0;
      this.pageNo = 1;
      if (e === '时间升序') {
        this.order = 1;
        this.getOrder();
      }
      if (e === '时间降序') {
        this.order = 0;
        this.getOrder();
      }
    },
    // 关闭搜索
    close () {
      this.show2 = !this.show2;
      this.orderNum();
      this.houseName = '';
      this.pageNo = 1;
      this.timeListStatus = false;
      this.getOrder();
    },
    // 下拉刷新
    refresh () {
      this.refreshing = true;
      this.$refs.container.scrollTop = 0;
      this.list = [];
      this.pageNo = 1;
      this.getOrder();
      setTimeout(() => {
        this.refreshing = false;
      }, 1500);
    },
    // 搜索
    search (target) {
      this.houseName = target.value;
      if (this.active < 1) {
        this.orderNum();
      }
      this.list = [];
      this.pageNo = 1;
      this.getOrder();
    },
    // 上拉加载
    load () {
      this.scrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop;
      if (this.pageCount > this.pageNo && this.scrollTop > 0) {
        this.loading = true;
        this.getOrder('next');
        setTimeout(() => {
          this.loading = false;
        }, 500);
      }
    },
    // 返回首页
    returnIndex () {
      this.$router.push('/index');
    },
    // 跳转详情
    toDetail (e) {
      let orderId = this.list[e].orderId;
      localStorage.setItem('orderId', orderId);
      if (this.list[e].status === 5) {
        localStorage.setItem('orderType', 'unCall');
        this.$router.push('/finishThree');
      } else {
        localStorage.setItem('orderType', 'normal');
        this.$router.push('/workSheet');
      }
    },
    // 获取工单
    getOrder (e) {
      let page = this;
      let status = page.active;
      let list = page.list;
      let pageNo = page.pageNo;
      let beginDate = page.beginDate;
      let endDate = page.endDate;
      let order = page.order;
      // 上拉加载
      if (e === 'next') {
        pageNo++;
      }
      getOrder({ status, pageNo, beginDate, endDate, order, pageSize: page.pageSize, houseName: page.houseName }).then(
        res => {
          if (res.code === 200) {
            page.pageNo = res.data.pageNumber;
            if (res.data.list.length > 0) {
              res.data.list.map(i => {
                i.Time = formatTime3(i.startTime, 'Y-M-d');
              });
              // 上拉加载
              if (e === 'next') {
                page.list = list.concat(res.data.list);
                page.pageCount = res.data.pageCount;
                page.pageNo = pageNo;
              } else {
                page.list = res.data.list;
                page.pageCount = res.data.pageCount;
                page.pageNo = pageNo;
              }
            }
          }
        }
      );
    },
    // 工单数量
    orderNum () {
      let page = this;
      let para = {
        houseName: this.houseName,
        beginDate: this.beginDate,
        endDate: this.endDate
      };
      orderNum(para).then(res => {
        if (res.code === 200) {
          page.numList = res.data;
        }
      });
    }
  },

  created () {
    let time = new Date();
    this.endDate = formatTime3(time, 'Y-MM-dd');
    this.beginDate = formatTime3(time.setDate(time.getDate() - 60), 'Y-MM-dd');
    this.getOrder();
    this.orderNum();
  }
};
</script>

<style lang="less" scoped>
.search {
  margin-right: 10px;
  margin-left: 5px;
}

.spaceRepair {
  height: 112px;
}

.topRight {
  display: flex;
  position: relative;
}

.topTime {
  background: #000;
  color: #fdd835;
  height: 25px;
  line-height: 25px;
  padding: 0 10px;
  border-radius: 13px;
  margin-right: 10px;
  font-size: 12px;
  position: relative;
}

.timeList {
  position: absolute;
  z-index: 1000;
  bottom: -195px;
  left: -80px;
  background: #fff;
  color: #000;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 5px 5px 0px rgba(16, 16, 16, 0.3);
  border-radius: 5px;
}

.eachTime {
  height: 50px;
  line-height: 50px;
  width: 100px;
  text-align: left;
  padding-left: 20px;
}

.sortList {
  position: absolute;
  z-index: 1000;
  bottom: -90px;
  left: -30px;
  background: #fff;
  color: #000;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 5px 5px 0px rgba(16, 16, 16, 0.3);
  border-radius: 5px;
}

.eachSort {
  height: 50px;
  line-height: 50px;
  width: 100px;
  text-align: left;
  padding-left: 20px;
}

.searchTab {
  // height: 56px;
  width: 100%;
  background: #fdd835;
  display: flex;
  align-items: center;
  z-index: 10;
  height: 56px;
}

.topSearch {
  background: #fff;
  width: 94%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  margin: 0 auto;
  height: 40px;
  border-radius: 5px;
  box-shadow: 0px 2px 2px 0px rgba(16, 16, 16, 0.3);
}

input {
  border: 0; // 去除未选中状态边框
  outline: none; // 去除选中状态边框
  background-color: rgba(0, 0, 0, 0); // 透明背景
  width: 80%;
}

.topTabs {
  display: flex;
  justify-content: space-around;
  height: 50px;
  width: 100%;
  z-index: 100;
  align-items: center;
  background: #fdd835;
  box-shadow: 0px 2px 2px 0px rgba(16, 16, 16, 0.3);
}

.numActive {
  position: absolute;
  background: #2196f3;
  border-radius: 50%;
  color: #fff;
  line-height: 20px;
  width: 20px;
  height: 20px;
  top: 2px;
}

.numNormal {
  position: absolute;
  background: #666;
  border-radius: 50%;
  color: #fff;
  line-height: 20px;
  width: 20px;
  height: 20px;
  opacity: 0.5;
  top: 2px;
}

.numNormalMax {
  position: absolute;
  background: #666;
  padding: 0 5px;
  border-radius: 10px;
  color: #fff;
  line-height: 20px;
  height: 20px;
  opacity: 0.5;
  top: 2px;
}

.numActiveMax {
  position: absolute;
  background: #2196f3;
  padding: 0 5px;
  border-radius: 10px;
  color: #fff;
  line-height: 20px;
  height: 20px;
  top: 2px;
}

.active {
  color: #000;
  border-bottom: #2196f3 2px solid;
  width: 25%;
  line-height: 50px;
  text-align: center;
  position: relative;
}

.normal {
  text-align: center;
  width: 25%;
  line-height: 50px;
  color: #999;
  position: relative;
}

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
  justify-content: space-between;
  align-items: center;
  height: 68px;
  background: #fff;
  padding: 0 15px; // box-shadow: 0px 1px 1px 0px rgba(16, 16, 16, 0.3);
  border-bottom: 1px solid #eee;
}

.leftBlock {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.bottomText {
  padding: 15px;
  background: #fff;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  box-shadow: 0px 2px 2px 0px rgba(16, 16, 16, 0.3);
}
</style>
