<template>
  <router-link :to="{ name: 'question', params: { id: id }}">
    <div class="joo-card-item">
      <template v-if="needHeader">
        <div class="item-header" v-if="needAvatar">
          <img v-if="avatar != ''" class="item-avatar" :src="avatar" />
          <div v-if="name != ''" class="item-name">{{name}}</div>
        </div>
        <div class="item-time">{{ time | timeFormat }}</div>
        <div class="item-action">{{ acitonType| toActionName }}</div>
      </template>
      <div class="item-title">{{title}}</div>
      <div class="item-desc">
        <img v-show="showTag" class="item-tag-img" :src="tagImgUrl" />{{answer}}
      </div>
      <div class="item-footer">
        <span class="item-tag" v-for="item of tagList" :key="item.id">{{item.name}}</span>
        <span class="item-numbers">{{numbersText}}</span>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    id: {
      type: [Number, String],
      require: true
    },
    needHeader: {
      type: Boolean,
      default: false
    },
    needAvatar: {
      type: Boolean,
      default: true
    },
    name: {
      type: String
    },
    acitonType: {
      type: [Number, String]
    },
    avatar: {
      type: String
    },
    time: {
      type: String
    },
    title: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    tagList: {
      type: Array,
      required: true
    },
    tagType: {
      type: [Number, String],
      default: 0
    },
    answerNum: {
      type: [Number, String],
      default: 0
    },
    browseNum: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      adopt: require('@/assets/imgs/adopt.png'),
      selection: require('@/assets/imgs/selection.png')
    }
  },
  computed: {
    numbersText: function() {
      return '回答 ' + this.answerNum + ' • ' + '浏览 ' + this.browseNum
    },
    tagImgUrl: function() {
      const _this = this
      //0、普通， 1、精选， 2、采纳
      return _this.tagType == 1 ? _this.selection : _this.adopt
    },
    showTag: function() {
      const _this = this
      return _this.tagType == 1 || _this.tagType == 2
    }
  },
  filters: {
    toActionName: function(val) {
      if (!Number.isInteger(val)) {
        val = Number.parseInt(val)
      }
      //1.收藏了问题  2.点赞了回答  3.点赞了评论  4.发布了问题  5.回答了问题  6.评论了回答
      let names = [
        '收藏了问题',
        '点赞了回答',
        '点赞了评论',
        '发布了问题',
        '回答了问题',
        '评论了回答'
      ]
      return names[val - 1]
    },
    timeFormat: function(val) {
      return val.substr(5, 5)
    }
  }
}
</script>
<style lang="less" scoped>
.joo-card-item {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
  .item-header {
    line-height: 30px;
    height: 30px;
    margin: 5px 0;
    .item-name {
      float: left;
      margin-left: 10px;
      color: #333333;
      font-size: 15px;
    }
    .item-avatar {
      float: left;
      height: 30px;
      width: 30px;
      border-radius: 50%;
    }
  }
  .item-time {
    float: right;
    color: #a5a5a5;
    font-size: 15px;
  }
  .item-action {
    color: #a5a5a5;
    font-size: 14px;
    line-height: 2;
  }
  .item-title {
    color: #333333;
    font-size: 17px;
  }
  .item-desc {
    color: #666666;
    font-size: 15px;
    line-height: 25px;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    .item-tag-img {
      height: 18px;
      margin-right: 5px;
      vertical-align: middle;
    }
  }
  .item-footer {
    padding-top: 10px;
    line-height: 2;
    .item-tag {
      padding: 3px;
      margin-right: 10px;
      background-color: #f4f5f7;
      color: #a5a5a5;
      border-radius: 4px;
      font-size: 12px;
    }
    .item-numbers {
      float: right;
      color: #a5a5a5;
      font-size: 13px;
    }
  }
}
</style>
