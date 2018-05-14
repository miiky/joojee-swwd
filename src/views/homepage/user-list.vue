<template>
  <div class="user-list">
    <div class="user-item" v-for="item of list" :key="item.id">
      <router-link :to="{ name: 'homepageother', params: { id: item.id }}">
        <div class="item-avatar">
          <img :src="item.profilePicture" />
        </div>
      </router-link>
      <div class="item-content">
        <p class="item-name">{{item.realname}}<i class="iconfont " :class="item.gendar==1?'icon-nan1 gender-male':'icon-nv1 gender-female'"></i></p>
        <p class="item-desc">{{item.selfIntroduction || '暂无'}}</p>
      </div>
      <img class="item-follow" @click="follow(item)" :src="!item.hasAttent?followPic:unfollowPic" />
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      id: 0,
      type: 0,
      followPic: require('@/assets/imgs/follow.png'),
      unfollowPic: require('@/assets/imgs/unfollow.png'),
      list: []
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  mounted() {
    const _this = this
    _this.id = _this.$route.params.id
    _this.type = _this.$route.query.type
    // console.log('id', _this.id)
    // console.log('type', _this.type)
    _this._initData()
  },
  methods: {
    _initData() {
      const _this = this
      if (_this.type == 0) {
        if (_this.userId == _this.id) {
          _this._listMyFans()
        } else {
          _this._listSomeoneFans()
        }
      } else {
        if (_this.userId == _this.id) {
          _this._listMyAttent()
        } else {
          _this._listSomeoneAttent()
        }
      }
    },
    _listMyAttent() {
      const _this = this
      _this.$net.listMyAttent().then(res => {
        console.log(res.data.entities)
        this.list = res.data.entities
      })
    },
    _listMyFans() {
      const _this = this
      _this.$net.listMyFans().then(res => {
        console.log(res.data.entities)
        this.list = res.data.entities
      })
    },
    _listSomeoneAttent() {
      const _this = this
      _this.$net.listSomeoneAttent(this.id).then(res => {
        console.log(res.data.entities)
        this.list = res.data.entities
      })
    },
    _listSomeoneFans() {
      const _this = this
      _this.$net.listSomeoneFans(this.id).then(res => {
        console.log(res.data.entities)
        this.list = res.data.entities
      })
    },
    async follow(item) {
      const _this = this
      if (item.hasAttent) {
        await _this.$net.cancelAttentUser(item.id)
      } else {
        await _this.$net.attentUser(item.id)
      }
      _this._initData()
    }
  }
}
</script>
<style lang="less" scoped>
.user-list {
  background-color: #f5f5f5;
  position: relative;
  .user-item {
    position: relative;
    padding: 10px;
    background-color: white;
    .item-avatar {
      float: left;
      width: 50px;
      height: 50px;
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
    .item-content {
      width: 60%;
      display: inline-block;
      height: 50px;
      vertical-align: middle;
      padding-left: 10px;
      .item-name {
        line-height: 25px;
        color: #373737;
        font-size: 18px;
        .gender-male {
          margin-left: 10px;
          color: #30aeff;
        }
        .gender-female {
          margin-left: 10px;
          color: #ff3f56;
        }
      }
      .item-desc {
        color: #666666;
        font-size: 15px;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
    }
    .item-follow {
      position: absolute;
      right: 15px;
      top: 20px;
      height: 30px;
    }
  }
  .user-item:after {
    position: absolute;
    bottom: 0;
    left: 10px;
    right: 10px;
    content: '';
    border-bottom: 1px solid #ebebeb;
    color: #ebebeb;
  }
}
</style>


