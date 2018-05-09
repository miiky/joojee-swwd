import Axios from './axios'
import store from '@/store/index'

const _isPro = process.env.NODE_ENV === 'production'

//税务问答服务配置
const grant_type = 'client_credentials'
const scope = 'app'
const client_secret = _isPro
  ? '0d90ab37d2ad240024b94d5dddf6f515'
  : '7735df3555f682a78c90385f64101d35'
const client_id = _isPro ? 'a2e9d7f3b0f635f9' : '54e09818ceb97c45'

//税企通oauth配置
const j_grant_type = 'authorization_code'

const JOOJEE_OAUTH_URL = 'https://oauth.joojee.cn'
const SWWD_API_URL = 'https://api.joojee.cn/swwd'

const REDIRECT_RUL = _isPro
  ? 'https://static.joojee.cn/swwd'
  : 'http://192.168.1.222:8080/'

let net = {}

net.redirect_uri_for_code =
  JOOJEE_OAUTH_URL +
  '/oauth/authorize?client_id=' +
  client_id +
  '&response_type=code&redirect_uri=' +
  REDIRECT_RUL

/**
 * 1、获取服务token
 */
net.getServerToken = () =>
  Axios.post(JOOJEE_OAUTH_URL + '/oauth/token', {
    client_id: client_id,
    client_secret: client_secret,
    grant_type: grant_type
  })

/**
 * 2、获取用户token
 * @param {* 回调参数} code
 */
net.getUserToken = code =>
  Axios.post(JOOJEE_OAUTH_URL + '/oauth/token', {
    client_id: client_id,
    client_secret: client_secret,
    grant_type: j_grant_type,
    code: code,
    redirect_uri: REDIRECT_RUL
  })

/**
 * 3、获取sessionKey
 * @param {用户token} token
 */
net.getSessionKey = token =>
  Axios.post(SWWD_API_URL + '/login', {
    access_token: token
  })

/**
 * 4、获取热门讨论列表
 */
net.listHotDiscuss = () => Axios.post(SWWD_API_URL + '/listHotDiscuss')

/**
 * 5、获取推荐列表
 * @param {服务token} token
 * @param {页数} pageNo
 * @param {每页的条数} pageSize
 */
net.listRecommendProblems = (pageNo = 1, pageSize = 20) =>
  Axios.post(SWWD_API_URL + '/listRecommendProblems', {
    access_token: store.getters.token,
    pageNo: pageNo,
    pageSize: pageSize
  })

/**
 * 6、获取最新列表
 * @param {服务token} token
 * @param {页数} pageNo
 * @param {每页的条数} pageSize
 */
net.listNewestProblems = (pageNo = 1, pageSize = 20) =>
  Axios.post(SWWD_API_URL + '/listNewestProblems', {
    access_token: store.getters.token,
    pageNo: pageNo,
    pageSize: pageSize
  })

/**
 * 7、获取关注动态列表
 * @param {页数} pageNo
 * @param {每页条数} pageSize
 */
net.listAttentProblems = (pageNo = 1, pageSize = 20) =>
  Axios.post(SWWD_API_URL + '/listAttentProblems', {
    access_token: store.getters.token,
    sessionKey: store.getters.sessionKey,
    pageNo: pageNo,
    pageSize: pageSize
  })

/**
 * 8、获取问题详情
 * @param {服务token} token
 * @param {问题ID} id
 * @param {jeebbs状态令牌} sessionKey
 */
net.getProblem = id =>
  Axios.post(SWWD_API_URL + '/getProblem', {
    access_token: store.getters.token,
    sessionKey: store.getters.sessionKey,
    id: id
  })

/**
 * 9、获取答复列表
 * @param {问题ID} id
 * @param {页数} pageNo
 * @param {一页多少个} pageSize
 */
net.listReplys = (id, pageNo = 1, pageSize = 20) =>
  Axios.post(SWWD_API_URL + '/listReplys', {
    access_token: store.getters.token,
    sessionKey: store.getters.sessionKey,
    problemId: id,
    pageNo: pageNo,
    pageSize: pageSize
  })

/**
 * 10、获取答复详情
 * @param {答复ID} replyId
 */
net.getReply = replyId =>
  Axios.post(SWWD_API_URL + '/getReply', {
    access_token: store.getters.token,
    sessionKey: store.getters.sessionKey,
    replyId: replyId
  })

/**
 * 11、获取答复的评论列表
 * @param {问题ID} problemId
 * @param {答复ID} replyId
 * @param {页数} pageNo
 * @param {一页多少个} pageSize
 */
net.listComments = (problemId, replyId, pageNo = 1, pageSize = 50) =>
  Axios.post(SWWD_API_URL + '/listComments', {
    access_token: store.getters.token,
    sessionKey: store.getters.sessionKey,
    problemId: problemId,
    replyId: replyId,
    pageNo: pageNo,
    pageSize: pageSize
  })

/**
 * 12、提问接口
 * @param {标题} title
 * @param {描述} content
 * @param {问题标签} problemTags
 * @param {配图地址} imgUrl
 */
net.submitProblem = (title, content, problemTags, imgUrl) =>
  Axios.post(SWWD_API_URL + '/submitProblem', {
    access_token: store.getters.userAccessToken,
    sessionKey: store.getters.sessionKey,
    title: title,
    content: content,
    problemTags: problemTags,
    imgUrl: imgUrl
  })

/**
 * 13、获取问题标签列表
 */
net.listProblemTags = () =>
  Axios.post(SWWD_API_URL + '/listProblemTags', {
    sessionKey: store.getters.sessionKey,
    access_token: store.getters.token
  })

/**
 * 14、提交回复
 * @param {问题ID} problemId
 * @param {回复内容} content
 * @param {回复图片列表} imgUrl
 */
net.submitReply = (problemId, content, imgUrl) =>
  Axios.post(SWWD_API_URL + '/submitReply', {
    access_token: store.getters.userAccessToken,
    sessionKey: store.getters.sessionKey,
    content: content,
    problemId: problemId,
    imgUrl: imgUrl
  })

/**
 * 15、提交评论
 * @param {问题ID} problemId
 * @param {回复ID} replyId
 * @param {评论内容} content
 */
net.submitComment = (problemId, replyId, content) =>
  Axios.post(SWWD_API_URL + '/submitComment', {
    access_token: store.getters.userAccessToken,
    sessionKey: store.getters.sessionKey,
    replyId: replyId,
    content: content,
    problemId: problemId
  })

/**
 * 16、设置为最佳采纳
 * @param {问题ID} problemId
 * @param {回复ID} replyId
 */
net.setBestReply = (problemId, replyId) =>
  Axios.post(SWWD_API_URL + '/setBestReply', {
    access_token: store.getters.userAccessToken,
    sessionKey: store.getters.sessionKey,
    replyId: replyId,
    problemId: problemId
  })

/**
 * 17、收藏问题
 * @param {问题ID} problemId
 */
net.collectProblem = problemId =>
  Axios.post(SWWD_API_URL + '/collectProblem', {
    access_token: store.getters.userAccessToken,
    sessionKey: store.getters.sessionKey,
    problemId: problemId
  })

/**
 * 18、取消收藏问题
 * @param {问题ID} problemId
 */
net.cancelCollectProblem = problemId =>
  Axios.post(SWWD_API_URL + '/cancleCollectProblem', {
    access_token: store.getters.userAccessToken,
    sessionKey: store.getters.sessionKey,
    problemId: problemId
  })

/**
 * 19、点赞回复或评论
 * @param {回复ID} replyId
 */
net.upReply = replyId =>
  Axios.post(SWWD_API_URL + '/upReply', {
    access_token: store.getters.userAccessToken,
    sessionKey: store.getters.sessionKey,
    replyId: replyId
  })

/**
 * 20、取消点赞回复或评论
 * @param {回复ID} replyId
 */
net.cancelUpReply = replyId =>
  Axios.post(SWWD_API_URL + '/cancleUpReply', {
    access_token: store.getters.userAccessToken,
    sessionKey: store.getters.sessionKey,
    replyId: replyId
  })

/**
 * 21、关注用户
 * @param {用户ID} userId
 */
net.attentUser = userId =>
  Axios.post(SWWD_API_URL + '/attentUser', {
    access_token: store.getters.userAccessToken,
    sessionKey: store.getters.sessionKey,
    userId: userId
  })

/**
 * 22、取消关注用户
 * @param {用户ID} userId
 */
net.cancelAttentUser = userId =>
  Axios.post(SWWD_API_URL + '/cancleAttentUser', {
    access_token: store.getters.userAccessToken,
    sessionKey: store.getters.sessionKey,
    userId: userId
  })

/**
 * 23、通过sessionkey获取userId
 */
net.getUserId = () =>
  Axios.post(SWWD_API_URL + '/getUserId', {
    access_token: store.getters.userAccessToken,
    sessionKey: store.getters.sessionKey
  })

/**
 * 24、获取讨论最新回复列表
 * @param {讨论ID} discussId
 * @param {页数} pageNo
 * @param {每页个数} pageSize
 */
net.listNewestReplyOfHotDiscuss = (discussId, pageNo = 1, pageSize = 10) =>
  Axios.post(SWWD_API_URL + '/listNewestReplyOfHotDiscuss', {
    discussId: discussId,
    pageNo: pageNo,
    pageSize: pageSize,
    sessionKey: store.getters.sessionKey
  })

/**
 * 25、获取讨论最热回复列表
 * @param {讨论ID} discussId
 * @param {页数} pageNo
 * @param {每页个数} pageSize
 */
net.listHotReplyOfHotDiscuss = (discussId, pageNo = 1, pageSize = 50) =>
  Axios.post(SWWD_API_URL + '/listHotReplyOfHotDiscuss', {
    discussId: discussId,
    pageNo: pageNo,
    pageSize: pageSize,
    sessionKey: store.getters.sessionKey
  })

/**
 * 26、获取我的主页信息
 */
net.getMyInfo = () =>
  Axios.post(SWWD_API_URL + '/getMyInfo', {
    sessionKey: store.getters.sessionKey
  })

/**
 * 27、获取我发布的问题
 * @param {*} pageNo
 * @param {*} pageSize
 */
net.listMySubmitProblems = (pageNo = 1, pageSize = 20) =>
  Axios.post(SWWD_API_URL + '/listMySubmitProblems', {
    pageNo: pageNo,
    pageSize: pageSize,
    sessionKey: store.getters.sessionKey
  })

/**
 * 28、获取我回复的问题
 * @param {*} pageNo
 * @param {*} pageSize
 */
net.listMyReplyProblems = (pageNo = 1, pageSize = 20) =>
  Axios.post(SWWD_API_URL + '/listMyReplyProblems', {
    pageNo: pageNo,
    pageSize: pageSize,
    sessionKey: store.getters.sessionKey
  })

/**
 * 29、获取我收藏的问题
 * @param {*} pageNo
 * @param {*} pageSize
 */
net.listMyCollectProblems = (pageNo = 1, pageSize = 20) =>
  Axios.post(SWWD_API_URL + '/listMyCollectProblems', {
    pageNo: pageNo,
    pageSize: pageSize,
    sessionKey: store.getters.sessionKey
  })

/**
 * 30、获取我收藏的问题数量
 */
net.countMyCollectProblems = () =>
  Axios.post(SWWD_API_URL + '/countMyCollectProblems', {
    sessionKey: store.getters.sessionKey
  })

/**
 * 31、获取我的关注列表
 * @param {*} pageNo
 * @param {*} pageSize
 */
net.listMyAttent = (pageNo = 1, pageSize = 20) =>
  Axios.post(SWWD_API_URL + '/listMyAttent', {
    pageNo: pageNo,
    pageSize: pageSize,
    sessionKey: store.getters.sessionKey
  })

/**
 * 32、获取我的动态列表
 * @param {*} pageNo
 * @param {*} pageSize
 */
net.listMyDynamics = (pageNo = 1, pageSize = 20) =>
  Axios.post(SWWD_API_URL + '/listMyDynamics', {
    pageNo: pageNo,
    pageSize: pageSize,
    sessionKey: store.getters.sessionKey
  })

/**
 * 33、获取我的粉丝列表
 * @param {*} pageNo
 * @param {*} pageSize
 */
net.listMyFans = (pageNo = 1, pageSize = 20) =>
  Axios.post(SWWD_API_URL + '/listMyFans', {
    pageNo: pageNo,
    pageSize: pageSize,
    sessionKey: store.getters.sessionKey
  })

/**
 * 34、获取他人发布的问题
 * @param {*} pageNo
 * @param {*} pageSize
 */
net.listSomeoneSubmitProblems = (userId, pageNo = 1, pageSize = 20) =>
  Axios.post(SWWD_API_URL + '/listSomeoneSubmitProblems', {
    userId: userId,
    pageNo: pageNo,
    pageSize: pageSize,
    sessionKey: store.getters.sessionKey
  })

/**
 * 35、获取他人回复的问题
 * @param {*} pageNo
 * @param {*} pageSize
 */
net.listSomeoneReplyProblems = (userId, pageNo = 1, pageSize = 20) =>
  Axios.post(SWWD_API_URL + '/listSomeoneReplyProblems', {
    userId: userId,
    pageNo: pageNo,
    pageSize: pageSize,
    sessionKey: store.getters.sessionKey
  })

/**
 * 36、获取他人收藏的问题
 * @param {*} userId
 * @param {*} pageNo
 * @param {*} pageSize
 */
net.listSomeoneCollectProblems = (userId, pageNo = 1, pageSize = 20) =>
  Axios.post(SWWD_API_URL + '/listSomeoneCollectProblems', {
    userId: userId,
    pageNo: pageNo,
    pageSize: pageSize,
    sessionKey: store.getters.sessionKey
  })

/**
 * 37、获取他人的主页信息
 * @param {*} userId
 */
net.getSomeoneInfo = userId =>
  Axios.post(SWWD_API_URL + '/getSomeoneInfo', {
    userId: userId,
    sessionKey: store.getters.sessionKey
  })

/**
 * 38、获取他人的关注列表
 * @param {*} userId
 */
net.listSomeoneAttent = userId =>
  Axios.post(SWWD_API_URL + '/listSomeoneAttent', {
    userId: userId,
    sessionKey: store.getters.sessionKey
  })

/**
 * 39、获取他人的动态列表
 * @param {*} userId
 * @param {*} pageNo
 * @param {*} pageSize
 */
net.listSomeoneDynamics = (userId, pageNo = 1, pageSize = 20) =>
  Axios.post(SWWD_API_URL + '/listSomeoneDynamics', {
    userId: userId,
    pageNo: pageNo,
    pageSize: pageSize,
    sessionKey: store.getters.sessionKey
  })

/**
 * 40、获取他人的粉丝列表
 * @param {*} userId
 * @param {*} pageNo
 * @param {*} pageSize
 */
net.listSomeoneFans = (userId, pageNo = 1, pageSize = 20) =>
  Axios.post(SWWD_API_URL + '/listSomeoneFans', {
    userId: userId,
    pageNo: pageNo,
    pageSize: pageSize,
    sessionKey: store.getters.sessionKey
  })

/**
 * 41、搜索
 * @param {关键字} keywords
 */
net.search = (keywords, pageNo = 1, pageSize = 10) =>
  Axios.post(SWWD_API_URL + '/search', {
    keywords: keywords,
    pageNo: pageNo,
    pageSize: pageSize
  })

/**
 * 42、修改个人简介
 * @param {个人简介} selfIntroduction
 */
net.updateSelfIntroduction = selfIntroduction =>
  Axios.post(SWWD_API_URL + '/updateSelfIntroduction', {
    sessionKey: store.getters.sessionKey,
    selfIntroduction: selfIntroduction
  })

export default net
