<template>
  <div class="joo-answer">
    <div class="answer-title-div">
      {{answer.title}}
    </div>
    <div class="answer-desc-div">
      <textarea ref="answerTextarea" v-focus class="answer-desc" utocomplete="off" contenteditable="true" autocapitalize="on" autocorrect="off"
        spellcheck="false" rows="8" placeholder="添加回答内容" name="description" maxlength="300" v-model="content"></textarea>
      <div class="answer-imgs">
        <flexbox :gutter="15">
          <flexbox-item :span="3" v-for="(item,index) of imgList" :key="index">
            <div class="img-upload">
              <img v-show="item.showPic" class="img-item" :src="item.picBase64" />
              <div v-show="item.showPic" class="img-del" @click="delImg(index)"><i class="iconfont icon-cha" style="font-size: 10px;"></i></div>
              <div v-show="!item.showPic" style="padding: 10px;">
                <x-circle :percent="item.progress" :stroke-width="5" stroke-color="#04BE02">
                  <span>{{item.progress}}</span>
                </x-circle>
              </div>
            </div>
          </flexbox-item>
          <flexbox-item :span="3" v-show="imgList.length < 3">
            <div class="img-upload" @click="uploadImg">
              <p class="img-upload-icon"><i class="iconfont icon-icon-test"></i></p>
              <div class="img-upload-text">添加图片</div>
            </div>
          </flexbox-item>
        </flexbox>
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
import bus from '@/utils/bus'
import * as utils from '@/utils/index'
import { TransferDom, Popup, XCircle } from 'vux'
import { mapGetters, mapMutations } from 'vuex'
import * as Net from '@/network/index'

export default {
  directives: {
    TransferDom,
    focus: {
      inserted: function(el) {
        // 聚焦元素
        el.focus()
      }
    }
  },
  components: {
    Popup,
    XCircle
  },
  computed: {
    ...mapGetters(['answer'])
  },
  data() {
    return {
      showPopup: false,
      popupType: false,
      popupMsg: ' 请填写回答内容！',
      content: '',
      imgList: [],
      index: 0
    }
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
  mounted() {
    this._handelMenuAction()
    this.$refs.answerTextarea.focus()
  },
  methods: {
    _handelMenuAction() {
      const _this = this
      bus.$on('menu9', data => {
        if (utils.isEmpty(_this.content)) {
          _this.showPopup = true
          return
        }
        _this._submit()
      })
    },
    _submit() {
      const _this = this
      _this.popupType = true
      _this.popupMsg = ' 发布成功！'
      _this.showPopup = true
      let imgUrl = []
      _this.imgList.forEach(item => {
        imgUrl.push(item.picUrl)
      })
      Net.submitReply(_this.answer.id, _this.content, imgUrl).then(res => {
        console.log(res)
      })
      setTimeout(() => {
        _this.$router.go(-1)
      }, 1500)
    },
    uploadImg() {
      const _this = this
      let picName = 'image' + _this.index++
      sqt.openCamera({
        picName: picName,
        success: res => {
          let index = 0
          _this.imgList.forEach(item => {
            if (item.picName == res.picName) {
              item.picBase64 = res.picBase64
              item.picUrl = res.picUrl
              _this.imgList.splice(index, 1, item)
            }
            index++
          })
        },
        progress: res => {
          _this.result = res
          let index = 0,
            names = []
          _this.imgList.forEach(item => {
            names.push(item.picName)
            if (item.picName == res.picName) {
              item.progress = res.progress
              if (item.progress == 100) {
                item.showPic = true
              }
              _this.imgList.splice(index, 1, item)
            }
            index++
          })
          if (!names.includes(res.picName)) {
            res.showPic = false
            _this.imgList.push(res)
          }
        }
      })
    },
    delImg(index) {
      const _this = this
      _this.imgList.splice(index, 1)
    }
  }
}
</script>
<style lang="less" scoped>
.joo-answer {
  background-color: white;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  .answer-title-div {
    position: relative;
    padding: 15px 0;
    margin: 0 15px;
    font-size: 19px;
    color: #333333 100%;
  }

  .answer-desc-div {
    border-top: 10px solid #f5f5f5;
    position: relative;
    padding: 15px;
    font-size: 14px;
    border-bottom: 1px solid #f8f8f8;
    .answer-desc {
      overflow: hidden;
      line-height: 1.5;
      margin-right: 50px;
      display: block;
      border: 0;
      resize: none;
      width: 100%;
      color: inherit;
      outline: 0;
    }
    .answer-imgs {
      .img-upload {
        position: relative;
        width: 90px;
        height: 90px;
        background-color: #f0f0f0;
        border-radius: 5px;
        color: #bfbfbf;
        text-align: center;
        .img-upload-icon {
          padding-top: 20px;
          font-size: 16px;
        }
        .img-upload-text {
          font-size: 12px;
        }
        .img-item {
          border-radius: 5px;
          width: 90px;
          height: 90px;
        }
        .img-del {
          position: absolute;
          background-color: tomato;
          color: white;
          font-size: 5px;
          border-radius: 50%;
          height: 20px;
          width: 20px;
          text-align: center;
          line-height: 20px;
          top: -5px;
          right: -5px;
        }
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


