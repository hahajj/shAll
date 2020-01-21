<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增' : '编辑'" width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px" status-icon>
      <el-row :gutter="15">
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="一级类别" prop="firstcode">
            <el-select v-model="form.firstcode" :disabled="!isAdd" >
              <el-option
                v-for="item in firstDocumentClassData"
                :key="item.id"
                :label="item.label"
                :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="二级类别" prop="documentClassID">
            <el-select v-model="form.documentClassID" :disabled="!isAdd" @change="changeSecondCode(form.documentClassID)">
              <el-option
                v-for="item in secondDocumentClassData"
                :key="item.id"
                :label="item.label"
                :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="档案号" prop="code">
            <el-input v-model="form.code" placeholder="系统可自动生成"/>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="案卷目录号" prop="catalogNumber">
            <el-input v-model="form.catalogNumber" />
          </el-form-item>
        </el-col>
        <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
          <el-form-item label="份数" prop="copies">
            <el-input v-model="form.copies" :min="1" type="number" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"/>
          </el-form-item>
        </el-col>
        <el-col :xs="13" :sm="13" :md="13" :lg="13" :xl="13">
          <el-form-item label="页数" prop="pages">
            <el-input v-model="form.pages" :min="1" type="number" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"/>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="题名" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="分类号" prop="classNumber">
            <el-input v-model="form.classNumber" :disabled="!isAdd" />
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="保管期限" prop="preservationPeriod">
            <el-input v-model="form.preservationPeriod" />
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="案卷序号" prop="no">
            <el-input v-model="form.no" />
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="开始日期">
            <el-date-picker v-model="form.fromDate" type="date" style="width: 200px;" placeholder="选择日期"/>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="结束日期" prop="thurDate">
            <el-date-picker
              v-model="form.thurDate"
              type="date"
              style="width: 152.5px;"
              format="yyyy - MM - dd "
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"/>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="年度" prop="year">
            <el-input v-model="form.year"/>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="载体类型" prop="contentType">
            <el-select v-model="form.contentType">
              <el-option
                v-for="item in contentType"
                :key="item"
                :label="item"
                :value="item"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="立卷人" prop="docCreator">
            <el-input v-model="form.docCreator"/>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="立卷时间" prop="docCreatedDate">
            <el-date-picker
              v-model="form.docCreatedDate"
              type="date"
              style="width: 152.5px;"
              format="yyyy - MM - dd "
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"/>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="立卷单位" prop="docCreatedOrg">
            <el-input v-model="form.docCreatedOrg"/>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="归档日期" prop="filingDate">
            <el-date-picker
              v-model="form.filingDate"
              type="date"
              style="width: 152.5px;"
              format="yyyy - MM - dd "
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"/>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="存放地点" prop="location">
            <el-input v-model="form.location" style="width: 370px;"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="归档单位" prop="filingOrganization">
            <el-input v-model="form.filingOrganization" style="width: 370px;" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="密级" prop="securityLevel">
            <el-input v-model="form.securityLevel" style="width: 370px;"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="全宗名称" prop="fullName">
            <el-input v-model="form.fullName" style="width: 370px;"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="主题词" prop="heading">
            <el-input v-model="form.heading" style="width: 370px;"/>
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
import { add, edit } from '@/api/document'
import { getData } from '@/api/documentClass'
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
      firstDocumentClassData: [],
      secondDocumentClassData: [],
      contentType: ['纸质', '电子'],
      form: {
        catalogNumber: '',
        documentId: '',
        documentClassId: '',
        comments: '',
        createdDate: '',
        createdBy: '',
        lastModifiedDate: '',
        lastModifiedBy: '',
        code: '',
        name: '',
        preservationPeriod: '',
        fromDate: '',
        thurDate: '',
        year: '',
        docCreator: '',
        docCreatedOrg: '',
        docCreatedDate: '',
        contentType: '',
        copies: '',
        pages: '',
        no: '',
        documentClass: { documentClassId: '' },
        fullName: '',
        filingDate: '',
        classNumber: '',
        securityLevel: ''
      },
      rules: {
        firstcode: [{ required: true, message: '请输入一级类别', trigger: 'blur' }],
        documentClassID: [{ required: true, message: '请输入二级类别', trigger: 'blur' }],
        // code: [{ required: true, message: '请输入案卷号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入题名', trigger: 'blur' }],
        // preservationPeriod: [{ required: true, message: '必填', trigger: 'blur' }],
        no: [{ required: true, message: '请输入案卷序号', trigger: 'blur' }],
        fromDate: [{ required: true, message: '请输入开始日期', trigger: 'blur' }],
        // thurDate: [{ required: true, message: '必填', trigger: 'blur' }],
        year: [{ required: true, message: '请输入年度', trigger: 'blur' }],
        contentType: [{ required: true, message: '请输入载体类型', trigger: 'blur' }],
        docCreator: [{ required: true, message: '请输入立卷人', trigger: 'blur' }],
        docCreatedDate: [{ required: true, message: '请输入立卷时间', trigger: 'blur' }],
        docCreatedOrg: [{ required: true, message: '请输入立卷单位', trigger: 'blur' }]
      }
    }
  },
  watch: {
    form: {
      handler: function(val, oldval) {
      },
      deep: true
    },
    'form.firstcode'(val, oldVal) {
      this.changeFirstCode(val)
    }
  },
  created() {
    getData({ parentClass: null }).then(res => {
      this.$nextTick(() => {
        this.firstDocumentClassData = res.content
      })
    })
  },
  methods: {
    changeFirstCode(id) {
      getData({ parentClassId: id }).then(res => {
        this.$nextTick(() => {
          this.secondDocumentClassData = res.content
        })
      })
    },
    changeSecondCode(id) {
      this.form.documentClass.documentClassId = id
    },
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
      this.form.fromDate = parseTime(this.form.fromDate)
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
      this.form.fromDate = parseTime(this.form.fromDate)
      this.form.thurDate = parseTime(this.form.thurDate)
      this.form.docCreatedDate = parseTime(this.form.docCreatedDate)
      this.form.filingDate = parseTime(this.form.filingDate)
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
        documentId: '',
        documentClassId: '',
        comments: '',
        createdDate: '',
        createdBy: '',
        lastModifiedDate: '',
        lastModifiedBy: '',
        code: '',
        name: '',
        preservationPeriod: '',
        fromDate: '',
        thurDate: '',
        year: '',
        docCreator: '',
        docCreatedOrg: '',
        docCreatedDate: '',
        contentType: '',
        copies: '',
        pages: '',
        no: '',
        documentClass: { documentClassId: '' }
      }
    }
  }
}
</script>

<style scoped>

</style>
