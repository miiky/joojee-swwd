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
        <span class="item-tag" v-for="item of tagListShow" :key="item.id">{{item.name}}</span>
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
  methods: {
    timeFilter: function(time) {
      //当前时间
      let _now = new Date().getTime()
      //时间差
      let _interval = _now - time
      if (_interval <= 5 * 60 * 1000) {
        return '刚刚'
      } else if (_interval < 60 * 60 * 1000) {
        return Number.parseInt(_interval / 1000 / 60) + '分钟前'
      } else if (_interval < 24 * 60 * 60 * 1000) {
        return Number.parseInt(_interval / 1000 / 60 / 60) + '小时前'
      } else if (_interval < 48 * 60 * 60 * 1000) {
        return '昨天'
      } else if (_interval < 72 * 60 * 60 * 1000) {
        return '前天'
      } else if (_interval < 96 * 60 * 60 * 1000) {
        return '3天前'
      } else if (_interval < 144 * 60 * 60 * 1000) {
        return '4天前'
      } else if (_interval < 168 * 60 * 60 * 1000) {
        return '5天前'
      } else if (_interval < 192 * 60 * 60 * 1000) {
        return '6天前'
      } else if (_interval < 216 * 60 * 60 * 1000) {
        return '7天前'
      } else {
        let _month = new Date(time).getMonth() + 1
        let _day = new Date(time).getUTCDate()
        return _month + '月' + _day + '日'
      }
    }
  },
  computed: {
    numbersText: function() {
      let _time = ''
      if (!this.needHeader) {
        // console.log(new Date(this.time.replace(/-/g, '/')))
        _time = this.timeFilter(
          new Date(this.time.replace(/-/g, '/')).getTime()
        )
      }
      return (
        _time + ' 回答 ' + this.answerNum + ' • ' + '浏览 ' + this.browseNum
      )
    },
    tagImgUrl: function() {
      const _this = this
      //0、普通， 1、精选， 2、采纳
      return _this.tagType == 1 ? _this.selection : _this.adopt
    },
    showTag: function() {
      const _this = this
      return _this.tagType == 1 || _this.tagType == 2
    },
    tagListShow: function() {
      if (this.tagList.length > 2) {
        return this.tagList.slice(0, 2)
      } else {
        return this.tagList
      }
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
      let time = val.substr(5, 5)
      return time
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
