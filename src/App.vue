<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepalive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepalive"></router-view>
    <lg-preview></lg-preview>
  </div>
</template>
<script>
import fixedInput from '@/mixins/fixedInput';

export default {
  mixins: [fixedInput],
  data () {
    return {
      initHeight: undefined,
      flag: false
    };
  },
  updated () {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      // 解决ios输入框弹出的页面样式问题
      document.querySelectorAll('input').forEach(item => {
        // item.removeEventListener('blur', this.temporaryRepair);
        // item.removeEventListener('focus', this.fouce);

        item.addEventListener('blur', this.temporaryRepair);
        item.addEventListener('focus', this.fouce);
      });
      document.querySelectorAll('textarea').forEach(item => {
        item.removeEventListener('blur', this.temporaryRepair);
        item.removeEventListener('focus', this.fouce);
        item.addEventListener('blur', this.temporaryRepair);
        item.addEventListener('focus', this.fouce);
      });
    }
  },
  mounted () {
    if (/android/i.test(navigator.userAgent)) {
      this.clearCache();
      this.initHeight = document.documentElement.clientHeight; // 当前高度
      // 监控手机软键盘是否弹出
      let vm = this;
      window.addEventListener('resize', function () {
        let screenHeight = document.documentElement.clientHeight;
        if (vm.initHeight - screenHeight >= 60) {
          vm.flag = true;
        } else {
          vm.flag = false;
        }
        if (
          document.activeElement.tagName.toUpperCase() === 'INPUT' ||
          document.activeElement.tagName.toUpperCase() === 'TEXTAREA'
        ) {
          window.setTimeout(function () {
            document.activeElement.scrollIntoView({
              block: 'center'
            });
          }, 50);
        }
      });
    }
  },
  methods: {
    clearCache () {
      let currentVersion = '2.1.0';
      let oldVersion = localStorage.getItem('versions') || '';
      if (currentVersion !== oldVersion) {
        localStorage.setItem('versions', currentVersion);
        window.location.reload(true);
      }
    }
  },
  watch: {
    flag: function (newVal, oldVal) {
      this.$store.commit('transform_resize', newVal);
    }
  }
};
</script>
<style lang="less">
html,
body,
#app {
  width: 100%;
  height: 100%;
  background-color: #eeeeee;
}

//路由 切换动画
.push-enter-active,
.push-leave-active,
.pop-enter-active,
.pop-leave-active {
  transition: all 0.2s;
}
.push-leave-to {
  transform: translate(-20%, 0);
}

.push-enter {
  transform: translate(100%, 0);
}
.push-enter-active {
  z-index: 10;
}
.push-leave-active {
  z-index: 0;
}
.pop-leave-active {
  transform: translate(100%, 0);
  z-index: 11;
}
.pop-enter {
  transform: translate(-20%, 0);
}
</style>
