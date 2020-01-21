<template>
  <d-player ref="player" :video="source.video" :contextmenu="source.contextmenu" @play="play" @playScreenshot="playScreenshot"/>
</template>

<script>
import dPlayer from './VueDPlayer'

export default {
  components: {
    dPlayer
  },
  props: {
    source: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      player: null
    }
  },
  mounted() {
    this.video = this.source.video
    this.contextmenu = this.source.contextmenu
    this.player = this.$refs.player.dp
    // var hls = new Hls()
    // hls.loadSource('https://logos-channel.scaleengine.net/logos-channel/live/biblescreen-ad-free/chunklist_w630020335.m3u8')
    // hls.attachMedia(this.player)
  },
  methods: {
    play() {
      console.log('play callback')
    },
    playScreenshot() {
      this.$notify({
        title: '截图成功',
        type: 'success',
        duration: 2500
      })
    }
  }
}
</script>
