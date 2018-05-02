<template>
  <div class="joo-question">
    <div class="joo-question-top-card">
      <div class="card-tags">
        <span class="tag-item" v-for="item of tagList" :key="item.id">{{item.name}}</span>
      </div>
      <div class="card-title">{{title}}</div>
      <div class="card-desc" :class="showDescDetail?'':'card-desc-collapse'">{{content}}</div>
      <div class="card-imgs" v-show="showDescDetail">
        <flexbox v-show="hasImage">
          <flexbox-item v-for="(item, index) of images" :span="1/3" :key="index"><img class="img-item" :src="item" @click="previewImg(index)" /></flexbox-item>
        </flexbox>
      </div>
      <div class="card-collapse" @click="showDescDetail = !showDescDetail">{{showDescDetail?'收起':'展开'}}
        <i class="iconfont" :class="showDescDetail?'icon-shouqi':'icon-zhankai'" style="font-size: 13px;"></i>
      </div>
      <div class="card-footer">
        <img class="card-avatar" :src="creater.profilePicture" />
        <div class="card-name">{{creater.realname}}</div>
        <div class="card-others">{{createTime+' • 浏览 '+viewCount+' • 回答 '+replyCount}}</div>
      </div>
    </div>
    <div class="no-reply" v-if="hasAnyCommont">
      <img src="@/assets/imgs/no-content.png" />
      <p>暂无评论</p>
    </div>
    <div v-if="bestReply.length != 0">
      <CardItemAnswer :isBestAdopt="true" v-for="item of bestReply" :key="item.id" :id="item.id" :name="item.replyer.realname"
        :avatar="item.replyer.profilePicture" :time="item.createTime" :answer="item.content" :commentNum="item.commentCount"
        :fabulousNum="item.upCount" :hasUpPost="item.hasUpPost" @upPost="upPost"></CardItemAnswer>
    </div>
    <div v-if="goodReply.length != 0">
      <span style="color:#999999;font-size:14px;font-weight:500;padding-left:10px;">精选回答</span>
      <CardItemAnswer v-for="item of goodReply" :key="item.id" :id="item.id" :name="item.replyer.realname" :avatar="item.replyer.profilePicture"
        :time="item.createTime" :answer="item.content" :commentNum="item.commentCount" :fabulousNum="item.upCount" :hasUpPost="item.hasUpPost"
        @upPost="upPost"></CardItemAnswer>
    </div>
    <div v-if="otherReply.length != 0" style="padding-bottom:50px;">
      <span style="color:#999999;font-size:14px;font-weight:500;padding-left:10px;">其他回答</span>
      <CardItemAnswer v-for="item of otherReply" :key="item.id" :id="item.id" :name="item.replyer.realname" :avatar="item.replyer.profilePicture"
        :time="item.createTime" :answer="item.content" :commentNum="item.commentCount" :fabulousNum="item.upCount" :hasUpPost="item.hasUpPost"
        @upPost="upPost"></CardItemAnswer>
    </div>
    <Footer class="joo-question-footer">
      <template slot="content">
        <div class="joo-collect" @click="collect" :class="isCollect?'animated pulse':''">
          <i class="iconfont" :class="isCollect?'icon-shoucang3 collect-icon':'icon-shoucang4'"></i>
          <span> {{collectNum}}人收藏</span>
        </div>
        <div class="joo-answer" @click="toAnswer">我来回答</div>

      </template>
    </Footer>
    <div v-transfer-dom>
      <previewer :list="previewImgs" ref="previewer" :options="options" @on-index-change="logIndexChange"></previewer>
    </div>
  </div>
</template>

<script>
import Header from '@/views/commons/header.vue'
import Footer from '@/views/commons/footer.vue'
import CardItemAnswer from '@/views/commons/card-item-answer.vue'
// import MyScroll from '@/views/commons/my-scroll.vue'
import * as Net from '@/network/index'
import * as Utils from '@/utils/index'
import bus from '@/utils/bus'

import { Previewer, TransferDom } from 'vux'
import { mapGetters, mapMutations, mapActions } from 'vuex'

import 'animate.css'

export default {
  name: 'question',
  directives: {
    TransferDom
  },
  components: {
    Previewer,
    Header,
    Footer,
    CardItemAnswer
  },
  data() {
    return {
      problemId: null,
      data: [],
      isCollect: false,
      collectNum: 0,
      showDescDetail: true,
      tagList: [],
      title: '',
      content: '',
      hasImage: false,
      images: [],
      createTime: '00-00',
      viewCount: 0,
      replyCount: 0,
      creater: { profilePicture: '', realname: '' },
      bestReply: [],
      goodReply: [],
      otherReply: [],
      options: {
        getThumbBoundsFn(index) {
          let thumbnail = document.querySelectorAll('.img-item')[index]
          let pageYScroll =
            window.pageYOffset || document.documentElement.scrollTop
          let rect = thumbnail.getBoundingClientRect()
          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }
        }
      }
    }
  },
  computed: {
    ...mapGetters(['sessionKey']),
    previewImgs: function() {
      let list = []
      this.images.forEach(element => {
        list.push({
          msrc: element,
          src: element
        })
      })
      return list
    },
    hasAnyCommont: function() {
      return (
        this.bestReply.length +
          this.goodReply.length +
          this.otherReply.length ===
        0
      )
    }
  },
  mounted() {
    const _this = this
    _this.problemId = this.$route.params.id
    _this._handelMenuAction()
    _this._getProblem()
    _this._listReplys()
  },
  methods: {
    ...mapMutations(['setAnswer']),
    ...mapActions(['showPopupAction']),
    _handelMenuAction() {
      const _this = this
      bus.$on('menu3', data => {
        // TODO 分享
        sqt.shareAll({
          url: 'https://static.joojee.cn/swwd/question/' + _this.problemId, // 分享网页地址
          title: '税企通 | ' + _this.title + '【税务问答】', // 标题
          // descr: _this.title, // 摘要
          // icon: "", // 分享图标
          success: function(res) {},
          cancel: function(res) {}
        })
      })
    },
    async _getProblem() {
      const _this = this
      await Net.getProblem(_this.problemId).then(res => {
        res = res.data.entities[0]
        console.log('problem', res)
        _this.title = res.title
        _this.content = res.content
        _this.creater = res.creater
        _this.hasImage = res.hasImage
        _this.images = res.images
        _this.createTime = res.createTime.split(' ')[0]
        _this.viewCount = res.viewCount
        _this.replyCount = res.replyCount
        _this.tagList =
          res.tags.length !== 0 ? res.tags : [{ name: '无标签', id: 1 }]
        _this.collectNum = res.collectCount
        _this.isCollect = res.hasCollect
      })
    },
    async _listReplys() {
      const _this = this
      await Net.listReplys(_this.problemId).then(res => {
        console.log('_listReplys', res)
        res = res.data.entities
        res.forEach(e => {
          if (e.replyType == '2') {
            _this.bestReply.push(e)
          } else if (e.replyType == '1') {
            _this.goodReply.push(e)
          } else {
            _this.otherReply.push(e)
          }
        })
      })
    },
    loadMore() {
      console.log('loadMore')
    },
    loadData() {
      console.log('loadData')
    },
    toAnswer() {
      const _this = this
      if (_this.sessionKey == '') {
        Utils.oauth()
        return
      }
      _this.setAnswer({
        id: _this.problemId,
        title: _this.title
      })
      this.$router.push({
        name: 'answer',
        params: { userId: `${this.problemId}` }
      })
    },
    logIndexChange(e) {
      //隐藏fullscreen按钮
      document.getElementsByClassName('pswp__button--fs')[0].style.display =
        'none'
    },
    previewImg(index) {
      this.$refs.previewer.show(index)
      //隐藏fullscreen按钮
      document.getElementsByClassName('pswp__button--fs')[0].style.display =
        'none'
    },
    collect() {
      if (this.isCollect) {
        Net.cancelCollectProblem(this.problemId)
        this.collectNum--
      } else {
        Net.collectProblem(this.problemId)
        this.collectNum++
      }
      this.isCollect = !this.isCollect
    },
    upPost(item) {
      if (item.hasUpPost) {
        Net.upReply(item.id)
      } else {
        Net.cancelUpReply(item.id)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.pswp--supports-fs .pswp__button--fs {
  display: none !important;
}
.joo-question {
  background-color: #f5f5f5;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: 50px;
  .joo-question-top-card {
    background-color: white;
    padding: 10px 15px 15px 15px;
    margin-bottom: 10px;
    .card-tags {
      padding: 10px 0;
      .tag-item {
        padding: 8px;
        line-height: 29px;
        margin-right: 10px;
        background-color: #f4f5f7;
        color: #808080;
        border-radius: 4px;
        font-size: 12px;
      }
    }
    .card-title {
      color: #333333;
      font-size: 19px;
    }
    .card-desc {
      color: #666666;
      font-size: 15px;
    }
    .card-desc-collapse {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    .card-collapse {
      color: #a5a5a5;
      font-size: 13px;
      text-align: center;
      padding: 15px;
    }
    .card-imgs {
      margin-top: 10px;
      .img-item {
        height: 100px;
        width: 100%;
      }
    }
    .card-footer {
      line-height: 30px;
      height: 30px;
      .card-avatar {
        float: left;
        height: 30px;
        width: 30px;
        border-radius: 50%;
      }
      .card-name {
        float: left;
        margin-left: 10px;
        color: #a5a5a5;
        font-size: 13px;
      }
      .card-others {
        float: right;
        color: #a5a5a5;
        font-size: 13px;
      }
    }
  }
  .joo-question-footer {
    height: 46px;
    .joo-collect {
      color: #6c6c6e;
      font-size: 16px;
      text-align: center;
      line-height: 46px;
      width: 40%;
      background-color: white;
      float: left;
      .collect-icon {
        color: #1985c4;
      }
    }
    .joo-answer {
      color: white;
      font-size: 16px;
      text-align: center;
      line-height: 46px;
      width: 60%;
      background-color: #1985c4;
      float: left;
    }
  }
  .no-reply {
    text-align: center;
    padding: 5rem;
    background-color: white;
    img {
      width: 127px;
    }
    p {
      color: #a5a5a5;
      font-size: 15px;
    }
  }
}
</style>
