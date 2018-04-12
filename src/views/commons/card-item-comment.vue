<template>
    <div class="joo-card-item">
        <img class="item-avatar" src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3802506693,1778634825&fm=27&gp=0.jpg"
        />
        <div class="item-content">
            <div class="item-top">
                <div class="item-name">大梁</div>
                <div class="item-fabulous"><i class="iconfont icon-dianzan"></i></div>
            </div>
            <div class="item-desc">公司的资金进出有很多情况，不一定是收入即便是收入，也不一定要交税开票。</div>
            <div class="item-time">11-22 17:00
                <div class="item-answer">回复</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {}
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


