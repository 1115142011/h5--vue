<template>
  <div class="finsh_box">
    <div class="content_box">
      <!-- 变更的租客信息 -->
      <mu-paper :z-depth="1" class="finsh_card">
        <div class="status_msg">转租完成</div>
        <div class="border_box">租客变更</div>
        <!-- 原租客 -->
        <div class="item topSpace">
          <span class="leftText v_ellipsis">原租客</span>
          <span class="rightText v_ellipsis">张先生</span>
        </div>
        <div class="item">
          <span class="leftText v_ellipsis"></span>
          <span class="rightText v_ellipsis">187800512354</span>
        </div>
        <div class="item">
          <span class="leftText v_ellipsis"></span>
          <span class="rightText v_ellipsis">513124188513222798</span>
        </div>
        <!-- 新租客 -->
        <div class="item topSpace">
          <span class="leftText v_ellipsis">新租客</span>
          <span class="rightText v_ellipsis">齐老板</span>
        </div>
        <div class="item">
          <span class="leftText v_ellipsis"></span>
          <span class="rightText v_ellipsis">187800512354</span>
        </div>
        <div class="item">
          <span class="leftText v_ellipsis"></span>
          <span class="rightText v_ellipsis">513124188513222798</span>
        </div>
      </mu-paper>
      <!-- 退租的租约信息 -->
      <mu-paper class="container" :z-depth="1">
        <div class="title">
          <span class="tag">退租</span>
          <span>红树湾1-1-204-A主卫</span>
        </div>
        <!-- 退组人 -->
        <div class="item">
          <span class="leftText v_ellipsis">姓名</span>
          <span class="rightText v_ellipsis">齐先生</span>
        </div>
        <!-- 身份证 -->
        <div class="item">
          <span class="leftText v_ellipsis">身份证号</span>
          <span class="rightText v_ellipsis">200</span>
        </div>
        <!-- 手机 -->
        <div class="item">
          <span class="leftText v_ellipsis">手机号</span>
          <span class="rightText v_ellipsis">18705564852</span>
        </div>
        <!-- 状态 -->
        <div class="item">
          <span class="leftText v_ellipsis">状态</span>
          <span class="rightText v_ellipsis orange">结算中</span>
        </div>
        <!-- 退租时间 -->
        <div class="item topSpace">
          <span class="leftText v_ellipsis">退租时间</span>
          <span class="rightText v_ellipsis">2019.10.11</span>
        </div>
        <!-- 结算方式 -->
        <div class="item">
          <span class="leftText v_ellipsis">结算方式</span>
          <span class="rightText v_ellipsis">银行卡</span>
        </div>
        <!-- 结算金额 -->
        <div class="item">
          <span class="leftText v_ellipsis">结算金额</span>
          <span class="rightText v_ellipsis green">（收）1500</span>
        </div>
      </mu-paper>
      <!-- 新租租约信息 -->
      <mu-paper :z-depth="1" class="newLease_box">
        <div class="title blue">
          <span class="tag">新租</span>
          <span>红树湾1-1-204-A主卫</span>
        </div>
        <div class="msg_container">
          <div class="item">
            <span class="leftText v_ellipsis">签约销售</span>
            <span class="rightText v_ellipsis">{{myData.saler}}</span>
          </div>
          <div class="item">
            <span class="leftText v_ellipsis">租客姓名</span>
            <span class="rightText v_ellipsis">{{myData.customer.name}}</span>
          </div>
          <div class="item">
            <span class="leftText v_ellipsis">身份证号</span>
            <span class="rightText v_ellipsis">{{myData.customer.idCard}}</span>
          </div>
          <div class="item">
            <span class="leftText v_ellipsis">手机号</span>
            <span class="rightText v_ellipsis">{{myData.customer.mobile}}</span>
          </div>
          <div class="item">
            <span class="leftText v_ellipsis">起止时间</span>
            <span class="rightText v_ellipsis">{{myData.begin_date+'~'+myData.end_date}}</span>
          </div>
          <div class="item">
            <span class="leftText v_ellipsis">状态</span>
            <span class="rightText v_ellipsis">--</span>
          </div>
          <div class="item topSpace">
            <span class="leftText v_ellipsis">付款方式</span>
            <span class="rightText v_ellipsis">--</span>
          </div>
          <div class="item">
            <span class="leftText v_ellipsis">房租</span>
            <span class="rightText v_ellipsis">{{myData.rent}}元/月</span>
          </div>
          <div class="item">
            <span class="leftText v_ellipsis">房屋押金</span>
            <span class="rightText v_ellipsis">{{myData.deposit}}元</span>
          </div>
          <div class="item">
            <span class="leftText v_ellipsis">钥匙&门卡押金</span>
            <span class="rightText v_ellipsis">{{myData.card_deposit}}元</span>
          </div>
          <div class="item">
            <span class="leftText v_ellipsis">其它押金</span>
            <span class="rightText v_ellipsis">{{myData.other_deposit}}元</span>
          </div>
          <!-- 优惠信息 -->
          <div class="discount_box">
            <div class="category_title">优惠信息</div>
            <div class="item">
              <span class="leftText v_ellipsis">--</span>
              <span class="rightText v_ellipsis">--</span>
            </div>
          </div>
          <!-- 费用信息 -->
          <div class="cost_box">
            <div class="category_title">费用信息</div>
            <div class="item">
              <span class="leftText v_ellipsis">--</span>
              <span class="rightText v_ellipsis">--</span>
            </div>
          </div>
        </div>
      </mu-paper>
    </div>
    <!-- 底部按钮 -->
    <mu-paper class="btn" :z-depth="4">
      <mu-button color="#fdd835" textColor="#333333" @click="toHomeList">返回列表</mu-button>
    </mu-paper>
  </div>
</template>
<script>
export default {
  data () {
    return {
      codeImg: require('@/assets/images/xscode.jpg'),
      myData: {
        roomInfo: {
          code: 'C',
          name: '次卧',
          area: '0',
          direction: '',
          status: 1,
          image: null,
          rentMode: 1,
          room_id: 120821,
          full_name: '领馆区1号1-1-1901-C次卧',
          sale_price: 550,
          status_name: '已出租',
          last_used_time: null,
          house_info: {
            code: 'X100173',
            name: '领馆区1号1-1-1901',
            layout: '5室1厅2卫',
            community: {
              name: '领馆区1号',
              id: 58,
              district: { id: 10655, name: '高新区' },
              community_id: null,
              area_name: '高新区'
            },
            houseCosts: null,
            house_id: 17597,
            owner_name: null,
            expire_date: '2020-11-30',
            sale_name: '白宇豪',
            sale_id: 1503618378416128,
            team_name: '曾曦(小组)',
            team_id: 1390784535363584,
            manager_name: '梁枘钦',
            house_cost: null
          },
          lease_info: null,
          image_flag: 0
        },
        type: 0,
        customer: {
          name: '王鹏',
          mobile: '18428312063',
          idCard: '511323198810090019',
          cust_id: 18805
        },
        rent: 520,
        deposit: 400,
        bond: null,
        saler: '系统管理员',
        team: null,
        lease_id: 2030,
        rent_mode: 1,
        cust_source: 8,
        sign_channel: 1,
        sign_time: '2018-12-12',
        begin_date: '2018-12-15',
        end_date: '2019-12-14',
        pay_mode: 2,
        next_pay_date: '2019-04-07',
        bill_period_num: null,
        card_deposit: 50,
        other_deposit: 0,
        first_pay_time: null,
        level_1_benefit: null,
        level_2_benefit: null,
        lease_costs: [
          { name: '物管费', type: 1, cost: 60, recv_mode: 1 },
          { name: '垃圾费', type: 2, cost: 0, recv_mode: 1 },
          { name: '宽带费', type: 3, cost: 30, recv_mode: 1 },
          { name: '清洁费', type: 4, cost: 30, recv_mode: 1 },
          { name: '水费', type: 5, cost: 0, recv_mode: 2 },
          { name: '电费', type: 6, cost: 0, recv_mode: 1 },
          { name: '气费', type: 7, cost: 0, recv_mode: 3 }
        ],
        saler_id: 1,
        team_id: null
      }
    };
  },
  methods: {
    // 按钮点击
    toHomeList () {
      this.$store.commit('change_Action', 'pop');
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less" scoped>
.finsh_box {
  .content_box {
    .finsh_card {
      padding: 10px;
      padding-bottom: 20px;
      margin-top: 10px;
      border-radius: 10px;
      .status_msg {
        height: 70px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #5677fc;
        font-size: 18px;
        font-weight: 600;
      }
      .border_box {
        padding: 8px 0;
        border-bottom: 1px #cccccc solid;
      }
    }
    // 退租的租约状态
    .container {
      padding: 0;
      padding-bottom: 20px;
      border-radius: 10px;
      overflow: hidden;
      margin-top: 10px;
    }
    .newLease_box {
      padding: 0;
      padding-bottom: 20px;
      border-radius: 10px;
      overflow: hidden;
      margin-top: 10px;
      .category_title {
        padding-left: 20px;
        margin-top: 10px;
      }
    }
  }
}
// 租约状态标题
.title {
  display: flex;
  align-items: center;
  color: #ffffff;
  background: #b383e2;
  font-size: 16px;
  padding: 10px;
  .tag {
    font-size: 12px;
    height: 32px;
    line-height: 32px;
    padding: 0 10px;
    border-radius: 16px;
    background: rgba(120, 120, 120, 0.3);
    margin-right: 10px;
  }
}
// 列表布局
.item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  padding: 0 30px;
  &.topSpace {
    margin-top: 10px;
  }
  .leftText {
    flex: 3;
    font-size: 14px;
    color: #000000;
    font-weight: 600;
  }
  .rightText {
    flex: 7;
    font-size: 12px;
    text-align: right;
  }
}
// 颜色
.orange {
  color: #f57f17;
  font-weight: 800;
}
.green {
  color: green;
  font-weight: 800;
}
.blue {
  background: #5677fc;
}
// 底部导航按钮
.btn {
  width: 100%;
  padding: 10px;
  text-align: right;
  left: 0;
  position: fixed;
  bottom: 0;
  & .leftBtn {
    margin-right: 10px;
  }
}
</style>
