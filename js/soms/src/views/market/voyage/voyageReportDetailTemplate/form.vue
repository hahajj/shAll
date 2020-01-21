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
      :config="config"
      :report-obj="reportObj"
      v-model="formData"
      :rules="rules"
      :is-add="isAdd"
      :only-see="onlySee"
      @submit="getFormData"
    />
    <div style="float: right">
      <slot name="buttons" >
        <el-button v-if="!noSelect" type="primary" size="small" @click="agreeSub(1)">同意</el-button>
        <el-button v-if="!noSelect" type="warning" size="small" @click="agreeSub(0)">驳回</el-button>
        <el-button type="default" size="small" @click="resetForm">取消</el-button>
      </slot>
    </div>
    <div style="clear: both"/>
  </el-dialog>
</template>
<script>
import FormGenerator from './FormGenerator'
import { landAudit } from '@/api/s2lVoyageReportDetailTemplate'

export default {
  name: 'FormGeneratorDemo',
  components: { FormGenerator },
  props: {
    isAdd: {
      type: Boolean,
      default: true
    },
    onlySee: {
      type: Boolean,
      default: false
    },
    noSelect: {
      type: Boolean,
      default: false
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
  },
  methods: {
    changeReport(reportType) {
    },
    changeReportDetail() {
    },
    getS2lVoyageReport() {
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
    agreeSub(type) {
      landAudit({ voyageReportId: this.voyageReportId, auditStatus: type ? '同意' : '驳回' }).then(res => {
        this.$notify({
          title: '操作成功',
          type: 'success',
          duration: 2500
        })
        this.resetForm()
      })
    },
    getFormData(val, config) {
    }
  }
}
</script>
