<template>
  <div class="dplayer"/>
</template>
<script>
import 'dplayer/dist/DPlayer.min.css'
import DPlayer from 'dplayer'

export default {
  props: {
    autoplay: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      default: '#FADFA3'
    },
    loop: {
      type: Boolean,
      default: true
    },
    lang: {
      type: String,
      default: 'zh-cn'
    },
    screenshot: {
      type: Boolean,
      default: true
    },
    hotkey: {
      type: Boolean,
      default: true
    },
    preload: {
      type: String,
      default: 'auto'
    },
    contextmenu: {
      type: Array
    },
    logo: {
      type: String
    },
    video: {
      type: Object,
      required: true,
      validator(value) {
        return typeof value.url === 'string'
      }
    },
    mutex: {// 阻止同时播放
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dp: null
    }
  },
  mounted() {
    const player = this.dp = new DPlayer({
      element: this.$el,
      autoplay: this.autoplay,
      theme: this.theme,
      loop: this.loop,
      lang: this.lang,
      screenshot: this.screenshot,
      hotkey: this.hotkey,
      preload: this.preload,
      contextmenu: this.contextmenu,
      logo: this.logo,
      mutex: this.mutex,
      video: {
        url: this.video.url,
        pic: this.video.pic,
        type: this.video.type
      }
    })
    player.on('play', () => {
      // this.$emit('play')
    })
    player.on('pause', () => {
      this.$emit('pause')
    })
    player.on('canplay', () => {
      this.$emit('canplay')
    })
    player.on('playing', () => {
      this.$emit('playing')
    })
    player.on('ended', () => {
      this.$emit('ended')
    })
    player.on('error', () => {
      this.$emit('error')
    })
    player.on('screenshot', () => {
      this.$emit('playScreenshot')
    })
  }
}
</script>
