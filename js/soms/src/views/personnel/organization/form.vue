<template>
  <el-dialog
    :append-to-body="true"
    :visible.sync="dialog"
    :close-on-click-modal="false"
    :before-close="resetForm"
    :title="isAdd ? '新增' : '编辑'"
    width="500px"
  >
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="组织类型" prop="organizationType">
        <treeselect v-model="form.organizationType" :options="organizationTypes" style="width: 370px" placeholder="选择组织类型"/>
      </el-form-item>
      <el-form-item v-if="form.parentOrganization !== 0" label="上级组织" prop="parentOrganization">
        <treeselect v-model="form.parentOrganization" :options="parentOrganizations" style="width: 370px" placeholder="选择上级组织"/>
      </el-form-item>
      <el-form-item prop="name" label="组织名称">
        <el-input v-model="form.name" style="width: 370px;" />
      </el-form-item>
      <el-form-item prop="email" label="组织邮箱">
        <el-input v-model="form.email" style="width: 370px;" />
      </el-form-item>
      <el-form-item prop="contactMech" label="联系方式" >
        <el-input v-model="form.contactMech" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.comments" type="textarea" style="width: 370px;" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getOrganization, add, edit } from '@/api/organization'
export default {
  components: { Treeselect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    var validateParentOrganization = (rule, value, callback) => {
      if (this.form.parentOrganization === this.form.id) {
        callback(new Error('无法选择自身为上级!'))
      } else {
        callback()
      }
    }
    var validateOrganizationType = (rule, value, callback) => {
      if (this.form.organizationType === 'COMPANY' || this.form.organizationType === 'DEPT') {
        callback(new Error('请选择公司或者部门下的具体的组织类型!'))
      } else {
        callback()
      }
    }

    var isvalidPhone = function(str) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
      return reg.test(str)
    }

    var validPhone = (rule, value, callback) => {
      if (value) {
        if (!isvalidPhone(value)) {
          callback(new Error('请输入正确的11位手机号码'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      loading: false,
      dialog: false,
      form: {
        id: '',
        parentOrganization: null,
        organizationType: null,
        name: '',
        parent: '',
        comments: '',
        email: '',
        contactMech: ''
      },
      ref: {
        email: '',
        phone: ''
      },
      rules: {
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        contactMech: [
          { required: false, trigger: 'blur', validator: validPhone }
        ],
        name: [{ required: true, message: '请输入组织名称', trigger: 'blur' }],
        parentOrganization: [
          // { required: true, message: '请输入组织名称', trigger: 'blur' },
          { validator: validateParentOrganization, trigger: 'blur' }],
        organizationType: [
          // { required: true, message: '请输入组织名称', trigger: 'blur' },
          { required: true, validator: validateOrganizationType, trigger: 'blur' }]
      },
      lastIndexOf: null,
      parentOrganizations: [],
      parentOrganization: null,
      organizationTypes: '',
      options: [
        {
          value: 'BRANCH_COMPANY',
          label: '管理公司'
        }
      ],
      value: ''
    }
  },
  created() {
    this.$nextTick(() => {
      this.queryAllOrganization()
    })
  },
  methods: {
    beforeInit() {
      this.url = 'api/organization'
      const sort = 'organizationId,desc,organizationType'
      const query = this.query
      const organizationType = query.organizationType
      const name = query.name
      this.params = { page: this.page, size: this.size, sort: sort }
      if (organizationType) {
        this.params['organizationType'] = organizationType
      }
      if (name) {
        this.params['name'] = name
      }
      return true
    },
    queryAllOrganization() {
      getOrganization({ size: 9999, organizationType: 'BRANCH_COMPANY,COMPANY,DEPT,LAND_DEPT,PARENT_COMPANY' }).then(res => {
        this.parentOrganizations = res.content
        // console.log(this.parentOrganizations)
      })
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          console.log(this.form.organizationType)
          if (this.form.organizationType === 'COMPANY' || this.form.organizationType === 'DEPT') {
            this.$message({
              message: '请选择公司或者部门下的具体的组织类型',
              type: 'error'
            })
            return
          }
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
      this.form.status = 'USE'
      add(this.form)
        .then(res => {
          this.resetForm()
          this.$notify({
            title: '添加成功',
            type: 'success',
            duration: 2500
          })
          this.loading = false
          this.$parent.init()
        })
        .catch(err => {
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
        parentOrganization: null,
        organizationType: null,
        name: '',
        email: '',
        comments: '',
        contactMech: ''
      }
    }
  }
}
</script>

<style scoped>
</style>
