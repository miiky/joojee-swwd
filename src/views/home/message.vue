<template>
    <div class="joo-message">
        <div v-show="noMessage" class="no-more">
            <img class="no-more-pic" src="@/assets/imgs/no-message.png">
            <p>暂无消息</p>
        </div>
        <popup v-model="showMessageType" position="top">
            <div class="msg-pop">
                <button class="type-tag" :class="currentTagId == item.id?'current-tag':''" v-for="item of tagList" :key="item.id" @click="currentTagId = item.id">{{item.name}}</button>
            </div>
        </popup>
    </div>
</template>
<script>
import bus from '@/utils/bus'
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
      showList: []
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
      bus.$on('menu10', data => {
        _this.showMessageType = !_this.showMessageType
      })
    }
  }
}
</script>
<style lang="less" scoped>
.joo-message {
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
}
</style>


