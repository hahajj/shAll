<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 新增 -->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="档案分类" name="档案分类">档案分类</el-tab-pane>
        <el-tab-pane label="船舶岸基关系" name="船舶岸基关系">船舶岸基关系</el-tab-pane>
        <el-tab-pane label="通函资料类别" name="通函资料类别">通函资料类别</el-tab-pane>
        <el-tab-pane label="港口信息" name="港口信息">港口信息</el-tab-pane>
      </el-tabs>

      <documentClass v-if="activeName=='档案分类'" ref="documentClass"/>

    </div>
  </div>
</template>
<script>
import checkPermission from '@/utils/permission'
import { parseTime } from '@/utils/index'
import documentClass from './documentClass/index'
export default {
  components: { documentClass },
  data() {
    return {
      activeName: '档案分类',
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

<style scoped>
  .el-tabs__content{display: none}

</style>
