<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--<el-input v-model="query.jobName" clearable placeholder="输入公司搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>-->
      <treeselect
        v-if="currentPartyType != 'CREW'"
        v-model="query.newOrganization"
        :options="organizations"
        style="width: 200px;margin-top: 6px;  "
        class="left"
        placeholder="请选择船舶"/>
      <treeselect
        v-if="currentPartyType != 'CREW'"
        v-model="query.newJob"
        :options="jobs"
        style="width: 200px;margin-top: 6px;  "
        class="left"
        placeholder="请选择职位"/>
      <el-button
        v-if="currentPartyType != 'CREW'"
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="toQuery">搜索
      </el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','PARTYCHANGE_ALL','PARTYCHANGE_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增
        </el-button>
      </div>
      <!-- 导出 -->
      <!--<div style="display: inline-block;">-->
      <!--<el-button-->
      <!--v-permission="['ADMIN','PARTY_ALL','PARTY_SELECT']"-->
      <!--:loading="downloadLoading"-->
      <!--size="mini"-->
      <!--class="filter-item"-->
      <!--type="warning"-->
      <!--icon="el-icon-download">导出-->
      <!--</el-button>-->
      <!--</div>-->
      <!--<div style="display: inline-block;">-->
      <!--<el-upload-->
      <!--:on-preview="handlePreview"-->
      <!--:on-remove="handleRemove"-->
      <!--:before-remove="beforeRemove"-->
      <!--:limit="3"-->
      <!--:on-exceed="handleExceed"-->
      <!--:http-request="uploadFile"-->
      <!--class="upload-demo"-->
      <!--action=""-->
      <!--multiple>-->
      <!--<el-button-->
      <!--v-permission="['ADMIN','PARTY_ALL','PARTY_CREATE']"-->
      <!--class="filter-item"-->
      <!--size="mini"-->
      <!--type="primary">导入-->
      <!--</el-button>-->
      <!--</el-upload>-->
      <!--</div>-->
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="code" width="150" label="调令编号"/>
      <el-table-column prop="party.name" label="船员姓名"/>
      <el-table-column prop="changeDate" label="生效时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.changeDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="formerOrganization.name" label="原船舶"/>
      <el-table-column prop="formerJob.name" label="原职务"/>
      <el-table-column prop="newOrganization.name" label="现船舶"/>
      <el-table-column prop="newJob.name" label="现职务"/>
      <el-table-column prop="partyChangeType.partyChangeTypeName" label="调动类型"/>
      <el-table-column prop="auditStatus" label="状态"/>
      <el-table-column prop="commnets" label="备注"/>
      <el-table-column v-if="!loading" label="操作" width="250px" align="center">
        <template slot-scope="scope">
          <el-button
            v-permission="['ADMIN','PARTYCHANGE_ALL','PARTYCHANGE_EDIT']"
            v-if="(scope.row.auditStatus==='驳回' || scope.row.auditStatus==='待审批' || scope.row.auditStatus==='同意' || scope.row.auditStatus==='已确认' ) && scope.row.auditStatus!='DEL'"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="edit(scope.row)"/>
          <el-button
            v-permission="['ADMIN','PARTYCHANGE_ALL','PARTYCHANGE_DELETE']"
            v-if="scope.row.auditStatus==='待审批' && scope.row.auditStatus!='DEL'"
            class="filter-item"
            size="mini"
            type="primary"
            @click="commitEntryAudit(scope.row)">提交审核
          </el-button>
          <!--去除船长确认操作-->
          <!--<el-button-->
          <!--v-permission="['PARTYCHANGE_CONFIRM']"-->
          <!--v-if="scope.row.auditStatus==='同意' && !scope.row.s2lPartyChangeConfirm"-->
          <!--class="filter-item"-->
          <!--size="mini"-->
          <!--type="primary"-->
          <!--@click="addS2lPartyChangeConfirm(scope.row)">确认-->
          <!--</el-button>-->
          <el-button
            v-permission="['ADMIN','PARTYCHANGE_APPROVAL']"
            v-if="scope.row.auditStatus==='审批中' && currentParty.partyId === scope.row.auditBy && scope.row.auditStatus!='DEL'"
            class="filter-item"
            size="mini"
            type="primary"
            @click="audit(scope.row)">审批
          </el-button>
          <el-button
            v-permission="['ADMIN','PARTYCHANGE_ALL','PARTYCHANGE_DELETE']"
            v-if="scope.row.auditStatus==='待审批' && scope.row.auditStatus!='DEL'"
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
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import { getOrganization } from '@/api/organization'
import { getAllJob } from '@/api/job'
import initData from '@/mixins/initData'
import { del, commitChangeAudit, getPartyChange } from '@/api/partyChange'
import { getOAUserSecertMessage } from '@/api/partyEntryAudit'
import { parseTime } from '@/utils/index'
import { getCurrentUser } from '@/api/user'
import { add } from '@/api/s2lPartyChangeConfirm'
import eForm from './form'
import treeTable from '@/components/TreeTable'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: { eForm, treeTable, Treeselect },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      currentUserPartyId: '',
      newOrganization: '',
      newJob: '',
      organizations: [],
      jobs: [],
      downloadLoading: false,
      currentParty: {},
      currentPartyType: ''
    }
  },
  created() {
    document.addEventListener('visibilitychange', this.changeTab)
    this.getCurrentUser()
    this.getOrganization()
    this.getJob()
    this.$nextTick(() => {
    })
  },
  beforeDestroy() {
    document.removeEventListener('visibilitychange', this.changeTab)
  },
  methods: {
    parseTime,
    checkPermission,
    getOrganization() {
      getOrganization({ organizationType: 'SHIP_DEPT' }).then(res => {
        this.organizations = res.content
      })
    },
    getJob() {
      getAllJob({ jobType: 'SHIP' }).then(res => {
        this.jobs = res.content
      })
    },
    changeTab() {
      var _this = this
      if (document.visibilityState === 'visible') {
        _this.init()
      }
    },
    getCurrentUser() {
      getCurrentUser().then(res => {
        if (res && res.party) {
          if (res.party.partyType.partyType === 'CREW') {
            this.currentUserPartyId = res.party.partyId
            this.newOrganization = res.party.organization.organizationId
            this.currentPartyType = res.party.partyType.partyType
          }
          this.currentParty = res.party
          this.init()
        }
      })
    },
    commitEntryAudit(row) {
      // userId: userId, token: token,
      commitChangeAudit(row.partyChangeId, {
        requestid: row.partyChangeId,
        workcode: this.$store.state.user.user.partyDTO.partyId
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
    open(data) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.subDelete(data.partyChangeId)
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
    },
    beforeInit() {
      this.url = 'api/partyChange'
      let sort = 'partyChangeId,desc'
      // newOrganization: this.newOrganization
      if (this.currentPartyType === 'CREW') {
        sort = 'PARTY_CHANGE_ID,desc'
        this.params = {
          page: this.page, size: this.size, sort: sort, partyChangeType: '6,7', auditStatus: '待审批,审批中,同意,驳回,已确认',
          newOrganization: this.newOrganization, formerOrganization: this.newOrganization, newJob: this.newJob
        }
      } else {
        this.params = {
          page: this.page, size: this.size, sort: sort, partyChangeType: '6,7', auditStatus: '待审批,审批中,同意,驳回,已确认',
          newOrganization: this.query.newOrganization, newJob: this.query.newJob
        }
      }
      return true
    },
    subDelete(partyChangeId) {
      this.delLoading = true
      del(partyChangeId).then(res => {
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
        this.$refs[partyChangeId].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.editPartyChange(data)
    },
    editPartyChange(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.formerDate = data.changeDate
      _this.form = {
        party: data.party.id,
        partyChangeId: data.partyChangeId,
        createdDate: data.createdDate,
        createdBy: data.createdBy,
        lastModifiedDate: data.lastModifiedDate,
        lastModifiedBy: data.lastModifiedBy,
        partyId: data.partyId,
        changeDate: data.changeDate,
        changeBy: data.changeBy,
        commnets: data.commnets,
        partyChangeType: data.partyChangeType.partyChangeType,
        formerOrganizationName: data.formerOrganization.name,
        formerJobName: data.formerJob.name,

        auditWorkflowId: data.auditWorkflowId
      }
      if (data.newOrganization) {
        _this.form.newOrganization = data.newOrganization.id
      }
      if (data.newJob) {
        _this.form.newJob = data.newJob.id
      }
      _this.dialog = true
    },
    addS2lPartyChangeConfirm(row) {
      var data = {
        partyChangeId: row.partyChangeId
      }
      add(data).then(res => {
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    uploadFile() {
    }
  }
}
</script>

<style scoped>
  .left {
    height: 30.5px;
    line-height: 30.5px;
    display: inline-block;
    font-size: 14px;
    color: #606266;
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
