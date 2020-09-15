export default [
  // 保洁
  {
    path: '/clean',
    name: 'clean',
    component: () => import('@/views/clean/list/Default')
  },
  {
    path: '/order/:orderId',
    name: 'order',
    component: () => import('@/views/clean/order/Default')
  }
];
