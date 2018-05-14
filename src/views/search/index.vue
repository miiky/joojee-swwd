<template>
  <div class="joo-search">
    <div class="search-panel">
      <input v-model="title" type="search" placeholder="请搜索你想要的内容" />
      <span @click="cancel">取消</span>
    </div>
    <div v-show="!showSelect" class="search-tag-choose">
      <div class="hot-search-title">热门搜索</div>
      <div class="hot-search-tags">
        <button class="tag" v-for="(item,index) of hotList" :key="index" @click="title = item">{{item}}</button>
      </div>
      <div class="hot-search-title">历史记录<i class="iconfont icon-sqtzfwxz" @click="remove"></i></div>
      <div class="hot-search-tags">
        <div class="tag-item" v-for="(item,index) of historyList" :key="index">
          <i class="iconfont icon-shijianshaixuan icon-prefix"></i>
          <span @click="title = item">{{item}}</span>
          <i class="iconfont icon-guanbi icon-close" @click="delHistory(index)"></i>
        </div>
      </div>
    </div>
    <div v-show="showSelect" class="select-scroll" ref="selectDiv">
      <ul>
        <li v-show="searchList.length == 0">
          <div class="no-more">没有匹配的问题</div>
        </li>
        <li v-for="item of searchList" :key="item.id">
          <div class="select-item" @click="toDetail(item)">
            <div class="item-title" v-html="item.title"></div>
            <div class="item-desc">{{'回答 '+item.replyCount+' • 浏览 '+item.viewCount+' • '+item.createTime}}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: '',
      showSelect: false,
      hotList: ['企业', '发票', '申报'],
      historyList: Array,
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
    }
  },
  mounted() {
    this.historyList = Array.from(this.$utils.loadFromLocal('historySelect'))
  },
  methods: {
    search() {
      const _this = this
      _this.$net.search(_this.title).then(res => {
        _this.searchList = res.data.entities[0].datas
        res.data.entities[0].datas.filter(item => {
          item.createTime = item.createTime.substr(5, 5)
        })
      })
    },
    cancel() {
      if (this.title == '') {
        this.$router.go(-1)
      } else {
        this.title = ''
      }
    },
    remove() {
      const _this = this
      _this.historyList = []
      _this.$utils.removeFromLocal('historySelect')
    },
    toDetail(item) {
      const _this = this
      if (!_this.historyList.includes(this.title)) {
        _this.historyList.push(this.title)
        _this.$utils.saveToLocal('historySelect', _this.historyList)
      }
      _this.$router.push({ name: 'question', params: { id: item.id } })
    },
    delHistory(index) {
      const _this = this
      _this.historyList.splice(index, 1)
      _this.$utils.saveToLocal('historySelect', _this.historyList)
    }
  }
}
</script>
<style lang="less" scoped>
.joo-search {
  position: absolute;
  top: 0;
  height: 100%;
  left: 0;
  right: 0;
  margin: 0;
  padding: 0;
  background-color: white;
  .search-panel {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: white;
    border-bottom: 1px solid #e9eaec;
    z-index: 100;
    input {
      background-color: #f5f5f5;
      position: absolute;
      top: 10px;
      left: 10px;
      width: 80%;
      border-radius: 5px;
      -webkit-appearance: none;
      border: none;
      padding: 5px 10px;
      height: 30px;
    }
    span {
      position: absolute;
      right: 10px;
      width: 50px;
      text-align: center;
      line-height: 50px;
      font-size: 16px;
      color: #1885c4;
    }
  }
  .search-tag-choose {
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 49;
    padding: 20px;
    .hot-search-title {
      position: relative;
      color: #333333;
      font-size: 14px;
      i {
        float: right;
      }
    }
    .hot-search-tags {
      padding: 10px 0;
      .tag-item {
        position: relative;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #e9eaec;
        .icon-prefix {
          position: absolute;
          left: 0;
          font-size: 14px;
          color: #bbbec4;
        }
        span {
          left: 20px;
          width: 90%;
          position: relative;
          font-size: 14px;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .icon-close {
          position: absolute;
          right: 0;
          top: 0;
          font-size: 12px;
          color: #bbbec4;
        }
      }
    }
    .tag {
      background-color: #f1f1f1;
      color: #333333;
      padding: 5px 10px;
      border: none;
      border-radius: 5px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
  .select-scroll {
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    .no-more {
      text-align: center;
      margin-top: 10px;
    }
    .select-item {
      position: relative;
      padding: 15px;
      border-bottom: 1px solid #f8f8f8;
      background-color: white;
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
}
</style>


