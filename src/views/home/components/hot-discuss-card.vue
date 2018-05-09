<template>
  <router-link :to="{ name: 'discuss', params: { id: id }}">
    <div class="joo-discuss-card">
      <p class="joo-card-title">{{title}}</p>
      <p class="joo-card-desc">{{count}}人参与讨论</p>
      <img class="joo-card-tag" src="@/assets/imgs/hot.png" />
    </div>
  </router-link>
</template>

<script>
export default {
  props: ['title', 'count', 'id']
}
</script>
<style lang="less" scoped>
.joo-discuss-card {
  margin: 15px;
  position: relative;
  background-color: white;
  box-shadow: 0 4px 16px fade(#1c2438, 20%);
  border-radius: 5px;
  width: 250px;
  padding: 30px 10px 10px 10px;
  .joo-card-title {
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    font-weight: 500;
    color: #1c2438;
  }
  .joo-card-desc {
    font-size: 14px;
    color: #80848f;
  }
  .joo-card-tag {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
  }
}
</style>
