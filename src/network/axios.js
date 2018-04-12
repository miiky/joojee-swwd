import axios from 'axios'
import store from '@/store/index'

const Axios = axios.create()

Axios.defaults.timeout = 50000

Axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8'

// `transformRequest` 允许在向服务器发送前，修改请求数据
// 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
// 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
Axios.defaults.transformRequest = [
  data => {
    // 对 data 进行任意转换处理
    let ret = ''
    for (let it in data) {
      if (data[it] != undefined)
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    return ret.endsWith('&') ? ret.slice(0, ret.length - 1) : ret
  }
]

// 添加请求拦截器
Axios.interceptors.request.use(
  config => {
    //get请求url参数拼接
    let payload = config.method + config.url
    //全局请求状态管理入栈
    store.commit('pushRequest', payload)
    return config
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
Axios.interceptors.response.use(
  response => {
    let config = response.config
    let payload = config.method + config.url
    //全局请求状态管理出栈
    store.commit('popRequest', payload)
    // 对响应数据做点什么
    return response
  },
  error => {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

export default Axios
