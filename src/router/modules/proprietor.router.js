export default [
  // 托管房源列表
  {
    path: '/proprietor',
    name: 'proprietorHouseList',
    meta: {
      keepalive: true // 组件是否需要被保存
    },
    component: () => import('@/views/proprietor/house/index')
  },
  // 房源详情
  {
    path: '/proprietor/houseDetails',
    name: 'houseDetails',
    component: () => import('@/views/proprietor/house/houseDetail/index')
  },
  // 添加房源入口
  {
    path: '/proprietor/addHouse',
    name: 'addHouse',
    component: () => import('@/views/proprietor/house/addHouseEntry')
  },
  // 房源登记
  {
    path: '/proprietor/houseRegister',
    name: 'houseRegister',
    component: () => import('@/views/proprietor/house/houseRegister/index')
  },
  // 房源编辑中转
  {
    path: '/proprietor/editFlat',
    name: 'editFlat',
    component: () => import('@/views/proprietor/house/editHouse')
  },
  // 房源附件照片新增/更新
  {
    path: '/proprietor/updateHouseFile',
    name: 'editFile',
    component: () => import('@/views/proprietor/house/updateHouseFile')
  },
  // 历史租约
  // 房源附件照片新增/更新
  {
    path: '/proprietor/historyLease',
    name: 'proprietorhistoryLease',
    component: () => import('@/views/proprietor/house/houseDetail/historyLease')
  }

];
