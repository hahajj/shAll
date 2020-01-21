<template>
  <iframe :src="urlHref" frameborder="0" width="100%" style="min-height: 700px"/>
</template>

<script>

export default {
  props: {
    urlHref: {

      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileList: [],
    }
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
