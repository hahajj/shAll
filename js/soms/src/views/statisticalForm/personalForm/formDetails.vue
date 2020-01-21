<template>
  <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :append-to-body="true" width="720px">
    <!-- 上传预览对话框-->
    <el-dialog :visible.sync="innerDialogVisible" :append-to-body="true" width="720px">
      <img v-if="dialogImageUrl !== ''" :src="dialogImageUrl" width="100%" alt="">
      <div>
        <!-- <v-pdf  pdfUrl="../../static/test.pdf" ></v-pdf> -->
        <v-pdf v-if="dialogPdfUrl !== ''" ref="pdf" :pdf-url="dialogPdfUrl"/>
      </div>
    </el-dialog>
    <el-tabs v-model="activeName">
      <el-tab-pane label="人员详细信息" name="partyInfo">
        <div class="partyIn">
          <el-form ref="formInfo" :model="formInfo" :inline="true" size="small" label-width="120px">
            <el-form-item label="姓名" >
              <el-input v-model="formInfo.name" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="编号" >
              <el-input v-model="formInfo.code" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item prop="idNumber" label="身份证号">
              <el-input v-model="formInfo.idNumber" placeholder="请输入身份证号" disabled="disabled" style="width: 200px;" />
            </el-form-item>
            <el-form-item class="sex" prop="sex" label="性别">
              <el-input v-model="formInfo.sex" disabled="disabled" style="width: 200px;"/>
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
              <el-input v-model="formInfo.nation" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="曾用名">
              <el-input v-model="formInfo.usedName" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="政治面貌">
              <el-input v-model="formInfo.politicalStatus" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item prop="contactMech" label="联系方式">
              <el-input v-model="formInfo.contactMech" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="身高">
              <el-input v-model="formInfo.stature" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="体重">
              <el-input v-model="formInfo.weight" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="血型">
              <el-input v-model="formInfo.bloodType" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item prop="education" label="学历">
              <el-input v-model="formInfo.education" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="职业资格">
              <el-input v-model="formInfo.vocationalQualification" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="证书编号">
              <el-input v-model="formInfo.vocationalQualificationNo" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item prop="school" label="毕业院校">
              <el-input v-model="formInfo.school" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="毕业专业">
              <el-input v-model="formInfo.major" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="家庭住址">
              <el-input v-model="formInfo.homeAddress" disabled="disabled" type="textarea" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="实际居住地">
              <el-input v-model="formInfo.residence" disabled="disabled" type="textarea" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="formInfo.comments" disabled="disabled" type="textarea" style="width: 200px;"/>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="人员入职信息" name="partyEntry">
        <div class="partyEn">
          <el-form ref="formEn" :model="formInfo" :inline="true" size="small" label-width="120px">
            <el-form-item label="部门" >
              <el-input v-model="formInfo.organization" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item v-if="formInfo.job !== null" label="岗位" >
              <el-input v-model="formInfo.job" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="状态" >
              <el-input v-model="formInfo.status" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="入职类型" prop="partyEntryType">
              <el-input v-model="formInfo.partyEntryType" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="社保账号" prop="socialSecurityAccount" >
              <el-input v-model="formInfo.socialSecurityAccount" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="人员级别" prop="level" >
              <el-input v-model="formInfo.level" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item prop="providentFundAccount" label="公积金账号">
              <el-input v-model="formInfo.providentFundAccount" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="银行类型">
              <el-input v-model="formInfo.bankType" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="银行卡号">
              <el-input v-model="formInfo.bankAccount" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="入职日期" prop="entryDate" >
              <el-input v-model="formInfo.entryDate" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="试用期月数" prop="probationMonth" >
              <el-input v-model="formInfo.probationMonth" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="转正日期">
              <el-input v-model="formInfo.conversionDate" disabled="disabled" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="离职日期">
              <el-input v-model="formInfo.leaveDate" disabled="disabled" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="合同到期时间" prop="contractExpirationDate">
              <el-input v-model="formInfo.contractExpirationDate" disabled="disabled" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="首份合同开始时间">
              <el-input v-model="formInfo.firstContractStartDate" disabled="disabled" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="合同到期时间提醒">
              <el-input v-model="formInfo.contractRemind" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="最近合同开始时间">
              <el-input v-model="formInfo.contractStartDate" disabled="disabled" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="工龄信息">
              <el-input v-model="formInfo.serviceLength" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="公司邮箱地址">
              <el-input v-model="formInfo.companyEmail" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="公司集团号码">
              <el-input v-model="formInfo.companyGroupPhone" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="紧急联系人">
              <el-input v-model="formInfo.emergencyContact" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="紧急联系电话">
              <el-input v-model="formInfo.emergencyContactPhone" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="formInfo.comments" type="textarea" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import pdf from '@/components/pdf'
export default {
  components: { 'v-pdf': pdf },
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
      level: [],
      formInfo: {
        // 人员基本信息
        partyInfoId: '',
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
        party: {},
        partyEntryId: '',
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
        contractRemind: '',
        level: '',
        vocationalQualification: '',
        vocationalQualificationNo: ''
      },
      birthdayRemind: '',
      probationMonth: '',
      contentType: '',
      contentTypes: {},
      innerDialogVisible: false,
      dialogImageUrl: '',
      dialogPdfUrl: '',
      // headers: { 'Authorization': 'Bearer ' + getToken() },
      delLoading: false,
      partyContents: [],
      contentUrl: '',
      pdfNumPages: undefined
    }
  }
}
</script>
<style scoped>
.sex{
  margin-right: 104px;
}
.pdf{
  border: 2px solid aqua;
}

</style>
