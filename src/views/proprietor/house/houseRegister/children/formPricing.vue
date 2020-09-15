<template>
  <section class="box" v-loading="submitLoading">
    <mu-paper :z-depth="2" class="v_block form_box">
      <mu-form ref="step_form" :model="formMsg" class="step_form">
        <div class="bold label">户型</div>
        <div class="item-group">
          <mu-form-item label="室" label-float prop="bedroomAmount" class="item" :rules="numberRules">
            <mu-text-field
              @input="maxNum($event)"
              :disabled="formDisable"
              v-model="formMsg.bedroomAmount"
              pattern="[0-9]*"
              type="number"
            ></mu-text-field>
          </mu-form-item>
          <mu-form-item
            label="厅"
            prop="livingroomAmount"
            class="item"
            label-float
            :rules="numberRules"
          >
            <mu-text-field :disabled="formDisable" v-model="formMsg.livingroomAmount" pattern="[0-9]*" type="number"></mu-text-field>
          </mu-form-item>
          <mu-form-item label="卫" prop="toiletAmount" class="item" label-float :rules="numberRules">
            <mu-text-field :disabled="formDisable" v-model="formMsg.toiletAmount" pattern="[0-9]*" type="number"></mu-text-field>
          </mu-form-item>
          <mu-form-item label="阳台" prop="verandaAmount" class="item" label-float :rules="numberRules">
            <mu-text-field :disabled="formDisable" v-model="formMsg.verandaAmount" pattern="[0-9]*" type="number"></mu-text-field>
          </mu-form-item>
        </div>
        <mu-form-item prop="rentMode" class="item">
          <div slot="label" class="bold label">出租方式及定价</div>
          <div class="tags-box">
            <mu-chip
              class="chip"
              :class="{select:formMsg.rentMode===item.value}"
              v-for="(item,index) in sourceType"
              @click="changeRentMode(item)"
              :key="index+'i'"
            >{{item.label}}</mu-chip>
          </div>
        </mu-form-item>
        <mu-form
          ref="itemForm"
          :model="item"
          v-for="(item,index) in formMsg.rooms"
          :key="index+'num'"
        >
          <div class="bold label">房间{{'-'+item.code}}</div>
          <mu-form-item label="类型" class="item" prop="type" label-float :rules="textRules">
            <mu-select :disabled="formDisable" v-model="item.type" full-width>
              <mu-option
                v-for="(option,index) in houseCatalog"
                :key="index+'o'"
                :label="option.name"
                :value="option.value"
              ></mu-option>
            </mu-select>
          </mu-form-item>
          <div class="item-group">
            <mu-form-item label="面积" class="item" prop="area" label-float :rules="numberFloatRules">
              <mu-text-field v-model="item.area" :disabled="formDisable" pattern="[0-9]*" type="number">
                <span slot="append">
                  m
                  <sup>2</sup>
                </span>
              </mu-text-field>
            </mu-form-item>
            <mu-form-item label="租价/月" class="item" prop="salePrice" label-float :rules="numberFloatRules">
              <mu-text-field :disabled="formDisable" v-model="item.salePrice" pattern="[0-9]*" type="number"></mu-text-field>
            </mu-form-item>
          </div>
        </mu-form>
      </mu-form>
    </mu-paper>
    <mu-paper class="footer_bar skipRem" :z-depth="4" v-show="!resizeChange">
      <div class="left-btn">
        <mu-button color="#B3B3B3" full-width textColor="#ffffff" @click="goStep('prev')">上一步</mu-button>
      </div>
      <div class="right-btn">
        <mu-button
          :disabled="submitLoading"
          color="#fdd835"
          full-width
          textColor="#333333"
          @click="goStep('next')"
        >{{ this.formMsg.priceSubmit?'下一步':'提交信息'}}</mu-button>
      </div>
    </mu-paper>
  </section>
</template>
<script>
import Moment from 'moment';
import { getLeaseCatalog } from '@/api/globalApi';
import { submitPriceMsg } from '@/api/proprietorApi';

export default {
  data () {
    return {
      submitLoading: false,
      formMsg: {
        priceSubmit: false, // 提交状态
        rentMode: 1, // 1整租 2分租
        bedroomAmount: 1, // 室
        livingroomAmount: undefined, // 厅
        verandaAmount: undefined, // 阳台
        toiletAmount: undefined, // 卫生间
        beginDate: undefined, // 合同开始时间
        endDate: undefined, // 合同结束时间
        rooms: [
          {
            code: 'Z',
            type: undefined, // 房间类型
            salePrice: undefined, // 价格
            area: undefined
          }
        ]
      },
      houseCatalog: [],
      msgRules: [{ validate: val => !!val, message: '!' }],
      textRules: [
        {
          validate: val => {
            if (val === 0) return true;
            return !!val;
          },
          message: '请填写该信息'
        }
      ],
      numberRules: [
        {
          validate: val => {
            return /^[1-9]{1}[0-9]*$/.test(val);
          },
          message: '>0整数'
        }
      ],
      numberFloatRules: [
        {
          validate: val => {
            return /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(val) && val > 0;
          },
          message: '请输入>0正数'
        }
      ],
      sourceType: [
        {
          label: '整租',
          value: 1
        },
        {
          label: '合租',
          value: 2
        }
      ]
    };
  },
  created () {
    this.getCatalogOptions();
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
      return this.formMsg.priceSubmit;
    }
  },
  updated () {
    this.clearRoomsValidate();
  },
  methods: {
    // 获取房间类型参数
    getCatalogOptions () {
      getLeaseCatalog('ROOM_TYPE').then(res => {
        this.houseCatalog = res.data;
      });
    },
    // 最大数字限定
    maxNum (value) {
      if (value > 9) {
        this.formMsg.bedroomAmount = 9;
      }
    },
    // 出租方式改变
    changeRentMode (item) {
      if (this.formDisable) return;
      this.formMsg.rentMode = item.value;
    },
    // 底部按钮点击
    goStep (direction, stepNumber = 1) {
      if (direction === 'next') {
        this.$refs.step_form.validate().then(res => {
          if (res) {
            this.RoomsValidate().then(result => {
              if (result) {
                stepNumber = this.formMsg.rentMode === 1 ? 2 : 1;
                // 判断 书否已提交过
                if (this.formMsg.priceSubmit) {
                  this.$store.commit('proprietor/changeRegisterStep', {
                    direction,
                    stepNumber
                  });
                } else {
                  // 提交信息
                  this.submitLoading = true;
                  submitPriceMsg(this.formMsg).then(res => {
                    this.formMsg.priceSubmit = true;
                    this.submitLoading = false;
                    this.formMsg.houseId = res.data.houseId;
                    this.$store.commit('proprietor/writeFormParam', this.formMsg);
                    this.$store.commit('proprietor/changeRegisterStep', {
                      direction,
                      stepNumber
                    });
                  });
                }
              } else {
                this.$toast.error('信息填写不完整！请检查必填项');
              }
            });
          }
        });
      } else {
        this.$store.commit('proprietor/changeRegisterStep', {
          direction,
          stepNumber
        });
      }
    },
    // 合同开始日期禁用
    startDateDisable (date) {
      let minTime = Moment().format('YYYY-MM-DD');
      return Moment(minTime).isAfter(date);
    },
    // 添加结束日期快捷操作
    addLeaseEndTime (val) {
      if (this.formMsg.beginDate) {
        if (typeof val === 'number') {
          this.formMsg.endDate = Moment(this.formMsg.beginDate)
            .add(val, 'year')
            .subtract(1, 'days')
            .format('YYYY-MM-DD');
        } else {
          this.formMsg.endDate = val;
        }
        this.$refs.step_form.clear();
      } else {
        this.$toast.warning('请填写起始时间');
      }
    },
    // 清除房间信息 表单验证
    async clearRoomsValidate () {
      await this.$refs.itemForm.forEach(item => {
        item.clear();
      });
    },
    // 房间信息表单验证
    async RoomsValidate () {
      let tempArry = [];
      for (let i = 0; i < this.$refs.itemForm.length; i++) {
        await this.$refs.itemForm[i].validate().then(result => {
          tempArry.push(result);
        });
      }
      return tempArry.indexOf(false) === -1;
    }
  },
  watch: {
    'formMsg.rentMode': {
      handler: function (newV, oldV) {
        if (this.formMsg.priceSubmit) return;
        this.formMsg.rooms = [
          {
            code: 'Z',
            type: undefined, // 房间类型
            salePrice: undefined, // 价格
            area: undefined
          }
        ];
        if (newV === 2) {
          let nameKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
          if (this.formMsg.bedroomAmount) {
            for (let i = 0; i < this.formMsg.bedroomAmount; i++) {
              this.formMsg.rooms.push({
                code: nameKeys[i] || '--',
                type: undefined, // 房间类型
                salePrice: undefined, // 价格
                area: undefined
              });
            }
          }
        }
      },
      immediate: true
    }
  }
};
</script>
<style lang="less" scoped>
.box {
  margin-bottom: 20px;
}
.title {
  font-weight: bold;
}
.form_box {
  padding: 15px 26px;
}
.item-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .item {
    flex: 1;
    margin-right: 10px;
  }
}
.tags-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .chip {
    margin-right: 5px;
    margin-top: 5px;
  }
  .select {
    background: #448aff;
    color: #ffffff;
  }
}
.line-form-group {
  .left-box {
    flex: 5;
  }
  .right-box {
    display: flex;
    align-items: center;
    flex: 4;
  }
  .button {
    flex: 1;
    background: #d2d2d2;
    color: #ffffff;
    padding: 5px 8px;
    margin-left: 5px;
    border-radius: 12px;
  }
}
.label {
  font-size: 12px;
  color: #000000;
}
/deep/.mu-form-item {
  margin-bottom: 0;
}
</style>
