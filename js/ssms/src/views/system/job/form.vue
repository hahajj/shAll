<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="resetForm" :visible.sync="dialog" :title="isAdd ? '新增岗位' : '编辑岗位'" width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="岗位序列类型" prop="jobType">
        <el-select v-model="form.jobType" style="width: 370px;">
          <el-option
            v-for="item in jobTypes.content"
            :key="item.jobType"
            :label="item.jobTypeName"
            :value="item.jobType"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.parentJob !== 0" label="上级岗位" prop="parentJob">
        <treeselect v-model="form.parentJob" :options="parentJobs" style="width: 370px;" placeholder="选择上级岗位" />
      </el-form-item>
      <el-form-item label="备注" >
        <el-input v-model="form.comments" style="width: 370px;" type="textarea" placeholder="请输入内容" maxlength="255" show-word-limit />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import { getOrganization } from '@/api/organization'
import { add, edit, getAllJob } from '@/api/job'
import Treeselect from '@riophae/vue-treeselect'
import { getAllJobType } from '@/api/jobType'
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
    var validateParentJob = (rule, value, callback) => {
      // if (value === '' || value === undefined) {
      //   callback(new Error('请选择上级组织'))
      // }
      if (this.form.parentJob === this.form.jobId) {
        callback(new Error('无法选择自身为上级!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      dialog: false,
      jobTypes: [],
      parentJobs: [],
      form: {
        jobId: '',
        name: '',
        jobType: '',
        status: 'USE',
        // parentJob: '',
        comments: '',
        createdDate: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        jobType: [
          { required: true, message: '请选择岗位序列类型', trigger: 'blur' }
        ],
        parentJob: [
          { validator: validateParentJob, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.queryAllJobType()
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    getAllJob() {
      getAllJob().then(res => {
        this.parentJobs = res.content
      })
    },
    queryAllJobType() {
      getAllJobType().then(res => {
        this.jobTypes = res
      })
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      // this.form.organization.id = this.organizationId
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // if (this.organizationId === null || this.organizationId === undefined) {
          //   this.$message({
          //     message: '所属部门不能为空',
          //     type: 'warning'
          //   })
          // } else {
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else this.doEdit()
        }
        // }
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
      this.organizationId = null
      this.form = {
        jobId: '',
        name: '',
        jobType: '',
        status: 'USE',
        // parentJob: '',
        comments: '',
        createdDate: ''
      }
    }
    // getOrganization() {
    //   getOrganization({ enabled: true }).then(res => {
    //     this.organizations = res.content
    //   })
    // }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
