<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container" style="text-align: center;">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;float: left">
        <el-button
          v-permission="['ADMIN','DOCUMENT_ALL','DOCUMENT_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
      <span style="font-size: 20px;position: absolute; left: 0;right: 0;margin: auto;width: 200px;">案卷信息</span>

      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;float: right">
        <!--模版下载-->
        <div style="display: inline-block;">
          <el-button
            :loading="downloadLoading"
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
          v-permission="['ADMIN','DOCUMENT_ALL','DOCUMENT_CREATE']"
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
    <el-table v-loading="loading" id="singleTableDoc" ref="singleTable" :data="data" size="small" style="width: 100%;" highlight-current-row stripe @sort-change="sortChange" @row-click="clickRow">
      <el-table-column prop="code" label="档案号"/>
      <!--<el-table-column prop="catalogNumber" label="案卷目录号"/>-->
      <el-table-column prop="preservationPeriod" label="保管期限"/>
      <!--<el-table-column prop="filingOrganization" label="归档单位"/>-->
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
      <!--<el-table-column prop="pages" label="页数"/>-->
      <!--<el-table-column prop="copies" label="份数"/>-->
      <el-table-column prop="docCreator" label="立卷人"/>
      <!--<el-table-column prop="securityLevel" label="密级"/>-->
      <el-table-column prop="contentType" label="载体类型"/>
      <!--<el-table-column prop="no" label="案卷序号"/>-->
      <el-table-column prop="year" label="年度"/>
      <!--<el-table-column prop="fullName" label="全宗名称"/>-->
      <!--<el-table-column prop="filingDate" label="归档日期" sortable="custom">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{ parseTime(scope.row.filingDate) }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="location" label="存放地点"/>-->
      <el-table-column prop="comments" label="备注"/>
      <!--<el-table-column prop="heading" label="主题词"/>-->
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
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, get } from '@/api/document'
import { parseTime, formatJson, parseTimeNoMin } from '@/utils/index'
import { eventBus } from '@/main'
import { uploadFileUrl } from '@/api/employ'
import eForm from './form'
// import dPlay from './VueDPlayerHls'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      sort: ' ', // 默认排序documentId,desc
      delLoading: false,
      downloadLoading: false,
      fileList: []
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
    formatJson,
    // 模版下载
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
    downloadTemplate() {
      window.location.href = '/static/template/档案管理导入模板.xlsx'
    },
    // 导出
    download() {
      let exceldata = []
      get({ organization: this.params.organization }).then(res => {
        exceldata = res.content
        this.downloadLoading = true
        import('@/utils/export2Excel').then(excel => {
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
    clickRow(row) {
      this.$refs.singleTable.setCurrentRow(row)
    },
    beforeInit() {
      this.url = 'api/document'
      const sort = this.sort
      this.params = { page: this.page, size: this.size, sort: sort }
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
        this.$refs[documentId].doClose()
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
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
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
        fromDate: new Date(data.fromDate),
        thurDate: new Date(data.thurDate),
        year: data.year,
        docCreator: data.docCreator,
        docCreatedOrg: data.docCreatedOrg,
        docCreatedDate: new Date(data.docCreatedDate),
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
        filingDate: new Date(data.filingDate),
        heading: data.heading,
        location: data.location
      }
      if (data.documentClass.parentClass) {
        _this.form.firstcode = data.documentClass.parentClass.documentClassId
        _this.form.documentClassID = data.documentClass.documentClassId
        _this.form.documentClass.documentClassId = data.documentClass.documentClassId
      } else {
        _this.form.firstcode = data.documentClass.documentClassId
        _this.form.documentClassID = null
        _this.form.documentClass.documentClassId = data.documentClass.documentClassId
      }
      console.log(_this.form.createdDate)
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
