<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 新增 -->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="审批消息" name="审批消息">审批消息</el-tab-pane>
        <el-tab-pane label="告警消息" name="告警消息">告警消息</el-tab-pane>
        <el-tab-pane label="通知消息" name="通函资料类别">通知消息</el-tab-pane>
      </el-tabs>

      <approvalMessages v-if="activeName=='审批消息'" ref="approvalMessages"/>

    </div>
  </div>
</template>
<script>
import checkPermission from '@/utils/permission'
import { parseTime } from '@/utils/index'
import approvalMessages from './approvalMessages'
export default {
  components: { approvalMessages },
  data() {
    return {
      activeName: '审批消息',
      delLoading: false
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

<style>
  .el-tabs__content{display: none}

</style>
