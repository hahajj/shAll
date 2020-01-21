<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container" style="text-align: left;">

      <el-radio-group v-model="isCollapse">
        <el-radio-button :label="true">航次指令</el-radio-button>
        <el-radio-button :label="false">航次动态报</el-radio-button>
      </el-radio-group>
    </div>

    <voyage v-if="isCollapse"/>
    <voyageReportDetailTemplate v-else/>
  </div>
</template>

<script>
import voyage from './voyage/index'
import voyageReportDetailTemplate from './voyageReportDetailTemplate/index'
export default {
  components: { voyage, voyageReportDetailTemplate },
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
