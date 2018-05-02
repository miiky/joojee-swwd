<template>
  <div class="joo-card-item">
    <img class="item-avatar" :src="avatar" />
    <div class="item-content">
      <div class="item-top">
        <div class="item-name">{{name}}</div>
        <div class="item-fabulous" @click="upReply"><i class="iconfont icon-dianzan" :class="isReply?'isreply':''"></i></div>
      </div>
      <div class="item-desc">{{content}}</div>
      <div class="item-time">{{time}}
        <!-- <div class="item-answer">回复</div> -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isReply: false
    }
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    avatar: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    hasUpPost: {
      type: Boolean,
      required: true
    }
  },
  mounted() {
    this.isReply = this.hasUpPost
  },
  methods: {
    upReply() {
      this.isReply = !this.isReply
      this.$emit('upReply', { isReply: this.isReply, id: this.id })
    }
  }
}
</script>
<style lang="less" scoped>
.joo-card-item {
  position: relative;
  padding: 10px;
  .item-avatar {
    float: left;
    height: 29px;
    width: 29px;
    border-radius: 50%;
  }
  .item-content {
    position: relative;
    margin-left: 40px;
    border-bottom: 1px solid #ebebeb;
    .item-top {
      height: 30px;
      line-height: 30px;
      .item-name {
        float: left;
        color: #666666;
        font-size: 13px;
      }
      .item-fabulous {
        color: #c0c3c8;
        float: right;
        .isreply {
          color: #1985c4;
        }
      }
    }
    .item-desc {
      position: relative;
      color: #333333;
      font-size: 15px;
    }
    .item-time {
      padding: 10px 0 15px 0;
      color: #99a1a9;
      font-size: 12px;
      .item-answer {
        margin-left: 10px;
        display: inline;
        color: #666666;
      }
    }
  }
}
</style>


