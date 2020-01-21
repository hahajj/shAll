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
          v-permission="['ADMIN','S2LMATERIALPURCHASE_ALL','S2LMATERIALPURCHASE_CREATE']"
          v-if="(materialDetial.status === '未提交') && ($store.state.user.user.partyDTO.partyType.partyType==='CREW' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN')"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
      <div v-if="$store.state.user.user.partyDTO.partyType.partyType==='EMPLOYEE' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN'" style="float: right;margin:0 10px;">
        <el-button
          v-permission="['ADMIN','S2LMATERIALPURCHASE_ALL','S2LMATERIALPURCHASE_SELECT']"
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
      <el-table-column prop="code" label="单号"/>
      <el-table-column v-if="$store.state.user.user.partyDTO.partyType.partyType==='EMPLOYEE' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN'" prop="s2lMaterialPurchase.organizationId.name" label="船舶" align="center"/>
      <el-table-column prop="materialSpecId.materialId.name" label="物资名称"/>
      <el-table-column prop="materialSpecId.name" label="物资规格"/>
      <el-table-column prop="materialSpecId.unitName" label="单位"/>
      <el-table-column prop="amount" label="申请数量"/>
      <!--<el-table-column prop="s2lMaterialInventoryCount" label="库存数量"/>-->
      <el-table-column prop="s2lMaterialInventoryCount" label="库存数量">
        <template slot-scope="scope">
          <span> {{ scope.row.s2lMaterialInventoryCount ? scope.row.s2lMaterialInventoryCount : 0 }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="arrivedAmount" label="累计到船数量">
        <template slot-scope="scope">
          <span> {{ scope.row.arrivedAmount ? scope.row.arrivedAmount : 0 }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="comments" label="备注"/>
      <el-table-column v-if="checkPermission(['ADMIN','S2LMATERIALPURCHASE_ALL','S2LMATERIALPURCHASE_EDIT','S2LMATERIALPURCHASE_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-dropdown size="mini" split-button type="primary" @command="handleCommand">
            更多操作
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-permission="['ADMIN','S2LMATERIALPURCHASE_ALL','S2LMATERIALPURCHASE_EDIT']"
                v-if="$store.state.user.user.partyDTO.partyType.partyType==='CREW' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN'"
                :command = "{type: '编辑', row: scope.row }">编辑</el-dropdown-item>
              <el-dropdown-item
                v-permission="['ADMIN','S2LMATERIALPURCHASE_ALL','S2LMATERIALPURCHASE_DELETE']"
                v-if="(!materialDetial.materialPurchaseAduit) && ($store.state.user.user.partyDTO.partyType.partyType==='CREW' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN')"
                :command = "{type: '删除', row: scope.row }">删除</el-dropdown-item>
              <div v-if="materialDetial.materialPurchaseAduit">
                <el-dropdown-item
                  v-if="(materialDetial.materialPurchaseAduit.auditStatus === '同意') && ($store.state.user.user.partyDTO.partyType.partyType==='CREW' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN')"
                  :command = "{type: '到船签收', row: scope.row }">到船签收</el-dropdown-item>
              </div>
              <div v-if="materialDetial.materialPurchaseAduit">
                <el-dropdown-item
                  v-if="materialDetial.materialPurchaseAduit.auditStatus === '同意'"
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
import { delDetial, getSupplyInfo, exportMaterial } from '@/api/material'
import { getSupply } from '@/api/supply'
import { parseTime, formatJson, downloadFiles } from '@/utils/index'
import { eventBus } from '@/main'
import eForm from './form'
import oForm from './formDetail'
export default {
  components: { eForm, oForm },
  mixins: [initData],
  data() {
    return {
      sort: 'createdDate,desc',
      delLoading: false,
      downloadLoading: false,
      details: false,
      isType: '',
      isDetail: '',
      materialPurchaseId: '',
      materialDetial: ''
    }
  },
  created() {
    eventBus.$on('row', (materialDetial) => {
      this.materialDetial = materialDetial
      this.materialPurchaseId = materialDetial.materialPurchaseId
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
    formatJson,
    changeTab() {
      var _this = this
      if (document.visibilityState === 'visible') {
        _this.init()
      }
    },
    // 删除
    open(data) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.subDelete(data.materialPurchaseDetailId)
      }).catch(() => {
      })
    },
    subDelete(materialPurchaseDetailId) {
      this.delLoading = true
      delDetial(materialPurchaseDetailId).then(res => {
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
        this.$refs[materialPurchaseDetailId].doClose()
        console.log(err.response.data.message)
      })
    },
    beforeInit() {
      this.url = 'api/s2lMaterialPurchaseDetail'
      const sort = this.sort
      this.params = { page: this.page, size: this.size, sort: sort, materialPurchaseId: this.materialPurchaseId }
      return true
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
    // 到船签收
    receive(data) {
      const _this = this.$refs.formDetails
      _this.deltailDialog = true
      this.isDetail = '到船签收'
      _this.form = {
        materialName: data.materialSpecId.materialId.name,
        materialSpecName: data.materialSpecId.name,
        amount: data.amount,
        materialPurchaseDetailId: data.materialPurchaseDetailId,
        Allamount: data.arrivedAmount ? data.arrivedAmount : 0
      }
    },
    // 签收详情
    receiveInfo(data) {
      this.isDetail = '签收详情'
      const _this = this.$refs.formDetails
      _this.deltailDialog = true
      _this.contents = []
      _this.materialPurchaseDetailId = data.materialPurchaseDetailId
      _this.getArrivedInfo()
    },
    // 供货信息
    supply(data) {
      const _this = this.$refs.formDetails
      _this.deltailDialog = true
      _this.max = data.amount
      this.getSupply()
      getSupplyInfo({ materialPurchaseDetailId: data.materialPurchaseDetailId }).then(res => {
        if (res.content.length > 0) {
          _this.supplyDialog = '查询供货'
          _this.supply = {
            supplies: res.content[0].supplyId.companyName,
            amount: res.content[0].amount,
            comments: res.content[0].comments,
            materialPurchaseSupplyId: res.content[0].materialPurchaseSupplyId,
            materialPurchaseDetailId: res.content[0].materialPurchaseDetailId,
            supplyId: res.content[0].supplyId
          }
        } else {
          _this.supplyDialog = '新增供货'
          _this.supply.materialPurchaseDetailId = data.materialPurchaseDetailId
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
      // getAll({ page: 0, size: 9999, statusSet: '已提交,未提交,已签收,未签收,船端审核已通过,船端审核不通过' }).then(res => {
      //   this.downloadLoading = false
      //   exceldata = res
      //   import('@/utils/export2Excel').then(excel => {
      //     const tHeader = ['船舶', '申请时间', '申请部门', '物资名称', '物资规格', '单位', '申请数量', '库存数量', '提交类型', '岸基状态', '船端状态']
      //     const filterVal = ['organizationName', 'createdDate', 'requireDeptName', 'name', 'materialSpecId', 'unitName', 'amount', 'inventoryAmount', 'submitType', 'materialPurchaseAduitStatus', 'status']
      //     const data = this.formatJson(filterVal, exceldata)
      //     excel.export_json_to_excel({
      //       header: tHeader,
      //       data,
      //       filename: '物资采购'
      //     })
      //   })
      // })
      this.downloadLoading = true
      exportMaterial({ materialPurchaseId: this.materialDetial.materialPurchaseId }).then((data) => {
        this.downloadLoading = false
        downloadFiles(data, '物资采购')
        this.$notify({
          title: '导出成功',
          type: 'success',
          duration: 2500
        })
      })
    },
    add() {
      this.isType = '新增'
      this.$refs.form.form.createdDate = parseTime(new Date().getTime())
      this.$refs.form.form.materialPurchaseId = this.materialPurchaseId
      this.$refs.form.dialog = true
      this.$refs.form.isUnitName = false
    },
    setFormDate(data) {
      const _this = this.$refs.form
      _this.form = {
        materialName: data.materialSpecId.materialId.name,
        comments: data.comments,
        createdBy: data.createdBy,
        lastModifiedDate: data.lastModifiedDate,
        lastModifiedBy: data.lastModifiedBy,
        status: data.status,
        materiallClassCode: data.materiallClassCode,
        materialSpecId: data.materialSpecId,
        amount: data.amount,
        unitName: data.materialSpecId.unitName,
        materialPartInventoryAmount: data.s2lMaterialInventoryCount ? data.s2lMaterialInventoryCount : 0
      }
      _this.form.organizationId = this.$store.state.user.user.partyDTO.organization.organizationId
      _this.form.applicant = this.$store.state.user.user.username
    },
    edit(data) {
      const _this = this.$refs.form
      _this.dialog = true
      this.isType = '编辑'
      this.setFormDate(data)
      // 获取物资的图片信息需要用到materialPurchaseDetailId
      _this.form.materialPurchaseDetailId = data.materialPurchaseDetailId
      _this.form.code = data.code
      _this.status = this.materialDetial.status
      if (!data.materialSpecId.unitName) {
        _this.isUnitName = false
      } else {
        _this.isUnitName = true
      }
      _this.reloadForm()
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
