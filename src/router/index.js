import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import * as utils from '@/utils/index'

import Home from '@/views/home/home'
import Question from '@/views/question/question-list'
import AnswerList from '@/views/answer/answer-list'
import Answer from '@/views/answer/answer'
import AskOne from '@/views/question/ask-title'
import AskTwo from '@/views/question/ask-tag'
import HomePage from '@/views/home/homepage'
import Message from '@/views/home/message'
import Userinfo from '@/views/home/userinfo'
import HotDiscuss from '@/views/question/hot-discuss'

const router = new Router({
  mode: 'history',
  base: '/swwd/',
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        index: 1,
        title: '税务问答',
        switch: false,
        menuBar: { id: 1, imgFont: 'e675' },
        menuBars: [
          { id: 2, imgFont: 'e69f', name: '我的主页' },
          { id: 11, imgFont: 'e6a0', name: '通知' }
        ]
      },
      component: Home
    },
    {
      path: '/question/:id',
      name: 'question',
      meta: {
        index: 2,
        title: '问题详情',
        menuBar: { id: 3, imgFont: 'e671', name: '分享' }
      },
      component: Question
    },
    {
      path: '/askOne',
      name: 'askOne',
      meta: {
        index: 3,
        title: '提问',
        menuBar: { id: 4, name: '下一步' }
      },
      component: AskOne
    },
    {
      path: '/askTwo',
      name: 'askTwo',
      meta: {
        index: 4,
        title: '添加标签',
        menuBar: { id: 5, name: '发布' }
      },
      component: AskTwo
    },
    {
      path: '/answer/:id',
      name: 'answerList',
      meta: {
        index: 5,
        title: '回答',
        menuBars: [
          { id: 6, imgFont: 'e671', name: '分享' },
          { id: 7, imgFont: 'e681', name: '举报' },
          { id: 8, imgFont: 'e691', name: '采纳' }
        ]
      },
      component: AnswerList
    },
    {
      path: '/answer/:id',
      name: 'answer',
      meta: {
        index: 6,
        title: '回答',
        menuBar: { id: 9, name: '发布' }
      },
      component: Answer
    },
    {
      path: '/homepage',
      name: 'homepage',
      meta: {
        index: 7,
        title: '我的主页',
        switch: false
      },
      component: HomePage
    },
    {
      path: '/message',
      name: 'message',
      meta: {
        index: 8,
        title: '通知',
        menuBar: { id: 10, imgFont: 'e618' }
      },
      component: Message
    },
    {
      path: '/userinfo/:id',
      name: 'userinfo',
      meta: {
        index: 9,
        title: '个人资料',
        menuBar: { id: 12, name: '保存' }
      },
      component: Userinfo
    },
    {
      path: '/discuss/:id',
      name: 'discuss',
      meta: {
        index: 10,
        title: '热门讨论',
        switch: false
      },
      component: HotDiscuss
    }
  ]
})

router.beforeEach((to, from, next) => {
  let meta = to.meta
  document.title = meta.title
  utils.setHeader(meta.menuBar || {}, meta.menuBars || [], meta.switch)

  //当从oauth重定向回应用，获取code值，携带code值跳转到当初离开的页面
  let _to = to.fullPath
  if (_to.includes('code')) {
    let _code = _to.split('?')[1].split('=')[1]
    let _path = from.path
    let _currentPath = utils.loadFromLocal('currentPath')
    utils.removeFromLocal('currentPath')
    if (_path == '/' && _currentPath) {
      next({ path: _currentPath, query: { code: _code } })
    }
  }
  next()
})

router.afterEach(to => {
  window.scrollTo(0, 0)
})
export default router
