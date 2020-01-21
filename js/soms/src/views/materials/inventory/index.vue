<template>
  <div class="app-container">
    <el-tabs :before-leave="beforeLeave" v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="备件库存盘点" name="equipment">
        <!--工具栏-->
        <div class="head-container" style="text-align: center;">
          <!-- 新增 -->
          <div style="display: inline-block;margin: 0px 2px;float: left">
            <!--v-permission="['ADMIN','SUPPLY_ALL','SUPPLY_CREATE']"-->
            <el-button
              v-if="$store.state.user.user.partyDTO.partyType.partyType==='CREW' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN'"
              class="filter-item"
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="add">新增</el-button>
          </div>
          <div style="display: inline-block;margin: 0px 10px 0 20px;float: left">
            <el-date-picker
              v-model="equipmentDate"
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
            <el-input
              v-model="equipment"
              placeholder="备件搜索"
              clearable
              style="width: 200px;"
              @keyup.enter.native="searchEquipment"/>
            <el-button size="mini" type="success" icon="el-icon-search" style="margin: 0 10px" @click="searchEquipment">搜索</el-button>
          </div>
          <div style="display: inline-block;margin: 0px 2px;float: right">
            <!-- 导出 -->
            <el-button
              :loading="equipmentDownLoading"
              size="mini"
              class="filter-item"
              type="warning"
              icon="el-icon-download"
              @click="download">导出
            </el-button>
          </div>
        </div>
        <!--表单组件-->
        <eForm ref="materials" :add-edit="addEdit" :inventory="inventory"/>
        <!--表格渲染-->
        <el-table v-loading="loading" id="equipmentTable" ref="equipmentTable" :data="data" size="small" style="width: 100%;" highlight-current-row stripe @sort-change="sortChange">
          <el-table-column type="index" label="序号" align="center"/>
          <el-table-column prop="equipmentPartId.equipmentId.name" label="设备名称" align="center"/>
          <el-table-column prop="equipmentPartId.name" label="备件名称" align="center"/>
          <el-table-column prop="name" label="备件规格" align="center"/>
          <el-table-column prop="equipmentPartId.code" label="备件号" align="center"/>
          <!--<el-table-column prop="planNo" label="图纸号" align="center"/>-->
          <el-table-column prop="unitName" label="单位" align="center"/>
          <el-table-column prop="equipmentPartInventory.arrivedAmount" label="本月新增数量" align="center"/>
          <el-table-column prop="equipmentPartInventory.consumeAmount" label="本月消耗数量" align="center"/>
          <el-table-column prop="equipmentPartInventory.lastMonthAmount" label="上月库存数量" align="center"/>
          <el-table-column prop="equipmentPartInventory.amount" label="当前库存数量" align="center"/>
          <el-table-column v-if="$store.state.user.user.partyDTO.partyType.partyType==='CREW' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN'" label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <el-button v-permission="['ADMIN','SUPPLY_ALL','SUPPLY_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
              <el-button v-permission="['ADMIN','SUPPLY_ALL','SUPPLY_DELETE']" slot="reference" type="danger" icon="el-icon-delete" size="mini" @click="open(scope.row)"/>
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
      <!--物资备件盘点-->
      </el-tab-pane>
      <el-tab-pane label="物资库存盘点" name="material">
        <!--工具栏-->
        <div class="head-container" style="text-align: center;">
          <!-- 新增 -->
          <div style="display: inline-block;margin: 0px 2px;float: left">
            <el-button
              v-if="$store.state.user.user.partyDTO.partyType.partyType==='CREW' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN'"
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="add">新增</el-button>
          </div>
          <div style="display: inline-block;margin: 0px 10px 0 20px;float: left">
            <el-date-picker
              v-model="materialDate"
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
            <el-input
              v-model="material"
              placeholder="物资搜索"
              clearable
              style="width: 200px;"
              @keyup.enter.native="searchMaterial"/>
            <el-button size="mini" type="success" icon="el-icon-search" style="margin: 0 10px" @click="searchMaterial">搜索</el-button>
          </div>
          <div style="display: inline-block;margin: 0px 2px;float: right">
            <!-- 导出 -->
            <el-button
              v-permission="['ADMIN','SUPPLY_ALL','SUPPLY_EDIT']"
              :loading="materialDownLoading"
              size="mini"
              class="filter-item"
              type="warning"
              icon="el-icon-download"
              @click="download">导出
            </el-button>
          </div>
        </div>
        <!--表单组件-->
        <eForm ref="materials" :add-edit="addEdit" :inventory="inventory"/>
        <!--表格渲染-->
        <el-table v-loading="materialLoading" id="materialTable" ref="materialTable" :data="materialData" size="small" style="width: 100%;" highlight-current-row stripe @sort-change="sortChange">
          <el-table-column type="index" label="序号" align="center"/>
          <el-table-column prop="materialId.materialClassCode.materialClassName" label="物资大类" align="center"/>
          <el-table-column prop="materialId.name" label="物资名称" align="center"/>
          <el-table-column prop="name" label="物资规格" align="center"/>
          <el-table-column prop="unitName" label="单位" align="center"/>
          <el-table-column prop="materialInventory.arrivedAmount" label="本月新增数量" align="center"/>
          <el-table-column prop="materialInventory.consumeAmount" label="本月消耗数量" align="center"/>
          <el-table-column prop="materialInventory.lastMonthAmount" label="上月库存数量" align="center"/>
          <el-table-column prop="materialInventory.amount" label="当前库存数量" align="center"/>
          <el-table-column v-if="$store.state.user.user.partyDTO.partyType.partyType==='CREW' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN'" label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <el-button v-permission="['ADMIN','SUPPLY_ALL','SUPPLY_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
              <el-button v-permission="['ADMIN','SUPPLY_ALL','SUPPLY_DELETE']" slot="reference" type="danger" icon="el-icon-delete" size="mini" @click="open(scope.row)"/>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <el-pagination
          :total="total2"
          :current-page="page2 + 1"
          style="margin-top: 8px;"
          layout="total, prev, pager, next, sizes"
          @size-change="sizeChange2"
          @current-change="pageChange2"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { delEquipment, delMaterial, getMaterial, exportMaterial, exportEquipment } from '@/api/inventory'
import { getOrganizationByCriteria } from '@/api/organization'
import { parseTime, formatJson } from '@/utils/index'
import eForm from './form'

export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      sort: ' ',
      delLoading: false,
      equipmentDownLoading: false,
      materialDownLoading: false,
      loading: false,
      materialLoading: false,
      material: '',
      equipment: '',
      tabData: '备件库存盘点',
      inventory: '备件库存盘点',
      addEdit: false,
      organizationData: [],
      organization: '',
      equipmentDate: '',
      materialDate: '',
      date: '',
      activeName: 'equipment',
      oldTabData: '',
      materialData: [],
      // 物资分页
      page2: 0,
      size2: 10,
      total2: 0,
      params2: ''
    }
  },
  beforeCreate() {
    // 获取船只信息
    getOrganizationByCriteria({ organizationType: 'SHIP_DEPT' }).then(res => {
      this.organizationData = res
    })
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    checkPermission,
    formatJson,
    parseTime,
    changeOrganization() {
      if (this.tabData === '备件库存盘点') {
        this.init()
      }
      if (this.tabData === '物资库存盘点') {
        this.getMaterial()
      }
    },
    beforeInit() {
      this.url = 'api/getInventoryByEquipmentSpecs'
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
      if (this.date) {
        this.params['genYearMonth'] = this.date
      }
      if (this.equipment) {
        this.params['name'] = this.equipment
      }
      return true
    },
    beforeLeave(activeName, oldActiveName) {
      this.oldTabData = oldActiveName
    },
    handleClick(tab) {
      // 记录tab页
      this.tabData = tab.label
      if (tab.label === '物资库存盘点' && this.oldTabData === 'equipment') {
        this.oldTabData = ''
        this.getMaterial()
      }
    },
    getMaterial() {
      this.materialLoading = true
      this.params2 = { page: this.page2, size: this.size2 }
      getMaterial(this.params2).then(res => {
        this.materialLoading = false
        this.materialData = res.content
        this.total2 = res.totalElements
      })
      if (this.date) {
        this.params2['genYearMonth'] = this.date
      }
      if (this.material) {
        this.params2['name'] = this.material
      }
      if (this.$store.state.user.user.partyDTO.partyType.partyType === 'CREW') {
        this.params2['organizationId'] = this.$store.state.user.user.partyDTO.organization.organizationId
      }
      if (this.$store.state.user.user.partyDTO.partyType.partyType === 'EMPLOYEE' || this.$store.state.user.user.partyDTO.partyType.partyType === 'SYSADMIN') {
        if (this.organization) {
          this.params2['organizationId'] = this.organization
        }
      }
    },
    // 年月查询
    changeDate() {
      if (this.tabData === '备件库存盘点') {
        if (this.equipmentDate) {
          this.structure(this.equipmentDate)
        } else {
          this.date = ''
        }
        this.init()
      } else {
        if (this.materialDate) {
          this.structure(this.materialDate)
        } else {
          this.date = ''
        }
        this.getMaterial()
      }
    },
    structure(date) {
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      if (month < 10) {
        month = '0' + month
      }
      this.date = year + '年' + month + '月'
    },
    // 物资查询
    searchEquipment() {
      this.init()
    },
    searchMaterial() {
      this.getMaterial()
    },
    open(data) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.tabData === '备件库存盘点') {
          this.subDelete(data.equipmentPartInventory.equipmentPartInventoryId)
        }
        if (this.tabData === '物资库存盘点') {
          this.subDelete(data.materialInventory.materialInventoryId)
        }
      }).catch(() => {})
    },
    subDelete(id) {
      if (this.tabData === '备件库存盘点') {
        this.delLoading = true
        delEquipment(id).then(res => {
          this.delLoading = false
          this.init()
          this.$notify({
            title: '删除成功',
            type: 'success',
            duration: 2500
          })
        }).catch(err => {
          this.delLoading = false
          console.log(err.response.data.message)
        })
      }
      if (this.tabData === '物资库存盘点') {
        this.delLoading = true
        delMaterial(id).then(res => {
          this.delLoading = false
          this.getMaterial()
          this.$notify({
            title: '删除成功',
            type: 'success',
            duration: 2500
          })
        }).catch(err => {
          this.delLoading = false
          console.log(err.response.data.message)
        })
      }
    },
    // 导出
    download() {
      let exceldata = []
      this.downloadLoading = true
      if (this.tabData === '备件库存盘点') {
        exportEquipment().then(res => {
          this.downloadLoading = false
          exceldata = res
          import('@/utils/export2Excel').then(excel => {
            const tHeader = ['船舶', '设备名称', '备件名称', '备件规格', '备件号', '本月新增数量', '本月消耗数量', '上月库存数量', '当月库存数量']
            const filterVal = ['organizationId', 'equipmentName', 'equipmentPartName', 'specName', 'code', 'arrivedAmount', 'consumeAmount', 'lastMonthAmount', 'amount']
            const data = this.formatJson(filterVal, exceldata)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '备件库存盘点'
            })
          })
        })
      }
      if (this.tabData === '物资库存盘点') {
        exportMaterial().then(res => {
          this.downloadLoading = false
          exceldata = res
          import('@/utils/export2Excel').then(excel => {
            const tHeader = ['船舶', '年份', '物资类别', '物资名称', '物资规格', '单位', '本月新增数量', '本月消耗数量', '上月库存数量', '当月库存数量']
            const filterVal = ['organizationId', 'genYearMonth', 'maClassName', 'name', 'specName', 'unitName', 'arrivedAmount', 'consumeAmount', 'lastMonthAmount', 'amount']
            const data = this.formatJson(filterVal, exceldata)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '物资库存盘点'
            })
          })
        })
      }
    },
    sortChange(column, prop, order) {
      if (column.prop == null || column.order == null) {
        this.queryData.prop = ''
        this.queryData.order = ''
      } else {
        if (column.order === 'ascending') { this.sort = column.prop + ',asc' } else { this.sort = column.prop + ',desc' }
      }
      this.init()
    },
    add() {
      this.addEdit = true
      this.inventory = this.tabData
      this.$refs.materials.dialog = true
      this.$refs.materials.materialAutoInventory = false
      this.$refs.materials.equipmentAutoInventory = false
    },
    edit(data) {
      this.addEdit = false
      this.inventory = this.tabData
      const _this = this.$refs.materials
      if (this.tabData === '备件库存盘点') {
        _this.equipment = {
          checked: false,
          equipmentName: data.equipmentPartId.equipmentId.name,
          equipmentPartName: data.equipmentPartId.name + ' ' + data.name,
          name: data.name,
          code: data.equipmentPartId.code,
          nowAdd: data.equipmentPartInventory.arrivedAmount,
          nowUse: data.equipmentPartInventory.consumeAmount,
          lastAmount: data.equipmentPartInventory.lastMonthAmount,
          nowAmount: data.equipmentPartInventory.amount,
          equipmentPartSpecId: data.equipmentPartSpecId,
          organizationId: this.$store.state.user.user.partyDTO.organization.organizationId
        }
        _this.equipment.equipmentPartInventory = {
          equipmentPartInventoryId: data.equipmentPartInventory.equipmentPartInventoryId
        }
        _this.equipmentAutoInventory = true
      }
      if (this.tabData === '物资库存盘点') {
        _this.materialAutoInventory = true
        _this.material = {
          checked: false,
          materialName: data.materialId.name + ' ' + data.name,
          materialSpec: data.materialId.name,
          materialSpecName: data.name,
          nowAdd: data.materialInventory.arrivedAmount,
          materialNowUse: data.materialInventory.consumeAmount,
          lastAmount: data.materialInventory.lastMonthAmount,
          nowAmount: data.materialInventory.amount,
          materialSpecId: data.materialSpecId,
          organizationId: this.$store.state.user.user.partyDTO.organization.organizationId
        }
        _this.material.materialInventory = {
          materialInventoryId: data.materialInventory.materialInventoryId
        }
      }
      _this.dialog = true
    },
    // 物资分页
    pageChange2(e) {
      this.page2 = e - 1
      this.getMaterial()
    },
    sizeChange2(e) {
      this.page2 = 0
      this.size2 = e
      this.getMaterial()
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
