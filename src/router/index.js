import Vue from 'vue';
import Router from 'vue-router';
// import maintain from './modules/maintain.router'
// import sales from './modules/sales.router'

let routerList = [];
let getALLRouterMsg = (file) => {
  file.keys().forEach(
    (key) => routerList.push(...file(key).default)
  );
};
getALLRouterMsg(require.context('./modules', true, /\.router\.js$/));
Vue.use(Router);
// console.log(process.env.BASE_URL);
export default new Router({
  mode: 'hash',
  // base: 'maintain',
  // base: 'sale',
  routes: [
    // 登录页面
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/Login.vue')
    },
    // 首页
    {
      path: '/index',
      name: 'index',
      component: () => import('@/views/Index')
    },
    ...routerList
    // ...maintain,
    // ...sales
  ]
});
