<template>
  <div class="joo-answer">
    <!-- <Header class="joo-answer-header"></Header> -->
    <div class="joo-answer-title">未按规定开具发票但未少缴税是否也会受处罚？</div>
    <div class="joo-answer-card">
      <div class="card-top">
        <img class="top-avatar" src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3802506693,1778634825&fm=27&gp=0.jpg"
        />
        <div class="top-text">
          <p class="top-name">张么么</p>
          <p class="top-desc">资深会计</p>
        </div>
        <div v-show="!isFollow" class="top-follow" @click="isFollow = !isFollow">+ 关注</div>
        <div v-show="isFollow" class="top-followed" @click="isFollow = !isFollow">已关注</div>
      </div>
      <div class="card-desc">一、《发票管理办法》第二十二条规定，开具发票应当按照规定的时限、顺序、栏目，全部联次一次性如实开具，并加盖发票专用章。 任何单位和个人不得有下列虚开发票行为： （一）为他人、为自己开具与实际经营业务情况不符的发票； （二）让他人为自己开具与实际经营业务情况不符的发票；
        （三）介绍他人开具与实际经营业务情况不符的发票。《国家税务总局关于增值税发票开具有关问题的公告》。
      </div>
      <div class="card-imgs">
        <flexbox>
          <flexbox-item v-for="(item, index) of imgList" :key="index"><img class="img-item" :src="item" @click="previewImg(index)" /></flexbox-item>
        </flexbox>
      </div>
      <div class="card-footer">
        <div class="card-time">2018-09-22</div>
      </div>
    </div>
    <div class="joo-comment">
      <div class="joo-comment-top">全部评论</div>
      <CardItemAnswer v-for="(item,index) of 5" :key="index"></CardItemAnswer>
    </div>
    <Footer class="joo-answer-footer" v-if="!isInput">
      <template slot="content">
        <div class="joo-collect">
          <div>
            <div class="input-comment" @click="writeComment">写评论...</div>
            <div class="input-right">
              <i class="iconfont icon-pinglun3" style="margin-right:5px;margin-top: -1px;vertical-align: middle;display: inline-block;font-size:20px;"></i>12
              <i class="iconfont icon-dianzanxiankuang" style="margin-right:20px;margin-left:10px;font-size:20px;"></i>
            </div>
          </div>

        </div>
      </template>
    </Footer>
    <div v-show="isInput" class="joo-input">
      <input id="collectInput" ref="collectInput" class="collect-input" v-model="comment" autocomplete="off" autocapitalize="off"
        autocorrect="off" spellcheck="false" type="textarea" placeholder="写评论..." @focus="focus" @blur="blur" /><span class="collect-send">发送</span>
    </div>

    <div v-transfer-dom>
      <previewer :list="previewImgs" ref="previewer" :options="options" @on-index-change="logIndexChange"></previewer>
    </div>
  </div>
</template>

<script>
import Header from '@/views/commons/header.vue'
import Footer from '@/views/commons/footer.vue'
import CardItemAnswer from '@/views/commons/card-item-comment.vue'
import { Previewer, TransferDom, XInput } from 'vux'

export default {
  name: 'answer',
  directives: {
    TransferDom
  },
  components: {
    Previewer,
    Header,
    Footer,
    CardItemAnswer,
    XInput
  },
  data() {
    return {
      isInput: false,
      comment: '',
      isFollow: false,
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
      }
    }
  },
  computed: {
    previewImgs: function() {
      let list = []
      this.imgList.forEach(element => {
        list.push({
          msrc: element,
          src: element
        })
      })
      return list
    }
  },
  mounted() {
    const _this = this
  },
  methods: {
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
      _this.scrollToEnd()
      setTimeout(() => {
        _this.$refs.collectInput.focus()
      }, 300)
    },
    focus() {
      this.scrollToEnd()
    },
    blur() {
      this.isInput = false
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
      height: 50px;
      width: 100%;
      .top-avatar {
        float: left;
        height: 37px;
        width: 37px;
        border-radius: 50%;
      }
      .top-text {
        float: left;
        padding-left: 10px;
        .top-name {
          color: #333333;
          font-size: 15px;
        }
        .top-desc {
          color: #a5a5a5;
          font-size: 13px;
        }
      }
      .top-follow {
        float: right;
        border: 1px solid #1885c4;
        color: #1885c4;
        border-radius: 4px;
        font-size: 14px;
        padding: 3px 10px;
      }
      .top-followed {
        float: right;
        background-color: #ececec;
        color: #a5a5a5;
        border-radius: 4px;
        font-size: 14px;
        padding: 3px 10px;
      }
    }
    .card-desc {
      color: #333333;
      font-size: 16px;
    }
    .card-imgs {
      margin-top: 10px;
      .img-item {
        width: 100%;
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
