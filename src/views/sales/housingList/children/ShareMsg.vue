<template>
  <section class="share_wrap" ref="container">
      <mu-paper class="v_block" :z-depth="1" v-for="(item,index) in listData" :key="index+'1'">
        <div class="title">
          <span>{{item.operator}}</span>
          <span class="tag">{{item.tag}}</span>
        </div>
        <div class="msg_content">
          <div class="msg_text">{{item.content}}</div>
          <div class="pic-box">
            <img class="image" v-lazy="val" alt v-for="(val,i) in item.imageArray" :key="i+'i'" @click="lookHand(item.imageArray,i)" />
          </div>
          <div class="time">{{item.createTime}}</div>
        </div>
      </mu-paper>
      <div class="footer_space"></div>
  </section>
</template>
<script>
export default {
  props: {
    listData: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  data () {
    return {
      viewBox: null
    };
  },
  methods: {
    // 图片预览
    lookHand (arr, index) {
      if (arr.length === 0) return;
      this.viewBox = this.$Prive({
        imgList: arr,
        current: index
      });
    }
  },
  beforeDestroy () {
    if (this.viewBox) this.viewBox.close();
  }
};
</script>
<style lang="less" scoped >
.share_wrap {
  width: 100%;
  .v_block {
    padding-left: 28px;
  }
}
.title {
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 10px;
  font-weight: bold;
  border-bottom: solid 1px #797979;
}
.msg_content {
  padding: 22px 0;
  padding-right: 20px;
  .pic-box {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .image {
      width: 88px;
      height: 88px;
      margin-top: 10px;
      margin-right: 14px;
      border-radius: 10px;
    }
    .image:nth-child(3n) {
      margin-right: 0;
    }
  }
}
.sex_pic {
  width: 36px;
  height: 36px;
}
.tag {
  height: 24px;
  padding: 0 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e4e4e4;
  color: #969696;
  font-weight: 500;
  border-radius: 20px;
  margin: 0 8px;
}
.time {
  margin-top: 15px;
}
.footer_space{
  padding: 5px;
  margin-top: 10px
}
</style>
