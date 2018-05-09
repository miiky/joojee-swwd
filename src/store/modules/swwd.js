import utils from '@/utils/utils'
import Cookies from 'js-cookie'

const state = {
  recommondList: [],
  recommondPage: 1,
  newestList: [],
  newestPage: 1,
  attentionList: [],
  attentionPage: 1,
  hotDiscussList: [],

  answer: {
    // 回答的问题数据
    id: '',
    title: ''
  },

  problem: {
    // 提问的相关数据
    title: '',
    content: '',
    imgUrl: [],
    problemTags: []
  }
}

// 暴露getters供获取state的值
const getters = {
  recommondList(state) {
    return state.recommondList
  },
  recommondPage(state) {
    return state.recommondPage
  },
  newestList(state) {
    return state.newestList
  },
  newestPage(state) {
    return state.newestPage
  },
  attentionList(state) {
    return state.attentionList
  },
  attentionPage(state) {
    return state.attentionPage
  },
  hotDiscussList(state) {
    return state.hotDiscussList
  },
  problem(state) {
    return state.problem
  },
  answer(state) {
    return state.answer
  }
}

// state仓库中的数据状态改变操作
const mutations = {
  setHotDiscussList(state, payload) {
    state.hotDiscussList = payload
  },
  setRecommondList(state, payload) {
    if (state.recommondPage == 1) {
      state.recommondList = []
    }
    payload.forEach(element => {
      // 处理回复内容
      let replys =
        element.replys.length == 0
          ? [{ content: '', replyType: 0 }]
          : element.replys
      // 处理标签
      let tags =
        element.tags.length == 0 ? [{ id: 0, name: '无标签' }] : element.tags
      //
      state.recommondList.push({
        id: element.id,
        title: element.title,
        replys: replys,
        tags: tags,
        viewCount: element.viewCount || 0,
        replyCount: element.replyCount || 0
      })
    })
    // var hash = {}
    // state.recommondList = state.recommondList.reduce(function(item, next) {
    //   hash[next.id] ? '' : (hash[next.id] = true && item.push(next))
    //   return item
    // }, [])
    state.recommondPage++
  },
  setNewestList(state, payload) {
    if (state.newestPage == 1) {
      state.newestList = []
    }
    payload.forEach(element => {
      // 处理回复内容
      let replys =
        element.replys.length == 0
          ? [{ content: '', replyType: 0 }]
          : element.replys
      // 处理标签
      let tags =
        element.tags.length == 0 ? [{ id: 0, name: '无标签' }] : element.tags
      //
      state.newestList.push({
        id: element.id,
        title: element.title,
        replys: replys,
        tags: tags,
        viewCount: element.viewCount || 0,
        replyCount: element.replyCount || 0
      })
    })
    //去重
    // var hash = {}
    // state.newestList = state.newestList.reduce(function(item, next) {
    //   hash[next.id] ? '' : (hash[next.id] = true && item.push(next))
    //   return item
    // }, [])
    state.newestPage++
  },
  setAttentionList(state, payload) {
    if (state.attentionPage == 1) {
      state.attentionList = []
    }
    payload.forEach(element => {
      // 处理回复内容
      let _replys =
        element.problem.replys.length == 0
          ? [{ content: '', replyType: 0 }]
          : element.problem.replys
      // 处理标签
      let tags =
        element.problem.tags.length == 0
          ? [{ id: 0, name: '无标签' }]
          : element.problem.tags
      //
      state.attentionList.push({
        id: element.problem.id,
        title: element.problem.title,
        replys: _replys,
        tags: tags,
        viewCount: element.problem.viewCount || 0,
        replyCount: element.problem.replyCount || 0,
        name: element.user.realname,
        profilePicture: element.user.profilePicture,
        time: element.opreteTime.split(' ')[0]
      })
    })
    // var hash = {}
    // state.attentionList = state.attentionList.reduce(function(item, next) {
    //   hash[next.id] ? '' : (hash[next.id] = true && item.push(next))
    //   return item
    // }, [])
    state.attentionPage++
  },
  setProblemTitle(state, payload) {
    state.problem.title = payload.title
    state.problem.content = payload.content || ''
    state.problem.imgUrl = payload.imgUrl || ''
  },
  setProblemTags(state, payload) {
    state.problem.problemTags = payload.tags
  },
  setAnswer(state, payload) {
    state.answer.id = payload.id
    state.answer.title = payload.title
  },
  clearProblem(state) {
    state.problem = {
      title: '',
      content: '',
      imgUrl: [],
      problemTags: []
    }
  },
  resetPages(state) {
    state.recommondPage = 1
    state.attentionPage = 1
    state.newestPage = 1
  }
}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}
