import Vue from 'vue';
import Vuex from 'vuex';
import sales from './modules/sales.store';
import clean from './modules/clean.store';
import maintain from './modules/maintain.store';
import proprietor from './modules/proprietor.store';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    routeAction: 'push',
    reiseChange: false
  },
  mutations: {
    change_Action (st, val) {
      st.routeAction = val;
    },
    transform_resize (st, val) {
      st.reiseChange = val;
    }
  },
  modules: {
    sales,
    clean,
    proprietor,
    maintain
  }
});
