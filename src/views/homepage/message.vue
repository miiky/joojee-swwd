<template>
  <div class="joo-message">
    <div v-show="noMessage" class="no-more">
      <img class="no-more-pic" src="@/assets/imgs/no-message.png">
      <p>暂无通知</p>
    </div>
    <popup v-model="showMessageType" position="top">
      <div class="msg-pop">
        <button class="type-tag" :class="currentTagId == item.id?'current-tag':''" v-for="item of tagList" :key="item.id" @click="setTag(item)">{{item.name}}</button>
      </div>
    </popup>
    <div class="joo-notic-item" v-for="(item,index) of 20" :key="index">
      <div class="item-avatar">
        <img class="avatar-img" src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3802506693,1778634825&fm=27&gp=0.jpg"
        />
      </div>
      <div class="item-content">
        <div class="content-top">
          <span class="item-action"><span class="action-name">梁江秋</span>赞了我的回答</span>
        </div>
        <div class="content-bottom">报销加油税是否需要缴纳个税？</div>
      </div>
      <span class="item-time">3小时前</span>
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
        { id: 2, name: '评论' },
        { id: 3, name: '回复' },
        { id: 4, name: '其他' }
      ],
      currentTagId: 0,
      showList: [1]
    }
  },
  computed: {
    noMessage() {
      return this.showList.length == 0
    }
  },
  mounted() {
    this._handelMenuAction()
  },
  methods: {
    _handelMenuAction() {
      const _this = this
      _this.$bus.$on('menu10', data => {
        _this.showMessageType = !_this.showMessageType
      })
    },
    setTag(item) {
      const _this = this
      _this.currentTagId = item.id
      _this.showMessageType = false
      document.title = '通知（' + item.name + '）'
      _this.$store.commit('setTopLoading', true)
      setTimeout(() => {
        _this.$store.commit('setTopLoading', false)
      }, 1000)
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
    border-bottom: 1px solid #efefef;
    vertical-align: middle;
    .item-avatar {
      vertical-align: middle;
      display: inline-block;
      .avatar-img {
        width: 44px;
        height: 44px;
        border-radius: 50%;
      }
    }
    .item-content {
      vertical-align: middle;
      margin-left: 10px;
      display: inline-block;
      .content-top {
        position: relative;
        .item-action {
          color: #666666;
          font-size: 14px;
          .action-name {
            color: #1885c4;
          }
        }
      }
      .content-bottom {
        color: #333333;
        font-size: 15px;
      }
    }
    .item-time {
      position: absolute;
      right: 15px;
      color: #a5a5a5;
      font-size: 12px;
    }
  }
}
</style>


