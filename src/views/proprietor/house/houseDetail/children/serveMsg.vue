<template>
  <mu-paper :z-depth="2" class="serve-box v_block" v-if="data">
    <div class="line-item">
      <span class="left-box v_ellipsis">服务类型</span>
      <span class="right-box v_ellipsis">{{setType(data.mode)}}</span>
    </div>
     <div class="line-item">
      <span class="left-box v_ellipsis">客户名</span>
      <span class="right-box v_ellipsis">{{data.ownerName}}</span>
    </div>
    <div class="line-item">
      <span class="left-box v_ellipsis">起始时间</span>
      <span class="right-box v_ellipsis">{{data.beginDate}}</span>
    </div>
    <div class="line-item">
      <span class="left-box v_ellipsis">截止日期</span>
      <span class="right-box v_ellipsis">{{data.endDate}}</span>
    </div>
    <div class="line-item">
      <span class="left-box v_ellipsis">其它服务</span>
      <span class="right-box v_ellipsis">--</span>
    </div>
    <div class="line-item">
      <span class="left-box v_ellipsis">房源负责人</span>
      <span class="right-box v_ellipsis">{{data.respPersonName}}</span>
    </div>
    <div class="line-item large-top">
      <span class="left-box v_ellipsis">销售团队</span>
      <span class="right-box v_ellipsis">{{data.teamName}}</span>
    </div>
     <div class="line-item">
      <span class="left-box v_ellipsis">责任销售</span>
      <span class="right-box v_ellipsis">{{data.saler}}</span>
    </div>
     <div class="line-item">
      <span class="left-box v_ellipsis">责任管家</span>
      <span class="right-box v_ellipsis">{{data.manager?data.manager:'--'}}</span>
    </div>
  </mu-paper>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  methods: {
    setType (mode) {
      let str = '';
      switch (mode) {
        case 1:
          str = '包租';
          break;
        case 2:
          str = '托管';
          break;
        case 3:
          str = '闪租';
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
.serve-box{
  padding:20px 20px 35px;
  margin-bottom: 20px;
}
.line-item{
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #707070;
  margin-top: 10px;
}
.left-box{
  flex: 3;
  font-weight: bold;
  font-size: 14px;
}
.right-box{
  margin-left: 5px;
  flex: 7;
  display: flex;
  justify-content: flex-end;
}
.large-top{
  margin-top: 25px;
}
</style>
