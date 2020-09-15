<template>
  <div class="outer_wrap">
    <!-- 第一步 -->
    <mu-form ref="first_step" :model="formMsg" class="step_form" v-show="activeStep===0">
      <div class="steper">
        <mu-stepper :active-step="activeStep">
          <mu-step>
            <mu-step-label>租客确认</mu-step-label>
          </mu-step>
          <mu-step>
            <mu-step-label></mu-step-label>
          </mu-step>
          <mu-step>
            <mu-step-label></mu-step-label>
          </mu-step>
        </mu-stepper>
      </div>
      <mu-form-item label="租客姓名" label-float prop="name" :rules="nameRules">
        <mu-text-field v-model="formMsg.name" prop="name"></mu-text-field>
      </mu-form-item>
      <mu-form-item label="租客电话" label-float prop="mobile" :rules="phoneNumber">
        <mu-text-field
          v-model="formMsg.mobile"
          pattern="[0-9]*"
          type="number"
          full-width
          prop="mobile"

          @blur="showBtn=true"
        ></mu-text-field>
      </mu-form-item>
      <mu-form-item label="身份证号" label-float prop="idCard" :rules="userCard">
        <mu-text-field
          v-model="formMsg.idCard"
          prop="idCard"
          pattern="[0-9]*"
          full-width
          type="number"

          @blur="showBtn=true"
        ></mu-text-field>
      </mu-form-item>
      <div class="steperBtn">
        <mu-button color="#fdd835" textColor="#333333" @click="next">下一步</mu-button>
      </div>
    </mu-form>
    <!-- 第二步 -->
    <mu-form ref="second_step" :model="formMsg" class="step_form" v-show="activeStep ===1">
      <div class="steper">
        <mu-stepper :active-step="activeStep">
          <mu-step>
            <mu-step-label></mu-step-label>
          </mu-step>
          <mu-step>
            <mu-step-label>原房间信息</mu-step-label>
          </mu-step>
          <mu-step>
            <mu-step-label></mu-step-label>
          </mu-step>
        </mu-stepper>
      </div>
      <mu-form-item label="楼盘:" label-float prop="name" :rules="nameRules">
        <mu-text-field v-model="formMsg.name" prop="name"></mu-text-field>
      </mu-form-item>
      <mu-form-item label="换房原因" label-float prop="idCard" :rules="nameRules">
        <mu-select chips v-model="formMsg.userResouce" full-width>
          <mu-option
            v-for="(item,index) in options2"
            :key="index"
            :label="item.lable"
            :value="item.value"
            ripple
          ></mu-option>
        </mu-select>
      </mu-form-item>
      <div class="steperBtn">
        <div>
          <mu-button color="#fdd835" textColor="#333333" @click="next">下一步</mu-button>
          <mu-button color="#fdd835" textColor="#448AFF" flat small @click="prive">上一步</mu-button>
        </div>
      </div>
    </mu-form>
    <!-- 第三步 -->
    <mu-form ref="three_step" :model="formMsg" class="step_form" v-show="activeStep >=2">
      <div class="steper">
        <mu-stepper :active-step="activeStep">
          <mu-step>
            <mu-step-label></mu-step-label>
          </mu-step>
          <mu-step>
            <mu-step-label></mu-step-label>
          </mu-step>
          <mu-step>
            <mu-step-label>新房间信息</mu-step-label>
          </mu-step>
        </mu-stepper>
      </div>
      <mu-form-item label="变更房源" label-float prop="room" :rules="room">
        <mu-text-field v-model="formMsg.room" prop="room" @focus="openSearch($event)"></mu-text-field>
      </mu-form-item>
      <div class="steperBtn">
        <div class v-show="activeStep<=2">
          <mu-button color="#fdd835" textColor="#333333" @click="next">完成</mu-button>
          <mu-button color="#fdd835" textColor="#448AFF" flat small @click="prive">上一步</mu-button>
        </div>
        <div class="v_footerHint" v-show="activeStep>2">填写完成请前往下一步</div>
      </div>
    </mu-form>
    <mu-paper class="btn" :z-depth="4" v-show="showBtn">
      <mu-button
        color="#fdd835"
        textColor="#333333"
        :disabled="activeStep<=2"
        @click="changeStep('next')"
      >下一步</mu-button>
    </mu-paper>
    <!-- 变更房源收索弹框 -->
    <mu-bottom-sheet :open.sync="open">
      <div class="search_container">
        <div class="input">
          <mu-text-field
            v-model="params.query_term"
            full-width
            action-icon="search"
            placeholder="请输入房源名称"
          ></mu-text-field>
        </div>
        <div class="radio_list" ref="container">
          <mu-load-more
            @refresh="refresh"
            :refreshing="refreshing"
            :loading="loading"
            @load="load"
            :loaded-all="loadAll"
          >
            <div class="select-control-row" v-for="(item,index) in radioData" :key="index">
              <mu-radio :value="item" v-model="selectValue" :label="item.full_name"></mu-radio>
            </div>
          </mu-load-more>
          <div class="v_footerHint" v-if="loadAll">没有更多数据了~</div>
        </div>
        <div class="footer_btn">
          <mu-button color="#fdd835" textColor="#333333" class="confim_btn" @click="confim">确定</mu-button>
        </div>
      </div>
    </mu-bottom-sheet>
  </div>
</template>
<script>
import { getSalesHouseList } from '@/api/salesApi';

export default {
  data () {
    return {
      activeStep: 0,
      showBtn: true,
      nameRules: [
        { validate: val => !!val, message: '必须填写用户名' },
        { validate: val => val.length >= 3, message: '用户名长度大于2' }
      ],
      room: [
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
      // 租客来源参数
      options2: [
        {
          lable: '58同城',
          value: 1
        },
        {
          lable: '赶集网',
          value: 2
        },
        {
          lable: '安居客',
          value: 3
        },
        {
          lable: '蘑菇',
          value: 4
        }
      ],
      formMsg: {
        name: '',
        mobile: '',
        idCard: '',
        username: '',
        phone: '',
        room: ''
      },
      open: false,
      pageIndex: 1,
      radioData: [],
      time_out: undefined, // 请求延时器
      loadAll: false, // --滚动加载相关
      refreshing: false,
      loading: false,
      selectValue: undefined,
      params: {
        query_term: undefined, // 收索关键词参数
        status: 1, // 房间状态
        // page_no: 1, // 当前page-index
        page_size: 10
      },
      priceOptions: [
        // 押金
        {
          lable: '1个月',
          value: 1
        },
        {
          lable: '6个月',
          value: 2
        },
        {
          lable: '12个月',
          value: 3
        },
        {
          lable: '24个月',
          value: 4
        }
      ]
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
    // 步进条--下一步
    next () {
      this.activeStep += 1;
    },
    // 步进条--上一步
    prive () {
      this.activeStep -= 1;
    },
    // 打开搜索弹框
    openSearch (e) {
      this.open = true;
      e.target.blur();
      if (!this.radioData || this.radioData.length === 0) {
        this.getListData(this.params);
      }
    },
    // 弹框选中确认
    confim () {
      if (this.selectValue) {
        this.formMsg.room = this.selectValue.full_name;
        this.$refs.first_step.clear();
      }
      this.open = false;
    },
    // 加载更新-----弹框列表
    refresh () {
      this.refreshing = true;
      this.loadAll = false;
      this.radioData = [];
      this.$refs.container.scrollTop = 0;
      this.getListData(this.params, this.pageIndex);
    },
    // 加载列表数据api
    load () {
      this.getListData(this.params, this.pageIndex);
    },
    getListData (pram, index) {
      let data = pram;
      data.page_no = index || 1;
      this.loading = true;
      getSalesHouseList(data).then(res => {
        if (!res.data.rooms || res.data.rooms.length === 0) {
          this.loadAll = true;
        } else {
          this.pageIndex += 1;
          this.refreshing = false;
          this.loading = false;
          this.radioData = this.radioData.concat(res.data.rooms);
          if (res.data.total_count === this.radioData.length) {
            this.loadAll = true;
          }
        }
      });
    }
  },
  watch: {
    params: {
      handler: function (newVal, oldVal) {
        if (this.time_out) {
          clearTimeout(this.time_out);
        }
        this.time_out = setTimeout(() => {
          this.radioData = [];
          this.pageIndex = 1;
          this.refreshing = false;
          this.loadAll = false;
          this.load();
        }, 800);
      },
      deep: true
    }
  }
};
</script>
<style lang="less" scoped>
.step_form {
  padding: 20px 20px 50px;
  .steper {
    /deep/.mu-step-label {
      height: auto;
    }
  }
  .steperBtn {
    margin-top: 20px;
  }
  /deep/.mu-form-item {
    margin-bottom: 0;
  }
}
//  搜索弹框样式
.search_container {
  height: 335px;
  .input {
    display: flex;
    // padding: 10px 20px 0;

    align-items: center;
    & /deep/.full-width {
      margin: 0;
      .mu-text-field {
        padding-left: 20px;
        padding-right: 20px;
      }
    }
  }
  .radio_list {
    height: 220px;
    overflow: auto;
    .select-control-row {
      padding: 0 20px;
      /deep/.mu-radio-label {
        font-size: 14px;
      }
    }
  }
  // 改变弹框按钮大小
  .footer_btn {
    display: flex;
    justify-content: flex-end;
    padding: 10px 10px 0;
    border-top: solid 1px #cccccc;
    /deep/.mu-raised-button {
      min-width: 60px;
    }
  }
}
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
