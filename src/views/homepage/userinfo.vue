<template>
  <div class="joo-userinfo">
    <div class="info-cell">
      <div class="avatar-span">头像</div>
      <img :src="avatar" />
    </div>
    <div class="info-cell">
      <div class="cell-span">昵称</div>
      <div class="cell-value">{{name}}</div>
    </div>
    <div class="info-cell">
      <div class="cell-span">性别</div>
      <div class="cell-value">{{gender}}</div>
    </div>
    <div class="info-cell">
      <div class="cell-span">介绍</div>
      <div class="cell-value" @click="showEditDesc = true">{{desc}}</div>
    </div>
    <div class="tips"><i class="iconfont icon-jingshi"></i>可点击个人介绍进行修改，最多20个字。</div>
    <miiky-textarea v-show="showEditDesc" :content="desc" :maxLength="20" @submit="submit"></miiky-textarea>

  </div>
</template>
<script>
import bus from '@/utils/bus'
import MiikyTextarea from '@/views/commons/miiky-textarea.vue'
import { mapActions } from 'vuex'

export default {
  components: {
    MiikyTextarea
  },
  data() {
    return {
      showEditDesc: false,
      avatar:
        'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3802506693,1778634825&fm=27&gp=0.jpg',
      name: '无',
      gender: '女',
      desc: '',
      descEditValue: '',
      showNumbers: false
    }
  },
  mounted() {
    this._handelMenuAction()
    let user = this.$route.query
    this.name = user.name
    this.gender = user.gendar == 1 ? '男' : '女'
    this.avatar = user.profilePicture
    this.desc = user.selfIntroduction
  },
  methods: {
    ...mapActions(['showPopupAction']),
    _handelMenuAction() {
      const _this = this
      _this.$bus.$on('menu12', data => {
        if (this.desc == '') {
          this.desc == '这家伙很懒，什么都没写！'
        }
        _this.$net.updateSelfIntroduction(this.desc)
        _this.showPopupAction({
          type: 'success',
          msg: '修改个人简介成功！'
        })
      })
    },
    blur() {
      this.desc = this.editDesc
      this.showNumbers = false
    },
    focus() {
      this.showNumbers = true
    },
    submit(item) {
      if (item.content == '') {
        this.showPopupAction({
          type: 'wraning',
          msg: '个人简介不能为空！'
        })
        return
      }
      this.desc = item.content
      this.showEditDesc = false
      // console.log(item.content)
    }
  }
}
</script>
<style lang="less" scoped>
.joo-userinfo {
  background-color: #f5f5f5;
  .info-cell {
    position: relative;
    background-color: white;
    padding: 10px 20px;
    border-bottom: 1px solid #f5f5f5;
    font-size: 16px;
    color: #8e8e93;
    .avatar-span {
      color: #333333;
      display: inline;
      line-height: 50px;
    }
    img {
      float: right;
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    .cell-span {
      color: #333333;
      padding-right: 10px;
      float: left;
      line-height: 30px;
    }
    .cell-value {
      text-align: right;
      line-height: 30px;
    }
    .value-edit {
      padding-left: 10px;
      max-inline-size: 20;
    }
    .cell-numbers {
      text-align: right;
      font-size: 12px;
    }
  }
  .tips {
    padding: 10px;
    i {
      margin-right: 10px;
    }
  }
}
.joo-taxtarea {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9eaec;
  padding: 5px 60px 5px 5px;
  background-color: white;
  font-size: 14px;
  textarea {
    border: 1px solid #e9eaec;
    padding: 3px 3px 15px 3px;
    border-radius: 5px;
    overflow: hidden;
    line-height: 1.5;
    display: block;
    resize: none;
    width: 100%;
    color: inherit;
    outline: 0;
  }
  .submit {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 16px;
  }
  .count {
    position: absolute;
    color: #99a1a9;
    font-size: 12px;
    bottom: 5px;
    right: 65px;
  }
}
</style>


