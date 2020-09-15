export default {
  namespaced: true,
  state: {
    editReiectCost: null
  },
  mutations: {
    setEditReiectCost (st, val) {
      st.editReiectCost = val;
    }
  }
};
