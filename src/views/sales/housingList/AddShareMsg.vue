<template>
  <section class="v_page">
    <!-- 导航 -->
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000">
      <mu-button icon slot="left" @click="goBack">
        <mu-icon value="arrow_back"></mu-icon>
      </mu-button>添加共享信息
    </mu-appbar>
    <!-- 内容区 -->
    <div class="v_mainContainer skipRem">
      <mu-paper class="v_block" :z-depth="1">
        <mu-form ref="msg_form" :model="formMsg" class="step_form">
          <mu-form-item prop="select" :rules="nameRules">
            <div slot="label" class="title">选择信息类型</div>
            <mu-select v-model="formMsg.select" placeholder="房源/租客" full-width>
              <mu-option
                v-for="(item,index) in selectedOptions"
                :key="'item'+index"
                :label="item.label"
                :value="item"
                ripple
              ></mu-option>
            </mu-select>
          </mu-form-item>
          <mu-form-item prop="content" :rules="nameRules">
            <div slot="label" class="title">填写信息</div>
            <mu-text-field v-model="formMsg.content" placeholder="描述" prop="content"></mu-text-field>
          </mu-form-item>
          <div class="pic_box">
            <div v-for="(val,i) in imageList" :key="'item'+i" class="prive_image">
              <img @click="lookHand(i,imageList)" class="img" :src="val.previewPath" />
              <mu-button color="primary" class="delet_icon" icon small @click="deleteImage(i)">
                <mu-icon value="cancel" color="red"></mu-icon>
              </mu-button>
            </div>
            <upLoad-img :fileList="imageList" @keepNewPic="keepNewPic" :multiple="true"></upLoad-img>
          </div>
        </mu-form>
      </mu-paper>
    </div>
    <mu-paper class="form_footer_btn" :z-depth="4">
      <mu-button color="#fdd835" textColor="#333333" full-width @click="submitMsg">提交信息</mu-button>
    </mu-paper>
  </section>
</template>
<script>
// import msgCard from './children/MsgCard';
import { addShareInfo } from '@/api/salesApi';
import upLoadImg from '@/components/upLoadImg';
export default {
  components: { upLoadImg },
  data () {
    return {
      imageList: [], // 图片
      viewBox: undefined,
      formMsg: {
        content: '',
        select: undefined
      },
      options: [
        {
          roomId: 0,
          leaseInfo: null,
          roomCode: '',
          roomName: '房源相关'
        }
      ],
      nameRules: [{ validate: val => !!val, message: '请填写该信息' }],
      houseId: ''
    };
  },
  computed: {
    selectedOptions () {
      let arr = this.options.concat(this.$store.state.sales.tenantArray);
      return arr.map(item => {
        item.label = this.setLabel(item);
        return item;
      });
    }
  },
  created () {
    this.houseId = this.$store.state.sales.roomParams.house_info.house_id;
  },
  methods: {
    // 返回
    goBack () {
      this.$router.go(-1);
    },
    // 设置下拉选项标签
    setLabel (item) {
      let room = item.roomCode
        ? item.roomCode + '-' + item.roomName
        : item.roomName;
      let custN = item.leaseInfo ? '(' + item.leaseInfo.custName + ')' : '';
      return room + custN;
    },
    // 提交信息
    submitMsg () {
      this.$refs.msg_form.validate().then(result => {
        if (result) {
          let picPath = this.imageList.map(item => {
            return item.filePath;
          });
          let param = {
            houseId: this.houseId,
            roomId: this.formMsg.select.roomId,
            leaseId: this.formMsg.select.leaseInfo
              ? this.formMsg.select.leaseInfo.leaseId
              : '',
            tag: this.formMsg.select.label,
            images: picPath.join(),
            content: this.formMsg.content
          };
          addShareInfo(param).then(res => {
            this.$toast.success('信息已成功共享');
            this.imageList = [];
            this.formMsg = {
              content: '',
              select: undefined
            };
            setTimeout(() => {
              this.$router.go(-1);
            }, 1500);
          });
        } else {
          this.$toast.error('信息填写不完整！请检查必填项');
        }
      });
    },
    // 保存图片
    keepNewPic (param) {
      param.previewPath = param.visitPath + param.filePath;
      this.imageList.push(param);
    },
    // 删除图片
    deleteImage (index) {
      this.imageList.splice(index, 1);
    },
    // 图片预览
    lookHand (index, arr) {
      let list = [];
      arr.forEach(item => {
        if (item.previewPath) {
          list.push(item.previewPath);
        }
      });
      if (list.length === 0) return;
      this.viewBox = this.$Prive({
        imgList: list,
        current: index
      });
    }
  },
  beforeDestroy () {
    if (this.viewBox) this.viewBox.close();
  }
};
</script>
<style lang="less" scoped>
.step_form {
  padding: 20px;
}
.v_mainContainer {
  &.skipRem {
    padding-bottom: 65px;
  }
}
.title {
  font-weight: bold;
  color: #000000;
}
.pic_box {
  display: flex;
  flex-wrap: wrap;
}
.prive_image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 75px;
  height: 75px;
  border-radius: 5px;
  background-size: cover;
  background-position: center;
  position: relative;
  margin: 10px 6px 0 0;
  .delet_icon {
    top: -10px;
    right: -5px;
    width: 20px;
    height: 20px;
    position: absolute;
  }
  .img {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    vertical-align: middle;
  }
}
</style>
