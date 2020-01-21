<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','CIRCULARTYPE_ALL','CIRCULARTYPE_CREATE']"
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
    <el-table :data="data" :tree-props="{children: 'children'}" size="small" style="width: 100%;" default-expand-all row-key="value" >
      <el-table-column type="index" width="50"/>
      <!--<el-table-column prop="circularType" label="类别"/>-->
      <el-table-column prop="circularTypeName" label="类别名称"/>
      <el-table-column prop="createdDate" label="创建时间" sortable="custom">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="parent.label" label="父类"/>
      <el-table-column prop="status" label="状态"/>
      <el-table-column v-if="checkPermission(['ADMIN','CIRCULARTYPE_ALL','CIRCULARTYPE_EDIT','CIRCULARTYPE_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','CIRCULARTYPE_ALL','CIRCULARTYPE_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','CIRCULARTYPE_ALL','CIRCULARTYPE_DELETE']"
            :ref="scope.row.circularType"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.circularType].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.circularType)">确定</el-button>
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
import { del, getCircularType } from '@/api/circularType'
import { parseTime } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      firstCircularTypeData: [],
      columns: [
        {
          text: '类别名称',
          value: 'circularTypeName'
        }
      ]
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
    getCircularType,
    beforeInit() {
      this.getCircularType({
        page: 0,
        size: 9999,
        parent: null
      }).then(res => {
        this.firstCircularTypeData = res.content
      })
      this.url = 'api/circularType'
      this.params = { page: this.page, size: this.size }
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
    subDelete(circularType) {
      this.delLoading = true
      del(circularType).then(res => {
        this.delLoading = false
        this.$refs[circularType].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[circularType].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
      console.log(this.firstCircularTypeData)
      this.$refs.form.firstCircularTypeData = this.firstCircularTypeData
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        circularType: data.circularType,
        circularTypeName: data.circularTypeName,
        createdDate: data.createdDate,
        createdBy: data.createdBy,
        lastModifiedDate: data.lastModifiedDate,
        lastModifiedBy: data.lastModifiedBy,
        parent: data.parent,
        status: data.status,
        priority: data.priority,
        level: data.parent ? 2 : 1
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
