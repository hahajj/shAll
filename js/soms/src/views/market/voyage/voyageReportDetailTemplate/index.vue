<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container" style="text-align: center;">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;float: left">
        <el-select v-model="organizationId" filterable placeholder="选择船只" clearable @change="changeorganizationId()">
          <el-option
            v-for="(item,index) in organizationData"
            :key="index"
            :label="item.label"
            :value="item.organizationId"/>
        </el-select>
        <el-select v-model="voyageId" filterable placeholder="选择航次" clearable @change="toQuery">
          <el-option
            v-for="(item,index) in voyageData"
            :key="index"
            :label="item.code"
            :value="item.voyageId"/>
        </el-select>
        <el-select v-model="auditStatus" filterable placeholder="选择审批状态" clearable @change="toQuery">
          <el-option
            v-for="(item,index) in auditStatusData"
            :key="index"
            :label="item"
            :value="item"/>
        </el-select>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" :only-see="onlySee" :no-select="noSelect"/>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      id="singleTableDoc"
      ref="singleTable"
      :data="data"
      :tree-props="{children: 'children'}"
      row-key="id"
      default-expand-all
      lazy
      size="small"
      style="width: 100%;text-align: center"
      @sort-change="sortChange"
    >

      <el-table-column type="index" label="序号" width="55"/>

      <el-table-column prop="voyage.code" label="航次号"/>
      <el-table-column prop="voyage.organizationId.name" label="船舶名称"/>
      <el-table-column prop="reportType" label="动态"/>
      <el-table-column prop="label" label="标签"/>
      <el-table-column prop="position" label="船位"/>
      <el-table-column label="时间点" prop="reportDate" sortable="custom">
        <template slot-scope="scope">
          {{ parseTime(scope.row.reportDate) }}
        </template>
      </el-table-column>
      <el-table-column label="时长(小时)" prop="reportDuration"/>
      <el-table-column prop="voyageReportAduit.auditStatus" label="状态">
        <template slot-scope="scope">
          <span> {{ !scope.row.voyageReportAduit?'待审批':scope.row.voyageReportAduit.auditStatus=='同意'?'同意':scope.row.voyageReportAduit.auditBatchNum==scope.row.auditBatchNum?'待审批（第'+scope.row.auditBatchNum+'次提交)':'驳回' }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','S2LVOYAGEREPORT_ALL','S2LVOYAGEREPORT_LAND_AUDIT'])&&!loading" label="操作" width="250px" align="center">
        <template slot-scope="scope">
          <el-button
            v-permission="['ADMIN','S2LVOYAGEREPORT_ALL','S2LVOYAGEREPORT_LAND_AUDIT']"
            v-if="!scope.row.voyageReportAduit||scope.row.auditBatchNum==scope.row.voyageReportAduit.auditBatchNum"
            size="mini"
            type="primary"
            @click="edit(scope.row,1)">
            审批
          </el-button>
          <span v-else>
            <el-button
              v-permission="['ADMIN','S2LVOYAGEREPORT_ALL','S2LVOYAGEREPORT_LAND_AUDIT']"
              size="mini"
              type="warning"
              icon="el-icon-view"
              @click="edit(scope.row,2)"/>
              <!--<el-button-->
              <!--size="mini"-->
              <!--type="text">-->
              <!--{{ scope.row.voyageReportAduit.auditStatus }}-->
              <!--</el-button>-->
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      :page-size="size"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { parseTime } from '@/utils/index'
import { formatJson } from '@/utils/index'
import { getS2lVoyageReportDetail, landAudit } from '@/api/s2lVoyageReportDetailTemplate'
import { getOrganizationByCriteria } from '@/api/organization'
import { getVoyage } from '@/api/voyage'
import { formModel } from '../../s2lVoyage/s2lVoyageReportDetailTemplate/formModel'

import eForm from './form'

export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      onlySee: false,
      noSelect: false,
      multipleSelection: [],
      auditStatus: '',
      auditStatusData: ['同意', '驳回', '全部'],
      voyageId: '',
      voyageData: [],
      organizationId: '',
      organizationData: [],
      sort: 'report_date,desc',
      delLoading: false,
      expand: true
    }
  },
  created() {
    this.$nextTick(() => {
      // 两个接口启动时并不需要依赖
      getOrganizationByCriteria({ organizationType: 'SHIP_DEPT' }).then(res => {
        this.organizationData = res
      })
      getVoyage({ size: 999, organizationId: this.organizationId, sort: 'voyageId,desc' }).then(res => {
        this.voyageData = res.content
        return res
      }).then(res => {
        this.init()
      })
    })
  },
  methods: {
    parseTime,
    checkPermission,
    formatJson,
    changeorganizationId() {
      getVoyage({ size: 999, organizationId: this.organizationId, sort: 'voyageId,desc' }).then(res => {
        this.voyageData = res.content
        this.voyageId = ''
        return res
      }).then(res => {
        this.init()
      })
    },
    landAudit(row) {
      landAudit({ voyageReportId: row.voyageReportId, auditStatus: '同意' }).then(res => {
        this.$notify({
          title: '操作成功',
          type: 'success',
          duration: 2500
        })
        this.init()
      })
    },
    checkSelectable(row) {
      return row.status !== 'SHIP_SEND'
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    open(data) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.subDelete(data.voyageReportId)
      }).catch(() => {
      })
    },
    beforeInit() {
      getOrganizationByCriteria({ organizationType: 'SHIP_DEPT' }).then(res => {
        this.organizationData = res
      })

      this.url = 'api/s2lVoyageReport'
      const sort = this.sort
      this.size = 30
      this.params = { page: this.page, size: this.size, sort: sort, organizationId: this.organizationId, voyageId: this.voyageId, status: 'SHIP_SEND' }
      if (this.auditStatus && this.auditStatus !== '全部') {
        this.params['auditStatus'] = this.auditStatus
      }

      return true
    },
    sortChange(column, prop, order) {
      if (column.prop == null || column.order == null) {
        this.queryData.prop = ''
        this.queryData.order = ''
      } else {
        if (column.order === 'ascending') { this.sort = column.prop + ',asc' } else { this.sort = column.prop + ',desc' }
      }
      this.init()
    },

    edit(row, type) {
      this.isAdd = false
      this.noSelect = type !== 1
      this.onlySee = !!type
      const _this = this.$refs.form
      _this.reportType = row.reportType
      _this.reportDetail = row.label
      _this.voyageReportId = row.voyageReportId
      var cargo = []
      row.voyage.contracts.map(item => {
        item.contractCargoInfos.map(items => {
          cargo.push(items.cargo.name)
        })
      })
      cargo = Array.from(new Set(cargo))
      this.$refs.form.reportObj = { voyageReportId: row.voyageReportId, voyageId: this.voyageId, cargo: cargo }
      getS2lVoyageReportDetail({ voyageReportId: row.voyageReportId, sort: 'sortNum' }).then(res => {
        formModel(res, _this, 1)
      })
    }
  }
}
</script>

<style scoped>

</style>

<style>
  #singleTableDoc tr{
    cursor: pointer;
  }
</style>
