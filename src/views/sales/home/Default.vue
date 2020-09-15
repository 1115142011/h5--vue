<template>
  <!-- 主内容区 -->
  <div class="pageContainer" ref="pageContainer">
    <!-- 顶部环形-/柱状图--图表 -->
    <mu-paper class="v_block" :z-depth="1">
      <div class="circularWrap">
        <div
          class="circleBox"
          ref="circleBox"
          v-loading="circleLoding"
          data-mu-loading-overlay-color="transparent"
        ></div>
        <div class="rightMsg">
          <span class="rank">{{AllDatas.teamName}}--{{AllDatas.roleName}}</span>
          <span class="fontWight">你好,{{AllDatas.name}}</span>
          <span class="timeHint">
            距离考核时间还剩
            <span class="green">{{inspectTime}}</span>天
          </span>
        </div>
      </div>
      <div
        class="histogramBox skipRem"
        ref="histogramBox"
        v-loading="topBarLoading"
        data-mu-loading-overlay-color="transparent"
      ></div>
      <!-- 看板数据        -->
      <div class="textHint">
        <more-column-tabs :msgData="boardData" :column="'four'" ></more-column-tabs>
      </div>
    </mu-paper>
    <!-- 待办任务 -->
    <mu-paper class="v_block big" :z-depth="1">
      <title-msg :msg="'待办任务'"></title-msg>
      <more-column-tabs :msgData="todoData" :twoColor="'blue'"></more-column-tabs>
    </mu-paper>
    <!-- 销售排名 -->
    <!-- <div class="v_block swperBox" :z-depth="1">
      <swper-person :listData="personData"></swper-person>
    </div> -->
    <!-- 团队排名 -->
    <!-- <mu-paper class="v_block" :z-depth="1">
      <title-msg :msg="'团队排名'"></title-msg>
      <team-sort :listData="teamRank"></team-sort>
    </mu-paper> -->
    <!-- 客户来源图表 -->
    <mu-paper class="visitorBox v_block" :z-depth="1">
      <title-msg :msg="'我的客户来源'"></title-msg>
      <div class="customer_bar">
        <!-- <div class="pieCavans" ref="pieCavans" v-loading="pieLoading"></div> -->
        <div class="pieLeng skipRem" ref="pieLeng" v-loading="lengLoading"></div>
      </div>
    </mu-paper>
    <!-- 团队数据 -->
    <!-- <mu-paper :z-depth="1" class="v_block big">
      <title-msg :msg="'团队数据'"></title-msg>
      <more-column-tabs :msgData="teamList" :column="'four'"></more-column-tabs>
    </mu-paper> -->
    <!-- 最长空置 -->
    <mu-paper :z-depth="1" class="v_block">
      <title-msg :msg="'组内最长空置'"></title-msg>
      <VacancyList :listData="freeRoom"></VacancyList>
    </mu-paper>
    <!-- 组员工作数据 -->
    <mu-paper :z-depth="1" class="v_block">
      <work-group :listData="selfGroupRank" :title="'小组工作数据'"></work-group>
    </mu-paper>
    <!-- 楼盘数据 -->
    <mu-paper :z-depth="1" class="v_block">
    <work-group :listData="teamHousData" :title="'楼盘数据'" :state="1"></work-group>
    </mu-paper>
    <!-- page 底部提示信息 -->
    <div class="v_footerHint">没有更多信息了~</div>
  </div>
</template>
<script>
import MoreColumnTabs from './children/MoreColumnTabs';
import TitleMsg from './children/TitleMsg';
// import TeamSort from './children/TeamSort';
import VacancyList from './children/VacancyList';
import WorkGroup from './children/WorkGroup';
// import swperPerson from './children/swperPerson';
import {
  getSalesPersonMsg,
  getSalesWeekMsg,
  getSalesBoardMsg,
  getSalesGroupMonthRank,
  getSalesTodoMsg,
  getSalesMonthMsg,
  getGroupFreeRoom,
  getGroupData,
  getGroupHousRank,
  getGroupSaleRank,
  queryCustomeRsource
} from '@/api/salesApi';
import moment from 'moment';

require('echarts/lib/echarts');

// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/bar');
// 引入饼图
require('echarts/lib/chart/pie');
// 引入组件
require('echarts/lib/component/graphic');
require('zrender/lib/svg/svg');
export default {
  name: 'salesHome',
  components: {
    MoreColumnTabs,
    TitleMsg,
    // TeamSort,
    VacancyList,
    WorkGroup
    // swperPerson
  },
  data () {
    return {
      circleLoding: false, // 环形图loading
      topBarLoading: false, // 顶部柱状图loading
      pieLoading: false, // 饼图loading
      lengLoading: false, // 横向柱状图的loading
      annulus: undefined,
      histogram: undefined,
      pie: undefined,
      pieLeng: undefined,
      inspectTime: '', // 考核时间
      AllDatas: {
        name: '', // 登陆人姓名,
        group_id: '', // 登陆人所在团队的id
        personId: '', // 登陆人的id
        user_rank: '' // 个人排名
      },
      todoData: [], // 待办任务
      boardData: [], // 业务看板数据
      teamList: [], // 团队看板数据
      freeRoom: [], // 房间最长空置，
      selfGroupRank: [], // 团队内部排名
      teamHousData: [], // 团队楼盘排名
      personData: [], // 个人排行榜数据
      teamRank: [] // 团队排行榜
    };
  },
  created () {
    this.AllDatas.personId = localStorage.getItem('personId');
    this.getPersonMsg(this.AllDatas.personId); // 获取登陆人姓名
    this.getTodo(this.AllDatas.personId); // 待办任务
    // this.getPersonRank(); // 销售人员月排名
    // this.getGroupRank(); // 团队月排名
    this.inspectTime = this.assesTime();
  },
  mounted () {
    this.getWeekData(this.AllDatas.personId); // 周业绩数据
    this.getBoard(this.AllDatas.personId); // 业务看板数据
    this.getCustomeData();
  },
  methods: {
    // 获取时间
    getTime () {
      let year = new Date().getFullYear();
      let month = new Date().getMonth();
      if (month === 0) {
        year = year - 1;
        month = 12;
      }
      return `${year}${month}`;
    },
    // 获取客户来源数据
    getCustomeData () {
      let personId = localStorage.getItem('personId');
      queryCustomeRsource(personId).then(res => {
        this.drawPieLeng(res.data);
      });
    },
    // 获取销售人员信息
    getPersonMsg (userid) {
      getSalesPersonMsg(userid).then(res => {
        this.AllDatas.name = res.data.name;
        this.AllDatas.group_id = res.data.group.group_id;
        this.AllDatas.teamName = res.data.group.group_name;
        this.AllDatas.roleName = res.data.role.role_name;
        this.getGroupMsg(this.AllDatas.group_id);
        this.getFreeRoom(this.AllDatas.group_id);
        this.getSelfGroupRank(this.AllDatas.group_id);
        this.getTeamHous(this.AllDatas.group_id);
        localStorage.setItem('personName', res.data.name);
        localStorage.setItem('team_id', res.data.group.group_id);
      });
    },
    // 获取销售人员周业绩数据--柱状图
    getWeekData (userid) {
      this.topBarLoading = true;
      getSalesWeekMsg(userid).then(res => {
        this.drawBar(res.data);
      });
    },
    // 获取销售业务看板数据--柱状图下面表格
    getBoard (userid) {
      this.circleLoding = true;
      getSalesBoardMsg(userid).then(res => {
        this.boardData = this.setData(res.data);
        this.AllDatas.user_rank = res.data.month_rank;
        this.drawAnnulus(res.data); // 绘制环形图
      });
    },
    // 获取待办任务数据
    getTodo (userid) {
      getSalesTodoMsg(userid).then(res => {
        this.todoData = this.setData(res.data);
        this.$store.commit('sales/setLeaseTagNumber', this.todoData);
      });
    },
    // 团队月排名板
    getGroupRank () {
      let data = this.getTime();
      getSalesGroupMonthRank(data).then(res => {
        this.teamRank = res.data;
      });
    },
    // 获取销售人员月排名数据--排名轮播
    getPersonRank () {
      let data = this.getTime();
      getSalesMonthMsg(data).then(res => {
        this.personData = res.data;
      });
    },
    // 获取团队看板数据
    getGroupMsg (id) {
      getGroupData(id).then(res => {
        this.teamList = this.setGroupList(res.data);
      });
    },
    // 获取团队空置楼盘排名数据，
    getFreeRoom (groupid) {
      getGroupFreeRoom(groupid).then(res => {
        this.freeRoom = res.data;
      });
    },
    // 获取销售人团队内部排名
    getSelfGroupRank (groupid) {
      getGroupSaleRank(groupid).then(res => {
        this.selfGroupRank = res.data;
      });
    },
    // 获取登陆人团队楼盘排名
    getTeamHous (groupid) {
      getGroupHousRank(groupid).then(res => {
        this.teamHousData = res.data;
      });
    },
    // 遍历设置数据
    setData (obj) {
      if (Object.keys(obj).length === 0) return [];
      let tempArr = [];
      for (let key in obj) {
        switch (key) {
          // 待办任务
          case 'leasek_ck_reject_num':
            tempArr.push({
              title: '退租驳回',
              value: obj[key],
              leaseState: 10000
            });
            break;
          case 'overdue_lease_num':
            tempArr.push({
              title: '租约超期',
              value: obj[key],
              leaseState: 8,
              type: 3
            });
            break;
          case 'to_expire_lease_num':
            tempArr.push({
              title: '即将到期',
              value: obj[key],
              leaseState: 5,
              type: 3
            });
            break;
          case 'to_pay_bill_num':
            tempArr.push({
              title: '待催缴',
              value: obj[key],
              leaseState: 3,
              type: 3
            });
            break;
          case 'urgent_ck_lease_num':
            tempArr.push({
              title: '急需清退',
              value: obj[key],
              leaseState: 9,
              type: 3
            });
            break;
          case 'to_expire_reserve_num':
            tempArr.push({
              title: '预定快到期',
              value: obj[key],
              leaseState: 10,
              type: 1
            });
            break;
          // 柱状图下的数据看板
          case 'cur_date_sale_num':
            tempArr.push({
              title: '今日业绩',
              value: obj[key]
              // hit: this.setSuffix(obj.month_rank)
            });
            break;
          case 'month_sale_goal_num':
            tempArr.push({
              title: '个人目标',
              value: obj[key],
              hit: this.calcTagert(obj.month_sale_num, obj.month_sale_goal_num)
            });
            break;
          case 'avg_sale_num':
            tempArr.push({
              title: '日均业绩',
              value: obj[key].toFixed(1)
              // hit: this.setSuffix(obj.month_rank)
            });
            break;
          case 'team_month_sale_goal_num':
            tempArr.push({
              title: '团队目标',
              value: obj[key],
              hit: this.calcTagert(
                obj.team_month_sale_num,
                obj.team_month_sale_goal_num
              )
            });
            break;
          case 'sale_finish_rate':
            tempArr.push({
              title: '个人完成率',
              value: this.setMinNumber(obj[key]),
              // hit: this.setSuffix(obj.month_rank),
              sub: this.setSub(obj[key])
            });
            break;
          case 'sale_process_rate':
            tempArr.push({
              title: '个人进度',
              value: this.setMinNumber(obj[key]),
              // hit: this.setSuffix(obj.month_rank),
              sub: this.setSub(obj[key])
            });
            break;
          case 'team_finish_rate':
            tempArr.push({
              title: '团队完成率',
              value: this.setMinNumber(obj[key]),
              // hit: this.setSuffix(obj.month_rank),
              sub: this.setSub(obj[key])
            });
            break;
          case 'team_process_rate':
            tempArr.push({
              title: '团队进度率',
              value: this.setMinNumber(obj[key]),
              // hit: this.setSuffix(obj.month_rank),
              sub: this.setSub(obj[key])
            });
            break;
          default:
            break;
        }
      }
      return tempArr;
    },
    // 判断看板数据阈值
    setMinNumber (value) {
      return value <= 0 ? '--' : value.toFixed(2);
    },
    // 判断百分号是否显示
    setSub (value) {
      return value > 0;
    },
    // 设置团队业绩据看板数据
    setGroupList (obj) {
      if (Object.keys(obj).length === 0) return [];
      let tempArr = [];
      for (let key in obj) {
        switch (key) {
          case 'mgt_room_num':
            tempArr.push({
              title: '管理间数',
              value: obj[key]
            });
            break;
          case 'free_room_num':
            tempArr.push({
              title: '空置间数',
              value: obj[key]
            });
            break;
          case 'team_person_num':
            tempArr.push({
              title: '团队人数',
              value: obj[key]
            });
            break;
          case 'yest_sale_new_num':
            tempArr.push({
              title: '昨日新签',
              value: obj[key]
            });
            break;
          case 'month_sale_new_num':
            tempArr.push({
              title: '本月新签',
              value: obj[key] > 0 ? obj[key] : obj[key]
            });
            break;
          case 'avg_sale_num':
            tempArr.push({
              title: '人均业绩',
              value: obj[key].toFixed(1)
            });
            break;
          case 'free_rate':
            tempArr.push({
              title: '空置率',
              value: obj[key].toFixed(1),
              sub: this.setSub(obj[key])
            });
            break;
          case 'rent_free_rate':
            tempArr.push({
              title: '租金空置率',
              value: this.setMinNumber(obj[key]),
              sub: this.setSub(obj[key])
            });
            break;
          default:
            break;
        }
      }
      return tempArr;
    },
    // 绘制环形图
    drawAnnulus (myData) {
      let rank = this.setSuffix(myData.month_rank);
      // 目标差值
      let diff = myData.month_sale_goal_num - myData.month_sale_num;
      this.circleLoding = false;
      this.annulus = echarts.init(this.$refs.circleBox, null, {
        renderer: 'svg'
      });
      this.annulus.setOption({
        color: ['#4285F4', '#CCD8F0'],
        graphic: [
          {
            // 环形图中间添加文字
            type: 'text', // 通过不同top值可以设置上下显示
            left: 'center',
            top: '30%', // 相对于画布的顶部
            style: {
              text: '本月业绩',
              textAlign: 'center',
              fill: '#000000', // 文字的颜色
              fontSize: 10
            }
          },
          {
            type: 'text',
            left: 'center',
            top: '45%',
            style: {
              text: myData.month_sale_num, // 中间
              textAlign: 'center',
              fill: '#333333', // 文字的颜色
              fontSize: 16
            }
          },
          {
            type: 'text',
            left: 'center',
            top: '65%',
            style: {
              text: rank, // 底部
              textAlign: 'center',
              fill: '#4EB75A', // 文字的颜色
              fontSize: 10
            }
          }
        ],
        series: [
          {
            type: 'pie',
            radius: ['70%', '95%'],
            center: ['50%', '50%'], // 饼图的圆心坐标
            avoidLabelOverlap: false, // 强制所有标签放在中心位置，
            hoverAnimation: false, // 关闭hover 时图形放大，
            //  label: { normal: { show: true, position: 'inner' }},//扇形图内部显示文字
            labelLine: {
              normal: {
                show: false // 关闭视觉引导线
              }
            },
            data: [
              {
                value: myData.month_sale_num,
                label: {
                  normal: {
                    show: false
                  }
                }
              },
              {
                value: diff > 0 ? diff : 0,
                label: {
                  normal: {
                    show: false
                  }
                }
              }
            ]
          }
        ]
      });
    },
    // 绘制柱状图
    drawBar (data) {
      let xData = [];
      let yData = [];
      data.forEach((item, index) => {
        let nameArr = item.sale_date.split('-');
        let name = `${nameArr[1]}-${nameArr[2]}`;
        let color = '#4285F4';
        if (item.sale_num === 0) {
          color = '#cccccc';
        }
        xData.push(name);
        if (item.sale_num !== -1) {
          yData.push({
            value: item.sale_num,
            itemStyle: {
              color: color
            }
          });
        }
      });
      this.topBarLoading = false;
      this.histogram = echarts.init(this.$refs.histogramBox, null, {
        renderer: 'svg'
      });
      this.histogram.setOption({
        itemStyle: {
          barBorderRadius: [5, 5, 0, 0] // （顺时针左上，右上，右下，左下）//设置圆角
        },
        xAxis: {
          // axisLabel:坐标轴刻度标签的相关设置。
          axisLabel: {
            color: '#A0A0A0',
            fontSize: 10,
            interval: 0
          },
          // 坐标轴刻度相关设置。
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          nameTextStyle: {
            fontSize: 10
          },
          type: 'category',
          data: xData
        },
        yAxis: {
          position: 'left',
          type: 'value',
          show: false,
          max: 'dataMax'
        },
        series: [
          {
            type: 'bar',
            barMinHeight: 15,
            label: {
              normal: {
                show: true,
                position: 'insideTop',
                color: '#ffffff'
              }
            },
            data: yData
          }
        ]
      });
    },
    // 绘制横向柱状图
    drawPieLeng (data) {
      let xName = [];
      let yData = [];
      let count = this.getSum(data);
      let dataMax = Math.max.apply(
        Math,
        data.map(item => {
          return item.leaseNum;
        })
      );
      data.forEach(item => {
        xName.push(item.name);
        yData.push({
          value: item.leaseNum,
          count: count
        });
      });
      this.pieLeng = echarts.init(this.$refs.pieLeng, null, {
        renderer: 'svg'
      });

      this.pieLeng.setOption({
        grid: {
          // 设置图表位置
          left: '3%',
          right: '1%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {
          // axisLabel:坐标轴刻度标签的相关设置。
          inverse: true, // 反向排序
          axisLabel: {
            color: '#000000',
            fontSize: 12,
            interval: 0 // 解决类目轴显示不全
          },
          // 坐标轴刻度相关设置。
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          type: 'category',
          data: xName
        },
        xAxis: {
          type: 'value',
          show: false,
          max: dataMax * 0.7 + dataMax // 设置最大值解决长度溢出问题
        },
        series: [
          {
            type: 'bar',
            barWidth: 13, // 设置柱子宽度
            itemStyle: {
              normal: {
                color: function (item) {
                  //  传入的是数据项 seriesIndex, dataIndex, data, value 等各个参数。
                  // dataIndex 数据下表
                  let opacity = 1 - item.dataIndex * 0.1;
                  return `rgb(67, 134,244,${opacity})`;
                }
              }
            },
            emphasis: {
              itemStyle: {
                // 高亮时的颜色。
                color: 'rgb(67, 134,244)'
              }
            },
            label: {
              position: 'right',
              show: true,
              color: '#333333',
              formatter: function (params) {
                let progress = (
                  (params.data.value / params.data.count) *
                  100
                ).toFixed(1);
                return `${params.data.value}(${progress}%)`;
              }
            },
            data: yData
          }
        ]
      });
    },
    // 求和
    getSum (arr) {
      if (!arr || arr.length === 0) return 0;
      let sum = 0;
      arr.forEach(item => {
        sum += item.leaseNum;
      });
      return sum;
    },
    // 判断 目标是否达成
    calcTagert (current, plan) {
      let str = '';
      let minus = current - plan;
      if (minus > 0) {
        str = `超${minus}间`;
      } else {
        str = `差${Math.abs(minus)}间`;
      }
      return str;
    },
    // 计算考核时间
    assesTime () {
      // 获取当前时间
      let start = moment();
      // 获取需要对比的时间
      let endTime = moment().endOf('month'); // 以是 年月的格式 也可以是年月日的格式
      let day = endTime.diff(start, 'day');
      if (day < 0) {
        return 0;
      } else {
        return day;
      }
    },
    // 设置排名后缀
    setSuffix (rank) {
      let suffix;
      if (rank > 3) {
        suffix = 'th';
      } else if (rank === 3) {
        suffix = 'rd';
      } else if (rank === 2) {
        suffix = 'nd';
      } else if (rank === 1) {
        suffix = 'td';
      }
      return rank + suffix;
    }
  },
  watch: {
    // 监听用户信息的变化，存入缓存
    AllDatas: {
      handler: function (newVal, oldVal) {
        this.$store.commit('sales/setUserMsg', newVal);
      },
      deep: true
    }
  }
};
</script>
<style lang="less" scoped>
// 环形图和业绩数据看板
.circularWrap {
  width: 100%;
  display: flex;
  align-items: stretch;
  padding: 10px 20px 0 20px;
  .circleBox {
    flex: 4;
    height: 100px;
    position: relative;
  }
  .rightMsg {
    flex: 6;
    display: flex;
    flex-direction: column;
    text-align: right;
    .rank {
      color: #cccccc;
      margin-top: 10px;
    }
    .fontWight {
      margin-top: 10px;
      color: #000000;
    }
    .green {
      color: #4eb75a;
      padding: 0 5px;
    }
    .timeHint {
      margin-top: 15px;
      color: #797979;
      font-size: 14px;
    }
  }
}
.histogramBox {
  width: 100%;
  height: 180px;
  margin-top: -40px;
  position: relative;
}
.textHint {
  width: 100%;
  margin-top: -25px;
  border-top: solid #cccccc 1px;
  padding-bottom: 10px;
}
// 横向柱状图
.visitorBox {
  .customer_bar {
    width: 100%;
    height: 220px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    .pieLeng {
      width: 100%;
      height: 260px;
      margin-top: -35px;
    }
  }
}
// 滑屏组件
.swperBox {
  padding: 0;
}
</style>
