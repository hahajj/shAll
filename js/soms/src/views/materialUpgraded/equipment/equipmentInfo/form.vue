<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :before-close="resetForm" :title="isType === '新增' ? '新增' : '编辑'" width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px" status-icon>
      <el-row :gutter="15">
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="申请人" prop="applicant">
            <el-input v-model="form.applicant" disabled style="width: 370px;"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="申请时间" prop="createdDate">
            <el-input v-model="form.createdDate" disabled style="width: 370px;"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="申请部门" prop="requireDeptName">
            <el-select v-model="form.requireDeptName" placeholder="请选择部门" clearable style="width: 152.5px;">
              <el-option
                v-for="item in requireDeptName"
                :key="item"
                :label="item"
                :value="item"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/equipment'
export default {
  props: {
    isType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      requireDeptName: ['甲板部', '轮机部'],
      form: {
        applicant: this.$store.state.user.user.username,
        createdDate: '',
        requireDeptName: '',
        organizationId: this.$store.state.user.user.partyDTO.organization.organizationId,
        createdBy: '',
        comments: '',
        lastModifiedDate: '',
        lastModifiedBy: '',
        status: '',
        equipmentPartPurchaseId: ''
      },
      rules: {
        applicant: [{ required: true, message: '请输入申请人', trigger: 'blur' }],
        createdDate: [{ required: true, message: '请输入申请时间', trigger: 'blur' }],
        requireDeptName: [{ required: true, message: '请输入申请部门', trigger: 'blur' }]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isType === '新增') {
            this.doAdd()
          } else this.doEdit()
        }
      })
    },
    doAdd() {
      this.form.createdDate = new Date(this.form.createdDate).getTime()
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
      this.form.createdDate = new Date(this.form.createdDate).getTime()
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
        applicant: this.$store.state.user.user.username,
        organizationId: this.$store.state.user.user.partyDTO.organization.organizationId,
        createdDate: '',
        requireDeptName: '',
        createdBy: '',
        comments: '',
        lastModifiedDate: '',
        lastModifiedBy: '',
        status: '',
        equipmentPartPurchaseId: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
