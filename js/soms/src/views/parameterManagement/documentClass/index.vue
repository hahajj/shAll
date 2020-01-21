<template>
  <div class="app-container">

    <el-row :gutter="20">
      <el-col :xs="7" :sm="6" :md="4" :lg="4" :xl="4">
        <el-tree :data="firstDocumentClassData" :props="defaultProps" :expand-on-click-node="false" default-expand-all @node-click="handleNodeClick"/>
      </el-col>

      <el-col :xs="17" :sm="18" :md="20" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <!-- 新增 -->
          <div style="display: inline-block;margin: 0px 2px;">

            <el-button
              v-permission="['ADMIN','DOCUMENTCLASS_ALL','DOCUMENTCLASS_CREATE']"
              class="filter-item"
              size="mini"
              type="warning"
              @click="changeFirstClass">一级科目</el-button>
            <el-button
              v-permission="['ADMIN','DOCUMENTCLASS_ALL','DOCUMENTCLASS_CREATE']"
              class="filter-item"
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="add">科目新增</el-button>
          </div>
        </div>

        <!--表单组件-->
        <eForm ref="form" :is-add="isAdd"/>
        <!--表格渲染-->
        <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
          <el-table-column type="index" width="50"/>
          <el-table-column prop="documentClassCode" label="科目分类号"/>
          <el-table-column prop="documentClassName" label="科目分类名称"/>
          <el-table-column prop="scope" label="科目范围"/>
          <el-table-column prop="level" label="级别">
            <template slot-scope="scope">
              {{ scope.row.level==1?'一级科目':'二级科目' }}
            </template>
          </el-table-column>
          <el-table-column v-if="checkPermission(['ADMIN','DOCUMENTCLASS_ALL','DOCUMENTCLASS_EDIT','DOCUMENTCLASS_DELETE'])" label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <el-button v-permission="['ADMIN','DOCUMENTCLASS_ALL','DOCUMENTCLASS_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
              <el-button v-permission="['ADMIN','DOCUMENTCLASS_ALL','DOCUMENTCLASS_EDIT']" slot="reference" type="danger" icon="el-icon-delete" size="mini" @click="open(scope.row)"/>
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
import { del, getTree } from '@/api/documentClass'
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
      this.getClassData()
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
        this.subDelete(data.id)
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
    },
    getClassData() {
      getTree({ parentClass: null }).then(res => {
        this.$nextTick(() => {
          this.firstDocumentClassData = res.content
        })
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
      this.url = 'api/documentClass'
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
        this.getClassData()
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
      this.$refs.form.firstDocumentClassData = this.firstDocumentClassData
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      this.$refs.form.firstDocumentClassData = this.firstDocumentClassData
      _this.form = {
        parentClassId: '',
        documentClassId: data.documentClassId,
        documentClassName: data.documentClassName,
        documentClassCode: data.documentClassCode,
        comments: data.comments,
        createdDate: data.createdDate,
        createdBy: data.createdBy,
        lastModifiedDate: data.lastModifiedDate,
        lastModifiedBy: data.lastModifiedBy,

        level: data.level,
        scope: data.scope,
        status: data.status
      }
      if (data.level === 2) {
        _this.form.parentClassId = data.parentClass.id,
        _this.form.parentClass = data.parentClass
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
