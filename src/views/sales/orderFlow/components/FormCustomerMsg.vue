<template>
  <section class="cust_form ">
    <lease-title></lease-title>
    <mu-paper class="v_block" :z-depth="1">
      <mu-stepper :active-step="activeStep">
        <mu-step>
          <mu-step-label>租客信息</mu-step-label>
        </mu-step>
        <mu-step>
          <mu-step-label>同住人信息（选填）</mu-step-label>
        </mu-step>
      </mu-stepper>
    </mu-paper>

    <div v-if="activeStep == 0">
      <mu-paper class="v_block" :z-depth="1">
        <mu-form ref="first_step" :model="formMsg" class="step_form">
          <div class="title" ref="test">请登记租客信息</div>
          <mu-form-item
            label="租客姓名:"
            label-float
            prop="name"
            :rules="nameRules"
          >
            <mu-text-field v-model="formMsg.name" prop="name"></mu-text-field>
          </mu-form-item>
          <mu-form-item
            label="租客电话:"
            label-float
            prop="mobile"
            :rules="phoneNumber"
          >
            <mu-text-field
              v-model="formMsg.mobile"
              pattern="[0-9]*"
              type="number"
              full-width
              prop="mobile"
            ></mu-text-field>
          </mu-form-item>
          <mu-form-item
            label="身份证号:"
            label-float
            prop="idCard"
          >
            <mu-text-field
              v-model="formMsg.idCard"
              prop="idCard"
              full-width
            ></mu-text-field>
          </mu-form-item>
        </mu-form>
      </mu-paper>
      <!-- 紧急联系人 -->
      <mu-paper class="v_block" :z-depth="1" v-if="status">
        <mu-form ref="two_step" :model="emergContact" class="step_form">
          <div class="title" ref="test">紧急联系人信息（必填）</div>
          <mu-form-item
            label="紧急联系人"
            label-float
            prop="name"
            :rules="nameRules"
          >
            <mu-text-field
              v-model="emergContact.name"
              prop="name"
            ></mu-text-field>
          </mu-form-item>
          <mu-form-item
            label="与签约人关系"
            label-float
            prop="relation"
            :rules="nameRules"
          >
            <mu-select chips v-model="emergContact.relation" full-width>
              <mu-option
                v-for="(item, index) in SelectionOptions"
                :key="'item' + index"
                :label="item.label"
                :value="item.value"
                ripple
              ></mu-option>
            </mu-select>
          </mu-form-item>
          <mu-form-item
            label="联系人电话"
            label-float
            prop="mobile"
            :rules="phoneNumber"
          >
            <mu-text-field
              v-model="emergContact.mobile"
              pattern="[0-9]*"
              type="number"
              full-width
              prop="mobile"
            ></mu-text-field>
          </mu-form-item>
        </mu-form>
      </mu-paper>
    </div>
    <!-- 同住人 -->
    <div v-if="activeStep == 1">
      <!-- 同住人信息展示 -->
      <transition-group tag="div" name="list-fade">
        <mu-paper
          :z-depth="1"
          class="new_msg v_block"
          v-for="(item, index) in fellows"
          :key="'item' + index"
        >
          <div class="container">
            <div class="partner-title">
              <mu-icon value="home" color="#1890FF"></mu-icon>
              <span class="thin-font">同住人 {{ index + 1 }}</span>
            </div>
            <div class="partner-item">
              <span class="left-msg">与签约人关系</span>
              <span class="right-msg">{{ judgePartner(item.relation) }}</span>
            </div>
            <div class="partner-item">
              <span class="left-msg">姓名</span>
              <span class="right-msg">{{ item.name }}</span>
            </div>
            <div class="partner-item">
              <span class="left-msg">电话</span>
              <span class="right-msg">{{ item.mobile }}</span>
            </div>

            <div class="partner-item">
              <span class="left-msg">身份证号</span>
              <span class="right-msg">{{ item.idCard }}</span>
            </div>
          </div>
          <div class="delete_btn">
            <mu-button flat small color="primary" @click="deleteFellows(index)"
              >删除</mu-button
            >
          </div>
        </mu-paper>
      </transition-group>
      <mu-paper :z-depth="1" class="add_cost_box">
        <div class="add_cost_btn" @click="addCostOpen">
          <mu-ripple color="#448AFF">
            <span>+添加同住人</span>
          </mu-ripple>
        </div>
        <!-- 同住人信息输入 -->
        <transition name="falls">
          <div class="cost_msg_box" v-show="addOpen">
            <div class="add_cost_msg">
              <mu-form ref="add_cost_form" :model="partner" class="step_form">
                <mu-form-item
                  label="同住人姓名"
                  label-float
                  prop="name"
                  :rules="nameRules"
                >
                  <mu-text-field
                    v-model="partner.name"
                    prop="name"
                  ></mu-text-field>
                </mu-form-item>
                <mu-form-item
                  label="与签约人关系"
                  label-float
                  prop="relation"
                  :rules="nameRules"
                >
                  <mu-select chips v-model="partner.relation" full-width>
                    <mu-option
                      v-for="(item, index) in SelectionOptions"
                      :key="'item' + index"
                      :label="item.label"
                      :value="item.value"
                      ripple
                    ></mu-option>
                  </mu-select>
                </mu-form-item>
                <mu-form-item
                  label="租客电话"
                  label-float
                  prop="mobile"
                  :rules="phoneNumber"
                >
                  <mu-text-field
                    v-model="partner.mobile"
                    pattern="[0-9]*"
                    type="number"
                    full-width
                    prop="mobile"
                  ></mu-text-field>
                </mu-form-item>
                <mu-form-item
                  label="身份证号:"
                  label-float
                  prop="idCard"
                >
                  <mu-text-field
                    v-model="partner.idCard"
                    prop="idCard"
                    full-width
                  ></mu-text-field>
                </mu-form-item>
              </mu-form>
            </div>
            <div class="add_footer_btn">
              <mu-button textColor="#448AFF" flat small @click="closeAddOpen"
                >取消</mu-button
              >
              <mu-button textColor="#448AFF" flat small @click="confimAdd"
                >确定</mu-button
              >
            </div>
          </div>
        </transition>
      </mu-paper>
    </div>
    <mu-paper class="form_footer_btn" :z-depth="4" v-if="!resizeChange">
      <mu-button
        color="#fdd835"
        v-show="activeStep == 1"
        textColor="#333333"
        @click="changeViewBox('prive')"
        class="myBtn"
        >上一步</mu-button
      >
      <mu-button
        color="#fdd835"
        v-show="activeStep == 0"
        textColor="#333333"
        @click="changeViewBox('next')"
        >下一步</mu-button
      >
      <mu-button
        color="#fdd835"
        v-show="activeStep >= 1"
        textColor="#333333"
        @click="changeStep('next')"
        >下一步</mu-button
      >
    </mu-paper>
  </section>
</template>
<script>
import { authenticateIdcard } from '@/api/salesApi';
import LeaseTitle from './LeaseTitle';
export default {
  components: { LeaseTitle },
  data () {
    return {
      status: true,
      activeStep: 0,
      nameRules: [{ validate: val => !!val, message: '请填写该信息' }],
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
      // 紧急联系人
      emergContact: {
        name: '',
        mobile: '',
        relation: ''
      },
      partner: {
        name: '',
        mobile: '',
        idCard: '',
        relation: ''
      },
      fellows: [], // 同住人列表
      addOpen: false, // 同住人状态
      SelectionOptions: [
        {
          label: '朋友',
          value: 1
        },
        {
          label: '家人',
          value: 2
        },
        {
          label: '情侣',
          value: 3
        },
        {
          label: '同事',
          value: 3
        }
      ]
    };
  },
  created () {
    this.emergContact =
      this.$store.state.sales.leaseFormData.emergContact || this.emergContact;
    this.fellows = this.$store.state.sales.leaseFormData.fellows || [];
    this.status = this.$route.query.type !== 4;
  },
  computed: {
    formMsg () {
      return this.$store.state.sales.customer;
    },
    resizeChange () {
      return this.$store.state.reiseChange;
    }
  },
  methods: {
    changeViewBox (direction) {
      if (direction === 'next') {
        this.$refs.first_step.validate().then(result => {
          if (result) {
            if (this.status) {
              this.$refs.two_step.validate().then(res => {
                if (res) {
                  let emc = {
                    emergContact: this.emergContact
                  };
                  this.$store.commit('sales/writeInFormData', emc);
                  this.authentication();
                }
              });
            } else {
              this.authentication();
            }
          }
        });
      } else {
        this.activeStep -= 1;
      }
    },
    // 按钮点击父级步进器
    changeStep (direction) {
      let obj = {
        fellows: this.fellows
      };
      this.$store.commit('sales/writeInFormData', obj);
      this.$emit('addStep');
    },
    // 验证身份证号是否与姓名匹配
    authentication () {
      let idCard = this.formMsg.idCard;
      authenticateIdcard(idCard).then(res => {
        this.$store.commit('sales/setCustomerMsg', this.formMsg);
        if (res.data && res.data.name !== this.formMsg.name) {
          this.$confirm('身份证号与姓名不匹配，是否继续?', '提示').then(val => {
            if (val.result) {
              this.activeStep += 1;
              // this.$emit('addStep');
            }
          });
        } else {
          // this.$emit('addStep');
          this.activeStep += 1;
        }
      });
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
        idCard: '',
        relation: ''
      };
    },
    // 同住人添加确认
    confimAdd () {
      this.$refs.add_cost_form.validate().then(result => {
        if (result) {
          this.fellows.push(this.partner);
          this.partner = {
            name: '',
            mobile: '',
            idCard: '',
            relation: ''
          };
          this.addOpen = false;
        }
      });
    },
    // 已有的同住人信息删除
    deleteFellows (index) {
      this.fellows.splice(index, 1);
    },
    // 判紧急联系人关系
    judgePartner (value) {
      let str = '--';
      switch (value) {
        case 1:
          str = '朋友';
          break;
        case 2:
          str = '家人';
          break;
        case 3:
          str = '情侣';
          break;
        case 4:
          str = '同事';
          break;
        default:
          break;
      }
      return str;
    }
  }
};
</script>
<style lang="less" scoped>
.steper-box {
  width: 100%;
}
// 同住人
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
    .partner-item {
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
  }
  .delete_btn {
    border-top: solid 1px #cccccc;
    display: flex;
    justify-content: flex-end;
    padding: 5px 5px 0;
  }
}
.step_btn {
  display: flex;
  justify-content: flex-end;
}
.step_form {
  padding: 10px 20px;
  .title {
    font-size: 14px;
    font-weight: 600;
  }
  /deep/.mu-form-item {
    margin-bottom: 0;
  }
}
.myBtn {
  margin-right: 10px;
}
/deep/ .mu-step-label {
  height: 50px;
}
</style>
