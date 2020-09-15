<template>
 <div class="outer_box">
    <mu-paper class="code_box" :z-depth="4">
        <vue-qr :logo-src="logoSrc"
          :size="140"
          :margin="0"
          :auto-color="true"
          :dot-scale="1"
          :text="myCode" />
    </mu-paper>
 </div>
</template>
<script>
import VueQr from 'vue-qr';
export default {
  components: { VueQr },
  props: {
    myCode: {
      type: String,
      default: '' // 二维码内容
    },
    logoSrc: {
      type: String,
      default: ''
    }
  },
  methods: {
    setListData (arr) {
      if (!arr || arr.length === 0) return [];
      let tempArr = [];
      arr.forEach(item => {
        switch (item.recv_mode) {
          case 1:
            item.rightMgs = `包干${item.cost}元/月`;
            break;
          case 2:
            item.rightMgs = `租客自缴`;
            break;
          case 3:
            item.rightMgs = `公司代缴`;
            break;
          default:
            break;
        }
        tempArr.push(item);
      });
      return tempArr;
    }
  }
};
</script>
<style lang="less" scoped>
.outer_box{
    width: 100%;
    padding: 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .code_box{
        padding: 10px;
    }
}
</style>
