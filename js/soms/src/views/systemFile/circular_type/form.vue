<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增' : '编辑'" width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
      <!--<el-form-item label="类名" >-->
      <!--<el-input v-model="form.circularTypeName" style="width: 370px;"/>-->
      <!--</el-form-item>-->
      <el-form-item label="选择级别" prop="level">
        <el-select v-model="form.level" :disabled="!isAdd" style="width: 370px;" >
          <el-option
            v-for="(item,index) in levelTypeList"
            :key="index"
            :label="item"
            :value="index+1"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.level==2" label="一级类别名称" prop="parent.circularType">
        <el-select v-model="form.parent.circularType" :disabled="!isAdd" style="width: 370px;">
          <el-option
            v-for="item in firstCircularTypeData"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="form.level==2?'二级类别名称':'一级类别名称'" prop="circularTypeName">
        <el-input v-model="form.circularTypeName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="优先级" prop="priority">
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
      firstCircularTypeData: [],
      levelTypeList: ['一级类别', '二级类别'],
      form: {
        circularType: '',
        circularTypeName: '',
        parent: {},
        priority: ''
      },
      rules: {
        level: [
          { required: true, message: '请选择级别', trigger: 'blur' }
        ], 'parent.circularType': [
          { required: true, message: '请选择类别名称', trigger: 'blur' }
        ], circularTypeName: [
          { required: true, message: '请输入类别名称', trigger: 'blur' }
        ], priority: [
          { required: true, message: '请输入优先级', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      if (this.form.level == 1) {
        this.form.parent = null
      }

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
        circularType: '',
        circularTypeName: '',
        parent: {},
        priority: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
