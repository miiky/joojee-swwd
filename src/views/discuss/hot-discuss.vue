<template>
  <div class="hot-discuss">
    <div class="discuss-header-img"></div>
    <div class="discuss-header">
      <div class="title">{{title}}</div>
      <div class="footer">
        <span class="right-text">{{replyCount}}人参与讨论</span>
      </div>
    </div>
    <sticky :check-sticky-support="false" :offset="0">
      <tab :line-width='2' custom-bar-width="20px" bar-active-color="#1985c4" default-color="#495060" active-color="#1985c4" v-model="tabIndex">
        <tab-item style="font-size:16px;" :selected="chooseTab === item" v-for="(item, index) in tabList" @click="chooseTab = item"
          :key="index">{{item}}</tab-item>
      </tab>
    </sticky>
    <swiper ref="hotSwiper" v-model="tabIndex" :show-dots="false" :threshold="150" :min-moving-distance="150" @on-index-change="swiperChange">
      <swiper-item>
        <div class="tab-content-hot" ref="hotBody">
          <div class="no-content" v-if="hotReplyList.length == 0">
            <img src="@/assets/imgs/no-content.png" />
            <div class="content-text">暂无内容</div>
          </div>
          <CardItemDiscuss v-for="item of hotReplyList" :key="item.id" :id="item.id" :userId="item.replyer.id" :name="item.replyer.realname"
            :avatar="item.replyer.profilePicture" :time="item.createTime" :answer="item.content" :commentNum="item.commentCount"
            :fabulousNum="item.upCount" :hasUpPost="item.hasUpPost" :imgList="item.images" @upPost="upPost"></CardItemDiscuss>
        </div>
      </swiper-item>
      <swiper-item>
        <div class="tab-content-new" ref="newBody">
          <div class="no-content" v-if="newReplyList.length == 0">
            <img src="@/assets/imgs/no-content.png" />
            <div class="content-text">暂无内容</div>
          </div>
          <CardItemDiscuss v-for="item of newReplyList" :key="item.id" :id="item.id" :userId="item.replyer.id" :name="item.replyer.realname"
            :avatar="item.replyer.profilePicture" :time="item.createTime" :answer="item.content" :commentNum="item.commentCount"
            :fabulousNum="item.upCount" :hasUpPost="item.hasUpPost" :imgList="item.images" @upPost="upPost"></CardItemDiscuss>
        </div>
      </swiper-item>
    </swiper>
    <div class="join-discuss" @click="joinDiscuss">
      <i class="iconfont icon-tiwen"></i> 参与讨论
    </div>
  </div>
</template>
<script>
import { Tab, TabItem, Sticky, Swiper, SwiperItem } from 'vux'
import { mapGetters, mapMutations } from 'vuex'
import CardItemDiscuss from '@/views/commons/card-item-discuss.vue'

export default {
  components: {
    Tab,
    TabItem,
    Sticky,
    Swiper,
    SwiperItem,
    CardItemDiscuss
  },
  data() {
    return {
      discussId: 0,
      chooseTab: '最热',
      tabIndex: 0,
      tabList: ['最热', '最新'],
      title: '',
      replyCount: 0,
      hotReplyList: [],
      newReplyList: []
    }
  },
  computed: {
    ...mapGetters(['sessionKey'])
  },
  async mounted() {
    const _this = this
    _this.discussId = this.$route.params.id
    await _this._getProblem()

    await _this._listNewestReplyOfHotDiscuss()
    await _this._listHotReplyOfHotDiscuss()
    _this.reSizeSwiperHeight(this.tabIndex)
    _this._handelMenuAction()
  },
  methods: {
    ...mapMutations(['setAnswer']),
    _handelMenuAction() {
      const _this = this
      _this.$bus.$on('menu13', data => {
        // TODO 分享
        sqt.shareAll({
          url: 'https://static.joojee.cn/swwd/discuss/' + _this.discussId, // 分享网页地址
          title: '税企通 | ' + _this.title + '【税务问答】', // 标题
          // descr: _this.problemTitle, // 摘要
          // icon: "", // 分享图标
          success: function(res) {},
          cancel: function(res) {}
        })
      })
    },
    joinDiscuss() {
      const _this = this
      if (_this.$utils.isEmpty(this.sessionKey)) {
        _this.$utils.oauth()
        return
      }
      _this.setAnswer({
        id: _this.discussId,
        title: _this.title
      })
      this.$router.push({
        name: 'answer'
      })
    },
    async _getProblem() {
      const _this = this
      await _this.$net.getProblem(_this.discussId).then(res => {
        // console.log(res.data.entities)
        let result = res.data.entities[0]
        _this.title = result.title
        _this.replyCount = result.replyCount
      })
    },
    async _listNewestReplyOfHotDiscuss() {
      const _this = this
      await _this.$net
        .listNewestReplyOfHotDiscuss(_this.discussId)
        .then(res => {
          console.log(res.data.entities)
          _this.newReplyList = res.data.entities
        })
    },
    async _listHotReplyOfHotDiscuss() {
      const _this = this
      await _this.$net.listHotReplyOfHotDiscuss(_this.discussId).then(res => {
        console.log(res.data.entities)
        _this.hotReplyList = res.data.entities
      })
    },
    swiperChange(currentIndex) {
      // 改变tab
      const _this = this
      _this.reSizeSwiperHeight(currentIndex)
    },
    reSizeSwiperHeight(currentIndex) {
      // 重新计算页面高度
      const _this = this
      let heights = [
        this.$refs.hotBody.offsetHeight,
        this.$refs.newBody.offsetHeight
      ]
      _this.$nextTick(() => {
        _this.$refs.hotSwiper.xheight = heights[currentIndex] + 'px'
      })
    },
    upPost(item) {
      if (item.hasUpPost) {
        _this.$net.upReply(item.id)
      } else {
        _this.$net.cancelUpReply(item.id)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.hot-discuss {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  .discuss-header-img {
    position: absolute;
    width: 100%;
    height: 150px;
    background-image: url('../../assets/imgs/hot-discuss-bg.jpg');
    background-size: cover;
    background-position: top right;
  }
  .discuss-header-img:before {
    position: absolute;
    top: 0;
    left: 0;
    content: '';
    background-color: black;
    opacity: 0.6;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
  .discuss-header {
    padding: 15px;
    position: relative;
    width: 100%;
    height: 150px;
    z-index: 2;
    .title {
      position: relative;
      z-index: 2;
      font-size: 19px;
      color: #ffffff;
    }
    .footer {
      position: absolute;
      left: 15px;
      right: 15px;
      bottom: 15px;
      height: 30px;
      line-height: 30px;
      .right-text {
        color: white;
        font-size: 13px;
        float: left;
      }
    }
  }
  .tab-content-hot {
    position: relative;
    width: 100%;
  }
  .tab-content-new {
    position: relative;
    width: 100%;
  }
  .no-content {
    position: relative;
    width: 100%;
    text-align: center;
    padding: 5rem 0;
    img {
      width: 127px;
    }
    .content-text {
      margin-top: 10px;
      color: #a5a5a5;
      font-size: 15px;
    }
  }
  .join-discuss {
    position: fixed;
    bottom: 10px;
    margin: auto;
    left: 0;
    right: 0;
    background-color: #1885c4;
    font-size: 15px;
    height: 50px;
    line-height: 50px;
    width: 115px;
    text-align: center;
    color: white;
    border-radius: 25px;
    box-shadow: 0 1px 10px #80848f;
  }
}
</style>

