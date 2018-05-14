<template>
  <div id="app">
    <load-more v-show="topLoading" :show-loading="true" tip="正在加载"></load-more>
    <div v-transfer-dom>
      <loading v-show="loading" text="请稍等"></loading>
    </div>
    <!-- <keep-alive> -->
    <transition :name="transitionName">
      <router-view></router-view>
    </transition>
    <!-- </keep-alive> -->
    <miiky-popup :show="showPopup" :info="popupMsg" :type="popupType"></miiky-popup>
  </div>
</template>

<script>
import { LoadMore, Loading, TransferDomDirective as TransferDom } from 'vux'
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'
import MiikyPopup from '@/views/commons/miiky-popup.vue'

export default {
  directives: {
    TransferDom
  },
  name: 'app',
  data() {
    return {
      transitionName: ''
    }
  },
  watch: {
    //使用watch 监听$router的变化
    $route(to, from) {
      //如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if (to.meta.index > from.meta.index) {
        //设置动画名称
        this.transitionName = 'slide-left'
      } else {
        this.transitionName = 'slide-right'
      }
    }
  },
  computed: {
    ...mapGetters([
      'serverAccessToken',
      'userAccessToken',
      'sessionKey',
      'isClientLogin',
      'loading',
      'topLoading',
      'showPopup',
      'popupType',
      'popupMsg',
      'userId'
    ])
  },
  async created() {
    const _this = this
    //如果没有服务token则获取服务token
    if (_this.$utils.isEmpty(_this.serverAccessToken)) {
      await _this._initToken()
    }
    if (!_this.$utils.isEmpty(_this.userId)) {
      _this.$utils.initSocket(_this.userId)
    }
    _this._handleSockMsg()
  },
  components: { LoadMore, Loading, MiikyPopup },
  methods: {
    ...mapMutations(['setServerAccessToken', 'setUserId']),
    ...mapActions(['showPopupAction']),
    async _initToken() {
      // 获取token
      const _this = this
      await _this.$net.getServerToken().then(res => {
        //将获取的token和code放到store中去管理状态
        _this.setServerAccessToken({
          token: res.data.access_token,
          expires: res.data.expires_in
        })
      })
    },
    _handleSockMsg() {
      const _this = this
      _this.$bus.$on('handleSockMsg', data => {
        console.log('data', data)
        let obj = JSON.parse(data)
        let msg = '【' + obj.realname + '】' + obj.operateDesc
        _this.showPopupAction({
          type: 'info',
          msg: msg,
          time: 3000
        })
      })
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

body {
  background-color: #f5f5f5 !important;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

html {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}
html::-webkit-scrollbar {
  width: 0px;
}

.popup-msg {
  background-color: white;
  font-size: 14px;
  padding: 12px;
  border-bottom: 1px solid #f8f8f8;
  .msg-icon {
    margin-right: 5px;
  }
}
.popup-msg-error {
  color: red;
}
.popup-msg-success {
  color: green;
}

slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 300ms;
  position: absolute;
}
.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}

.item-poptip {
  min-width: 130px;
  margin-right: 15px;
}
</style>
