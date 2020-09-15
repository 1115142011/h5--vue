<template>
  <section class="cust_form" v-loading="submitLoading">
    <mu-paper class="v_block owner-msg" :z-depth="1">
      <mu-form ref="step_form" :model="formMsg" class="step_form">
        <mu-form-item prop="nameStr" :rules="msgRules">
          <div slot="label" class="title">业主信息</div>
          <mu-text-field :disabled="formDisable" v-model="formMsg.nameStr" @focus="openSearchModel" action-icon="search"></mu-text-field>
        </mu-form-item>
      </mu-form>
      <div class="ownerMsg" v-if="formMsg.currentOwner">
        <div class="line-item">
          <span class="left-msg">姓名</span>
          <span class="right-msg">{{formMsg.currentOwner.name}}</span>
        </div>
        <div class="line-item">
          <span class="left-msg">联系电话</span>
          <span class="right-msg">{{formMsg.currentOwner.mobile}}</span>
        </div>

        <div class="line-item">
          <span class="left-msg">身份证号</span>
          <span class="right-msg">{{formMsg.currentOwner.idCard}}</span>
        </div>
      </div>
    </mu-paper>

    <!-- 共有人信息展示 -->
    <transition-group tag="div" name="list-fade">
      <mu-paper
        :z-depth="1"
        class="new_msg v_block"
        v-for="(item, index) in formMsg.subPropList"
        :key="'item' + index"
      >
        <div class="container">
          <div class="partner-title">
            <mu-icon value="location_city" color="#1890FF"></mu-icon>
            <span class="thin-font">共有人 {{ index + 1 }}</span>
          </div>
          <div class="line-item">
            <span class="left-msg">姓名</span>
            <span class="right-msg">{{ item.name }}</span>
          </div>
          <div class="line-item">
            <span class="left-msg">联系电话</span>
            <span class="right-msg">{{ item.mobile }}</span>
          </div>

          <div class="line-item">
            <span class="left-msg">身份证号</span>
            <span class="right-msg">{{ item.idCard }}</span>
          </div>
        </div>
        <div class="delete_btn"  v-show="!formDisable">
          <mu-button flat small color="primary" @click="deletesubPropList(index)">删除</mu-button>
        </div>
      </mu-paper>
    </transition-group>
    <mu-paper :z-depth="1" class="add_cost_box" v-show="!formDisable">
      <div class="add_cost_btn" @click="addCostOpen">
        <mu-ripple color="#448AFF">
          <span>+添加共有人</span>
        </mu-ripple>
      </div>
      <!-- 共有人信息输入 -->
      <transition name="falls">
        <div class="cost_msg_box" v-show="addOpen">
          <div class="add_cost_msg">
            <mu-form ref="add_cost_form" :model="partner" class="form-box">
              <mu-form-item label="业主姓名" label-float prop="name" :rules="msgRules">
                <mu-text-field v-model="partner.name" prop="name"></mu-text-field>
              </mu-form-item>
              <mu-form-item label="联系电话" label-float prop="mobile" :rules="phoneNumber">
                <mu-text-field
                  v-model="partner.mobile"
                  pattern="[0-9]*"
                  type="number"
                  full-width
                  prop="mobile"
                ></mu-text-field>
              </mu-form-item>
              <mu-form-item label="身份证号" label-float prop="idCard" :rules="userCard">
                <mu-text-field v-model="partner.idCard" prop="idCard" full-width></mu-text-field>
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
      <mu-paper class="footer_bar skipRem" :z-depth="4" v-show="!resizeChange">
        <div class="left-btn">
          <mu-button color="#B3B3B3" full-width textColor="#ffffff" @click="goStep('prev')">上一步</mu-button>
        </div>
        <div class="right-btn">
          <mu-button color="#fdd835" full-width textColor="#333333" :disabled="submitLoading" @click="goStep('next')">{{ this.formMsg.submitType?'下一步':'提交信息'}}</mu-button>
        </div>
      </mu-paper>
    <search-user-model :queryApi="queryProprietor" :open.sync="serachHouse" @chooseChange="chooseChange"></search-user-model>
  </section>
</template>
<script>
import searchUserModel from '../children/searchUserModel';
import { submitBaseMsg } from '@/api/proprietorApi';
import { queryProprietor } from '@/api/globalApi';

export default {
  components: { searchUserModel },

  data () {
    return {
      submitLoading: false,
      serachHouse: false,
      activeStep: 0,
      currentOwner: undefined,
      msgRules: [{ validate: val => !!val, message: '请填写该信息' }],
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
        nameStr: '',
        propId: undefined, // 业主id
        subPropList: [], // 共有人列表
        currentOwner: undefined
      },
      partner: {
        name: '',
        mobile: '',
        idCard: ''
      },
      addOpen: false // 共有人状态
    };
  },
  created () {
    this.formMsg = Object.assign(
      this.formMsg,
      JSON.parse(JSON.stringify(this.$store.state.proprietor.formParams))
    );
  },
  computed: {
    resizeChange () {
      return this.$store.state.reiseChange;
    },
    formDisable () {
      return this.formMsg.submitType;
    }
  },
  methods: {
    queryProprietor,
    // 禁止输入框获取焦点
    openSearchModel (e) {
      e.target.blur();
      this.serachHouse = true;
    },
    // 业主信息改变
    chooseChange (param) {
      this.formMsg.currentOwner = param;
      this.formMsg.nameStr = param.name;
      this.formMsg.propId = param.propId;
    },
    // 底部按钮点击
    goStep (direction, stepNumber = 1) {
      if (direction === 'next') {
        this.$refs.step_form.validate().then(result => {
          if (result) {
            // 判断 书否已提交过
            if (this.formMsg.submitType) {
              this.$store.commit('proprietor/changeRegisterStep', {
                direction,
                stepNumber
              });
            } else {
              this.submitLoading = true;
              let param = {
                ...this.formMsg,
                salerId: localStorage.getItem('personId')
              };
              // 提交基本信息
              submitBaseMsg(param).then(res => {
                this.submitLoading = false;
                this.formMsg.submitType = true;
                this.formMsg.houseId = res.data.houseId;
                this.$store.commit('proprietor/writeFormParam', this.formMsg);
                this.$store.commit('proprietor/changeRegisterStep', {
                  direction,
                  stepNumber
                });
              })
                .catch(e => {
                  this.submitLoading = false;
                });
            }
          }
        });
      } else {
        this.$store.commit('proprietor/changeRegisterStep', {
          direction,
          stepNumber
        });
      }
    },
    // 添加同住人按钮
    addCostOpen () {
      this.addOpen = true;
    },
    // 同住人添加取消
    closeAddOpen () {
      this.$refs.add_cost_form.clear();
      this.addOpen = false;
      this.partner = {
        name: '',
        mobile: '',
        idCard: ''
      };
    },
    // 同住人添加确认
    confimAdd () {
      this.$refs.add_cost_form.validate().then(result => {
        if (result) {
          this.formMsg.subPropList.push(this.partner);
          this.partner = {
            name: '',
            mobile: '',
            idCard: ''
          };
          this.addOpen = false;
        }
      });
    },
    // 已有信息删除
    deletesubPropList (index) {
      this.formMsg.subPropList.splice(index, 1);
    }
  }
};
</script>
<style lang="less" scoped>
.add_cost_box {
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
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
.partner-title {
  display: flex;
  align-items: flex-end;
  .thin-font {
    font-size: 12px;
  }
}
.new_msg {
  .container {
    padding: 20px;
    width: 100%;
  }
  .delete_btn {
    border-top: solid 1px #cccccc;
    display: flex;
    justify-content: flex-end;
    padding: 5px 5px 0;
  }
}
.form-box {
  padding: 10px 20px;
  /deep/.mu-form-item {
    margin-bottom: 0;
  }
}
.owner-msg {
  padding: 25px;
}
.title {
  font-size: 14px;
  color: #000000;
  font-weight: 600;
}
.line-item {
  display: flex;
  margin-top: 5px;
  justify-content: space-between;
  align-items: center;
  .left-msg {
    flex: 4;
    font-weight: bold;
    color: #000000;
  }
  .right-msg {
    flex: 6;
    color: #797979;
  }
}
/deep/ .mu-step-label {
  height: 50px;
}
</style>
