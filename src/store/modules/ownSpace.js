import * as utils from '@/utils/index'
import Cookies from 'js-cookie'

const state = {
  serverAccessToken: '', //服务token
  userAccessToken: '', //用户token
  requests: [], // 所有的请求栈
  loading: false
}

//暴露getters供获取state的值
const getters = {
  serverAccessToken(state) {
    return state.serverAccessToken || Cookies.get('server_access_token')
  },
  userAccessToken() {
    return state.userAccessToken || Cookies.get('user_access_token')
  },
  loading(state) {
    return state.loading
  }
}

//state仓库中的数据状态改变操作
const mutations = {
  setServerAccessToken(state, payload) {
    state.serverAccessToken = payload.token
    //同步存储到cookie中设置token过期时间
    let expiresDate = new Date(new Date().getTime() + payload.expires_in * 1000)
    Cookies.set('server_access_token', payload.token, {
      expires: expiresDate
    })
  },
  pushRequest(state, payload) {
    //如果请求栈里没有这个请求则入栈
    if (!state.requests.includes(payload)) {
      state.requests.push(payload)
    }
    //把加载状态改为是
    state.loading = true
  },
  popRequest(state, payload) {
    //如果请求栈中有这个请求则出栈
    if (state.requests.includes(payload)) {
      let index = state.requests.findIndex(item => item == payload)
      state.requests.splice(index, 1)
    }
    //如果请求栈清空了，则把加载状态改为否
    if (state.requests.length == 0) {
      state.loading = false
    }
  },
  setLoading(state, payload) {
    state.loading = payload
  }
}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}
