<template>
  <section class="v_page">
    <!-- 顶部导航条 -->
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000">
      <mu-button icon slot="left" @click="goBack">
        <mu-icon value="arrow_back"></mu-icon>
      </mu-button>驳回详情
    </mu-appbar>
    <!-- 主内容区 -->
    <!-- --notice -->
    <div class="v_mainContainer skipRem" v-loading="subMitLoading">
      <!-- 工单归属房源 -->
      <mu-paper :z-depth="1" class="v_block" v-if="costParam">
        <div class="order-title v_ellipsis">{{costParam.houseName}}</div>
        <div class="order-content">
          <div class="order-msg">
            <div class="name">{{costParam.roomName}}-{{costParam.bigName}}-{{costParam.smallName}}</div>
            <div class="start-time">报修时间：{{costParam.startTime?Moment(costParam.startTime).format('YYYY-MM-DD'):'--'}}</div>
          </div>
          <div class="right-price">￥{{total}}</div>
        </div>
      </mu-paper>
      <!-- 驳回费用列表 -->
      <mu-paper
        class="reject-cost-item"
        :z-depth="1"
        v-for="(item,index) in listData"
        :key="index+'i'"
        v-show="item.type!=2"
      >
        <div class="cost-msg">
          <div class="left-msg">
            <div class="cost-name">{{item.costType===1?'材料费用':'人工费用'}}</div>
            <div class="start-time">{{item.costTime}}</div>
            <div class="cost-cause item-line">{{item.descs}}</div>
            <div class="reject-cause red item-line">{{item.other}}</div>
          </div>
          <div class="right-msg">
            <span class="price">￥{{formatMoney(item.cost)}}</span>
            <mu-button icon small class="border" color="primary" @click="lookHand(0,item.file)">
              <mu-icon :size="20" value="photo_size_select_actual"></mu-icon>
            </mu-button>
          </div>
        </div>
        <div class="footer-btn">
          <mu-button flat small color="primary" @click="editCost(index)">修改</mu-button>
          <mu-button flat small color="primary" @click="deleteCost(index,item)">删除</mu-button>
        </div>
      </mu-paper>
    </div>
    <!-- 底部按钮 -->
    <mu-paper class="footer_bar skipRem" :z-depth="4" v-show="!resizeChange">
      <mu-button
      v-if="listData.length>0"
        color="#fdd835"
        :disabled="submitLoading"
        full-width
        textColor="#333333"
        @click="submitAll"
      >提交处理结果</mu-button>
    </mu-paper>
    <!-- 编辑费用弹框 -->
    <mu-dialog title="修改费用" width="80%" :overlay-close='false' :open.sync="openEdit">
      <mu-text-field
        label="新费用"
        full-width
        label-float
        v-model="newCost"
        pattern="[0-9]*"
        type="number"
      ></mu-text-field>
      <mu-button slot="actions" flat color="primary" @click="closeEdit">取消</mu-button>
      <mu-button slot="actions" flat color="primary" @click="confirmEdit">完成</mu-button>
    </mu-dialog>
    <!-- 提交完成弹框 -->
    <mu-dialog width="80%" :open.sync="finshModel" :overlay-close="false">
      <div class="finsh-container center">
        <img :src="finshImage" alt />
        <span class="finsh-hit">重新提交成功</span>
      </div>
      <mu-button slot="actions" flat color="primary" @click="goBack">好的</mu-button>
    </mu-dialog>
  </section>
</template>
<script>
import { queryRejectCost, rejectCostUpdate } from '@/api/maintainApi';
import Moment from 'moment';

export default {
  data () {
    return {
      subMitLoading: false,
      openEdit: false,
      submitLoading: false,
      costParam: null,
      newCost: '', // 编辑的输入的·数字
      editIndex: undefined,
      viewBox: null,
      finshImage: require('@/assets/images/finsh_1228.svg'),
      finshModel: false,
      orderId: '',
      listData: []
    };
  },
  computed: {
    total () {
      let sum = 0;
      this.listData.forEach(item => {
        sum += item.cost;
      });
      return this.formatMoney(sum);
    },
    resizeChange () {
      return this.$store.state.reiseChange;
    }
  },
  created () {
    this.orderId = this.$route.query.orderId;
    this.costParam = this.$store.state.maintain.editReiectCost;
    this.getListData(this.orderId);
  },
  methods: {
    Moment,
    // 返回上一级
    goBack () {
      this.$router.go(-1);
      this.finshModel = false;
    },
    // 获取费用列表
    getListData (orderId) {
      this.subMitLoading = true;
      queryRejectCost(orderId).then(({ data }) => {
        this.subMitLoading = false;
        this.listData = this.setType(data) || [];
      });
    },
    // 打开编辑窗口 / 修改费用
    editCost (index) {
      this.editIndex = index;
      this.openEdit = true;
    },
    // 关闭编辑窗口
    closeEdit () {
      this.openEdit = false;
      this.editIndex = undefined;
      this.newCost = '';
    },
    // 保存编辑数据
    confirmEdit () {
      if (!this.newCost) {
        this.$toast.error('费用值不能为空或者为0');
      } else {
        this.listData[this.editIndex].cost = (+this.newCost) * 1000;
        this.listData[this.editIndex].type = 1; // 1修改 2，删除 ，3 未调整
        this.closeEdit();
      }
    },
    // 删除 费用
    deleteCost (index, item) {
      let money = this.formatMoney(item.cost);
      let status = item.costType === 1 ? '材料费用 ' : '人工费用 ';
      this.$alert(status + money, '确认删除费用?', {
        okLabel: '确认'
      }).then(() => {
        this.listData[index].type = 2; // 修改 2，删除 ，3 未调整
      });
    },
    // 重新提价
    submitAll () {
      this.subMitLoading = true;
      rejectCostUpdate(this.listData).then(res => {
        this.subMitLoading = false;
        this.finshModel = true;
        this.getListData(this.orderId);
      });
    },
    // 金额计算,保留两位小数
    formatMoney (value) {
      let rmb = (+value / 1000).toString();
      let rmbArr = rmb.split('.');
      let firstNumber = 0;
      let secondNumber = 0;
      if (rmbArr[1]) {
        firstNumber = rmbArr[1][0];
        secondNumber = rmbArr[1][1] || 0;
      }
      return rmbArr[0] + '.' + firstNumber + secondNumber;
    },
    // 图片预览
    lookHand (index, arr) {
      if (!arr) {
        this.$toast.warning('该项费用暂未添加照片');
        return;
      };
      let list = [];
      arr.forEach(item => {
        if (item.visitPath) {
          list.push(item.visitPath);
        }
      });
      if (list.length === 0) return;
      this.viewBox = this.$Prive({
        imgList: list,
        current: index
      });
    },
    // 设置调整状态
    setType (arr) {
      if (!arr) return [];
      return arr.map(item => {
        item.type = 3;
        return item;
      });
    }
  },
  beforeDestroy () {
    if (this.viewBox) this.viewBox.close();
  }
};
</script>
<style lang="less" scoped>
.v_mainContainer {
  &.skipRem {
    height: calc(100% - 110px);
  }
}
.v_block {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.order-title {
  width: 100%;
  padding: 8px 15px;
  font-size: 16px;
  font-weight: bold;
  background: #4f4f4f;
  color: #ffffff;
}
.order-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 30px;
  .order-msg {
    flex: 1;
    .name {
      font-size: 16px;
      font-weight: bold;
    }
    .start-time {
      margin-top: 5px;
      font-size: 12px;
    }
  }
  .right-price {
    font-size: 18px;
  }
}
.reject-cost-item {
  margin-top: 5px;
  .cost-msg {
    padding: 15px 25px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left-msg {
      flex: 1;
    }
    .right-msg {
      display: flex;
      align-items: center;
      .price {
        margin: 10px;
        font-size: 18px;
      }
    }
  }
  .cost-name {
    font-size: 16px;
    font-weight: bold;
  }
}
.reject-cost-item:last-child {
  margin-bottom: 20px;
}
.footer-btn {
  border-top: solid 1px #adadad;
  padding: 10px 15px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.cost-cause,
.start-time {
  color: #a0a0aa;
}
.border {
  border: solid 1px #afafaf;
}
.item-line {
  margin-top: 3px;
}
.red {
  color: #ff0202;
}
.finsh-container {
  flex-direction: column;
  .finsh-hit {
    margin-top: 15px;
  }
}
/deep/.mu-flat-button {
  min-width: 55px;
}
</style>
