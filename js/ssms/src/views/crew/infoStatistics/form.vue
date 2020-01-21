<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="姓名" >
        <el-input v-model="form.name" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="编号" >
        <el-input v-model="form.code" style="width: 370px;"/>
      </el-form-item>
      <el-form-item v-if="form.getOrganizatons !== 0" label="部门">
        <treeselect v-model="form.organization" :options="getOrganizations" style="width: 370px;" placeholder="选择部门" />
      </el-form-item>
      <el-form-item v-if="form.getJobs !== 0" label="岗位">
        <treeselect v-model="form.job" :options="getJobs" style="width: 370px;" placeholder="上级岗位" />
      </el-form-item>
      <!-- <el-form-item label="员工类型" >
        <el-input v-model="form.partyTypeName" style="width: 370px;"/>
      </el-form-item> -->
      <el-form-item label="员工类型" >
        <el-select v-model="form.partyType" placeholder="请选择" style="width: 370px;">
          <el-option v-for="item in partyTypes" :key="item.value" :label="item.partyType.partyTypeName" :value="item.partyType" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" >
        <el-select v-model="form.status" placeholder="请选择" style="width: 370px;">
          <el-option v-for="item in partyTypes" :key="item.value" :label="item.status" :value="item.status" />
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
      // options: [{
      //   value: '选项1',
      //   label: '在职'
      // }, {
      //   value: '选项2',
      //   label: '实习'
      // }, {
      //   value: '选项3',
      //   label: '试用'
      // }, {
      //   value: '选项4',
      //   label: '劝退离职'
      // }, {
      //   value: '选项5',
      //   label: '主动离职'
      // }],
      options: [],
      value: '',
      loading: false, dialog: false,
      parentJobs: [],
      form: {
        partyId: '',
        partyType: '',
        partyTypeName: '',
        status: '',
        getOrganizations: '',
        code: '',
        name: '',
        organization: {},
        getJobs: '',
        jobId: '',
        organizationId: ''
      },
      getOrganizations: '',
      organizationId: '',
      getJobs: '',
      partyTypes: '',
      partyType: '',
      status: '',
      rules: {
      }
    }
  },
  created() {
    this.queryAllOrganization()
    this.getAllJob()
    this.getAllParty()
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    queryAllOrganization() {
      getOrganization().then(res => {
        this.organizations = res
        this.getOrganizations = res.content
      })
    },
    getAllParty() {
      getAllParty().then(res => {
        this.partyTypes = res.content
        console.log(res)
      })
    },
    getAllJob() {
      getAllJob().then(res => {
        this.getJobs = res.content
      })
    },
    doSubmit() {
      this.loading = true
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
