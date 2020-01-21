<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">

      <el-select
        v-if="$store.state.user.user.partyDTO.partyType.partyType==='EMPLOYEE' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN'"
        v-model="organization"
        style="width: 250px;top: -3px"
        placeholder="请选择船只"
        clearable
        @change="changeOrganization">
        <el-option
          v-for="item in organizationData"
          :key="item.id"
          :label="item.label"
          :value="item.id"/>
      </el-select>

      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-if="checkPermission(['ADMIN','S2LSHIPCERTIFICATE_ALL','S2LSHIPCERTIFICATE_CREATE']) && ($store.state.user.user.partyDTO.partyType.partyType==='CREW' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN')"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增
        </el-button>
        <!-- 导出 -->
        <el-button
          v-permission="['ADMIN','S2LSHIPCERTIFICATE_ALL','S2LSHIPCERTIFICATE_SELECT']"
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="download">导出
        </el-button>
      </div>

    </div>
    <el-row :gutter="20">
      <el-col :xs="6" :sm="5" :md="3" :lg="3" :xl="3">
        <el-tree :data="shipCertificatorData" :props="defaultProps" @node-click="handleNodeClick"/>
      </el-col>
      <el-col :xs="18" :sm="19" :md="21" :lg="21" :xl="21">
        <!--表单组件-->
        <eForm ref="form" :is-add="isAdd"/>
        <!--表格渲染-->
        <el-table
          v-loading="loading"
          :data="data"
          highlight-current-row
          size="small"
          style="width: 100%;"
          @sort-change="sortChange">
          <el-table-column type="index" label="序号"/>
          <el-table-column prop="certificateName" label="证书名称"/>
          <el-table-column prop="organization.name" label="船舶名称"/>
          <el-table-column prop="certificator" label="发证机关"/>
          <el-table-column prop="certificateType" label="证书类型"/>
          <el-table-column prop="createdDate" label="创建日期" sortable="custom">
            <template slot-scope="scope">
              <span>{{ parseTimeNoMin(scope.row.createdDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="publishDate" label="发证日期" sortable="custom">
            <template slot-scope="scope">
              <span>{{ parseTimeNoMin(scope.row.publishDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="lastCheckDate" label="上次检查日期" width="130px" sortable="custom">
            <template slot-scope="scope">
              <span>{{ parseTimeNoMin(scope.row.lastCheckDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="checkPeriod" label="检查周期(月)"/>
          <el-table-column prop="nextDate" label="下次检查日期" >
            <template slot-scope="scope">
              <span :class="[{red:new Date(nextTime(scope.row)).getTime()<Date.now()}, {yellow:(new Date(nextTime(scope.row)).getTime()>Date.now() || new Date(nextTime(scope.row)).getTime()===Date.now()) && new Date(nextTime(scope.row)).setMonth(parseInt(new Date(nextTime(scope.row)).getMonth()) - parseInt(scope.row.earlyWarning))< Date.now()}]">
                {{ nextTime(scope.row) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="earlyWarning" label="预警月数"/>
          <el-table-column prop="supervisor" label="主管"/>
          <el-table-column prop="checkType" label="检查类型"/>
          <el-table-column prop="comments" label="备注"/>
          <el-table-column
            v-if="checkPermission(['ADMIN','S2LSHIPCERTIFICATE_ALL','S2LSHIPCERTIFICATE_EDIT','S2LSHIPCERTIFICATE_DELETE']) && ($store.state.user.user.partyDTO.partyType.partyType==='CREW' || $store.state.user.user.partyDTO.partyType.partyType==='SYSADMIN')"
            label="操作"
            width="150px"
            align="center">
            <template slot-scope="scope">
              <el-button
                v-permission="['ADMIN','S2LSHIPCERTIFICATE_ALL','S2LSHIPCERTIFICATE_EDIT']"
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="edit(scope.row)"/>
              <el-button v-permission="['ADMIN','S2LSHIPCERTIFICATE_ALL','S2LSHIPCERTIFICATE_DELETE']" slot="reference" type="danger" icon="el-icon-delete" size="mini" @click="open(scope.row)"/>
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, getShipData, getS2lShipCertificator } from '@/api/s2lShipCertificate'
import { getOrganizationByCriteria } from '@/api/organization'
import { parseTime, parseTimeNoMin, formatJson } from '@/utils/index'
import eForm from './form'

export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      organization: '',
      sort: 'certificateName', // 默认排序
      delLoading: false,
      loading: false,
      organizationData: [],
      downloadLoading: false,
      shipCertificatorData: [],
      shipCertificatorName: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  beforeCreate() {
    getOrganizationByCriteria({ organizationType: 'SHIP_DEPT' }).then(res => {
      this.organizationData = res
    })
  },
  created() {
    this.getS2lShipCertificator()
    if (this.$store.state.user.user.partyDTO.partyType.partyType === 'CREW') {
      this.$nextTick(() => {
        this.init()
      })
    }
  },
  methods: {
    parseTime,
    checkPermission,
    parseTimeNoMin,
    formatJson,
    getS2lShipCertificator() {
      getS2lShipCertificator().then(res => {
        res.map(v => {
          this.shipCertificatorData.push({
            label: v,
            children: []
          })
        })
      })
    },
    handleNodeClick(data) {
      this.shipCertificatorName = data.label
      this.init()
    },
    open(data) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.subDelete(data.id)
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
    },
    nextTime(data) {
      if (data.lastCheckDate && data.checkPeriod) {
        const oldDate = new Date(parseTimeNoMin(data.lastCheckDate).replace(/\-/g, '/'))
        const newDate = oldDate.setMonth(parseInt(oldDate.getMonth()) + parseInt(data.checkPeriod))
        return parseTimeNoMin(newDate)
      } else {
        return ''
      }
    },
    changeOrganization() {
      this.init()
    },
    // 导出
    download() {
      let exceldata = []
      getShipData({ organization: this.params.organization, page: 0, size: 9999 }).then(res => {
        exceldata = res.content
        this.downloadLoading = true
          import('@/utils/export2Excel').then(excel => {
            const tHeader = ['船舶', '证书名称', '发证单位', '主管', '上次检查日期', '证书类型', '检查周期（月）', '下次检查日期', '检查类型', '换证日期', '预警月数', '备注']
            const filterVal = ['organizationName', 'certificateName', 'certificator', 'supervisor', 'lastCheckDate', 'certificateType', 'checkPeriod', 'nextDate', 'checkType', 'publishDate', 'earlyWarning', 'comments']
            const data = this.formatJson(filterVal, exceldata)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '船舶证书信息'
            })
            this.downloadLoading = false
          })
      })
    },
    beforeInit() {
      const sort = this.sort
      this.url = 'api/s2lShipCertificate'
      this.params = { page: this.page, size: this.size, sort: sort }
      if (this.shipCertificatorName) {
        this.params['certificator'] = this.shipCertificatorName
      }
      if (this.$store.state.user.user.partyDTO.partyType.partyType === 'CREW') {
        this.params['organization'] = this.$store.state.user.user.partyDTO.organization.organizationId
      }
      if (this.$store.state.user.user.partyDTO.partyType.partyType === 'EMPLOYEE' || this.$store.state.user.user.partyDTO.partyType.partyType === 'SYSADMIN') {
        if (this.organization) {
          this.params['organization'] = this.organization
        }
      }
      return true
    },
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
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        // this.$refs[id].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        certificateName: data.certificateName,
        certificator: data.certificator,
        createdDate: data.createdDate,
        createdBy: data.createdBy,
        lastModifiedDate: data.lastModifiedDate,
        lastModifiedBy: data.lastModifiedBy,
        // thruDate: data.thruDate,
        // fromDate: data.fromDate,
        status: data.status,
        shipId: data.shipId,
        lastCheckDate: parseTime(data.lastCheckDate),
        checkPeriod: data.checkPeriod,
        certificateType: data.certificateType,
        publishDate: data.publishDate,
        comments: data.comments,
        organization: data.organization.organizationId,
        earlyWarning: data.earlyWarning,
        supervisor: data.supervisor,
        checkType: data.checkType
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>
  .red{
    color: red
  }
  .yellow{
    color: rgb(255,186,2)
  }
</style>
<style>
  .is-current {
    color: red;
  }
</style>
