<template>
  <div class="joo-homepage">
    <div class="top-card">
      <div class="user-info">
        <img class="user-avatar" :src="profilePicture" />
        <div class="user-content">
          <div class="user-name">{{realname}}<i class="iconfont " :class="gendar==1?'icon-nan1 gender-male':'icon-nv1 gender-female'"></i></div>
          <div class="user-desc">{{selfIntroduction}}</div>
        </div>
        <div class="user-extend">
          <div class="extend-answer">
            <div class="extend-number">{{attentCount}}</div>
            <div class="extend-name">回答</div>
          </div>
          <div class="extend-fans">
            <div class="extend-number">{{fansCount}}</div>
            <div class="extend-name">粉丝</div>
          </div>
          <div class="extend-follow">
            <div class="extend-number">{{collectCount}}</div>
            <div class="extend-name">关注</div>
          </div>
          <div class="extend-action">
            <router-link :to="{ name: 'userinfo', params: { id: `${id}` }}">
              <button class="action-edit">编辑</button>
            </router-link>
          </div>
        </div>
      </div>
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
        <div class="tab-content-news" ref="newsBody">
          <div class="no-content">
            <img src="@/assets/imgs/no-content.png" />
            <div class="content-text">暂无内容</div>
          </div>

        </div>
      </swiper-item>
      <swiper-item>
        <div class="tab-content-question" ref="questionBody">
          <div class="no-content">
            <img src="@/assets/imgs/no-content.png" />
            <div class="content-text">暂无内容</div>
          </div>
        </div>
      </swiper-item>
      <swiper-item>
        <div class="tab-content-answer" ref="answerBody">
          <p>共{{recommondList.length}}条</p>
          <CardItem v-for="(item,index) of recommondList" :key="index" :id="item.id" :title="item.title" :answer="item.replys[0].content"
            :tagList="item.tags" :tagType="item.replys[0].replyType" :browseNum="item.viewCount" :answerNum="item.replyCount"></CardItem>
        </div>
      </swiper-item>
      <swiper-item>
        <div class="tab-content-collection" ref="collectionBody">
          <div class="no-content">
            <img src="@/assets/imgs/no-content.png" />
            <div class="content-text">暂无内容</div>
          </div>
        </div>
      </swiper-item>
    </swiper>
  </div>
</template>
<script>
import { Tab, TabItem, Sticky, Swiper, SwiperItem } from 'vux'
import { mapGetters, mapMutations } from 'vuex'
import CardItem from '@/views/commons/card-item.vue'
import * as Net from '@/network/index'

export default {
  name: 'home',
  components: {
    CardItem,
    Tab,
    TabItem,
    Sticky,
    Swiper,
    SwiperItem
  },
  watch: {
    recommondList(val) {
      this.$nextTick(() => {
        this.reSizeSwiperHeight(this.tabIndex)
      })
    }
  },
  data() {
    return {
      chooseTab: '动态',
      tabIndex: 0,
      tabList: ['动态', '提问', '回答', '收藏'],
      attentCount: 0,
      collectCount: 0,
      fansCount: 0,
      gendar: 1,
      hasAttent: false,
      id: 0,
      isMutual: false,
      profilePicture: '',
      realname: '',
      selfIntroduction: null,
      username: ''
    }
  },
  computed: {
    ...mapGetters(['serverAccessToken', 'recommondList', 'recommondPage'])
  },
  mounted() {
    console.log(this.recommondList)
    this.reSizeSwiperHeight(this.tabIndex)
    this._getMyInfo()
  },
  methods: {
    _getMyInfo() {
      const _this = this
      Net.getMyInfo().then(res => {
        console.log(res.data.entities)
        let user = res.data.entities[0]
        _this.attentCount = user.attentCount
        _this.collectCount = user.collectCount
        _this.fansCount = user.fansCount
        _this.gendar = user.gendar
        _this.hasAttent = user.hasAttent
        _this.id = user.id
        _this.isMutual = user.isMutual
        _this.profilePicture = user.profilePicture
        _this.realname = user.realname
        _this.selfIntroduction =
          user.selfIntroduction == null
            ? '这家伙很懒，还没填写！'
            : user.selfIntroduction
        _this.username = user.username
      })
    },
    swiperChange(currentIndex) {
      // 改变tab
      const _this = this
      console.log(currentIndex)
      _this.reSizeSwiperHeight(currentIndex)
    },
    reSizeSwiperHeight(currentIndex) {
      // 重新计算页面高度
      const _this = this
      let heights = [
        this.$refs.newsBody.offsetHeight,
        this.$refs.questionBody.offsetHeight,
        this.$refs.answerBody.offsetHeight,
        this.$refs.collectionBody.offsetHeight
      ]
      console.log(heights)
      _this.$nextTick(() => {
        _this.$refs.swiper.xheight = heights[currentIndex] + 'px'
      })
    }
  }
}
</script>
<style lang="less" scoped>
.joo-homepage {
  position: absolute;
  background-color: #f5f5f5;
  width: 100%;
  height: 100%;
  .top-card {
    position: relative;
    padding: 20px 10px;
    background-color: white;
    margin-bottom: 10px;
    .user-info {
      position: relative;
      vertical-align: middle;
      .user-avatar {
        float: left;
        width: 65px;
        height: 65px;
        border-radius: 50%;
      }
      .user-content {
        display: inline-block;
        height: 65px;
        vertical-align: middle;
        padding-left: 10px;
        .user-name {
          line-height: 35px;
          color: #373737;
          font-size: 18px;
          .gender-male {
            margin-left: 10px;
            color: #30aeff;
          }
          .gender-female {
            margin-left: 10px;
            color: #ff3f56;
          }
        }
        .user-desc {
          color: #666666;
          font-size: 15px;
        }
      }
      .user-extend {
        position: relative;
        margin-top: 10px;
        .extend-answer {
          text-align: center;
          width: 18%;
          display: inline-block;
        }
        .extend-fans {
          text-align: center;
          width: 18%;
          display: inline-block;
        }
        .extend-follow {
          text-align: center;
          width: 18%;
          display: inline-block;
        }
        .extend-action {
          text-align: right;
          padding-bottom: 4px;
          width: 40%;
          display: inline-block;
          vertical-align: text-bottom;
          .action-edit {
            background-color: white;
            border: 1px solid #1885c4;
            color: #1885c4;
            font-size: 14px;
            border-radius: 4px;
            padding: 4px 40px;
          }
        }
        .extend-number {
          color: #373737;
          font-size: 18px;
        }
        .extend-name {
          color: #666666;
          font-size: 13px;
        }
      }
    }
  }
  .tab-content-news {
    position: relative;
  }
  .tab-content-answer {
    p {
      color: #a5a5a5;
      font-size: 13px;
      padding: 10px;
    }
  }
  .no-content {
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
}
</style>


