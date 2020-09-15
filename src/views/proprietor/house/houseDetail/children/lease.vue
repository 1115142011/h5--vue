<template>
  <section class="list_box">
    <mu-paper class="item_box" :z-depth="1" v-for="(item,index) in myList" :key="'item'+index">
      <div class="lease_title" :style="{backgroundColor:item.bg}" @click="goDetail(item)">
        <div class="status circle">{{item.desc}}</div>
        <div class="room_name">{{item.roomInfo.full_name}}</div>
      </div>
      <div class="lease_content">
        <div class="left_text">
          <div class="item">
            <span class="leftText v_ellipsis">租客</span>
            <span class="rightText v_ellipsis">{{item.customer.name}}</span>
          </div>
          <!-- 办理中 -  在租中 -->
          <div v-if="item.showType===2">
            <div class="item">
              <span class="leftText v_ellipsis">租金</span>
              <span class="rightText v_ellipsis">{{item.rent}}元/月</span>
            </div>
            <div class="item">
              <span class="leftText v_ellipsis">租期时间</span>
              <span class="rightText v_ellipsis">{{item.begin_date+'/'+item.end_date}}</span>
            </div>
            <div class="item" v-if="item.status===7">
              <span class="leftText v_ellipsis">距离失效</span>
              <span class="rightText v_ellipsis">{{residueTime(item.next_pay_date)}}</span>
            </div>
          </div>
          <!-- 失效 -->
          <div v-if="item.showType===4">
            <div class="item">
              <span class="leftText v_ellipsis">租金</span>
              <span class="rightText v_ellipsis">{{item.rent}}元/月</span>
            </div>
            <div class="item">
              <span class="leftText v_ellipsis">签约时间</span>
              <span class="rightText v_ellipsis">{{item.begin_date}}</span>
            </div>
            <div class="item">
              <span class="leftText v_ellipsis">退租时间</span>
              <span class="rightText v_ellipsis">{{item.end_date}}</span>
            </div>
          </div>
          <!-- 状态 -->
          <div class="item">
            <span class="leftText v_ellipsis">状态</span>
            <span
              class="rightText v_ellipsis"
              :style="{color:item.bg}"
            >{{item.statusName}}</span>
          </div>
        </div>
      </div>
    </mu-paper>
  </section>
</template>
<script>
import Moment from 'moment'; // 时间处理插件
export default {
  props: {
    listData: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  computed: {
    myList () {
      return this.setItemData(this.listData);
    }
  },
  methods: {
    // 计算剩余时间
    residueTime (end) {
      let startTime = Moment();
      let endTime = Moment(end);
      let minuteCount = endTime.diff(startTime, 'minute'); // 计算相差的分钟数
      let hour = parseInt(minuteCount / 60);
      hour = hour > 0 ? hour + '小时' : '';
      let minute = minuteCount % 60;
      minute = minute > 0 ? minute + '分钟' : '00分钟';
      return hour + minute;
    },
    // 退租租约计算总价格
    countAllPrice (arr) {
      if (!arr || arr.length === 0) return 0;
      let total = 0;
      arr.forEach(item => {
        total += Number(item.money.toFixed(2));
      });
      total = total.toFixed(2);
      return total;
    },
    // 计算支付是否超期
    setNextPayTime (item) {
      if (!item.next_pay_date) return true;
      let now = Moment();
      let taget = Moment(item.next_pay_date + ' 23:59:59');
      let diffDays = Math.ceil(now.diff(taget, 'days', true));
      item.hint = `逾期 ${diffDays} 天未缴费`;
      item.hintStatue = diffDays > 0;
    },
    // 设定付款方式
    setPayModelName (status) {
      let name;
      switch (status) {
        case 1:
          name = '月付';
          break;
        case 2:
          name = '双月付';
          break;
        case 3:
          name = '季付';
          break;
        case 6:
          name = '半年付';
          break;
        case 12:
          name = '年付';
          break;
        case 24:
          name = '两年付';
          break;
        default:
          name = status + '个月付';
          break;
      }
      return name;
    },
    // 设置标题背景颜色
    setItemData (arr) {
      let tempArr = [];
      arr.forEach(item => {
        item.showType = this.getLeaseType(item.status);
        switch (item.status) {
          case 4: // 解约 紫色
          case 6: // 驳回
            item.bg = '#B383E2';
            item.desc = '退租';
            break;
          case 1: // 在租中 草青色
            item.bg = '#8BC34A';
            item.desc = '在租';
            this.setNextPayTime(item);
            break;
          case 3: // 续租 青色
            item.desc = '续租';
            item.bg = '#4CAEB5';
            break;
          case 0: // 未生效
            item.desc = '待用';
            item.bg = '#4CAEB5';
            break;
          case 7: // 办理中 蓝色
            item.desc = '办理';
            item.bg = '#5677FC';
            break;
          case 10: // 预定取消 灰色
          case 2: // 解约
            item.bg = '#797979';
            item.desc = '失效';
            break;
          case 8: // 预定 --绿色
          case 9:
            item.desc = '预定';
            item.bg = '#4CB58F';
            break;
          case 11: // 提前预定
          case 12: // 提前预定
            item.desc = '提前';
            item.bg = '#4CAEB5';
            break;
          default:
            break;
        }
        tempArr.push(item);
      });
      return tempArr;
    },
    // 根据租约状态设定显示类型
    getLeaseType (status) {
      let showType;
      switch (status) {
        case 9:
        case 8:
        case 3:
        case 0:
        case 11:
        case 12:
          showType = 1; // 预定状态
          break;
        case 7:
        case 5:
        case 1:
          showType = 2; // 办理/在租
          break;
        case 4:
        case 6:
          showType = 3; // 退租
          break;
        case 10:
        case 2:
          showType = 4; // 失效
          break;
        default:
          break;
      }
      return showType;
    },
    // 跳转详情页
    // goDetail (item) {
    //   if (item.showType === 4) return;
    //   if (item.status === 11 || item.status === 12) {
    //     this.$store.commit('sales/setRoomParams', item.roomInfo);
    //     this.$router.push({
    //       path: '/sales/PrepositionLease',
    //       query: {
    //         id: item.lease_id,
    //         handle: item.owen ? 1 : 0
    //       }
    //     });
    //   } else {
    //     this.$store.commit('sales/setRoomDetailCurrentTab', 1);
    //     this.$router.push({
    //       path: '/sales/RoomDetails',
    //       query: {
    //         roomid: item.roomInfo.room_id,
    //         houseId: item.roomInfo.house_info.house_id
    //       }
    //     });
    //   }
    // },
    // 计算是否为责任租约，
    showDutyTag (leaseTeamid) {
      let teamid = Number(localStorage.getItem('personId'));
      return leaseTeamid === teamid;
    },
    // 计算是否我的签约
    showSelfTag (sealerId) {
      let personId = Number(localStorage.getItem('personId'));
      return personId === sealerId;
    },
    // 跳转账单
    toLeaseBill (leaseid, electFlag) {
      this.$router.push({
        path: '/sales/leaseBill',
        query: {
          id: leaseid,
          type: electFlag
        }
      });
    },
    // 查看电子合同
    examineContract (data) {
      // 0纸质合同 1电子合同
      if (data.electFlag) {
        leaseContract(data.lease_id).then(res => {
          window.location.href = res.data.url;
          // this.$router.push({
          //   path: '/sales/Contract',
          //   params: {
          //     url: res.data.url
          //   }
          // });
        });
      } else {
        this.$toast.warning('该租约没有电子合同，如需查看请联系管理员！');
      }
    },
    // 设置电子合同与 账单权限
    setBtnShow (val) {
      let flag = true;
      switch (val) {
        case 8:
        case 9:
        case 10:
        case 11:
        case 12:
          flag = false;
          break;
        default:
          break;
      }
      return flag;
    }
  }
};
</script>
<style lang="less" scoped>
.list_box {
  width: 100%;
  padding-bottom: 10px;
  .item_box {
    margin-top: 10px;
    border-radius: 0;
    padding-bottom: 10px;
    overflow: hidden;
    .lease_title {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      line-height: 32px;
      padding: 5px 10px;
      color: #ffffff;
      .relation_tag {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .circle {
        padding: 0 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 12px;
        background: rgba(0, 0, 0, 0.12);
        border-radius: 16px;
        margin-right: 5px;
      }
      .room_name {
        flex: 5;
      }
    }
    .lease_content {
      padding: 15px;
      padding-bottom: 0;
      display: flex;
      justify-content: space-between;
      align-items: stretch;
      .left_text {
        flex: 8;
        margin-right: 8px;
        .item {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 5px 0;
          .leftText {
            flex: 3;
            font-size: 14px;
            color: #000000;
            font-weight: 600;
          }
          .rightText {
            flex: 7;
            font-size: 12px;
          }
        }
      }
      .right_btn {
        flex: 2;
        display: flex;
        flex-direction: column;
      }
    }
    .footer_tag {
      width: 92%;
      margin: 0 auto;
      padding: 10px;
      margin-top: 10px;
      border-top: solid 1px #efefef;
      display: flex;
      align-items: center;
      .tag_item {
        padding: 5px 8px;
        background: rgba(0, 0, 0, 0.1);
        font-size: 12px;
        margin-right: 5px;
        border-radius: 8px;
        color: #797979;
      }
    }
  }
  .red {
    color: red;
  }
}
.btn {
  margin: 5px 0;
}
.btn_border {
  border-radius: 20px;
  margin: 5px 0;
  overflow: hidden;
  border: solid 1px #e0e0e0;
  .btn {
    margin: 0;
  }
}
</style>
