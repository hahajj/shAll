<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 部门数据 -->
      <el-col :xs="7" :sm="6" :md="4" :lg="4" :xl="4">
        <div class="head-container">
          <el-input v-model="partyName" clearable placeholder="输入部门名称搜索" prefix-icon="el-icon-search" style="width: 100%;" class="filter-item" @input="getDeptDatas"/>
        </div>
        <el-tree :data="organizations" :props="defaultProps" :expand-on-click-node="false" default-expand-all @node-click="handleNodeClick"/>
      </el-col>
      <!-- 用户数据 -->
      <el-col :xs="17" :sm="18" :md="20" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <el-input v-model="query.name" clearable placeholder="输入人员姓名搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
          <!-- 新增 -->
          <div style="display: inline-block;margin: 0px 2px;">
            <el-button
              v-permission="['ADMIN','PARTY_ALL','PARTY_CREATE']"
              class="filter-item"
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="add">新增</el-button>
          </div>
          <div style="display: inline-block;">
            <el-upload
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList"
              :http-request="uploadFile"
              class="upload-demo"
              action=""
              multiple>
              <el-button class="filter-item" size="mini" type="primary">点击上传</el-button>
            </el-upload>
          </div>
        </div>
        <!--表单组件-->
        <infoform ref="infoform"/>
        <!--表格渲染-->
        <tree-table v-loading="loading" :data="data" size="small" style="width: 100%;">
          <!-- <el-table-column prop="partyId" label="partyId"/> -->
          <el-table-column prop="name" label="姓名"/>
          <el-table-column prop="code" label="编号"/>
          <el-table-column prop="organization.name" label="部门"/>
          <el-table-column prop="partyType.partyTypeName" label="员工类型"/>
          <el-table-column prop="job.name" label="岗位"/>
          <el-table-column prop="status" label="状态"/>
          <el-table-column v-if="checkPermission(['ADMIN','PARTY_ALL','PARTY_EDIT','PARTY_DELETE'])" label="操作" width="250px" align="center">
            <template slot-scope="scope">
              <div style="display: inline-block;margin: 0px 2px;">
                <el-button v-permission="['ADMIN','PARTYTYPE_ALL','PARTYTYPE_CREATE']" class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="details(scope.row)">详情</el-button>
              </div>
            </template>
          </el-table-column>
        </tree-table>
        <!--分页组件-->
        <el-pagination
          :total="total"
          :current-page="page + 1"
          style="margin-top: 8px;"
          layout="total, prev, pager, next, sizes"
          @size-change="sizeChange"
          @current-change="pageChange"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { del } from '@/api/party'
import treeTable from '@/components/TreeTable'
import checkPermission from '@/utils/permission'
import { getOrganizationByCriteria } from '@/api/organization'
import { uploadFile } from '@/api/employ'
import initData from '@/mixins/initData'
import { parseTime } from '@/utils/index'
import eForm from './form'
import infoform from './formInf'
import { getPartyInfoByPartyId, getPartyEntryByPartyId } from '@/api/employ'
export default {
  components: { eForm, infoform, treeTable },
  mixins: [initData],
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + 'px;',
      dialogVisible: false,
      delLoading: false,
      partyName: '',
      organizations: [],
      fileList: [],
      partyId: null,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      isAdd: false,
      isDetails: false,
      jobs: {},
      organization: {},
      partyContents: {},
      organizationId: '',
      formLabelWidth: '120px'
    }
  },
  created() {
    this.getDeptDatas()
    this.$nextTick(() => {
      this.init()
    })
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/party'
      const sort = 'partyId,desc'
      const query = this.query
      const jobId = query.jobId
      const name = query.name
      const organization = query.organization
      const organizationId = this.organizationId
      this.params = { page: this.page, size: this.size, sort: sort, partyId: this.partyId, partyType: 'CREW' }
      // if (organizationId) { this.params['organizationId'] = organizationId }
      if (organization) { this.params['organization'] = organization }
      if (organizationId) { this.params['organizationId'] = organizationId }
      if (jobId) { this.params['jobId'] = query.jobId }
      if (name) { this.params['name'] = name }
      return true
    },
    changExpand() {
      this.expand = !this.expand
      this.init()
    },
    subDelete(partyId) {
      this.delLoading = true
      del(partyId).then(res => {
        this.delLoading = false
        this.$refs[partyId].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[partyId].doClose()
        console.log(err.response.data.message)
      })
    },
    // 部门数据点击事件
    getDeptDatas() {
      getOrganizationByCriteria({ 'organizationType': 'SHIP_DEPT' }).then(res => {
        this.organizations = res
      })
    },
    handleNodeClick(data) {
      if (data.id === 0) {
        this.organizationId = null
      } else {
        this.organizationId = data.id
      }
      this.init()
    },
    // 新增
    add() {
      this.isAdd = true
      // this.$refs.form.getOrganization()
      this.$refs.form.dialog = true
    },
    // formInf数据绑定
    details(data) {
      this.isDetails = true
      const _this = this.$refs.infoform
      _this.dialog = true
      _this.party = data
      _this.parentData = data
      _this.form = {
        name: data.name,
        partyId: data.partyId,
        code: data.code,
        organization: data.organization.name,
        job: data.job.name,
        entryStatus: data.status
      }
      getPartyInfoByPartyId(data.partyId).then(res => {
        if (res && res.length !== 0) {
          _this.formInfo = res[0]
          console.log('Info返回值不为空')
        } else {
          console.log('Info返回值为空')
        }
      })
      getPartyEntryByPartyId(data.partyId).then(res => {
        if (res && res.length !== 0) {
          _this.formEn = res[0]
          console.log('Entry返回值不为空')
        } else {
          console.log('Entry返回值为空')
        }
      })
      // getContentsByPartyId(data.partyId).then(res => {
      //   _this.partyContents = res
      // })
    },
    // 编辑
    edit(data) {
      this.isAdd = false
      // this.isDetails = false
      const _this = this.$refs.form
      _this.form = {
        name: data.name,
        code: data.code,
        partyId: data.partyId,
        organization: data.organization,
        partyType: data.partyType,
        job: data.job,
        status: data.status
      }
      _this.dialog = true
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
    uploadFile(params) {
      console.log(params)
      uploadFile(params.file)
    }
  }
}
</script>

<style scoped>

</style>
