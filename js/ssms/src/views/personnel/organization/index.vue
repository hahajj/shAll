<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <treeselect v-model="query.organizationType" :options="organizationTypes" style="width: 200px;margin-top: 6px;  " class="left" placeholder="请选择组织类型" />
      <el-input v-model="query.name" clearable placeholder="输入组织名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','ORGANIZATION_ALL','ORGANIZATION_CREATE']"
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
          @click="changExpand">{{ $parent.expand ? '折叠' : '展开' }}</el-button>
        <eForm ref="form" :is-add="true" />
      </div>
      <!--<div style="display: inline-block;">-->
      <!--<el-upload-->
      <!--:on-preview="handlePreview"-->
      <!--:on-remove="handleRemove"-->
      <!--:before-remove="beforeRemove"-->
      <!--:limit="3"-->
      <!--:on-exceed="handleExceed"-->
      <!--:file-list="fileList"-->
      <!--:http-request="uploadFile"-->
      <!--class="upload-demo"-->
      <!--action=""-->
      <!--multiple>-->
      <!--<el-button class="filter-item" size="mini" type="primary">点击上传</el-button>-->
      <!--</el-upload>-->
      <!--</div>-->
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <tree-table v-loading="loading" :data="data" :expand-all="expand" :columns="columns" size="small" style="width: 100%;">
      <el-table-column prop="organizationType.organizationTypeName" label="组织类型"/>
      <el-table-column prop="parentOrganization.name" label="上级组织"/>
      <el-table-column prop="createdDate" label="创建日期" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="组织邮箱"/>
      <el-table-column prop="contactMech" label="组织联系方式"/>
      <el-table-column prop="comments" label="备注"/>
      <el-table-column v-if="checkPermission(['ADMIN','ORGANIZATION_ALL','ORGANIZATION_EDIT','ORGANIZATION_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','ORGANIZATION_ALL','ORGANIZATION_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-button v-permission="['ADMIN','ORGANIZATION_ALL','ORGANIZATION_DELETE']" slot="reference" type="danger" icon="el-icon-delete" size="mini" @click="open(scope.row)"/>
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
import Treeselect from '@riophae/vue-treeselect'
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del } from '@/api/organization'
import { queryAll } from '@/api/organizationType'
import { parseTime } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm, treeTable, Treeselect },
  mixins: [initData],
  data() {
    return {
      columns: [
        {
          text: '组织名称',
          value: 'name'
        }
      ],
      fileList: [],
      delLoading: false,
      restaurants: [],
      expand: '',
      state: '',
      timeout: null,
      organizationType: '',
      organizationTypes: [],
      value: ''
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
      this.queryAll()
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
      this.url = 'api/organization'
      const sort = 'organizationId,desc'
      const query = this.query
      const organizationType = query.organizationType
      const name = query.name
      this.params = { page: this.page, size: 9999, sort: sort }
      if (organizationType === 'COMPANY' || organizationType === 'DEPT') {
        this.$message({ message: '请选择公司或者部门下的具体的组织类型', type: 'error' })
      } else {
        this.params['organizationType'] = organizationType
      }
      if (name) { this.params['name'] = name }
      return true
    },
    sortChange(column, prop, order) {
      console.log(column.prop) // prop标签 => nickname
      console.log(column.order)// descending降序、ascending升序
    },
    queryAll() {
      queryAll().then(res => {
        this.organizationTypes = res.content
        // console.log(this.organizationTypes)
      })
    },
    subDelete(organizationId) {
      this.delLoading = true
      del(organizationId).then(res => {
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
        this.$refs[organizationId].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      const _this = this.$refs.form
      _this.dialog = true
      _this.organizationTypes = this.organizationTypes
    },
    changExpand() {
      this.expand = !this.expand
      this.init()
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        organizationId: data.organizationId,
        organizationType: data.organizationType.organizationType,
        name: data.name,
        comments: data.comments,
        email: data.email,
        contactMech: data.contactMech
      }
      if (data.parentOrganization) {
        _this.form.parentOrganization = data.parentOrganization.id
      }
      _this.organizationTypes = this.organizationTypes
      console.log(_this.organizationTypes)
      _this.dialog = true
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    uploadFile(params) {
      console.log(params)
    }
  }
}
</script>

<style scoped>
.left{
  height: 30.5px;
  line-height: 30.5px;
  display: inline-block;
  font-size: 14px;
  color: #606266;
}
.control{
  height: 31px;
}
.value-container{
  height: 30.5px;
  color:blue !important;
}

/deep/ .vue-treeselect__control {
  margin-top: 6px;
  padding-left: 5px;
  padding-right: 5px;
  display: table;
  table-layout: fixed;
  width: 100%;
  height: 29px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #fff;
  -webkit-transition-duration: 200ms;
  transition-duration: 200ms;
  -webkit-transition-property: border-color, width, height, background-color, opacity, -webkit-box-shadow;
  transition-property: border-color, width, height, background-color, opacity, -webkit-box-shadow;
  transition-property: border-color, box-shadow, width, height, background-color, opacity;
  transition-property: border-color, box-shadow, width, height, background-color, opacity, -webkit-box-shadow;
  -webkit-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}
</style>
