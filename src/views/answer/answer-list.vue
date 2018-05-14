<template>
  <div class="joo-answer">
    <!-- <Header class="joo-answer-header"></Header> -->
    <div class="joo-answer-title">{{problemTitle}}</div>
    <div class="joo-answer-card">
      <div class="card-top">
        <router-link :to="{ name: 'homepageother', params: { id: replyerId }}">
          <img class="top-avatar" :src="profilePicture" />
        </router-link>
        <div class="top-text">
          <p class="top-name">{{realname}}</p>
          <p class="top-desc">{{selfIntroduction}}</p>
        </div>
        <div v-if="!isSelf">
          <img class="top-follow" @click="follow" :src="!isFollow?followPic:unfollowPic" />
        </div>
      </div>
      <div class="card-desc">{{content}}</div>
      <div class="card-imgs" v-if="hasImage">
        <flexbox :gutter="0">
          <flexbox-item v-for="(item, index) of images" :span="1/3" :key="index"><img class="img-item" :src="item" @click="previewImg(index)" /></flexbox-item>
        </flexbox>
      </div>
      <div class="card-footer">
        <div class="card-time">{{createTime}}</div>
      </div>
    </div>
    <div class="joo-comment" v-if="commentList.length != 0">
      <div class="joo-comment-top">全部评论</div>
      <CardItemComment v-for="item of commentList" :key="item.id" :id="item.id" :avatar="item.commenter.profilePicture" :content="item.content"
        :hasUpPost="item.hasUpPost" :name="item.commenter.realname" :time="item.createTime" @upReply="upReply(item)"></CardItemComment>
    </div>
    <div class="joo-comment" v-if="commentList.length == 0">
      <div class="no-content">
        <img class="no-content-pic" src="@/assets/imgs/no-content.png" />
        <p class="no-content-text">暂无评论</p>
      </div>
    </div>
    <Footer class="joo-answer-footer" v-if="!isInput">
      <template slot="content">
        <div class="joo-collect">
          <div>
            <div class="input-comment" @click="writeComment">写评论...</div>
            <div class="input-right">
              <i class="iconfont icon-pinglun3" style="margin-right:5px;margin-top: -1px;vertical-align: middle;display: inline-block;font-size:20px;"></i>{{commentCount}}
              <i class="iconfont icon-dianzanxiankuang" :class="hasUpPost?'upPost':''" style="margin-right:20px;margin-left:10px;font-size:20px;"
                @click="upPost"></i>
            </div>
          </div>
        </div>
      </template>
    </Footer>
    <miiky-textarea v-if="isInput" @submit="sendComment" :maxLength="500"></miiky-textarea>

    <div v-transfer-dom>
      <previewer :list="previewImgs" ref="previewer" :options="options" @on-index-change="logIndexChange"></previewer>
    </div>
  </div>
</template>

<script>
import Header from '@/views/commons/header.vue'
import Footer from '@/views/commons/footer.vue'
import CardItemComment from '@/views/commons/card-item-comment.vue'
import MiikyTextarea from '@/views/commons/miiky-textarea.vue'

import { Previewer, TransferDom, XInput } from 'vux'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'answer',
  directives: {
    TransferDom
  },
  components: {
    Previewer,
    Header,
    Footer,
    CardItemComment,
    XInput,
    MiikyTextarea
  },
  data() {
    return {
      replyId: 0,
      problemId: 0,
      problemTitle: '',
      profilePicture: '',
      problemCreaterId: 0,
      realname: '',
      replyerId: 0,
      selfIntroduction: '',
      hasImage: false,
      hasUpPost: false,
      images: [],
      content: '',
      createTime: '',
      commentCount: 0,

      isInput: false,
      onceInput: true,
      comment: '',
      isFollow: false,
      followPic: require('@/assets/imgs/follow.png'),
      unfollowPic: require('@/assets/imgs/unfollow.png'),
      imgList: [
        'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3802506693,1778634825&fm=27&gp=0.jpg',
        'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1224306677,1730366661&fm=27&gp=0.jpg',
        'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3057512949,2471002942&fm=27&gp=0.jpg'
      ],
      options: {
        getThumbBoundsFn(index) {
          let thumbnail = document.querySelectorAll('.img-item')[index]
          let pageYScroll =
            window.pageYOffset || document.documentElement.scrollTop
          let rect = thumbnail.getBoundingClientRect()
          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }
        }
      },

      commentList: [],
      pageNo: 1,
      pageSize: 20
    }
  },
  computed: {
    ...mapGetters(['userId', 'sessionKey']),
    previewImgs: function() {
      let list = []
      if (this.images.length == 0) {
        return list
      }
      this.images.forEach(element => {
        list.push({
          msrc: element,
          src: element
        })
      })
      return list
    },
    isSelf: function() {
      const _this = this
      return _this.userId == _this.replyerId
    }
  },
  async mounted() {
    const _this = this
    _this.replyId = this.$route.params.id
    _this._handelMenuAction()

    await _this._getReply()
    await _this._listComments(_this.pageNo)
  },
  methods: {
    ...mapActions(['showPopupAction']),
    _handelMenuAction() {
      const _this = this
      _this.$bus.$on('menu6', data => {
        // TODO 分享
        sqt.shareAll({
          url: 'https://static.joojee.cn/swwd/answer/' + _this.replyId, // 分享网页地址
          title: '税企通 | ' + _this.problemTitle + '【税务问答】', // 标题
          // descr: _this.problemTitle, // 摘要
          // icon: "", // 分享图标
          success: function(res) {},
          cancel: function(res) {}
        })
      })
      _this.$bus.$on('menu7', data => {
        // TODO 举报
        _this.showPopupAction({
          type: 'error',
          msg: '功能即将开放！'
        })
      })
      _this.$bus.$on('menu8', data => {
        // TODO 采纳
        if (_this.userId != _this.problemCreaterId) {
          _this.showPopupAction({
            type: 'error',
            msg: '您没有权限操作！'
          })
          return
        }
        _this.$net.setBestReply(_this.problemId, _this.replyId).then(res => {
          _this.showPopupAction({
            type: 'success',
            msg: '当前答案已设置为最佳采纳！'
          })
        })
      })
    },
    async _getReply() {
      const _this = this
      await _this.$net.getReply(_this.replyId).then(res => {
        console.log(res.data.entities)
        res = res.data.entities[0]
        _this.replyId = res.id
        _this.problemId = res.problemId
        _this.problemTitle = res.problemTitle
        _this.problemCreaterId = res.problemCreaterId
        _this.profilePicture = res.replyer.profilePicture
        _this.realname = res.replyer.realname
        _this.replyerId = res.replyer.id
        _this.isFollow = res.replyer.hasAttent
        _this.selfIntroduction = res.replyer.selfIntroduction || '暂无'
        _this.hasImage = res.hasImage
        _this.hasUpPost = res.hasUpPost
        _this.images = res.images
        _this.content = res.content
        _this.createTime = res.createTime
        _this.commentCount = res.commentCount
      })
    },
    async _listComments(pageNo) {
      const _this = this
      await _this.$net
        .listComments(_this.problemId, _this.replyId, pageNo, _this.pageSize)
        .then(res => {
          res = res.data.entities
          console.log(res)
          if (pageNo == 1) {
            _this.commentList = res
          } else {
            _this.commentList = [..._this.commentList, ...res]
          }
        })
    },
    sendComment(item) {
      const _this = this
      if (_this.$utils.isEmpty(_this.sessionKey)) {
        _this.$utils.oauth()
        return
      }
      _this.$net
        .submitComment(_this.problemId, _this.replyId, item.content)
        .then(res => {
          _this._listComments(1)
          _this.isInput = false
        })
    },
    follow() {
      const _this = this
      if (_this.$utils.isEmpty(this.sessionKey)) {
        _this.$utils.oauth()
        return
      }
      if (_this.isFollow) {
        _this.$net.cancelAttentUser(_this.replyerId)
        _this.isFollow = false
      } else {
        _this.$net.attentUser(_this.replyerId)
        _this.isFollow = true
      }
    },
    upReply(item) {
      const _this = this
      if (_this.$utils.isEmpty(this.sessionKey)) {
        _this.$utils.oauth()
        return
      }
      item.hasUpPost = !item.hasUpPost
      if (item.hasUpPost) {
        _this.$net.upReply(item.id)
      } else {
        _this.$net.cancelUpReply(item.id)
      }
    },
    upPost() {
      const _this = this
      if (_this.$utils.isEmpty(this.sessionKey)) {
        _this.$utils.oauth()
        return
      }
      this.hasUpPost = !this.hasUpPost
      if (this.hasUpPost) {
        _this.$net.upReply(this.replyId)
      } else {
        _this.$net.cancelUpReply(this.replyId)
      }
    },
    scrollToEnd() {
      setTimeout(() => {
        document.body.scrollTop = document.body.scrollHeight
      }, 300)
    },
    logIndexChange(e) {
      //console.log(e)
    },
    previewImg(index) {
      this.$refs.previewer.show(index)
    },
    writeComment() {
      const _this = this
      _this.isInput = true
    }
  }
}
</script>
<style lang="less" scoped>
.joo-answer {
  padding-bottom: 46px;
  background-color: #f5f5f5;
  .joo-answer-header {
    position: fixed;
    width: 100%;
    height: auto;
    overflow-y: auto;
    z-index: 9999;
  }
  .joo-answer-title {
    padding: 10px 15px 10px 15px;
    font-size: 19px;
    color: #333333;
    background-color: white;
  }
  .joo-answer-card {
    margin-top: 10px;
    background-color: white;
    padding: 15px 15px 15px 15px;
    margin-bottom: 10px;
    .card-top {
      position: relative;
      height: 50px;
      width: 100%;
      .top-avatar {
        float: left;
        height: 37px;
        width: 37px;
        border-radius: 50%;
      }
      .top-text {
        width: 70%;
        float: left;
        padding-left: 10px;
        .top-name {
          color: #333333;
          font-size: 15px;
        }
        .top-desc {
          color: #a5a5a5;
          font-size: 13px;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
      .top-follow {
        position: absolute;
        right: 0;
        top: 0;
        height: 30px;
      }
    }
    .card-desc {
      position: relative;
      color: #333333;
      font-size: 16px;
    }
    .card-imgs {
      margin-top: 10px;
      .img-item {
        position: relative;
        width: 95%;
        height: 100px;
        border-radius: 3px;
      }
    }
    .card-footer {
      line-height: 30px;
      height: 30px;
      .card-time {
        float: right;
        color: #a5a5a5;
        font-size: 15px;
      }
    }
  }
  .joo-comment {
    background-color: white;
    padding: 15px;
    .joo-comment-top {
      margin-bottom: 10px;
      border-left: 2px solid #1985c4;
      padding-left: 5px;
      line-height: 1;
      color: #333333;
      font-size: 15px;
    }
    .no-content {
      text-align: center;
      .no-content-pic {
        margin-top: 5rem;
        width: 127px;
      }
      .no-content-text {
        color: #a5a5a5;
        font-size: 15px;
        margin-bottom: 5rem;
      }
    }
  }
  .joo-answer-footer {
    border-top: 1px solid #ebebeb;
    .joo-collect {
      position: relative;
      line-height: 46px;
      padding-left: 20px;
      background-color: #fdfeff;
      .input-comment {
        color: #333333;
        display: inline-block;
        font-size: 15px;
        width: 60%;
      }
      .input-right {
        float: right;
        color: #686869;
        font-size: 13px;
        .upPost {
          color: #1985c4;
        }
      }
    }
  }
  .joo-input {
    border-top: 1px solid #ebebeb;
    position: fixed;
    bottom: 0;
    width: 100%;
    padding-left: 20px;
    background-color: #fdfeff;
    .collect-input {
      margin: 8px 0;
      width: 80%;
      border: 0;
      outline: 0;
      -webkit-appearance: none;
      background-color: transparent;
      border-bottom: 1px solid #1985c4;
      border-radius: 0px;
      padding-left: 5px;
      font-size: inherit;
      color: inherit;
      height: 30px;
      line-height: 30px;
    }
    .collect-send {
      padding-left: 20px;
      color: #333333;
      font-size: 15px;
    }
  }
}
</style>
