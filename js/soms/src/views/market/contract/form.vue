<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增合同' : '编辑'" width="750px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="110px" status-icon style="width:90%">
      <el-row :gutter="15">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="合同号" prop="code">
            <el-input v-model="form.code" :disabled="!isAdd" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="客户名称" prop="customer.customerId">
            <el-select v-model="form.customer.customerId" filterable placeholder="请选择" >
              <el-option
                v-for="item in customerData"
                :key="item.customerId"
                :label="item.companyName"
                :value="item.customerId"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="合同类型" prop="contractType">
            <el-select v-model="form.contractType" filterable placeholder="合同类型">
              <el-option
                v-for="(item,index) in contractTypeData"
                :key="index"
                :label="item"
                :value="item"/>
            </el-select>
          </el-form-item>
        </el-col>

        <!--货物多种-->
        <div v-if="form.contractCargoInfos.length" style="clear: both; border: 1px solid rgba(204, 204, 204, 1);padding-top: 20px;width: 110%; padding-right: 10%;margin-bottom: 20px;border-radius: 10px;position: relative">
          <span class="spanLabel">货物信息</span>
          <span class="spanAdd" style="top: 8px;right: 1px;">
            <el-button type="success" size="mini" @click="addCargo()"> 新增货物</el-button>
          </span>
          <div v-for="(item,index) in form.contractCargoInfos" :key="item.contractCargoInfoId" style="margin-top: 10px">
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" style="clear: both">
              <el-form-item :prop="'contractCargoInfos.' + index + '.cargoId'" :rules="{ required: true, message: '货物类型不能为空', trigger: 'blur'}" label="货物类型">
                <el-select v-model="item.cargoId" filterable placeholder="请选择" @change="changeCargoData(item,item.cargoId,form.contractCargoInfos)">
                  <el-option
                    v-for="item in cargoData"
                    :key="item.cargoId+index"
                    :label="item.name"
                    :value="item.cargoId"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item :prop="'contractCargoInfos.' + index + '.amount'" :rules="{ required: true, message: '货物总量不能为空', trigger: 'blur'}" label="货物总量(吨)" >
                <el-input-number :min="0" v-model="item.amount" controls-position="right" type="number" style="width: 199px" @change="changeAmount()"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" style="clear: both">
              <el-form-item :prop="'contractCargoInfos.' + index + '.priceType'" :rules="{ required: true, message: '运价类型不能为空', trigger: 'blur'}" label="运价类型">
                <el-select v-model="item.priceType" filterable placeholder="请选择">
                  <el-option
                    v-for="(item,index) in priceTypeData"
                    :key="index"
                    :label="item"
                    :value="item"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item :prop="'contractCargoInfos.' + index + '.price'" :rules="{ required: true, message: '单价不能为空', trigger: 'blur'}" label="单价(元)">
                <el-input-number :min="0" v-model="item.price" controls-position="right" type="number" style="width: 199px" @change="changeAmount()"/>
              </el-form-item>
            </el-col>
            <el-button style="float: right;position: relative; right: -50px;bottom: 47px;" type="warning" size="mini" @click="deleteCargo(form,index) "> 删除</el-button>
            <div style="clear: both;"/>
          </div>
          <div style="clear: both;margin-bottom: 10px"/>
        </div>

        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="总运价(元)" prop="totalAmount">
            <el-input-number :min="0" v-model="form.totalAmount" controls-position="right" type="number" style="width: 199px"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="签订时间" prop="signDate">
            <el-date-picker
              v-model="form.signDate"
              type="date"
              size="mini"
              style="width: 199px;"
              placeholder="选择日期"/>
          </el-form-item>
        </el-col>
        <div style="clear: both"/>
        <el-col v-if="!isAdd" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="创建人" prop="">
            <!--<el-input v-model="form.createdBy" disabled/>-->
            <!--<span>{{ getAllParty(form.createdBy) }}</span>-->
            <span>{{ form.createdBy.name }}</span>
          </el-form-item>
        </el-col>
        <el-col v-if="!isAdd" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="创建时间" prop="">
            <!--<el-input v-model="form.createdDate" disabled/>-->
            <span>{{ parseTime(form.createdDate) }}</span>
          </el-form-item>
        </el-col>
        <div style="clear: both"/>

        <span class="spanLabel">挂港信息</span>
        <span class="spanAdd" >
          <el-button type="success" size="mini" @click="addPort()"> 新增挂港</el-button>
        </span>
        <div style="padding-left: 3%;margin-top: 10px;width: 715px">
          <el-table :data="form.contractPortInfos" style="width: 100%;font-size: 12px">
            <el-table-column
              label="装卸动作"
              align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.actionType" filterable placeholder="请选择" size="mini" >
                  <el-option
                    v-for="(item,index) in actionData"
                    :key="index"
                    :label="item"
                    :value="item"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="港口"
              width="120px"
              align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.portName" filterable placeholder="请选择" size="mini">
                  <el-option
                    v-for="(item,index) in portData"
                    :key="item.name+index"
                    :label="item.name"
                    :value="item.name"/>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column
              label="装卸总时(h)"
              width="135"
              align="center">
              <template slot-scope="scope">
                <el-input-number :min="0" v-model="scope.row.actionTime" controls-position="right" type="number" size="mini"/>
              </template>
            </el-table-column>

            <el-table-column
              label="装卸总量(吨)"
              width="135"
              align="center">
              <template slot-scope="scope">
                <el-input-number :min="0" v-model="scope.row.amount" controls-position="right" type="number" size="mini"/>
              </template>
            </el-table-column>

            <el-table-column
              label="货物种类"
              width="120px"
              align="center">
              <template slot-scope="scope">
                <!--<el-input v-model="scope.row.cargo.name" />-->
                <el-select v-model="scope.row.cargo.cargoId" filterable placeholder="请选择" size="mini" @change="changeCargoData1(scope.row,scope.row.cargo.cargoId)">
                  <el-option
                    v-for="(item,index) in activeCargoData"
                    :key="item.cargoId+index"
                    :label="item.name"
                    :value="item.cargoId"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center">
              <template slot-scope="scope">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" @click="form.contractPortInfos.splice(scope.$index,1)"/>
              </template>
            </el-table-column>

        </el-table></div>

        <span class="spanLabel" >
          附件
        </span>
        <el-table v-loading="loading" v-if="!isAdd" :data="form.contents" size="small" style="width: 100%;margin-top: 10px;">
          <el-table-column prop="contentName" label="附件名称" align="center"/>
          <el-table-column prop="createdDate" label="创建日期" align="center">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createdDate) }}</span>
            </template>
          </el-table-column>
          <!--<el-table-column prop="contentType.contentTypeName" label="附件类型" align="center"/>-->
          <!--v-if="checkPermission(['ADMIN','PARTY_ALL','PARTY_EDIT','PARTY_DELETE'])"-->
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button icon="el-icon-search" type="warning" size="mini" @click="preview(scope.row.contentId)"/>
              <el-button icon="el-icon-download" type="success" size="mini" @click="download(scope.row)"/>
            </template>
          </el-table-column>
          <el-dialog ref="dialog" :visible.sync="innerDialogVisible" :append-to-body="true" width="50%" style="z-index: 9999!important;">
            <v-pdf v-if="dialogPdfUrl !== ''" ref="pdf" :pdf-url="dialogPdfUrl"/>
            <img v-else :src="dialogImageUrl" width="100%" alt="">

          </el-dialog>
        </el-table>
        <el-upload
          v-if="dialog"
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
          <div slot="tip" class="el-upload__tip" style="color: red;">单个文件不超过10MB<span v-if="isAdd">,必须上传至少一个附件</span></div>
        </el-upload>
      <!--合同附件-->

      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { get } from '@/api/cargo'
import pdf from '@/components/pdf'
import { getCustomer } from '@/api/customer'
import { getPort } from '@/api/port'
import { addContract, editContract } from '@/api/contract'
import { contentPreview } from '@/api/content'
import { parseTime } from '@/utils/index'
// import { getPartyByPartyId } from '@/api/party'
export default {
  components: { 'v-pdf': pdf },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      recevieList: [],
      circularTypes: [],
      shipOrganizations: [],
      dialogPdfUrl: '',
      innerDialogVisible: false,
      dialogImageUrl: '',
      pdfCurrentPage: 0,
      pdfPageCount: 0,
      pdfNumPages: undefined,
      dialogVisible: false,
      form: {
        contractCargoInfos: [{ cargo: {}}],
        status: '',
        createdDate: '',
        lastModifiedDate: '',
        createdBy: '',
        lastModifiedBy: '',
        contractPortInfos: [],
        customer: {},
        supplyScope: '',
        contactPhone: '',
        contact: '',
        comments: '',
        totalAmount: ''
      },
      cargoData: [],
      portData: [],
      customerData: [],
      contractTypeData: ['COA合同', '航次合同'],
      actionData: [
        '装货', '卸货'
      ],
      priceTypeData: ['包干', '单价率'],
      activeCargoData: [],
      rules: {
        code: [{ required: true, message: '请输入合同号', trigger: 'blur' }],
        'customer.customerId': [{ required: true, message: '请选择客户', trigger: 'blur' }],
        contractType: [{ required: true, message: '请选择合同类型', trigger: 'blur' }],
        totalAmount: [{ required: true, message: '总额不为空', trigger: 'blur' }],
        signDate: [{ required: true, message: '请选择日期', trigger: 'blur' }]
      }
    }
  },
  created() {
    get().then((res) => {
      this.cargoData = res.content
    })
    getPort({ sort: 'createdDate,desc' }).then((res) => {
      this.portData = res.content
    })
    getCustomer().then(res => {
      this.customerData = res.content
    })
  },
  methods: {
    parseTime,
    // getAllParty(id){
    //   getPartyByPartyId(id)
    // },
    addPort() {
      this.form.contractPortInfos.push({ cargo: {}})
    },
    addCargo() {
      this.form.contractCargoInfos.push({ cargo: {}})
    },
    deleteCargo(form, index) {
      if (form.contractCargoInfos.length > 1) {
        form.contractCargoInfos.splice(index, 1)
        this.changeActiveCargoData(form.contractCargoInfos, true)
      }
    },

    preview(contentId) {
      contentPreview(contentId).then(res => {
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
    // 处理价格
    changeAmount() {
      var totalAmount = 0

      Promise.all(this.form.contractCargoInfos).then(values => {
        values.forEach((item, index) => {
          if (item.amount && item.price) {
            totalAmount = Number(totalAmount) + Number(Number(item.amount * item.price).toFixed(2))
          }
        })
      }).then(res => {
        this.$nextTick(() => {
          this.form.totalAmount = JSON.parse(JSON.stringify(totalAmount))
        })
      })
    },
    changeCargoData(row, id, type1) {
      row.cargo = this.cargoData.find(item => {
        return item.cargoId === id
      })
      if (type1) {
        this.changeActiveCargoData(type1)
      }
    },
    changeCargoData1(row, id) {
      row.cargo = this.cargoData.find(item => {
        return item.cargoId === id
      })
    },
    changeActiveCargoData(type1, flag) {
      this.activeCargoData = []
      var activeCargoDataList = []
      type1.map(item => {
        if (item.cargo && item.cargo.cargoId) {
          this.activeCargoData.push(item.cargo)
          activeCargoDataList.push(item.cargo.cargoId)
        }
      })
      var arr = [].concat(JSON.parse(JSON.stringify(this.form.contractPortInfos)))
      arr.map(value => {
        if (value && value.cargo && !activeCargoDataList.includes(value.cargo.cargoId)) {
          return false
        } else {
          return true
        }
      })
      this.$nextTick(() => {
        console.log(arr.length, this.form.contractPortInfos.length)
        this.form = JSON.parse(JSON.stringify(this.form))
      })

      if (flag) {
        console.log('changeAmount')
        this.changeAmount()
      }
      console.log(JSON.stringify(this.activeCargoData))
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      const fd = new FormData()
      this.$refs['upload'].uploadFiles.forEach(item => {
        fd.append('file', item.raw)
      })
      fd.append('dataParam', JSON.stringify(this.form))
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
      addContract(fd).then(res => {
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
    doEdit(fd) {
      editContract(fd).then(res => {
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.resetForm()
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
      })
    },
    resetForm() {
      this.dialog = false
      this.recevieList = []
      this.$refs['form'].resetFields()
      this.form = {
        contractCargoInfos: [{ cargo: {}}],
        status: '',
        createdDate: '',
        lastModifiedDate: '',
        createdBy: '',
        lastModifiedBy: '',
        contractPortInfos: [],
        customer: {},
        supplyScope: '',
        contactPhone: '',
        contact: '',
        comments: '',
        cargoData: [],
        totalAmount: ''
      }
    }
  }
}
</script>

<style scoped>
.spanLabel{
  color: #1890ff;
  font-size: 17px;
}
  .spanAdd{
    position: absolute;right: -50px;
  }
</style>
