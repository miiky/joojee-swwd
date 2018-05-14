<template>
  <div class="joo-taxtarea">
    <textarea v-focus v-model="text" ref="myTaxtarea" autocomplete="off" contenteditable="true" autocapitalize="on" autocorrect="off"
      spellcheck="false" @input="input" @focus="focus" @blur="blur" :maxlength="maxLength" :placeholder="placeholder"></textarea>
    <div class="submit" @click="submit">{{okText}}</div>
    <div class="count" :class="currentLength==maxLength?'max-count':''">{{currentLength}}/{{maxLength}}</div>
  </div>
</template>
<script>
import autosize from 'autosize'

export default {
  directives: {
    focus: {
      inserted: function(el) {
        // 聚焦元素
        el.focus()
      }
    }
  },
  props: {
    maxLength: {
      type: Number,
      default: 50
    },
    okText: {
      type: String,
      default: '确定'
    },
    content: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入...'
    }
  },
  data() {
    return {
      text: '',
      onceInput: ''
    }
  },
  computed: {
    currentLength: function() {
      return this.text.length
    }
  },
  mounted() {
    autosize(this.$refs.myTaxtarea)
    this.text = this.content
  },
  methods: {
    scrollToEnd() {
      setTimeout(() => {
        document.body.scrollTop = document.body.scrollHeight
      }, 300)
    },
    focus() {
      // console.log('focus')
      this.scrollToEnd()
    },
    blur() {
      // this.isInput = false
      if (this.content.length == 0) {
        this.onceInput = true
      }
    },
    input(e) {
      if (this.onceInput) {
        this.scrollToEnd()
        this.onceInput = false
      }
    },
    submit() {
      let content = this.text
      this.text = ''
      this.$emit('submit', { content: content })
    }
  }
}
</script>
<style lang="less" scoped>
.joo-taxtarea {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
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
  .max-count {
    color: red;
  }
}
</style>


