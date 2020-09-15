/*
*@param{object}  传入的配置项
*@imgLst {Arrery} 预览图片的路径
*@current {Number} 当前展示的是第几张的下标 default 0
*/
import Prive from '../components/ImagePrive.vue';
import Vue from 'vue';
let PriveConstructor = Vue.extend(Prive);
let instance;
const install = () => {
  Object.defineProperty(Vue.prototype, '$Prive', {
    get () {
      const PriveMsg = options => {
        instance = new PriveConstructor({
          el: document.createElement('div'),
          propsData: { ...options }
        });
        instance.vm = instance.$mount('#app');
        document.body.appendChild(instance.vm.$el);
        instance.vm.$el.style.zIndex = 666;
        return instance.vm;
      };
      return PriveMsg;
    }
  });
};
export default install;
