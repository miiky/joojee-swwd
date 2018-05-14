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

            <div class="extend-number">{{replyTotal}}</div>

            <div class="extend-name">回答</div>
          </div>
          <div class="extend-fans">
            <router-link :to="{ name: 'userlist', params: { id: id },query:{type: 0}}">
              <div class="extend-number">{{fansCount}}</div>
            </router-link>
            <div class="extend-name">粉丝</div>
          </div>
          <div class="extend-follow">
            <router-link :to="{ name: 'userlist', params: { id: id },query:{type: 1}}">
              <div class="extend-number">{{attentCount}}</div>
            </router-link>
            <div class="extend-name">关注</div>
          </div>
          <div class="extend-action">
            <img class="top-follow" @click="follow" :src="!hasAttent?followPic:unfollowPic" />
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
      <swiper-item class="swiper-item">
        <!-- 动态 -->
        <div class="tab-content-news" ref="newsBody">
          <div class="no-content" v-if="dynamicsList.length == 0">
            <img src="@/assets/imgs/no-content.png" />
            <div class="content-text">暂无内容</div>
          </div>
          <div v-if="dynamicsList.length != 0">
            <CardItem v-for="(item,index) of dynamicsList" :key="index" :id="item.problem.id" :title="item.problem.title" :answer="item.problem.replys.length == 0?'':item.problem.replys[0].content"
              :tagList="item.problem.tags" :tagType="item.problem.replys.length == 0?'':item.problem.replys[0].replyType" :browseNum="item.problem.viewCount"
              :answerNum="item.problem.replyCount" :needHeader="true" :name="''" :acitonType="item.type" :avatar="''" :time="item.opreteTime"
              :needAvatar="false"></CardItem>
          </div>
        </div>
      </swiper-item>
      <swiper-item>
        <!-- 提问 -->
        <div class="tab-content-question" ref="questionBody">
          <div class="no-content" v-if="submitTotal == 0">
            <img src="@/assets/imgs/no-content.png" />
            <div class="content-text">暂无内容</div>
          </div>
          <div v-if="submitTotal != 0">
            <p class="total">共{{submitTotal}}条</p>
            <div class="question-item" v-for="item of submitList" :key="item.id" v-if="item.checkStatus == 1">
              <router-link :to="{ name: 'question', params: { id: item.id }}">
                <div class="item-title">{{item.title}}</div>
              </router-link>
              <div class="item-footer">
                <div class="item-time">{{item.createTime | timeFormat}}</div>
                <!-- <div class="item-status" :class="item.checkStatus == 1?'item-status-1':'item-status-0'">{{item.checkStatus | statusFormat}}</div> -->
              </div>
            </div>
            <!-- <CardItem v-for="(item,index) of submitList" :key="index" :id="item.id" :title="item.title" :answer="item.replys[0].content"
              :tagList="item.tags" :tagType="item.replys[0].replyType" :browseNum="item.viewCount" :answerNum="item.replyCount"></CardItem> -->
          </div>
        </div>
      </swiper-item>
      <swiper-item>
        <!-- 回答 -->
        <div class="tab-content-answer" ref="answerBody">
          <div class="no-content" v-if="replyTotal == 0">
            <img src="@/assets/imgs/no-content.png" />
            <div class="content-text">暂无内容</div>
          </div>
          <div v-if="replyTotal != 0">
            <p class="total">共{{replyTotal}}条</p>
            <CardItem v-for="(item,index) of replyList" :key="index" :id="item.id" :title="item.title" :answer="item.replys.length ==0?'':item.replys[0].content"
              :tagList="item.tags" :tagType="item.replys.length ==0?'':item.replys[0].replyType" :browseNum="item.viewCount"
              :answerNum="item.replyCount" :time="item.createTime"></CardItem>
          </div>
        </div>
      </swiper-item>
      <swiper-item>
        <!-- 收藏 -->
        <div class="tab-content-collection" ref="collectionBody">
          <div class="no-content" v-if="collectTotal == 0">
            <img src="@/assets/imgs/no-content.png" />
            <div class="content-text">暂无内容</div>
          </div>
          <div v-if="collectTotal != 0">
            <p class="total">共{{collectTotal}}条</p>
            <CardItem v-for="(item,index) of collectList" :key="index" :id="item.id" :title="item.title" :answer="item.replys.length ==0?'':item.replys[0].content"
              :tagList="item.tags" :tagType="item.replys.length ==0?'':item.replys[0].replyType" :browseNum="item.viewCount"
              :answerNum="item.replyCount" :time="item.createTime"></CardItem>
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
    dynamicsList(val) {
      this.$nextTick(() => {
        this.reSizeSwiperHeight(this.tabIndex)
      })
    }
  },
  data() {
    return {
      userId: 0,
      followPic: require('@/assets/imgs/follow.png'),
      unfollowPic: require('@/assets/imgs/unfollow.png'),

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
      username: '',

      dynamicsList: [],
      submitList: [],
      replyList: [],
      collectList: [],

      dynamicsTotal: 0,
      submitTotal: 0,
      replyTotal: 0,
      collectTotal: 0,

      dynamicsPage: 0,
      submitPage: 0,
      replyPage: 0,
      collectPage: 0
    }
  },
  computed: {
    ...mapGetters(['serverAccessToken', 'recommondList', 'recommondPage'])
  },
  mounted() {
    const _this = this
    console.log(this.recommondList)
    this.reSizeSwiperHeight(this.tabIndex)

    _this.userId = _this.$route.params.id

    this._getSomeoneInfo()
    this._listSomeoneSubmitProblems()
    this._listSomeoneReplyProblems()
    this._listSomeoneCollectProblems()
    this._listSomeoneDynamics()
  },
  methods: {
    _getSomeoneInfo() {
      const _this = this
      _this.$net.getSomeoneInfo(_this.userId).then(res => {
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
    _listSomeoneSubmitProblems() {
      const _this = this
      _this.$net.listSomeoneSubmitProblems(_this.userId).then(res => {
        console.log('_listSomeoneSubmitProblems', res.data.entities[0])
        let result = res.data.entities[0]
        _this.submitList = result.result
        _this.submitTotal = result.totalCount
      })
    },
    _listSomeoneReplyProblems() {
      const _this = this
      _this.$net.listSomeoneReplyProblems(_this.userId).then(res => {
        console.log('_listSomeoneReplyProblems', res.data.entities[0])
        let result = res.data.entities[0]
        _this.replyList = result.result
        _this.replyTotal = result.totalCount
      })
    },
    _listSomeoneCollectProblems() {
      const _this = this
      _this.$net.listSomeoneCollectProblems(_this.userId).then(res => {
        console.log('_listSomeoneCollectProblems', res.data.entities[0])
        let result = res.data.entities[0]
        _this.collectList = result.result
        _this.collectTotal = result.totalCount
      })
    },
    _listSomeoneDynamics() {
      const _this = this
      _this.$net.listSomeoneDynamics(_this.userId).then(res => {
        console.log('_listSomeoneDynamics', res.data.entities)
        let result = res.data.entities
        _this.dynamicsList = result
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
    },
    follow() {
      const _this = this
      if (_this.hasAttent) {
        _this.$net.cancelAttentUser(_this.userId)
        _this.hasAttent = false
      } else {
        _this.$net.attentUser(_this.userId)
        _this.hasAttent = true
      }
    }
  },
  filters: {
    timeFormat: function(val) {
      return val.substr(5, 5)
    },
    statusFormat: function(val) {
      //checkStatus; // 问题审核状态 0.审核中 1.审核成功 2.审核失败
      return val == 0 ? '审核中' : val == 1 ? '审核成功' : '审核失败'
    },
    contentFormat: function(val) {
      console.log(val === undefined)
      if (val === undefined) {
        return ''
      } else {
        return val.content
      }
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
        width: 80%;
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
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
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
          .top-follow {
            height: 30px;
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
  .tab-content-question {
    position: relative;
    .question-item {
      position: relative;
      background-color: white;
      font-size: 15px;
      padding: 15px;
      margin-bottom: 10px;
      .item-title {
        line-height: 25px;
        color: #333333;
        font-size: 17px;
      }
      .item-footer {
        position: relative;
        display: inline-block;
        width: 100%;
        line-height: 25px;
        .item-time {
          display: inline-block;
          color: #a5a5a5;
        }
        .item-status {
          float: right;
        }
        .item-status-0 {
          color: #666666;
        }
        .item-status-1 {
          color: #3ab78f;
        }
      }
    }
  }
  .tab-content-news {
    position: relative;
  }
  .no-content {
    text-align: center;
    padding: 3rem 0;
    img {
      width: 127px;
    }
    .content-text {
      margin-top: 10px;
      color: #a5a5a5;
      font-size: 15px;
    }
  }
  .total {
    color: #a5a5a5;
    font-size: 13px;
    padding: 10px;
  }
}
</style>


