<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','PARTYCHANGE_ALL','PARTYCHANGE_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column type="index" width="50" label="序号"/>
      <el-table-column prop="party.name" label="姓名"/>
      <el-table-column prop="party.organization.name" label="应聘船舶"/>
      <el-table-column prop="party.job.name" label="应聘岗位"/>
      <el-table-column prop="auditSuggestion" label="评价内容"/>
      <el-table-column prop="auditStatus" label="状态"/>
      <el-table-column prop="auditWorkflowId" />
      <el-table-column v-if="checkPermission(['ADMIN','PARTYCHANGE_ALL','PARTYCHANGE_EDIT','PARTYCHANGE_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <!--<el-button v-permission="['ADMIN','PARTYCHANGE_ALL','PARTYCHANGE_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>-->
          <el-button v-permission="['ADMIN','PARTYCHANGE_ALL','PARTYCHANGE_DELETE']" v-if="scope.row.auditStatus==='待审批'" class="filter-item" size="mini" type="primary" @click="commitEntryAudit(scope.row)">提交审核</el-button>
          <el-button v-permission="['ADMIN','PARTYCHANGE_AUDIT']" v-if="scope.row.auditStatus==='审批中'" class="filter-item" size="mini" type="primary" @click="audit(scope.row)">审批</el-button>
          <el-button v-permission="['ADMIN','PARTYCHANGE_ALL','PARTYCHANGE_DELETE']" slot="reference" type="danger" icon="el-icon-delete" size="mini" @click="open(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>
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
import initData from '@/mixins/initData'
import { del, commitEntryAudit } from '@/api/partyEntryAudit'
import { parseTime } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    open(data) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(data)
        this.subDelete(data.partyEntryAuditId)
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
    },
    beforeInit() {
      this.url = 'api/partyEntryAudit'
      const sort = 'partyEntryAuditId,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      return true
    },
    subDelete(partyEntryAuditId) {
      this.delLoading = true
      del(partyEntryAuditId).then(res => {
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
        this.$refs[partyEntryAuditId].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      const _this = this.$refs.form
      _this.dialog = true
    },
    audit(row) { // 审批
      // userId: userId, token: token,re
      getOAUserSecertMessage({ requestid: row.auditWorkflowId, workcode: this.$store.state.user.user.partyDTO.code }).then(res => {
        console.log(res)
        window.open(process.env.Workcode_BASE_API + '?token=' + res)
        this.init()
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
    commitEntryAudit(row) {
      // debugger
      // userId: userId, token: token,
      commitEntryAudit(row.partyEntryAuditId, { requestid: row.auditWorkflowId, workcode: this.$store.state.user.user.partyDTO.code }).then(res => {
        console.log(res)
        this.$notify({
          title: '提交成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.response.data.message
        })
      })
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        partyEntryAuditId: data.partyEntryAuditId,
        createdDate: data.createdDate,
        createdBy: data.createdBy,
        lastModifiedDate: data.lastModifiedDate,
        lastModifiedBy: data.lastModifiedBy,
        partyId: data.partyId,
        changeDate: data.changeDate,
        changeBy: data.changeBy,
        commnets: data.commnets,
        changeType: data.changeType,
        auditStatus: data.auditStatus
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
