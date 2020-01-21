<!--suppress ALL -->
<template>
  <!--船舶接受和发送和相反-->
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <el-radio-group v-model="activeName">
        <el-radio-button :label="true">发送</el-radio-button>
        <el-radio-button :label="false">接收</el-radio-button>
      </el-radio-group>
    </div>
    <acceptCircular v-if="activeName"></acceptCircular>
    <sendCircular v-else></sendCircular>
  </div>
</template>

<script>
  import sendCircular from './send'
  import acceptCircular from './accept'

  export default {
    components: { sendCircular,acceptCircular },
    data() {
      return {
        activeName: true,
      }
    },
    created() {
      this.$nextTick(() => {
      })
    },
    methods: {
    }
  }
</script>

<style scoped>
  .el-tabs__content{display: none}

</style>
