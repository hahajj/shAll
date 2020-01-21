<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增' : '编辑'" width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
      <el-form-item label="类别名称" >
        <el-input v-model="form.circularTypeName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="createdDate" >
        <el-input v-model="form.createdDate" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="createdBy" >
        <el-input v-model="form.createdBy" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="lastModifiedDate" >
        <el-input v-model="form.lastModifiedDate" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="lastModifiedBy" >
        <el-input v-model="form.lastModifiedBy" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="parent" >
        <el-input v-model="form.parent" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="status" >
        <el-input v-model="form.status" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="优先级" >
        <el-input v-model="form.priority" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/circularType'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        circularType: '',
        circularTypeName: '',
        createdDate: '',
        createdBy: '',
        lastModifiedDate: '',
        lastModifiedBy: '',
        parent: '',
        status: '',
        priority: ''
      },
      rules: {
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
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
        circularType: '',
        circularTypeName: '',
        createdDate: '',
        createdBy: '',
        lastModifiedDate: '',
        lastModifiedBy: '',
        parent: '',
        status: '',
        priority: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
