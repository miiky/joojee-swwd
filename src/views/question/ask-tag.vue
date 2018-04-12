<template>
  <div class="joo-ask-tag">
    <div class="select-tags">
      <p v-show="chooseList.length == 0">点击以下标签进行添加</p>
      <button class="tag" v-for="(item,index) of chooseList" :key="index">{{item}}
        <div class="del-tag" @click="delTag(index)"><i class="iconfont icon-shanchuxian"></i></div>
      </button>
    </div>
    <div class="choose-tags">
      <div class="tags-title">全部标签</div>
      <div class="tags-list">
        <button class="tag" v-for="(item,index) of tagList" :key="index" @click="choose(item)">{{item}}
        </button>
      </div>
    </div>
    <div v-transfer-dom>
      <popup v-model="showPopup" position="top" :show-mask="false">
        <div class="popup-msg" :class="popupType?'popup-msg-success':'popup-msg-error'">
          <i class="iconfont" :class="popupType?'icon-queding1':'icon-xinxiyouwu1'"></i>{{popupMsg}}
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
import { TransferDom, Popup } from 'vux'
import bus from '@/utils/bus'

export default {
  directives: {
    TransferDom
  },
  components: {
    Popup
  },
  watch: {
    showPopup: function(val) {
      if (val) {
        setTimeout(() => {
          this.showPopup = false
        }, 1500)
      }
    }
  },
  data() {
    return {
      showPopup: false,
      popupType: false,
      popupMsg: ' 请选择标签！',
      tagList: [
        '所得税',
        '发票',
        '金三数据',
        '风险风控',
        '申报',
        '缴款',
        '发票代开'
      ],
      chooseList: []
    }
  },
  mounted() {
    this.handelMenuAction()
  },
  methods: {
    handelMenuAction() {
      const _this = this
      bus.$on('menu5', data => {
        if (_this.chooseList.length === 0) {
          _this.showPopup = true
          return
        }
        _this.popupType = true
        _this.popupMsg = ' 发布成功！'
        _this.showPopup = true
        setTimeout(() => {
          _this.$router.push('/')
        }, 1500)
      })
    },
    choose(item) {
      if (!this.chooseList.includes(item) && this.chooseList.length < 4) {
        this.chooseList.push(item)
        this.setTitle()
      }
    },
    delTag(index) {
      this.chooseList.splice(index, 1)
      this.setTitle()
    },
    setTitle() {
      document.title = '添加标签（' + this.chooseList.length + '/4）'
    }
  }
}
</script>
<style lang="less" scoped>
@import '~vux/src/styles/close.less';
.joo-ask-tag {
  background-color: white;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  .select-tags {
    // height: 60px;
    line-height: 40px;
    padding: 10px 20px;
    color: #a5a5a5;
    font-size: 15px;
    .tag {
      position: relative;
      color: #1985c4;
      border: 1px solid #1985c4;
      background-color: white;
      padding: 3px 8px;
      font-size: 13px;
      border-radius: 5px;
      line-height: 20px;
      margin-right: 18px;
      .del-tag {
        position: absolute;
        background-color: white;
        color: #1985c4;
        font-size: 5px;
        border-radius: 50%;
        height: 16px;
        width: 18px;
        text-align: center;
        line-height: 18px;
        top: -9px;
        right: -9px;
        i {
          font-size: 18px;
        }
      }
    }
  }
  .choose-tags {
    position: relative;
    border-top: 10px solid #f0f0f2;
    height: auto;
    padding: 20px;
    .tags-title {
      color: #333333 100%;
      font-size: 15px;
    }
    .tags-list {
      margin-top: 10px;
      .tag {
        position: relative;
        color: #1985c4;
        border: 1px solid #1985c4;
        background-color: white;
        padding: 3px 8px;
        font-size: 13px;
        border-radius: 5px;
        line-height: 20px;
        margin-right: 18px;
        margin-top: 10px;
      }
    }
  }
}
.popup-msg {
  background-color: white;
  font-size: 14px;
  text-align: center;
  padding: 12px;
  border-bottom: 1px solid #f8f8f8;
}
.popup-msg-error {
  color: red;
}
.popup-msg-success {
  color: green;
}
</style>


