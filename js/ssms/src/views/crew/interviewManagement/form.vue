<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="600px">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="应聘人" >
        <el-input v-model="party.name" style="width:300px"/>
      </el-form-item>
      <el-form-item label="应聘船舶" style="width: 600px">
        <treeselect v-model="organization" :options="organizations" :multiple="false" style="width: 300px" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="应聘职位" >
        <el-select v-model="party.job" clearable style="width: 300px;" filterable placeholder="请选择">
          <el-option
            v-for="(item, index) in jobs"
            :key="item.label + index"
            :label="item.label"
            :value="item.jobId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="评价内容" >
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
    return {
      loading: false, dialog: false, partys: [], partyId: '', organization: null, organizationIds: null, jobs: [], organizations: [],
      form: {
        auditSuggestion: '',
        party: {}
      },
      party: {
        name: '',
        organization: '',
        job: ''
      },
      rules: {
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
      this.loading = true
      this.party.organization = this.organization
      this.form.party = this.party
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
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
      this.$refs['form'].resetFields()
      this.form = {
        partyChangeId: '',
        createdDate: '',
        createdBy: '',
        lastModifiedDate: '',
        lastModifiedBy: '',
        partyId: '',
        changeDate: '',
        changeBy: '',
        commnets: '',
        changeType: '',
        formerOrganization: '',
        formerJob: '',
        newOrganization: '',
        newJob: ''
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
