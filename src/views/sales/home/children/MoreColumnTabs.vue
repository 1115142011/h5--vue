<template>
  <section class="fourColumnTabs">
    <div
      :class="[column==='four'? 'tabsItemFour':'tabsItemThree']"
      v-for="(item,index) in msgData"
      :key="index"
       @click="toleaseControl(item)"
    >
      <span class="title" :class="{blackFont:column==='three'}">{{item.title}}</span>
      <span class="fontWeight" :class="{blue:twoColor==='blue',weight:weight}">
        {{item.value}}
        <span class="symbol" v-if="item.sub">%</span>
      </span>
      <span
        class="hintMsg"
        :class="[threeColor==='green'? 'green':'blue']"
        v-if="item.hit"
      >{{item.hit}}</span>
    </div>
    <div class="no_data" v-if="!msgData||msgData.length===0">暂无数据~</div>
  </section>
</template>
<script>
export default {
  name: 'MoreColumnTabs',
  props: {
    msgData: Array, // 列表数据
    column: {
      // 使用三列布局还是4列布局 --默认为3列
      type: String,
      default: 'three'
    },
    twoColor: {
      // 第二行的字体颜色--默认为黑色 ---blue 蓝色
      type: String,
      default: ''
    },
    threeColor: {
      // 第三行的字体颜色--默认为绿色
      type: String,
      default: 'green'
    },
    weight: {
      // 第二行字体是否加粗 --默认为不加粗
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 跳转
    toleaseControl (item) {
      if (!item.leaseState) return;
      if (item.leaseState === 10000) {
        this.$router.push('/sales/TroubleLeaseList');
      } else {
        this.$store.commit('sales/mergeLeaseParam', {
          status: item.type, // 房间状态--tab 选中项参数
          addiCons: item.leaseState// 租约附加筛选状态
        });
        this.$router.push('/sales/leaseControl');
      }
    }
  }
};
</script>
<style lang="less" scoped>
.fourColumnTabs {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  font-size: 12px;
  .tabsItemThree,
  .tabsItemFour {
    width: 25%;
    display: flex;
    margin-top: 10px;
    flex-direction: column;
    color: #797979;
    text-align: center;
    .hintMsg {
      font-size: 12px;
    }
    .fontWeight {
      font-size: 16px;
      font-weight: 500;
      color: #000000;
      &.weight {
        font-size: 16px;
        font-weight: 600;
      }
    }
    .blue {
      color: #4285f4;
    }
    .green {
      color: #4eb75a;
    }
  }
  .tabsItemThree {
    width: 33.33%;
    .blackFont {
      color: #333333;
    }
  }
  .symbol {
    font-size: 12px;
  }
  .no_data {
    width: 100%;
    padding-top: 40px;
    text-align: center;
    color: #797979;
    font-size: 14px;
  }
}
</style>
