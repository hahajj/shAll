<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 新增 -->

      <document ref="document"/>
      <documentDetail v-if="isHidden" ref="documentDetail" style="    margin-top: 25px;" />
    </div>
  </div>
</template>
<script>
import checkPermission from '@/utils/permission'
import { parseTime } from '@/utils/index'
import document from './document/index'
import documentDetail from './documentDetail/index'
export default {
  components: { document, documentDetail },
  data() {
    return {
      delLoading: false,
      isHidden: false
    }
  },
  created() {
    this.$nextTick(() => {
    })
  },
  methods: {
    parseTime,
    checkPermission
  }
}
</script>

<style scoped>
  .el-tabs__content{display: none}

</style>
