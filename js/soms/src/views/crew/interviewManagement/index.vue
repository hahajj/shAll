<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','PARTYENTRY_ALL','PARTYENTRY_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增
        </el-button>
      </div>
      <!-- 导出 -->
      <div style="display: inline-block;">
        <el-button
          v-permission="['ADMIN','PARTY_ALL','PARTY_SELECT']"
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="download">导出
        </el-button>
      </div>
    </div>

    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;" highlight-current-row
              @current-change="handleCurrentChange">
      <el-table-column type="index" width="50" label="序号"/>
      <el-table-column prop="party.name" label="姓名"/>
      <el-table-column prop="party.organization.name" label="应聘船舶"/>
      <el-table-column prop="party.job.name" label="应聘岗位"/>
      <el-table-column prop="auditSuggestion" label="评价内容"/>
      <el-table-column prop="auditStatus" label="状态"/>
      <!--<el-table-column prop="auditWorkflowId" />-->
      <el-table-column v-if="!loading" label="操作" width="250px" align="center">
        <template slot-scope="scope">
          <!--<el-button v-permission="['ADMIN','PARTYENTRY_ALL','PARTYENTRY_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>-->
          <el-button
            v-permission="['ADMIN','PARTYENTRY_ALL','PARTYENTRY_EDIT']"
            v-if="scope.row.auditStatus==='驳回' || scope.row.auditStatus==='待审批' || scope.row.auditStatus==='同意'"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="edit(scope.row)"/>
          <el-button
            v-permission="['ADMIN','PARTYENTRY_ALL','PARTYENTRY_DELETE']"
            v-if="scope.row.auditStatus==='待审批'"
            class="filter-item"
            size="mini"
            type="primary"
            @click="commitEntryAudit(scope.row)">提交审核
          </el-button>
          <el-button
            v-permission="['ADMIN','PARTYENTRY_APPROVAL']"
            v-if="scope.row.auditStatus==='审批中'
            && currentUserPartyId === scope.row.auditBy"
            class="filter-item"
            size="mini"
            type="primary"
            @click="audit(scope.row)">审批
          </el-button>
          <el-button
            v-permission="['ADMIN','PARTYENTRY_ALL','PARTYENTRY_DELETE']"
            v-if="scope.row.auditStatus==='待审批'"
            slot="reference"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="open(scope.row)"/>
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

    <!--面试-->
    <el-drawer
      :visible.sync="iframeFlag"
      :before-close="handleClose"
      title=""
      direction="rtl"
      size="67%">
      <div class="demo-drawer__content">
        <iframep v-if="iframeFlag" ref="iframe" :url-href="urlHref"/>
      </div>
    </el-drawer>
  </div>
</template>

<script>
  import checkPermission from '@/utils/permission'
  import initData from '@/mixins/initData'
  import { del, commitEntryAudit, getOAUserSecertMessage } from '@/api/partyEntryAudit'
  import { parseTime } from '@/utils/index'
  import eForm from './form'
  import { getCurrentUser } from '@/api/user'
  import iframep from './iframe_p'
  import { downloadFiles } from '@/utils/index'
  import { exportCrewRegister } from '@/api/party'

  export default {
    components: { eForm, iframep },
    mixins: [initData],
    data() {
      return {
        urlHref: '',
        iframeFlag: false,
        delLoading: false,
        commitEntryAuditloading: false,
        currentUserPartyId: '',
        currentRow: {}
      }
    },
    created() {
      this.getCurrentUser()
      this.$nextTick(() => {
        this.init()
      })
      document.addEventListener('visibilitychange', this.changeTab)
    },
    beforeDestroy() {
      document.removeEventListener('visibilitychange', this.changeTab)
    },
    methods: {
      parseTime,
      checkPermission,
      changeTab() {
        var _this = this
        if (document.visibilityState === 'visible') {
          _this.init()
        }
      },
      handleClose(done) {
        this.init()
        done()
      },
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
        this.params = { page: this.page, size: this.size, sort: sort, auditStatus: '待审批,审批中,同意,驳回' }
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
      getCurrentUser() {
        getCurrentUser().then(res => {
          if (res && res.party) {
            this.currentUserPartyId = res.party.partyId
          }
        })
      },
      audit(row) { // 审批
        // userId: userId, token: token,re
        getOAUserSecertMessage({
          requestid: row.auditWorkflowId,
          workcode: this.$store.state.user.user.partyDTO.partyId
        }).then(res => {
          window.open(process.env.Workcode_BASE_API + '?token=' + res)
          // this.urlHref = process.env.Workcode_BASE_API + '?token=' + res
          // this.iframeFlag = true
          // this.init()
          // this.$notify({
          //   title: '提交成功',
          //   type: 'success',
          //   duration: 2500
          // })
        }).catch(err => {
          // this.$message({
          //   type: 'error',
          //   message: '故障！'
          // })
        })
      },
      // 导出
      download() {
        if (this.currentRow && this.currentRow.partyEntryAuditId) {
          this.downloadLoading = true
          exportCrewRegister(this.currentRow.partyEntryAuditId).then((data) => {
            this.downloadLoading = false
            downloadFiles(data, '盛航SQR-CD002 船员面试记录表.XLS')
            this.$notify({
              title: '导出成功',
              type: 'success',
              duration: 2500
            })
          })

        } else {
          this.$message.error(`请选择一行数据进行导出`)
        }
      },
      commitEntryAudit(row) {
        // userId: userId, token: token,
        commitEntryAudit(row.partyEntryAuditId, {
          requestid: row.auditWorkflowId,
          workcode: this.$store.state.user.user.partyDTO.partyId
        }).then(res => {
          console.log(res)
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
      edit(data) {
        this.isAdd = false
        const _this = this.$refs.form
        _this.form = {
          auditSuggestion: data.auditSuggestion,
          partyEntryAuditId: data.partyEntryAuditId,
          party: {
            partyId: data.party.partyId,
            name: data.party.name,
            organization: data.party.organization.organizationId,
            job: data.party.job.jobId
          }
        }
        _this.dialog = true
      },
      handleCurrentChange(val) {
        this.currentRow = val
      }
    }
  }
</script>

<style scoped>

</style>
