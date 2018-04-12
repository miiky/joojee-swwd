import Axios from './axios'

//税企通oauth配置
const grant_type = 'client_credentials'
const scope = 'app'
const client_secret = '7735df3555f682a78c90385f64101d35'
const client_id = '54e09818ceb97c45'

const _isPro = process.env.NODE_ENV === 'production'

const JOOJEE_OAUTH_URL = 'https://oauth.joojee.cn'
const SWWD_API_URL = 'https://api.joojee.cn/swwd'

const REDIRECT_RUL = 'http://192.168.1.222:8080/'

/**
 *  获取服务token
 * @param {* 回调参数} code
 * @param {* 回调地址} uri
 */
export let getServerToken = code =>
  Axios.post(JOOJEE_OAUTH_URL + '/oauth/token', {
    client_id: client_id,
    client_secret: client_secret,
    grant_type: grant_type
  })

/**
 *  获取推荐列表
 * @param {服务token} token
 * @param {页数} pageNo
 * @param {每页的条数} pageSize
 */
export let listRecommendProblems = (token, pageNo = 0, pageSize = 10) =>
  Axios.post(SWWD_API_URL + '/listRecommendProblems', {
    access_token: token,
    pageNo: pageNo,
    pageSize: pageSize
  })

/**
 *  获取最新列表
 * @param {服务token} token
 * @param {页数} pageNo
 * @param {每页的条数} pageSize
 */
export let listNewestProblems = (token, pageNo = 0, pageSize = 10) =>
  Axios.post(SWWD_API_URL + '/listNewestProblems', {
    access_token: token,
    pageNo: pageNo,
    pageSize: pageSize
  })
