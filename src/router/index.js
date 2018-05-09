import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'
Vue.use(Router)

import utils from '@/utils/utils'

import Home from '@/views/home/home'
import Question from '@/views/question/question-list'
import AnswerList from '@/views/answer/answer-list'
import Answer from '@/views/answer/answer'
import AskOne from '@/views/question/ask-title'
import AskTwo from '@/views/question/ask-tag'

import HotDiscuss from '@/views/discuss/hot-discuss'

import HomePage from '@/views/homepage/homepage'
import HomePageOther from '@/views/homepage/homepage-other'
import Message from '@/views/homepage/message'
import Userinfo from '@/views/homepage/userinfo'
import UserList from '@/views/homepage/user-list'

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
        // switch: false,
        // menuBar: { id: 1, imgFont: 'e675' },
        menuBars: [
          { id: 2, imgFont: 'e69f', name: '我的主页' }
          // { id: 11, imgFont: 'e6a0', name: '通知' }
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
      path: '/answer',
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
        menuBar: { id: 13, imgFont: 'e671', name: '分享' }
      },
      component: HotDiscuss
    },
    {
      path: '/userlist/:id',
      name: 'userlist',
      meta: {
        index: 11,
        title: '我的粉丝',
        switch: false
      },
      component: UserList
    },
    {
      path: '/homepage/:id',
      name: 'homepageother',
      meta: {
        index: 12,
        title: 'TA的主页',
        switch: false
      },
      component: HomePageOther
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  //获取路由元信息
  let meta = to.meta
  //设置标题头
  document.title = meta.title
  //设置头部菜单
  utils.setHeader(meta.menuBar || {}, meta.menuBars || [], meta.switch)

  let _to = to.fullPath
  //当从oauth重定向回应用，获取code值，携带code值跳转到当初离开的页面
  if (_to.includes('code')) {
    let _code = _to.split('?')[1].split('=')[1]
    let _path = from.path
    //获取授权之前的路径
    let _currentPath = utils.loadFromLocal('currentPath')
    utils.removeFromLocal('currentPath')
    //如果还没有sessionKey，则初始化用户登陆状态
    if (utils.isEmpty(store.getters.sessionKey)) {
      await utils.initUserLoginStatus(_code)
    }
    //重定向到授权之前的路径
    if (_path == '/' && _currentPath) {
      next({ path: _currentPath })
    }
  }
  next()
})

router.afterEach(to => {
  window.scrollTo(0, 0)
})
export default router
