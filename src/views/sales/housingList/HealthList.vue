<template>
  <section class="v_page">
    <!-- 导航 -->
    <mu-appbar class="v_topNav" color="#fdd835" textColor="#000">
        <mu-button icon slot="left" @click="goBack">
          <mu-icon value="arrow_back"></mu-icon>
        </mu-button>
    健康信息查询
    </mu-appbar>
    <!-- 内容区 -->
    <div class="v_mainContainer skipRem">
      <msg-card :listData="list" ></msg-card>
    </div>
  </section>
</template>
<script>
import msgCard from './children/MsgCard';
import { queryHealthMsg } from '@/api/salesApi';
// import { getRecordByHouse } from '@/api/wxSurveyApi';
export default {
  components: { msgCard },
  data () {
    return {
      list: []
    };
  },
  created () {
    let custId = this.$route.query.custId;
    this.getData(custId);
  },
  methods: {
    // 返回
    goBack () {
      this.$router.go(-1);
    },
    setList (arr) {
      console.log('arr', arr);
      if (!arr || arr.length === 0) return [];
      return arr.map(item => {
        item.list.map(val => {
          val.loading = false;
          val.passLoading = false;
          val.Cardloading = false;
          return val;
        });
        return item;
      });
    },
    // 更新数据
    getData (id) {
      queryHealthMsg(id).then(res => {
        this.list = res.data.records;
      });
    }
  }
};
</script>
<style lang="less" scoped>
.v_mainContainer {
  &.skipRem {
    padding-bottom: 65px;
  }
}
.v_block {
  padding-bottom: 35px;
  background: #f6f6f4;
}
.title_text {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
