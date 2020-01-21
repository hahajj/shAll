<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <materialInfo ref="materialInfo"/>
      <materialDetail v-if = "isHidden" ref="materialDetail" style="margin-top: 25px;" />
    </div>
  </div>
</template>
<script>
import checkPermission from '@/utils/permission'
import { parseTime } from '@/utils/index'
import materialInfo from './materialInfo/index'
import materialDetail from './materialDetail/index'
export default {
  components: { materialInfo, materialDetail },
  data() {
    return {
      delLoading: false,
      isHidden: false
    }
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
