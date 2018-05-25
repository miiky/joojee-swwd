import Cookies from 'js-cookie'

const state = {
  serverAccessToken: '', //服务token
  code: '', // code
  userAccessToken: '', //用户token
  sessionKey: '', //jeebbs凭证
  expiresDate: 0, // cookie过期时间
  userId: '', //用户Id
  isClientLogin: false, //客户端登陆状态
  requests: [], // 所有的请求栈
  loading: false, //页面toast模式
  topLoading: false, //页面顶部菊花模式
  showPopup: false, //顶部pop模式提示
  popupType: 'info', //pop提示类型  ['success','info','warning','error']
  popupMsg: '' // pop提示内容
}

//暴露getters供获取state的值
const getters = {
  serverAccessToken(state) {
    return state.serverAccessToken || Cookies.get('server_access_token')
  },
  userAccessToken() {
    return state.userAccessToken || Cookies.get('user_access_token')
  },
  token() {
    return (
      Cookies.get('user_access_token') || Cookies.get('server_access_token')
    )
  },
  code() {
    return state.code
  },
  sessionKey() {
    return state.sessionKey || Cookies.get('session_key')
  },
  userId(state) {
    return state.userId || Cookies.get('userId')
  },
  loading(state) {
    return state.loading
  },
  topLoading(state) {
    return state.topLoading
  },
  showPopup(state) {
    return state.showPopup
  },
  popupType(state) {
    return state.popupType
  },
  popupMsg(state) {
    return state.popupMsg
  },
  isClientLogin(state) {
    return state.isClientLogin
  }
}

//state仓库中的数据状态改变操作
const mutations = {
  /**设置服务token */
  setServerAccessToken(state, payload) {
    state.serverAccessToken = payload.token
    //同步存储到cookie中设置token过期时间
    let expiresDate = new Date(new Date().getTime() + payload.expires_in * 1000)
    Cookies.set('server_access_token', payload.token, {
      expires: expiresDate
    })
  },
  /**设置用户token */
  setUserAccessToken(state, payload) {
    state.code = payload.code
    state.userAccessToken = payload.token
    //同步存储到cookie中设置token过期时间
    let expiresDate = new Date(new Date().getTime() + payload.expires_in * 1000)
    state.expiresDate = expiresDate
    Cookies.set('user_access_token', payload.token, {
      expires: expiresDate
    })
  },
  /**设置用户JEEBBS令牌 */
  setSessionKey(state, payload) {
    state.sessionKey = payload
    Cookies.set('session_key', payload, {
      expires: state.expiresDate
    })
  },
  setUserId(state, payload) {
    state.userId = payload
    Cookies.set('userId', payload, {
      expires: state.expiresDate
    })
  },
  isClientLogin(state, payload) {
    state.isClientLogin = payload
  },
  /**请求入栈 */
  pushRequest(state, payload) {
    //如果请求栈里没有这个请求则入栈
    if (!state.requests.includes(payload)) {
      state.requests.push(payload)
    }
    //把加载状态改为是
    state.loading = true
  },
  /**请求出栈 */
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
  /**清空请求栈 */
  clearRequest(state) {
    state.requests = []
    state.loading = false
  },
  /**设置loading效果 */
  setLoading(state, payload) {
    state.loading = payload
  },
  /**设置页面顶部加载效果 */
  setTopLoading(state, payload) {
    state.topLoading = payload
  },
  /**显示顶部吐司提示 */
  showPopup(state, payload) {
    state.popupType = payload.type
    state.popupMsg = payload.msg
    state.showPopup = true
  },
  /**影藏顶部吐司提示 */
  hidePopup(state, payload) {
    state.showPopup = payload
  }
}

const actions = {
  showPopupAction({
    commit
  }, payload) {
    commit('showPopup', payload)
    setTimeout(() => {
      commit('hidePopup', false)
    }, payload.time || 1500)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
