/*
*销售模块路由文件
*/
export default [
  {
    path: '/sales/home', // 首页
    name: 'sales',
    component: () => import('@/views/sales/home/Default')
  },
  {
    path: '/sales/transfer', // 中转页面
    name: 'transfer',
    component: () => import('@/components/Transfer')
  },
  {
    path: '/sales/home/WorkDetails', // 团队工作数据详情
    name: 'WorkDetails',
    component: () => import('@/views/sales/home/WorkDetails')
  },
  {
    path: '/sales/home/HouseDetails', // 团队楼盘数据详情
    name: 'HouseDetails',
    component: () => import('@/views/sales/home/HouseDetails')
  },
  {
    path: '/sales/housingList', // 房源查询
    name: 'housingList',
    meta: {
      keepalive: true // 组件是否需要被保存
    },
    component: () => import('@/views/sales/housingList/Defaulte')
  },
  {
    path: '/sales/RoomDetails', // 房源详情
    name: 'RoomDetails',
    component: () => import('@/views/sales/housingList/RoomDetails')
  },
  {
    path: '/sales/DiscountCoupon', // 优惠信息详情
    name: 'DiscountCoupon',
    component: () => import('@/views/sales/housingList/DiscountCoupon')
  },
  {
    path: '/sales/UpdateDetailImage', // 更新房源照片
    name: 'UpdateDetailImage',
    component: () => import('@/views/sales/housingList/UpdateDetailImage')
  },
  {
    path: '/sales/orderFlow/onlineReserve', // 在线签约
    name: 'onlineReserve',
    component: () => import('@/views/sales/orderFlow/onlineSign/OnlineReserve')
  },
  {
    path: '/sales/orderFlow/reserveSinger', // 预定转-在线签约
    name: 'reserveSinger',
    component: () => import('@/views/sales/orderFlow/onlineSign/OnlineReserve')
  },
  {
    path: '/sales/orderFlow/continuous', // 续租
    name: 'continuous',
    component: () => import('@/views/sales/orderFlow/onlineSign/OnlineReserve')
  },
  {
    path: '/sales/orderFlow/reserve', // 预定
    name: 'reserve',
    component: () => import('@/views/sales/orderFlow/prevReserve/Reserve')
  },
  {
    path: '/sales/orderFlow/inadvance/reserve', // 提前预定
    name: 'inadvanceReserve',
    component: () => import('@/views/sales/orderFlow/prevReserve/Reserve')
  },
  {
    path: '/sales/orderFlow/ChangeReserve', // 预定变更
    name: 'ChangeReserve',
    component: () => import('@/views/sales/orderFlow/prevReserve/ChangeReserve')
  },
  {
    path: '/sales/orderFlow/sublease', // 转租
    name: 'sublease',
    component: () => import('@/views/sales/orderFlow/sublease/Sublet')
  },
  {
    path: '/sales/orderFlow/quitLease', // 退租
    name: 'quitLease',
    component: () => import('@/views/sales/orderFlow/quitLease/AbortLease')
  },
  {
    path: '/sales/orderFlow/transform', // 换租
    name: 'transformLease',
    component: () => import('@/views/sales/orderFlow/transform/TransformLease')
  },
  {
    path: '/sales/authentication', // 用户认证
    name: 'userAuthentication',
    component: () => import('@/views/sales/customerAuthenticat/Authentication')
  },
  {
    path: '/sales/leaseControl', // 租约管理
    name: 'salseLeaseControl',
    meta: {
      keepalive: true // 组件是否需要被保存
    },
    component: () => import('@/views/sales/leaseControl/Lease')
  },
  {
    path: '/sales/leaseDetails', // 租约详情
    name: 'leaseDetails',
    component: () => import('@/views/sales/leaseControl/children/LeaseDetails')
  },
  {
    path: '/sales/leaseBill', // 租约账单
    name: 'leaseBill',
    component: () => import('@/views/sales/leaseControl/LeaseBill')
  },
  {
    path: '/sales/Contract', // 电子合同
    name: 'Contract',
    component: () => import('@/components/Contract')
  },
  {
    path: '/sales/TroubleLeaseList', // 退租驳回
    name: 'TroubleLeaseList',
    component: () => import('@/views/sales/rejectLease/TroubleLeaseList')
  },
  {
    path: '/sales/PrepositionLease', // 提前预定管理
    name: 'PrepositionLease',
    component: () => import('@/views/sales/leaseControl/PrepositionLease')
  },
  {
    path: '/sales/historyLease', // 历史租约
    name: 'historyLease',
    component: () => import('@/views/sales/leaseControl/HistoryLease')
  },
  {
    path: '/sales/partner', // 同住人
    name: 'Partner',
    component: () => import('@/views/sales/leaseControl/Partner')
  },
  {
    path: '/sales/addsharemsg', // 添加共享信息
    name: 'AddShareMg',
    component: () => import('@/views/sales/housingList/AddShareMsg')
  },
  {
    path: '/sales/healthlist', // 健康打卡列表
    name: 'healthlist',
    component: () => import('../../views/sales/housingList/HealthList')
  }

];
