<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 10px;float: left">
        <el-button
          v-permission="['ADMIN','S2LEQUIPMENTPARTPURCHASE_ALL','S2LEQUIPMENTPARTPURCHASE_CREATE']"
          v-if="$store.state.user.user.partyDTO.partyType.partyType==='CREW' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN'"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
      <div style="display: inline-block;margin: 0px 10px;float: left">
        <el-date-picker
          v-model="date"
          type="month"
          placeholder="选择日期"
          @change="changeDate"/>
      </div>
      <div style="display: inline-block;margin: 0px 10px;float: left">
        <el-select
          v-if="$store.state.user.user.partyDTO.partyType.partyType==='EMPLOYEE' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN'"
          v-model="organization"
          style="display: inline-block;margin: 0px 10px;float: left"
          placeholder="请选择船只"
          clearable
          @change="changeOrganization">
          <el-option
            v-for="item in organizationData"
            :key="item.id"
            :label="item.label"
            :value="item.id"/>
        </el-select>
      </div>
      <div style="display: inline-block;margin: 0px 10px;float: left">
        <el-select v-model="deptName" placeholder="请选择部门" clearable @change="changeRequireDeptName">
          <el-option
            v-for="item in departments"
            :key="item"
            :label="item"
            :value="item"/>
        </el-select>
      </div>
      <div v-if="$store.state.user.user.partyDTO.partyType.partyType==='CREW' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN'" style="float: right;">
        <el-button
          class="filter-item"
          size="mini"
          type="success"
          @click="submitVisible = true">提交船端审批</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-type="isType"/>
    <!--<oForm ref="formDetails" :is-detail="isDetail"/>-->
    <!--提交审批-->
    <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="submitVisible"
      title="提交船端审批"
      width="25%">
      <el-form ref="submit" :model="submit" :rules="rules" size="small" label-width="120px" status-icon>
        <el-form-item label="提交类型" prop="submitType">
          <el-select v-model="submit.submitType" clearable>
            <el-option
              v-for="item in submitTypeData"
              :key="item"
              :label="item"
              :value="item"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="width: 400px; margin: 3px auto; font-size: 15px; text-align: center">
        <i class="el-icon-warning-outline" style="color: red;"/>
        <span>提交后的申请单将不能修改，请保证填写数据的正确性</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small " @click="submitVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitShorebased">确认提交</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table v-loading="loading" id="singleTableDoc" ref="singleTable" :data="data" size="small" style="width: 100%;" highlight-current-row @sort-change="sortChange" @selection-change="handleSelectionChange" @row-click="clickRow">
      <el-table-column prop="code" label="单号"/>
      <el-table-column v-if="$store.state.user.user.partyDTO.partyType.partyType==='EMPLOYEE' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN'" prop="organizationId.name" label="船舶" align="center"/>
      <el-table-column prop="createdDate" label="申请时间" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="requireDeptName" label="申请部门"/>
      <el-table-column prop="submitType" label="提交类型"/>
      <el-table-column prop="equipmentPartPurchaseAudit.auditStatus" label="岸基状态">
        <template slot-scope="scope">
          <span>{{ !scope.row.equipmentPartPurchaseAudit ? '待审批' : scope.row.equipmentPartPurchaseAudit.auditStatus }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="status" label="提交状态"/>-->
      <el-table-column prop="status" label="船端状态"/>
      <el-table-column v-if="checkPermission(['ADMIN','S2LEQUIPMENTPARTPURCHASE_ALL','S2LEQUIPMENTPARTPURCHASE_EDIT','S2LEQUIPMENTPARTPURCHASE_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-dropdown size="mini" split-button type="primary" @command="handleCommand">
            更多操作
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-permission="['ADMIN','S2LEQUIPMENTPARTPURCHASE_ALL','S2LEQUIPMENTPARTPURCHASE_EDIT']"
                v-if="scope.row.status === '未提交' && ($store.state.user.user.partyDTO.partyType.partyType==='CREW' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN')"
                :command = "{type: '编辑', row: scope.row }">编辑</el-dropdown-item>
              <el-dropdown-item
                v-permission="['ADMIN','S2LEQUIPMENTPARTPURCHASE_ALL','S2LEQUIPMENTPARTPURCHASE_DELETE']"
                v-if="(!scope.row.equipmentPartPurchaseAudit) && ($store.state.user.user.partyDTO.partyType.partyType==='CREW' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN')"
                :command = "{type: '删除', row: scope.row }">删除</el-dropdown-item>
              <el-dropdown-item
                v-permission="['ADMIN','S2LEQUIPMENTPARTPURCHASE_ALL','S2LEQUIPMENTPARTPURCHASE_EXAMINE']"
                v-if="(scope.row.status === '已提交')"
                :command = "{type: '船端审批', row: scope.row }">船端审批</el-dropdown-item>
              <el-dropdown-item
                v-if="(!scope.row.equipmentPartPurchaseAudit) && (scope.row.status === '船端审核已通过') &&($store.state.user.user.partyDTO.partyType.partyType==='CREW' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN')"
                :command = "{type: '提交审批', row: scope.row }">提交审批</el-dropdown-item>
              <div v-if="scope.row.equipmentPartPurchaseAudit">
                <el-dropdown-item
                  v-if="(scope.row.equipmentPartPurchaseAudit.auditStatus === '审批中')&&(currentUserPartyId === scope.row.equipmentPartPurchaseAudit.auditBy)&&(scope.row.status === '船端审核已通过') &&($store.state.user.user.partyDTO.partyType.partyType==='EMPLOYEE' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN')"
                  :command = "{type: '审批', row: scope.row }">审批</el-dropdown-item>
              </div>
              <div v-if="scope.row.equipmentPartPurchaseAudit">
                <el-dropdown-item
                  v-if="(scope.row.equipmentPartPurchaseAudit.auditStatus === '同意') && ($store.state.user.user.partyDTO.partyType.partyType==='CREW' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN')"
                  :command = "{type: '重复申请', row: scope.row }">重复申请</el-dropdown-item>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column v-if="$store.state.user.user.partyDTO.partyType.partyType!=='EMPLOYEE'" type="selection" width="55" />
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import checkPermission from '@/utils/permission'
import { eventBus } from '@/main'
import { del, edit, EquipmentPurchaseAudit, getOAUserSecertMessage, crewAudit, repeatApply } from '@/api/equipment'
import { parseTime, formatJsonNew } from '@/utils/index'
import { getOrganizationByCriteria } from '@/api/organization'
import { getCurrentUser } from '@/api/user'
import eForm from './form'
// import oForm from './formDetail'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      sort: 'createdDate,desc',
      delLoading: false,
      deptName: '',
      date: '',
      departments: ['轮机部', '甲板部'],
      details: false,
      // 提交数据类型
      submitVisible: false,
      submitTypeData: ['紧急申请', '季度申请'],
      submit: {
        submitType: ''
      },
      submitData: [],
      // 获取船只信息
      organization: '',
      organizationData: [],
      isType: '',
      isDetail: '',
      currentUserPartyId: '',
      rules: {
        submitType: [{ required: true, message: '请选择提交类型', trigger: 'change' }]
      }
    }
  },
  beforeCreate() {
    // 获取船只信息
    getOrganizationByCriteria({ organizationType: 'SHIP_DEPT' }).then(res => {
      this.organizationData = res
    })
  },
  created() {
    this.getCurrentUser()
    this.$nextTick(() => {
      this.init()
    })
    document.addEventListener('visibilitychange', this.changeTab)
  },
  beforeDestroy() {
    document.removeEventListener('visibilitychange', this.changeTab)
  },
  methods: {
    parseTime,
    checkPermission,
    formatJsonNew,
    changeTab() {
      var _this = this
      if (document.visibilityState === 'visible') {
        _this.init()
      }
    },
    // 下拉菜单
    handleCommand(data) {
      if (data.type === '编辑') {
        this.edit(data.row)
      }
      if (data.type === '删除') {
        this.open(data.row)
      }
      if (data.type === '船端审批') {
        this.crewAudit(data.row)
      }
      if (data.type === '提交审批') {
        this.commitEquipmentAudit(data.row)
      }
      if (data.type === '审批') {
        this.audit(data.row)
      }
      if (data.type === '重复申请') {
        this.repeatEquipment(data.row)
      }
    },
    // 删除
    open(data) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.subDelete(data.equipmentPartPurchaseId)
      }).catch(() => {
      })
    },
    subDelete(equipmentPartPurchaseId) {
      this.delLoading = true
      del(equipmentPartPurchaseId).then(res => {
        this.delLoading = false
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[equipmentPartPurchaseId].doClose()
        console.log(err.response.data.message)
      })
    },
    beforeInit() {
      this.url = 'api/s2lEquipmentPartPurchase'
      const sort = this.sort
      this.params = { page: this.page, size: this.size, sort: sort }
      if (this.$store.state.user.user.partyDTO.partyType.partyType === 'CREW') {
        this.params['organizationId'] = this.$store.state.user.user.partyDTO.organization.organizationId
      }
      if (this.$store.state.user.user.partyDTO.partyType.partyType === 'EMPLOYEE' || this.$store.state.user.user.partyDTO.partyType.partyType === 'SYSADMIN') {
        if (this.organization) {
          this.params['organizationId'] = this.organization
        }
      }
      if (this.$store.state.user.user.partyDTO.partyType.partyType === 'SYSADMIN' || this.$store.state.user.user.partyDTO.partyType.partyType === 'CREW') {
        this.params['statusSet'] = '已提交,未提交,已签收,未签收,船端审核已通过,船端审核不通过'
      } else {
        this.params['statusSet'] = '已签收,未签收,船端审核已通过'
      }
      if (this.deptName) {
        this.params['requireDeptName'] = this.deptName
      }
      if (this.date) {
        this.params['createdDateMonth'] = parseTime(this.date)
      }
      return true
    },
    // 提交审批
    commitEquipmentAudit(row) {
      this.loading = true
      EquipmentPurchaseAudit(row.equipmentPartPurchaseId).then(res => {
        this.loading = false
        this.$notify({
          title: '提交成功',
          type: 'success',
          duration: 2500
        })
        this.init()
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '故障！'
        })
      })
    },
    getCurrentUser() {
      getCurrentUser().then(res => {
        if (res && res.party) {
          this.currentUserPartyId = res.party.partyId
        }
      })
    },
    // 审批
    audit(row) { // 审批
      getOAUserSecertMessage({ requestid: row.equipmentPartPurchaseAudit.auditWorkflowId, workcode: this.$store.state.user.user.partyDTO.partyId }).then(res => {
        window.open(process.env.Workcode_BASE_API + '?token=' + res)
      }).catch()
    },
    // 提交船端审批
    submitShorebased() {
      this.$refs['submit'].validate((valid) => {
        if (valid) {
          let date = 0
          if (this.submitData.length) {
            if (this.submit.submitType === '季度申请') {
              this.submitData.map(v => {
                date = new Date(v.createdDate).getMonth() + 1
                if (date === 1 || date === 4 || date === 7 || date === 10) {
                  this.submitEdit()
                } else {
                  this.$notify({
                    title: '只有每年的1、4、7、10月可以进行季度申请',
                    type: 'warning',
                    duration: 2500
                  })
                }
              })
            } else {
              this.submitEdit()
            }
          } else {
            this.$notify({
              title: '提交内容不能为空',
              type: 'warning',
              duration: 2500
            })
          }
          this.submitVisible = false
        }
      })
    },
    submitEdit() {
      this.submitData.map(v => {
        v.submitType = this.submit.submitType
        if (!v.status || v.status === '未提交') {
          v.status = '已提交'
        } else {
          this.$notify({
            title: '已提交过的内容不能重复提交',
            type: 'warning',
            duration: 2500
          })
          return
        }
        this.loading = true
        edit(v).then(() => {
          this.$notify({
            title: '提交成功',
            type: 'success',
            duration: 2500
          })
          this.loading = false
          this.init()
        }).catch(err => {
          this.loading = false
          console.log(err.response.data.message)
        })
      })
    },
    // 船端审批
    crewAudit(data) {
      this.$confirm('审批是否通过', '', {
        confirmButtonText: '审批通过',
        cancelButtonText: '审批不通过',
        showClose: false,
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        data.status = '船端审核已通过'
        this.setFormDate(data, '船端审批')
      }).catch(() => {
        data.status = '船端审核不通过'
        this.setFormDate(data, '船端审批')
      })
    },
    // 选择日期
    changeDate() {
      this.init()
    },
    // 选择部门
    changeRequireDeptName() {
      this.init()
    },
    // 选择船只
    changeOrganization() {
      this.init()
    },
    // 多选框选择时val为当前行的信息
    handleSelectionChange(val) {
      this.submitData = val
    },
    // 选中某行时 传递该行数据
    clickRow(row) {
      this.$refs.singleTable.setCurrentRow(row)
      this.$parent.isHidden = true
      this.$nextTick(() => {
        eventBus.$emit('row', row)
      })
    },
    // 改变排序规则
    sortChange(column, prop, order) {
      if (column.prop == null || column.order == null) {
        this.queryData.prop = ''
        this.queryData.order = ''
      } else {
        if (column.order === 'ascending') {
          this.sort = column.prop + ',asc'
        } else {
          this.sort = column.prop + ',desc'
        }
      }
      this.init()
    },
    add() {
      this.isType = '新增'
      this.$refs.form.form.createdDate = parseTime(new Date())
      this.$refs.form.dialog = true
    },
    setFormDate(data, dialog) {
      const _this = this.$refs.form
      _this.form = {
        applicant: this.$store.state.user.user.username,
        organizationId: this.$store.state.user.user.partyDTO.organization.organizationId,
        createdDate: parseTime(data.createdDate),
        requireDeptName: data.requireDeptName,
        createdBy: data.createdBy,
        lastModifiedDate: data.lastModifiedDate,
        lastModifiedBy: data.lastModifiedBy,
        status: data.status,
        equipmentPartPurchaseId: data.equipmentPartPurchaseId
      }
      if (dialog === '船端审批') {
        _this.form.equipmentPartPurchaseId = data.equipmentPartPurchaseId
        _this.form.createdDate = new Date(_this.form.createdDate).getTime()
        crewAudit(_this.form).then(res => {
          _this.resetForm()
          this.loading = false
          this.init()
        }).catch(err => {
          this.loading = false
          console.log(err)
        })
      }
    },
    edit(data) {
      this.$refs.form.dialog = true
      this.isType = '编辑'
      this.setFormDate(data)
    },
    // 重复申请
    repeatEquipment(data) {
      repeatApply(data.equipmentPartPurchaseId).then(() => {
        this.$notify({
          title: '重复申请成功',
          type: 'success',
          duration: 2500
        })
        this.init()
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
</style>
<style>
  #singleTableDoc tr{
    cursor: pointer;
  }
</style>
