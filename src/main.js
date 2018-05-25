// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import router from '@/router/index'
import store from '@/store/index'
import App from './App'

import promise from 'es6-promise'
promise.polyfill()

import '@/assets/font/iconfont.css'
import 'iview/dist/styles/iview.css'

import iView from 'iview'
Vue.use(iView)

import {
  Flexbox,
  FlexboxItem
} from 'vux'
Vue.component('flexbox', Flexbox)
Vue.component('flexbox-item', FlexboxItem)

import utils from '@/utils/utils'
import bus from '@/utils/bus'
import net from '@/network/index'
Vue.prototype.$utils = utils
Vue.prototype.$bus = bus
Vue.prototype.$net = net

utils.initHeader()

FastClick.prototype.focus = function (targetElement) {
  targetElement.focus()
}
FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
