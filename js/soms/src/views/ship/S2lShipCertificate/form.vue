<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :visible.sync="dialog"
    :before-close="resetForm"
    :title="isAdd ? '新增' : '编辑'"
    width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
      <el-form-item label="证书名称" prop="certificateName">
        <el-input v-model="form.certificateName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="发证机关">
        <el-input v-model="form.certificator" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="发证日期">
        <el-date-picker
          v-model="form.publishDate"
          type="date"
          style="width: 370px;"
          placeholder="选择日期"/>
      </el-form-item>
      <el-form-item label="证书类型：" prop="certificateType">
        <el-select v-model="form.certificateType" style="width: 370px;">
          <el-option
            v-for="(item,index) in certificateTypeList"
            :key="index"
            :label="item"
            :value="item"/>
        </el-select>
      </el-form-item>
      <el-form-item label="上次检查日期">
        <el-date-picker
          v-model="form.lastCheckDate"
          type="date"
          style="width: 370px;"
          format="yyyy - MM - dd "
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期"/>
      </el-form-item>
      <el-form-item label="检查周期(月)">
        <el-input v-model="form.checkPeriod" type="number" min="1" max="24" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="下次检查日期">
        <el-date-picker
          v-model="form.newCheckDate"
          disabled
          type="date"
          style="width: 370px;"
          format="yyyy - MM - dd "
          value-format="yyyy-MM-dd HH:mm:ss"/>
      </el-form-item>
      <el-form-item label="预警月数" prop="earlyWarning">
        <el-input v-model="form.earlyWarning" :min="1" type="number" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="主管" prop="supervisor">
        <el-input v-model="form.supervisor" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="检查类型" prop="checkType">
        <el-input v-model="form.checkType" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.comments" :rows="2" type="textarea" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/s2lShipCertificate'
import { parseTime } from '@/utils/index'

export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        certificateName: '',
        certificator: '',
        createdDate: '',
        createdBy: '',
        lastModifiedDate: '',
        lastModifiedBy: '',
        status: '',
        shipId: '',
        lastCheckDate: '',
        checkPeriod: '',
        certificateType: '',
        publishDate: '',
        comments: '',
        organizationId: '',
        organization: this.$store.state.user.user.partyDTO.organization.organizationId,
        earlyWarning: '',
        supervisor: '',
        checkType: ''
      },
      certificateTypeList: ['定期', '不定期'],
      rules: {
        certificateName: [{ required: true, message: '请输入证书名称', trigger: 'blur' }],
        certificateType: [{ required: true, message: '请输入证书类型', trigger: 'blur' }],
        organizationId: [{ required: true, message: '请输入船舶组织ID', trigger: 'blur' }]
      }
    }
  },
  watch: {
    form: {
      handler: function(val, oldval) {
      },
      deep: true
    },
    'form.checkPeriod'(val, oldVal) {
      this.changeDate()
    },
    'form.lastCheckDate'(val, oldVal) {
      this.changeDate()
    }
  },
  methods: {
    changeDate() {
      if (this.form.lastCheckDate && this.form.checkPeriod) {
        const oldDate = new Date(this.form.lastCheckDate.replace(/\-/g, '/'))
        const newDate = oldDate.setMonth(parseInt(oldDate.getMonth()) + parseInt(this.form.checkPeriod))
        this.form.newCheckDate = parseTime(newDate)
      } else {
        this.form.newCheckDate = ''
      }
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else this.doEdit()
        }
      })
    },
    doAdd() {
      this.form.publishDate = parseTime(this.form.publishDate)
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.$parent.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      this.form.publishDate = parseTime(this.form.publishDate)
      if (!this.form.lastCheckDate) {
        this.form.lastCheckDate = ''
      }
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.$parent.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        certificateName: '',
        certificator: '',
        createdDate: '',
        createdBy: '',
        lastModifiedDate: '',
        lastModifiedBy: '',
        status: '',
        shipId: '',
        lastCheckDate: '',
        checkPeriod: '',
        certificateType: '',
        publishDate: '',
        nextDate: '',
        comments: '',
        organizationId: '',
        organization: this.$store.state.user.user.partyDTO.organization.organizationId,
        earlyWarning: '',
        supervisor: '',
        checkType: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
