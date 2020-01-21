<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="resetForm" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="600px">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="姓名" prop="party" style="width: 400px">
        <el-select v-model="form.party" :remote-method="remoteMethod" filterable remote placeholder="关联员工编号" clearable class="filter-item" style="width: 180px" @change="selectByparty">
          <el-option
            v-for="(item, index) in partys"
            :key="item.name + index"
            :label="item.name+'/' + item.code "
            :value="item.partyId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="原部门" >
        <el-input v-model="form.formerOrganizationName" :disabled="true"/>
      </el-form-item>
      <el-form-item label="原岗位" >
        <el-input v-model="form.formerJobName" :disabled="true"/>
      </el-form-item>
      <el-form-item label="现部门" prop="newOrganization">
        <treeselect v-model="form.newOrganization" :options="organizations" :multiple="false" style="width: 465px" placeholder="请选择"/>
      </el-form-item>
      <el-form-item label="现岗位" prop="newJob">
        <treeselect v-model="form.newJob" :options="jobs" style="width: 465px" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="调动时间" prop="changeDate">
        <el-date-picker v-model="form.changeDate" type="date" style="width: 180px;" placeholder="选择调动时间" format="yyyy - MM - dd " value-format="timestamp"/>
      </el-form-item>
      <el-form-item label="调动类型" prop="partyChangeType">
        <el-select v-model="form.partyChangeType" clearable style="width: 180px;" filterable placeholder="请选择">
          <el-option
            v-for="(item, index) in partyChangeTypes"
            :key="item.partyChangeType + index"
            :label="item.partyChangeTypeName"
            :value="item.partyChangeType"/>
        </el-select>
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
import { getPartyByPartyId } from '@/api/party'
import { getOrganization } from '@/api/organization'
import { getAllPartyChangeType } from '@/api/partyChangeType'
import { getAllJob } from '@/api/job'
import { getPartysByNameOrCode } from '@/api/party'
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
      partyChangeTypes: [{ 'partyChangeTypeName': '降级变动', 'partyChangeType': '1' }, { 'partyChangeTypeName': '晋升变动', 'partyChangeType': '2' },
        { 'partyChangeTypeName': '岗位晋升', 'partyChangeType': '3' }, { 'partyChangeTypeName': '岗位降职', 'partyChangeType': '4' },
        { 'partyChangeTypeName': '平级变动', 'partyChangeType': '5' }],
      form: {
        partyChangeId: '',
        partyId: '',
        party: '',
        changeBy: null,
        commnets: '',
        changeDate: '',
        changeType: '',
        formerOrganization: null,
        formerOrganizationName: '',
        formerJob: null,
        formerJobName: '',
        newOrganization: null,
        newJob: null,
        organizationLable: '',
        jobLable: '',
        jobId: ''
      },
      rules: {
        party: [{
          required: true,
          message: '请选择员工',
          trigger: ['blur', 'change']
        }
        ],
        newOrganization: [{
          required: true,
          message: '请选择部门',
          trigger: ['blur', 'change']
        }],
        newJob: [{
          required: true,
          message: '请选择岗位',
          trigger: ['blur', 'change']
        }],
        partyChangeType: [{
          required: true,
          message: '请选择调动类型',
          trigger: ['blur', 'change']
        }],
        changeDate: [{
          required: true,
          message: '请选择调动时间',
          trigger: ['blur', 'change']
        }]
      }
    }
  },
  watch: {
  },
  created() {
    // this.getPartys()
    this.getOrganizations()
    this.getJobs()
  },
  methods: {
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
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
        partyId: '',
        commnets: '',
        changeType: '',
        formerOrganization: null,
        formerJob: null,
        formerOrganizationName: null,
        formerJobName: null,
        newOrganization: null,
        newJob: null
      }
    },
    // getPartys() {
    //   getAllPartyNopage({ partyType: 'EMPLOYEE' }).then(res => {
    //     this.partys = res
    //   }).catch(err => {
    //     console.log(err.response.data.message)
    //   })
    // },
    selectByparty() {
      console.log(this.form.party)
      this.getPartyByPartyId(this.form.party)
    },
    getPartyByPartyId(id) {
      console.log(id)
      getPartyByPartyId(id).then(res => {
        this.party = res
        this.form.formerOrganization = res.organization.id
        this.form.formerJob = res.job.id
        this.form.formerOrganizationName = res.organization.label
        this.form.formerJobName = res.job.label
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    getOrganizations() {
      const para = { organizationType: 'PARENT_COMPANY,BRANCH_COMPANY,LAND_DEPT', size: 9999 }
      getOrganization(para).then(res => {
        this.organizations = res.content
      })
    },
    getJobs() {
      getAllJob({ 'jobType': 'LAND', size: 9999 }).then(res => {
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
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.getPartys(query)
        }, 200)
      } else {
        this.partys = []
      }
    },
    getPartys(para) {
      getPartysByNameOrCode(para).then(res => {
        this.partys = res
      }).catch(err => {
        console.log(err.response.data.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
