<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container" style="text-align: center;">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;float: left">
        <el-select v-model="query.organizationId" filterable placeholder="船名" style="position: relative;top: -3px;" clearable @change="toQuery">
          <el-option
            v-for="item in organizationData"
            :key="item.organizationId"
            :label="item.label"
            :value="item.organizationId"/>
        </el-select>
        <!--<el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>-->
        <el-button
          v-permission="['ADMIN','VOYAGE_ALL','VOYAGE_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
      <!--<div style="display: inline-block;margin: 0px 2px;float: right">-->
      <!--&lt;!&ndash; 导出 &ndash;&gt;-->
      <!--<el-button-->
      <!--v-permission="['ADMIN','SUPPLY_ALL','SUPPLY_EDIT']"-->
      <!--:loading="downloadLoading"-->
      <!--size="mini"-->
      <!--class="filter-item"-->
      <!--type="warning"-->
      <!--icon="el-icon-download"-->
      <!--@click="download">导出-->
      <!--</el-button>-->
      <!--</div>-->
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <seeForm ref="seeform" :is-see="isSee"/>

    <!--表格渲染-->
    <el-table v-loading="loading" id="singleTableDoc" ref="singleTable" :data="data" :tree-props="{children: 'children'}" row-key="id" default-expand-all lazy size="small" style="width: 100%;text-align: center">
      <el-table-column type="index" label="序号"/>
      <el-table-column prop="code" label="航次号"/>

      <el-table-column prop="codes" label="合同号">
        <template slot-scope="scope">
          <span v-for="(item,index) in scope.row.codes.split(',')" :key="index" @click="LinkTo(item)">
            <span v-if="index!==0">,</span>
            <span style="color: #1890ff;cursor: pointer">{{ item }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="organizationId.name" label="船名"/>

      <el-table-column prop="cargoName" label="货物种类">
        <template slot-scope="scope">
          <span v-for="(item,index) in scope.row.cargoName" :key="index">
            <span v-if="index!==0">,</span>
            <span>{{ item }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="货物总量（吨）"/>
      <el-table-column label="受载日期" prop="loadDate">
        <template slot-scope="scope">
          {{ parseTimeNoMin(scope.row.loadDate)+(scope.row.delayDays?(' ±'+scope.row.delayDays+'天'):'') }}
        </template>
      </el-table-column>
      <el-table-column label="航线" prop="sailing.name"/>
      <el-table-column label="指令" >
        <template v-if="scope.row.contracts" slot-scope="scope">
          <el-button size="mini" type=" " icon="el-icon-view" @click="see(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column prop="auditStatus" label="状态" >
        <template slot-scope="scope">
          {{ !scope.row.s2lVoyageConfirm?scope.row.auditStatus:'已确认' }}
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','VOYAGE_ALL','VOYAGE_EDIT','VOYAGE_DELETE'])&&!loading" label="操作" width="250px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','VOYAGE_ALL','VOYAGE_EDIT']" v-if="!scope.row.s2lVoyageConfirm" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-button v-permission="['ADMIN','VOYAGE_ALL','VOYAGE_DELETE']" v-if="!scope.row.s2lVoyageConfirm" slot="reference" type="danger" icon="el-icon-delete" size="mini" @click="open(scope.row)"/>
          <el-button v-permission="['ADMIN','VOYAGE_ALL','VOYAGE_CREATE']" v-if="scope.row.auditStatus==='待审批'" slot="reference" type="warning" icon="el-icon-delete" size="mini" @click="commitVoyagePublish(scope.row)">提交审批</el-button>
          <el-button v-if="scope.row.auditStatus==='审批中'&& currentUserPartyId === scope.row.auditBy" slot="reference" type="success" icon="el-icon-delete" size="mini" @click="audit(scope.row)">审批</el-button>
        </template>
    </el-table-column></el-table>
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
import initData from './initData'
import { parseTime, parseTimeNoMin } from '@/utils/index'
import { formatJson } from '@/utils/index'
import { getOAUserSecertMessage } from '@/api/partyEntryAudit'
import { del, commitVoyagePublish, getVoyage } from '@/api/voyage'
import { getOrganizationByCriteria } from '@/api/organization'
import eForm from './form'
import seeForm from './seeForm'
import { getCurrentUser } from '@/api/user'

export default {
  components: { eForm, seeForm },
  mixins: [initData],
  data() {
    return {
      isSee: false,
      currentUserPartyId: '',
      organizationData: [],
      sort: 'voyageId,desc',
      delLoading: false,
      downloadLoading: false,
      expand: true
    }
  },
  created() {
    this.getCurrentUser()
    getOrganizationByCriteria({ organizationType: 'SHIP_DEPT' }).then(res => {
      this.organizationData = res
    })
    document.addEventListener('visibilitychange', this.changeTab)
    this.$nextTick(() => {
      this.init()
    })
  },
  beforeDestroy() {
    document.removeEventListener('visibilitychange', this.changeTab)
  },

  methods: {
    parseTime,
    parseTimeNoMin,
    checkPermission,
    formatJson,
    getCurrentUser() {
      getCurrentUser().then(res => {
        if (res && res.party) {
          this.currentUserPartyId = res.party.partyId
        }
      })
    },
    LinkTo(code) {
      this.$router.push({ path: 'contract', query: { code: code }})
    },
    changeTab() {
      var _this = this
      if (document.visibilityState === 'visible') {
        _this.init()
      }
    },
    commitVoyagePublish(row) {
      // userId: userId, token: token,
      commitVoyagePublish(row.voyageId).then(res => {
        this.$notify({
          title: '提交成功',
          type: 'success',
          duration: 2500
        })
        this.init()
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.response.data.message
        })
      })
    },
    audit(row) { // 审批
      console.log(this.$store.state.user)
      getOAUserSecertMessage({
        requestid: row.auditWorkflowId,
        workcode: this.$store.state.user.user.partyDTO.partyId
      }).then(res => {
        window.open(process.env.Workcode_BASE_API + '?token=' + res)
        // this.init()
        this.$notify({
          title: '提交成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.$message({
          type: 'error',
          message: '故障！'
        })
      })
    },
    open(data) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.subDelete(data.voyageId)
      }).catch(() => {
      })
    },
    // 导出
    download() {
      let exceldata = []
      // get({ organization: this.params.organization }).then(res => {
      exceldata = this.data
      this.downloadLoading = true
        import('@/utils/export2Excel').then(excel => {
          const tHeader = ['状态', '创建时间', '上次修改时间', '创建人', '上次修改人', '公司编号', '公司名称', '供货范围', '联系电话', '联系人', '供货类型', '备注']
          const filterVal = ['status', 'createdDate', 'lastModifiedDate', 'createdBy', 'lastModifiedBy', 'companyCode', 'companyName', 'scope', 'contactPhone', 'contact', 'supplyType', 'comments']
          const data = this.formatJson(filterVal, exceldata)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '客户信息'
          })
          this.downloadLoading = false
        })
        // })
    },
    beforeInit() {
      this.url = 'api/voyageList'
      const sort = this.sort
      this.params = { page: this.page, size: this.size, sort: sort, organizationId: this.query.organizationId }
      return true
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
    subDelete(voyageId) {
      this.delLoading = true
      del(voyageId).then(res => {
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
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.organizationData = this.organizationData
      this.$refs.form.dialog = true
    },
    see(rows) {
      getVoyage({ voyageId: rows.voyageId }).then(res => {
        if (res.content && res.content[0]) {
          var row = res.content[0]
          row.contractsIds = row.contracts.map(items => {
            return items.contractId
          })
          this.isSee = false
          const _this = this.$refs.seeform

          this.$refs.seeform.form = JSON.parse(JSON.stringify(row))
          _this.dialog = true
        }
      })
    },
    edit(rows) {
      getVoyage({ voyageId: rows.voyageId }).then(res => {
        if (res.content && res.content[0]) {
          var row = res.content[0]
          row.contractsIds = row.contracts.map(items => {
            return items.contractId
          })
          this.isAdd = false
          this.$refs.form.organizationData = this.organizationData
          const _this = this.$refs.form
          this.$refs.form.form = JSON.parse(JSON.stringify(row))
          _this.dialog = true
        }
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
