<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container" style="text-align: center;">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;float: left">
        <el-button
          v-permission="['ADMIN','CUSTOMER_ALL','CUSTOMER_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
      <div style="display: inline-block;margin: 0px 2px;float: right">
        <!-- 导出 -->
        <el-button
          v-permission="['ADMIN','CUSTOMER_ALL']"
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
    <el-table v-loading="loading" id="singleTableDoc" ref="singleTable" :data="data" size="small" style="width: 100%;" highlight-current-row stripe @sort-change="sortChange">
      <el-table-column type="index" label="序号"/>
      <el-table-column prop="companyName" label="公司名称"/>
      <el-table-column prop="scope" label="供货范围"/>
      <el-table-column prop="contact" label="联系人"/>
      <el-table-column prop="contactPhone" label="联系电话"/>
      <el-table-column prop="comments" label="备注"/>
      <el-table-column v-if="checkPermission(['ADMIN','CUSTOMER_ALL','CUSTOMER_EDIT','CUSTOMER_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','CUSTOMER_ALL','CUSTOMER_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-button v-permission="['ADMIN','CUSTOMER_ALL','CUSTOMER_DELETE']" slot="reference" type="danger" icon="el-icon-delete" size="mini" @click="open(scope.row)"/>
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
import { del } from '@/api/customer'
import { parseTime } from '@/utils/index'
import { formatJsonNew } from '@/utils/index'
import eForm from './form'

export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      // sort: ' ',
      delLoading: false,
      downloadLoading: false
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    formatJsonNew,
    open(data) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.subDelete(data.customerId)
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
    },
    // 导出
    download() {
      let exceldata = []
      // get({ organization: this.params.organization }).then(res => {
      exceldata = this.data
      this.downloadLoading = true
      import('@/utils/export2Excel').then(excel => {
        const tHeader = ['公司名称', '供货范围', '联系电话', '联系人', '备注']
        const filterVal = ['companyName', 'scope', 'contactPhone', 'contact', 'comments']
        const data = this.formatJsonNew(filterVal, exceldata)
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
      this.url = 'api/customer'
      const sort = this.sort
      this.params = { page: this.page, size: this.size, sort: sort }
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
    subDelete(supplyId) {
      this.delLoading = true
      del(supplyId).then(res => {
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
        this.$refs[supplyId].doClose()
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
      this.$refs.form.form = JSON.parse(JSON.stringify(data))
      _this.dialog = true
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
