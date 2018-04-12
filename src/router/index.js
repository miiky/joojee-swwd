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

const router = new Router({
  mode: 'history',
  base: '/swwd/',
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        title: '税务问答',
        menuBar: { id: 1, imgFont: 'e634' },
        menuBars: [{ id: 2, imgFont: 'e62c', name: '我的主页' }]
      },
      component: Home
    },
    {
      path: '/question/:id',
      name: 'question',
      meta: {
        title: '问题详情',
        menuBar: { id: 3, imgFont: 'e671', name: '分享' }
      },
      component: Question
    },
    {
      path: '/askOne',
      name: 'askOne',
      meta: {
        title: '提问',
        menuBar: { id: 4, name: '下一步' }
      },
      component: AskOne
    },
    {
      path: '/askTwo',
      name: 'askTwo',
      meta: {
        title: '添加标签',
        menuBar: { id: 5, name: '发布' }
      },
      component: AskTwo
    },
    {
      path: '/answer/:id',
      name: 'answerList',
      meta: {
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
      path: '/answer',
      name: 'answer',
      meta: {
        title: '回答',
        menuBar: { id: 9, name: '发布' }
      },
      component: Answer
    }
  ]
})

router.beforeEach((to, from, next) => {
  let meta = to.meta
  document.title = meta.title
  utils.setHeader(meta.menuBar || {}, meta.menuBars || [])
  next()
})

router.afterEach(to => {
  window.scrollTo(0, 0)
})
export default router
