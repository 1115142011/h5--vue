<template>
  <section class="steper-wrap" :class="{center:center}">
    <div class="step-item" v-for="(item,index) in contentList" :key="index+'i'">
      <span class="line-bar" v-if="index>0"></span>
      <span class="text-box skipRem" :class="{present:index===status,finsh:index<status}">{{item}}</span>
    </div>
    <span class="footer-processes" :style="{width:width}"></span>
  </section>
</template>

<script>
export default {
  props: {
    content: {
      type: Array,
      default: function () {
        return [];
      }
    },
    center: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    current () {
      return this.$store.state.proprietor.registerStep - 1 || 0;
    },
    baseData () {
      return this.$store.state.proprietor.formParams; // 1  整租,2分组
    },
    contentList () {
      let tempArr = ['业主', '托管', '定价', '标准', '照片'];
      if (this.baseData.rentMode === 2) {
        switch (this.current) {
          case 3:
            tempArr[3] = '1/3';
            break;
          case 4:
            tempArr[3] = '2/3';
            break;
          case 5:
            tempArr[3] = '3/3';
            break;
          default:
            break;
        }
      } else {
        switch (this.current) {
          case 4:
            tempArr[3] = '1/2';
            break;
          case 5:
            tempArr[3] = '2/2';
            break;
          default:
            break;
        }
      }

      return tempArr;
    },
    width () {
      let num = this.current;
      let total = this.contentList.length;
      if (isNaN(num) || num === 0) return '58px';
      if (this.current >= 3 && this.current <= 5) return parseInt(4 / total * 100) + '%';
      if (num > total) return '100%';
      return parseInt((num + 1) / total * 100) + '%';
    },
    status () {
      let step = 0;
      switch (this.current) {
        case 3:
          step = 3;
          break;
        case 4:
          step = 3;
          break;
        case 5:
          step = 3;
          break;
        default:
          step = this.current > 4 ? 4 : this.current;
          break;
      }
      return step;
    }
  }
};
</script>
<style lang="less" scoped>
.steper-wrap {
  padding: 20px 10px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: nowrap;
  position: relative;
  overflow: hidden;
  color: #6d5d16;
}
.text-box.skipRem {
  min-width: 40px;
  padding: 0 8px;
  border-radius: 3px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.line-bar {
  width: 17px;
  height: 2px;
  background: #e1e1e1;
  margin: 0 3px;
}
.step-item {
  display: flex;
  align-items: center;
}
.footer-processes {
  height: 4px;
  position: absolute;
  left: 0;
  bottom: 0;
  background: #8ec0fc;
  min-width: 61px;
  transition:width  0.5s;
}
.text-box {
  background: #f4f4f4;
  color: #B3B3B3;
}
.present {
  background: #fdd835;
}
.finsh {
  background: #cef9c3;
  color: #67cd4d;
}
</style>
