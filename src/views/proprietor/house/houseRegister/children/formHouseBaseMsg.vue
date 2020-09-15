<template>
  <section class="box">
    <mu-paper :z-depth="2" class="v_block form_box">
      <div class="title">基本信息</div>
      <mu-form ref="step_form" :model="formMsg" class="step_form">
        <mu-form-item label="楼盘名称" prop="communityName" label-float :rules="msgRules">
          <mu-text-field
          :disabled="formDisable"
            v-model="formMsg.communityName"
            @focus="openSearchModel($event,'h')"
            action-icon="search"
          ></mu-text-field>
        </mu-form-item>
        <div class="item-group">
          <mu-form-item label="栋" label-float prop="buildingNum" class="item" :rules="numberRules">
            <mu-text-field  :disabled="formDisable" v-model="formMsg.buildingNum" pattern="[0-9]*" type="number"></mu-text-field>
          </mu-form-item>
          <mu-form-item label="单元" label-float prop="unitNum" class="item" :rules="numberRules">
            <mu-text-field  :disabled="formDisable" v-model="formMsg.unitNum" pattern="[0-9]*" type="number"></mu-text-field>
          </mu-form-item>
        </div>
        <div class="item-group">
          <mu-form-item label="楼" label-float prop="floorNum" class="item" :rules="numberRules">
            <mu-text-field  :disabled="formDisable" pattern="[0-9]*" type="number" v-model="formMsg.floorNum"></mu-text-field>
          </mu-form-item>
          <mu-form-item label="号" label-float prop="houseNum" class="item" :rules="numberRules">
            <mu-text-field  pattern="[0-9]*" type="number" :disabled="formDisable" v-model="formMsg.houseNum"></mu-text-field>
          </mu-form-item>
        </div>
        <mu-form-item label="责任小组" label-float prop="teamName" class="item" :rules="msgRules">
          <mu-text-field  :disabled="formDisable" v-model="formMsg.teamName"   @focus="openSearchModel($event)"></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="recvSource" class="item" :rules="msgRules">
          <div slot="label" class="bold">客户来源</div>
          <div class="tags-box">
            <mu-chip
              class="chip"
              :class="{select:formMsg.recvSource===item.value}"
              v-for="(item,index) in customerSource"
              @click="changeSource(item)"
              :key="index+'i'"
            >{{item.name}}</mu-chip>
          </div>
        </mu-form-item>
      </mu-form>
    </mu-paper>
    <mu-paper class="footer_bar skipRem" :z-depth="4" v-show="!resizeChange">
      <mu-button color="#fdd835" full-width textColor="#333333" @click="goStep('next')">下一步</mu-button>
    </mu-paper>
    <search-house-model :open.sync="serachHouse" @chooseHouse="chooseHouse"></search-house-model>
    <search-user-model :icon="'group'" :placeholder="'小组名称/名称关键词'" :queryApi="querySalesTeam" :open.sync="searchUserTeam" @chooseChange="chooseChange"></search-user-model>
  </section>
</template>
<script>
import searchHouseModel from '../children/searchHouseModel';
import { getLeaseCatalog, querySalesTeam } from '@/api/globalApi';
import searchUserModel from '../children/searchUserModel';

export default {
  components: { searchHouseModel, searchUserModel },
  data () {
    return {
      serachHouse: false,
      searchUserTeam: false,
      formMsg: {
        teamId: '', // 责任团队id
        teamName: '', // 团队名称
        communityId: undefined, // 小区id
        communityName: undefined, // 小区名称
        buildingNum: undefined, // 栋
        floorNum: undefined, // 楼
        unitNum: undefined, // 单元
        houseNum: undefined, // 号
        saler: undefined, // 销售
        recvSource: undefined, // 客户来源
        submitType: false
      },
      msgRules: [
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
            return /(^[1-9]\d*$)/.test(val);
          },
          message: '请输入>0整数'
        }
      ],
      phoneNumber: [
        { validate: val => !!val, message: '必须填写电话号码' },
        {
          validate: val => /^1[3456789]\d{9}$/.test(val),
          message: '请填写正确的电话号码'
        }
      ],
      customerSource: [], // 客户来源参数
      tags: [
        {
          label: '物业介绍',
          selected: false
        },
        {
          label: '业主介绍',
          selected: false
        },
        {
          label: '中介',
          selected: false
        },
        {
          label: '员工',
          selected: false
        },
        {
          label: '租客',
          selected: false
        },
        {
          label: '58同城',
          selected: false
        },
        {
          label: '赶集',
          selected: false
        },
        {
          label: '贝壳',
          selected: false
        }
      ]
    };
  },
  computed: {
    resizeChange () {
      return this.$store.state.reiseChange;
    },
    formDisable () {
      return this.formMsg.submitType;
    }
  },
  created () {
    this.getCustomerSource();
    this.formMsg = Object.assign(
      this.formMsg,
      JSON.parse(JSON.stringify(this.$store.state.proprietor.formParams))
    );
  },
  methods: {
    querySalesTeam,
    // 禁止输入框获取焦点
    openSearchModel (e, type) {
      e.target.blur();
      if (type === 'h') {
        this.serachHouse = true;
      } else {
        this.searchUserTeam = true;
      }
    },
    // 责任团队
    chooseChange (param) {
      this.formMsg.teamId = param.id;
      this.formMsg.teamName = param.name;
      this.$refs.step_form.clear();
    },
    // 小区信息选中
    chooseHouse (value) {
      this.formMsg.communityName = value.name;
      this.formMsg.communityId = value.id;
      this.$refs.step_form.clear();
    },
    // 客户来源选中改变
    changeSource (param) {
      if (this.formDisable) return;
      this.formMsg.recvSource = param.value;
    },
    // 底部按钮点击
    goStep (direction, stepNumber = 1) {
      if (direction === 'next') {
        this.$refs.step_form.validate().then(result => {
          if (result) {
            let houseName = `${this.formMsg.communityName}${this.formMsg.buildingNum}-${this.formMsg.unitNum}-${this.formMsg.floorNum}-${this.formMsg.houseNum}`;
            this.$store.commit('proprietor/writeFormParam', this.formMsg);
            this.$store.commit('proprietor/setEditHouseName', houseName);
            this.$store.commit('proprietor/changeRegisterStep', {
              direction,
              stepNumber
            });
          } else {
            this.$toast.error('信息填写不完整！请检查必填项');
          }
        });
      } else {
        this.$store.commit('proprietor/changeRegisterStep', {
          direction,
          stepNumber
        });
      }
    },
    // 获取客户来源参数
    getCustomerSource () {
      getLeaseCatalog('CUST_SOURCE').then(res => {
        this.customerSource = res.data;
      });
    }
  }
};
</script>
<style lang="less" scoped>
.box {
  margin-bottom: 20px;
}
.title {
  font-size: 18px;
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

/deep/.mu-form-item {
  margin-bottom: 0;
}
</style>
