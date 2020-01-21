<template>
  <div :style="{minWidth:minWidth?minWidth+'px':defaultWidth+'px'}">
    <div :id="source" style="margin: auto"/>
    <el-radio-group fill="#1890ff" style="margin: 20px 0 0 20px;"/>
  </div>

</template>
<script>
import $ from 'jquery'
var decoder
export default {
  props: {
    // ID
    source: {
      type: String,
      default: '0'
    },
    // 萤石云多个视频 必须逗号分隔字符串地址
    urlList: {
      type: String,
      default: ''
    },
    // 监听是否关闭
    closeE: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      player: null,
      maxHeight: '600',
      minWidth: '800',
      defaultWidth:'700'
    }
  },

  watch: {
    // 监听是否关闭 注销插件
    closeE(val, oldval) {
      if (val) {
        decoder.stop()
      }
    } },
  mounted() {
    this.maxHeight = document.body.clientHeight * 0.65
    this.minWidth = document.body.clientWidth * 0.5 < this.defaultWidth ? this.defaultWidth : document.body.clientWidth * 0.5
    window.onresize = () => { // 被萤石云插件 方法覆盖  只有加载时有用！！！
      this.maxHeight = document.body.clientHeight * 0.65
      this.minWidth = document.body.clientWidth * 0.5 < this.defaultWidth ? this.defaultWidth : document.body.clientWidth * 0.5
    }
    const b = this.source
    const url = this.urlList
    console.log(url)
    const _this = this
    const remoteJsUrl = process.env.NODE_ENV === 'production' ? '/ssms' : ''
    try {
      $(function() {
        decoder = new EZUIKit.EZUIPlayer({
          id: b, // div id值
          url: url, // ezopen播放地址逗号分隔
          autoplay: false, // 禁止自动播放
          decoderPath: remoteJsUrl + '/static/video_JS',
          width: _this.minWidth, // 默认宽度
          height: _this.maxHeight,
          splitBasis: 4// 置窗口切割参数
        })
        setTimeout(function() { // 必须定时器 否则不刷新！！
          $('#aaa>.parent-wnd>div').each(function() { // 给每个视频 加截图按钮
            $(this).append('<div style="position: absolute;bottom: 0px;left: 15px;"><div class="capturePlayStop" style="display: inline-block">' +
              '<svg xmlns="http://www.w3.org/2000/svg" class="capturePicture" style="width: 27px;cursor: pointer;" version="1.1" viewBox="0 0 32 32"><path d="M16 23c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6zM16 13c-2.206 0-4 1.794-4 4s1.794 4 4 4c2.206 0 4-1.794 4-4s-1.794-4-4-4zM27 28h-22c-1.654 0-3-1.346-3-3v-16c0-1.654 1.346-3 3-3h3c0.552 0 1 0.448 1 1s-0.448 1-1 1h-3c-0.551 0-1 0.449-1 1v16c0 0.552 0.449 1 1 1h22c0.552 0 1-0.448 1-1v-16c0-0.551-0.448-1-1-1h-11c-0.552 0-1-0.448-1-1s0.448-1 1-1h11c1.654 0 3 1.346 3 3v16c0 1.654-1.346 3-3 3zM24 10.5c0 0.828 0.672 1.5 1.5 1.5s1.5-0.672 1.5-1.5c0-0.828-0.672-1.5-1.5-1.5s-1.5 0.672-1.5 1.5zM15 4c0 0.552-0.448 1-1 1h-4c-0.552 0-1-0.448-1-1v0c0-0.552 0.448-1 1-1h4c0.552 0 1 0.448 1 1v0z"></path></svg></div>')
          })
          decoder.play()// 调用播放
          $('.capturePicture').click(function() {
            decoder.capturePicture($('.capturePicture').index(this), 'default')
          })
        }, 500)

        // $('.stop').click(function() {
        //   decoder.stop()
        // })
        // $('.stop').click(function() {
        //   decoder.stop()
        // })
        // $('.capturePicture').click(function() {
        //   decoder.capturePicture(0, 'default');
        // })
        // $('.play').click(function() {
        //   decoder.play()
        // })
      })
    } catch (e) {
      _this.$notify({
        title: '视频接入故障',
        type: 'error',
        duration: 2500
      })
    }
  },
  beforeDestroy() {
    $(function() {
      decoder.stop()
    })
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
