<template>
  <div class="joo-header">{{title}}
    <div class="joo-back" @click="back">
      <i class="iconfont icon-fanhuizuoduiqi" style="font-size: 20px;"></i>
    </div>
    <div class="joo-more">
      <i class="iconfont icon-sousuoding" style="font-size: 20px;"></i>
      <i class="iconfont icon-gengduo" style="font-size: 20px;"></i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '税务问答'
    }
  },
  methods: {
    back: function() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
.joo-header {
  height: 48px;
  text-align: center;
  line-height: 48px;
  font-size: 18px;
  background-color: #1985c4;
  color: white;
  .joo-back {
    position: absolute;
    top: 0;
    left: 15px;
    color: white;
    i {
      line-height: 48px;
    }
  }
  .joo-more {
    position: absolute;
    top: 0;
    right: 10px;
    color: white;
    i {
      line-height: 48px;
      padding-right: 5px;
    }
  }
}
</style>
