<template>
  <div class="app-container">
    <!--工具栏-->
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" id="singleTableDoc" ref="singleTable" :data="data" :tree-props="{children: 'children'}" row-key="id" default-expand-all lazy size="small" style="width: 100%;text-align: center">
      <el-table-column type="index" label="序号"/>
      <el-table-column prop="code" label="航次号"/>
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
          <el-button size="mini" type=" " icon="el-icon-view" @click="edit(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column label="状态" >
        <template slot-scope="scope">
          {{ !scope.row.s2lVoyageConfirm?'未确认':'已确认' }}
        </template>
      </el-table-column>
      <!--<el-table-column prop="auditStatus" label="状态"/>-->
      <el-table-column v-if="checkPermission(['ADMIN','VOYAGE_CONFIRM'])" label="操作" width="150px" align="center">
        <template v-if="scope.row.contracts" slot-scope="scope">
          <el-button v-permission="['ADMIN','VOYAGE_CONFIRM']" v-if="!scope.row.s2lVoyageConfirm" slot="reference" type="primary" size="mini" @click="open(scope.row)">确认</el-button>
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
import initData from './initData'
import { parseTimeNoMin } from '@/utils/index'
import { formatJson } from '@/utils/index'
import { del, confirmVoyage, getVoyage } from '@/api/voyage'
import eForm from './form'

export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      sort: 'voyageId,desc',
      delLoading: false,
      downloadLoading: false,
      expand: true
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTimeNoMin,
    checkPermission,
    formatJson,
    open(data) {
      console.log(data)
      this.$confirm('确认接收后，可以填写该航次动态报信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        confirmVoyage(data.voyageId).then(res => {
          this.$notify({
            title: '操作成功！',
            type: 'success',
            duration: 2500
          })
          this.init()
        })
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
      this.params = { page: this.page, size: this.size, sort: sort, organizationId: this.$store.state.user.user.partyDTO.organization.organizationId, auditStatus: '同意' }
      // , organizationId: this.$store.state.user.user.partyDTO.organization.organizationId
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
      this.$refs.form.dialog = true
    },
    edit(rows) {
      getVoyage({ voyageId: rows.voyageId }).then(res => {
        if (res.content && res.content[0]) {
          var row = res.content[0]
          row.contractsIds = row.contracts.map(items => {
            return items.contractId
          })
          this.isAdd = false
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
