<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <el-row :gutter="20">
        <el-col :xs="17" :sm="18" :md="20" :lg="20" :xl="20">
          <!--工具栏-->
          <div class="head-container">
            <treeselect v-model="organization" :options="organizations" style="width: 200px;margin-top: 6px;" class="left" placeholder="请选择船舶" @select="getNode" />
            <el-date-picker
              v-model="querydate"
              class="filter-item"
              type="month"
              format="yyyy 年 MM 月"
              value-format="yyyy-MM-dd 00:00:00"
              placeholder="选择日期"/>
            <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="query">搜索</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart ref="linechart"/>
      </el-row>
    </div>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { mapGetters } from 'vuex'
import PanelGroup from '../../dashboard/PanelGroup'
import LineChart from '../../dashboard/LineChart'
import RaddarChart from '../../dashboard/RaddarChart'
import PieChart from '../../dashboard/PieChart'
import BarChart from '../../dashboard/BarChart'
import { count } from '@/api/visits'
import { getOrganization } from '@/api/organization'
import { getCurrentUser } from '@/api/user'

/**
   * 记录访问，只有页面刷新或者第一次加载才会记录
   */
count().then(res => {})

export default {
  name: 'Dashboard',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    Treeselect,
    treeTable,
    BarChart },
  data() {
    return {
      organizations: [],
      organization: null,
      querydate: null,
      organizationName: {}
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    this.queryAllOrganization()
  },
  methods: {
    queryAllOrganization() {
      getCurrentUser().then(res => {
        if (res.party && res.party.partyType && res.party.partyType.partyType === 'CREW') {
          this.organizations = [res.party.organization]
        } else {
          const para = { organizationType: 'BRANCH_COMPANY,SHIP_DEPT,PARENT_COMPANY', size: 9999 }
          getOrganization(para).then(res => {
            this.organizations = res.content
          })
        }
      })
    },
    query() {
      if (!this.organization || !this.querydate) {
        this.$message('请选择船舶与日期后进行查询')
        return
      }
      const _this = this.$refs.linechart
      _this.startTime = this.querydate
      _this.organizationId = this.organization
      if (this.querydate) {
        var time = new Date(this.querydate)
        _this.querydate = '(' + time.getFullYear() + '年' + (time.getMonth() + 1) + '月)'
      }
      _this.getCrewWorkGroupByParty()
    },
    getNode(node) {
      this.organizationName = node
      const _this = this.$refs.linechart
      _this.organization = node
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .left{
    height: 30.5px;
    line-height: 30.5px;
    display: inline-block;
    font-size: 14px;
    color: #606266;
  }

  .dashboard-editor-container {
    padding: 18px 22px 22px 22px;
    background-color: rgb(240, 242, 245);
    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  /deep/ .vue-treeselect__control {
    margin-top: 6px;
    padding-left: 5px;
    padding-right: 5px;
    display: table;
    table-layout: fixed;
    width: 100%;
    height: 29px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background: #fff;
    -webkit-transition-duration: 200ms;
    transition-duration: 200ms;
    -webkit-transition-property: border-color, width, height, background-color, opacity, -webkit-box-shadow;
    transition-property: border-color, width, height, background-color, opacity, -webkit-box-shadow;
    transition-property: border-color, box-shadow, width, height, background-color, opacity;
    transition-property: border-color, box-shadow, width, height, background-color, opacity, -webkit-box-shadow;
    -webkit-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
</style>
