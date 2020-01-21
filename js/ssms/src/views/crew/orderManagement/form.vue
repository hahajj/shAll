<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="true" :before-close="resetForm" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="600px">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="调令编号" >
        <el-input v-model="form.code"/>
      </el-form-item>
      <el-form-item label="姓名" style="width: 400px">
        <el-select v-model="partyId" clearable style="width: 180px;" filterable placeholder="请选择">
          <el-option
            v-for="(item, index) in partys"
            :key="item.name + index"
            :label="item.name+'/' + item.code "
            :value="item.partyId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="原船舶" >
        <el-input v-model="form.formerOrganizationName" readonly/>
      </el-form-item>
      <el-form-item label="原职务" >
        <el-input v-model="form.formerJobName" readonly/>
      </el-form-item>
      <el-form-item label="现船舶" >
        <treeselect v-model="organizationIds" :options="organizations" :multiple="false" style="width: 180px" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="现职务" >
        <el-select v-model="form.newJob" clearable style="width: 180px;" filterable placeholder="请选择">
          <el-option
            v-for="(item, index) in jobs"
            :key="item.label + index"
            :label="item.label"
            :value="item.jobId"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="!isAdd" label="生效时间" >
        <el-input v-model="form.formerOrganization"/>
      </el-form-item>
      <el-form-item label="调动类型" >
        <el-select v-model="form.partyChangeType" clearable style="width: 180px;" filterable placeholder="请选择">
          <el-option
            v-for="(item, index) in partyChangeTypes"
            :key="item.partyChangeType + index"
            :label="item.partyChangeTypeName"
            :value="item.partyChangeType"/>
        </el-select>
      </el-form-item>
      <el-form-item label="生效时间" >
        <el-date-picker
          v-model="form.changeDate"
          :picker-options="pickerOptions"
          style="width: 180px;"
          align="right"
          type="date"
          placeholder="选择日期"/>
      </el-form-item>
      <el-form-item label="备注" >
        <el-input :rows="3" v-model="form.commnets" type="textarea" style="width:462px" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/partyChange'
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
      loading: false, dialog: false, partys: [], party: {}, partyId: '', organizations: [], organizationIds: null, jobs: [],
      partyChangeTypes: [{ 'partyChangeTypeName': '上船', 'partyChangeType': '6' }, { 'partyChangeTypeName': '下船', 'partyChangeType': '7' }],
      form: {
        code: '',
        partyChangeId: '',
        createdDate: '',
        createdBy: null,
        lastModifiedDate: '',
        lastModifiedBy: null,
        partyId: '',
        changeDate: '',
        changeBy: null,
        commnets: '',
        changeType: '',
        formerOrganization: '',
        formerOrganizationName: '',
        formerJob: '',
        formerJobName: '',
        newOrganization: '',
        newJob: '',
        organizationLable: '',
        jobLable: '',
        jobId: ''
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
      this.form.party = this.partyId
      this.form.newOrganization = this.organizationIds
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
      this.partyId = ''
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
