<template>
  <div>
    <!-- 上传预览对话框-->
    <el-dialog :visible.sync="innerDialogVisible" :append-to-body="true" title="图片预览" width="50%">
      <img
        v-for="(src,index) in dialogImageUrl"
        v-show="dialogImageUrl.length != 0"
        :src="src"
        :key="index"
        preview="11"
        preview-text="图片预览"
        width="200px"
        height="200px">

      <div>
        <!-- <v-pdf  pdfUrl="../../static/test.pdf" ></v-pdf> -->
        <v-pdf v-if="dialogPdfUrl !== ''" ref="pdf" :pdf-url="dialogPdfUrl"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="innerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialog"
      :close-on-click-modal="false"
      :before-close="resetForm"
      :append-to-body="true"
      width="750px">
      <el-tabs v-model="activeName" :before-leave="beforeLeave" @tab-click="handleClick">
        <el-tab-pane label="船员基本信息" name="partyInfo">
          <div class="partyIn">
            <el-form ref="formInfo" :model="formInfo" :inline="true" :rules="rules" size="small" label-width="120px">
              <el-form-item label="姓名">
                <el-input v-model="party.name" disabled="disabled" style="width: 200px;"/>
              </el-form-item>
              <el-form-item label="编号">
                <el-input v-model="party.code" disabled="disabled" style="width: 200px;"/>
              </el-form-item>
              <el-form-item prop="idNumber" label="身份证号">
                <el-input
                  v-model="formInfo.idNumber"
                  placeholder="请输入身份证号"
                  style="width: 200px;"
                  @blur="getName(formInfo.idNumber)"/>
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
        <el-tab-pane label="船员入职管理" name="partyEntry">
          <div class="partyEn">
            <el-form ref="formEn" :model="formEn" :inline="true" :rules="rules" size="small" label-width="120px">
              <el-form-item label="部门">
                <el-input v-model="party.organization.name" disabled="disabled" style="width: 200px;"/>
              </el-form-item>
              <el-form-item v-if="party.job !== null" label="岗位">
                <el-input v-model="party.job.name" disabled="disabled" style="width: 200px;"/>
              </el-form-item>
              <el-form-item label="状态">
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
              <el-form-item label="社保账号" prop="socialSecurityAccount">
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
              <el-form-item label="入职日期" prop="entryDate">
                <div class="block">
                  <el-date-picker
                    v-model="formEn.entryDate"
                    type="date"
                    style="width: 200px;"
                    placeholder="选择入职日期"
                    format="yyyy - MM - dd "
                    value-format="timestamp"
                    @blur="handleConversionDate"
                    @change="handleConversionDate"/>
                </div>
              </el-form-item>
              <el-form-item label="试用期月数" prop="probationMonth">
                <el-input-number v-model="probationMonth" :min="0" :max="12" style="width: 200px;"/>
              </el-form-item>
              <el-form-item label="转正日期">
                <el-input v-model="formEn.conversionDate" disabled="disabled" style="width: 200px;"/>
              </el-form-item>
              <el-form-item label="离职日期">
                <div class="block">
                  <el-date-picker
                    v-model="formEn.departureDate"
                    type="date"
                    style="width: 200px;"
                    placeholder="选择离职日期"/>
                </div>
              </el-form-item>
              <el-form-item label="合同到期时间" prop="contractExpirationDate">
                <div class="block">
                  <el-date-picker
                    v-model="formEn.contractExpirationDate"
                    type="date"
                    style="width: 200px;"
                    placeholder="选择日期"
                    format="yyyy - MM - dd "
                    value-format="timestamp"
                    @blur="handleContractExpirationDate"/>
                </div>
              </el-form-item>
              <el-form-item label="首份合同开始时间">
                <el-date-picker
                  v-model="formEn.firstContractStartDate"
                  type="date"
                  style="width: 200px;"
                  placeholder="首份合同开始时间"/>
              </el-form-item>
              <el-form-item label="合同到期时间提醒">
                <el-input v-model="formEn.contractRemind" disabled="disabled" style="width: 200px;"/>
              </el-form-item>
              <el-form-item label="最近合同开始时间">
                <el-date-picker
                  v-model="formEn.contractStartDate"
                  type="date"
                  style="width: 200px;"
                  placeholder="最近合同开始时间"/>
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
        <el-tab-pane label="船员证书信息" name="partyType">
          <el-form
            ref="certificate"
            :model="certificate"
            :inline="true"
            :rules="rules"
            size="small"
            label-width="120px">
            <el-form-item label="证书编号">
              <el-input v-model="certificate.certificateCode" style="width: 530px;"/>
            </el-form-item>
            <el-form-item label="证书名称" prop="certificateName">
              <el-select v-model="certificate.certificateName" placeholder="请选择" style="width: 530px;">
                <el-option
                  v-for="item in certificateTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="发证机关" prop="certificator">
              <el-input v-model="certificate.certificator" style="width: 530px;"/>
            </el-form-item>
            <el-form-item label="发证日期" prop="fromDate">
              <div class="block">
                <el-date-picker v-model="certificate.fromDate" type="date" style="width: 200px;" placeholder="选择发证日期"/>
              </div>
            </el-form-item>
            <el-form-item label="到期日期">
              <div class="block">
                <el-date-picker v-model="certificate.thruDate" type="date" style="width: 200px;" placeholder="选择到期日期"/>
              </div>
            </el-form-item>
            <div class="head-container" style="margin-left: 53px">
              <el-upload
                ref="upload"
                :auto-upload="false"
                :multiple="false"
                :headers="headers"
                :on-preview="handlePictureCardPreview"
                :on-change="onBeforeUpload"
                :file-list="fileList"
                class="upload-demo"
                action=""
                show-file-list
                with-credentials
                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                list-type="picture-card">
                <el-button slot="trigger" type="info">选取文件</el-button>
                <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="uploadPartyContent">上传到服务器</el-button>-->
                <div slot="tip" class="el-upload__tip">只能上传jpeg/jpg/png/pdf/bmp文件，且单个文件不超过10MB</div>
              </el-upload>
            </div>
            <!--表格渲染-->
            <el-table
              v-loading="loading"
              :data="certificates"
              size="small"
              style="width: 100%;"
              highlight-current-row
              @current-change="handleCertificate">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form
                    v-for="(item,index) in props.row.contents"
                    :key="index"
                    label-position="left"
                    inline
                    class="demo-table-expand">
                    <el-form-item label="图片名称">
                      <span>{{ item.contentName }}</span>
                      <el-button icon="el-icon-search" size="mini" @click="preview(item)"/>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column prop="certificateName" label="证书名称"/>
              <el-table-column prop="certificator" label="发证机关"/>
              <el-table-column prop="fromDate" label="发证日期">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.fromDate) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="thruDate" label="到期日期">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.thruDate) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="certificateCode" label="证书编号"/>
              <!--<el-table-column prop="createdBy.party.name" label="记录人"/>-->
              <!--<el-table-column prop="contentType.contentTypeName" label="附件"/>-->
              <el-table-column
                v-if="checkPermission(['ADMIN','PARTY_ALL','PARTY_EDIT','PARTY_DELETE'])"
                label="操作"
                width="200px"
                align="center">
                <template slot-scope="scope">
                  <!--<el-button v-if="scope.row.contents.length > 0" icon="el-icon-search" size="mini" @click="preview(scope.row)"/>-->
                  <el-button
                    v-if="scope.row.contents.length > 0"
                    icon="el-icon-download"
                    size="mini"
                    @click="download(scope.row)"/>
                  <el-popover
                    v-permission="['ADMIN','CONTENT_ALL','CONTENT_DELETE']"
                    :ref="scope.row.id"
                    placement="top"
                    width="180">
                    <p>确定删除本条数据吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                      <el-button
                        :loading="delLoading"
                        type="primary"
                        size="mini"
                        @click="delCrewCertificate(scope.row.id)">确定
                      </el-button>
                    </div>
                    <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
            <div class="dialogFooter">
              <el-button type="text" @click="cancel">取消</el-button>
              <el-button :loading="loading" type="primary" @click="uploadPartyContent">保存</el-button>
            </div>
          </el-form>
          <!--分页组件-->
        </el-tab-pane>
        <el-tab-pane label="船员海历信息" name="crew">
          <div class="partyEn">
            <el-form ref="calendar" :model="calendar" :inline="true" :rules="rules" size="small" label-width="120px">
              <el-form-item label="公司/船舶" prop="companyName">
                <el-input v-model="calendar.companyName" style="width: 530px;"/>
              </el-form-item>
              <el-form-item label="职务" prop="jobId">
                <!--<el-select v-model="calendar.jobId" clearable style="width: 180px;" filterable placeholder="请选择">-->
                <!--<el-option-->
                <!--v-for="(item, index) in jobs"-->
                <!--:key="item.label + index"-->
                <!--:label="item.label"-->
                <!--:value="item.jobId"/>-->
                <!--</el-select>-->
                <treeselect v-model="calendar.jobId" :options="jobs" style="width: 180px;" placeholder="请选择"/>
              </el-form-item>
              <el-form-item label="在船天数">
                <el-input v-model="dayNum" style="width: 180px;" readonly/>
              </el-form-item>
              <el-form-item label="上船日期" prop="boardingDate">
                <div class="block">
                  <el-date-picker
                    v-model="calendar.boardingDate"
                    type="date"
                    style="width: 180px;"
                    placeholder="选择上船日期"
                    @change="dayNum = dateDiff(calendar.boardingDate,calendar.disembarkDate)"/>
                </div>
              </el-form-item>
              <el-form-item label="下船日期">
                <el-date-picker
                  v-model="calendar.disembarkDate"
                  type="date"
                  style="width: 180px;"
                  placeholder="选择下船日期"
                  @change="dayNum = dateDiff(calendar.boardingDate,calendar.disembarkDate)"/>
              </el-form-item>
              <el-form-item v-for="(domain,index) in crewSaftyRecord" :key="index" :label="'安全记录' + (index+1)">
                <el-input v-model="domain.record" style="width: 450px;"/>
                <el-button @click.prevent="removeDomain(domain)">删除</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" round size="mini" @click="addDomain">新增安全记录</el-button>
              </el-form-item>
            </el-form>
            <!--表格渲染-->
            <el-table
              v-loading="loading"
              :data="calendars"
              size="small"
              style="width: 100%;"
              highlight-current-row
              @current-change="handleCalendar">
              <el-table-column type="expand" label="安全记录" class="el-icon-edit">
                <template slot-scope="scope">
                  <el-form
                    v-for="(item,index) in scope.row.crewSaftyRecord"
                    :key="item.id"
                    label-position="left"
                    inline
                    class="demo-table-expand">
                    <el-form-item :key="item.id" :label="'安全记录' + (index+1) + ':'">
                      <span>{{ item.record }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <!--<el-table-column-->
              <!--type="index"-->
              <!--width="50"-->
              <!--label="序号"/>-->
              <el-table-column prop="companyName" label="公司/船舶"/>
              <el-table-column prop="jobId.name" label="职务"/>
              <el-table-column prop="fromDate" label="上船时间">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.boardingDate) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="thruDate" label="下船时间">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.disembarkDate) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="certificateCode" label="在船天数">
                <template slot-scope="scope">
                  <span>{{ dateDiff(parseTime(scope.row.boardingDate),parseTime(scope.row.disembarkDate)) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="200px"
                align="center">
                <template slot-scope="scope">
                  <!--<el-button v-if="scope.row.contents.length > 0" icon="el-icon-search" size="mini" @click="preview(scope.row)"/>-->
                  <el-popover
                    v-permission="['ADMIN','CREWCALENDAR_ALL','CREWCALENDAR_DELETE']"
                    :ref="scope.row.id"
                    placement="top"
                    width="180">
                    <p>确定删除本条数据吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                      <el-button
                        :loading="delLoading"
                        type="primary"
                        size="mini"
                        @click="delCrewCalendar(scope.row.id)">确定
                      </el-button>
                    </div>
                    <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
            <div class="dialogFooter">
              <el-button type="text" @click="cancel">取消</el-button>
              <el-button :loading="loading" type="primary" @click="doSubmit('crewCalendar')">保存</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable eqeqeq */

import pdf from '@/components/pdf'
import { getToken } from '@/utils/auth'
import { getName } from '@/utils/date'
// import { mapGetters } from 'vuex'
import { add, edit } from '@/api/party'
// getContentsByPartyId
import { addPartyInfo, addPartyEntry, editPartyInfo, editPartyEntry } from '@/api/employ'
import { getPartyInfoByPartyId, getPartyEntryByPartyId } from '@/api/employ'
import {
  addCrewCertificate,
  editCrewCertificate,
  delCrewCertificate,
  getAllCrewCertificate,
  getCrewCertificateByPartyId
} from '@/api/crewCertificate'
import { addCrewCalendar, editCrewCalendar, delCrewCalendar, getCrewCalendarByPartyId } from '@/api/crewCalendar'
import { getContentsByPartyId } from '@/api/party'
import { getPartyContentType } from '@/api/contentType'
import { contentPreview } from '@/api/content'
import { del } from '@/api/content'
import { parseTime, parseTimeNoMin } from '@/utils/index'
import checkPermission from '@/utils/permission'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import { getAllJob } from '@/api/job'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
// import { log } from 'util'
export default {
  components: { 'v-pdf': pdf, Treeselect },
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
      fileList: [],
      value: [],
      partyEntryTypes: [{ value: '全职', label: '全职' }, { value: '兼职', label: '兼职' }],
      certificateTypes: [{ value: '适任证书', label: '适任证书' },
        { value: '船舶电子电气员', label: '船舶电子电气员' },
        { value: '甲类适任证书', label: '甲类适任证书' },
        { value: '乙类适任证书', label: '乙类适任证书' },
        { value: '丙类适任证书', label: '丙类适任证书' },
        { value: '丁类适任证书', label: '丁类适任证书' },
        { value: '卫检健康证', label: '卫检健康证' },
        { value: '海员证', label: '海员证' },
        { value: '护照', label: '护照' },
        { value: '服务簿', label: '服务簿' },
        { value: 'GMDSS', label: 'GMDSS' }, {
          value: '化学品船货物操作高级培训',
          label: '化学品船货物操作高级培训'
        }, { value: '长江证书', label: '长江证书' },
        { value: '健康证', label: '健康证' },
        { value: '油船和化学品船货物操作基本培训', label: '油船和化学品船货物操作基本培训' },
        { value: '油船货物操作高级培训', label: '油船货物操作高级培训' },
        { value: '海船船员培训合格证书', label: '海船船员培训合格证书' },
        { value: '保安员', label: '保安员' }, {
          value: '负有指定保安职责船员培训',
          label: '负有指定保安职责船员培训'
        }, { value: '内河船员适认证书', label: '内河船员适认证书' },
        { value: '内河船员特殊培训合格证书', label: '内河船员特殊培训合格证书' }, {
          value: '内河化学品培训合格证书',
          label: '内河化学品培训合格证书'
        }, { value: '内河油船培训合格证书', label: '内河油船培训合格证书' },
        { value: '内河船员服务簿', label: '内河船员服务簿' },
        { value: '厨师培训合格证明', label: '厨师培训合格证明' },
        { value: '基本安全', label: '基本安全' },
        { value: '艇筏', label: '艇筏' },
        { value: '高级消防', label: '高级消防' },
        { value: '精通急救', label: '精通急救' },
        { value: '船上医护', label: '船上医护' },
        { value: '雷达2小证', label: '雷达2小证' },
        { value: '驾驶台资源管理', label: '驾驶台资源管理' },
        { value: '机舱资源管理', label: '机舱资源管理' },
        { value: '电子海图操作', label: '电子海图操作' }
      ],
      dayNum: '',
      certificates: [],
      calendars: [],
      jobs: [],
      crewSaftyRecord: [],
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
        contractRemind: '',
        level: ''
      },
      certificate: {
        partyId: '',
        certificateName: '',
        certificateCode: '',
        certificator: '',
        thruDate: '',
        fromDate: '',
        createdBy: {}
      },
      calendar: {
        companyName: '',
        jobId: null,
        boardingDate: '',
        disembarkDate: '',
        crewSaftyRecord: '',
        partyId: ''
      },
      calendarUpdate: false,
      birthdayRemind: '',
      probationMonth: '',
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
        // school: [
        //   { required: false, message: '请填写毕业院校', trigger: 'blur' }
        // ],
        contactMech: [{ required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            validator: function(rule, value, callback) {
              if (/^1[345789]\d{9}$/.test(value) === false) {
                callback(new Error('请输入正确的手机号'))
              } else {
                callback()
              }
            }, trigger: 'blur'
          }],
        partyEntryType: [
          { required: false, message: '请选择入职类型', trigger: 'blur' }
        ],
        // socialSecurityAccount: [
        //   { required: true, message: '请填写社保账号', trigger: 'blur' }
        // ],
        providentFundAccount: [
          { required: false, message: '请填写公积金账户', trigger: 'blur' }
        ],
        entryDate: [
          { required: true, message: '请填写入职时间', trigger: 'blur' }
        ],
        certificateName: [
          { required: true, message: '请填写证书名称', trigger: 'blur' }
        ],
        certificator: [
          { required: true, message: '请填写发证机关', trigger: 'blur' }
        ],
        fromDate: [
          { required: true, message: '请填写发证日期', trigger: 'blur' }
        ],
        companyName: [
          { required: true, message: '请填写公司', trigger: 'blur' }
        ],
        jobId: [
          { required: true, message: '请填写职务', trigger: 'blur' }
        ],
        boardingDate: [
          { required: true, message: '请填写上船日期', trigger: 'blur' }
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
      dialogImageUrl: [],
      dialogPdfUrl: '',
      headers: { 'Authorization': 'Bearer ' + getToken() },
      delLoading: false,
      partyContents: [],
      contentUrl: '',
      pdfNumPages: undefined,
      currentRow: '',
      area: {
        11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江',
        31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北',
        43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏',
        61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外'
      },
      zodiac: {
        1: '鼠', 2: '牛', 3: '虎', 4: '兔', 5: '龙', 6: '蛇', 7: '马', 8: '羊', 9: '猴', 10: '鸡', 11: '狗', 90: '猪'
      },
      options: [
        {
          value: 'L1-1',
          label: 'L1-1'
        },
        {
          value: 'L1-2',
          label: 'L1-2'
        },
        {
          value: 'L1-3',
          label: 'L1-3'
        },
        {
          value: 'L1-4',
          label: 'L1-4'
        },
        {
          value: 'L1-5',
          label: 'L1-5'
        },
        {
          value: 'L2-1',
          label: 'L2-1'
        }, {
          value: 'L2-2',
          label: 'L2-2'
        }, {
          value: 'L2-3',
          label: 'L2-3'
        }, {
          value: 'L2-4',
          label: 'L2-4'
        }, {
          value: 'L2-5',
          label: 'L2-5'
        }, {
          value: 'L2-6',
          label: 'L2-6'
        }, {
          value: 'L2-7',
          label: 'L2-7'
        },
        {
          value: 'L3-1',
          label: 'L3-1'
        }, {
          value: 'L3-2',
          label: 'L3-2'
        }, {
          value: 'L3-3',
          label: 'L3-3'
        }, {
          value: 'L3-4',
          label: 'L3-4'
        }, {
          value: 'L3-5',
          label: 'L3-5'
        }, {
          value: 'L3-6',
          label: 'L3-6'
        },
        {
          value: 'L4-1',
          label: 'L4-1'
        }, {
          value: 'L4-2',
          label: 'L4-2'
        }, {
          value: 'L4-3',
          label: 'L4-3'
        }, {
          value: 'L4-4',
          label: 'L4-4'
        }, {
          value: 'L4-5',
          label: 'L4-5'
        }, {
          value: 'L4-6',
          label: 'L4-6'
        }, {
          value: 'L4-7',
          label: 'L4-7'
        }, {
          value: 'L4-8',
          label: 'L4-8'
        }, {
          value: 'L4-9',
          label: 'L4-9'
        },
        {
          value: 'L5-1',
          label: 'L5-1'
        }, {
          value: 'L5-2',
          label: 'L5-2'
        }, {
          value: 'L5-3',
          label: 'L5-3'
        }, {
          value: 'L5-4',
          label: 'L5-4'
        }, {
          value: 'L5-5',
          label: 'L5-5'
        }, {
          value: 'L5-6',
          label: 'L5-6'
        },
        {
          value: 'L6-1',
          label: 'L6-1'
        }, {
          value: 'L6-2',
          label: 'L6-2'
        }, {
          value: 'L6-3',
          label: 'L6-3'
        }, {
          value: 'L6-4',
          label: 'L6-4'
        }, {
          value: 'L6-5',
          label: 'L6-5'
        }, {
          value: 'L6-6',
          label: 'L6-6'
        }, {
          value: 'L6-7',
          label: 'L6-7'
        }, {
          value: 'L6-8',
          label: 'L6-8'
        }, {
          value: 'L6-9',
          label: 'L6-9'
        },
        {
          value: 'L7-1',
          label: 'L7-1'
        }, {
          value: 'L7-2',
          label: 'L7-2'
        }, {
          value: 'L7-3',
          label: 'L7-3'
        }, {
          value: 'L7-4',
          label: 'L7-4'
        }, {
          value: 'L7-5',
          label: 'L7-5'
        }, {
          value: 'L7-6',
          label: 'L7-6'
        },
        {
          value: 'L8-1',
          label: 'L8-1'
        }, {
          value: 'L8-2',
          label: 'L8-2'
        }, {
          value: 'L8-3',
          label: 'L8-3'
        }, {
          value: 'L8-4',
          label: 'L8-4'
        }, {
          value: 'L8-5',
          label: 'L8-5'
        }, {
          value: 'L8-6',
          label: 'L8-6'
        },
        {
          value: 'L9-1',
          label: 'L9-1'
        }, {
          value: 'L9-2',
          label: 'L9-2'
        }, {
          value: 'L9-3',
          label: 'L9-3'
        }, {
          value: 'L9-4',
          label: 'L9-4'
        }, {
          value: 'L9-5',
          label: 'L9-5'
        }, {
          value: 'L9-6',
          label: 'L9-6'
        },
        {
          value: 'L10-1',
          label: 'L10-1'
        }, {
          value: 'L10-2',
          label: 'L10-2'
        }, {
          value: 'L10-3',
          label: 'L10-3'
        }, {
          value: 'L10-4',
          label: 'L10-4'
        }, {
          value: 'L10-5',
          label: 'L10-5'
        }, {
          value: 'L10-6',
          label: 'L10-6'
        },
        {
          value: 'L11-1',
          label: 'L11-1'
        }, {
          value: 'L11-2',
          label: 'L11-2'
        }, {
          value: 'L11-3',
          label: 'L11-3'
        }, {
          value: 'L11-4',
          label: 'L11-4'
        }, {
          value: 'L11-5',
          label: 'L11-5'
        }, {
          value: 'L11-6',
          label: 'L11-6'
        }, {
          value: 'L11-7',
          label: 'L11-7'
        }, {
          value: 'L11-8',
          label: 'L11-8'
        },
        {
          value: 'L12-1',
          label: 'L12-1'
        }, {
          value: 'L12-2',
          label: 'L12-2'
        }, {
          value: 'L12-3',
          label: 'L12-3'
        }, {
          value: 'L12-4',
          label: 'L12-4'
        }, {
          value: 'L12-5',
          label: 'L12-5'
        }, {
          value: 'L12-6',
          label: 'L12-6'
        }, {
          value: 'L12-7',
          label: 'L12-7'
        }, {
          value: 'L12-8',
          label: 'L12-8'
        }, {
          value: 'L12-9',
          label: 'L12-9'
        }, {
          value: 'L12-10',
          label: 'L12-10'
        }, {
          value: 'L13-1',
          label: 'L13-1'
        }, {
          value: 'L13-2',
          label: 'L13-2'
        }, {
          value: 'L14-1',
          label: 'L14-1'
        }, {
          value: 'L14-2',
          label: 'L14-2'
        }, {
          value: 'L15-1',
          label: 'L15-1'
        }, {
          value: 'L15-2',
          label: 'L15-2'
        }
      ]
    }
  },
  computed: {},
  watch: {
    probationMonth() {
      this.handleConversionDate()
    }
  },
  created() {
    this.queryContentType()
    this.getJobs()
    this.$nextTick(() => {
      this.handleConversionDate()
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
    getJobs() {
      getAllJob({ 'jobType': 'SHIP' }).then(res => {
        this.jobs = res.content
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    uploadPartyContent() {
      this.$refs['certificate'].validate((valid) => {
        if (!valid) {
          this.$message.error('请完善船员证书信息中的必填信息!')
          return false
        } else {
          const formData = new FormData()
          this.$refs.upload.uploadFiles.forEach(function(value, index, array) {
            formData.append('file', value.raw)
          })
          formData.append('certificateName', this.certificate.certificateName) // 证书名称
          formData.append('certificateCode', this.certificate.certificateCode) // 证书编号
          formData.append('certificator', this.certificate.certificator) // 发证机关
          formData.append('fromDate', this.certificate.fromDate) // 发证日期
          formData.append('thruDate', this.certificate.thruDate) // 到期日期
          formData.append('partyId', this.party.partyId) // partyId
          addCrewCertificate(formData).then(response => {
            this.$message.info('上传成功')
            this.certificate = {
              partyId: '',
              certificateName: '',
              certificateCode: '',
              certificator: '',
              thruDate: '',
              fromDate: '',
              createdBy: {}
            }
            this.fileList = [] // 执行置空操作
            // 上传成功的图片会显示绿色的对勾
            // this.$parent.details(this.parentData)
            // 但是我们上传成功了图片， fileList 里面的值却没有改变，还好有on-change指令可以使用
            this.getCrewCertificateByPartyId()
          }).catch(err => {
            this.$message.error('上传失败')
            console.log(err)
          })
        }
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
      return isImage && isLt10M
    },
    preview(row) {
      this.dialogImageUrl = []
      this.dialogPdfUrl = ''
      // for (let i = 0; i < row.contents.length; i++) {
      contentPreview(row.contentId).then(res => {
        if (!res) {
          this.$message.error('文件不存在')
        }
        const URL = window.URL || window.webkitURL
        const bloburl = URL.createObjectURL(res)
        if (row.mimeType === 'pdf') {
          this.dialogPdfUrl = bloburl
        } else {
          this.dialogImageUrl.push(bloburl)
          this.$previewRefresh()
        }
      })
      // }
      this.innerDialogVisible = true
    },
    download(row) {
      const contents = []
      const zip = new JSZip()
      for (let i = 0; i < row.contents.length; i++) {
        contentPreview(row.contents[i].contentId).then(res => {
          if (res) {
            contents.push(res)
            zip.file(row.contents[i].contentName, res, { binary: true })
          }
          if (contents.length === row.contents.length) {
            Promise.all(contents).then(() => {
              zip.generateAsync({ type: 'blob' }).then(content => { // 生成二进制流
                console.log(content)
                FileSaver.saveAs(content, '证书打包下载.zip') // 利用file-saver保存文件
              })
            })
          }
        })
      }
    },
    handlePictureCardPreview(file) {
      var extName = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      if (extName === '.pdf') {
        this.dialogPdfUrl = file.url
        this.dialogImageUrl = ''
        this.$refs.pdf.loadFile(file.url)
      } else {
        this.dialogPdfUrl = ''
        // this.dialogImageUrl = file.url
        this.dialogImageUrl.push(file.url)
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
      if (this.formEn.contractExpirationDate === '') {
        return
      }
      // 获取选择的合同到期日期时间戳
      const contractExpirationDate = this.formEn.contractExpirationDate
      // 获取入职日期的时间戳
      const entryDate = this.formEn.entryDate
      // 合同到期日期减去入职日期时间戳 得到之间的天数
      const expireDateN = Math.ceil((contractExpirationDate - entryDate) / (24 * 3600 * 1000))
      if (expireDateN === 0 || expireDateN < 0) {
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
    addDomain() {
      this.crewSaftyRecord.push({
        record: '',
        key: Date.now()
      })
    },
    reloadForm() {
      getPartyInfoByPartyId(this.party.partyId).then(res => {
        if (res && res.length !== 0) {
          if (this.formInfo.idNumber) {
            this.getName(this.formInfo.idNumber)
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
        // console.log(res)
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
      this.getCrewCertificateByPartyId()
      this.getCrewCalendarByPartyId()
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
      } else if (para === 'certificate') {
        this.addCrewCertificate()
      } else if (para === 'crewCalendar') {
        if (this.calendarUpdate) {
          this.editCrewCalendar()
        } else {
          this.addCrewCalendar()
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
        this.$confirm('是否保存船员基本信息的更改', '提示', {
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
        this.$confirm('是否保存船员入职管理的更改', '提示', {
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
      this.fileList = []
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
      this.certificate = {
        partyId: '',
        certificateName: '',
        certificateCode: '',
        certificator: '',
        thruDate: '',
        fromDate: '',
        createdBy: {}
      }
      this.fileList = []
      this.calendar = {
        companyName: '',
        jobId: null,
        boardingDate: '',
        disembarkDate: '',
        crewSaftyRecord: '',
        partyId: ''
      }
      this.calendarUpdate = false
      this.dayNum = ''
      this.crewSaftyRecord = []
    },
    removeDomain(item) {
      var index = this.crewSaftyRecord.indexOf(item)
      if (index !== -1) {
        this.crewSaftyRecord.splice(index, 1)
      }
    },
    handleConversionDate() {
      if (this.formEn.entryDate === '') {
        return
      }
      if (this.probationMonth === '') {
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
    },
    addCrewCertificate() {
      this.certificate.partyId = this.party.partyId
      addCrewCertificate(this.certificate).then(res => {
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.getCrewCertificateByPartyId()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    editCrewCertificate() {
      this.certificate.partyId = this.party.partyId
      editCrewCertificate(this.certificate).then(res => {
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.getCrewCertificateByPartyId()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    delCrewCertificate(id) {
      delCrewCertificate(id).then(res => {
        this.getCrewCertificateByPartyId()
        this.$refs[id].doClose()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    addCrewCalendar() {
      this.$refs['calendar'].validate((valid) => {
        if (!valid) {
          this.$message.error('请完善船员海历信息中的必填信息!')
          return false
        } else {
          this.calendar.partyId = this.party.partyId
          this.calendar.crewSaftyRecord = this.crewSaftyRecord
          addCrewCalendar(this.calendar).then(res => {
            this.$notify({
              title: '添加成功',
              type: 'success',
              duration: 2500
            })
            this.loading = false
            this.getCrewCalendarByPartyId()
            this.resetForm()
          }).catch(err => {
            this.loading = false
            console.log(err.response.data.message)
          })
        }
      })
    },
    editCrewCalendar() {
      this.$refs['calendar'].validate((valid) => {
        if (!valid) {
          this.$message.error('请完善船员海历信息中的必填信息!')
          return false
        } else {
          this.calendar.partyId = this.party.partyId
          this.calendar.crewSaftyRecord = this.crewSaftyRecord
          editCrewCalendar(this.calendar).then(res => {
            this.$notify({
              title: '修改成功',
              type: 'success',
              duration: 2500
            })
            // this.loading = false
            this.getCrewCalendarByPartyId()
            this.calendar = {
              companyName: '',
              jobId: null,
              boardingDate: '',
              disembarkDate: '',
              crewSaftyRecord: '',
              partyId: ''
            }
            this.dayNum = ''
            this.crewSaftyRecord = [{ record: '' }]
          }).catch(err => {
            this.loading = false
            console.log(err.response.data.message)
          })
        }
      })
    },
    delCrewCalendar(id) {
      delCrewCalendar(id).then(res => {
        this.getCrewCalendarByPartyId()
        this.$refs[id].doClose()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    getAllCrewCertificate() {
      getAllCrewCertificate(this.party.partyId).then(res => {
        this.certificates = res.content
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    getCrewCalendarByPartyId() {
      getCrewCalendarByPartyId(this.party.partyId).then(res => {
        this.calendars = res
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    getCrewCertificateByPartyId() {
      getCrewCertificateByPartyId(this.party.partyId).then(res => {
        this.certificates = res
      })
    },
    dateDiff(firstDate, secondDate) {
      if (firstDate && secondDate) {
        firstDate = new Date(firstDate)
        secondDate = new Date(secondDate)
        var diff = secondDate.getTime() - firstDate.getTime()
        var result = parseInt(diff / (1000 * 60 * 60 * 24))
        return result
      }
    },
    handleCalendar(val) {
      if (val) {
        this.calendarUpdate = true
        this.calendar.id = val.id
        this.calendar.companyName = val.companyName
        this.calendar.jobId = val.jobId.jobId
        this.calendar.boardingDate = val.boardingDate
        this.calendar.disembarkDate = val.disembarkDate
        this.crewSaftyRecord = val.crewSaftyRecord
        this.calendar.partyId = val.partyId.partyId
        this.dayNum = this.dateDiff(parseTime(val.boardingDate), parseTime(val.disembarkDate))
      }
    },
    handleCertificate(val) {
      console.log(val)
    }
  }
}
</script>
<style scoped>
  .dialogFooter {
    float: right;
  }

  .sex {
    margin-right: 104px;
  }

  .pdf {
    border: 2px solid aqua;
  }
</style>
<style>
  .pswp {
    z-index: 9999 !important;
  }
</style>

