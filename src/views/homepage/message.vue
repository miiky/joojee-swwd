<template>
  <div class="joo-message">
    <popup v-model="showMessageType" position="top">
      <div class="msg-pop">
        <button class="type-tag" :class="currentTagId == item.id?'current-tag':''" v-for="item of tagList" :key="item.id" @click="setTag(item)">{{item.name}}</button>
      </div>
    </popup>
    <div v-show="noMessage" class="no-more">
      <img class="no-more-pic" src="@/assets/imgs/no-message.png">
      <p>暂无通知</p>
    </div>
    <div v-show="!noMessage" class="joo-notic-item" v-for="(item,index) of showList" :key="index">
      <router-link :to="{ name: 'homepageother', params: { id: item.userId }}">
        <div class="item-avatar">
          <img class="avatar-img" :src="item.profilePicture" />
        </div>
      </router-link>
      <router-link :to="{ name: 'question', params: { id: item.problemId }}">
        <div class="item-content">
          <div class="content-top">
            <span class="item-action"><span class="action-name">{{item.realname}}</span>{{item.operateDesc}}</span>
          </div>
          <div class="content-bottom">{{item.problemTitle}}</div>
        </div>
      </router-link>
      <span class="item-time">{{item.operateTime|timeFilter}}</span>
    </div>
  </div>
</template>
<script>
import { TransferDom, Popup } from 'vux'

export default {
  directives: {
    TransferDom
  },
  components: {
    Popup
  },
  data() {
    return {
      showMessageType: false,
      tagList: [
        { id: 0, name: '全部' },
        { id: 1, name: '赞' },
        { id: 2, name: '回答' },
        { id: 3, name: '评论' },
        { id: 4, name: '审核' },
        { id: 5, name: '其他' }
      ],
      currentTagId: 0,
      list: []
    }
  },
  computed: {
    noMessage() {
      return this.showList.length == 0
    },
    showList() {
      const _this = this
      return _this.list.filter(item => {
        return _this.currentTagId == 0 || _this.currentTagId == item.type
      })
    }
  },
  mounted() {
    this._handelMenuAction()
    this._listMassage()
  },
  methods: {
    _handelMenuAction() {
      const _this = this
      _this.$bus.$on('menu10', data => {
        _this.showMessageType = !_this.showMessageType
      })
    },
    _listMassage() {
      const _this = this
      _this.$net.listNoticeMessage().then(res => {
        console.log(res.data.entities)
        _this.list = res.data.entities
      })
    },
    setTag(item) {
      const _this = this
      _this.currentTagId = item.id
      _this.showMessageType = false
      document.title = '通知（' + item.name + '）'
      // _this.$store.commit('setTopLoading', true)
      // setTimeout(() => {
      //   _this.$store.commit('setTopLoading', false)
      // }, 1000)
    }
  },
  filters: {
    timeFilter: time => {
      //当前时间
      let _now = new Date().getTime()
      //时间差
      let _interval = _now - time
      // （1）小于等于5分钟  显示刚刚
      // （2）大于5分钟，小于60分钟 显示X分钟前
      // （3）大于等于60分钟，小于24小时 显示X小时前
      // （4）大于等于24小时，小于48小时 显示昨天
      // （5）大于等于48小时，小于72小时 显示前天
      // （6）大于等于72小时，小于96小时 显示3天前
      // （7）大于等于96小时，小于120小时 显示4天前
      // （8）大于等于144小时，小于168小时 显示5天前
      // （9）大于等于168小时，小于192小时 显示6天前
      // （10）大于等于192小时，小于216小时 显示7天前
      // （11）大于等于216小时 显示年-月-日
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
  }
}
</script>
<style lang="less" scoped>
.joo-message {
  background-color: #f5f5f5;
  .no-more {
    text-align: center;
    margin-top: 30%;
    .no-more-pic {
      width: 126px;
    }
    p {
      margin-top: 10px;
      color: #a5a5a5 100%;
      font-size: 15px;
    }
  }
  .msg-pop {
    background-color: white;
    padding: 20px;
    .type-tag {
      border: 0px;
      background-color: #f5f5f5;
      display: inline;
      color: #808080;
      font-size: 14px;
      padding: 4px 20px;
      margin: 8px 8px;
      border-radius: 5px;
    }
    .current-tag {
      color: #1885c4;
    }
  }
  .joo-notic-item {
    background-color: white;
    padding: 10px;
    position: relative;
    height: 70px;
    border-bottom: 1px solid #efefef;
    vertical-align: middle;
    .item-avatar {
      position: absolute;
      left: 10px;
      vertical-align: middle;
      display: inline-block;
      .avatar-img {
        width: 44px;
        height: 44px;
        border-radius: 50%;
      }
    }
    .item-content {
      position: absolute;
      vertical-align: middle;
      left: 60px;
      display: inline-block;
      .content-top {
        position: relative;
        .item-action {
          color: #666666;
          font-size: 14px;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          .action-name {
            color: #1885c4;
          }
        }
      }
      .content-bottom {
        color: #333333;
        font-size: 15px;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
    }
    .item-time {
      position: absolute;
      right: 15px;
      top: 15px;
      color: #a5a5a5;
      font-size: 12px;
    }
  }
}
</style>


