<template>
    <section class="tenant_wrap">
         <mu-paper class="v_block" :z-depth="1" v-for="(item,index) in listData" :key="index+'i'">
             <div class="title">{{item.roomCode}}-{{item.roomName}}{{item.leaseInfo?'('+item.leaseInfo.custName+')':''}}</div>
             <div class="msg_content" v-if="item.leaseInfo">
                 <img class="sex_pic" :src="item.leaseInfo.custSex=='1'?man:laday" alt="头像">
                 <span class="tag">{{item.leaseInfo.custAgeGroup}}</span>
                 <span class="tag">{{item.leaseInfo.custConstellation}}</span>
                  <mu-button color="#FDD835" textColor="#000000" @click="goHealthList(item.leaseInfo.custId)">打卡记录</mu-button>
             </div>
             <div class="msg_content v_footerHint" v-else-if="!item.leaseInfo">
                 <span class="hint">空置</span>
             </div>
         </mu-paper>
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
      man: require('../../../../assets/images/sales/sex_man.png'),
      laday: require('../../../../assets/images/sales/sex_laday.png')
    };
  },
  methods: {
  // 跳转打卡记录
    goHealthList (id) {
      this.$router.push({
        path: '/sales/healthlist',
        query: {
          custId: id
        }
      });
    }
  }
};
</script>
<style lang="less" scoped >
.tenant_wrap{
    width: 100%;
    .v_block{
        padding-left: 28px;
    }
}
.title{
    padding: 10px 0;
    font-weight: bold;
    border-bottom: solid 1px #797979;
}
.msg_content{
    padding: 22px 0;
    min-height: 36px;
    padding-right: 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.sex_pic{
    width: 36px;
    height: 36px;
}
.tag{
    height: 36px;
    padding:0 15px ;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #E6EFFF;
    color: #498DFF;
    border-radius: 20px;
    margin: 0 8px;
}
.hint{
    width: 100%;
    color: #C4C4C4;
    font-size: 18px;
    font-weight: bold;
    letter-spacing:5px;
}
</style>
