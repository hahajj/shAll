<template>
  <div class="app-container">
    <el-input v-model="searchFile" placeholder="请输入文件名" style="width: 270px"></el-input>
    <el-row :gutter="20" style="margin: 20px">
      <!-- 部门数据 -->
      <el-col :xs="7" :sm="6" :md="4" :lg="4" :xl="4">
        <el-tree
          :data="data"
          :default-expanded-keys="newData"
          :props="defaultProps"
          :expand-on-click-node="false"
          node-key="url"
          @node-click="handleNodeClick"/>
      </el-col>
      <!-- 用户数据 -->
      <el-col :xs="17" :sm="18" :md="20" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <!--模版下载-->
        </div>
        <!--表单组件-->
        <!--表格渲染-->
        <el-table v-loading="loading" :data="tableData" size="small" style="width: 100%;">
          <!-- <el-table-column prop="partyId" label="partyId"/> -->
          <el-table-column type="index" label="序号" width="250px"/>
          <el-table-column prop="fileName" label="文件名称" width="250px"/>
          <el-table-column prop="createdTime" label="创建日期" width="250px">
            <template slot-scope="scope">
              {{ parseTime(scope.row.createdTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="lastModifiedDate" label="操作">
            <template slot-scope="scope">
              <div style="display: inline-block;">
                <el-button
                  v-permission="['ADMIN','SYSTEMDOCUMENT_SELECT','SYSTEMDOCUMENT_ALL']"
                  :loading="downloadLoading"
                  size="mini"
                  class="filter-item"
                  type="warning"
                  icon="el-icon-download"
                  @click="downloadTemplate(scope.row.url,scope.row.fileName)">下载
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <!--<el-pagination-->
        <!--:total="total"-->
        <!--:current-page="page + 1"-->
        <!--style="margin-top: 8px;"-->
        <!--layout="total, prev, pager, next, sizes"-->
        <!--@size-change="sizeChange"-->
        <!--@current-change="pageChange"/>-->
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getAllCircular, downloadCircular } from '@/api/systemDoc'
import checkPermission from '@/utils/permission'
import { uploadFile } from '@/api/employ'
import initData from './initData'
import { parseTime, downloadFiles } from '@/utils/index'

export default {
  mixins: [initData],
  data() {
    return {
      tableData: [],
      newTableData: [],
      newData: [],
      searchFile: '',
      sort: '',
      height: document.documentElement.clientHeight - 180 + 'px;',
      dialogVisible: false,
      delLoading: false,
      downloadLoading: false,
      partyName: '',
      partys: [],
      partyQueryCriteria: {
        'organizationId': '',
        'jobId': '',
        'name': ''
      },
      party: {},
      fileList: [],
      defaultProps: {
        children: 'children',
        label: 'fileName',
        disabled: 'isDirectory'
        // label: (data, node) => {
        //   if(data.isDirectory){
        //     return data.fileName
        //   }
        //
        // }
      },
      isAdd: false,
      isDetails: false,
      jobs: {},
      organization: {},
      organizations: {},
      partyContents: {},
      organizationId: null,
      formLabelWidth: '120px'
    }
  },
  watch: {
    searchFile() {
      this.tableData = this.newTableData.filter(v => {
        return v.fileName.indexOf(this.searchFile) !== -1
      })
    }
  },
  created() {
    // this.getAllCircularData()
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
      this.url = 'api/systemDocument'
      const sort = this.sort
      const query = this.query
      const organizationId = query.organizationId
      this.params = { page: this.page, size: this.size, sort: sort, organizationId: this.organizationId }

      if (organizationId) {
        this.params['organizationId'] = query.organizationId
      }
      return true
    },
    getAllCircularData() {
      const sort = 'fileName,desc'
      this.params = { sort: sort, page: 0, size: 9999 }
      if (this.partyName) {
        this.params['name'] = this.partyName
      }
      getAllCircular(this.params).then(res => {
        this.partys = res
        console.log(res.content)
      })
    },
    handleNodeClick(data) {
      this.tableData = []
      this.addLabel(data)
      this.total = this.tableData.length
    },
    // filterNode(value, data) {
    //   console.log(value)
    //   if (!value) return true
    //   return data.nodeName.indexOf(value) !== -1
    // },
    addLabel(data) {
      // instanceof
      if (!Array.isArray(data)) {
        if (data.children) {
          data = data.children
        } else if (!data.isDirectory) {
          this.tableData.push(data)
          this.newTableData.push(data)
          return false
        } else {
          return false
        }
      }
      data.filter(files => {
        if (files.children && files.children.length) {
          this.addLabel(files.children)
        } else if (!files.isDirectory) {
          this.tableData.push(files)
          this.newTableData.push(files)
        }
        return true
      })
    },
    // 新增
    add() {
      this.isAdd = true
      this.$refs.form.parent = this
      // this.$refs.form.getOrganization()
      this.$refs.form.dialog = true
    },
    // 模版下载
    downloadTemplate(fileUrl, fileName) {
      const pra = { url: fileUrl }
      downloadCircular(pra).then(data => {
        downloadFiles(data, fileName)
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
    uploadFile(params) {
      console.log(params)
      uploadFile(params.file)
    }
  }
}
</script>

<style>
  .is-current {
    color: red;
  }
</style>
