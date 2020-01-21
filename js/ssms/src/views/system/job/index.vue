<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-select v-model="query.jobType" clearable placeholder="职位序列类型" class="filter-item" @change="toQuery">
        <el-option v-for="item in jobTypes" :key="item.value" :label="item.jobTypeName" :value="item.jobType"/>
      </el-select>
      <el-input v-model="query.value" clearable placeholder="输入职位序列名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div v-permission="['ADMIN','USERJOB_ALL','USERJOB_CREATE']" style="display: inline-block;margin: 0px 2px;">
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
      <div style="display: inline-block;">
        <el-button
          class="filter-item"
          size="mini"
          type="warning"
          icon="el-icon-more"
          @click="changeExpand">{{ $parent.expand ? '折叠' : '展开' }}</el-button>
        <eForm ref="form" :is-add="true" :dicts="dicts"/>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" :dicts="dicts"/>
    <!--表格渲染-->
    <tree-table v-loading="loading" :expand-all="expand" :data="data" :columns="columns" size="small">
      <el-table-column prop="jobType.jobTypeName" label="职位序列类型"/>
      <!-- <el-table-column prop="name" label="名称"/> -->
      <el-table-column prop="parentJob.name" label="上级职位"/>
      <el-table-column prop="createdDate" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="comments" label="备注"/>
      <el-table-column v-if="checkPermission(['ADMIN','USERJOB_ALL','USERJOB_EDIT','USERJOB_DELETE'])" label="操作" width="130px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','USERJOB_ALL','USERJOB_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-button v-permission="['ADMIN','USERJOB_ALL','USERJOB_DELETE']" slot="reference" type="danger" icon="el-icon-delete" size="mini" @click="open(scope.row)"/>
        </template>
      </el-table-column>
    </tree-table>
    <!--分页组件-->
    <!--<el-pagination-->
    <!--:total="total"-->
    <!--:current-page="page + 1"-->
    <!--style="margin-top: 8px;"-->
    <!--layout="total, prev, pager, next, sizes"-->
    <!--@size-change="sizeChange"-->
    <!--@current-change="pageChange"/>-->
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'
import checkPermission from '@/utils/permission'
import { getAllJobType } from '@/api/jobType'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { del } from '@/api/job'
import { parseTime } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm, treeTable },
  mixins: [initData, initDict],
  data() {
    return {
      columns: [
        {
          text: '职位序列名称',
          value: 'name'
        }
      ],
      enabledTypeOptions: [
        { key: 'true', display_name: '正常' },
        { key: 'false', display_name: '禁用' }
      ],
      delLoading: false, expand: true, jobTypes: {}
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
      // 加载jobType
      this.queryAllJobType()
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
    beforeInit() {
      this.url = 'api/job'
      const sort = 'jobType.jobType,asc'
      this.params = { page: this.page, size: 999, sort: sort }
      const query = this.query
      const value = query.value
      const jobType = query.jobType
      if (value) { this.params['name'] = value }
      if (jobType) { this.params['jobType'] = query.jobType }
      return true
    },
    changeExpand() {
      this.expand = !this.expand
      this.init()
    },
    queryAllJobType() {
      getAllJobType().then(res => {
        this.jobTypes = res.content
        console.log(this.jobTypes)
      })
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
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
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      // this.$refs.form.getDepts()
      this.$refs.form.getAllJob()
      this.$refs.form.dialog = true
      console.log(this.data)
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.getAllJob()
      _this.form = {
        jobId: data.jobId,
        name: data.name,
        jobType: data.jobType.jobType,
        status: 'USE',
        // parentJob: parentJob,
        comments: data.comments,
        createdDate: data.createdDate
      }
      if (data.parentJob) { _this.form.parentJob = data.parentJob.jobId }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
