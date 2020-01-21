<template>
  <el-dialog
    :visible.sync="dialog"
    :close-on-click-modal="false"
    :before-close="resetForm"
    :append-to-body="true"
    width="720px"
  >
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
      <el-form-item v-if="isAdd" label="基本参数类型" prop="circularType">
        <el-cascader
          v-model="form.circularType"
          :show-all-levels="false"
          :options="circularTypes"
          clearable
          placeholder="基本参数类型"
          class="filter-item"
          @change="changeCircularType(form.circularType)"
        />
      </el-form-item>
      <el-form-item v-if="!isAdd" label="基本参数类型" prop="circularType">
        <el-input v-model="form.circularTypeName" :disabled="!isAdd" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="发布主题" prop="title">
        <el-input v-model="form.title" :disabled="!isAdd" style="width: 370px;"/>
        <span v-if="!isAdd">
          <span v-if="recevieList==true" style="color: #13ce66;margin-left: 15px" class="el-icon-success el-icon-circle-check">岸基已接收</span>
          <span v-else style="color: #F56C6C;margin-left: 15px" class="el-icon-error el-icon-circle-check">岸基未接收</span>
        </span>
      </el-form-item>
      <el-upload
        v-if="isAdd&&dialog"
        ref="upload"
        :limit="3"
        :auto-upload="false"
        :multiple="true"
        :on-exceed="handleExceed"
        :on-preview="handlePictureCardPreview"
        :before-upload="onBeforeUpload"
        class="upload-demo"
        action
        show-file-list
        with-credentials
        accept="*"
        list-type="picture-card"
      >
        <el-button slot="trigger" type="info">选取文件</el-button>
        <div slot="tip" class="el-upload__tip">单个文件不超过10MB</div>
      </el-upload>
      <!--表格渲染-->
      <span v-if="!isAdd" style="color: rgb(24, 144, 255);font-size: 20px">附件列表</span>
      <el-table v-loading="loading" v-if="!isAdd" :data="form.contents" size="small" style="width: 100%;margin-top: 10px;">
        <el-table-column prop="contentName" label="附件名称" align="center"/>
        <el-table-column prop="createdDate" label="创建日期" align="center">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createdDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="contentType.contentTypeName" label="附件类型" align="center"/>
        <!--v-if="checkPermission(['ADMIN','PARTY_ALL','PARTY_EDIT','PARTY_DELETE'])"-->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button icon="el-icon-search" type="warning" size="mini" @click="preview(scope.row.contentId)"/>
            <el-button icon="el-icon-download" type="success" size="mini" @click="download(scope.row)"/>
          </template>
        </el-table-column>
        <el-dialog :visible.sync="innerDialogVisible" :append-to-body="true" width="50%" style="z-index: 9999!important;">
          <v-pdf v-if="dialogPdfUrl !== ''" ref="pdf" :pdf-url="dialogPdfUrl"/>
          <img v-else :src="dialogImageUrl" width="100%" alt="">
        </el-dialog>
      </el-table>

    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button v-if="isAdd" :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import pdf from '@/components/pdf'
import { getToken } from '@/utils/auth'
import { add, edit } from '@/api/s2lCircular'
import { s2lContentPreview } from '@/api/content'
import { parseTime } from '@/utils/index'

export default {
  components: { 'v-pdf': pdf },
  props: {
    isAdd: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      recevieList: false,
      headers: { 'Authorization': 'Bearer ' + getToken() },
      loading: false,
      dialog: false,
      circularTypes: [],
      shipOrganizations: [],
      dialogPdfUrl: '',
      pdfCurrentPage: 0,
      pdfPageCount: 0,
      pdfNumPages: undefined,
      innerDialogVisible: false,
      dialogImageUrl: '',
      dialogVisible: false,
      form: {
        circularId: '',
        circularType: '',
        contents: [],
        title: '',
        status: '',
        createdDate: '',
        createdBy: '',
        lastModifiedDate: '',
        lastModifiedBy: '',
        senderPartyId: '',
        selectedOrganizations: []

      },
      rules: {
        circularType: [
          { required: true, message: '请选择基本参数类型', trigger: 'blur' }
        ], title: [
          { required: true, message: '请输入主题', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    parseTime,
    changeCircularType(v) {
      if (v.length > 1) {
        this.form.circularType.shift()
      }
    },
    preview(contentId) {
      s2lContentPreview(contentId).then(res => {
        if (!res) { this.$message.error('文件不存在') }
        const URL = window.URL || window.webkitURL
        const bloburl = URL.createObjectURL(res)
        if (res.type === 'text/html') {
          this.$message.error('文件类型不支持预览')
          return false
        }
        if (res.type === 'application/pdf') {
          this.dialogPdfUrl = bloburl
          this.dialogImageUrl = ''
          // this.$refs.pdf.loadFile(bloburl)
        } else {
          this.dialogPdfUrl = ''
          this.dialogImageUrl = bloburl
        }
        this.innerDialogVisible = true
      })
    },
    download(row) {
      s2lContentPreview(row.contentId).then(res => {
        if (!res) { this.$message.error('文件不存在') }
        const URL = window.URL || window.webkitURL
        const bloburl = URL.createObjectURL(res)
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = bloburl
        link.setAttribute('download', row.contentName)
        document.body.appendChild(link)
        link.click()
      })
    },
    handlePictureCardPreview(file) {
      var extName = file.name
        .substring(file.name.lastIndexOf('.'))
        .toLowerCase()
      if (extName === '.pdf') {
        this.dialogPdfUrl = file.url
        this.dialogImageUrl = ''
        this.$refs.pdf.loadFile(file.url)
      } else {
        this.dialogPdfUrl = ''
        this.dialogImageUrl = file.url
      }
      // this.dialogImageUrl = file.url
      this.innerDialogVisible = true
    },
    onBeforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10

      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB!')
      }
      return isLt10M
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      const fd = new FormData()
      this.$refs['upload'].uploadFiles.forEach(item => {
        fd.append('file', item.raw)
      })
      fd.append('circularType', this.form.circularType)
      fd.append('title', this.form.title)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd(fd)
          } else this.doEdit(fd)
        }
      })
    },
    doAdd(fd) {
      add(fd)
        .then(res => {
          this.resetForm()
          this.$notify({
            title: '添加成功',
            type: 'success',
            duration: 2500
          })
          this.loading = false
          this.$parent.init()
        })
        .catch(err => {
          this.loading = false
          console.log(err.response.data.message)
        })
    },
    doEdit(fd) {
      edit(fd)
        .then(res => {
          this.resetForm()
          this.$notify({
            title: '修改成功',
            type: 'success',
            duration: 2500
          })
          this.loading = false
          this.$parent.init()
        })
        .catch(err => {
          this.loading = false
          console.log(err.response.data.message)
        })
    },
    resetForm() {
      this.dialog = false
      this.recevieList = false
      this.$refs['form'].resetFields()
      this.form = {
        circularId: '',
        circularType: '',
        contents: [],
        circularTypeName: '',
        title: ''

        // status: '',
        // createdDate: '',
        // createdBy: '',
        // lastModifiedDate: '',
        // lastModifiedBy: '',
        // senderPartyId: ''

      }
    }
  }
}
</script>

<style scoped>
</style>
