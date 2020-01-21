<template>
  <div class="app-container">
    <hr>
    <!--工具栏-->
    <div class="head-container" style="text-align: center; margin: 60px 0 0 0">
      <!-- 新增 -->
      <div v-if="documentId" style="display: inline-block;margin: 0px 2px;float: left">
        <el-button
          v-permission="['ADMIN','DOCUMENT_ALL','DOCUMENT_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
      <span style="font-size: 20px;position: absolute; left: 0;right: 0;margin: auto;max-width: 600px"><span v-if="message.name"><<span style="font-size: 16px;color: #1890ff;"> {{ message.name }}</span>></span>卷内信息</span>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;float: right;position: relative;">
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
          v-permission="['ADMIN','PARTY_ALL','PARTY_CREATE']"
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="download()">导出
        </el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;" @sort-change="sortChange">
      <el-table-column prop="code" label="档案号"/>
      <el-table-column prop="copies" label="份数"/>
      <el-table-column prop="pages" label="页数"/>
      <el-table-column prop="name" label="题名"/>
      <el-table-column prop="classificationCode" label="分类号"/>
      <el-table-column prop="contentType" label="载体类型"/>
      <el-table-column prop="no" label="卷内序号"/>
      <el-table-column prop="year" label="年度"/>
      <el-table-column prop="comments" label="备注"/>
      <el-table-column v-if="checkPermission(['ADMIN','DOCUMENT_ALL','DOCUMENT_EDIT','DOCUMENT_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','DOCUMENTDETAIL_ALL','DOCUMENTDETAIL_EDIT']" size="mini" type="primary" @click="edit(scope.row)">详情</el-button>
          <el-button v-permission="['ADMIN','DOCUMENTDETAIL_ALL','DOCUMENTDETAIL_DELETE']" slot="reference" type="danger" icon="el-icon-delete" size="mini" @click="open(scope.row)"/>
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
import { del, get } from '@/api/documentDetail'
import { parseTime, formatJson } from '@/utils/index'
import eForm from './form'
import { eventBus } from '@/main'
import { uploadFileUrl } from '@/api/employ'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      sort: '', // 默认排序documentDetailId, desc
      delLoading: false,
      documentId: '',
      downloadLoading: false,
      fileList: [],
      message: {}
    }
  },
  created() {
    eventBus.$on('row', (message) => {
      this.documentId = message.documentId
      this.message = message
      this.init()
    })
    this.$nextTick(() => {
      this.init()
    })
  },
  beforeDestroy() {
    eventBus.$off('row')
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
      window.location.href = '/static/template/卷内目录导入模板.xls'
    },
    download() {
      let exceldata = []
      get({ organization: this.params.organization }).then(res => {
        exceldata = JSON.parse(JSON.stringify(this.data))
        this.downloadLoading = true
        import('@/utils/export2Excel').then(excel => {
          // const tHeader = ['档案号', '份数', '页数', '题名', '开始时间', '结束日期', '保管期限', '立卷人', '立卷单位', '卷内序号', '载体类型', '备注']
          const tHeader = ['档案号', '份数', '页数', '页号', '保管期限', '题名', '所属案卷题名', '起始日期', '结束日期', '分类号', '责任者', '立卷人', '密级', '载体类型', '卷内顺序号', '年度', '全宗名称', '备注', '立卷时间', '立卷单位']
          const filterVal = ['code', 'copies', 'pages', 'pageNo', 'preservationPeriod', 'name', 'docName', 'fromDate', 'thurDate', 'classificationCode', 'chargePerson', 'docCreator', 'securityLevel', 'contentType', 'no', 'year', 'fullName', 'comments', 'docCreatedDate', 'docCreatedOrg']
          const data = this.formatJson(filterVal, exceldata)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '卷内信息'
          })
          this.downloadLoading = false
        })
      })
    },
    beforeInit() {
      this.url = 'api/documentDetail'
      const sort = this.sort
      this.params = { page: this.page, size: this.size, sort: sort, documentId: this.documentId }
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
    subDelete(documentDetailId) {
      this.delLoading = true
      del(documentDetailId).then(res => {
        this.delLoading = false
        this.$refs[documentDetailId].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[documentDetailId].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      const _this = this.$refs.form
      _this.form.documentId = this.documentId
      _this.form.messageName = this.message.name
      _this.form.document = {
        documentId: this.documentId
      }
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        documentDetailId: data.documentDetailId,
        copies: data.copies,
        comments: data.comments,
        // createdDate: data.createdDate,
        createdBy: data.createdBy,
        // lastModifiedDate: data.lastModifiedDate,
        lastModifiedBy: data.lastModifiedBy,
        // pages: data.pages,
        title: data.title,
        no: data.no,
        preservationPeriod: data.preservationPeriod,
        code: data.code,
        name: data.name,
        classificationCode: data.classificationCode,
        status: data.status,
        pageNo: data.pageNo,
        fromDate: data.fromDate,
        thurDate: data.thurDate,
        chargePerson: data.chargePerson,
        securityLevel: data.securityLevel,
        contentType: data.contentType,
        year: data.year,
        fullName: data.fullName,
        docCreatedDate: data.docCreatedDate,
        docCreatedOrg: data.docCreatedOrg
      }
      _this.form.messageName = this.message.name
      _this.form.document = data.documentId
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
        uploadFileUrl(params.file, 'api/documentDetailExcel').then(() => {
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
  .upLoadFile_demo ul{
    display: none;
  }
  hr{
    border:1px dashed #000;
    width: 100%;
    color: #000;
    margin: 15px 0;
  }
</style>
