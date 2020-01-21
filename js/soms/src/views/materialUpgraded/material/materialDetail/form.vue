<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :before-close="resetForm" :title="isType" width="600px">
    <!-- 上传预览对话框-->
    <el-dialog :visible.sync="innerDialogVisible" :append-to-body="true" width="720px">
      <img v-if="dialogImageUrl !== ''" :src="dialogImageUrl" width="100%" alt="">
      <div>
        <v-pdf v-if="dialogPdfUrl !== ''" ref="pdf" :pdf-url="dialogPdfUrl"/>
      </div>
    </el-dialog>
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px" status-icon>
      <el-row :gutter="15">
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="单号" prop="code">
            <el-input v-model="form.code" placeholder="系统填写" disabled/>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="物资名称与规格" prop="materialName">
            <el-input v-model="form.materialName" placeholder="点击添加" clearable style="width: 152.5px;" @focus="insideDialog"/>
            <!--物资名称嵌套的对话框-->
            <el-dialog :append-to-body="true" :visible.sync="innerVisible" width="40%" title="物资">
              <el-row :gutter="15">
                <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
                  <el-tree v-loading = "treeLoading" :data="material" :props="defaultProps" @node-click="handleNodeClick"/>
                </el-col>
                <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
                  <!--搜索栏-->
                  <div style="overflow: hidden">
                    <el-input v-model="form.materialName" placeholder="请输入物资名称" clearable style="float: left;width: 200px;margin: 0 10px" @keyup.enter.native="nameSearch"/>
                    <el-button type="success" style="float: left;" @click="nameSearch">查询</el-button>
                  </div>
                  <!--设备栏-->
                  <div style="margin: 5px;">
                    <el-tree :data="materialsInfo" :props="defaultProps" @node-click="handleMaterialName"/>
                  </div>
                </el-col>
              </el-row>
              <div slot="footer" class="dialog-footer">
                <el-button @click="cancelInnerVisible">取 消</el-button>
                <el-button type="primary" @click="innerVisible = false">确 定</el-button>
              </div>
            </el-dialog>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="申请数量" prop="amount">
            <el-input v-model="form.amount" :min="1" type="number" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"/>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="申请单位" prop="unitName">
            <el-input v-model="form.unitName" :disabled="isUnitName"/>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="库存数量" prop="materialPartInventoryAmount">
            <el-input v-model="form.materialPartInventoryAmount" :min="1" type="number" disabled placeholder="系统填写"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="备注" prop="comments">
            <el-input v-model="form.comments" :rows="2" type="textarea" style="width: 370px;"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item v-if="isType !== '编辑'" label="物资图片：" />
          <el-upload
            v-if="isType !== '编辑'"
            ref="upload"
            :auto-upload="false"
            :multiple="false"
            :headers="headers"
            :on-preview="handlePictureCardPreview"
            class="upload-demo"
            action= ""
            show-file-list
            with-credentials
            accept="image/jpeg,image/jpg,image/gif,image/png,application/pdf"
            list-type="picture-card">
            <i class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-col>
        <!--表格渲染-->
        <el-table v-loading="loading" v-if="isType === '编辑'" :data="contents" style="width: 100%;margin: 10px 5px">
          <el-table-column prop="contentName" label="附件名称" width="160px"/>
          <el-table-column prop="createdDate" label="创建日期" width="160px">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createdDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="contentType.contentTypeName" label="附件类型"/>
          <el-table-column label="操作" width="170px" align="center">
            <template slot-scope="scope">
              <el-button icon="el-icon-search" size="mini" @click="preview(scope.row.contentId)"/>
              <el-button v-permission="['ADMIN','material_ALL','material_SELECT']" icon="el-icon-download" size="mini" @click="download(scope.row)"/>
              <el-popover
                v-permission="['ADMIN','material_ALL','material_DELETE']"
                :ref="scope.row.contentId"
                placement="top"
                width="180">
                <p>确定删除本条数据吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.contentId].doClose()">取消</el-button>
                  <el-button :loading="delLoading" type="primary" size="mini" @click="deleteContent(scope.row.contentId)">确定</el-button>
                </div>
                <!-- 删除按钮 -->
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button v-if="isType !== '编辑'" :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      <el-button v-if="(status === '船端审核不通过' || status === '未提交' || !status) && isType === '编辑' " :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addDetial, editDetial, get, delFile, getmaterialPart, contentPreview, getContentsById, getMaterialInventory } from '@/api/material'
import pdf from '@/components/pdf'
import { getToken } from '@/utils/auth'
import { parseTime } from '@/utils/index'

export default {
  props: {
    isType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      dialog: false,
      delLoading: false,
      innerVisible: false,
      treeLoading: false,
      isUnitName: false,
      materialsInfo: [],
      material: [],
      status: '',
      isMaterial: [],
      isMaterialSpec: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      submitStatus: '未提交',
      // 上传图片
      dialogPdfUrl: '',
      dialogImageUrl: '',
      innerDialogVisible: false,
      contents: [],
      headers: { 'Authorization': 'Bearer ' + getToken() },
      form: {
        code: '',
        materialName: '',
        createdBy: '',
        createdDate: '',
        comments: '',
        lastModifiedDate: '',
        lastModifiedBy: '',
        status: '',
        materialId: '',
        materiallClassCode: '',
        materialSpecId: {
          materialSpecId: ''
        },
        amount: '',
        unitName: '',
        materialPartInventoryAmount: '',
        materialPurchaseId: '',
        materialPurchaseDetailId: '',
        applicant: this.$store.state.user.user.username,
        organizationId: this.$store.state.user.user.partyDTO.organization.organizationId
      },
      rules: {
        // code: [{ required: true, message: '请输入单号', trigger: 'blur' }],
        materialName: [{ required: true, message: '请输入物资名称与规格', trigger: 'change' }],
        amount: [{ required: true, message: '请输入申请数量', trigger: 'blur' }],
        unitName: [{ required: true, message: '请输入单位', trigger: 'blur' }]
      }
    }
  },
  methods: {
    parseTime,
    // 选择备件名称时弹出的dialog框
    insideDialog() {
      this.innerVisible = true
      this.getMaterial()
    },
    // 获取所有物资
    getMaterial() {
      this.material = []
      this.materialsInfo = []
      this.treeLoading = true
      this.isUnitName = false
      get().then(res => {
        let result = false
        let equial
        this.treeLoading = false
        res.content.map(v => {
          result = this.material.some((item, index) => {
            if (item.materialId === v.materialId.materialId) {
              equial = index
              return true
            }
          })
          if (!result) {
            this.material.push({
              name: v.materialId.materialClassCode.materialClassName,
              materialId: v.materialId.materialId,
              materialSpecId: v.materialSpecId,
              materialInfo: JSON.stringify(v),
              children: [{
                name: v.materialId.name + ' ' + v.name,
                materialInfo: JSON.stringify(v)
              }]
            })
          } else {
            this.material[equial].children.push({
              name: v.materialId.name + ' ' + v.name,
              materialInfo: JSON.stringify(v)
            })
          }
        })
      })
    },
    // 左侧物资选择某个规格时
    handleNodeClick(data) {
      this.isMaterialSpec = []
      if (data.children && data.children.length) {
        return false
      }
      const d = JSON.parse(data.materialInfo)
      if (this.materialsInfo.length) {
        this.materialsInfo.map(v => {
          if (v.materialSpecId === d.materialSpecId) {
            this.isMaterialSpec.push(d)
            return
          }
        })
        if (this.isMaterialSpec.length === 0) {
          this.materialsInfo.push({
            name: d.materialId.name + ' ' + d.name,
            materialSpecId: d.materialSpecId,
            materialInfo: JSON.stringify(d),
            children: []
          })
        }
      } else {
        this.materialsInfo.push({
          name: d.materialId.name + ' ' + d.name,
          materialSpecId: d.materialSpecId,
          materialInfo: JSON.stringify(d),
          children: []
        })
      }
    },
    // 选中某个规格
    handleMaterialName(data) {
      this.form.materialName = data.name
      const Info = JSON.parse(data.materialInfo)
      this.form.materialSpecId.materialSpecId = Info.materialSpecId
      if (Info.unitName) {
        this.isUnitName = true
        this.form.unitName = Info.unitName
      } else {
        this.form.unitName = ''
      }
      getMaterialInventory({ materialSpecId: data.materialSpecId, organizationId: this.form.organizationId }).then(res => {
        if (res.content.length) {
          this.form.materialPartInventoryAmount = res.content[0].amount
        }
      })
    },
    // 根据物资名称查询备件
    nameSearch() {
      this.materialsInfo = []
      getmaterialPart({ name: this.form.materialName }).then(res => {
        res.content.map(v => {
          this.setMaterialData(v)
        })
      })
    },
    setMaterialData(v) {
      this.materialsInfo.push({
        name: v.materialId.name + ' ' + v.name,
        materialSpecId: v.materialSpecId,
        materialInfo: JSON.stringify(v),
        children: []
      })
    },
    handlePictureCardPreview(file) {
      const extName = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      if (extName === '.pdf') {
        this.dialogPdfUrl = file.url
        this.dialogImageUrl = ''
        this.$refs.pdf.loadFile(file.url)
      } else {
        this.dialogPdfUrl = ''
        this.dialogImageUrl = file.url
      }
      this.innerDialogVisible = true
    },
    // 文件预览
    preview(contentId) {
      this.dialogPdfUrl = ''
      this.dialogImageUrl = ''
      this.innerDialogVisible = true
      contentPreview(contentId).then(res => {
        if (!res) { this.$message.error('文件不存在') }
        const URL = window.URL || window.webkitURL
        const bloburl = URL.createObjectURL(res)
        if (res.type === 'application/pdf') {
          this.dialogPdfUrl = bloburl
          this.dialogImageUrl = ''
          this.$refs.pdf.loadFile(bloburl)
        } else {
          this.dialogPdfUrl = ''
          this.dialogImageUrl = bloburl
        }
      })
    },
    // 文件下载
    download(row) {
      contentPreview(row.contentId).then(res => {
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
    // 文件删除
    deleteContent(contentId) {
      this.delLoading = true
      delFile(contentId).then(res => {
        this.delLoading = false
        this.$refs[contentId].doClose()
        // 同步问题，必须在此刷新
        this.reloadForm()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[contentId].doClose()
        console.log(err.response.data.message)
      })
    },
    // 获取某个物资的图片信息
    reloadForm() {
      getContentsById(this.form.materialPurchaseDetailId).then(res => {
        this.contents = res
      })
    },
    cancelInnerVisible() {
      this.innerVisible = false
      this.form.materialName = ''
      this.form.materialSpecId.materialSpecId = ''
      this.form.materialPartInventoryAmount = ''
      this.form.unitName = ''
      this.isUnitName = false
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isType === '新增') {
            this.doAdd()
          } else if (this.isType === '编辑') {
            this.doEdit()
          } else {
            this.doApply()
          }
        }
      })
    },
    // 上传图片数据转换
    changeUploadData() {
      const formData = new FormData()
      this.$refs.upload.uploadFiles.map(function(value) {
        formData.append('file', value.raw)
      })
      formData.append('code', this.form.code)
      formData.append('createdBy', this.form.createdBy)
      formData.append('comments', this.form.comments)
      formData.append('lastModifiedDate', this.form.lastModifiedDate)
      formData.append('lastModifiedBy', this.form.lastModifiedBy)
      formData.append('status', this.form.status)
      formData.append('materialSpecId', this.form.materialSpecId.materialSpecId)
      formData.append('amount', this.form.amount)
      formData.append('unitName', this.form.unitName)
      formData.append('materialPurchaseId', this.form.materialPurchaseId)
      formData.append('applicant', this.form.applicant)
      formData.append('organizationId', this.$store.state.user.user.partyDTO.organization.organizationId)
      addDetial(formData).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doAdd() {
      this.changeUploadData()
    },
    doEdit() {
      this.form.createdDate = new Date(this.form.createdDate).getTime()
      editDetial(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doApply() {
      // this.form.createdDate = new Date(this.form.createdDate)
      this.changeUploadData()
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      if (this.isType !== '编辑') {
        this.$refs.upload.clearFiles()
      }
      this.form = {
        materialName: '',
        createdBy: '',
        createdDate: '',
        comments: '',
        lastModifiedDate: '',
        lastModifiedBy: '',
        status: '',
        materialId: '',
        materiallClassCode: '',
        materialSpecId: {
          materialSpecId: ''
        },
        amount: '',
        unitName: '',
        materialPartInventoryAmount: '',
        applicant: this.$store.state.user.user.username,
        organizationId: this.$store.state.user.user.partyDTO.organization.organizationId
      }
    }
  }
}
</script>

<style scoped>
  .pdf{
    border: 2px solid aqua;
  }
  .upload-demo{
    margin: 0 0 15px 40px;
    width: 600px;
  }
</style>
