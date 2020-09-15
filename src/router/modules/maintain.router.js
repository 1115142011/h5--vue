export default [
  // 维修工单
  {
    path: '/repair',
    name: 'repair',
    // component: Repair
    component: () => import('@/views/maintain/Repair')

  },
  // 维修申请1
  {
    path: '/applyOne',
    name: 'applyOne',
    // component: ApplyOne
    component: () => import('@/views/maintain/ApplyOne')

  },
  // 维修申请2
  {
    path: '/applyTwo',
    name: 'applyTwo',
    // component: ApplyTwo
    component: () => import('@/views/maintain/ApplyTwo')

  },
  // 工单详情
  {
    path: '/workSheet',
    name: 'workSheet',
    // component: WorkSheet
    component: () => import('@/views/maintain/WorkSheet')

  },

  // 定责
  {
    path: '/fixDuty',
    name: 'fixDuty',
    // component: FixDuty
    component: () => import('@/views/maintain/FixDuty')
  },
  // 拒修
  {
    path: '/refuseOne',
    name: 'refuseOne',
    // component: RefuseOne
    component: () => import('@/views/maintain/RefuseOne')

  },
  {
    path: '/refuseTwo',
    name: 'refuseTwo',
    // component: RefuseTwo
    component: () => import('@/views/maintain/RefuseTwo')

  },
  {
    path: '/refuseThree',
    name: 'refuseThree',
    // component: RefuseThree
    component: () => import('@/views/maintain/RefuseThree')

  },
  // 退回
  {
    path: '/returnOne',
    name: 'returnOne',
    // component: ReturnOne
    component: () => import('@/views/maintain/ReturnOne')

  },
  {
    path: '/returnTwo',
    name: 'returnTwo',
    // component: ReturnTwo
    component: () => import('@/views/maintain/ReturnTwo')

  },
  // 完成
  {
    path: '/finishOne',
    name: 'finishOne',
    // component: FinishOne
    component: () => import('@/views/maintain/FinishOne')

  },
  {
    path: '/finishTwo',
    name: 'finishTwo',
    // component: FinishTwo
    component: () => import('@/views/maintain/FinishTwo')

  },
  {
    path: '/finishThree',
    name: 'finishThree',
    // component: FinishThree
    component: () => import('@/views/maintain/FinishThree')

  },
  {
    path: '/finishFour',
    name: 'finishFour',
    // component: FinishFour
    component: () => import('@/views/maintain/FinishFour')

  },
  // 费用详情
  {
    path: '/feelDetail',
    name: 'feelDetail',
    // component: FeelDetail
    component: () => import('@/views/maintain/FeelDetail')

  },
  // 未拨通
  {
    path: '/callFailed',
    name: 'callFailed',
    // component: CallFailed
    component: () => import('@/views/maintain/CallFailed')

  },
  // 未完成
  {
    path: '/notFinishedOne',
    name: 'notFinishedOne',
    // component: NotFinishedOne
    component: () => import('@/views/maintain/NotFinishedOne')

  },
  {
    path: '/notFinishedTwo',
    name: 'notFinishedTwo',
    // component: NotFinishedTwo
    component: () => import('@/views/maintain/NotFinishedTwo')

  },
  {
    path: '/notFinishedThree',
    name: 'notFinishedThree',
    // component: NotFinishedThree
    component: () => import('@/views/maintain/NotFinishedThree')
  },
  // 维修驳回列表
  {
    path: '/maintain/rejectCost',
    name: 'rejectCost',
    component: () => import('@/views/maintain/rejectCost/index')
  },
  // 维修驳回详情
  {
    path: '/rejectCost/rejectDetail',
    name: 'rejectDetail',
    component: () => import('@/views/maintain/rejectCost/rejectDetail')

  }
];
