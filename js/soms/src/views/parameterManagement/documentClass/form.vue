<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增' : '编辑'" width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
      <el-form-item label="选择级别" >
        <el-select v-model="form.level" :disabled="!isAdd" style="width: 370px;" >
          <el-option
            v-for="(item,index) in levelTypeList"
            :key="index"
            :label="item"
            :value="index+1"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.level==2" label="一级科目名称">
        <el-select v-model="form.parentClassId" :disabled="!isAdd" style="width: 370px;" @change="acc(form.parentClassId)">
          <el-option
            v-for="item in firstDocumentClassData"
            :key="item.id"
            :label="item.documentClassName"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="form.level==1?'一级科目名称':'二级科目名称'" >
        <el-input v-model="form.documentClassName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="科目分类号" >
        <el-input v-model="form.documentClassCode" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="科目范围" >
        <el-input v-model="form.scope" :rows="2" type="textarea" style="width: 370px;"/>
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
import { add, edit } from '@/api/documentClass'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      levelTypeList: ['一级科目', '二级科目'],
      loading: false, dialog: false,
      firstDocumentClassData: [],
      form: {
        parentClassId: '',
        documentClassId: '',
        documentClassName: '',
        documentClassCode: '',
        comments: '',
        createdDate: '',
        createdBy: '',
        lastModifiedDate: '',
        lastModifiedBy: '',
        parentClass: null,
        level: '',
        scope: '',
        status: ''

      },
      rules: {
      }
    }
  },
  created() {

  },
  methods: {
    acc(id) {
      console.log(id)
      // this.form.parentClass = this.firstDocumentClassData.filter(item => {
      //   return item.id === id
      // })
      this.form.parentClass = id
      console.log(this.form.parentClass)
    },
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
        this.$parent.$parent.$parent.init()
        this.$parent.$parent.$parent.getClassData()()
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
        this.$parent.$parent.$parent.init()
        this.$parent.$parent.$parent.getClassData()()
      }).catch(err => {
        this.loading = false
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        parentClassId: '',
        documentClassId: '',
        documentClassName: '',
        documentClassCode: '',
        comments: '',
        createdDate: '',
        createdBy: '',
        lastModifiedDate: '',
        lastModifiedBy: '',
        parentClass: null,
        level: '',
        scope: '',
        status: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
