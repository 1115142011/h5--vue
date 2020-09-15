<template>
  <section class="list_box">
    <mu-paper class="item_box" :z-depth="1" v-for="(item,index) in myList" :key="'item'+index">
      <div
        class="lease_title"
        :style="{backgroundColor:item.bg}"
        @click="goDetail(item.roomInfo.room_id)"
      >
        <div class="status circle">{{item.desc}}</div>
        <div class="room_name">{{item.houseName +"-"+item.roomInfo.code+item.roomInfo.name}}</div>
      </div>
      <div class="lease_content">
        <div class="left_text">
          <div class="item">
            <span class="leftText v_ellipsis">姓名</span>
            <span class="rightText v_ellipsis">{{item.customer.name}}</span>
          </div>
          <!-- 退租 -->
          <div class="item">
            <span class="leftText v_ellipsis">结算金额</span>
            <span class="rightText v_ellipsis green" v-if="item.money>=0">(收){{item.money}}</span>
            <span class="rightText v_ellipsis orange" v-if="item.money<0">(支){{Math.abs(item.money)}}</span>
          </div>
          <div class="item">
            <span class="leftText v_ellipsis">退租时间</span>
            <span class="rightText v_ellipsis">{{item.checkoutTime}}</span>
          </div>
          <!-- 驳回 -->
          <div v-if="item.status===3">
            <div class="item">
              <span class="leftText v_ellipsis">驳回人</span>
              <span class="rightText v_ellipsis">{{item.auditer}}</span>
            </div>
            <div class="item cause">
              <span class="leftText v_ellipsis">驳回原因:</span>
              <span class="rightText red">{{item.reason}}</span>
            </div>
            <div class="item">
              <span class="leftText v_ellipsis">驳回时间</span>
              <span class="rightText v_ellipsis">2019.12.25</span>
            </div>
          </div>
          <!-- 状态 -->
          <div class="item">
            <span class="leftText v_ellipsis">状态</span>
            <span
              class="rightText v_ellipsis"
              v-if="!item.hintStatue"
              :style="{color:item.bg}"
            >{{item.statusName}}</span>
            <span class="rightText v_ellipsis red" v-if="item.hintStatue">{{item.hint}}</span>
          </div>
        </div>
        <div class="right_btn">
          <mu-button
            class="btn"
            color="error"
            @click="againSign(item)"
            v-if="item.status===3"
          >重新发起</mu-button>
          <mu-button
            :href="'tel:'+item.customer.mobile"
            class="btn"
            textColor="#424242"
            color="warning"
          >联系租客</mu-button>
        </div>
      </div>

      <!-- <div class="footer_tag">
        <span class="tag_item">我的签约</span>
        <span class="tag_item">责任租约</span>
        <span class="tag_item">我的签约</span>
        <span class="tag_item">责任租约</span>
      </div> -->
    </mu-paper>
  </section>
</template>
<script>
import { cancelReservOrder } from '@/api/salesApi';

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
    // 取消预定
    cancleReserve (leaseid, index) {
      this.$confirm('确认将租约作废？', '提示').then(val => {
        if (val.result) {
          cancelReservOrder(leaseid).then(res => {
            this.listData.splice(index, 1);
          });
        }
      });
    },
    // 再次发起
    againSign (item) {
      localStorage.setItem('outTime', item.checkoutTime);
      this.$store.commit('sales/setOrderFlowName', item.houseName);
      this.$router.push({
        path: '/sales/orderFlow/quitLease',
        query: {
          type: 3,
          id: item.leaseId,
          isAgan: 1
        }
      });
    },
    // 设置标题背景颜色
    setItemData (arr) {
      let tempArr = [];
      arr.forEach(item => {
        item.duty = this.showDutyTag(item.team_id);
        item.owen = this.showSelfTag(item.saler_id);
        switch (item.status) {
          case 3: // 驳回
            item.bg = 'red';
            item.desc = '驳';
            break;
          case 2: // 审核
            item.bg = '#4CB58F';
            item.desc = '结';
            break;
          case 1:
          case 6: // 办理中 蓝色
            item.desc = '审';
            item.bg = '#5677FC';
            break;
          default:
            item.desc = '未知';
            item.bg = '#777777';
            break;
        }
        tempArr.push(item);
      });
      return tempArr;
    },
    // 跳转详情页
    goDetail (item) {
      //  let type =  item.roomInfo.code.toLowerCase()
      // this.$store.commit('change_Action', 'push');
      // this.$store.commit('sales/setRoomDetailCurrentTab', 2);
      // this.$router.push({
      //   path: '/sales/RoomDetails',
      //   query: {
      //     roomid: item
      //   }
      // });
    },
    // 计算是否为责任租约，
    showDutyTag (leaseTeamid) {
      let teamid = Number(localStorage.getItem('team_id'));
      return leaseTeamid === teamid;
    },
    // 计算是否我的签约
    showSelfTag (sealerId) {
      let personId = Number(localStorage.getItem('personId'));
      return personId === sealerId;
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
    border-radius: 8px;
    padding-bottom: 15px;
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
        .cause.item {
          justify-content: space-between;
          align-items: flex-start;
        }
      }
      .right_btn {
        flex: 2;
        display: flex;
        flex-direction: column;
        .btn {
          margin: 5px 0;
        }
      }
    }
    .footer_tag {
      width: 100%;
      padding: 0 15px 10px;
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
  .green {
    color: rgb(76, 181, 143);
  }
  .orange {
    color: #d87500;
  }
}
</style>
