<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增' : '编辑'" width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
      <el-form-item v-if="!isAdd" label="序号">
        <el-input v-model="form.cargoId" style="width: 370px;" disabled/>
      </el-form-item>
      <el-form-item v-if="!isAdd" label="操作时间">
        <el-input v-model="form.lastModifiedDateL" style="width: 370px;" disabled/>
      </el-form-item>
      <el-form-item label="货物名称" prop="name">
        <el-input v-model="form.name" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="货物特点" >
        <el-input v-model="form.cargoSpec" style="width: 370px;"/>
      </el-form-item>

      <el-form-item label="备注" >
        <el-input v-model="form.comments" :rows="2" type="textarea" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/cargo'
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
      firstDocumentClassData: [],
      form: {
        cargoSpec: '',
        name: '',
        comments: '',
        lastModifiedDateL: ''
      },
      rules: {
        name: [{ required: true, message: '请输入货物名称', trigger: 'blur' }],
        cargoSpec: [{ required: true, message: '请输入货物特点', trigger: 'blur' }]
      }
    }
  },
  created() {

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
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        cargoSpec: '',
        name: '',
        comments: '',
        lastModifiedDateL: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
