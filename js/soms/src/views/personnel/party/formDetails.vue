<template>
  <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="resetForm" :append-to-body="true" width="720px">
    <el-dialog :visible.sync="innerDialogVisible" :append-to-body="true" width="720px">
      <img v-if="dialogImageUrl !== ''" :src="dialogImageUrl" width="100%" alt="">
      <!-- 上传预览对话框-->
      <div>
        <!-- <v-pdf  pdfUrl="../../static/test.pdf" ></v-pdf> -->
        <v-pdf v-if="dialogPdfUrl !== ''" ref="pdf" :pdf-url="dialogPdfUrl"/>
      </div>
    </el-dialog>
    <el-tabs v-model="activeName" :before-leave="beforeLeave" @tab-click="handleClick">
      <el-tab-pane label="人员详细信息" name="partyInfo">
        <div class="partyIn">
          <el-form ref="formInfo" :model="formInfo" :inline="true" :rules="rules" size="small" label-width="120px">
            <el-form-item label="姓名" >
              <el-input v-model="party.name" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="编号">
              <el-input v-model="party.code" disabled="disabled" style="width: 200px;"/>
            </el-form-item>
            <el-form-item prop="idNumber" label="身份证号">
              <el-input v-model="formInfo.idNumber" placeholder="请输入身份证号" style="width: 200px;" @blur="getName(formInfo.idNumber)"/>
              <!-- <el-input v-model="this.parentDataformInfo.idNumber" placeholder="请输入身份证号" style="width: 200px;" @blur="getName()"/> -->
            </el-form-item>
            <el-form-item class="sex" prop="sex" label="性别">
              <el-radio v-model="formInfo.sex" disabled label="男">男</el-radio>
              <el-radio v-model="formInfo.sex" disabled label="女">女</el-radio>
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
            <el-form-item label="人员级别">
              <el-select v-model="formEn.level" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
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
              <el-input-number v-model="probationMonth" :min="0" :max="12" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label="转正日期">
              <el-input v-model="formEn.conversionDate" disabled="disabled" style="width: 200px;" />
            </el-form-item>
            <el-form-item label="离职日期">
              <div class="block">
                <el-date-picker v-model="formEn.departureDate" type="date" style="width: 200px;" placeholder="选择离职日期"/>
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
            :on-change="onBeforeUpload"
            :file-list="fileList"
            class="upload-demo"
            action= ""
            show-file-list
            with-credentials
            accept="image/jpeg,image/jpg,image/gif,image/png,application/pdf"
            list-type="picture-card">
            <el-button slot="trigger" type="info">选取文件</el-button>
            <el-button v-permission="['ADMIN','PARTY_ALL','PARTY_CREATE']" :loading="submitUploadLoading" style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
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
      submitUploadLoading: false,
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
      options: [
        {
          value: 'L1-1',
          label: 'L1-1'
        },
        {
          value: 'L2总经理级-1',
          label: 'L2总经理级-1'
        }, {
          value: 'L2总经理级-2',
          label: 'L2总经理级-2'
        }, {
          value: 'L2总经理级-3',
          label: 'L2总经理级-3'
        }, {
          value: 'L2总经理级-4',
          label: 'L2总经理级-4'
        }, {
          value: 'L2总经理级-5',
          label: 'L2总经理级-5'
        },
        {
          value: 'L3副总级-1',
          label: 'L3副总级-1'
        }, {
          value: 'L3副总级-2',
          label: 'L3副总级-2'
        }, {
          value: 'L3副总级-3',
          label: 'L3副总级-3'
        }, {
          value: 'L3副总级-4',
          label: 'L3副总级-4'
        }, {
          value: 'L3副总级-5',
          label: 'L3副总级-5'
        }, {
          value: 'L3副总级-6',
          label: 'L3副总级-6'
        },
        {
          value: 'L4总监级-1',
          label: 'L4总监级-1'
        }, {
          value: 'L4总监级-2',
          label: 'L4总监级-2'
        }, {
          value: 'L4总监级-3',
          label: 'L4总监级-3'
        }, {
          value: 'L4总监级-4',
          label: 'L4总监级-4'
        }, {
          value: 'L4总监级-5',
          label: 'L4总监级-5'
        }, {
          value: 'L4总监级-6',
          label: 'L4总监级-6'
        }, {
          value: 'L4总监级-7',
          label: 'L4总监级-7'
        }, {
          value: 'L4总监级-8',
          label: 'L4总监级-8'
        }, {
          value: 'L4总监级-9',
          label: 'L4总监级-9'
        },
        {
          value: 'L5总监助理级-1',
          label: 'L5总监助理级-1'
        }, {
          value: 'L5总监助理级-2',
          label: 'L5总监助理级-2'
        }, {
          value: 'L5总监助理级-3',
          label: 'L5总监助理级-3'
        }, {
          value: 'L5总监助理级-4',
          label: 'L5总监助理级-4'
        }, {
          value: 'L5总监助理级-5',
          label: 'L5总监助理级-5'
        }, {
          value: 'L5总监助理级-6',
          label: 'L5总监助理级-6'
        },
        {
          value: 'L6经理级-1',
          label: 'L6经理级-1'
        }, {
          value: 'L6经理级-2',
          label: 'L6经理级-2'
        }, {
          value: 'L6经理级-3',
          label: 'L6经理级-3'
        }, {
          value: 'L6经理级-4',
          label: 'L6经理级-4'
        }, {
          value: 'L6经理级-5',
          label: 'L6经理级-5'
        }, {
          value: 'L6经理级-6',
          label: 'L6经理级-6'
        }, {
          value: 'L6经理级-7',
          label: 'L6经理级-7'
        }, {
          value: 'L6经理级-8',
          label: 'L6经理级-8'
        }, {
          value: 'L6经理级-9',
          label: 'L6经理级-9'
        },
        {
          value: 'L7副经理级-1',
          label: 'L7副经理级-1'
        }, {
          value: 'L7副经理级-2',
          label: 'L7副经理级-2'
        }, {
          value: 'L7副经理级-3',
          label: 'L7副经理级-3'
        }, {
          value: 'L7副经理级-4',
          label: 'L7副经理级-4'
        }, {
          value: 'L7副经理级-5',
          label: 'L7副经理级-5'
        }, {
          value: 'L7副经理级-6',
          label: 'L7副经理级-6'
        },
        {
          value: 'L8主管级-1',
          label: 'L8主管级-1'
        }, {
          value: 'L8主管级-2',
          label: 'L8主管级-2'
        }, {
          value: 'L8主管级-3',
          label: 'L8主管级-3'
        }, {
          value: 'L8主管级-4',
          label: 'L8主管级-4'
        }, {
          value: 'L8主管级-5',
          label: 'L8主管级-5'
        }, {
          value: 'L8主管级-6',
          label: 'L8主管级-6'
        },
        {
          value: 'L9副主管级-1',
          label: 'L9副主管级-1'
        }, {
          value: 'L9副主管级-2',
          label: 'L9副主管级-2'
        }, {
          value: 'L9副主管级-3',
          label: 'L9副主管级-3'
        }, {
          value: 'L9副主管级-4',
          label: 'L9副主管级-4'
        }, {
          value: 'L9副主管级-5',
          label: 'L9副主管级-5'
        }, {
          value: 'L9副主管级-6',
          label: 'L9副主管级-6'
        },
        {
          value: 'L10主办级-1',
          label: 'L10主办级-1'
        }, {
          value: 'L10主办级-2',
          label: 'L10主办级-2'
        }, {
          value: 'L10主办级-3',
          label: 'L10主办级-3'
        }, {
          value: 'L10主办级-4',
          label: 'L10主办级-4'
        }, {
          value: 'L10主办级-5',
          label: 'L10主办级-5'
        }, {
          value: 'L10主办级-6',
          label: 'L10主办级-6'
        },
        {
          value: 'L11副主办级-1',
          label: 'L11副主办级-1'
        }, {
          value: 'L11副主办级-2',
          label: 'L11副主办级-2'
        }, {
          value: 'L11副主办级-3',
          label: 'L11副主办级-3'
        }, {
          value: 'L11副主办级-4',
          label: 'L11副主办级-4'
        }, {
          value: 'L11副主办级-5',
          label: 'L11副主办级-5'
        }, {
          value: 'L11副主办级-6',
          label: 'L11副主办级-6'
        }, {
          value: 'L11副主办级-7',
          label: 'L11副主办级-7'
        }, {
          value: 'L11副主办级-8',
          label: 'L11副主办级-8'
        },
        {
          value: 'L12作业员级-1',
          label: 'L12作业员级-1'
        }, {
          value: 'L12作业员级-2',
          label: 'L12作业员级-2'
        }, {
          value: 'L12作业员级-3',
          label: 'L12作业员级-3'
        }, {
          value: 'L12作业员级-4',
          label: 'L12作业员级-4'
        }, {
          value: 'L12作业员级-5',
          label: 'L12作业员级-5'
        }, {
          value: 'L12作业员级-6',
          label: 'L12作业员级-6'
        }, {
          value: 'L12作业员级-7',
          label: 'L12作业员级-7'
        }, {
          value: 'L12作业员级-8',
          label: 'L12作业员级-8'
        }, {
          value: 'L12作业员级-9',
          label: 'L12作业员级-9'
        }, {
          value: 'L12作业员级-10',
          label: 'L12作业员级-10'
        }
      ],
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
        contractRemind: '',
        level: ''
      },
      birthdayRemind: '',
      probationMonth: '',
      fileList: [],
      oldFormInfo: '',
      oldFormEn: '',
      oldFormEnInit: 1,
      oldProbationMonth: '',
      lastTabName: '',
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
        // socialSecurityAccount: [
        //   { required: true, message: '请填写社保账号', trigger: 'blur' }
        // ],
        // level: [
        //   { required: false, message: '请填写人员级别', trigger: 'blur' }
        // ],
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
      // this.handleConversionDate()
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
      this.submitUploadLoading = true
      this.$refs.upload.submit()
    },
    onBeforeUpload(file) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png', 'image/jpg', 'application/pdf']
      const isImage = types.includes(file.raw.type)
      const isLt10M = file.raw.size / 1024 / 1024 < 10

      if (!isImage) {
        this.$message.error('上传文件只能是图片或者PDF格式!')
        this.fileList.pop()
        return false
      }
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB!')
        this.fileList.pop()
        return false
      }
      this.submitUploadLoading = false
      return isImage && isLt10M
    },
    preview(contentId) {
      contentPreview(contentId).then(res => {
        this.innerDialogVisible = true
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
      this.innerDialogVisible = true
      if (extName === '.pdf') {
        this.dialogPdfUrl = file.url
        this.dialogImageUrl = ''
        this.$refs.pdf.loadFile(file.url)
      } else {
        this.dialogPdfUrl = ''
        this.dialogImageUrl = file.url
      }
      // this.dialogImageUrl = file.url
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
      if (expireDateN < 0 || expireDateN === 0) {
        // this.formEn.expireDate = '今天到期'
        alert('请选择大于入职日期的合同到期日期')
        this.formEn.contractExpirationDate = ''
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
          if (this.formInfo.idNumber) {
            this.getName(res.idNumber)
          }
          this.formInfo = res
          this.formInfo.birthday = parseTimeNoMin(this.formInfo.birthday)
          this.oldFormInfo = JSON.stringify(res)
        } else {
          this.oldFormInfo = JSON.stringify(this.formInfo)
          console.log('getPartyInfoByPartyId返回值为空')
        }
      })
      getPartyEntryByPartyId(this.party.partyId).then(res => {
        if (res && res.length !== 0) {
          this.formEn = res
          this.oldFormEn = JSON.stringify(res)
          this.oldFormEnInit = 0
          this.probationMonth = res.probationMonth
          this.oldProbationMonth = res.probationMonth
          this.handleConversionDate()
        } else {
          this.oldFormEnInit = 1
          this.oldFormEn = JSON.stringify(this.formEn)
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
        // this.dialog = false
        // this.activeName = 'partyInfo'
        // 预防加载慢新旧值不等
        this.oldFormInfo = JSON.stringify(this.formInfo)
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
        // this.dialog = false
        // this.activeName = 'partyEntry'
        // 预防加载慢新旧值不等
        this.oldFormEn = JSON.stringify(this.formEn)
        this.oldFormEnInit = 1
        if (this.probationMonth) {
          this.oldProbationMonth = this.probationMonth
        } else {
          this.oldProbationMonth = 0
        }
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
        // this.dialog = false
        // this.activeName = 'partyInfo'
        // 预防加载慢新旧值不等
        this.oldFormInfo = JSON.stringify(this.formInfo)
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
        // this.dialog = false
        // this.activeName = 'partyEntry'
        // 预防加载慢新旧值不等
        this.oldFormEn = JSON.stringify(this.formEn)
        this.oldFormEnInit = 1
        if (this.probationMonth) {
          this.oldProbationMonth = this.probationMonth
        } else {
          this.oldProbationMonth = 0
        }
        // 同步问题，必须在此刷新
        this.reloadForm()
      })
    },
    doSubmit(para) {
      // let isFormInfoValid = false
      // let isFormEnValid = false
      // if (!isFormInfoValid || !isFormEnValid) { return false }
      if (para === 'info') {
        // 验证详细信息
        this.$refs['formInfo'].validate((valid) => {
          if (valid) {
            // isFormInfoValid = true
            // this.$refs['formEn'].resetFields()
            if (this.formInfo.partyInfoId === '') {
              this.addPartyInfo()
            } else {
              this.editPartyInfo()
            }
          } else {
            this.$message.error('请完善人员详细信息中的必填信息!')
          }
        })
      } else if (para === 'entry') {
        // 验证入职信息
        this.$refs['formEn'].validate((valid) => {
          if (valid) {
            // isFormEnValid = true
            // this.$refs['formInfo'].resetFields()
            this.formEn.probationMonth = this.probationMonth
            if (this.formEn.partyEntryId === '') {
              this.addPartyEntry()
            } else {
              this.editPartyEntry()
            }
          } else {
            this.$message.error('请完善人员入职管理必填信息!')
          }
        })
      }

      // this.$parent.details(this.party)
      // this.loading = true
      // if (this.isAdd) {
      //   this.doAdd()
      // } else {
      //   this.doEdit()
      // }
    },
    beforeLeave(activeName, oldActiveName) {
      this.lastTabName = oldActiveName
    },
    // tabs转换点击事件
    handleClick(tab, event) {
      if (this.lastTabName === 'partyInfo') {
        this.formInfoChange(tab)
      }
      if (this.lastTabName === 'partyEntry') {
        this.formEnChange(tab)
      }
    },
    // 判断人员详细信息是否更改
    formInfoChange(tab) {
      const newVal = JSON.stringify(this.formInfo)
      const oldVal = this.oldFormInfo
      if (newVal !== oldVal) {
        this.$confirm('是否保存人员详细信息的更改', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doSubmit('info')
        }).catch(() => {
          this.formInfo = JSON.parse(this.oldFormInfo)
        })
      }
    },
    // 判断人员入职管理是否改变
    formEnChange() {
      const s = JSON.stringify(this.formEn)
      if (this.oldFormEnInit === 0) {
        delete this.formEn.conversionDate
      }
      const newVal = JSON.stringify(this.formEn)
      const oldVal = this.oldFormEn
      if (newVal !== oldVal || this.oldProbationMonth !== this.probationMonth) {
        this.$confirm('是否保存人员入职管理的更改', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.formEn = JSON.parse(s)
          this.formEn.probationMonth = this.probationMonth
          this.doSubmit('entry')
        }).catch(() => {
          this.formEn = JSON.parse(this.oldFormEn)
          if (this.probationMonth === this.oldProbationMonth) {
            this.handleConversionDate()
          } else {
            this.probationMonth = this.oldProbationMonth
          }
        })
      } else {
        this.formEn.conversionDate = JSON.parse(s).conversionDate
      }
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
      this.isFormInfoChange = false
      this.isFormEnChange = false
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
      this.fileList = []
    },
    handleConversionDate() {
      if (this.formEn.entryDate === '') {
        this.formEn.conversionDate = ''
        return
      }
      if (this.probationMonth === '') {
        this.formEn.conversionDate = ''
        return
      }
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
