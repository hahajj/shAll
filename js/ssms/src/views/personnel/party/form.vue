<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item prop="name" label="姓名" >
        <el-input v-model="form.name" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="编号" >
        <el-input v-model="form.code" style="width: 370px;" disabled="disabled" placeholder="系统自动生成"/>
      </el-form-item>
      <el-form-item v-if="form.organizaton !== 0" prop="organization" label="部门">
        <treeselect v-model="form.organization" :options="allOrganizations" style="width: 370px;" placeholder="选择部门" />
      </el-form-item>
      <!-- <el-form-item label="员工类型" >
        <el-select v-model="form.partyType" placeholder="请选择" style="width: 370px;">
          <el-option v-for="item in partyTypes" :key="item.value" :label="item.partyType.partyTypeName" :value="item.partyType" />
        </el-select>
      </el-form-item> -->
      <el-form-item v-if="form.job !== 0" label="岗位">
        <treeselect v-model="form.job" :options="allJobs" style="width: 370px;" placeholder="选择岗位" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status" placeholder="请选择" style="width: 370px;">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, getAllParty } from '@/api/party'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getOrganization } from '@/api/organization'
import { getAllJob } from '@/api/job'
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
      parent: '',
      options: [{ value: '在职', label: '在职' }, { value: '实习', label: '实习' }, { value: '试用', label: '试用' }, { value: '劝退离职', label: '劝退离职' }, { value: '主动离职', label: '主动离职' }],
      value: '',
      partyTypes: '',
      jobTypes: [],
      loading: false, dialog: false,
      jobType: '',
      allJobs: [],
      data: {
        jobType: ''
      },
      form: {
        partyId: '',
        partyType: '',
        partyTypeName: '',
        status: '',
        getOrganizations: '',
        code: '',
        name: '',
        organization: null,
        getJobs: '',
        jobId: '',
        jobType: '',
        organizationId: ''
      },
      allOrganizations: '',
      organizationId: '',
      getJobs: '',
      partyType: '',
      status: '',
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        organization: [
          { required: true, message: '请选择部门', trigger: 'organization' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'status' }
        ]
      }
    }
  },
  created() {
    this.queryAllOrganization()
    // this.getAllParty()
    this.getAllJob()
    // this.getAllJob()
    // this.queryAllJobType()
  },
  methods: {
    queryAllOrganization() {
      const para = {page: 0, size: 9999 }
      getOrganization(para).then(res => {
        // this.organizations = res
        this.allOrganizations = res.content
        // console.log(this.allOrganizations)
      })
    },
    getAllJob() {
      getAllJob().then(res => {
        this.allJobs = res.content
        // console.log(this.allJobs)
      })
    },
    getAllParty() {
      getAllParty().then(res => {
        this.partyTypes = res.content
      })
    },
    cancel() {
      this.resetForm()
    },
    // queryAllJobType() {
    //   getAllJobType().then(res => {
    //     this.jobTypes = res
    //     console.log('44444')
    //     console.log(res)
    //   })
    // },
    doSubmit() {
      // console.log(this.parent)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else {
            this.doEdit()
          }
        }
      })
    },
    doAdd() {
      this.form.partyType = 'EMPLOYEE'
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.parent.init()
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
        this.parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        partyId: '',
        // partyType: '',
        status: '',
        // organization: '',
        code: '',
        name: '',
        jobId: ''
        // organizationId: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
