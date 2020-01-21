<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增' : '编辑'" width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px" status-icon>
      <el-row :gutter="15">
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="当前案卷" prop="messageName" >
            <el-input v-model="form.messageName" disabled style="width: 370px;"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="档案号" prop="code">
            <el-input v-model="form.code" style="width: 370px;" disabled/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="题名" prop="name">
            <el-input v-model="form.name" style="width: 370px;"/>
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
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="页号" prop="pageNo">
            <el-input v-model="form.pageNo" style="width: 370px;"/>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="保管期限" prop="preservationPeriod">
            <el-select v-model="form.preservationPeriod">
              <el-option
                v-for="item in preservationPeriod"
                :key="item"
                :label="item"
                :value="item"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="卷内序号" prop="no">
            <el-input v-model="form.no" />
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="开始日期" prop="fromDate">
            <el-date-picker v-model="form.fromDate" type="date" style="width: 200px;" placeholder="选择日期"/>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="结束日期" prop="thurDate">
            <el-date-picker
              v-model="form.thurDate"
              type="date"
              style="width: 152.5px;"
              placeholder="选择日期"/>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="分类号" prop="classificationCode">
            <!--<el-select v-model="form.classificationCode" filterable clearable>-->
            <!--<el-option-->
            <!--v-for="item in documentClassCodeArr"-->
            <!--:key="item"-->
            <!--:label="item"-->
            <!--:value="item"/>-->
            <!--</el-select>-->
            <el-input v-model="form.classificationCode" disabled style="width: 200px;"/>
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
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="年度" prop="year">
            <el-select v-model="form.year">
              <el-option
                v-for="item in yearArr"
                :key="item"
                :label="item"
                :value="item"
                style="width: 180px"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="立卷人" prop="docCreator" style="width: 400px">
            <el-select v-model="form.docCreator" :remote-method="remoteMethod" filterable remote clearable class="filter-item" style="width: 180px">
              <el-option
                v-for="(item, index) in partys"
                :key="item.name + index"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="立卷时间" prop="docCreatedDate">
            <el-date-picker
              v-model="form.docCreatedDate"
              type="date"
              placeholder="选择日期"
              style="width: 152.5px;"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="责任者" prop="chargePerson">
            <el-input v-model="form.chargePerson" style="width: 370px;"/>
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
          <el-form-item label="立卷单位" prop="docCreatedOrg">
            <el-input v-model="form.docCreatedOrg" style="width: 370px;"/>
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
import { add, edit } from '@/api/documentDetail'
import { parseTime } from '@/utils/index'
import { getAllPartyNopage } from '@/api/party'
import { getData } from '@/api/documentClass'
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
      documentClassCodeArr: [],
      partys: '',
      party: '',
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
        document: '',
        fromDate: '',
        thurDate: ''
      },
      rules: {
        // classificationCode: [{ required: true, message: '请输入分类号', trigger: 'blur' }],
        // documentId: [{ required: true, message: '必填', trigger: 'blur' }],
        // code: [{ required: true, message: '请输入档案号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入题名', trigger: 'blur' }],
        preservationPeriod: [{ required: true, message: '请输入保管期限', trigger: 'blur' }],
        // no: [{ required: true, message: '请输入卷内序号', trigger: 'blur' }]
        fromDate: [{ required: true, message: '请输入开始日期', trigger: 'blur' }],
        contentType: [{ required: true, message: '请输入载体类型', trigger: 'blur' }],
        docCreator: [{ required: true, message: '请输入立卷人', trigger: 'blur' }],
        docCreatedDate: [{ required: true, message: '请输入立卷时间', trigger: 'blur' }],
        messageName: [{ required: true, message: '请输入当前案卷名', trigger: 'blur' }],
        pages: [{ required: true, message: '请输入页数', trigger: 'blur' }],
        copies: [{ required: true, message: '请输入份数', trigger: 'blur' }]
      },
      contentType: ['电子', '纸质'],
      preservationPeriod: ['长期', '短期', '永久']
    }
  },
  computed: {
    yearArr() {
      const arr2 = []
      let year = new Date().getFullYear() - 10
      for (let i = 0; i <= 20; i++) {
        arr2.push(year++)
      }
      return arr2
    }
  },
  created() {
    this.getPartys({ partyType: 'EMPLOYEE' })
    // 获取分类号
    // this.getDocumentClassCode()
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
      this.form.fromDate = parseTime(this.form.fromDate)
      this.form.thurDate = parseTime(this.form.thurDate)
      this.form.docCreatedDate = parseTime(this.form.docCreatedDate)
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
        this.$parent.$parent.$refs.document.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      this.form.fromDate = parseTime(this.form.fromDate)
      this.form.thurDate = parseTime(this.form.thurDate)
      this.form.docCreatedDate = parseTime(this.form.docCreatedDate)
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
        this.$parent.$parent.$refs.document.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    // 输入立卷人时对所有人员进行模糊查询
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          var para = { name: query, partyType: 'EMPLOYEE' }
          this.getPartys(para)
        }, 50)
      } else {
        this.partys = []
      }
    },
    // 获取全部人员信息
    getPartys(para) {
      getAllPartyNopage(para).then(res => {
        this.partys = res
      }).catch(err => {
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
