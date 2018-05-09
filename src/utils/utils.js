import router from '@/router/index'
import store from '@/store/index'
import bus from '@/utils/bus'
import { querystring } from 'vux'
import Cookies from 'js-cookie'
import net from '@/network/index'

let utils = {}
utils.isWeixn = function() {
  var ua = navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  }
}

/**
 * 判断一个string是否为空
 * @param {*} value
 */
utils.isEmpty = value => {
  if (!value || value === undefined || value == 'undefined' || value == '') {
    return true
  }
  return false
}

/**
 * 判断是否在税企通里
 */
utils.isJoojee = function() {
  var ua = navigator.userAgent.toLowerCase()
  if (ua.includes('joojee')) {
    return true
  } else {
    return false
  }
}

/**
 * 开发输出log
 * @param {消息} msg
 */
utils.log = msg => {
  if (_isDev && console && console.log) {
    console.log(msg)
  }
}

/**
 *  存储数据到localstorage中
 * @param {* 键 } key
 * @param {* 值 } value
 */
utils.saveToLocal = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value))
}

/**
 * 从localstorage中获取存储的值
 * @param {*键 } key
 */
utils.loadFromLocal = key => {
  let localStorageName = window.localStorage.getItem(key)
  try {
    if (localStorageName) {
      return JSON.parse(localStorageName)
    } else {
      return ''
    }
  } catch (e) {
    return ''
  }
}

/**
 * 从localstorage中删除存储元素
 * @param {*} name
 */
utils.removeFromLocal = name => {
  window.localStorage.removeItem(name)
}

utils.initHeader = () => {
  sqt.config({ debug: false })
}
utils.setHeader = (menuBar, menuBars, mode = true) => {
  let options = {
    navConfig: {
      switch: true,
      animation: true
    },
    menuConfig: {
      switch: mode,
      menuBar: menuBar,
      menuBars: menuBars
    },
    success: function(res) {
      bus.$emit('menu' + res.id, res)
    }
  }
  sqt.showNavigation(options)
}

utils.initOauth = async () => {
  //获取url中的code
  let code = querystring.parse(location.search).code
  //查看该code是否已经授权过
  if (code == store.getters.code) {
    return
  }
  //如果code为空并且openid也为空，则直接跳转oauth授权去获取code
  if (isEmpty(code) && isEmpty(store.getters.sessionKey)) {
    oauth()
    return
  }
  //如果已经有了code但是没有openid则去获取token
  if (isEmpty(store.getters.userAccessToken)) {
    //请求获取token
    await initUserLoginStatus(code)
  }
}

utils.initUserLoginStatus = async code => {
  //请求获取token
  await initUserToken(code)
  //请求获取sessionKey
  await initSessionKey()
  //请求获取userId
  await initUserId()
}

utils.oauth = () => {
  //记录当前路由，然后跳转获取code，便于重定向回应用后回到操作前的页面
  let currentPath = router.currentRoute.fullPath
  saveToLocal('currentPath', currentPath)
  //跳转获取code
  window.location.href = net.redirect_uri_for_code
}

/**
 * 通过code去换取token
 * @param {* 授权token的code值} code
 */
utils.initUserToken = async code => {
  await net.getUserToken(code).then(res => {
    let token = res.data.access_token
    //将获取的token和code放到store中去管理状态
    store.commit('setUserAccessToken', {
      code: code,
      token: token,
      expires: res.data.expires_in
    })
  })
}

utils.initSessionKey = async () => {
  await net.getSessionKey(store.getters.userAccessToken).then(res => {
    let sessionKey = res.data.entities[0].sessionKey
    store.commit('setSessionKey', sessionKey)
  })
}

utils.initUserId = async () => {
  await net.getUserId().then(res => {
    let userId = res.data.entities[0].userId
    store.commit('setUserId', userId)
  })
}

export default utils
