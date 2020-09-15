<template>
  <section class="v_page">
    <mu-appbar class="v_topNav" :title="navTxt" color="#fdd835" textColor="#000">
      <mu-button icon slot="left" @click="goBack">
        <mu-icon value="arrow_back"></mu-icon>
      </mu-button>
    </mu-appbar>
    <div
      class="v_mainContainer skipRem"
      v-loading="loading"
      data-mu-loading-overlay-color="transparent"
      data-mu-loading-color="#FDD835"
    >
      <addId-card
        :edit="code"
        @delete="deleteImage"
        :picList="currentImages"
        @submitImage="keepPic"
        @updateIdCard="updateIdCard"
      ></addId-card>
    </div>
  </section>
</template>
<script>
import {
  queryHousefiles,
  submitHouseFile,
  delHouseFile,
  queryHouseSubProp,
  subpropIdcard
} from '@/api/proprietorApi';
import addIdCard from './houseRegister/children/addIdCard';

export default {
  components: { addIdCard },
  data () {
    return {
      houseId: '',
      loading: false,
      code: '',
      editCatalog: 1,
      currentImages: []
    };
  },
  computed: {
    navTxt () {
      return this.code === 7 ? '业主证件照片' : '房源附件新增/编辑';
    }
  },
  created () {
    this.houseId = this.$route.query.houseId;
    this.code = Number(this.$route.query.edit);

    switch (this.code) {
      case 7:
        this.editCatalog = 2; // 2 身份证
        break;
      case 8:
        this.editCatalog = 1; // 合同
        break;
      case 9:
        this.editCatalog = 4; // 产权
        break;
      case 10:
        this.editCatalog = 3; // 委托证明
    }
    if (this.editCatalog === 2) {
      this.queryUserMsg(this.houseId);
    } else {
      this.getOldImages(this.houseId, this.editCatalog);
    }
  },
  methods: {
    // 返回上一级
    goBack () {
      this.$router.go(-1);
    },
    // 查询业主信息
    queryUserMsg (houseId) {
      this.loading = true;
      queryHouseSubProp(houseId).then(({ data }) => {
        this.loading = false;
        // 改变数据结构
        let temparr = [];
        temparr.push({
          identity: 1,
          ...data.proprietor
        });
        this.currentImages = temparr.concat(data.subPropList);
      });
    },
    // 获取 房源信息附件图片
    getOldImages (houseId, editCatalog) {
      this.loading = true;
      queryHousefiles(houseId, editCatalog).then(res => {
        this.loading = false;
        this.currentImages = res.data || [];
      });
    },
    // 更新 证件照片
    updateIdCard (param) {
      let index = arguments[1];
      let key = arguments[2];
      let paramObj = JSON.parse(JSON.stringify(this.currentImages[index]));
      paramObj[key] = arguments[0].filePath;
      this.loading = true;
      subpropIdcard(paramObj)
        .then(res => {
          this.loading = false;
          this.currentImages[index][key] = res.data[key];
        })
        .catch(e => {
          this.loading = false;
        });
    },
    // 保存图片
    keepPic (value) {
      this.loading = true;
      let url = value.filePath;
      let param = {
        houseId: this.houseId,
        catalog: this.editCatalog,
        url
      };
      if (this.code === 9) {
        param.subType = value.subType;
        param.remark = value.remark;
      }
      submitHouseFile(param).then(res => {
        this.loading = false;
        this.currentImages.push(res.data);
      });
    },
    // 删除图片
    deleteImage (value, i) {
      this.loading = true;
      delHouseFile(value.fileId).then(res => {
        this.loading = false;
        this.currentImages.splice(i, 1);
      });
    }
  }
};
</script>
<style lang="less" scoped>
.v_mainContainer {
  position: relative;
}
</style>
