<template>
  <div>
    <remote-js/>
    <remote-js1/>
    <remote-js2/>
    <remote-js3/>
  </div>
</template>
<script>
export default {
  components: {
    'remote-js': {
      render(createElement) {
        return createElement('script', { attrs: { type: 'text/javascript', src: '/static/video_JS/polyfill.min.js' }})
      }
    },
    'remote-js1': {
      render(createElement) {
        return createElement('script', { attrs: { type: 'text/javascript', src: '/static/video_JS/all.js' }})
      }
    },
    'remote-js2': {
      render(createElement) {
        return createElement('script', { attrs: { type: 'text/javascript', src: '/static/video_JS/v4-shims.js' }})
      }
    },
    'remote-js3': {
      render(createElement) {
        return createElement('script', { attrs: { type: 'text/javascript', src: '/static/video_JS/ezuikit.js' }})
      }
    }
  }
}
</script>

