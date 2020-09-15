<template>
  <div class="outerBox">
    <!-- 账单 -->
    <div class="bill">
      <mu-expansion-panel :expand.sync="pnaelOpen">
        <div slot="header" class="panel_title">
          <div class="title_tag">
            <span class="small_text">应收款</span>
          </div>
          <div class="title_text v_ellipsis">
            <span class="font_weight">系统</span>
            <span class="time_msg v_ellipsis">结算时间：2019.12.21</span>
          </div>
          <div class="right_price">￥950</div>
        </div>
        <div slot="default" class="panel_content">
          <div class="list_item">
            <div class="title_text v_ellipsis">
              <span class="font_weight listTitle">租客押金</span>
              <span class="time_msg v_ellipsis">结算时间：2019.12.21</span>
            </div>
            <div class="right_price listPrice">￥950</div>
          </div>
          <div class="list_item">
            <div class="title_text v_ellipsis">
              <span class="font_weight listTitle">租客押金</span>
              <span class="time_msg v_ellipsis">结算时间：2019.12.21</span>
            </div>
            <div class="right_price listPrice">￥950</div>
          </div>
        </div>
      </mu-expansion-panel>
    </div>
    <!-- 新添加的费用信息 -->
    <transition-group tag="div" name="list-fade">
      <mu-paper :z-depth="1" class="new_msg v_block" v-for="(item,index) in attachCost" :key="item">
        <div class="container">
          <div class="left_msg">
            <span class="msg_name">{{item.cost_name}}</span>
            <span class="msg_time">{{item.startTime}}-{{item.endTime}}</span>
            <span
              class="msg_type"
              :class="[item.payType===1?'green':'orange']"
            >{{item.payType===1?'应收':'应支'}}</span>
          </div>
          <div class="right_msg">￥{{item.cost}}</div>
        </div>
        <div class="delete_btn">
          <mu-button flat color="primary" @click="deleteAttachCost(index)">删除</mu-button>
        </div>
      </mu-paper>
    </transition-group>
    <!-- 添加费用操作入口 -->
    <mu-paper :z-depth="1" class="add_cost_box">
      <div class="add_cost_btn" @click="addCostOpen">
        <mu-ripple color="#448AFF">
          <span>添加费用+</span>
        </mu-ripple>
      </div>
      <!-- 添加的费用信息输入 -->
      <transition name="falls">
        <div class="cost_msg_box" v-show="addOpen">
          <div class="add_cost_msg">
            <mu-form ref="first_step" :model="formMsg" class="step_form">
              <mu-form-item label="费用类型" prop="name" :rules="nameRules">
                <mu-select chips v-model="formMsg.cost_name" full-width>
                  <mu-option
                    v-for="(item,index) in options2"
                    :key="index"
                    :label="item.lable"
                    :value="item.lable"
                    ripple
                  ></mu-option>
                </mu-select>
              </mu-form-item>
              <mu-form-item label="费用金额" label-float prop="cost" :rules="nameRules">
                <mu-text-field
                  v-model="formMsg.cost"
                  pattern="[0-9]*"
                  type="number"
                  full-width
                  prop="mobile"
                  @blur="showBtn=true"
                ></mu-text-field>
              </mu-form-item>
              <mu-form-item label="产生时间">
                <div class="timeBox">
                  <mu-date-input
                    v-model="formMsg.startTime"
                    action-icon="date_range"
                    no-display
                    value-format="YYYY-MM-DD"
                    full-width
                  ></mu-date-input>
                  <span class="cutOff">~</span>
                  <mu-date-input
                    v-model="formMsg.endTime"
                    action-icon="date_range"
                    label-float
                    value-format="YYYY-MM-DD"
                    no-display
                    full-width
                  ></mu-date-input>
                </div>
              </mu-form-item>
              <mu-form-item label="收/支" prop="payType" :rules="nameRules">
                <mu-select chips v-model="formMsg.payType" full-width>
                  <mu-option
                    v-for="(item,index) in payType"
                    :key="index"
                    :label="item.lable"
                    :value="item.value"
                    ripple
                  ></mu-option>
                </mu-select>
              </mu-form-item>
            </mu-form>
          </div>
          <div class="add_footer_btn">
            <mu-button textColor="#448AFF" flat small @click="closeAddOpen">取消</mu-button>
            <mu-button textColor="#448AFF" flat small @click="confimAdd">确定</mu-button>
          </div>
        </div>
      </transition>
    </mu-paper>
    <!-- 按钮 -->
    <mu-paper class="btn" :z-depth="4" v-show="showBtn">
      <div class="totalPrice">
        总计：
        <span :class="[true?'green':'orange']">（收）10000</span>
      </div>
      <div class="nav_btn">
        <mu-button textColor="#448AFF" small flat @click="changeStep('prev')" class="leftBtn">上一步</mu-button>
        <mu-button color="#fdd835" textColor="#333333" @click="quitConfirm">确认退租</mu-button>
      </div>
    </mu-paper>
  </div>
</template>
<script>
export default {
  data () {
    return {
      arr: [1, 1, 1, 1, 1, 1],
      pnaelOpen: true, // 系统账单展开状态
      addOpen: false, // 添加费用填写状态
      attachCost: [
        {
          cost_name: '损坏赔偿',
          cost: '10',
          startTime: '2019-11-12',
          endTime: '2019-11-15',
          payType: 1,
          show: true
        },
        {
          cost_name: '损坏赔偿',
          cost: '200',
          startTime: '2019-11-12',
          endTime: '2019-11-15',
          payType: 1,
          show: true
        },
        {
          cost_name: '损坏赔偿',
          cost: '300',
          startTime: '2019-11-12',
          endTime: '2019-11-15',
          payType: 1,
          show: true
        },
        {
          cost_name: '损坏赔偿',
          cost: '400',
          startTime: '2019-11-12',
          endTime: '2019-11-15',
          payType: 1,
          show: true
        }
      ], // 额外费用信息
      showBtn: true,
      //   费用类型选项参数
      options2: [
        // 租客来源参数
        {
          lable: '租客押金',
          value: 1
        },
        {
          lable: '损坏赔偿',
          value: 2
        },
        {
          lable: '违约金',
          value: 3
        }
      ],
      // 收/支选择
      payType: [
        {
          lable: '应收',
          value: 1
        },
        {
          lable: '应支',
          value: 2
        }
      ],
      nameRules: [
        { validate: val => !!val, message: '必须填写用户名' },
        { validate: val => val.length >= 3, message: '用户名长度大于2' }
      ],
      phoneNumber: [
        { validate: val => !!val, message: '必须填写电话号码' },
        {
          validate: val => /^1[3456789]\d{9}$/.test(val),
          message: '请填写正确的电话号码'
        }
      ],
      userCard: [
        {
          validate: val => /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val),
          message: '身份证号码不正确'
        }
      ],
      formMsg: {
        cost_name: '',
        cost: '',
        startTime: undefined,
        endTime: undefined,
        payType: ''
      }
    };
  },
  methods: {
    submit () {
      this.$refs.first_step.validate().then(result => {
        console.log('form valid: ', result);
      });
    },
    // 按钮点击
    changeStep (direction) {
      if (direction === 'next') {
        this.$emit('addStep');
      } else {
        this.$emit('minusStep');
      }
    },
    // 点击添加费用按钮
    addCostOpen () {
      this.addOpen = true;
    },
    // 添加费用取消
    closeAddOpen () {
      this.addOpen = false;
      this.formMsg = {
        cost_name: '',
        cost: '',
        startTime: undefined,
        endTime: undefined,
        payType: ''
      };
    },
    // 添加费用确认
    confimAdd () {
      this.addOpen = false;
      let obj = this.formMsg;
      obj.show = true;
      this.attachCost.push(obj);
      this.formMsg = {
        cost_name: '',
        cost: '',
        startTime: undefined,
        endTime: undefined,
        payType: ''
      };
    },
    // 删除额外的费用信息
    deleteAttachCost (index) {
      this.attachCost.splice(index, 1);
      // this.attachCost[index].show = false
      // item.show = false
    },
    // 退租确认
    quitConfirm () {
      this.$confirm('确认退租？').then(val => {
        if (val.result) {
          this.$emit('addStep');
        }
      });
    }
  },
  filters: {
    aaa (arr) {
      let tempArr = [];
      arr.forEach(item => {
        if (item.show) {
          tempArr.push(item);
        }
      });
      return tempArr;
    }
  }
};
</script>
<style lang="less">
// 重写弹框样式
.mu-flat-button {
  min-width: 50px;
  padding: 0;
  margin-right: 5px;
}
</style>
<style lang="less" scoped>
.outerBox {
  padding-bottom: 20px;
  margin-top: 10px;
}
.list_item,
.panel_title {
  width: 100%;
  display: flex;
  align-items: center;
  .title_tag {
    width: 45px;
    height: 45px;
    border-radius: 23px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: solid 2px #32ae7e;
    .small_text {
      font-size: 12px;
      line-height: 12px;
      color: #32ae7e;
      transform: scale(0.8);
    }
  }
  .title_text {
    height: 100%;
    flex: 8;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    .font_weight {
      font-size: 16px;
      color: #000000;
    }
    .time_msg {
      margin-top: 5px;
      font-size: 12px;
      color: #797979;
      transform: scale(0.8) translateX(-12%);
    }
  }
  .right_price {
    flex: 2;
    font-size: 18px;
    font-weight: 700;
    color: rgba(121, 121, 121, 0.651);
  }
  .listPrice {
    color: #000000;
    font-weight: 500;
  }
}
.list_item {
  padding: 10px 20px;
  border-top: solid 1px #cccccc;
}
//添加的信息展示
.new_msg {
  .container {
    padding: 20px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left_msg {
      display: flex;
      flex-direction: column;
      font-size: 16px;
      .msg_time {
        font-size: 12px;
        transform: scale(0.75) translateX(-16%);
      }
    }
    .right_msg {
      font-size: 18px;
    }
  }
  .delete_btn {
    border-top: solid 1px #cccccc;
    display: flex;
    justify-content: flex-end;
    padding: 5px 5px 0;
  }
}
// 添加费用操作
.add_cost_box {
  border-radius: 10px;
  margin-top: 10px;
  .add_cost_btn {
    position: relative;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #448aff;
  }
  .add_cost_msg {
    padding: 20px;
    border-top: 1px solid #cccccc;
    border-bottom: 1px solid #cccccc;
    .timeBox {
      width: 100%;
      display: flex;
      justify-content: space-between;
      & .cutOff {
        margin: 0 20px;
      }
    }
  }
  .add_footer_btn {
    display: flex;
    justify-content: flex-end;
    padding: 5px;
  }
}
.green {
  color: #32ae7e;
}
.orange {
  color: #d87500;
}
// 底部导航按钮
.btn {
  width: 100%;
  padding: 10px;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & .leftBtn {
    margin-right: 10px;
  }
}
// panel样式重写
/deep/.mu-expansion-panel {
  border-radius: 15px;
  overflow: hidden;
  .mu-expansion-panel-header {
    padding: 5px 20px;
  }
  .mu-expansion-panel-content {
    padding: 0 0 10px;
  }
}
// 表单样式重写
/deep/.mu-form-item {
  margin-bottom: 0;
}
//按钮样式重写
// input 字体调整
/deep/input {
  font-size: 12px;
}
</style>
