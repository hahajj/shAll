<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','PARTYCHANGE_ALL','PARTYCHANGE_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;" @sort-change="sortChange">
      <el-table-column type="index" width="50" label="序号"/>
      <!--<el-table-column prop="createdDate" label="createdDate">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{ parseTime(scope.row.createdDate) }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="party.name" label="姓名"/>
      <el-table-column prop="formerOrganization.name" label="原部门"/>
      <el-table-column prop="formerJob.label" label="原职位"/>
      <el-table-column prop="newOrganization.name" label="现部门"/>
      <el-table-column prop="newJob.label" label="现职位"/>
      <el-table-column prop="changeDate" label="调动时间" sortable="custom">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.changeDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="partyChangeType.partyChangeTypeName" label="调动类型"/>
      <el-table-column prop="commnets" label="备注"/>
      <el-table-column v-if="checkPermission(['ADMIN','PARTYCHANGE_ALL','PARTYCHANGE_EDIT','PARTYCHANGE_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <!--<el-button v-permission="['ADMIN','PARTYCHANGE_ALL','PARTYCHANGE_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>-->
          <el-button v-permission="['ADMIN','PARTYCHANGE_ALL','PARTYCHANGE_DELETE']" slot="reference" type="danger" icon="el-icon-delete" size="mini" @click="open(scope.row)"/>
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
import { del } from '@/api/partyChange'
import { parseTime } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      sort: 'createdDate,desc',
      delLoading: false
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
    open(data) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.subDelete(data.partyChangeId)
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
    },
    beforeInit() {
      this.url = 'api/partyChange'
      const sort = this.sort
      this.params = { page: this.page, size: this.size, sort: sort, partyChangeType: '1,2,3,4,5' }
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
    subDelete(partyChangeId) {
      this.delLoading = true
      del(partyChangeId).then(res => {
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
        this.$refs[partyChangeId].doClose()
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
        partyChangeId: data.partyChangeId,
        createdDate: data.createdDate,
        createdBy: data.createdBy,
        lastModifiedDate: data.lastModifiedDate,
        lastModifiedBy: data.lastModifiedBy,
        partyId: data.partyId,
        changeDate: data.changeDate,
        changeBy: data.changeBy,
        commnets: data.commnets,
        changeType: data.changeType,
        formerOrganization: data.formerOrganization,
        formerJob: data.formerJob,
        newOrganization: data.newOrganization,
        newJob: data.newJob
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
