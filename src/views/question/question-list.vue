<template>
  <div class="joo-question">
    <!-- <Header class="joo-question-header"></Header> -->
    <div class="joo-question-top-card">
      <div class="card-tags">
        <span class="tag-item" v-for="(item,index) of tagList" :key="index">{{item}}</span>
      </div>
      <div class="card-title">未按规定开具发票但未少缴税是否也会受处罚？</div>
      <div class="card-desc" :class="showDescDetail?'':'card-desc-collapse'">酒店的住宿价格为280.00元/晚，除此之外，消费者在酒店还有餐饮消费120.00元，房间小酒吧消费60.00元，结算时客户要求将所有消费全部出具项，酒店的住宿价格为280.00元/晚，除此之外，消费者在酒店还有餐饮消费120.00元，房间小酒吧消费60.00元，结算时客户要求将所有消费全部出具项，酒店的住宿价格为280.00元/晚，除此之外，消费者在酒店还有餐饮消费120.00元，房间小酒吧消费60.00元，结算时客户要求将所有消费全部出具项.</div>
      <div class="card-imgs" v-show="showDescDetail">
        <flexbox>
          <flexbox-item v-for="(item, index) of imgList" :key="index"><img class="img-item" :src="item" @click="previewImg(index)" /></flexbox-item>
        </flexbox>
      </div>
      <div class="card-collapse" @click="showDescDetail = !showDescDetail">{{showDescDetail?'收起':'展开'}}
        <i class="iconfont" :class="showDescDetail?'icon-shouqi':'icon-zhankai'" style="font-size: 13px;"></i>
      </div>
      <div class="card-footer">
        <img class="card-avatar" src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1031893560,2135917576&fm=27&gp=0.jpg"
        />
        <div class="card-name">胡一天</div>
        <div class="card-others">09-22 • 浏览 59 • 回答 59</div>
      </div>
    </div>
    <CardItemAnswer :isBestAdopt="true" name="张三" avatar="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2809576112,626361756&fm=27&gp=0.jpg"
      time="04-08" answer="一、《发票管理办法》第二十二条规定，开具发票应当按照规定的时限、顺序、栏目，全部联次一次性如实开具，并加盖发票专用章。
任何单位和个人不得有下列虚开发票行为" commentNum="5" fabulousNum="12"></CardItemAnswer>
    <span style="color:#999999;font-size:14px;font-weight:500;padding-left:10px;">精选回答</span>
    <CardItemAnswer v-for="(item,index) of 5" :key="index" name="张三" avatar="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2809576112,626361756&fm=27&gp=0.jpg"
      time="04-08" answer="一、《发票管理办法》第二十二条规定，开具发票应当按照规定的时限、顺序、栏目，全部联次一次性如实开具，并加盖发票专用章。
任何单位和个人不得有下列虚开发票行为" commentNum="5" fabulousNum="12"></CardItemAnswer>
    <span style="color:#999999;font-size:14px;font-weight:500;padding-left:10px;">其他回答</span>
    <CardItemAnswer v-for="(item,index) of 10" :key="index+100" name="张三" avatar="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2809576112,626361756&fm=27&gp=0.jpg"
      time="04-08" answer="一、《发票管理办法》第二十二条规定，开具发票应当按照规定的时限、顺序、栏目，全部联次一次性如实开具，并加盖发票专用章。
任何单位和个人不得有下列虚开发票行为" commentNum="5" fabulousNum="12"></CardItemAnswer>
    <Footer class="joo-question-footer">
      <template slot="content">
        <div class="joo-collect" @click="collect">
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
import { Previewer, TransferDom } from 'vux'

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
      isCollect: false,
      collectNum: 13,
      showDescDetail: false,
      tagList: ['增值税', '流通', '价外税', '开具发票'],
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
    console.log(this.$route.params.id)
  },
  methods: {
    toAnswer() {
      this.$router.push('/answer')
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
        this.collectNum--
      } else {
        this.collectNum++
      }
      this.isCollect = !this.isCollect
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
  padding-bottom: 46px;
  .joo-question-header {
    position: fixed;
    width: 100%;
    height: auto;
    overflow-y: auto;
    z-index: 9999;
  }
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
}
</style>
