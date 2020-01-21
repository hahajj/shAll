<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <equipmentInfo ref="equipmentInfo"/>
      <equipmentDetail v-if="isHidden" ref="equipmentDetail" style="margin-top: 25px;" />
    </div>
  </div>
</template>
<script>
import checkPermission from '@/utils/permission'
import { parseTime } from '@/utils/index'
import equipmentInfo from './equipmentInfo/index'
import equipmentDetail from './equipmentDetail/index'
export default {
  components: { equipmentInfo, equipmentDetail },
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
