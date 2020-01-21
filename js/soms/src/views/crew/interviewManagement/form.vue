<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="resetForm" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="600px">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="应聘人" prop="party.name">
        <el-input v-model="form.party.name" style="width:300px"/>
      </el-form-item>
      <el-form-item label="应聘船舶" style="width: 600px" prop="party.organization">
        <treeselect v-model="form.party.organization" :options="organizations" :multiple="false" style="width: 300px" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="应聘职位" prop="party.job">
        <treeselect v-model="form.party.job" :options="jobs" :multiple="false" style="width: 300px" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="评价内容" prop="auditSuggestion">
        <el-input v-model="form.auditSuggestion" :rows="3" type="textarea" style="width: 300px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/partyEntryAudit'
import { deleteRequest } from '@/api/partyChange'
import { getAllPartyNopage, getPartyByPartyId } from '@/api/party'
import { getOrganizationByCriteria } from '@/api/organization'
import { getAllPartyChangeType } from '@/api/partyChangeType'
import { getAllJob } from '@/api/job'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    var validateAuditSuggestion = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入评价内容'))
      } else {
        callback()
      }
    }
    return {
      loading: false, dialog: false, partys: [], partyId: '', organization: null, organizationIds: null, jobs: [], organizations: [],
      form: {
        auditSuggestion: '',
        partyEntryAuditId: '',
        party: {
          partyId: '',
          name: '',
          organization: null,
          job: null
        }
      },
      party: {
        name: '',
        organization: null,
        job: null
      },
      rules: {
        'party.name': [{ required: true, message: '请输入应聘人', trigger: 'blur' }],
        'party.job': [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        'party.organization': [
          { required: true, message: '请输入船舶', trigger: 'blur' }
        ],
        auditSuggestion: [
          { required: true, validator: validateAuditSuggestion, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    partyId() {
      this.getPartyByPartyId(this.partyId)
    }
  },
  created() {
    this.getPartys()
    this.getOrganizations()
    this.getJobs()
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      // this.party.organization = this.organization
      // this.form.party = this.party
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
    },
    doAdd() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.$message.error('请完善必填信息!')
          return false
        } else {
          this.loading = true
          add(this.form).then(res => {
            this.resetForm()
            this.$notify({
              title: '添加成功',
              type: 'success',
              duration: 2500
            })
            this.loading = false
            this.dialog = false
            this.$parent.init()
          }).catch(err => {
            this.loading = false
            console.log(err.response.data.message)
          })
        }
      })
    },
    doEdit() {
      if (this.form.partyEntryAuditId) {
        this.deleteRequest()
      }
      var _this = this
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.$message.error('请完善必填信息!')
          return false
        } else {
          this.loading = true
          edit(_this.form).then(res => {
            _this.loading = false
            _this.dialog = false
            _this.resetForm()
            _this.$notify({
              title: '修改成功',
              type: 'success',
              duration: 2500
            })
            _this.$parent.init()
          }).catch(err => {
            _this.loading = false
            console.log(err.response.data.message)
          })
        }
      })
    },
    deleteRequest() {
      deleteRequest({ id: this.form.partyEntryAuditId, tableName: 'party_entry_audit' }).then(res => {
        console.log('删除工作流成功')
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        auditSuggestion: '',
        party: {
          name: '',
          organization: null,
          job: null
        }
      }
    },
    getPartys() {
      getAllPartyNopage({ partyType: 'CREW' }).then(res => {
        this.partys = res
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    getPartyByPartyId() {
      getPartyByPartyId(this.partyId).then(res => {
        this.party = res
        console.log(res)
        this.form.formerOrganization = res.organization.id
        this.form.formerJob = res.job.id
        this.form.formerOrganizationName = res.organization.label
        this.form.formerJobName = res.job.label
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    getOrganizations() {
      getOrganizationByCriteria({ 'organizationType': 'SHIP_DEPT' }).then(res => {
        this.organizations = res
      })
    },
    getJobs() {
      getAllJob({ 'jobType': 'SHIP' }).then(res => {
        this.jobs = res.content
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    getAllPartyChangeTypes() {
      getAllPartyChangeType().then(res => {
        this.partyChangeTypes = res
        console.log(this.partyChangeTypes)
      }).catch(err => {
        console.log(err.response.data.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
