<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container" style="text-align: center;height: 50px;">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;float: left">

        <el-select v-model="voyageId" filterable placeholder="选择航次" @change="toQuery">
          <el-option
            v-for="(item,index) in voyageData"
            :key="index"
            :label="item.code"
            :value="item.voyageId"/>
        </el-select>
        <el-select v-model="status" filterable placeholder="选择提交状态" clearable @change="toQuery">
          <el-option
            v-for="(item,index) in statusData"
            :key="index"
            :label="item.key"
            :value="item.value"/>
        </el-select>
        <el-select v-if="status=='SHIP_SEND'" v-model="auditStatus" filterable placeholder="选择审批状态" @change="toQuery">
          <el-option
            v-for="(item,index) in auditStatusData"
            :key="index"
            :label="item"
            :value="item"/>
        </el-select>

        <!---->
        <el-button
          v-permission="['ADMIN','S2LVOYAGEREPORT_ALL','S2LVOYAGEREPORT_CREATE']"
          style=" position: relative;top: 3px;"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
      <el-button
        v-permission="['ADMIN','S2LVOYAGEREPORT_COMMIT_LAND']"
        style=" position: relative;top: 3px;float: right"
        class="filter-item"
        size="mini"
        type="warning"
        @click="commitLand">提交岸基</el-button>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" :only-see="onlySee"/>
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
      @selection-change="handleSelectionChange"
      @sort-change="sortChange">

      <el-table-column type="index" label="序号" width="55"/>
      <el-table-column prop="voyage.code" label="航次号"/>
      <el-table-column prop="reportType" label="动态"/>
      <el-table-column prop="label" label="标签"/>
      <el-table-column prop="position" label="船位"/>
      <el-table-column label="时间点" prop="reportDate" sortable="custom">
        <template slot-scope="scope">
          {{ parseTime(scope.row.reportDate) }}
        </template>
      </el-table-column>
      <el-table-column label="时长(小时)" prop="reportDuration"/>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          {{ getStautus(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','S2LVOYAGEREPORT_ALL','S2LVOYAGEREPORT_EDIT','S2LVOYAGEREPORT_DELETE'])&&!loading" label="操作" width="250px" align="center">
        <template slot-scope="scope">
          <span>
            <el-button
              v-permission="['ADMIN','S2LVOYAGEREPORT_ALL','S2LVOYAGEREPORT_EDIT']"
              v-if="scope.row.status !== 'SHIP_SEND'||(scope.row.voyageReportAduit && scope.row.voyageReportAduit.auditStatus == '驳回'&&scope.row.voyageReportAduit.auditBatchNum !== scope.row.auditBatchNum)"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="edit(scope.row)"/>
            <el-button
              v-permission="['ADMIN','S2LVOYAGEREPORT_ALL','S2LVOYAGEREPORT_EDIT']"
              v-else
              size="mini"
              type="warning"
              icon="el-icon-view"
              @click="edit(scope.row,1)"/>
          </span>
          <el-button
            v-permission="['ADMIN','S2LVOYAGEREPORT_ALL','S2LVOYAGEREPORT_DELETE']"
            v-if="scope.row.status !== 'SHIP_SEND'&&(scope.row.label!='航次结束'&&scope.row.label!='航次开始')"
            slot="reference"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="open(scope.row)"/>

        </template>
      </el-table-column>
      <el-table-column
        v-permission="['ADMIN','S2LVOYAGEREPORT_COMMIT_LAND']"
        :selectable="checkSelectable"
        type="selection"
        width="55"/>
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
import { getOAUserSecertMessage } from '@/api/partyEntryAudit'
import { commitVoyagePublish } from '@/api/voyage'
import { delS2lVoyageReport, getS2lVoyageReportDetail, commitLand, checkReportIsEndByVoyageId } from '@/api/s2lVoyageReportDetailTemplate'
import { getOrganizationByCriteria } from '@/api/organization'
import { getVoyage } from '@/api/voyage'
import { formModel } from './formModel'
import eForm from './form'

export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      onlySee: false,
      multipleSelection: [],
      auditStatus: '',
      auditStatusData: ['同意', '驳回'],
      status: '',
      statusData: [{ key: '待提交', value: 'USE' }, { key: '已提交', value: 'SHIP_SEND' }],
      voyageId: '',
      voyageData: [],
      organizationData: [],
      sort: 'report_date,desc',
      delLoading: false,
      downloadLoading: false,
      expand: true
    }
  },
  created() {
    this.$nextTick(() => {
      getVoyage({ size: 999, sort: 'voyageId,desc', organizationId: this.$store.state.user.user.partyDTO.organization.organizationId, auditStatus: '同意', confirmStatus: 'CONFIRM' }).then(res => {
        this.voyageData = res.content
        if (this.voyageData.length > 0) {
          this.voyageId = this.voyageData[0].voyageId
          return res
        }
      }).then(res => {
        this.init()
      })
    })
  },
  methods: {
    parseTime,
    checkPermission,
    formatJson,
    getStautus(row) {
      if (row.voyageReportAduit) {
        return row.voyageReportAduit.auditStatus === '同意' ? row.voyageReportAduit.auditStatus : row.voyageReportAduit.auditBatchNum !== row.auditBatchNum ? '第' + row.auditBatchNum + '次驳回(等待提交)' : '第' + (row.auditBatchNum - 1) + '次驳回(已提交)'
      } else {
        return row.status === 'SHIP_SEND' ? '已提交' : '等待提交'
      }
    },
    checkSelectable(row) {
    // && (row.auditBatchNum != row.voyageReportAduit.auditBatchNum && row.voyageReportAduit.auditStatus != '同意')
      return row.status !== 'SHIP_SEND' || ((row.voyageReportAduit && row.voyageReportAduit.auditBatchNum !== row.auditBatchNum) && row.voyageReportAduit.auditStatus === '驳回')
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    commitLand() {
      const list = this.multipleSelection.map(item => {
        return item.voyageReportId
      })
      if (!list || list.length === 0) {
        this.$notify({
          title: '您未选择数据',
          type: 'warning',
          duration: 2500
        })
        return false
      }
      commitLand({ voyageReportIds: list, voyageId: this.voyageId }).then(res => {
        this.init()
      })
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
    commitVoyagePublish(row) {
      // userId: userId, token: token,
      commitVoyagePublish(row.voyageId).then(res => {
        this.$notify({
          title: '提交成功',
          type: 'success',
          duration: 2500
        })
        this.init()
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.response.data.message
        })
      })
    },
    audit(row) { // 审批
      getOAUserSecertMessage({
        requestid: row.auditWorkflowId,
        workcode: this.$store.state.user.user.partyDTO.partyId
      }).then(res => {
        window.open(process.env.Workcode_BASE_API + '?token=' + res)
        // this.init()
        this.$notify({
          title: '提交成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.$message({
          type: 'error',
          message: '故障！'
        })
      })
    },
    // 导出
    download() {
      let exceldata = []
      exceldata = this.data
      this.downloadLoading = true
        import('@/utils/export2Excel').then(excel => {
          const tHeader = ['状态', '创建时间', '上次修改时间', '创建人', '上次修改人', '公司编号', '公司名称', '供货范围', '联系电话', '联系人', '供货类型', '备注']
          const filterVal = ['status', 'createdDate', 'lastModifiedDate', 'createdBy', 'lastModifiedBy', 'companyCode', 'companyName', 'scope', 'contactPhone', 'contact', 'supplyType', 'comments']
          const data = this.formatJson(filterVal, exceldata)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '客户信息'
          })
          this.downloadLoading = false
        })
    },
    beforeInit() {
      getOrganizationByCriteria({ organizationType: 'SHIP_DEPT' }).then(res => {
        this.organizationData = res
      })

      this.url = 'api/s2lVoyageReport'
      const sort = this.sort
      this.size = 30
      this.params = { page: this.page, size: this.size, sort: sort, organizationId: this.$store.state.user.user.partyDTO.organization.organizationId, voyageId: this.voyageId }
      if (this.status) {
        this.params['status'] = this.status
        if (this.status !== 'SHIP_SEND') {
          this.auditStatus = null
        }
      }
      if (this.auditStatus) {
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
    subDelete(voyageId) {
      this.delLoading = true
      delS2lVoyageReport(voyageId).then(res => {
        this.delLoading = false
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        console.log(err.response.data.message)
      })
    },
    add() {
      checkReportIsEndByVoyageId({ voyageId: this.voyageId }).then(res => {
        if (res === 'NO_REPORT_BEGIN_DATA') {
          this.$notify({
            title: '请优先填写航次开始',
            type: 'warning',
            duration: 2500
          })
          return false
        }
        if (!res) {
          this.isAdd = true
          this.onlySee = false
          this.$refs.form.organizationData = this.organizationData
          var cargo = []

          this.voyageData.map(item => {
            if (item.voyageId === this.voyageId) {
              item.voyageCargoInfos.map(items => {
                cargo.push(items.cargo.name)
              })
            }
          })
          cargo = Array.from(new Set(cargo))
          this.$refs.form.reportObj = { voyageReportId: '', voyageId: this.voyageId, cargo: cargo }
          this.$refs.form.dialog = true
        } else {
          this.$notify({
            title: '该航次无法继续添加!',
            type: 'warning',
            duration: 2500
          })
        }
      })
    },
    edit(row, type) {
      this.isAdd = false
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
