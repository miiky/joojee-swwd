import * as utils from '@/utils/index'
import Cookies from 'js-cookie'

const state = {
  recommondList: [],
  recommondPage: 0,
  newestList: [],
  newestPage: 0
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
  }
}

// state仓库中的数据状态改变操作
const mutations = {
  setRecommondList(state, payload) {
    payload.forEach(element => {
      // 处理回复内容
      let replys =
        element.replys.length == 0
          ? [{ content: '', replyType: 3 }]
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
    state.recommondPage++
  }
}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}
