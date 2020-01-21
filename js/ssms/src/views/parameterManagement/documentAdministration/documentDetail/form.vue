<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增' : '编辑'" width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px" status-icon>
      <el-form-item label="档案号" prop="code">
        <el-input v-model="form.code" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="题名" prop="name">
        <el-input v-model="form.name" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="份数" prop="copies">
        <el-input v-model="form.copies" :min="1" type="number" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="页数" prop="pages">
        <el-input v-model="form.pages" :min="1" type="number" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="页号" prop="pageNo">
        <el-input v-model="form.pageNo" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="保管期限" prop="preservationPeriod">
        <el-input v-model="form.preservationPeriod" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="开始日期">
        <el-date-picker v-model="form.fromDate" type="date" style="width: 370px;" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss"/>
      </el-form-item>
      <el-form-item label="结束日期" prop="thurDate">
        <el-date-picker
          v-model="form.thurDate"
          type="date"
          style="width: 370px;"
          format="yyyy - MM - dd "
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期"/>
      </el-form-item>
      <el-form-item label="载体类型" prop="contentType">
        <el-select v-model="form.contentType">
          <el-option
            v-for="item in contentType"
            :key="item"
            :label="item"
            :value="item"/>
        </el-select>
      </el-form-item>
      <el-form-item label="分类号" prop="classificationCode">
        <el-input v-model="form.classificationCode" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="年度" prop="year">
        <el-input v-model="form.year" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="责任者" prop="chargePerson">
        <el-input v-model="form.chargePerson" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="立卷人" prop="docCreator">
        <el-input v-model="form.docCreator" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="密级" prop="securityLevel">
        <el-input v-model="form.securityLevel" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="全宗名称" prop="fullName">
        <el-input v-model="form.fullName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="立卷时间" prop="docCreatedDate">
        <el-date-picker
          v-model="form.docCreatedDate"
          type="date"
          style="width: 370px;"
          format="yyyy - MM - dd "
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期"/>
      </el-form-item>
      <el-form-item label="立卷单位" prop="docCreatedOrg">
        <el-input v-model="form.docCreatedOrg" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="卷内序号" prop="no">
        <el-input v-model="form.no" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="案卷名" prop="messageName" >
        <el-input v-model="form.messageName" disabled style="width: 370px;"/>
      </el-form-item>
      <!--<el-form-item label="案卷" prop="documentId">-->
      <!--<el-input v-model="form.documentId" disabled style="width: 370px;"/>-->
      <!--</el-form-item>-->
      <el-form-item label="备注" prop="comments">
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
import { add, edit } from '@/api/documentDetail'
import { parseTime } from '@/utils/index'
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
        documentDetailId: '',
        copies: '',
        comments: '',
        // createdDate: '',
        createdBy: '',
        // lastModifiedDate: '',
        lastModifiedBy: '',
        pages: '',
        title: '',
        no: '',
        // documentId: '',
        preservationPeriod: '',
        code: '',
        name: '',
        classificationCode: '',
        status: '',
        pageNo: '',
        chargePerson: '',
        docCreator: '',
        securityLevel: '',
        fullName: '',
        docCreatedDate: '',
        docCreatedOrg: '',
        year: '',
        contentType: '',
        document: ''
      },
      rules: {
        classificationCode: [{ required: true, message: '请输入分类号', trigger: 'blur' }],
        // documentId: [{ required: true, message: '必填', trigger: 'blur' }],
        // code: [{ required: true, message: '请输入档案号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入题名', trigger: 'blur' }],
        preservationPeriod: [{ required: true, message: '请输入保管期限', trigger: 'blur' }],
        no: [{ required: true, message: '请输入卷内序号', trigger: 'blur' }]
      },
      contentType: ['电子', '纸质']
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
        documentDetailId: '',
        copies: '',
        comments: '',
        createdDate: '',
        createdBy: '',
        lastModifiedDate: '',
        lastModifiedBy: '',
        pages: '',
        title: '',
        no: '',
        // documentId: '',
        preservationPeriod: '',
        code: '',
        name: '',
        classificationCode: '',
        status: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
