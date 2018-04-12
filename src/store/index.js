import Vue from 'vue'
import Vuex from 'vuex'

import ownSpace from './modules/ownSpace'
import swwd from './modules/swwd'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    ownSpace,
    swwd
  }
})
