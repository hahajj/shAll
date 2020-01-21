<template>
  <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="resetForm" :title="isAdd ? '新增用户' : '编辑用户'" append-to-body width="570px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"/>
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="roleIds" style="width: 400px;" multiple placeholder="请选择">
          <el-option
            v-for="(item, index) in roles"
            :disabled="level !== 1 && item.level <= level"
            :key="item.name + index"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="关联员工">
        <el-select v-model="partyId" :remote-method="remoteMethod" filterable remote placeholder="请选择" clearable class="filter-item" style="width: 450px">
          <el-option
            v-for="(item, index) in partys"
            :key="item.name + index"
            :label="item.name+'/' + item.code "
            :value="item.partyId"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="!isAdd" label="密码" prop="password">
        <el-input v-model="form.password" type="password"/>
      </el-form-item>
      <el-form-item v-if="!isAdd" style="margin-bottom: 0px;" label="确认密码" prop="repassword">
        <el-input v-model="form.repassword" type="password"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { add, edit } from '@/api/user'
import { getOrganization } from '@/api/organization'
import { getAllRole, getLevel } from '@/api/role'
import Treeselect from '@riophae/vue-treeselect'
import { getPartysByNameOrCode } from '@/api/party'
// import { getAllParty } from '@/api/party'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    dicts: {
      type: Array,
      required: true
    }
  },
  data() {
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!this.isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      dialog: false,
      loading: false,
      partyId: '',
      form: { username: '', email: '', enabled: 'false', roles: [], phone: null, partyId: '', party: {}, password: '', repassword: '' },
      roleIds: [], roles: [], organizations: [], organizationId: null, jobId: null, jobs: [], style: 'width: 184px', level: 3, partys: [],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validPhone }
        ],
        enabled: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    const explorer = navigator.userAgent
    if (explorer.indexOf('Chrome') >= 0) {
      this.style = 'width: 184px'
    } else {
      this.style = 'width: 172px'
    }
    this.getPartys()
  },
  methods: {
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
      if (!para) {
        para = ''
      }
      getPartysByNameOrCode(para).then(res => {
        this.partys = res
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.roleIds.length === 0) {
            this.$message({
              message: '角色不能为空',
              type: 'warning'
            })
          } else {
            this.form.roles = []
            const _this = this
            if (!this.partyId) {
              this.form.party = null
            } else {
              this.form.party = { partyId: this.partyId }
            }
            this.roleIds.forEach(function(data, index) {
              const role = { id: data }
              _this.form.roles.push(role)
            })
            if (this.isAdd) {
              this.doAdd()
            } else {
              // if (this.form.password === '' || this.form.repassword === '') {
              //   this.$message({
              //     message: '请输入密码或确认密码',
              //     type: 'warning'
              //   })
              //   return false
              // }
              if (this.form.password !== this.form.repassword) {
                this.$message({
                  message: '两次密码输入不一致',
                  type: 'warning'
                })
                return false
              }
              this.loading = true
              this.doEdit()
            }
          }
        } else {
          return false
        }
      })
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          message: '默认密码：123456',
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
      // this.$refs['form'].resetFields()
      this.organizationId = null
      this.jobId = null
      this.roleIds = []
      this.form = { username: '', email: '', enabled: 'false', roles: [], job: { id: '' }, dept: { id: '' }, phone: null, party: '' }
      this.partys = []
      this.partyId = ''
    },
    getRoles() {
      getAllRole().then(res => {
        this.roles = res
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    getOrganizations() {
      getOrganization({ enabled: true }).then(res => {
        this.organizations = res.content
      })
    },
    isvalidPhone(str) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
      return reg.test(str)
    },
    selectFun(node, instanceId) {
      this.getJobs(node.id)
    },
    getRoleLevel() {
      getLevel().then(res => {
        this.level = res.level
      }).catch(err => {
        console.log(err.response.data.message)
      })
    }
    // getAllParty() {
    //   getAllParty().then(res => {
    //     this.partys = res.content
    //     console.log(this.partys)
    //   }).catch(err => {
    //     console.log(err.response.data.message)
    //   })
    // }
  }
}
</script>

<style scoped>

</style>
