<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <el-divider content-position="center" class="line-left-right">
        <span class="line-font">单内信息</span>
      </el-divider>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 10px;float: left">
        <el-button
          v-permission="['ADMIN','S2LEQUIPMENTPARTPURCHASE_ALL','S2LEQUIPMENTPARTPURCHASE_CREATE']"
          v-if="equipmentPartDetial.status === '未提交' && ($store.state.user.user.partyDTO.partyType.partyType==='CREW' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN')"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
      <div v-if="$store.state.user.user.partyDTO.partyType.partyType==='EMPLOYEE' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN'" style="float: right;margin:0 10px;">
        <el-button
          v-permission="['ADMIN','S2LEQUIPMENTPARTPURCHASE_ALL','S2LEQUIPMENTPARTPURCHASE_SELECT']"
          :loading="downloadLoading"
          class="filter-item"
          size="mini"
          type="warning"
          icon="el-icon-download"
          @click="download">导出</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-type="isType"/>
    <oForm ref="formDetails" :is-detail="isDetail"/>
    <!--表格渲染-->
    <el-table v-loading="loading" id="singleTableDoc" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="orderNo" label="单号"/>
      <el-table-column v-if="$store.state.user.user.partyDTO.partyType.partyType==='EMPLOYEE' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN'" prop="equipmentPartPurchase.organizationId.name" label="船舶" align="center"/>
      <el-table-column prop="equipmentName" label="设备名称"/>
      <el-table-column prop="equipmentPartName" label="备件名称"/>
      <!--<el-table-column prop="equipmentPartPurchase.submitType" label="提交类型"/>-->
      <el-table-column prop="equipmentPartSpecName" label="备件规格"/>
      <el-table-column prop="code" label="备件号"/>
      <el-table-column prop="planNo" label="图纸号"/>
      <el-table-column prop="unitName" label="单位"/>
      <el-table-column prop="amount" label="申请数量"/>
      <!--<el-table-column prop="s2lEquipmentPartInventoryCount" label="库存数量"/>-->
      <el-table-column prop="s2lEquipmentPartInventoryCount" label="库存数量">
        <template slot-scope="scope">
          <span>{{ scope.row.s2lEquipmentPartInventoryCount ? scope.row.s2lEquipmentPartInventoryCount : 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="arrivedAmount" label="累计到船数量">
        <template slot-scope="scope">
          <span>{{ scope.row.arrivedAmount ? scope.row.arrivedAmount : 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="comments" label="备注"/>
      <el-table-column v-if="checkPermission(['ADMIN','S2LEQUIPMENTPARTPURCHASE_ALL','S2LEQUIPMENTPARTPURCHASE_EDIT','S2LEQUIPMENTPARTPURCHASE_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-dropdown size="mini" split-button type="primary" @command="handleCommand">
            更多操作
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-permission="['ADMIN','S2LEQUIPMENTPARTPURCHASE_ALL','S2LEQUIPMENTPARTPURCHASE_EDIT']"
                v-if="equipmentPartDetial.status === '未提交' && ($store.state.user.user.partyDTO.partyType.partyType==='CREW' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN')"
                :command = "{type: '编辑', row: scope.row }">编辑</el-dropdown-item>
              <el-dropdown-item
                v-permission="['ADMIN','S2LEQUIPMENTPARTPURCHASE_ALL','S2LEQUIPMENTPARTPURCHASE_DELETE']"
                v-if="(!equipmentPartDetial.equipmentPartPurchaseAudit) && ($store.state.user.user.partyDTO.partyType.partyType==='CREW' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN')"
                :command = "{type: '删除', row: scope.row }">删除</el-dropdown-item>
              <div v-if="equipmentPartDetial.equipmentPartPurchaseAudit">
                <el-dropdown-item
                  v-if="(equipmentPartDetial.equipmentPartPurchaseAudit.auditStatus === '同意') && ($store.state.user.user.partyDTO.partyType.partyType==='CREW' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN')"
                  :command = "{type: '到船签收', row: scope.row }">到船签收</el-dropdown-item>
              </div>
              <div v-if="equipmentPartDetial.equipmentPartPurchaseAudit">
                <el-dropdown-item
                  v-if="equipmentPartDetial.equipmentPartPurchaseAudit.auditStatus === '同意'"
                  :command = "{type: '签收详情', row: scope.row }">签收详情</el-dropdown-item>
              </div>
              <el-dropdown-item
                v-if="$store.state.user.user.partyDTO.partyType.partyType==='EMPLOYEE' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN'"
                :command = "{type: '供货信息', row: scope.row }">供货信息</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
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
import { exportEquipment, delEquipmentDetial, getSupplyInfo } from '@/api/equipment'
import { getSupply } from '@/api/supply'
import { parseTime, downloadFiles } from '@/utils/index'
import eForm from './form'
import oForm from './formDetail'
export default {
  components: { eForm, oForm },
  mixins: [initData],
  data() {
    return {
      sort: 'createdDate,desc',
      delLoading: false,
      details: false,
      downloadLoading: false,
      isType: '',
      isDetail: '',
      equipmentPartDetial: '',
      equipmentPartPurchaseId: ''
    }
  },
  created() {
    eventBus.$on('row', (message) => {
      this.equipmentPartDetial = message
      this.equipmentPartPurchaseId = message.equipmentPartPurchaseId
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
      if (data.type === '到船签收') {
        this.receive(data.row)
      }
      if (data.type === '签收详情') {
        this.receiveInfo(data.row)
      }
      if (data.type === '供货信息') {
        this.supply(data.row)
      }
    },
    // 删除
    open(data) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.subDelete(data.equipmentPartPurchaseDetailId)
      }).catch(err => {
        console.log(err)
      })
    },
    subDelete(equipmentPartPurchaseDetailId) {
      this.delLoading = true
      delEquipmentDetial(equipmentPartPurchaseDetailId).then(res => {
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
        this.$refs[equipmentPartPurchaseDetailId].doClose()
        console.log(err.response.data.message)
      })
    },
    beforeInit() {
      this.url = 'api/s2lEquipmentPartPurchaseDetail'
      const sort = this.sort
      this.params = { page: this.page, size: this.size, sort: sort, equipmentPartPurchaseId: this.equipmentPartPurchaseId }
      return true
    },
    add() {
      this.isType = '新增'
      this.$refs.form.equipmentPartPurchaseId = this.equipmentPartPurchaseId
      this.$refs.form.dialog = true
      this.$refs.form.isUnitName = false
    },
    setFormDate(data) {
      const _this = this.$refs.form
      _this.form = {
        comments: data.comments,
        createdBy: data.createdBy,
        lastModifiedDate: data.lastModifiedDate,
        lastModifiedBy: data.lastModifiedBy,
        status: data.status,
        equipmentId: data.equipmentId,
        equipmentlClassCode: data.equipmentlClassCode,
        code: data.code,
        name: data.name,
        equipmentPartPurchaseDetailId: data.equipmentPartPurchaseDetailId,
        equipmentPartSpecName: data.equipmentPartSpecName,
        planNo: data.planNo,
        amount: data.amount,
        equipmentName: data.equipmentName,
        equipmentPartName: data.equipmentPartName,
        unitName: data.unitName,
        orderNo: data.orderNo,
        organizationId: this.$store.state.user.user.partyDTO.organization.organizationId,
        applicant: this.$store.state.user.user.username,
        equipmentPartInventoryAmount: data.s2lEquipmentPartInventoryCount,
        miniumAmount: data.s2lEquipmentPartInventoryMiniumAmount
      }
    },
    edit(data) {
      const _this = this.$refs.form
      _this.dialog = true
      this.isType = '编辑'
      this.setFormDate(data)
      _this.equipmentPartPurchaseId = data.equipmentPartPurchase.equipmentPartPurchaseId
      _this.reloadForm()
    },
    // 到船签收
    receive(data) {
      console.log(data)
      const _this = this.$refs.formDetails
      _this.deltailDialog = true
      this.isDetail = '到船签收'
      _this.form = {
        equipmentPartName: data.equipmentPartName,
        equipmentPartSpecName: data.equipmentPartSpecName,
        amount: data.amount,
        equipmentPartPurchaseDetailId: data.equipmentPartPurchaseDetailId,
        Allamount: data.arrivedAmount ? data.arrivedAmount : 0
      }
    },
    // 签收详情
    receiveInfo(data) {
      console.log(data)
      this.isDetail = '签收详情'
      const _this = this.$refs.formDetails
      _this.deltailDialog = true
      _this.contents = []
      _this.equipmentPartPurchaseDetailId = data.equipmentPartPurchaseDetailId
      _this.getArrivedInfo()
    },
    // 供货信息
    supply(data) {
      const _this = this.$refs.formDetails
      _this.deltailDialog = true
      _this.max = data.amount
      this.getSupply()
      getSupplyInfo({ equipmentPartPurchaseDetailId: data.equipmentPartPurchaseDetailId }).then(res => {
        if (res.content.length > 0) {
          _this.supplyDialog = '查询供货'
          _this.supply = {
            supplies: res.content[0].supplyId.companyName,
            amount: res.content[0].amount,
            comments: res.content[0].comments,
            equipmentPartPurchaseSupplyId: res.content[0].equipmentPartPurchaseSupplyId,
            equipmentPartPurchaseDetailId: res.content[0].equipmentPartPurchaseDetailId,
            supplyId: res.content[0].supplyId
          }
        } else {
          _this.supplyDialog = '新增供货'
          _this.supply.equipmentPartPurchaseDetailId = data.equipmentPartPurchaseDetailId
        }
      })
    },
    // 获取供货商信息
    getSupply() {
      getSupply().then(res => {
        const _this = this.$refs.formDetails
        res.content.map(v => {
          if (_this.suppliers.indexOf(v.companyName) === -1) {
            _this.suppliers.push(v)
          }
        })
      })
    },
    // 导出
    download() {
      // let exceldata = []
      // this.downloadLoading = true
      // get({ page: 0, size: 9999, statusSet: '已提交,未提交,已签收,未签收,船端审核已通过,船端审核不通过' }).then(res => {
      //   this.downloadLoading = false
      //   exceldata = res.content
      //   import('@/utils/export2Excel').then(excel => {
      //     const tHeader = ['申请时间', '申请部门', '设备名称', '备件名称', '备件规格', '备件号', '图纸号', '单位', '申请数量', '库存数量', '最低保有量', '提交类型', '岸基状态', '船端状态']
      //     const filterVal = ['createdDate', 'requireDeptName', 'equipmentPartSpecId.equipmentPartId.equipmentId.name', 'equipmentPartSpecId.equipmentPartId.name', 'equipmentPartSpecName', 'code', 'planNo', 'equipmentPartSpecId.unitName', 'amount', 'equipmentPartSpecId.equipmentPartInventory.amount', 'equipmentPartSpecId.equipmentPartInventory.miniumAmount', 'submitType', 'equipmentPartPurchaseAudit.auditStatus', 'status']
      //     const data = this.formatJsonNew(filterVal, exceldata)
      //     excel.export_json_to_excel({
      //       header: tHeader,
      //       data,
      //       filename: '备件采购'
      //     })
      //   })
      // })
      this.downloadLoading = true
      exportEquipment({ equipmentPartPurchaseId: this.equipmentPartDetial.equipmentPartPurchaseId }).then((data) => {
        this.downloadLoading = false
        downloadFiles(data, '备件采购')
        this.$notify({
          title: '导出成功',
          type: 'success',
          duration: 2500
        })
      })
    }
  }
}
</script>

<style scoped>
  .line-left-right {
    border-top: 2px dashed #aba;
    text-align: center;
  }
  .line-font {
    color: forestgreen;
    font-size: 20px;
    font-family: liSu;
    font-style: italic;
  }
</style>
<style>
  #singleTableDoc tr{
    cursor: pointer;
  }
</style>
