<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">

      <el-select
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
          v-permission="['ADMIN','S2LSHIPCERTIFICATE_ALL','S2LSHIPCERTIFICATE_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增
        </el-button>
        <!-- 导出 -->
        <el-button
          v-permission="['ADMIN','PARTY_ALL','PARTY_CREATE']"
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="download">导出
        </el-button>
      </div>

    </div>
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
      <el-table-column type="index" width="50"/>
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
      <!--<el-table-column prop="thruDate" label="到期日期" sortable="custom">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{ parseTimeNoMin(scope.row.thruDate) }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="lastCheckDate" label="上次检查日期" sortable="custom">
        <template slot-scope="scope">
          <span>{{ parseTimeNoMin(scope.row.lastCheckDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="checkPeriod" label="检查周期(月)"/>
      <el-table-column prop="nextDate" label="下次检查日期" >
        <template slot-scope="scope">
          <span>{{ nextTime(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="comments" label="备注"/>
      <el-table-column
        v-if="checkPermission(['ADMIN','S2LSHIPCERTIFICATE_ALL','S2LSHIPCERTIFICATE_EDIT','S2LSHIPCERTIFICATE_DELETE'])"
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
          <el-popover
            v-permission="['ADMIN','S2LSHIPCERTIFICATE_ALL','S2LSHIPCERTIFICATE_DELETE']"
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定
              </el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
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
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, getShipData } from '@/api/s2lShipCertificate'
import { getOrganizationByCriteria } from '@/api/organization'
import { parseTime, parseTimeNoMin, formatJson } from '@/utils/index'
import eForm from './form'

export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      organization: '',
      sort: 'id', // 默认排序
      delLoading: false,
      organizationData: [],
      downloadLoading: false
    }
  },
  beforeCreate() {
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
    parseTime,
    checkPermission,
    parseTimeNoMin,
    formatJson,
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
      getShipData({ organization: this.params.organization }).then(res => {
        exceldata = res.content
        this.downloadLoading = true
          import('@/utils/export2Excel').then(excel => {
            const tHeader = ['证书名称', '船舶名称', '发证机关', '证书类型', '创建日期', '发证日期', '上次检查日期', '检查日期（月）', '下次检查日期', '备注']
            const filterVal = ['certificateName', 'organizationName', 'certificator', 'certificateType', 'createdDate', 'publishDate', 'lastCheckDate', 'checkPeriod', 'nextDate', 'comments']
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
      if (this.organization) {
        this.params['organization'] = this.organization
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
        this.$refs[id].doClose()
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
        // publishDate: data.publishDate,
        comments: data.comments,
        organization: this.$store.state.user.user.partyDTO.organization.organizationId

      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
