<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增客户' : '编辑'" width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px" status-icon>
      <el-row :gutter="15">
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="公司名称" prop="companyName">
            <el-input v-model="form.companyName" style="width: 370px;"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="供货范围" prop="supplyScope">
            <el-input v-model="form.supplyScope" :rows="2" type="textarea" style="width: 370px;"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="联系人" prop="contact">
            <el-input v-model="form.contact" style="width: 370px;"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input v-model="form.contactPhone" style="width: 370px;"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="备注" prop="comments">
            <el-input v-model="form.comments" :rows="2" type="textarea" style="width: 370px;"/>
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
import { add, edit } from '@/api/supply'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    var validateContactPhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入联系电话'))
      } else {
        if (value !== '') {
          const reg = /^((0\d{2,3}(-?)\d{7,8})|(1[3456789]\d{9}))$/
          if (!reg.test(value)) {
            callback(new Error('请输入正确的手机号码或固定电话'))
          }
        }
        callback()
      }
    }
    return {
      loading: false, dialog: false,
      form: {
        supplyId: '',
        status: '',
        createdDate: '',
        lastModifiedDate: '',
        createdBy: '',
        lastModifiedBy: '',
        companyCode: '',
        companyName: '',
        supplyScope: '',
        contactPhone: '',
        contact: '',
        comments: '',
        supplyType: ''
      },
      rules: {
        companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        supplyScope: [{ required: true, message: '请输入供货范围', trigger: 'blur' }],
        contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        contactPhone: [{ required: true, validator: validateContactPhone, trigger: 'blur' }]
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
          if (this.isAdd) {
            this.doAdd()
          } else this.doEdit()
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
        supplyId: '',
        status: '',
        createdDate: '',
        lastModifiedDate: '',
        createdBy: '',
        lastModifiedBy: '',
        companyCode: '',
        companyName: '',
        supplyScope: '',
        contactPhone: '',
        contact: '',
        comments: '',
        supplyType: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
