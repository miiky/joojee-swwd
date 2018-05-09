<template>
    <div class="joo-card-item">
        <div class="item-header">
            <router-link :to="{ name: 'homepageother', params: { id: userId }}">
                <img class="item-avatar" :src="avatar" />
            </router-link>
            <div class="item-name">{{name}}</div>
            <img v-if="isBestAdopt" class="item-tag" src="@/assets/imgs/best-adopt.png" />
        </div>
        <router-link :to="{ name: 'answerList', params: { id: id }}">
            <div class="item-desc">
                {{answer}}
            </div>
        </router-link>
        <div class="item-imgs" v-if="hasImage">
            <flexbox :gutter="0">
                <flexbox-item v-for="(item, index) of imgList" :span="1/3" :key="index"><img class="img-item" :src="item" @click="previewImg(index)" /></flexbox-item>
            </flexbox>
        </div>
        <div class="item-footer">
            <span class="item-time">{{_time}}</span>
            <span class="item-numbers">
                <i class="iconfont icon-pinglun2" style="color:#cccccc;margin-right:5px;margin-top: -1px;vertical-align: middle;display: inline-block;"></i>{{commentNum}} 
                <i class="iconfont icon-dianzandianzhong" style="margin-right:5px;margin-left:10px;" :style="hasUpPost?'color:#1885c4;':'color:#cccccc;'" @click="fabulous"></i>{{fabulousNum}}
            </span>
        </div>
        <div v-transfer-dom>
            <previewer :list="previewImgs" ref="previewer" :options="options" @on-index-change="logIndexChange"></previewer>
        </div>
    </div>
</template>

<script>
import { Previewer, TransferDom } from 'vux'

export default {
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    userId: {
      type: [String, Number],
      required: true
    },
    isBestAdopt: {
      type: Boolean,
      default: false
    },
    name: {
      type: String
    },
    avatar: {
      type: String
    },
    time: {
      type: String
    },
    answer: {
      type: String,
      required: true
    },
    commentNum: {
      type: [Number, String],
      default: 0
    },
    fabulousNum: {
      type: [Number, String],
      default: 0
    },
    hasUpPost: {
      type: Boolean,
      default: false
    },
    imgList: {
      type: Array,
      default: []
    }
  },
  directives: {
    TransferDom
  },
  components: {
    Previewer
  },
  data() {
    return {
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
    _time() {
      return this.time.split('.')[0]
    },
    hasImage() {
      return this.imgList.length != 0
    },
    previewImgs: function() {
      let list = []
      if (this.imgList.length == 0) {
        return list
      }
      this.imgList.forEach(element => {
        list.push({
          msrc: element,
          src: element
        })
      })
      return list
    }
  },
  methods: {
    fabulous() {
      this.hasUpPost = !this.hasUpPost
      if (this.hasUpPost) {
        this.fabulousNum++
      } else {
        this.fabulousNum--
      }
      this.$emit('upPost', { id: this.id, hasUpPost: this.hasUpPost })
    },
    previewImg(index) {
      this.$refs.previewer.show(index)
    },
    logIndexChange(e) {
      //console.log(e)
    }
  }
}
</script>
<style lang="less" scoped>
.joo-card-item {
  position: relative;
  background-color: white;
  padding: 15px;
  margin: 10px 0;
  .item-header {
    line-height: 30px;
    height: 30px;
    margin: 5px 0;
    .item-name {
      float: left;
      margin-left: 10px;
      color: #a5a5a5;
      font-size: 13px;
    }
    .item-avatar {
      float: left;
      height: 30px;
      width: 30px;
      border-radius: 50%;
    }
    .item-tag {
      position: absolute;
      top: 15px;
      right: 0;
      height: 40px;
    }
  }
  .item-desc {
    color: #454545;
    font-size: 15px;
    line-height: 25px;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    .item-tag-img {
      height: 18px;
      margin-right: 5px;
      vertical-align: middle;
    }
  }
  .item-imgs {
    // position: relative;
    margin-top: 10px;
    .img-item {
      position: relative;
      width: 95%;
      height: 100px;
      border-radius: 3px;
    }
  }
  .item-footer {
    padding-top: 10px;
    line-height: 20px;
    .item-time {
      color: #a5a5a5;
      font-size: 13px;
    }
    .item-numbers {
      float: right;
      color: #a5a5a5;
      font-size: 13px;
    }
  }
}
</style>
