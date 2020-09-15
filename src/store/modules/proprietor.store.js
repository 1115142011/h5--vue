export default {
  namespaced: true,
  state: {
    houseScrollTop: 0, // 房源列表滚动条高度
    roomDetailTab: 0, // 房间详情的tab状态
    registerStep: 0, // 托管房登记表单step
    formParams: {}, // 添加房源表单数据
    editHouseName: '' // 正在编辑的房源名称
  },
  mutations: {
    setEditHouseName (st, val) {
      st.editHouseName = val;
    },
    // 设置房间详情的tab选中项
    setRoomDetailCurrentTab (st, val) {
      st.roomDetailTab = val;
    },
    // 设置房源列表滚动条高度
    setHouseScroll (st, val) {
      st.houseScrollTop = val;
    },
    // 设置托管表单step
    changeRegisterStep (st, data) {
      let{ direction, stepNumber } = data;
      stepNumber = stepNumber || 1;
      if (direction === 'next') {
        st.registerStep = st.registerStep + stepNumber;
      } else if (direction === 'prev') {
        st.registerStep = st.registerStep - stepNumber;
      }
    },
    setRegisterStep (st, val) {
      st.registerStep = val;
    },
    // 添加房源信息步进重置
    resetRegisterStep (st) {
      st.registerStep = 0;
    },
    // 添加房源表单数据缓存
    writeFormParam (st, val) {
      st.formParams =
      Object.assign(st.formParams, val);
    },
    // 重置表单数据
    resetFormParam (st, val) {
      st.formParams = {};
    }

  }
};
