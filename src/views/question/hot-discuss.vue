<template>
    <div class="hot-discuss">
        <div class="discuss-header-img"></div>
        <div class="discuss-header">
            <div class="title">天猫既然都走公账，税反正避不掉，为什么很多商家还是不愿开票？</div>
            <div class="footer">
                <span class="right-text">2094人参与讨论</span>
            </div>
        </div>
        <sticky :check-sticky-support="false" :offset="0">
            <tab :line-width='2' custom-bar-width="20px" bar-active-color="#1985c4" default-color="#495060" active-color="#1985c4" v-model="tabIndex">
                <tab-item style="font-size:16px;" :selected="chooseTab === item" v-for="(item, index) in tabList" @click="chooseTab = item"
                    :key="index">{{item}}</tab-item>
            </tab>
        </sticky>
        <swiper ref="swiper" v-model="tabIndex" height="aspect-ratio" :show-dots="false" :threshold="150" :min-moving-distance="150"
            @on-index-change="swiperChange">
            <swiper-item>
                <div class="tab-content-hot" ref="hotBody">
                    <div class="no-content">
                        <img src="@/assets/imgs/no-content.png" />
                        <div class="content-text">暂无内容</div>
                    </div>
                </div>
            </swiper-item>
            <swiper-item>
                <div class="tab-content-new" ref="newBody">
                    <div class="no-content">
                        <img src="@/assets/imgs/no-content.png" />
                        <div class="content-text">暂无内容</div>
                    </div>
                </div>
            </swiper-item>
        </swiper>
        <div class="join-discuss">
            <i class="iconfont icon-tiwen"></i> 参与讨论
        </div>
    </div>
</template>
<script>
import { Tab, TabItem, Sticky, Swiper, SwiperItem } from 'vux'
import { mapGetters, mapMutations } from 'vuex'
import * as Net from '@/network/index'

export default {
  components: {
    Tab,
    TabItem,
    Sticky,
    Swiper,
    SwiperItem
  },
  data() {
    return {
      discussId: 0,
      chooseTab: '最热',
      tabIndex: 0,
      tabList: ['最热', '最新']
    }
  },
  mounted() {
    const _this = this
    _this.reSizeSwiperHeight(this.tabIndex)
    _this.discussId = this.$route.params.id
    _this._listNewestReplyOfHotDiscuss()
    _this._listHotReplyOfHotDiscuss()
  },
  methods: {
    _listNewestReplyOfHotDiscuss() {
      const _this = this
      Net.listNewestReplyOfHotDiscuss(_this.discussId).then(res => {
        console.log(res.data)
      })
    },
    _listHotReplyOfHotDiscuss() {
      const _this = this
      Net.listHotReplyOfHotDiscuss(_this.discussId).then(res => {
        console.log(res.data)
      })
    },
    swiperChange(currentIndex) {
      // 改变tab
      const _this = this
      _this.reSizeSwiperHeight(currentIndex)
    },
    reSizeSwiperHeight(currentIndex) {
      // 重新计算页面高度
      const _this = this
      let heights = [
        this.$refs.hotBody.offsetHeight,
        this.$refs.newBody.offsetHeight
      ]
      _this.$nextTick(() => {
        _this.$refs.swiper.xheight = heights[currentIndex] + 'px'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.hot-discuss {
  .discuss-header-img {
    position: absolute;
    width: 100%;
    height: 150px;
    background-image: url('../../assets/imgs/hot-discuss-bg.jpg');
    background-size: cover;
    background-position: top right;
  }
  .discuss-header-img:before {
    position: absolute;
    top: 0;
    left: 0;
    content: '';
    background-color: black;
    opacity: 0.6;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
  .discuss-header {
    padding: 15px;
    position: relative;
    width: 100%;
    height: 150px;
    z-index: 2;
    .title {
      position: relative;
      z-index: 2;
      font-size: 19px;
      color: #ffffff;
    }
    .footer {
      position: absolute;
      left: 15px;
      right: 15px;
      bottom: 15px;
      height: 30px;
      line-height: 30px;
      .right-text {
        color: white;
        font-size: 13px;
        float: left;
      }
    }
  }
  .no-content {
    text-align: center;
    padding: 5rem 0;
    img {
      width: 127px;
    }
    .content-text {
      margin-top: 10px;
      color: #a5a5a5;
      font-size: 15px;
    }
  }
  .join-discuss {
    position: absolute;
    bottom: 10px;
    margin: auto;
    left: 0;
    right: 0;
    background-color: #1885c4;
    font-size: 15px;
    height: 50px;
    line-height: 50px;
    width: 115px;
    text-align: center;
    color: white;
    border-radius: 25px;
    box-shadow: 0 1px 10px #80848f;
  }
}
</style>

