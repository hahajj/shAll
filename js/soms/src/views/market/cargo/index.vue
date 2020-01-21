<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','CARGO_ALL','CARGO_CREATE']"
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
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column type="index" width="50"/>
      <el-table-column prop="name" label="货物名称"/>
      <el-table-column prop="cargoSpec" label="货物特点"/>
      <el-table-column prop="comments" label="备注"/>
      <el-table-column v-if="checkPermission(['ADMIN','CARGO_ALL','CARGO_EDIT','CARGO_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','CARGO_ALL','CARGO_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-button v-permission="['ADMIN','CARGO_ALL','CARGO_DELETE']" slot="reference" type="danger" icon="el-icon-delete" size="mini" @click="open(scope.row)"/>
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
import { del } from '@/api/cargo'
import { parseTime } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      sort: 'desc', // 默认排序
      delLoading: false,
      firstDocumentClassData: [],
      parentClassId: '',
      documentClassId: '',
      level: '',
      defaultProps: {
        children: 'children',
        label: 'documentClassName'
      },
      documentClassData: []
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
        this.subDelete(data.cargoId)
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
    },
    changeFirstClass() {
      this.documentClassId = null
      this.level = 1
      this.$nextTick(() => {
        this.init()
      })
    },
    handleNodeClick(data) {
      if (data.level === 1) {
        this.documentClassId = data.id
        this.init().then(res => {
          this.data = res
        })
      } else {
        const arry = []
        arry.push(data)
        this.data = arry
      }
    },
    handleCurrentChange(val) {
    },
    beforeInit: function() {
      this.url = 'api/cargo'
      const sort = this.sort
      this.params = { page: this.page, size: this.size, sort: sort, documentClassId: this.documentClassId, level: this.level }
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
    subDelete(DOCUMENTClassId) {
      this.delLoading = true
      del(DOCUMENTClassId).then(res => {
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
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      this.$refs.form.form=JSON.parse(JSON.stringify(data))
      this.$refs.form.form.lastModifiedDateL=parseTime(data.lastModifiedDate)
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
