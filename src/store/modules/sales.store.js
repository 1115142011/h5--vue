export default {
  namespaced: true,
  loginType: undefined,
  state: {
    // 标签筛选数据
    tags: [
      {
        name: '租赁方式',
        tags: [
          {
            name: '合租',
            value: 1,
            type: 'rent_mode',
            selected: false
          },
          {
            name: '整租',
            value: 0,
            type: 'rent_mode',
            selected: false
          }
        ]
      },
      {
        name: '户型',
        tags: [
          {
            name: '主卧',
            type: 'room_type',
            value: 1,
            selected: false
          },
          {
            name: '套二',
            value: 10,
            type: 'room_type',
            selected: false
          },
          {
            name: '套三',
            type: 'room_type',
            value: 11,
            selected: false
          },
          {
            name: '套四',
            value: 12,
            type: 'room_type',
            selected: false
          },
          {
            name: '套五',
            value: 13,
            type: 'room_type',
            selected: false
          },
          {
            name: '次卧',
            value: 2,
            type: 'room_type',
            selected: false
          },
          {
            name: '客厅间',
            value: 3,
            type: 'room_type',
            selected: false
          },
          {
            name: '标间',
            value: 4,
            type: 'room_type',
            selected: false
          },
          {
            name: '小间',
            value: 5,
            type: 'room_type',
            selected: false
          },
          {
            name: '客阳',
            value: 6,
            type: 'room_type',
            selected: false
          },
          {
            name: '次阳',
            value: 7,
            type: 'room_type',
            selected: false
          },
          {
            name: '主卫',
            value: 8,
            type: 'room_type',
            selected: false
          },
          {
            name: '套一',
            value: 9,
            type: 'room_type',
            selected: false
          }
        ]
      }
    ],
    leaseControlTagNumber: [],
    userData: {
      name: '', // 登陆人姓名,
      group_id: '', // 登陆人所在团队的id
      personId: '', // 登陆人的id
      user_rank: '' // 个人排名
    },
    roomParams: {
      room_id: '',
      lease_id: ''
    },
    customer: {// 租约中的顾客信息
      name: '',
      mobile: '',
      idCard: ''
    },
    leaseFormData: {
      emergContact: undefined
    }, // 租约流程中的表单数据
    quitFormData: {}, // 退租流程表单数据
    roomDetailTab: 0, // 房间详情的tab状态
    footerNavStatus: 'serve', // 首页底部导航状态
    roomMsgName: '', // 租约流程中的房间名称
    houseScrollTop: 0, // 房源列表滚动条高度
    leasePageScrollTop: 0, // 租约管理滚动条高度
    partnerArry: [], // 同住人数组
    tenantArray: [], // 房间列表带租客
    leasePageParam: {
      status: 0
    } // 租约管理导航参数
  },
  mutations: {
    setTenantArray (st, val) {
      st.tenantArray = val;
    },
    setpartnerArry (st, val) {
      st.partnerArry = val;
    },
    setTagsData (st, val) {
      st.tags = JSON.parse(JSON.stringify(val));
    },
    setUserMsg (st, val) {
      st.userData = val;
    },
    setRoomParams (st, val) {
      st.roomParams = val;
    },
    setCustomerMsg (st, val) {
      st.customer = val;
    },
    // 合并租约数据
    writeInFormData (st, val) {
      st.leaseFormData =
        Object.assign(st.leaseFormData, val);
    },
    initleaseFormData (st, val) {
      st.leaseFormData = {
        emergContact: undefined
      };
    },
    // 合并退租数据
    mergeQuitFormData (st, val) {
      st.quitFormData =
        Object.assign(st.quitFormData, val);
    },
    initquitFormData (st, val) {
      st.quitFormData = {};
    },
    // 设置房间详情的tab选中项
    setRoomDetailCurrentTab (st, val) {
      st.roomDetailTab = val;
    },
    // 设置首页底部导航状态
    setFooterNavStatus (st, val) {
      st.footerNavStatus = val;
    },
    // 设置租约流程中德房源名
    setOrderFlowName (st, val) {
      st.roomMsgName = val;
    },
    // 设置房源列表滚动条高度
    setHouseScroll (st, val) {
      st.houseScrollTop = val;
    },
    // 设置租约列表滚动条高度
    setLeaseScroll (st, val) {
      st.leasePageScrollTop = val;
    },
    // 租约管理筛选项的标签，数量数据
    setLeaseTagNumber (st, val) {
      st.leaseControlTagNumber = val;
    },
    // 合并租约·1管理导航参数
    mergeLeaseParam (st, val) {
      st.leasePageParam =
        Object.assign(st.leasePageParam, val);
    },
    // 保存账号类型
    keepLoginType (st, val) {
      st.loginType = val;
    }
  },
  actions: {
  },
  getters: {
    tags: state => state.tags
  }
};
