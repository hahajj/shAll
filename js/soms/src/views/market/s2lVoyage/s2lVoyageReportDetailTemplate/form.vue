<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :before-close="resetForm" :title="onlySee?'查看':isAdd ? ' 新增动态报' : '编辑'" width="1100px">
    <label style="color: #409eff;">选择类型</label>
    <el-select v-model="reportType" :disabled="!isAdd" filterable placeholder="动态报类型" size="mini" @change="changeReport(reportType)">
      <el-option
        v-for="(item,index) in s2lVoyageReport"
        :key="index"
        :label="item"
        :value="item"/>
    </el-select>
    <el-select v-if="reportType=='正午'||reportType=='抛锚'||reportType === '卸货离泊'" v-model="reportDetail" :disabled="!isAdd" filterable placeholder="标签" size="mini" @change="changeReportDetail(reportDetail)">
      <el-option
        v-for="(item,index) in s2lVoyageReportDetail"
        :key="index"
        :label="item"
        :value="item"/>
    </el-select>

    <form-generator
      v-if="configFlag"
      ref="generator"
      :report-type="reportType"
      :report-label="reportDetail"
      :config="config"
      :report-obj="reportObj"
      v-model="formData"
      :rules="rules"
      :is-add="isAdd"
      :only-see="onlySee"
      @submit="getFormData"
    />
  </el-dialog>
</template>
<script>
import FormGenerator from './FormGenerator'
import { getQueryReportType } from '@/api/s2lVoyageReportDetailTemplate'
import { getQueryLabelByReportType } from '@/api/s2lVoyageReportDetailTemplate'
import { getS2lVoyageReport, addS2lVoyageReport, updateS2lVoyageReport } from '@/api/s2lVoyageReportDetailTemplate'
import { formModel } from './formModel'

export default {
  name: 'FormGeneratorDemo',
  components: { FormGenerator },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    onlySee: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      reportObj: {},
      voyageReportId: '',
      voyage: {},
      configFlag: false,
      loading: false, dialog: false,
      reportType: '',
      reportDetail: '',
      s2lVoyageReport: [],
      s2lVoyageReportDetail: [],
      groupName: [],
      group: {},
      formData: {
      },
      config: {
      },
      s2lVoyageReportDetails: [],
      rules: {},
      reportDuration: ''
    }
  },
  created() {
    getQueryReportType().then(res => {
      this.s2lVoyageReport = res
    })
  },
  methods: {
    changeReport(reportType) {
      this.configFlag = false
      if (reportType === '正午' || reportType === '抛锚' || reportType === '卸货离泊') {
        getQueryLabelByReportType({ reportType: reportType }).then(res => {
          this.reportDetail = ''
          this.s2lVoyageReportDetail = res
        })
      } else {
        this.reportDetail = ''
        this.getS2lVoyageReport()
      }
    },
    changeReportDetail() {
      this.getS2lVoyageReport()
    },
    getS2lVoyageReport() {
      getS2lVoyageReport({ reportType: this.reportType, label: this.reportDetail, sort: 'sortNum' }).then(res => {
        formModel(res, this)
      })
    },
    resetForm() {
      this.reportType = ''
      this.reportDetail = ''
      this.configFlag = false
      this.voyageReportId = ''
      this.rules = {},
      this.reportDuration = '',
      this.dialog = false
      this.$parent.init()
    },
    getFormData(val, config) {
      this.formData = JSON.parse(JSON.stringify(val))
      this.config = config
      var reqObj = {}
      var map = []
      Object.keys(this.config).forEach((key, index) => {
        if (key === '计量') {
          this.config[key].map(values => {
            values.map(value => {
              map.push(value)
              return value
            })
          })
        } else if (key !== 'buttons') {
          this.config[key].map(value => {
            value.comments = (this.reportType === '卸货离泊' && this.reportDetail === '航次结束') ? Number(value.comments) + 1 : null
            map.push(value)
            return value
          })
        }
      })
      reqObj.reportType = this.reportType
      reqObj.label = this.reportDetail
      reqObj.s2lVoyageReportDetails = map
      reqObj.voyage = { voyageId: this.reportObj.voyageId }
      reqObj.position = this.formData['船位,shipPosition']
      reqObj.reportDate = this.formData['时间点,timePoint']
      reqObj.reportDuration = this.reportType === '正午' ? '' : this.formData['时长(小时),duration']
      if (this.isAdd) {
        addS2lVoyageReport(reqObj).then(res => {
          this.resetForm()
        })
      } else {
        reqObj.voyageReportId = this.voyageReportId
        updateS2lVoyageReport(reqObj).then(res => {
          this.resetForm()
        })
      }
    }
  }
}
</script>
