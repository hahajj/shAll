<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container" style="text-align: center;">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;float: left">
        <el-button
          v-permission="['ADMIN','CONTRACT_ALL','CONTRACT_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
      <div style="display: inline-block;margin: 0px 2px;float: right">
        <!-- 导出 -->
        <!--<el-button-->
        <!--v-permission="['ADMIN','SUPPLY_ALL','SUPPLY_EDIT']"-->
        <!--:loading="downloadLoading"-->
        <!--size="mini"-->
        <!--class="filter-item"-->
        <!--type="warning"-->
        <!--icon="el-icon-download"-->
        <!--@click="download">导出-->
        <!--</el-button>-->
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" id="singleTableDoc" ref="singleTable" :data="data" size="small" style="width: 100%;text-align: center" @sort-change="sortChange">
      <el-table-column prop="code" label="合同号"/>
      <el-table-column prop="contractType" label="合同类型"/>
      <el-table-column prop="name" label="货物种类"/>
      <!--contractCargoInfos[0].cargo.cargoSpec-->
      <el-table-column prop="amount" label="货物总量（吨）"/>

      <el-table-column prop="totalAmount" label="总运费（元）"/>

      <el-table-column label="签订日期" prop="signDate" sortable="custom">
        <template slot-scope="scope">
          {{ parseTime(scope.row.signDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          {{ statusData(scope.row.status) }}
        </template>
      </el-table-column>

      <el-table-column v-if="checkPermission(['ADMIN','CONTRACT_ALL','CONTRACT_EDIT','CONTRACT_DELETE','CONTRACT_CREATE'])&&!loading" label="操作" width="250px" align="center">
        <template v-if="scope.row.contractCargoInfos" slot-scope="scope">
          <el-button v-permission="['ADMIN','CONTRACT_ALL','CONTRACT_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-button v-permission="['ADMIN','CONTRACT_ALL','CONTRACT_DELETE']" slot="reference" type="danger" icon="el-icon-delete" size="mini" @click="open(scope.row)"/>
          <el-button v-permission="['ADMIN','CONTRACT_ALL','CONTRACT_CREATE']" v-if="scope.row.auditStatus==='待审批'" slot="reference" type="warning" size="mini" @click="commitAudit(scope.row)">提交审批</el-button>
          <el-button v-if="scope.row.auditStatus==='审批中'&& currentUserPartyId === scope.row.auditBy" slot="reference" type="success" size="mini" @click="audit(scope.row)">审批</el-button>
          <el-button v-if="scope.row.auditStatus==='驳回'" type="warning" size="mini">已驳回</el-button>
        </template>
    </el-table-column></el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from './initData'
import { del, commitAudit } from '@/api/contract'
import { parseTime } from '@/utils/index'
import { formatJsonNew } from '@/utils/index'
import { getOAUserSecertMessage } from '@/api/partyEntryAudit'
import { getCurrentUser } from '@/api/user'

import eForm from './form'

export default {
  components: { eForm },
  mixins: [initData],
  data: function() {
    return {
      currentUserPartyId: '',
      code: '',
      columns: [
        {
          text: '合同号',
          value: 'code'
        }
      ],
      sort: ' ',
      statusList: {
        USE: '合同评审',
        SIGN: '合同签订',
        EXECUTE: '合同执行',
        FINISH: '合同结束'
      },
      delLoading: false,
      downloadLoading: false,
      expand: true
    }
  },
  created() {
    this.getCurrentUser()
    this.code = this.$route.query.code

    document.addEventListener('visibilitychange', this.changeTab)
    this.$nextTick(() => {
      this.init()
    })
  },
  beforeDestroy() {
    document.removeEventListener('visibilitychange', this.changeTab)
  },
  methods: {
    parseTime,
    checkPermission,
    formatJsonNew,
    getCurrentUser() {
      getCurrentUser().then(res => {
        if (res && res.party) {
          this.currentUserPartyId = res.party.partyId
        }
      })
    },
    commitAudit(row) {
      // userId: userId, token: token,
      commitAudit(row.contractId, {
      }).then(res => {
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
      // userId: userId, token: token,re
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
    changeTab() {
      var _this = this
      if (document.visibilityState === 'visible') {
        _this.init()
      }
    },
    statusData(status) {
      return this.statusList[status]
    },
    open(data) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.subDelete(data.contractId)
      }).catch(() => {
      })
    },
    // 导出
    download() {
      let exceldata = []
      // get({ organization: this.params.organization }).then(res => {
      exceldata = this.data
      this.downloadLoading = true
      import('@/utils/export2Excel').then(excel => {
        const tHeader = ['状态', '货物种类', '上次修改时间', '创建人', '上次修改人', '公司编号', '公司名称', '供货范围', '联系电话', '联系人', '供货类型', '备注']
        const filterVal = ['status', 'children.cargo.cargoSpec', 'children.amount', 'children.price', 'totalAmount', 'companyCode', 'companyName', 'scope', 'contactPhone', 'contact', 'supplyType', 'comments']
        const data = this.formatJsonNew(filterVal, exceldata)
        console.log(exceldata, data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '客户信息'
        })
        this.downloadLoading = false
      })
      // })
    },
    beforeInit() {
      this.url = 'api/contract'
      const sort = this.sort
      this.params = { page: this.page, size: this.size, sort: sort, status: 'USE,SIGN,EXECUTE,FINISH', code: this.code }
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
    subDelete(supplyId) {
      this.delLoading = true
      del(supplyId).then(res => {
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
        this.$refs[supplyId].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(row) {
      if (!row.contractCargoInfos || row.contractCargoInfos.length === 0) {
        row.contractCargoInfos = [{ cargo: {}}]
      }
      this.$refs.form.activeCargoData = []
      row.contractCargoInfos.map(items => {
        items.cargoId = items.cargo.cargoId
        this.$refs.form.activeCargoData.push(items.cargo)
      })

      this.isAdd = false
      const _this = this.$refs.form
      this.$refs.form.form = JSON.parse(JSON.stringify(row))
      _this.dialog = true
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
