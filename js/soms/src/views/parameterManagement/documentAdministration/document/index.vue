<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container" style="text-align: center; overflow: hidden">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;float: left">
        <el-button
          v-permission="['ADMIN','DOCUMENT_ALL','DOCUMENT_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
        <el-input v-model="query.name" clearable placeholder="输入题名进行搜索" style="width: 200px;margin-left: 10px" class="filter-item" @keyup.enter.native="toQuery"/>
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" style="margin-left: 10px" @click="toQuery" >搜索</el-button>
      </div>
      <span style="font-size: 20px;position: absolute; left: 0;right: 0;margin: auto;width: 200px;">案卷信息</span>
      <div style="display: inline-block;margin: 0px 2px;float: right">
        <!--模版下载-->
        <div style="display: inline-block;">
          <el-button
            size="mini"
            class="filter-item"
            type="warning"
            icon="el-icon-download"
            @click="downloadTemplate">模版下载</el-button>
        </div>
        <div style="display: inline-block;" class="upLoadFile_demo">
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
          >
            <el-button
              v-permission="['ADMIN','DOCUMENT_ALL','DOCUMENT_CREATE']"
              class="filter-item"
              size="mini"
              type="primary">导入</el-button>
          </el-upload>
        </div>
        <!-- 导出 -->
        <el-button
          v-permission="['ADMIN','DOCUMENT_ALL','DOCUMENT_SELECT']"
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="download">导出
        </el-button>
        <!--打印-->
        <el-button
          v-permission="['ADMIN','DOCUMENT_ALL','DOCUMENT_SELECT']"
          :loading="printLoading"
          size="mini"
          class="filter-item"
          type="primary"
          style="margin: 0 4px; float: right;"
          @click="printDemo">打印
        </el-button>
      </div>
    </div>
    <el-row :gutter="20">
      <el-col :xs="7" :sm="6" :md="4" :lg="4" :xl="4">
        <el-tree :data="documentClassData" :props="defaultProps" @node-click="handleNodeClick"/>
      </el-col>
      <el-col :xs="17" :sm="18" :md="20" :lg="20" :xl="20">
        <eForm ref="form" :is-add="isAdd"/>
        <!--<dPlay ref="dPlay" />-->
        <!--表格渲染-->
        <el-table v-loading="loading" id="singleTableDoc" ref="singleTable" :data="data" size="small" style="width: 100%;" highlight-current-row stripe @sort-change="sortChange" @row-click="clickRow">
          <el-table-column prop="code" label="档案号"/>
          <el-table-column prop="preservationPeriod" label="保管期限"/>
          <el-table-column prop="name" label="题名"/>
          <el-table-column prop="fromDate" label="开始日期" sortable="custom">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.fromDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="thurDate" label="结束日期" sortable="custom">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.thurDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="classNumber" label="分类号"/>
          <el-table-column prop="docCreator" label="立卷人"/>
          <el-table-column prop="contentType" label="载体类型"/>
          <el-table-column prop="year" label="年度"/>
          <el-table-column prop="comments" label="备注"/>
          <el-table-column prop="docCreatedDate" label="立卷时间" sortable="custom">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.docCreatedDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="checkPermission(['ADMIN','DOCUMENT_ALL','DOCUMENT_EDIT','DOCUMENT_DELETE'])" label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <el-button v-permission="['ADMIN','DOCUMENT_ALL','DOCUMENT_EDIT']" size="mini" type="primary" @click="edit(scope.row)">详情</el-button>
              <el-button v-permission="['ADMIN','DOCUMENT_ALL','DOCUMENT_DELETE']" slot="reference" type="danger" icon="el-icon-delete" size="mini" @click="open(scope.row)"/>
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
    <!--打印组件-->
    <print ref="print"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, get } from '@/api/document'
import { parseTime, formatJson } from '@/utils/index'
import { eventBus } from '@/main'
import { uploadFileUrl } from '@/api/employ'
import eForm from './form'
import print from './print'
import { getTree } from '@/api/documentClass'
// import dPlay from './VueDPlayerHls'

export default {
  components: { eForm, print },
  mixins: [initData],
  data() {
    return {
      sort: ' ', // 默认排序documentId,desc
      delLoading: false,
      downloadLoading: false,
      printLoading: false,
      fileList: [],
      documentClassData: [],
      defaultProps: {
        children: 'children',
        label: 'documentClassName'
      },
      documentClassId: ''
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
      this.getDocumentClassData()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    formatJson,
    getDocumentClassData() {
      getTree({ page: 0, size: 9999 }).then(res => {
        this.documentClassData = res.content
      })
    },
    handleNodeClick(data) {
      const ID = []
      if (data) {
        if (data.children) {
          data.children.map(v => {
            return ID.push(v.documentClassId)
          })
          this.documentClassId = ID.join(',')
        } else {
          this.documentClassId = data.documentClassId
        }
      } else {
        this.documentClassId = ''
      }
      this.init()
    },
    open(data) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.subDelete(data.documentId)
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
    },
    // 模版下载
    downloadTemplate() {
      if (process.env.NODE_ENV === 'production') {
        const url = window.location.href
        if (url.includes('/ssms/')) {
          window.location.href = '/ssms/static/template/档案管理导入模板.xlsx'
        } else if (url.includes('soms')) {
          window.location.href = '/soms/static/template/档案管理导入模板.xlsx'
        } else {
          window.location.href = '/static/template/档案管理导入模板.xlsx'
        }
      } else {
        console.log(window.location.href)
        window.location.href = '/static/template/档案管理导入模板.xlsx'
      }
    },
    // 导出
    download() {
      let exceldata = []
      this.downloadLoading = true
      get({ page: 0, size: 9999 }).then(res => {
        exceldata = res.content
        import('@/utils/export2Excel').then(excel => {
          // const tHeader = ['档案号', '保管期限', '题名', '开始日期', '结束日期', '分类号', '载体类型', '年度', '立卷人', '立卷单位', '备注']
          const tHeader = ['档案号', '案卷目录号', '保管期限', '归档单位', '题名', '起始日期', '结束日期', '分类号', '页数', '份数', '立卷人', '密级', '载体类型', '案卷顺序号', '年度', '全宗名称', '归档日期', '存放地点', '备注', '主题词', '立卷时间', '立卷单位']
          const filterVal = ['code', 'catalogNumber', 'preservationPeriod', 'filingOrganization', 'name', 'fromDate', 'thurDate', 'classNumber', 'pages', 'copies', 'docCreator', 'securityLevel', 'contentType', 'no', 'year', 'fullName', 'filingDate', 'location', 'comments', 'heading', 'docCreatedDate', 'docCreatedOrg']
          const data = this.formatJson(filterVal, exceldata)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '案卷信息'
          })
          this.downloadLoading = false
        })
      })
    },
    // 打印
    printDemo() {
      this.$refs.print.$refs.easyPrint.print()
    },
    clickRow(row) {
      this.$parent.$data.isHidden = true
      this.$refs.singleTable.setCurrentRow(row)
      this.$refs.print.setData(row)
      this.$nextTick(() => {
        eventBus.$emit('row', row)
      })
    },
    beforeInit() {
      this.url = 'api/document'
      const sort = this.sort
      this.params = { page: this.page, size: this.size, sort: sort }
      if (this.query.name) {
        this.params['name'] = this.query.name
      }
      if (this.documentClassId) {
        this.params['documentClassIdSet'] = this.documentClassId
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
    subDelete(documentId) {
      this.delLoading = true
      del(documentId).then(res => {
        this.delLoading = false
        this.$parent.$data.isHidden = false
        // this.$refs[documentId].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[documentId].doClose()
        console.log(err.response.data.message)
      })
    },
    add(data) {
      const _this = this.$refs.form
      this.isAdd = true
      _this.dialog = true
      _this.form.pages = 0
      _this.form.copies = 0
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        documentId: data.documentId,
        documentClassId: data.documentClassId,
        comments: data.comments,
        createdBy: data.createdBy,
        // lastModifiedDate: data.lastModifiedDate,
        lastModifiedBy: data.lastModifiedBy,
        code: data.code,
        name: data.name,
        preservationPeriod: data.preservationPeriod,
        fromDate: data.fromDate,
        thurDate: data.thurDate,
        year: data.year,
        docCreator: data.docCreator,
        docCreatedOrg: data.docCreatedOrg,
        docCreatedDate: data.docCreatedDate,
        contentType: data.contentType,
        copies: data.copies,
        pages: data.pages,
        no: data.no,
        documentClass: { documentClassId: '' },
        documentClassID: data.documentClass.documentClassId,
        catalogNumber: data.catalogNumber,
        filingOrganization: data.filingOrganization,
        classNumber: data.classNumber,
        securityLevel: data.securityLevel,
        fullName: data.fullName,
        filingDate: data.filingDate,
        heading: data.heading,
        location: data.location,
        status: data.status
      }
      if (data.documentClass.parentClass) {
        _this.form.firstcode = data.documentClass.parentClass.documentClassId
        _this.form.documentClassID = data.documentClass.documentClassName
        _this.form.documentClass.documentClassId = data.documentClass.documentClassId
      } else {
        _this.form.firstcode = data.documentClass.documentClassId
        _this.form.documentClassID = null
        _this.form.documentClass.documentClassId = data.documentClass.documentClassId
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
      try {
        uploadFileUrl(params.file, 'api/documentExcel').then(() => {
          this.init()
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
<style>
  .is-current {
    color: red;
  }
</style>
