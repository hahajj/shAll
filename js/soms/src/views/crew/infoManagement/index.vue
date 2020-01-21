<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 部门数据 -->
      <el-col :xs="7" :sm="6" :md="4" :lg="4" :xl="4">
        <div class="head-container">
          <el-input
            v-model="partyName"
            clearable
            placeholder="输入部门名称搜索"
            prefix-icon="el-icon-search"
            style="width: 100%;"
            class="filter-item"
            @input="getDeptDatas"/>
        </div>
        <el-tree
          :data="partys"
          :props="defaultProps"
          :expand-on-click-node="false"
          default-expand-all
          @node-click="handleNodeClick"/>
      </el-col>
      <!-- 用户数据 -->
      <el-col :xs="17" :sm="18" :md="20" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <el-input
            v-model="query.jobName"
            clearable
            placeholder="输入岗位名称搜索"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="toQuery"/>
          <el-input
            v-model="query.name"
            clearable
            placeholder="输入人员姓名搜索"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="toQuery"/>
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索
          </el-button>
          <!-- 新增 -->
          <div style="display: inline-block;margin: 0px 2px;">
            <el-button
              v-permission="['ADMIN','PARTY_ALL','PARTY_CREATE']"
              class="filter-item"
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="add">新增
            </el-button>
          </div>
          <!--模版下载-->
          <div style="display: inline-block;">
            <el-button
              :loading="downloadLoading"
              size="mini"
              class="filter-item"
              type="warning"
              icon="el-icon-download"
              @click="downloadTemplate">模版下载
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
          <div style="display: inline-block;">
            <div style="display: none">
              <el-upload
                ref="upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :on-change="handleAvatarSuccess"
                :limit="3"
                :on-exceed="handleExceed"
                :file-list="fileList"
                :http-request="uploadFile"
                :auto-upload="false"
                :show-file-list="false"
                class="upload-demo"
                action=""
                multiple/>
            </div>
            <el-dropdown size="mini" @command="handleCommand">
              <el-button type="primary" size="mini">
                导入操作<i class="el-icon-arrow-down el-icon--right"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="people" class="avatar">导入船员基本信息</el-dropdown-item>
                <el-dropdown-item command="safe" class="avatarn">导入船员海历</el-dropdown-item>
                <el-dropdown-item command="crew_cer" class="avatar">导入船员证书</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!--模版下载-->
            <div style="display: inline-block;">
              <el-button
                :loading="downloadLoading"
                size="mini"
                class="filter-item"
                type="warning"
                icon="el-icon-download"
                @click="downloadExcel">模版下载
              </el-button>
            </div>
          </div>
        </div>
        <!--表单组件-->
        <eForm ref="form" :is-add="isAdd"/>
        <oForm ref="formDetails" :is-details="isDetails"/>
        <!--表格渲染-->
        <el-table
          v-loading="loading"
          ref="singleTable"
          :data="data"
          size="small"
          style="width: 100%;"
          highlight-current-row
          @current-change="handleCurrentChange"
          @sort-change="sortChange">
          <!-- <el-table-column prop="partyId" label="partyId"/> -->
          <el-table-column type="index" label="序号"/>
          <el-table-column prop="name" label="姓名"/>
          <el-table-column prop="code" label="编号"/>
          <el-table-column prop="organization.name" label="部门"/>
          <!-- <el-table-column prop="partyType.partyTypeName" label="员工类型"/> -->
          <el-table-column prop="job.name" label="岗位"/>
          <el-table-column prop="status" label="状态"/>
          <el-table-column prop="createdDate" label="创建时间" sortable="custom">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createdDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="lastModifiedDate" label="最后修改时间" sortable="custom">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.lastModifiedDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkPermission(['ADMIN','PARTY_ALL','PARTY_EDIT','PARTY_DELETE'])"
            label="操作"
            width="250px"
            align="center">
            <template slot-scope="scope">
              <!-- 修改编辑按钮 -->
              <el-button
                v-permission="['ADMIN','PARTY_ALL','PARTY_EDIT']"
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="edit(scope.row)"/>
              <div style="display: inline-block;margin: 0px 2px;">
                <el-button
                  v-permission="['ADMIN','PARTY_ALL','PARTY_CREATE']"
                  class="filter-item"
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="details(scope.row)">详情
                </el-button>
              </div>
              <!-- 删除按钮 -->
              <el-button
                v-permission="['ADMIN','PARTY_ALL','PARTY_DELETE']"
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
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { del, exportCrew} from '@/api/party'
import { downloadExcel } from '@/api/systemDoc'
import treeTable from '@/components/TreeTable'
import checkPermission from '@/utils/permission'
import { getOrganization } from '@/api/organization'
import { downloadFile, uploadFileUrl } from '@/api/employ'
import initData from '@/mixins/initData'
import { parseTime, downloadFiles } from '@/utils/index'
import eForm from './form'
import oForm from './formDetails'

export default {
  components: { eForm, oForm, treeTable },
  mixins: [initData],
  data() {
    return {
      sort: 'partyId,desc',
      downloadSort: 'organizationId,desc',
      height: document.documentElement.clientHeight - 180 + 'px;',
      dialogVisible: false,
      delLoading: false,
      downloadLoading: false,
      partyName: '',
      url: '',
      partys: [],
      partyQueryCriteria: {
        'organizationId': null,
        'jobId': null,
        'name': null,
        'partyType': null
      },
      party: {},
      fileList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      isAdd: false,
      isDetails: false,
      jobs: {},
      organization: {},
      organizations: {},
      partyContents: {},
      organizationId: null,
      formLabelWidth: '120px',
      currentRow: ''
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
    open(data) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.subDelete(data.id)
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
    },
    beforeInit() {
      this.url = 'api/party'
      const sort = this.sort
      const query = this.query
      const jobId = query.jobId
      const name = query.name
      const jobName = query.jobName
      const organization = query.organization
      const organizationId = query.organizationId
      this.params = {
        page: this.page,
        size: this.size,
        sort: sort,
        organizationId: this.organizationId,
        partyType: 'CREW',
        statusSet: '在职,实习,试用,劝退离职,主动离职,在船,下船'
      }
      if (organization) {
        this.params['organization'] = organization
      }
      if (organizationId) {
        this.params['organizationId'] = query.organizationId
      }
      if (jobId) {
        this.params['jobId'] = query.jobId
      }
      if (name) {
        this.params['name'] = name
      }
      if (jobName) {
        this.params['jobName'] = jobName
      }
      return true
    },
    sortChange(column, prop, order) {
      if (column.prop == null || column.order == null) {
        this.queryData.prop = ''
        this.queryData.order = ''
      } else {
        if (column.order === 'ascending') {
          this.sort = column.prop + ',asc'
        } else {
          this.sort = column.prop + ',desc'
        }
      }
      this.init()
    },
    handleCommand(command) {
      document.getElementsByClassName('el-upload__input')[0].click()
      console.log(arguments)
      if (command === 'people') {
        console.log('people')
        this.url = 'file/file'
      } else if (command === 'safe') {
        console.log('safe')
        this.url = 'api/importCrewCalendar'
      } else if (command === 'crew_cer') {
        console.log('crew_cer')
        this.url = 'api/importCrewCertificate'
      }
    },
    handleAvatarSuccess(file, fileList) {
      // console.log(file,"wo shi wenjian")
      // if (this.fileList > 0) {
      //   console.log("wo shi wenjian")
      // }
      if (file) {
        this.$refs.upload.submit()
      }
    },
    changExpand() {
      this.expand = !this.expand
      this.init()
    },
    subDelete(partyId) {
      this.delLoading = true
      del(partyId).then(res => {
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
        this.$refs[partyId].doClose()
        console.log(err.response.data.message)
      })
    },
    // 部门数据点击事件
    getDeptDatas() {
      const sort = 'organizationId,desc'
      this.params = { sort: sort, page: 0, size: 9999, 'organizationType': 'SHIP_DEPT' }
      if (this.partyName) {
        this.params['name'] = this.partyName
      }
      getOrganization(this.params).then(res => {
        this.partys = res.content
      })
    },
    handleNodeClick(data) {
      if (data.id === 0) {
        this.organizationId = null
      } else {
        this.organizationId = data.id
      }
      this.organizationId = data.id
      this.init()
    },
    // 新增
    add() {
      this.isAdd = true
      this.$refs.form.parent = this
      // this.$refs.form.getOrganization()
      this.$refs.form.dialog = true
    },
    // 导出
    download() {
      if (this.currentRow && this.currentRow.partyId) {
        this.downloadLoading = true
        exportCrew(this.currentRow.partyId).then((data) => {
          this.downloadLoading = false
          downloadFiles(data, '盛航SQR-CD001 船员登记表.XLS')
          this.$notify({
            title: '导出成功',
            type: 'success',
            duration: 2500
          })
        })

      } else {
        this.$message.error(`请选择一行数据进行导出`)
      }
      // if(this.query.name)
      //   this.partyQueryCriteria.name = this.query.name
      // if(this.organizationId)
      //   this.partyQueryCriteria.organizationId = this.organizationId
      // let exceldata = []
      // this.partyQueryCriteria = this.query
      // this.partyQueryCriteria.sort = this.downloadSort
      // this.partyQueryCriteria.partyType = 'CREW'
      // this.partyQueryCriteria.statusSet = ['在职', '实习', '试用', '劝退离职', '主动离职', '下船', '在船']
      // downloadFile(this.partyQueryCriteria).then(res => {
      //   exceldata = res
      //   this.downloadLoading = true
      //     import('@/utils/export2Excel').then(excel => {
      //       const tHeader = ['序号', '姓名', '编号', '部门', '职务', '状态', '身份证号', '性别', '年龄', '出生日期', '籍贯', '生肖', '民族', '曾用名', '政治面貌', '联系电话', '身高', '体重', '血型', '学历',
      //         '职业资格', '证书编号', '毕业院校', '毕业专业', '家庭住址', '实际居住地', '入职类型', '社保账号', '公积金账号', '银行类型', '银行卡号',
      //         '入职日期', '试用期月数', '转正日期', '离职日期', '合同到期时间', '合同到期时间提醒', '首份合同开始时间', '最近合同开始时间', '工龄信息', '生日提醒', '公司邮箱地址', '公司集团号码', '紧急联系人', '紧急联系人电话', '备注']
      //       const filterVal = ['index', 'name', 'code', 'organization', 'job', 'status', 'idNumber', 'sex', 'age', 'birthday', 'nativePlace', 'animalZodiac', 'nation', 'usedName', 'politicalStatus', 'contactMech', 'stature', 'weight', 'bloodType', 'education',
      //         'vocationalQualification', 'vocationalQualificationNo', 'school', 'major', 'homeAddress', 'residence', 'partyEntryType', 'socialSecurityAccount', 'providentFundAccount', 'bankType', 'bankAccount',
      //         'entryDate', 'probationMonth', 'ConversionDate', 'departureDate', 'contractExpirationDate', 'contractRemind', 'firstContractStartDate', 'contractStartDate', 'serviceLength', 'birthdayRemind', 'companyEmail', 'companyGroupPhone', 'emergencyContact', 'emergencyContactPhone', 'comments']
      //       // const data = this.formatJson(filterVal, this.data)
      //       // const list = this.data
      //       const data = this.formatJson(filterVal, exceldata)
      //       excel.export_json_to_excel({
      //         header: tHeader,
      //         data,
      //         filename: '船员人员信息'
      //       })
      //       this.downloadLoading = false
      //     })
      // })
    },
    // 模版下载
    downloadTemplate() {
      window.location.href = '/static/template/船员信息属性.xlsx'
    },
    // excel下载
    downloadExcel() {
      downloadExcel().then(data => {
        downloadFiles(data, '111')
      })
    },
    // 数据转换
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createTime' || j === 'lastPasswordResetTime') {
          return parseTime(v[j])
        } else if (j === 'enabled') {
          return parseTime(v[j]) ? '启用' : '禁用'
        } else {
          return v[j]
        }
      }))
    },
    // formInf数据绑定
    details(data) {
      this.isDetails = true
      const _this = this.$refs.formDetails
      _this.dialog = true
      _this.party = data
      // 部门
      // _this.organization = data.organization
      // _this.job = data.job
      _this.parentData = data
      // 解决由于加载慢造成的前后数据不一样
      _this.oldFormInfo = JSON.stringify(_this.formInfo)
      _this.oldFormEn = JSON.stringify(_this.formEn)
      _this.oldFormEnInit = 1
      if (_this.probationMonth) {
        _this.oldProbationMonth = _this.probationMonth
      } else {
        _this.oldProbationMonth = 0
      }
      _this.reloadForm()
    },
    // 编辑
    edit(data) {
      this.isAdd = false
      // this.isDetails = false
      const _this = this.$refs.form
      // _this.getOrganization()
      _this.form = {
        name: data.name,
        code: data.code,
        partyId: data.partyId,
        organization: data.organization.organizationId,
        partyType: data.partyType,
        status: data.status

      }
      if (data.job) {
        _this.form.job = data.job.jobId
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
    // uploadFile(params) {
    //   try {
    //     uploadFileUrl(params.file, 'file/file', 'CREW').then(() => {
    //       this.$notify({
    //         title: '上传成功',
    //         type: 'success',
    //         duration: 2500
    //       })
    //     })
    //   } catch (e) {
    //     this.$notify({
    //       title: '上传失败',
    //       type: 'error',
    //       duration: 2500
    //     })
    //   }
    // },
    uploadFile(params) {
      this.fileList = []
      try {
        uploadFileUrl(params.file, this.url, 'CREW').then(() => {
          this.$notify({
            title: '上传成功',
            type: 'success',
            duration: 2500
          })
        })
      } catch (e) {
        this.$notify({
          title: '上传失败',
          type: 'error',
          duration: 2500
        })
      }
    },
    handleCurrentChange(val) {
      this.currentRow = val
    }
  }
}
</script>

<style>
  .is-current {
    color: red;
  }

  .el-dropdown {
    top: -4px;
  }

  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
