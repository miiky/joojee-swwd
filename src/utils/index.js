import router from '@/router/index'
import bus from '@/utils/bus'
// 环境value
let _isDev = process.env.NODE_ENV === 'development'

/**
 * 判断是否在微信里
 */
export let isWeixn = function () {
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
export const isEmpty = value => {
  if (!value || value === undefined || value == 'undefined' || value == '') {
    return true
  }
  return false
}

/**
 * 判断是否在税企通里
 */
export let isJoojee = function () {
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
export const log = msg => {
  if (_isDev && console && console.log) {
    console.log(msg)
  }
}

/**
 *  存储数据到localstorage中
 * @param {* 键 } key
 * @param {* 值 } value
 */
export const saveToLocal = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value))
}

/**
 * 从localstorage中获取存储的值
 * @param {*键 } key
 */
export const loadFromLocal = key => {
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
export const removeFromLocal = name => {
  window.localStorage.removeItem(name)
}

export const initHeader = () => {}
export const setHeader = (menuBar, menuBars) => {
  let options = {
    navConfig: {
      switch: true,
      animation: true
    },
    menuConfig: {
      switch: true,
      menuBar: menuBar,
      menuBars: menuBars
    },
    success: function (res) {
      bus.$emit('menu' + res.id, res)
    }
  }
  sqt.showNavigation(options)
}
