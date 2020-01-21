<template>
  <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :append-to-body="true" width="720px">
    <!-- 上传预览对话框-->
    <el-dialog :visible.sync="innerDialogVisible" :append-to-body="true" width="50%">
      <img :src="dialogImageUrl" width="100%" alt="">
    </el-dialog>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="人员详细信息" name="partyInfo">
        <div class="partyIn">
          <el-form ref="formInfo" :model="formInfo" :inline="true" :rules="rules" size="small" label-width="120px">
            <el-form-item label="姓名" >
              <el-input v-model="party.name" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item prop="idNumber" label="身份证号">
              <el-input v-model="formInfo.idNumber" placeholder="请输入身份证号" style="width: 200px;" @blur="getName(formInfo.idNumber)"/>
            </el-form-item>
            <el-form-item class="sex" prop="sex" label="性别">
              <el-radio-group v-model="formInfo.sex" disabled="disabled">
                <el-radio :label="0">男</el-radio>
                <el-radio :label="1">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="age" label="年龄">
              <el-input v-model="formInfo.age" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item prop="birthday" label="出生日期">
              <el-input v-model="formInfo.birthday" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item prop="birthplace" label="籍贯">
              <el-input v-model="formInfo.birthplace" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item prop="birthanimal" label="生肖">
              <el-input v-model="formInfo.birthanimal" disabled="disabled" style="width: 200px;"/>
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
            <!-- <el-form-item label="party" >
              <el-input v-model="formInfo.party.partyId" style="width: 200px;"/>
            </el-form-item> -->
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
            <!-- <el-form-item label="部门" >
              <el-input v-model="formEn.party.organization" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="岗位" >
              <el-input v-model="formEn.party.job" style="width: 200px;"/>
            </el-form-item> -->
            <el-form-item label="编号" >
              <el-input v-model="party.code" style="width: 200px;"/>
            </el-form-item>
            <!-- <el-form-item label="状态" >
              <el-input v-model="formEn.entryStatus" style="width: 200px;"/>
            </el-form-item> -->
            <el-form-item label="入职类型">
              <el-input v-model="formEn.partyEntryType" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="社保账号">
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
            <el-form-item label="入职日期">
              <div class="block">
                <el-date-picker v-model="formEn.entryDate" type="date" style="width: 200px;" placeholder="选择入职日期" @blur="blurs"/>
              </div>
            </el-form-item>
            <el-form-item label="试用期">
              <div class="block">
                <el-date-picker v-model="valueTry" type="date" style="width: 200px;" placeholder="选择试用日期" @blur="blurs"/>
              </div>
            </el-form-item>
            <el-form-item label="转正日期">
              <el-input v-model="official" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="离职日期">
              <div class="block">
                <el-date-picker v-model="valueLeave" type="date" style="width: 200px;" placeholder="选择离职日期"/>
              </div>
            </el-form-item>
            <el-form-item label="合同到期时间">
              <el-input v-model="formEn.contractExpirationDate" style="width: 200px;"/>
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
            accept="image/jpeg,image/gif,image/png"
            list-type="picture-card">
            <el-button slot="trigger" type="info">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且单个文件不超过10MB</div>
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
              <el-button icon="el-icon-download" size="mini" @click="download(scope.row)"/>
              <el-popover
                v-permission="['ADMIN','CONTENT_ALL','CONTENT_DELETE']"
                :ref="scope.row.contentId"
                placement="top"
                width="180">
                <p>确定删除本条数据吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.contentId].doClose()">取消</el-button>
                  <el-button :loading="delLoading" type="primary" size="mini" @click="deleteContent(scope.row.contentId)">确定</el-button>
                </div>
              </el-popover>
              <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import { getToken } from '@/utils/auth'
// import { mapGetters } from 'vuex'
import { add, edit } from '@/api/party'
// getContentsByPartyId
import { addPartyInfo, addPartyEntry } from '@/api/employ'
import { getPartyContentType } from '@/api/contentType'
import { uploadPartyContents, contentPreview } from '@/api/content'
import { del } from '@/api/content'
import { parseTime } from '@/utils/index'
import checkPermission from '@/utils/permission'
export default {
  props: {
  },
  data() {
    return {
      party: {},
      pickerOptions: {},
      valueEntry: '',
      valueLeave: '',
      valueTry: '',
      official: '',
      loading: false, dialog: false,
      activeName: 'partyInfo',
      partyId: '',
      value: [],
      options: [{ value: '', label: '' }],
      formInfo: {
        // 人员基本信息
        name: '',
        idNumber: '',
        nation: '',
        sex: '',
        birthday: '',
        politicalStatus: '',
        partyId: '',
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
      },
      formEn: {
        // 人员入职信息
        partyId: '',
        form: '',
        code: '',
        party: {},
        entryStatus: '',
        partyEntryType: '',
        socialSecurityAccount: '',
        providentFundAccount: '',
        bankType: '',
        bankAccount: '',
        probationMonth: '',
        entryDate: '',
        departureDate: '',
        contractExpirationDate: '',
        companyEmail: '',
        companyGroupPhone: '',
        emergencyContact: '',
        emergencyContactPhone: ''
      },
      rules: {
        idNumber: [
          { required: true, message: '请填写证件号码', trigger: 'blur' },
          {}
        ],
        education: [
          { required: true, message: '请填写学历信息', trigger: 'blur' }
        ],
        school: [
          { required: true, message: '请填写毕业院校', trigger: 'blur' }
        ],
        contactMech: [
          { required: true, message: '请填写联系方式', trigger: 'blur' }
        ],
        providentFundAccount: [
          { required: true, message: '请填写公积金账户', trigger: 'blur' }
        ]
      },
      contentType: '',
      contentTypes: {},
      innerDialogVisible: false,
      dialogImageUrl: '',
      headers: { 'Authorization': 'Bearer ' + getToken() },
      delLoading: false,
      partyContents: [],
      parentData: '',
      contentUrl: '',
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
  // computed: {
  //   ...mapGetters([
  //     'uploadPartyContentsApi'
  //   ])
  // },
  created() {
    this.queryContentType()
  },
  methods: {
    parseTime,
    checkPermission,
    // 删除内容
    deleteContent(contentId) {
      this.delLoading = true
      del(contentId).then(res => {
        this.delLoading = false
        this.$refs[contentId].doClose()
        // this.dleChangePage()
        // this.init()
        this.$parent.details(this.parentData)
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
      formData.append('partyId', this.form.partyId)
      uploadPartyContents(formData).then(response => {
        this.$message.info('上传成功')
        // 上传成功的图片会显示绿色的对勾
        param.onSuccess()
        this.$parent.details(this.parentData)
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
      const isIMAGE = file.type === 'image/jpeg' || 'image/gif' || 'image/png'
      const isLt10M = file.size / 1024 / 1024 < 10

      if (!isIMAGE) {
        this.$message.error('上传文件只能是图片格式!')
      }
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 1MB!')
      }
      return isIMAGE && isLt10M
    },
    preview(contentId) {
      this.innerDialogVisible = true
      contentPreview(contentId).then(res => {
        if (!res) { this.$message.error('文件不存在') }
        const URL = window.URL || window.webkitURL
        const bloburl = URL.createObjectURL(res)
        this.dialogImageUrl = bloburl
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
      this.dialogImageUrl = file.url
      this.innerDialogVisible = true
    },
    queryContentType() {
      getPartyContentType().then(res => {
        this.contentTypes = res.content
      })
    },
    // 转正日期
    blurs() {
      // 获取试用期日期 转时间戳
      const valueTry = this.valueTry.getTime()
      const valueOfficial = valueTry + 24 * 3600 * 1000
      const valueOfficialt = new Date(valueOfficial)
      var year = valueOfficialt.getFullYear()
      var month = valueOfficialt.getMonth() + 1
      var day = valueOfficialt.getDate()
      const valueAdd = year + '-' + month + '-' + day
      this.official = valueAdd

      // alert(official)
    },
    getName(iden) {
      // 自动生成生日性别年龄
      const val = iden.length
      let sex = null
      const myDate = new Date()
      const zodiac = ['子鼠', '丑牛', '寅虎', '卯兔', '辰龙', '巳蛇', '午马', '未羊', '申猴', '酉鸡', '戌狗', '亥猪']
      const month = myDate.getMonth() + 1
      const day = myDate.getDate()
      let birth = null
      let age = 0
      if (val === 18) {
        age = myDate.getFullYear() - iden.substring(6, 10) - 1
        sex = iden.substring(16, 17)
        birth = iden.substring(6, 10) + '-' + iden.substring(10, 12) + '-' + iden.substring(12, 14)
        if (iden.substring(10, 12) < month || iden.substring(10, 12) === month && iden.substring(12, 14) <= day) age++
      }
      if (val === 15) {
        age = myDate.getFullYear() - iden.substring(6, 8) - 1901
        sex = iden.substring(13, 14)
        birth = '19' + iden.substring(6, 8) + '-' + iden.substring(8, 10) + '-' + iden.substring(10, 12)
        if (iden.substring(8, 10) < month || iden.substring(8, 10) === month && iden.substring(10, 12) <= day) age++
      }
      if (sex % 2 === 0) { sex = 1 } else { sex = 0 }
      this.formInfo.sex = sex
      this.formInfo.age = age
      this.formInfo.birthday = birth
      this.formInfo.birthplace = this.area[iden.substring(0, 2)]
      // 生日初想法
      // const happybirth = (+iden.substring(10,12))
      // if( happybirth - month < 0){ alert('生日已过')}
      // 计算生肖 得到年份设定从1804开始计算
      this.formInfo.birthanimal = zodiac[(iden.substring(6, 10) - 1804) % 12]
      // this.getDataInfo()
    },
    cancel() {
      this.resetForm()
    },
    addPartyInfo() {
      this.formInfo.party = this.party
      addPartyInfo(this.formInfo).then(res => {
        console.log(res)
      })
    },
    addPartyEntry() {
      this.formEn.party = this.party
      addPartyEntry(this.formEn).then(res => {
        console.log(res)
      })
    },
    doSubmit(para) {
      if (para === 'info') {
        this.addPartyInfo()
      } else if (para === 'entry') {
        this.addPartyEntry()
      }
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
    },
    // tabs转换点击事件
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 级联选择器
    handleChange(value) {
      console.log(value)
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
      this.dialog = false
      // this.$refs['formInfo'].resetFields()
      // this.formInfo = {
      //   partyId: '',
      //   name: ''
      // }
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
</style>
