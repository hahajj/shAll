<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="true"
    :before-close="resetForm"
    :visible.sync="dialog"
    :title="isAdd ? '新增' : '编辑'"
    width="600px">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
      <!--<el-form-item label="调令编号" >-->
      <!--<el-input v-model="form.code"/>-->
      <!--</el-form-item>-->
      <el-form-item label="姓名" style="width: 400px" prop="party">
        <el-select
          v-model="form.party"
          :disabled="!isAdd"
          clearable
          style="width: 180px;"
          filterable
          placeholder="请选择"
          @change="getPartyByPartyId">
          <el-option
            v-for="(item, index) in partys"
            :key="item.name + index"
            :label="item.name+'/' + item.code "
            :value="item.partyId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="原船舶" prop="formerOrganizationName">
        <el-input v-model="form.formerOrganizationName" disabled/>
      </el-form-item>
      <el-form-item label="原职务" prop="formerJobName">
        <el-input v-model="form.formerJobName" disabled/>
      </el-form-item>
      <el-form-item label="现船舶" prop="newOrganization">
        <treeselect
          v-model="form.newOrganization"
          :options="organizations"
          :multiple="false"
          style="width: 180px"
          placeholder="请选择"/>
      </el-form-item>
      <el-form-item label="现职务" prop="newJob">
        <!--<el-select v-model="form.newJob" clearable style="width: 180px;" filterable placeholder="请选择">-->
        <!--<el-option-->
        <!--v-for="(item, index) in jobs"-->
        <!--:key="item.label + index"-->
        <!--:label="item.label"-->
        <!--:value="item.jobId"/>-->
        <!--</el-select>-->
        <treeselect v-model="form.newJob" :options="jobs" style="width: 180px;" class="left" placeholder="请选择"/>
      </el-form-item>
      <el-form-item label="调动类型" prop="partyChangeType">
        <el-select v-model="form.partyChangeType" clearable style="width: 180px;" filterable placeholder="请选择">
          <el-option
            v-for="(item, index) in partyChangeTypes"
            :key="item.partyChangeType + index"
            :label="item.partyChangeTypeName"
            :value="item.partyChangeType"/>
        </el-select>
      </el-form-item>
      <el-form-item label="生效时间" prop="changeDate">
        <el-date-picker
          v-model="form.changeDate"
          style="width: 180px;"
          align="right"
          type="date"
          placeholder="选择日期"/>
      </el-form-item>
      <el-form-item label="备注">
        <el-input :rows="3" v-model="form.commnets" type="textarea" style="width:462px"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, deleteRequest } from '@/api/partyChange'
import { getAllPartyNopage, getPartyByPartyId } from '@/api/party'
import { getOrganizationByCriteria } from '@/api/organization'
import { getAllPartyChangeType } from '@/api/partyChangeType'
import { getAllJob } from '@/api/job'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getPartyChange } from '../../../api/partyChange'
import { parseTime } from '@/utils/index'

export default {
  components: { Treeselect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    var validateChangeDate = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请选择生效时间'))
      } else {
      //   if (value < new Date(new Date(new Date().toLocaleDateString()).getTime())) {
      //     return callback(new Error('请选择大于等于当前时间的日期'))
      //   }
        callback()
      }
    }
    var validateNewOrganization = (rule, value, callback) => {
      if (this.form.partyChangeType === '6') {
        if (!value) {
          return callback(new Error('请选择现船舶'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validateNewJob = (rule, value, callback) => {
      if (this.form.partyChangeType === '6') {
        if (!value) {
          return callback(new Error('请选择现职位'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      loading: false,
      dialog: false,
      partys: [],
      party: {},
      partyId: '',
      organizations: [],
      organizationIds: null,
      jobs: [],
      formerDate: '',
      partyChangeTypes: [{ 'partyChangeTypeName': '上船', 'partyChangeType': '6' }, {
        'partyChangeTypeName': '下船',
        'partyChangeType': '7'
      }],
      form: {
        code: '',
        partyChangeId: '',
        createdDate: '',
        createdBy: null,
        lastModifiedDate: '',
        lastModifiedBy: null,
        partyId: '',
        changeDate: '',
        changeBy: null,
        commnets: '',
        changeType: '',
        formerOrganization: '',
        formerOrganizationName: '',
        formerJob: '',
        formerJobName: '',
        newOrganization: null,
        newJob: null,
        organizationLable: '',
        jobLable: '',
        jobId: ''
      },
      rules: {
        party: [
          { required: true, message: '请输入姓名', trigger: ['blur', 'change'] }
        ],
        formerOrganizationName: [
          { required: true, message: '请选择原船舶', trigger: ['blur', 'change'] }
        ],
        formerJobName: [
          { required: true, message: '请选择原职务', trigger: ['blur', 'change'] }
        ],
        newOrganization: [
          { validator: validateNewOrganization, trigger: ['blur', 'change'] }
        ],
        newJob: [
          { validator: validateNewJob, trigger: ['blur', 'change'] }
        ],
        partyChangeType: [
          { required: true, message: '请选择调动类型', trigger: ['blur', 'change'] }
        ],
        changeDate: [
          { required: true, validator: validateChangeDate, trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  watch: {
    // partyId() {
    //   this.getPartyByPartyId(this.partyId)
    // }
  },
  created() {
    this.getPartys()
    this.getOrganizations()
    this.getJobs()
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
    },
    doAdd() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.$message.error('请完善调令必填信息!')
          return false
        } else {
          this.loading = true
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
        }
      })
    },
    doEdit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          this.$message.error('请完善必填信息!')
          return false
        } else {
          if (this.form.auditWorkflowId) {
            this.deleteRequest()
          }
          console.log(this.form)
          var getPartyChangeParams = {
            party: this.form.party,
            auditStatus: '待审批,审批中',
            fromDate: parseTime(this.form.changeDate)
          }
          getPartyChange(getPartyChangeParams).then(res => {
            if (res && res.length > 0) {
              this.$confirm('此操作将删除后续在途调令, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.loading = true
                this.form.formerDate = parseTime(this.formerDate)
                this.form.changeDate = parseTime(this.form.changeDate)
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
              }).catch(() => {
                // this.$message({
                //   type: 'info',
                //   message: '已取消删除'
                // })
              })
            } else {
              this.loading = true
              this.form.formerDate = this.formerDate
              this.form.changeDate = this.form.changeDate
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
            }
          })

        }
      })
    },
    deleteRequest() {
      deleteRequest({ id: this.form.partyChangeId, tableName: 'party_change' }).then(res => {
        console.log('删除工作流成功')
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.partyId = ''
      this.organizationIds = null
      this.form = {
        code: '',
        partyChangeId: '',
        createdDate: '',
        createdBy: null,
        lastModifiedDate: '',
        lastModifiedBy: null,
        partyId: '',
        changeDate: '',
        changeBy: null,
        commnets: '',
        changeType: '',
        formerOrganization: '',
        formerOrganizationName: '',
        formerJob: '',
        formerJobName: '',
        newOrganization: null,
        newJob: null,
        organizationLable: '',
        jobLable: '',
        jobId: ''
      }
    },
    getPartys() {
      getAllPartyNopage({ partyType: 'CREW', statusSet: '在职,实习,试用,劝退离职,主动离职,在船,下船' }).then(res => {
        this.partys = res
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    getPartyByPartyId() {
      getPartyByPartyId(this.form.party).then(res => {
        this.party = res
        console.log(res)
        this.form.formerOrganization = res.organization.id
        this.form.formerJob = res.job.id
        this.form.formerOrganizationName = res.organization.label
        this.form.formerJobName = res.job.label
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    getOrganizations() {
      getOrganizationByCriteria({ 'organizationType': 'SHIP_DEPT' }).then(res => {
        this.organizations = res
      })
    },
    getJobs() {
      getAllJob({ 'jobType': 'SHIP' }).then(res => {
        this.jobs = res.content
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    getAllPartyChangeTypes() {
      getAllPartyChangeType().then(res => {
        this.partyChangeTypes = res
        console.log(this.partyChangeTypes)
      }).catch(err => {
        console.log(err.response.data.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
