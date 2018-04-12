<template>
  <div id="app">
    <div v-transfer-dom>
      <loading v-show="loading"></loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { LoadMore, Loading, TransferDomDirective as TransferDom } from 'vux'
import { mapGetters } from 'vuex'

export default {
  directives: {
    TransferDom
  },
  name: 'app',
  computed: {
    ...mapGetters(['loading'])
  },
  components: {
    LoadMore,
    Loading
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

body {
  background-color: #f5f5f5;
}
</style>
