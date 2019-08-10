import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import './assets/theme/theme-ecr/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import routes from './routes'
import Mock from './mock'
import MyPagination from './components/mypagination'

Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'
import './components/ecr-button-group/index.js'
import './components/ecr-tree-input/index.js'
import './components/ecr-resource-viewer/index.js'
import './components/mytree/index.js'
import './components/labeltree/index.js'
import './components/themetree/index.js'
import './components/myrate/index.js'
import './components/myresource/index.js'
import './components/ue/index.js'
import './components/my-tree-table/index.js'

import '../static/UE/ueditor.config.js'
import '../static/UE/ueditor.all.js'
import '../static/UE/lang/zh-cn/zh-cn.js'
import '../static/UE/ueditor.parse.min.js'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

import VTooltip from 'v-tooltip'
Vue.use(VTooltip)

import vSelect from 'vue-select'
Vue.component('v-select', vSelect)

const router = new VueRouter({
  routes:routes,
  mode:'history'
})

router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    localStorage.removeItem('backend-user');
    localStorage.removeItem('backend-token');
  }
  let user = localStorage.getItem('backend-user');
  if (user==null && to.path != '/login') {
    next({ path: '/login' });
  } else if (to.path == '/') {
    next({ path: '/home' });
  } else {
    next()
  }
})
window.EventHub = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')