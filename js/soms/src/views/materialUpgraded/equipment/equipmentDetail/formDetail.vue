<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="deltailDialog" :before-close="resetForm" :title="isDetail?(isDetail === '到船签收' ? '到船签收' : '签收详情'):'供货信息'" width="600px">
    <!--供货信息-->
    <el-form v-if="supplyDialog" ref="form" :model="supply" :rules="rules" size="small" label-width="120px" status-icon>
      <el-row :gutter="15">
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="供货厂家" prop="supplies">
            <el-select v-model="supply.supplies" clearable>
              <el-option
                v-for="item in suppliers"
                :key="item.supplyId"
                :label="item.companyName"
                :value="item.supplyId"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="供货数量" prop="supplyAmount">
            <el-input v-model="supply.amount" :min="1" :max="max" type="number" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="备注" prop="comments">
            <el-input v-model="supply.comments" :rows="2" type="textarea" style="width: 370px;"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 上传预览对话框-->
    <el-dialog :visible.sync="innerDialogVisible" :append-to-body="true" width="720px">
      <img v-if="dialogImageUrl !== ''" :src="dialogImageUrl" width="100%" alt="">
      <div>
        <v-pdf v-if="dialogPdfUrl !== ''" ref="pdf" :pdf-url="dialogPdfUrl"/>
      </div>
    </el-dialog>
    <el-form v-if="!supplyDialog && isDetail === '到船签收'" ref="form" :model="form" :rules="rules" size="small" label-width="120px" status-icon>
      <el-row :gutter="15">
        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
          <el-input v-model="form.equipmentPartName" disabled placeholder="备件名称"/>
        </el-col>
        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
          <el-input v-model="form.equipmentPartSpecName" disabled placeholder="备件规格"/>
        </el-col>
        <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
          <el-input v-model="form.amount" disabled placeholder="备件数量"/>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="本次到船数量" prop="arrivedAmount" style="margin: 15px 0;">
            <el-input v-model="form.arrivedAmount" :min="1" type="Number" style="width: 200px;" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="累计到船数量" prop="Allamount">
            <el-input v-model="form.Allamount" style="width: 200px;" disabled/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="签收单图片：" prop="equipmentImage"/>
          <el-upload
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
            list-type="picture-card"
            style="margin: 20px">
            <i class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-col>
      </el-row>
    </el-form>
    <el-table v-loading="loading" v-if="!supplyDialog && isDetail === '签收详情'" :data="contents" style="width: 100%;margin: 10px 5px">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form
            v-for="(item) in scope.row.contents"
            :key="item.contentId"
            label-position="left"
            inline
            class="demo-table-expand">
            <el-form-item label="附件名称：">
              <span>{{ item.contentName }}</span>
            </el-form-item>
            <el-button icon="el-icon-search" size="mini" @click="preview(item.contentId)"/>
            <el-button icon="el-icon-download" size="mini" @click="download(item)"/>
            <el-popover
              :ref="item.contentId"
              placement="top"
              width="180">
              <p>确定删除本条数据吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[item.contentId][0].doClose()">取消</el-button>
                <el-button :loading="delLoading" type="primary" size="mini" @click="deleteContent(item.contentId)">确定</el-button>
              </div>
              <!-- 删除按钮 -->
              <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
            </el-popover>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" align="center"/>
      <el-table-column prop="createdDate" label="申请时间" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="arrivedAmount" label="签收数量" align="center"/>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-popover
            :ref="scope.row.equipmentPartPurchaseDetailArrivedId"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.equipmentPartPurchaseDetailArrivedId].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="deleteRecord(scope.row.equipmentPartPurchaseDetailArrivedId)">确定</el-button>
            </div>
            <!-- 删除按钮 -->
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button v-if="isDetail === '到船签收' || supplyDialog" :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addArrived, delFile, delRecord, contentPreview, getArrivedId, addSupplyInfo, editSupplyInfo } from '@/api/equipment'
import { parseTime } from '@/utils/index'
import pdf from '@/components/pdf'
import { getToken } from '@/utils/auth'
export default {
  props: {
    isDetail: {
      type: String,
      required: true
    }
  },
  data() {
    var maxAmount = (rule, value, callback) => {
      if (!this.supply.amount) {
        callback(new Error('请输入供货数量!'))
      } else if (this.supply.amount > this.max) {
        callback(new Error('供货数量应小于申请数量!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      delLoading: false,
      deltailDialog: false,
      supplyDialog: '',
      // 上传图片
      dialogPdfUrl: '',
      dialogImageUrl: '',
      innerDialogVisible: false,
      contents: [],
      equipmentPartPurchaseArrivedId: '',
      equipmentPartPurchaseDetailId: '',
      headers: { 'Authorization': 'Bearer ' + getToken() },
      // 供货信息
      suppliers: [],
      max: 1,
      form: {
        equipmentPartPurchaseArrivedId: '',
        equipmentPartPurchaseDetailId: '',
        createdDate: '',
        comments: '',
        createdBy: '',
        lastModifiedDate: '',
        lastModifiedBy: '',
        arrivedAmount: '',
        equipmentPartName: '',
        equipmentPartSpecName: '',
        amount: '',
        Allamount: ''
      },
      supply: {
        supplies: '',
        comments: '',
        amount: '',
        equipmentPartPurchaseId: '',
        supplyId: ''
      },
      rules: {
        arrivedAmount: [{ required: true, message: '请输入到船签收数量', trigger: blur }],
        supplyAmount: [{ required: true, validator: maxAmount, trigger: 'change' }],
        supplies: [{ required: true, message: '请输入供货厂家', trigger: 'change' }]
        // equipmentImage: [{ required: true, message: '请上传签收单', trigger: blur }]
      }
    }
  },
  methods: {
    parseTime,
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
        this.$refs[contentId][0].doClose()
        // 同步问题，必须在此刷新
        this.getArrivedInfo()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[contentId][0].doClose()
        console.log(err.response.data.message)
      })
    },
    deleteRecord(equipmentPartPurchaseDetailArrivedId) {
      this.delLoading = true
      delRecord(equipmentPartPurchaseDetailArrivedId).then(res => {
        this.delLoading = false
        this.$refs[equipmentPartPurchaseDetailArrivedId].doClose()
        // 同步问题，必须在此刷新
        this.getArrivedInfo()
        this.$parent.init()
        this.$parent.$parent.$refs.equipmentInfo.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[equipmentPartPurchaseDetailArrivedId].doClose()
        console.log(err.response.data.message)
      })
    },
    // 签收详情
    getArrivedInfo() {
      this.loading = true
      getArrivedId({ equipmentPartPurchaseDetailId: this.equipmentPartPurchaseDetailId }).then(res => {
        this.loading = false
        this.contents = res.content
        this.contents.map(v => {
          v.contents.map((item, index) => {
            if (item.status !== 'USE') {
              v.contents.splice(index, 1)
            }
          })
        })
      })
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.supplyDialog === '新增供货') {
            this.doAddSupply()
          } else if (this.supplyDialog === '查询供货') {
            this.doEditSupply()
          } else {
            this.doAdd()
          }
        }
      })
    },
    doAddSupply() {
      if (!this.supply.supplies && !this.supply.amount && !this.supply.comments) {
        this.resetForm()
        return false
      }
      this.supply.supplyId = { supplyId: this.supply.supplies }
      addSupplyInfo(this.supply).then(() => {
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
    doEditSupply() {
      editSupplyInfo(this.supply).then(() => {
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
    doAdd() {
      const formData = new FormData()
      this.$refs.upload.uploadFiles.map(function(value) {
        formData.append('file', value.raw)
      })
      formData.append('arrivedAmount', this.form.arrivedAmount)
      formData.append('equipmentPartPurchaseDetailId', this.form.equipmentPartPurchaseDetailId)
      // formData.append('organizationId', data.equipmentPartPurchase.organizationId.organizationId)
      addArrived(formData).then(res => {
        this.resetForm()
        this.$notify({
          title: '签收成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
        this.$parent.$parent.$refs.equipmentInfo.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.deltailDialog = false
      if (this.supplyDialog) {
        this.$refs['form'].resetFields()
      } else if (this.isDetail === '到船签收') {
        this.$refs['form'].resetFields()
        this.$refs.upload.clearFiles()
      } else {
        this.loading = false
      }
      this.supplyDialog = ''
      this.suppliers = []
      this.$parent.isDetail = ''
      this.form = {
        equipmentPartPurchaseArrivedId: '',
        equipmentPartPurchaseId: '',
        createdDate: '',
        comments: '',
        createdBy: '',
        lastModifiedDate: '',
        lastModifiedBy: '',
        arrivedAmount: ''
      }
      this.supply = {
        supplies: '',
        comments: '',
        amount: '',
        equipmentPartPurchaseId: '',
        supplyId: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
