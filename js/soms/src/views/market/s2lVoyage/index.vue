<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container" style="text-align: left;">

      <el-radio-group v-model="isCollapse">
        <el-radio-button :label="true">航次指令</el-radio-button>
        <el-radio-button :label="false">航次动态报</el-radio-button>
      </el-radio-group>
    </div>

    <s2lVoyage v-if="isCollapse"/>
    <s2lVoyageReportDetailTemplate v-else/>
  </div>
</template>

<script>
import s2lVoyage from './s2lVoyage/index'
import s2lVoyageReportDetailTemplate from './s2lVoyageReportDetailTemplate/index'

export default {
  components: { s2lVoyage, s2lVoyageReportDetailTemplate },
  data() {
    return {
      isCollapse: true
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style scoped>

</style>

<style>
</style>
