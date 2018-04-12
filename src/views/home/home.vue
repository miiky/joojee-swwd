<template>
  <div class="joo-main">
    <!-- <Header class="joo-header"></Header> -->
    <div class="joo-content" ref="jooContent">
      <div class="joo-hot" ref="hotWrapper" v-once>
        <ul class="hot-list" ref="hotList">
          <li class="hot-item" v-for="item in 3" :key="item">
            <HotDiscussCard title="天猫既然都走公账了，税反正都..." desc="4396人参与讨论"></HotDiscussCard>
          </li>
        </ul>
      </div>
      <sticky :check-sticky-support="false" :offset="0">
        <tab :line-width='2' custom-bar-width="20px" bar-active-color="#1985c4" default-color="#495060" active-color="#1985c4" v-model="tabIndex">
          <tab-item style="font-size:16px;" :selected="chooseTab === item" v-for="(item, index) in tabList" @click="chooseTab = item"
            :key="index">{{item}}</tab-item>
        </tab>
      </sticky>
      <swiper ref="swiper" v-model="tabIndex" height="aspect-ratio" :show-dots="false" :threshold="150" :min-moving-distance="150"
        @on-index-change="swiperChange">
        <swiper-item>
          <div class="tab-content-attention" ref="attentionBody">
            <CardItem v-for="item of recommendBody.list" :key="item.id" :title="item.title" :answer="item.replys[0].content||''" :tagList="item.tags"
              :tagType="item.replys[0].replyType" :browseNum="item.viewCount" :answerNum="item.replyCount" :needHeader="true"
              name="神奇的设计师" :acitonType="1" avatar="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2809576112,626361756&fm=27&gp=0.jpg"
              time="04-04"></CardItem>
          </div>
        </swiper-item>
        <swiper-item>
          <div class="tab-content-recommend" ref="recommendBody">
            <CardItem v-for="(item,index) of recommondList" :key="index" :title="item.title" :answer="item.replys[0].content" :tagList="item.tags"
              :tagType="item.replys[0].replyType" :browseNum="item.viewCount" :answerNum="item.replyCount"></CardItem>
          </div>
        </swiper-item>
        <swiper-item>
          <div class="tab-content-news" ref="newsBody">
            <CardItem v-for="item of recommendBody.list" :key="item.id" :title="item.title" :answer="item.replys[0].content" :tagList="item.tags"
              :tagType="item.replys[0].replyType" :browseNum="item.viewCount" :answerNum="item.replyCount"></CardItem>
          </div>
        </swiper-item>
      </swiper>
      <load-more :show-loading="showLoading" :tip="loadMoreTips" background-color="#fbf9fe" @click.native="loadMore"></load-more>
    </div>
    <router-link :to="{ name: 'askOne'}">
      <div class="joo-question-btn">
        <i class="iconfont icon-tiwen" style="font-size: 24px;"></i>
      </div>
    </router-link>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

import Header from '@/views/commons/header.vue'
import HotDiscussCard from './components/hot-discuss-card.vue'
import CardItem from '@/views/commons/card-item.vue'

import { Tab, TabItem, Sticky, Swiper, SwiperItem, LoadMore } from 'vux'
import * as Net from '@/network/index'
import * as Utils from '@/utils/index'
import { mapGetters, mapMutations } from 'vuex'

let mainScroll

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
      loadMoreTips: '加载更多',
      tabIndex: 1,
      tabList: ['关注', '推荐', '最新'],
      chooseTab: '关注',
      recommendBody: {
        list: [
          {
            id: '999',
            title: '未按规定开具发票但未少缴税是否也会受处罚？',
            replys: [
              {
                replyType: 0,
                content:
                  '根据《中华人民共和国发票管理办法》第二十二条第一款的规定，开具发票应当按照规定的时限...'
              }
            ],
            tags: [
              { id: 1, name: '增值税' },
              { id: 2, name: '流通' },
              { id: 3, name: '价外税' }
            ],
            viewCount: 20,
            replyCount: 43
          },
          {
            id: '998',
            title:
              '发票的作用是什么，为什么会用那么多类发票，它们的区别是什么？',
            replys: [
              {
                replyType: 1,
                content:
                  '根据《中华人民共和国发票管理办法》第二十二条第一款的规定，开具发票应当按照规定的时限...'
              }
            ],
            tags: [
              { id: 1, name: '增值税' },
              { id: 2, name: '流通' },
              { id: 3, name: '价外税' }
            ],
            viewCount: 20,
            replyCount: 43
          },
          {
            id: '997',
            title:
              '发票的作用是什么，为什么会用那么多类发票，它们的区别是什么？',
            replys: [
              {
                replyType: 0,
                content:
                  '本文约有一万余字，约四十幅插图，分3章，若干个小节。内容绝大多数来自于本人在知乎上的...'
              }
            ],
            tags: [{ id: 1, name: '票据' }, { id: 2, name: '发票' }],
            viewCount: 205,
            replyCount: 432
          },
          {
            id: '996',
            title: '未按规定开具发票但未少缴税是否也会受处罚？',
            replys: [
              {
                replyType: 0,
                content:
                  '根据《中华人民共和国发票管理办法》第二十二条第一款的规定，开具发票应当按照规定的时限...'
              }
            ],
            tags: [
              { id: 1, name: '增值税' },
              { id: 2, name: '流通' },
              { id: 3, name: '价外税' }
            ],
            viewCount: 20,
            replyCount: 43
          },
          {
            id: '995',
            title:
              '发票的作用是什么，为什么会用那么多类发票，它们的区别是什么？',
            replys: [
              {
                replyType: 1,
                content:
                  '本文约有一万余字，约四十幅插图，分3章，若干个小节。内容绝大多数来自于本人在知乎上的...'
              }
            ],
            tags: [{ id: 1, name: '票据' }, { id: 2, name: '发票' }],
            viewCount: 20,
            replyCount: 43
          }
        ]
      }
    }
  },
  watch: {
    recommondList(val) {
      this.$nextTick(() => {
        this.reSizeSwiperHeight(this.tabIndex)
      })
    }
  },
  computed: {
    ...mapGetters(['serverAccessToken', 'recommondList', 'recommondPage'])
  },
  async created() {
    const _this = this
    //如果没有服务token则获取服务token
    if (Utils.isEmpty(_this.serverAccessToken)) {
      await _this._initToken()
    }
    _this.setRecommondList(_this.recommendBody.list)
    //获取业务数据
    // _this._getRecommondList()
  },
  mounted() {
    this._initHotWrapper()
  },
  methods: {
    ...mapMutations(['setServerAccessToken', 'setRecommondList']),
    async _initToken() {
      const _this = this
      await Net.getServerToken().then(res => {
        console.log(res)
        //将获取的token和code放到store中去管理状态
        _this.setServerAccessToken({
          token: res.data.access_token,
          expires: res.data.expires_in
        })
      })
    },
    async _getRecommondList() {
      const _this = this
      await Net.listRecommendProblems(
        _this.serverAccessToken,
        _this.recommondPage
      ).then(res => {
        _this.setRecommondList(res.data.entities)
      })
    },
    _initHotWrapper() {
      let width = 280 * 3
      this.$refs.hotList.style.width = width + 'px'
      this.$nextTick(() => {
        this.picScroll = new BScroll(this.$refs.hotWrapper, {
          scrollX: true,
          eventPassthrough: 'vertical'
        })
      })
    },
    swiperChange(currentIndex) {
      const _this = this
      _this.reSizeSwiperHeight(currentIndex)
    },
    reSizeSwiperHeight(currentIndex) {
      const _this = this
      let heights = [
        this.$refs.attentionBody.offsetHeight,
        this.$refs.recommendBody.offsetHeight,
        this.$refs.newsBody.offsetHeight
      ]
      _this.loadMoreTips = '加载更多'
      _this.$nextTick(() => {
        _this.$refs.swiper.xheight = heights[currentIndex] + 'px'
      })
    },
    async loadMore() {
      if (this.loadMoreTips == '我是有底线的') {
        return
      }
      this.showLoading = true
      await this._getRecommondList()
      this.showLoading = false
      this.reSizeSwiperHeight(this.tabIndex)
      // setTimeout(() => {
      //   this.loadMoreTips = '我是有底线的'
      //   this.showLoading = false
      // }, 2000)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.joo-main {
  background-color: #f5f5f5;
  // .joo-header {
  //   position: fixed;
  //   width: 100%;
  //   height: auto;
  //   overflow-y: auto;
  //   z-index: 9999;
  // }
  .joo-content {
    width: 100%;
    overflow: hidden;
    .joo-hot {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      .hot-list {
        .hot-item {
          display: inline-block;
        }
      }
    }
    .joo-swiper {
      width: 100%;
      overflow: hidden;
      // white-space: nowrap;
      .swiper-con {
        .swiper-item {
          display: inline-block;
        }
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
    background-color: #1985c4;
    box-shadow: 0 1px 10px #80848f;
    text-align: center;
    line-height: 50px;
    color: white;
    font-size: 26px;
    font-weight: 500;
  }
}
</style>
