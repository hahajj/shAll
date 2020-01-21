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
          <el-form-item label="单号" prop="orderNo">
            <el-input v-model="form.orderNo" placeholder="系统填写" disabled/>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="备件名称" prop="equipmentPartName">
            <el-input v-model="form.equipmentPartName" placeholder="点击添加" style="width: 152.5px;" @focus="insideDialog"/>
            <!--备件名称嵌套的对话框-->
            <el-dialog :append-to-body="true" :visible.sync="innerVisible" width="40%" title="备件">
              <el-row :gutter="15">
                <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
                  <el-tree :data="equipment" :props="defaultProps" @node-click="handleNodeClick"/>
                </el-col>
                <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
                  <!--搜索栏-->
                  <div style="overflow: hidden">
                    <el-input v-model="form.equipmentPartName" clearable style="float: left;width: 200px;margin: 0 10px" @keyup.enter.native="nameSearch"/>
                    <el-button type="success" style="float: left;" @click="nameSearch">查询</el-button>
                  </div>
                  <!--设备栏-->
                  <div style="margin: 5px;">
                    <el-tree v-loading = "treeLoading" :data="equipmentPart" :props="defaultProps" @node-click="handleEquipmentPartName"/>
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
          <el-form-item label="设备名称" prop="equipmentName">
            <el-input v-model="form.equipmentName" disabled placeholder="系统填写"/>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="备件型号" prop="equipmentPartSpecName">
            <el-input v-model="form.equipmentPartSpecName" />
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="备件号" prop="code">
            <el-input v-model="form.code"/>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="图纸号" prop="planNo">
            <el-input v-model="form.planNo" />
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
          <el-form-item label="库存数量" prop="equipmentPartInventoryAmount">
            <el-input v-model="form.equipmentPartInventoryAmount" :min="1" type="number" disabled placeholder="系统填写"/>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="最低保有量" prop="miniumAmount">
            <el-input v-model="form.miniumAmount" :min="1" type="number" disabled placeholder="系统填写"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="备注" prop="comments">
            <el-input v-model="form.comments" :rows="2" type="textarea" style="width: 370px;"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item v-if="isType !== '编辑'" label="备件图片：" />
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
        <el-table v-loading="imageLoading" v-if="isType === '编辑'" :data="contents" style="width: 100%;margin: 10px 5px">
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
              <el-button v-permission="['ADMIN','EQUIPMENT_ALL','EQUIPMENT_SELECT']" icon="el-icon-download" size="mini" @click="download(scope.row)"/>
              <el-popover
                v-permission="['ADMIN','EQUIPMENT_ALL','EQUIPMENT_DELETE']"
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
import { addEquipmentDetial, editEquipmentDetial, delFile, getEquipment, getEquipmentPart, contentPreview, getContentsById, getEquipmentPartInventory } from '@/api/equipment'
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
      imageLoading: false,
      equipmentPartID: '',
      equipment: [],
      equipmentPart: [],
      status: '',
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
      equipmentPartPurchaseId: '',
      isUnitName: false,
      form: {
        createdBy: '',
        comments: '',
        lastModifiedDate: '',
        lastModifiedBy: '',
        status: '',
        equipmentId: '',
        equipmentlClassCode: '',
        code: '',
        orderNo: '',
        name: '',
        equipmentPartSpecId: {
          equipmentPartSpecId: ''
        },
        equipmentPartPurchaseDetailId: '',
        equipmentPartSpecName: '',
        planNo: '',
        amount: '',
        equipmentName: '',
        unitName: '',
        equipmentPartInventoryAmount: '',
        miniumAmount: '',
        applicant: this.$store.state.user.user.username,
        equipmentPartName: '',
        organizationId: this.$store.state.user.user.partyDTO.organization.organizationId
      },
      rules: {
        equipmentPartName: [{ required: true, message: '请输入备件名称', trigger: 'change' }],
        equipmentName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        equipmentPartSpecName: [{ required: true, message: '请输入备件型号', trigger: 'blur' }],
        planNo: [{ required: true, message: '请输入图纸号', trigger: 'blur' }],
        amount: [{ required: true, message: '请输入申请数量', trigger: 'blur' }],
        unitName: [{ required: true, message: '请输入单位', trigger: 'blur' }],
        // equipmentPartInventoryAmount: [{ required: true, message: '请输入库存数量', trigger: 'blur' }],
        // miniumAmount: [{ required: true, message: '请输入最低保有量', trigger: 'blur' }],
        code: [{ required: true, message: '请输入备件号', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getEquipment()
  },
  methods: {
    parseTime,
    getEquipment() {
      getEquipment().then(res => {
        this.equipment = res.content
      })
    },
    // 选择设备名称时弹出的dialog框
    insideDialog() {
      this.innerVisible = true
      this.isUnitName = false
    },
    // 点击设备名称树形图时
    handleNodeClick(data) {
      if (data.children && data.children.length > 0) {
        return
      }
      const result = this.equipmentPart.some((item) => {
        if (item.equipmentId === data.equipmentId) {
          return true
        }
      })
      if (!result) {
        this.treeLoading = true
        getEquipmentPart({ equipmentId: data.equipmentId }).then(res => {
          if (res.content.length) {
            this.setTreeData(res.content)
          } else {
            this.equipmentPart.push({
              name: data.name,
              equipmentId: data.equipmentId,
              children: []
            })
          }
          this.treeLoading = false
        })
      }
    },
    // 数据改写成树形图需要的格式
    setTreeData(data) {
      const isEquipment = []
      data.map((v, i) => {
        this.equipmentPart.map((item) => {
          if (item.equipmentId === v.equipmentPartId.equipmentId.equipmentId) {
            item.children.push({
              name: v.equipmentPartId.name + ' ' + v.name,
              equipmentPartId: v.equipmentPartId.equipmentPartId,
              equipmentPartID: v.equipmentPartId ? JSON.stringify(v.equipmentPartId) : '',
              equipmentPartSpecId: v.equipmentPartSpecId,
              unitName: v.unitName,
              equipmentPartSpecName: v.name
            })
            isEquipment.push(i)
          }
        })
        if (v.equipmentPartId.equipmentId && isEquipment.indexOf(i) === -1) {
          this.equipmentPart.push({
            name: v.equipmentPartId.equipmentId.name,
            equipmentId: v.equipmentPartId.equipmentId.equipmentId,
            children: [{
              name: v.equipmentPartId.name + ' ' + v.name,
              equipmentPartId: v.equipmentPartId.equipmentPartId,
              equipmentPartID: JSON.stringify(v.equipmentPartId),
              equipmentPartSpecId: v.equipmentPartSpecId,
              unitName: v.unitName,
              equipmentPartSpecName: v.name
            }]
          })
        }
      })
    },
    // 点击备件名称、规格树形图时
    handleEquipmentPartName(data) {
      if (!data.children) {
        if (data.equipmentPartID) {
          this.equipmentPartID = JSON.parse(data.equipmentPartID)
          this.form.equipmentName = this.equipmentPartID.equipmentId.name
          this.form.equipmentPartName = this.equipmentPartID.name
        } else {
          this.equipmentPartID = ''
        }
        this.form.equipmentPartName = data.name
        getEquipmentPartInventory({ equipmentPartSpecName: data.equipmentPartSpecName, organizationId: this.form.organizationId }).then(res => {
          if (res.content.length > 0) {
            this.form.equipmentPartInventoryAmount = res.content[0].amount
            this.form.miniumAmount = res.content[0].miniumAmount
          }
        })
        if (data.unitName) {
          this.form.unitName = data.unitName
          this.isUnitName = true
        }
        this.form.equipmentPartSpecId.equipmentPartSpecId = data.equipmentPartSpecId
      }
    },
    cancelInnerVisible() {
      this.innerVisible = false
      this.form.equipmentName = ''
      this.form.equipmentPartName = ''
      this.form.equipmentPartInventoryAmount = ''
      this.form.miniumAmount = ''
      this.form.equipmentPartName = ''
      this.form.unitName = ''
      this.form.equipmentPartSpecId.equipmentPartSpecId = ''
      this.isUnitName = false
    },
    // 根据备件名查询备件
    nameSearch() {
      this.equipmentPart = []
      if (this.form.equipmentPartName) {
        getEquipmentPart({ name: this.form.equipmentPartName }).then(res => {
          this.setTreeData(res.content)
        })
      } else {
        getEquipmentPart().then(res => {
          this.setTreeData(res.content)
        })
      }
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
    reloadForm() {
      this.imageLoading = true
      getContentsById(this.form.equipmentPartPurchaseDetailId).then(res => {
        this.imageLoading = false
        this.contents = res
      })
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
      formData.append('createdBy', this.form.createdBy)
      formData.append('comments', this.form.comments)
      formData.append('lastModifiedDate', this.form.lastModifiedDate)
      formData.append('lastModifiedBy', this.form.lastModifiedBy)
      formData.append('status', this.form.status)
      formData.append('equipmentId', this.form.equipmentId)
      formData.append('equipmentlClassCode', this.form.equipmentlClassCode)
      formData.append('code', this.form.code)
      formData.append('name', this.form.name)
      formData.append('equipmentPartSpecId', this.form.equipmentPartSpecId.equipmentPartSpecId)
      formData.append('equipmentPartPurchaseId', this.equipmentPartPurchaseId)
      formData.append('equipmentPartSpecName', this.form.equipmentPartSpecName)
      formData.append('planNo', this.form.planNo)
      formData.append('amount', this.form.amount)
      formData.append('equipmentName', this.form.equipmentName)
      formData.append('unitName', this.form.unitName)
      formData.append('equipmentPartInventoryAmount', this.form.equipmentPartInventoryAmount)
      formData.append('miniumAmount', this.form.miniumAmount)
      formData.append('applicant', this.form.applicant)
      formData.append('equipmentPartName', this.form.equipmentPartName)
      formData.append('organizationId', this.$store.state.user.user.partyDTO.organization.organizationId)
      addEquipmentDetial(formData).then(res => {
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
      editEquipmentDetial(this.form).then(res => {
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
      this.changeUploadData()
    },
    resetForm() {
      this.dialog = false
      this.contents = []
      this.$refs['form'].resetFields()
      if (this.isType !== '编辑') {
        this.$refs.upload.clearFiles()
      }
      this.form = {
        comments: '',
        createdBy: '',
        lastModifiedDate: '',
        lastModifiedBy: '',
        status: '',
        equipmentId: '',
        equipmentlClassCode: '',
        code: '',
        name: '',
        equipmentPartSpecId: {
          equipmentPartSpecId: ''
        },
        equipmentPartSpecName: '',
        planNo: '',
        amount: '',
        equipmentName: '',
        unitName: '',
        equipmentPartInventoryAmount: '',
        miniumAmount: '',
        equipmentPartName: '',
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
