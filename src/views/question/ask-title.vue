<template>
  <div class="joo-ask">
    <div class="ask-title-div">
      <button ref="focusBtn" v-show="false"></button>
      <textarea v-focus ref="askTitle" v-model="title" class="ask-title" autocomplete="off" contenteditable="true" autocapitalize="off"
        autocorrect="off" spellcheck="false" placeholder="一句话概括你的问题(必填)" :rows="titleRow" name="description" maxlength="50"
        autofocus></textarea>
      <div class="ask-title-count">{{title.length}}/50</div>
    </div>
    <div class="ask-desc-div">
      <div class="ask-select" v-show="showSelect">
        <div class="select-scroll" ref="selectDiv">
          <ul>
            <li v-show="searchList.length == 0">
              <div class="no-more">没有匹配的问题</div>
            </li>
            <li v-for="item of searchList" :key="item.id">
              <router-link :to="{ name: 'question', params: { id: `${item.id}` }}">
                <div class="select-item">
                  <div class="item-title" v-html="item.title"></div>
                  <div class="item-desc">{{'回答 '+`${item.replyCount}`+' • 浏览 '+`${item.viewCount}`+' • '+`${item.createTime}`}}</div>
                </div>
              </router-link>
            </li>
          </ul>
        </div>
        <div class="close-scroll" @click="showSelect = false"><i class="iconfont icon-shouqi"></i> 收起</div>
      </div>
      <textarea ref="askDesc" class="ask-desc" utocomplete="off" v-model="content" contenteditable="true" autocapitalize="on" autocorrect="off"
        spellcheck="false" rows="5" placeholder="添加问题描述(选填)" name="description"></textarea>
      <div class="ask-imgs">
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
      <popup v-model="showError" position="top" :show-mask="false">
        <div class="error-msg" style="background-color: white; color: red;font-size:14px;text-align: center; padding: 12px;border-bottom:1px solid #f8f8f8;">
          <i class="iconfont icon-xinxiyouwu1"></i> 请先描述您的问题！
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
import { TransferDom, Popup, XCircle, Scroller } from 'vux'
import BScroll from 'better-scroll'

import autosize from 'autosize'

import { mapGetters, mapMutations } from 'vuex'
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
    XCircle,
    Scroller
  },
  data() {
    return {
      title: '',
      content: '',
      titleRow: 1,
      imgList: [],
      result: null,
      index: 0,
      showError: false,

      showSelect: false,
      searchList: []
    }
  },
  watch: {
    title: function(val) {
      const _this = this
      if (val.length >= 2) {
        _this.showSelect = true
        _this.search()
      } else {
        _this.showSelect = false
      }
    },
    showError: function(val) {
      if (val) {
        setTimeout(() => {
          this.showError = false
        }, 1000)
      }
    }
  },
  computed: {
    ...mapGetters(['problem'])
  },
  mounted() {
    const _this = this
    autosize(_this.$refs.askTitle)
    autosize(_this.$refs.askDesc)
    _this.handelMenuAction()
    _this.title = _this.problem.title
    _this.content = _this.problem.content
    _this.imgList = _this.problem.imgUrl
    _this._initSelectDiv()
  },
  methods: {
    ...mapMutations(['setProblemTitle', 'setProblemTags']),
    _initSelectDiv() {
      this.$nextTick(() => {
        this.selectScroll = new BScroll(this.$refs.selectDiv, {
          click: true
        })
      })
    },
    search() {
      const _this = this
      _this.$net.search(_this.title).then(res => {
        console.log(res)
        _this.searchList = res.data.entities[0].datas
        res.data.entities[0].datas.filter(item => {
          item.createTime = item.createTime.substr(5, 5)
        })
      })
    },
    handelMenuAction() {
      const _this = this
      _this.$bus.$on('menu4', data => {
        if (_this.$utils.isEmpty(_this.title)) {
          _this.showError = true
          return
        }
        _this.setProblemTitle({
          title: _this.title,
          content: _this.content,
          imgUrl: _this.imgList
        })
        _this.$router.push('/askTwo')
      })
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
.joo-ask {
  background-color: white;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  .ask-title-div {
    position: relative;
    padding: 15px 0;
    margin: 0 15px;
    font-size: 16px;
    border-bottom: 1px solid #f8f8f8;
    .ask-title {
      line-height: 24px;
      padding-right: 50px;
      overflow: auto;
      display: block;
      border: 0;
      resize: none;
      width: 100%;
      color: inherit;
      outline: 0;
    }
    .ask-title-count {
      color: #99a1a9;
      font-size: 12px;
      position: absolute;
      bottom: 15px;
      right: 15px;
    }
  }
  .ask-title-edit {
    line-height: 24px;
    overflow: auto;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    padding: 0 50px 0 0;
    margin: 0 15px;
    font-size: 16px;
  }
  .ask-desc-div {
    position: relative;
    padding: 15px;
    font-size: 14px;
    border-bottom: 1px solid #f8f8f8;
    .ask-select {
      position: absolute;
      top: 0;
      left: 15px;
      right: 15px;
      background-color: white;
      border: 1px solid #f8f8f8;
      box-shadow: 0 4px 16px fade(#1c2438, 20%);
      z-index: 100;
      overflow: hidden;
      // white-space: nowrap;
      .select-scroll {
        position: relative;
        height: 250px;
        .no-more {
          text-align: center;
          margin-top: 10px;
        }
        .select-item {
          position: relative;
          padding: 15px;
          border-bottom: 1px solid #f8f8f8;
          .item-title {
            color: #333333;
            font-size: 17px;
          }
          .item-desc {
            color: #a5a5a5;
            font-size: 14px;
          }
        }
      }
      .close-scroll {
        background-color: white;
        padding: 5px;
        position: relative;
        line-height: 20px;
        text-align: center;
        color: #80848f;
        font-size: 14px;
      }
    }
    .ask-desc {
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
    .ask-imgs {
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
  .error-msg {
    background-color: white;
    color: #333333;
    text-align: center;
    padding: 15px;
  }
}
</style>


