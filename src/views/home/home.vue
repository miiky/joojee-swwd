<template>
  <div class="joo-main">
    <div v-show="showRefresh" class="refresh" @click="refresh"><i class="iconfont icon-shuaxin"></i> 刷新页面</div>
    <div class="joo-hot" ref="hotWrapper" v-show="hotDiscussList.length != 0">
      <ul class="hot-list" ref="hotList">
        <li class="hot-item" v-for="item in hotDiscussList" :key="item.id">
          <HotDiscussCard :title="item.title" :count="item.replyCount" :id="item.id"></HotDiscussCard>
        </li>
      </ul>
    </div>
    <div style="height:44px;">
      <sticky :check-sticky-support="false" :offset="0" ref="sticky">
        <tab :line-width='2' custom-bar-width="20px" bar-active-color="#1985c4" default-color="#495060" active-color="#1985c4" v-model="tabIndex">
          <tab-item style="font-size:16px;" :selected="chooseTab === item" v-for="(item, index) in tabList" @click="chooseTab = item"
            :key="index">{{item}}</tab-item>
        </tab>
      </sticky>
    </div>
    <swiper ref="swiper" v-model="tabIndex" height="aspect-ratio" :show-dots="false" :threshold="150" :min-moving-distance="150"
      @on-index-change="swiperChange">
      <swiper-item>
        <div class="tab-content-attention" ref="attentionBody">
          <div class="no-content" v-if="attentionList.length == 0">
            <img class="no-content-img" src="@/assets/imgs/no-content.png" />
            <p>暂无关注，左滑去推荐看看</p>
          </div>
          <CardItem v-for="(item,index) of attentionList" :key="index" :id="item.id" :title="item.title" :answer="item.replys[0].content||''"
            :tagList="item.tags" :tagType="item.replys[0].replyType" :browseNum="item.viewCount" :answerNum="item.replyCount"
            :needHeader="true" :name="item.name" :acitonType="1" :avatar="item.profilePicture" :time="item.time"></CardItem>
        </div>
      </swiper-item>
      <swiper-item>
        <div class="tab-content-recommend" ref="recommendBody">
          <div class="no-content" v-if="recommondList.length == 0">
            <img class="no-content-img" src="@/assets/imgs/no-content.png" />
            <p>暂无推荐内容</p>
          </div>
          <CardItem v-for="(item,index) of recommondList" :key="index" :id="item.id" :title="item.title" :answer="item.replys[0].content"
            :tagList="item.tags" :tagType="item.replys[0].replyType" :browseNum="item.viewCount" :answerNum="item.replyCount"
            :time="item.time"></CardItem>
        </div>
      </swiper-item>
      <swiper-item>
        <div class="tab-content-news" ref="newsBody">
          <div class="no-content" v-if="newestList.length == 0">
            <img class="no-content-img" src="@/assets/imgs/no-content.png" />
            <p>暂无最新内容</p>
          </div>
          <CardItem v-for="(item,index) of newestList" :key="index" :id="item.id" :title="item.title" :answer="item.replys[0].content"
            :tagList="item.tags" :tagType="item.replys[0].replyType" :browseNum="item.viewCount" :answerNum="item.replyCount"
            :time="item.time"></CardItem>
        </div>
      </swiper-item>
    </swiper>
    <load-more v-show="showLoadmore" :show-loading="showLoading" :tip="loadMoreTips" background-color="#fbf9fe" @click.native="loadMore"></load-more>
    <div class="joo-question-btn" @click="toAsk">
      <i class="iconfont icon-tiwen"></i>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

import Header from '@/views/commons/header.vue'
import HotDiscussCard from './components/hot-discuss-card.vue'
import CardItem from '@/views/commons/card-item.vue'

import { Tab, TabItem, Sticky, Swiper, SwiperItem, LoadMore } from 'vux'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'home',
  components: {
    Header,
    HotDiscussCard,
    Tab,
    TabItem,
    Sticky,
    Swiper,
    SwiperItem,
    CardItem,
    LoadMore
  },
  data() {
    return {
      showLoading: false,
      showLoadmore: true,
      loadMoreTips: '加载更多',
      tabIndex:
        Number.parseInt(localStorage.homeTabIndex) == 0
          ? 0
          : Number.parseInt(localStorage.homeTabIndex) || 1,
      tabList: ['关注', '推荐', '最新'],
      chooseTab: '关注',
      showRefresh: true
    }
  },
  watch: {
    tabIndex(val) {
      localStorage.homeTabIndex = val
    }
  },
  computed: {
    ...mapGetters([
      'serverAccessToken',
      'sessionKey',
      'hotDiscussList',
      'attentionList',
      'recommondList',
      'newestList',
      'attentionPage',
      'recommondPage',
      'newestPage',
      'userId'
    ])
  },
  async mounted() {
    const _this = this
    this._handelMenuAction()
    this.$refs.sticky.bindSticky()

    //获取业务数据
    if (_this.serverAccessToken == '') {
      return
    }
    if (_this.hotDiscussList.length == 0) {
      _this._listHotDiscuss()
    } else {
      _this._initHotWrapper()
    }
    let recommonedPro = new Promise((resolve, reject) => {
      if (_this.recommondPage == 1) {
        _this._getRecommondList(1).then(res => {
          resolve()
        })
      } else {
        resolve()
      }
    })
    let newestPro = new Promise((resolve, reject) => {
      if (_this.newestPage == 1) {
        _this._getNewestList(1).then(res => {
          resolve()
        })
      } else {
        resolve()
      }
    })
    let attentionPro = new Promise((resolve, reject) => {
      if (_this.attentionPage == 1) {
        _this._getAttentionList(1).then(res => {
          resolve()
        })
      } else {
        resolve()
      }
    })
    Promise.all([recommonedPro, newestPro, attentionPro]).then(res => {
      setTimeout(() => {
        this.reSizeSwiperHeight(this.tabIndex)
        this.$nextTick(() => {
          window.scrollTo(0, 1)
          window.scrollTo(0, 0)
          console.log('scroll')
        })
      }, 500)
    })
  },
  methods: {
    ...mapMutations([
      'setRecommondList',
      'setNewestList',
      'setAttentionList',
      'setHotDiscussList',
      'resetPages'
    ]),
    async refresh() {
      const _this = this
      _this.showRefresh = false
      _this.resetPages()
      _this._listHotDiscuss()
      _this._getRecommondList(1)
      _this._getNewestList(1)
      _this._getAttentionList(1)
    },
    _handelMenuAction() {
      const _this = this
      _this.$bus.$on('menu1', data => {
        _this.$router.push('/search')
      })
      _this.$bus.$on('menu2', data => {
        if (_this.$utils.isEmpty(this.sessionKey)) {
          _this.$utils.oauth()
          return
        }
        _this.$router.push('/homepage')
      })
      _this.$bus.$on('menu11', data => {
        if (_this.$utils.isEmpty(this.sessionKey)) {
          _this.$utils.oauth()
          return
        }
        _this.$router.push('/message')
      })
    },
    async _listHotDiscuss() {
      const _this = this
      await _this.$net.listHotDiscuss().then(res => {
        _this.setHotDiscussList(res.data.entities)
        _this._initHotWrapper()
      })
    },
    async _getRecommondList(pageNo) {
      // 获取推荐列表
      const _this = this
      await _this.$net.listRecommendProblems(pageNo).then(res => {
        if (res.data.entities.length != 0) {
          _this.setRecommondList(res.data.entities)
        } else {
          this.loadMoreTips = '我是有底线的'
        }
      })
    },
    async _getNewestList(pageNo) {
      // 获取最新列表
      const _this = this
      await _this.$net.listNewestProblems(pageNo).then(res => {
        if (res.data.entities.length != 0) {
          _this.setNewestList(res.data.entities)
        } else {
          this.loadMoreTips = '我是有底线的'
        }
      })
    },
    async _getAttentionList(pageNo) {
      const _this = this
      if (_this.$utils.isEmpty(_this.sessionKey)) {
        return
      }
      await _this.$net.listAttentProblems(pageNo).then(res => {
        // console.log('attention', res)
        if (res.data.entities.length != 0) {
          _this.setAttentionList(res.data.entities)
        } else {
          this.loadMoreTips = '我是有底线的'
        }
      })
    },
    _initHotWrapper() {
      let width = 280 * this.hotDiscussList.length
      this.$refs.hotList.style.width = width + 'px'
      this.$nextTick(() => {
        this.picScroll = new BScroll(this.$refs.hotWrapper, {
          scrollX: true,
          eventPassthrough: 'vertical'
        })
      })
    },
    swiperChange(currentIndex) {
      // 改变tab
      const _this = this
      _this.loadMoreTips = '加载更多'
      _this.reSizeSwiperHeight(currentIndex)
    },
    reSizeSwiperHeight(currentIndex) {
      // 重新计算页面高度
      const _this = this
      let heights = [
        this.$refs.attentionBody.offsetHeight,
        this.$refs.recommendBody.offsetHeight,
        this.$refs.newsBody.offsetHeight
      ]
      _this.$nextTick(() => {
        _this.$refs.swiper.xheight = heights[currentIndex] + 'px'
      })
      switch (currentIndex) {
        case 0:
          _this.showLoadmore = _this.attentionList.length != 0
          break
        case 1:
          _this.showLoadmore = _this.recommondList.length != 0
          break
        case 2:
          _this.showLoadmore = _this.newestList.length != 0
          break
      }
    },
    async loadMore() {
      const _this = this
      if (_this.loadMoreTips == '我是有底线的') {
        return
      }
      _this.showLoading = true
      if (_this.tabIndex == 0) {
        await _this._getAttentionList(_this.attentionPage)
      } else if (_this.tabIndex == 1) {
        await _this._getRecommondList(_this.recommondPage)
      } else if (_this.tabIndex == 2) {
        await _this._getNewestList(_this.newestPage)
      }
      _this.showLoading = false
      _this.reSizeSwiperHeight(_this.tabIndex)
    },
    toAsk() {
      const _this = this
      if (_this.$utils.isEmpty(this.sessionKey)) {
        _this.$utils.oauth()
        return
      }
      this.$router.push({ name: 'askOne' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.joo-main {
  position: relative;
  background-color: #f5f5f5;
  .refresh {
    width: 100%;
    margin-top: 5px;
    line-height: 20px;
    text-align: center;
  }
  .joo-hot {
    position: relative;
    top: 0;
    width: 100%;
    height: 120px;
    overflow: hidden;
    white-space: nowrap;
    .hot-list {
      .hot-item {
        display: inline-block;
      }
    }
  }

  .joo-question-btn {
    position: fixed;
    right: 20px;
    bottom: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #1885c4;
    box-shadow: 0 1px 10px #80848f;
    text-align: center;
    line-height: 50px;
    color: white;
    font-size: 26px;
    font-weight: 500;
    i {
      font-size: 24px;
    }
  }
  .no-content {
    text-align: center;
    padding: 10rem 0;
    .no-content-img {
      width: 127px;
    }
    p {
      color: #a5a5a5;
      font-size: 15px;
    }
  }
}
</style>
