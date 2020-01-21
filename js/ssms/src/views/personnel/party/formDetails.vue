<template>
  <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="resetForm" :append-to-body="true" width="720px">
    <!-- 上传预览对话框-->
    <el-dialog :visible.sync="innerDialogVisible" :append-to-body="true" width="720px">
      <img v-if="dialogImageUrl !== ''" :src="dialogImageUrl" width="100%" alt="">

      <div>
        <!-- <v-pdf  pdfUrl="../../static/test.pdf" ></v-pdf> -->
        <v-pdf v-if="dialogPdfUrl !== ''" ref="pdf" :pdf-url="dialogPdfUrl"/>
      </div>
    </el-dialog>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="人员详细信息" name="partyInfo">
        <div class="partyIn">
          <el-form ref="formInfo" :model="formInfo" :inline="true" :rules="rules" size="small" label-width="120px">
            <el-form-item label="姓名" >
              <el-input v-model="party.name" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="编号" >
              <el-input v-model="party.code" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item prop="idNumber" label="身份证号">
              <el-input v-model="formInfo.idNumber" placeholder="请输入身份证号" style="width: 200px;" @blur="getName(formInfo.idNumber)"/>
              <!-- <el-input v-model="this.parentDataformInfo.idNumber" placeholder="请输入身份证号" style="width: 200px;" @blur="getName()"/> -->
            </el-form-item>
            <el-form-item class="sex" prop="sex" label="性别">
              <el-radio v-model="formInfo.sex" disabled label="0">男</el-radio>
              <el-radio v-model="formInfo.sex" disabled label="1">女</el-radio>
            </el-form-item>
            <el-form-item prop="age" label="年龄">
              <el-input v-model="formInfo.age" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item prop="birthday" label="出生日期">
              <el-input v-model="formInfo.birthday" type="date" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="生日提醒">
              <el-input v-model="formInfo.birthdayRemind" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item prop="nativePlace" label="籍贯">
              <el-input v-model="formInfo.nativePlace" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item prop="birthanimal" label="生肖">
              <el-input v-model="formInfo.animalZodiac" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="民族">
              <el-input v-model="formInfo.nation" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="曾用名">
              <el-input v-model="formInfo.usedName" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="政治面貌">
              <el-input v-model="formInfo.politicalStatus" style="width: 200px;"/>
            </el-form-item>
            <el-form-item prop="contactMech" label="联系方式">
              <el-input v-model="formInfo.contactMech" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="身高">
              <el-input v-model="formInfo.stature" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="体重">
              <el-input v-model="formInfo.weight" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="血型">
              <el-input v-model="formInfo.bloodType" style="width: 200px;"/>
            </el-form-item>
            <el-form-item prop="education" label="学历">
              <el-input v-model="formInfo.education" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="职业资格">
              <el-input v-model="formInfo.vocationalQualification" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="证书编号">
              <el-input v-model="formInfo.vocationalQualificationNo" style="width: 200px;"/>
            </el-form-item>
            <el-form-item prop="school" label="毕业院校">
              <el-input v-model="formInfo.school" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="毕业专业">
              <el-input v-model="formInfo.major" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="家庭住址">
              <el-input v-model="formInfo.homeAddress" type="textarea" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="实际居住地">
              <el-input v-model="formInfo.residence" type="textarea" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="formInfo.comments" type="textarea" style="width: 200px;"/>
            </el-form-item>
          </el-form>
          <div class="dialogFooter">
            <el-button type="text" @click="cancel">取消</el-button>
            <el-button :loading="loading" type="primary" @click="doSubmit('info')">保存</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="人员入职管理" name="partyEntry">
        <div class="partyEn">
          <el-form ref="formEn" :model="formEn" :inline="true" :rules="rules" size="small" label-width="120px">
            <el-form-item label="部门" >
              <el-input v-model="party.organization.name" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item v-if="party.job !== null" label="岗位" >
              <el-input v-model="party.job.name" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="状态" >
              <el-input v-model="party.status" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="入职类型" prop="partyEntryType">
              <el-select v-model="formEn.partyEntryType" placeholder="请选择">
                <el-option
                  v-for="item in partyEntryTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="社保账号" prop="socialSecurityAccount" >
              <el-input v-model="formEn.socialSecurityAccount" style="width: 200px;"/>
            </el-form-item>
            <el-form-item prop="providentFundAccount" label="公积金账号">
              <el-input v-model="formEn.providentFundAccount" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="银行类型">
              <el-input v-model="formEn.bankType" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="银行卡号">
              <el-input v-model="formEn.bankAccount" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="入职日期" prop="entryDate" >
              <div class="block">
                <el-date-picker v-model="formEn.entryDate" type="date" style="width: 200px;" placeholder="选择入职日期" format="yyyy - MM - dd " value-format="timestamp" @blur="handleConversionDate" @change="handleConversionDate"/>
              </div>
            </el-form-item>
            <el-form-item label="试用期月数" prop="probationMonth" >
              <el-input v-model="probationMonth" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="转正日期">
              <el-input v-model="formEn.conversionDate" disabled="disabled" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="离职日期">
              <div class="block">
                <el-date-picker v-model="formEn.leaveDate" type="date" style="width: 200px;" placeholder="选择离职日期"/>
              </div>
            </el-form-item>
            <el-form-item label="合同到期时间" prop="contractExpirationDate">
              <div class="block">
                <el-date-picker v-model="formEn.contractExpirationDate" type="date" style="width: 200px;" placeholder="选择日期" format="yyyy - MM - dd " value-format="timestamp" @blur="handleContractExpirationDate" />
              </div>
            </el-form-item>
            <el-form-item label="首份合同开始时间">
              <el-date-picker v-model="formEn.firstContractStartDate" type="date" style="width: 200px;" placeholder="首份合同开始时间"/>
            </el-form-item>
            <el-form-item label="合同到期时间提醒">
              <el-input v-model="formEn.contractRemind" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="最近合同开始时间">
              <el-date-picker v-model="formEn.contractStartDate" type="date" style="width: 200px;" placeholder="最近合同开始时间"/>
            </el-form-item>
            <el-form-item label="工龄信息">
              <el-input v-model="formEn.serviceLength" style="width: 200px;" disabled="disabled"/>
            </el-form-item>
            <el-form-item label="公司邮箱地址">
              <el-input v-model="formEn.companyEmail" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="公司集团号码">
              <el-input v-model="formEn.companyGroupPhone" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="紧急联系人">
              <el-input v-model="formEn.emergencyContact" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="紧急联系电话">
              <el-input v-model="formEn.emergencyContactPhone" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="formEn.comments" type="textarea" style="width: 200px;"/>
            </el-form-item>
          </el-form>
          <div class="dialogFooter">
            <el-button type="text" @click="cancel">取消</el-button>
            <el-button :loading="loading" type="primary" @click="doSubmit('entry')">保存</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="附件信息" name="partyType">
        <div class="head-container">
          <el-select v-model="contentType" placeholder="请选择上传类型" class="filter-item" clearable >
            <el-option v-for="item in contentTypes" :key="item.value" :label="item.contentTypeName" :value="item.contentType"/>
          </el-select>
          <el-upload
            ref="upload"
            :http-request= "uploadPartyContent"
            :auto-upload="false"
            :multiple="false"
            :headers="headers"
            :on-preview="handlePictureCardPreview"
            :before-upload="onBeforeUpload"
            class="upload-demo"
            action= ""
            show-file-list
            with-credentials
            accept="image/jpeg,image/jpg,image/gif,image/png,application/pdf"
            list-type="picture-card">
            <el-button slot="trigger" type="info">选取文件</el-button>
            <el-button v-permission="['ADMIN','PARTY_ALL','PARTY_CREATE']" style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpeg/jpg/png/pdf文件，且单个文件不超过10MB</div>
          </el-upload>
        </div>
        <!--表格渲染-->
        <el-table v-loading="loading" :data="partyContents" size="small" style="width: 100%;">
          <el-table-column prop="contentName" label="附件名称"/>
          <el-table-column prop="createdDate" label="创建日期">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createdDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="contentType.contentTypeName" label="附件类型"/>
          <el-table-column v-if="checkPermission(['ADMIN','PARTY_ALL','PARTY_EDIT','PARTY_DELETE'])" label="操作" width="170px" align="center">
            <template slot-scope="scope">
              <el-button icon="el-icon-search" size="mini" @click="preview(scope.row.contentId)"/>
              <el-button v-permission="['ADMIN','PARTY_ALL','PARTY_SELECT']" icon="el-icon-download" size="mini" @click="download(scope.row)"/>
              <el-popover
                v-permission="['ADMIN','PARTY_ALL','PARTY_DELETE']"
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
        <!--分页组件-->
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import pdf from '@/components/pdf'
import { getToken } from '@/utils/auth'
import { getName } from '@/utils/date'
// import { mapGetters } from 'vuex'
import { add, edit } from '@/api/party'
// getContentsByPartyId
import { addPartyInfo, addPartyEntry, editPartyInfo, editPartyEntry } from '@/api/employ'
import { getPartyInfoByPartyId, getPartyEntryByPartyId } from '@/api/employ'
import { getContentsByPartyId } from '@/api/party'
import { getPartyContentType } from '@/api/contentType'
import { uploadPartyContents, contentPreview } from '@/api/content'
import { del } from '@/api/content'
import { parseTime, parseTimeNoMin } from '@/utils/index'
import checkPermission from '@/utils/permission'
// import { log } from 'util'
export default {
  components: { 'v-pdf': pdf },
  props: {
    isDetails: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      pdfCurrentPage: 0,
      pdfPageCount: 0,
      parentData: {},
      party: {},
      pickerOptions: {},
      valueEntry: '',
      valueLeave: '',
      idNumber: '',
      label: '',
      valueTry: '',
      name: '',
      loading: false, dialog: false,
      activeName: 'partyInfo',
      partyId: '',
      value: [],
      partyEntryTypes: [{ value: '全职', label: '全职' }, { value: '兼职', label: '兼职' }],
      formInfo: {
        // 人员基本信息
        partyInfoId: '',
        name: '',
        code: '',
        idNumber: '',
        nation: '',
        sex: '',
        age: '',
        birthday: '',
        birthdayRemind: '',
        politicalStatus: '',
        weight: '',
        stature: '',
        usedName: '',
        bloodType: '',
        contactMech: '',
        school: '',
        major: '',
        vocationlQualification: '',
        education: '',
        vocationlQualificationNo: '',
        homeAddress: '',
        comments: '',
        party: {}
      },
      formEn: {
        // 人员入职信息
        partyEntryId: '',
        party: {},
        idNumber: '',
        label: '',
        conversionDate: '',
        contractExpirationDate: '',
        entryStatus: '',
        partyEntryType: '',
        leaveDate: '',
        socialSecurityAccount: '',
        providentFundAccount: '',
        bankType: '',
        contractStartDate: '',
        firstContractStartDate: '',
        bankAccount: '',
        name: '',
        probationMonth: '',
        entryDate: '',
        serviceLength: '',
        departureDate: '',
        companyEmail: '',
        companyGroupPhone: '',
        emergencyContact: '',
        emergencyContactPhone: '',
        contractRemind: ''
      },
      birthdayRemind: '',
      probationMonth: '',
      rules: {
        idNumber: [{ required: true, message: '请输入身份证ID', trigger: 'blur' },
          { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '你的身份证格式不正确' }],
        education: [
          { required: true, message: '请填写学历信息', trigger: 'blur' }
        ],
        school: [
          { required: true, message: '请填写毕业院校', trigger: 'blur' }
        ],
        contactMech: [{ required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: function(rule, value, callback) {
            if (/^1[345789]\d{9}$/.test(value) === false) {
              callback(new Error('请输入正确的手机号'))
            } else {
              callback()
            }
          }, trigger: 'blur' }],
        partyEntryType: [
          { required: false, message: '请选择入职类型', trigger: 'blur' }
        ],
        socialSecurityAccount: [
          { required: true, message: '请填写社保账号', trigger: 'blur' }
        ],
        providentFundAccount: [
          { required: false, message: '请填写公积金账户', trigger: 'blur' }
        ],
        entryDate: [
          { required: true, message: '请填写入职时间', trigger: 'blur' }
        ],
        contractExpirationDate: [
          { required: false, message: '请填写合同到期时间', trigger: 'blur' }
        ],
        probationMonth: [
          { pattern: /^\d+(\.\d+)?$/, message: '试用期只能是数字', trigger: 'blur' }
        ]
      },
      contentType: '',
      contentTypes: {},
      innerDialogVisible: false,
      dialogImageUrl: '',
      dialogPdfUrl: '',
      headers: { 'Authorization': 'Bearer ' + getToken() },
      delLoading: false,
      partyContents: [],
      contentUrl: '',
      pdfNumPages: undefined,
      area: {
        11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江',
        31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北',
        43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏',
        61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外'
      },
      zodiac: {
        1: '鼠', 2: '牛', 3: '虎', 4: '兔', 5: '龙', 6: '蛇', 7: '马', 8: '羊', 9: '猴', 10: '鸡', 11: '狗', 90: '猪'
      }
    }
  },
  computed: {
  },
  watch: {
    probationMonth() {
      this.handleConversionDate()
    }
  },
  created() {
    this.queryContentType()
    this.$nextTick(() => {
      this.handleConversionDate()
      this.handleContractRemind()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    getName,
    // 删除内容
    deleteContent(contentId) {
      this.delLoading = true
      del(contentId).then(res => {
        this.delLoading = false
        this.$refs[contentId].doClose()
        // this.dleChangePage()
        // this.init()
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
    uploadPartyContent(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      formData.append('contentType', this.contentType)
      formData.append('partyId', this.party.partyId)
      uploadPartyContents(formData).then(response => {
        this.$message.info('上传成功')
        // 上传成功的图片会显示绿色的对勾
        param.onSuccess()
        this.reloadForm()
        // 但是我们上传成功了图片， fileList 里面的值却没有改变，还好有on-change指令可以使用
      }).catch(err => {
        this.$message.error('上传失败')
        param.onError()
        console.log(err)
      })
    },
    submitUpload(file) {
      if (!this.contentType) {
        this.$message.error('请选择上传类型!')
        return
      }
      this.$refs.upload.submit()
    },
    onBeforeUpload(file) {
      const isIMAGE = file.type === 'image/jpeg' || 'image/gif' || 'image/png' || 'application/pdf'
      const isLt10M = file.size / 1024 / 1024 < 10

      if (!isIMAGE) {
        this.$message.error('上传文件只能是图片或者PDF格式!')
      }
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB!')
      }
      return isIMAGE && isLt10M
    },
    preview(contentId) {
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
      var extName = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
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
    queryContentType() {
      getPartyContentType().then(res => {
        this.contentTypes = res.content
      })
    },
    handleContractExpirationDate() {
      if (this.formEn.contractExpirationDate === '') { return }
      // 获取选择的合同到期日期时间戳
      const contractExpirationDate = this.formEn.contractExpirationDate
      // 获取入职日期的时间戳
      const entryDate = this.formEn.entryDate
      // 合同到期日期减去入职日期时间戳 得到之间的天数
      const expireDateN = Math.ceil((contractExpirationDate - entryDate) / (24 * 3600 * 1000))
      if (expireDateN === 0) {
        // this.formEn.expireDate = '今天到期'
        alert('合同到期日期不能与入职日期相同')
      } else if (expireDateN > 0) {
        this.formEn.expireDate = '还剩' + expireDateN + '天'
      } else {
        this.formEn.expireDate = '已到期'
      }
    },
    cancel() {
      this.resetForm()
    },
    reloadForm() {
      getPartyInfoByPartyId(this.party.partyId).then(res => {
        if (res && res.length !== 0) {
          this.formInfo = res
          if (this.formInfo.idNumber) {
            this.getName(this.formInfo.idNumber)
          }
          // console.log('返回值为空')
        } else {
          console.log('getPartyInfoByPartyId返回值为空')
        }
      })
      getPartyEntryByPartyId(this.party.partyId).then(res => {
        console.log(res)
        if (res && res.length !== 0) {
          this.formEn = res
          this.probationMonth = res.probationMonth
        } else {
          console.log('getPartyEntryByPartyId回值为空')
        }
      })
      getContentsByPartyId(this.party.partyId).then(res => {
        this.partyContents = res
      })
    },
    addPartyInfo() {
      this.formInfo.party = this.party
      addPartyInfo(this.formInfo).then(res => {
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.dialog = false
        this.activeName = 'partyInfo'
        // 同步问题，必须在此刷新
        this.reloadForm()
      })
    },
    addPartyEntry() {
      this.formEn.party = this.party
      addPartyEntry(this.formEn).then(res => {
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.dialog = false
        this.activeName = 'partyInfo'
        // 同步问题，必须在此刷新
        this.reloadForm()
      })
    },
    editPartyInfo() {
      // this.formInfo.party = this.party
      editPartyInfo(this.formInfo).then(res => {
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.dialog = false
        this.activeName = 'partyInfo'
        // 同步问题，必须在此刷新
        this.reloadForm()
        // this.$parent.details(this.parentData)
      })
    },
    editPartyEntry() {
      // this.formEn.party = this.party
      editPartyEntry(this.formEn).then(res => {
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.dialog = false
        this.activeName = 'partyInfo'
        // 同步问题，必须在此刷新
        this.reloadForm()
      })
    },
    doSubmit(para) {
      let isFormInfoValid = false
      let isFormEnValid = false
      this.$refs['formInfo'].validate((valid) => {
        if (valid) {
          isFormInfoValid = true
        } else {
          this.$message.error('请完善人员详细信息中的必填信息!')
        }
      })
      this.$refs['formEn'].validate((valid) => {
        if (valid) {
          isFormEnValid = true
        } else {
          this.$message.error('请完善人员入职管理必填信息!')
        }
      })
      if (!isFormInfoValid || !isFormEnValid) { return false }
      if (para === 'info') {
        if (this.formInfo.partyInfoId === '') {
          this.addPartyInfo()
        } else {
          this.editPartyInfo()
        }
      } else if (para === 'entry') {
        this.formEn.probationMonth = this.probationMonth
        if (this.formEn.partyEntryId === '') {
          this.addPartyEntry()
        } else {
          this.editPartyEntry()
        }
      }

      // this.$parent.details(this.party)
      // this.loading = true
      // if (this.isAdd) {
      //   this.doAdd()
      // } else {
      //   this.doEdit()
      // }
    },
    // tabs转换点击事件
    handleClick(tab, event) {
    },
    // 级联选择器
    handleChange(value) {
    },
    doAdd() {
      add(this.form).then(res => {
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
    doEdit() {
      edit(this.form).then(res => {
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
    resetForm() {
      this.activeName = 'partyInfo'
      this.dialog = false
      this.$refs['formInfo'].resetFields()
      this.formInfo = {
        partyInfoId: '',
        partyId: '',
        name: '',
        idNumber: '',
        nation: '',
        sex: '',
        birthday: '',
        politicalStatus: '',
        party: {},
        weight: '',
        stature: '',
        usedName: '',
        bloodType: '',
        contactMech: '',
        school: '',
        major: '',
        vocationlQualification: '',
        education: '',
        vocationlQualificationNo: '',
        homeAddress: '',
        comments: ''
      }
      this.formEn = {
        // 人员入职信息
        partyEntryId: '',
        party: {},
        idNumber: '',
        label: '',
        conversionDate: '',
        contractExpirationDate: '',
        entryStatus: '',
        partyEntryType: '',
        leaveDate: '',
        socialSecurityAccount: '',
        providentFundAccount: '',
        bankType: '',
        contractStartData: '',
        firstContractStartData: '',
        bankAccount: '',
        name: '',
        probationMonth: '',
        entryDate: '',
        serviceLength: '',
        departureDate: '',
        companyEmail: '',
        companyGroupPhone: '',
        emergencyContact: '',
        emergencyContactPhone: '',
        expireDate: ''
      }
    },
    handleConversionDate() {
      if (this.formEn.entryDate === '') { return }
      if (this.probationMonth === '') { return }
      const newDate = new Date(this.formEn.entryDate)
      const probationMonth = this.probationMonth
      let months = newDate.getMonth() + probationMonth % 12
      var years = newDate.getFullYear() + parseInt(probationMonth / 12)
      if (months > 12) {
        years++
        months = months - 12
      }
      newDate.setFullYear(years)
      newDate.setMonth(months)
      this.formEn.conversionDate = parseTimeNoMin(newDate)
    }
  }
}
</script>
<style scoped>
.dialogFooter{
  float: right;
}
.sex{
  margin-right: 104px;
}
.pdf{
  border: 2px solid aqua;
}

</style>
