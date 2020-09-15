import Vue from 'vue';
import App from './App.vue';
import router from './router';
import 'babel-polyfill';
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import Toast from 'muse-ui-toast';
import Message from 'muse-ui-message';
import Loading from 'muse-ui-loading';
import 'material-design-icons/iconfont/material-icons.css';
import './global.less';
import VueDirectiveImagePreviewer from 'vue-directive-image-previewer';
import 'vue-directive-image-previewer/dist/assets/style.css';
import vuePicturePreview from 'vue-picture-preview';
import 'lib-flexible';
import store from './store/index';
import imgprive from './utils/ImagePeive';
import VueLazyLoad from 'vue-lazyload';
// 调试
// import Vconsole from 'vconsole';
// 滑屏组件
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css'; // 导入文件
import moment from 'moment';
Vue.use(VueLazyLoad, {
  preLoad: 1.3,
  error: require('@/assets/images/noImageList.png'),
  loading: require('@/assets/images/defaultPx.gif'),
  attempt: 1
});
// const vConsole = new Vconsole();
// Vue.use(vConsole);
Vue.use(imgprive);

Vue.prototype.Moment = moment;
Vue.prototype.$Moment = moment;
Vue.use(VueAwesomeSwiper);
// 图片预览
Vue.use(vuePicturePreview);
Vue.use(VueDirectiveImagePreviewer);
Vue.use(MuseUI); // 引入全局muse-ui
Vue.use(Toast, {
  position: 'bottom', // 弹出的位置
  time: 2000, // 显示的时长
  closeIcon: 'close', // 关闭的图标
  close: true, // 是否显示关闭按钮
  successIcon: 'check_circle', // 成功信息图标
  infoIcon: 'info', // 信息信息图标
  warningIcon: 'priority_high', // 提醒信息图标
  errorIcon: 'warning' // 错误信息图标
});
// 消息提示组件
Vue.use(Message);
// loading
Vue.use(Loading, {
  overlayColor: 'hsla(0, 0%, 0%, 0.5)', // 背景色
  size: 24,
  color: 'rgb(171, 186, 247)' // 文字颜色
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
