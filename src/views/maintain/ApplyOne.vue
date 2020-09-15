<template>
  <div class="maintain">
    <mu-appbar class="fixed" style="width: 100%;" color="#fdd835" z-depth="5" textColor="#000">
      <mu-button @click="back" icon slot="left">
        <mu-icon size="30" value="apps"></mu-icon>
      </mu-button>维修申请(1/2)
    </mu-appbar>
    <div class="space"></div>
    <div class="container">
      <mu-form ref="form" :model="validateForm">
        <mu-stepper :active-step="vactiveStep" orientation="vertical">
          <mu-step>
            <mu-step-label class="bold">选择房源和租客</mu-step-label>
            <mu-step-content>
              <mu-form-item prop="house_id" label-float label="房间" :rules="MsgRules">
                <mu-text-field v-model="house_name" @click="openSearchModel($event)"></mu-text-field>
              </mu-form-item>
              <mu-select label="租客" :disabled="leaseId==='no'" v-model="leaseId" label-float :rules="MsgRules">
                <mu-option
                  v-for="(val,index) in tenantList"
                  :key="index +'0'"
                  :label="val.roomName +'-'+ val.custName"
                  :value="val.leaseId"
                ></mu-option>
              </mu-select>
              <mu-button @click="vhandleNext" textColor="#000" color="#fdd835">下一步</mu-button>
            </mu-step-content>
          </mu-step>
          <mu-step>
            <mu-step-label class="bold">哪里出了问题?</mu-step-label>
            <mu-step-content>
              <mu-form-item prop="roomName" label-float label="位置" :rules="locationRules">
                <mu-select v-model="validateForm.roomName" ull-width>
                  <mu-option v-for="item in location" :key="item" :label="item" :value="item"></mu-option>
                </mu-select>
              </mu-form-item>
              <div class="Row">
                <mu-form-item prop="bigId" label-float label="问题分类" :rules="bigIdRules">
                  <mu-select @change="selectChange" v-model="validateForm.bigId" ull-width>
                    <mu-option
                      v-for="item in select"
                      :key="item.bigId"
                      :label="item.bigName"
                      :value="item.bigId"
                    ></mu-option>
                  </mu-select>
                </mu-form-item>
                <mu-form-item prop="smallId" label-float :rules="smallIdRules">
                  <mu-select
                    :disabled="disabled"
                    @change="nextSelectChange"
                    v-model="validateForm.smallId"
                    ull-width
                  >
                    <mu-option
                      v-for="item in nextSelect"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></mu-option>
                  </mu-select>
                </mu-form-item>
              </div>
              <mu-form-item prop="reservationTime" label-float label="期望维修时间" :rules="timeRules">
                <mu-date-input
                  :min-date="date"
                  v-model="validateForm.reservationTime"
                  container="bottomSheet"
                  label-float
                  full-width
                  no-display
                ></mu-date-input>
              </mu-form-item>
              <mu-button @click="vhandleNext" textColor="#000" color="#fdd835">下一步</mu-button>
              <mu-button
                color="rgb(33, 150, 243)"
                flat
                class="demo-step-button"
                @click="vhandlePrev"
              >上一步</mu-button>
            </mu-step-content>
          </mu-step>
          <mu-step>
            <mu-step-label class="bold">请描述出了什么问题?</mu-step-label>
            <mu-step-content>
              <mu-form-item prop="desc" label-float label="描述" :rules="descRules">
                <mu-text-field v-model="validateForm.desc"></mu-text-field>
                <br />
              </mu-form-item>
              <mu-button @click="vhandleNext" textColor="#000" color="#fdd835">下一步</mu-button>
              <mu-button
                color="rgb(33, 150, 243)"
                flat
                class="demo-step-button"
                @click="vhandlePrev"
              >上一步</mu-button>
            </mu-step-content>
          </mu-step>
          <mu-step>
            <mu-step-label class="bold">请拍摄几张照片</mu-step-label>
            <mu-step-content>
              <div class="imgContainer">
                <div v-for="(item,index) in file" :key="'p'+index" class="img_box">
                  <img class="pic" @click="lookHand(index)" :src="item.privePath" />
                  <img class="delet" @click="delImg(index)" :src="delet" />
                </div>
                <upLoadImg @keepNewPic="keepNewPic" :fileList="file"></upLoadImg>
              </div>
              <mu-button
                class="demo-step-button"
                @click="vhandleNext"
                textColor="#000"
                color="#fdd835"
              >完成</mu-button>
              <mu-button
                flat
                class="demo-step-button"
                @click="vhandlePrev"
                color="rgb(33, 150, 243)"
              >上一步</mu-button>
            </mu-step-content>
          </mu-step>
        </mu-stepper>
      </mu-form>
      <p v-if="vfinished" class="ml20">
        <a href="javascript:;" class="blue" @click="vreset">填写完成</a>
      </p>
    </div>
    <div class="space"></div>
    <div class="bottom">
      <mu-button v-if="vfinished" color="#fdd835" @click="next" textColor="#000">下一步</mu-button>
      <mu-button v-else color="#999" textColor="#fff">下一步</mu-button>
    </div>
    <search-mode :open.sync="digStatus" @chooseHouse="chooseHouse"></search-mode>
  </div>
</template>

<script>
import { getSelect, addOrder, queryTenantList } from '@/api/maintainApi';
import delet from '@/assets/images/delet.svg';
import { formatTime3 } from '@/utils/date';
import upLoadImg from '@/components/upLoadImg';
import searchMode from './children/searchMode';
export default {
  components: { upLoadImg, searchMode },
  data () {
    return {
      onClick: false,
      viewBox: null,
      digStatus: false,
      house_name: '',
      tenant: '',
      leaseId: '',
      size: 0,
      delet,
      limit: 6, // 限制图片上传的数量
      tempImgs: [],
      loading: false,
      disabled: true,
      headerImage: '',
      picValue: '',
      imgList: [],
      vactiveStep: 0,
      validateForm: {
        house_id: '',
        roomName: '',
        bigId: '',
        smallId: '',
        reservationTime: '',
        desc: '',
        file: []
      },
      tenantList: [
        {
          custId: '',
          custName: '报修',
          leaseId: 'no',
          roomId: '',
          roomName: '内部'
        }
      ], // 租客列表
      select: [],
      nextSelect: [],
      nextSelectAll: [],
      room: [],
      startIndex: '',
      nextIndex: '',
      file: [],
      location: [
        '公共区域',
        '房间A',
        '房间B',
        '房间C',
        '房间D',
        '房间E',
        '房间F',
        '房间G',
        '主卫',
        '公卫'
      ],
      nameRules: [{ validate: val => !!val, message: '请填写联系人' }],
      phoneRules: [{ validate: val => !!val, message: '请填写联系电话' }],
      houseIdRules: [{ validate: val => !!val, message: '请选择房屋' }],
      locationRules: [{ validate: val => !!val, message: '请选择位置' }],
      bigIdRules: [{ validate: val => !!val, message: '请选择问题分类' }],
      smallIdRules: [{ validate: val => !!val, message: '请选择问题分类' }],
      timeRules: [{ validate: val => !!val, message: '请选择问题分类' }],
      descRules: [{ validate: val => !!val, message: '请选择问题分类' }],
      MsgRules: [{ validate: val => !!val, message: '请填写该信息' }]
    };
  },
  computed: {
    vfinished () {
      return this.vactiveStep > 3;
    }
  },
  methods: {
    // 选择房源
    chooseHouse (e) {
      // this.digStatus = false;
      this.house_name = e.house_name;
      this.house_id = e.house_id;
      this.validateForm.house_id = e.house_id;
      this.$refs.form.clear();
      this.getTenantList(e.house_id);
    },
    // 暂存图片
    keepNewPic (e) {
      e.privePath = e.visitPath + e.filePath;
      this.file.push(e);
    },
    // 打开房源收索弹框发
    openSearchModel (e) {
      e.target.blur();
      this.digStatus = true;
    },
    // 图片预览
    lookHand (index) {
      let list = this.file.map(item => {
        return item.privePath;
      });
      if (list.length === 0) return;
      this.viewBox = this.$Prive({
        imgList: list,
        current: index
      });
    },
    // 删除图片
    delImg (index) {
      this.file.splice(index, 1);
    },
    // 获取房间租约列表
    getTenantList (houseid) {
      queryTenantList(houseid).then(res => {
        if (res.data.length > 0) {
          this.leaseId = '';
          this.tenantList = res.data;
        } else {
          this.leaseId = 'no';
          this.tenantList = [
            {
              custId: '',
              custName: '报修',
              leaseId: 'no',
              roomId: '',
              roomName: '内部'
            }
          ]; // 租客列表
        }
      });
    },
    // 返回首页
    back () {
      this.$router.push('/index');
    },
    // 问题分类的选择框
    selectChange (e) {
      let page = this;
      page.select.map((item, i) => {
        if (item.bigId === e) {
          page.nextSelect = page.nextSelectAll[i];
          page.startIndex = i;
          page.validateForm.smallId = '';
          page.disabled = false;
        }
      });
    },
    nextSelectChange (e) {
      let page = this;
      page.nextSelect.map((item, i) => {
        if (item.value === e) {
          page.nextIndex = i;
        }
      });
    },
    vhandleNext () {
      this.$refs.form.validate().then(result => {
        if (result) {
          this.vactiveStep++;
        }
      });
    },
    vhandlePrev () {
      this.vactiveStep--;
    },
    vreset () {
      this.vactiveStep = 0;
    },
    // 提交下一步
    next () {
      if (this.onClick) return;
      this.onClick = true;
      let page = this;
      let bigName = '';
      let smallName = '';
      this.select.map(i => {
        if (i.bigId === page.validateForm.bigId) {
          bigName = i.bigName;
        }
      });
      this.nextSelect.map(i => {
        if (i.value === page.validateForm.smallId) {
          smallName = i.label;
        }
      });
      page.validateForm.reservationTime = formatTime3(
        page.validateForm.reservationTime,
        'Y-MM-dd'
      );
      let para = {
        ...page.validateForm,
        file: page.file,
        leaseId: this.leaseId === 'no' ? '' : this.leaseId,
        bigName,
        smallName
      };
      if (para.file.length < 1) {
        page.$toast.error('请拍照');
        this.onClick = false;
      } else {
        page.$refs.form.validate().then(result => {
          addOrder(para)
            .then(res => {
              this.onClick = false;
              if (res.code === 200) {
                localStorage.setItem('applyInfo', JSON.stringify(res.data));
                page.$router.push('/applyTwo');
              }
            })
            .catch(errMsg => {
              this.onClick = false;
            });
        });
      }
    }
  },
  created () {
    let riqi = new Date();
    this.date = riqi;
    let page = this;
    getSelect().then(res => {
      if (res.code === 200) {
        page.select = res.data;
        let a = res.data.map(row => row.small);
        page.nextSelectAll = a;
      }
    });
  },
  beforeDestroy () {
    if (this.viewBox) this.viewBox.close();
  },
  watch: {
    leaseId: function (newV, oldV) {
      this.validateForm.roomName = '';
      if (newV === 'no') {
        this.location = [
          '公共区域',
          '房间A',
          '房间B',
          '房间C',
          '房间D',
          '房间E',
          '房间F',
          '房间G',
          '主卫',
          '公卫'
        ];
      } else {
        this.location = ['公共区域'];
        this.tenantList.forEach(item => {
          if (item.leaseId === newV) {
            this.location.push(item.roomName);
          }
        });
      }
    }
  }
};
</script>

<style lang='less' scoped>
.container {
  width: 95%;
  margin: 20px auto;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 2px 2px 0px rgba(16, 16, 16, 0.3);
}

.mu-step-label.active {
  font-weight: bold;
}

.imgContainer {
  margin-bottom: 10px;
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  align-items: center;
}
// 修改
.img_box {
  width: 75px;
  height: 75px;
  margin: 10px 10px 0 0;
  position: relative;
  .pic {
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }
}

.column {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.Row {
  display: flex;
}

.eachRadio {
  width: 50%;
  text-align: left;
  margin-top: 15px;
  color: rgb(33, 150, 243);
}

.bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: flex-end;
  box-shadow: 5px 5px 5px 5px rgba(16, 16, 16, 0.3);
}

.list {
  height: 200px;
}
</style>
