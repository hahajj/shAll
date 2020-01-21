<template>
  <div class="app-container">
    <!--form 组件-->
    <eForm ref="form" :is-add="isAdd" :dicts="enabledTypeOptions"/>
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col>
        <!--工具栏-->
        <div class="head-container">
          <!-- 搜索 -->
          <el-input v-model="query.username" clearable placeholder="用户账号" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-select v-model="query.partyId" :remote-method="remoteMethod" filterable remote placeholder="输入关联员工编号或姓名" clearable class="filter-item" style="width: 200px">
            <el-option
              v-for="(item, index) in partys"
              :key="item.name + index"
              :label="item.name+'/' + item.code "
              :value="item.partyId"/>
          </el-select>
          <el-select v-model="query.roleId" placeholder="角色" clearable class="filter-item" style="width: 200px">
            <el-option
              v-for="(item, index) in roles"
              :key="item.name + index"
              :label="item.name"
              :value="item.id"/>
          </el-select>
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
          <!-- 新增 -->
          <div v-permission="['ADMIN','USER_ALL','USER_CREATE']" style="display: inline-block;margin: 0px 2px;">
            <el-button
              class="filter-item"
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="add">新增</el-button>
          </div>
          <div style="display: inline-block;">
            <el-button
              v-permission="['ADMIN']"
              :loading="downloadLoading"
              size="mini"
              class="filter-item"
              type="warning"
              icon="el-icon-download"
              @click="download">导出</el-button>
          </div>
        </div>
        <!--表格渲染-->
        <el-table v-loading="loading" :data="data" size="small" style="max-width: 100%;" @sort-change="sortChange">
          <el-table-column type="index" min-width="16%" label="序号"/>
          <el-table-column prop="username" min-width="20%" label="用户帐号"/>
          <el-table-column prop="party.name" min-width="20%" label="关联员工姓名"/>
          <el-table-column prop="party.code" min-width="20%" label="关联员工编号"/>
          <el-table-column :show-overflow-tooltip="true" prop="createTime" min-width="16%" label="创建日期" sortable="custom">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="checkPermission(['ADMIN','USER_ALL','USER_EDIT','USER_DELETE'])" label="操作" min-width="20%" align="center">
            <template slot-scope="scope">
              <el-button v-permission="['ADMIN','USER_ALL','USER_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
              <el-button v-permission="['ADMIN','USER_ALL','USER_DELETE']" type="danger" icon="el-icon-delete" size="mini" @click="open(scope.row)"/>
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
import initDict from '@/mixins/initDict'
import { del } from '@/api/user'
import { getAllRole } from '@/api/role'
import { getPartysByNameOrCode } from '@/api/party'
import { getOrganization } from '@/api/organization'
import { parseTime } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData, initDict],
  data() {
    return {
      sort: 'id,desc',
      height: document.documentElement.clientHeight - 180 + 'px;', isAdd: false,
      partys: [],
      roles: [],
      partyId: '',
      useres: {},
      delLoading: false,
      organizationName: '',
      organizations: [],
      organizationId: null,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      downloadLoading: false,
      queryTypeOptions: [
        { key: 'username', display_name: '用户名' },
        { key: 'email', display_name: '邮箱' }
      ],
      enabledTypeOptions: [
        { key: 'true', display_name: '激活' },
        { key: 'false', display_name: '锁定' }
      ]
    }
  },
  created() {
    this.getOrganization()
    this.getRoles()
    this.$nextTick(() => {
      this.init()
      // 加载数据字典
      this.getDict('user_status')
    })
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
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
      this.url = 'api/users'
      const sort = this.sort
      const query = this.query
      const username = query.username
      const partyId = query.partyId
      const roleId = query.roleId
      this.params = { page: this.page, size: this.size, sort: sort }
      if (username) { this.params['username'] = username }
      if (partyId) { this.params['partyId'] = partyId }
      if (roleId) { this.params['roleId'] = roleId }
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
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        // this.$refs[id].doClose()
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
    getOrganization() {
      const sort = 'organizationId,desc'
      const params = { sort: sort }
      if (this.organizationName) { params['name'] = this.organizationName }
      getOrganization(params).then(res => {
        this.organizations = res.content
      })
    },
    handleNodeClick(data) {
      console.log(data)
      if (!data.parentId) {
        this.organizationId = null
      } else {
        this.organizationId = data.parentId
      }
      console.log(this.organizationId)
      this.init()
    },
    add() {
      this.$refs.form.resetForm
      this.$refs.form.isAdd = true
      this.$refs.form.getOrganizations()
      this.$refs.form.roles = this.roles
      this.$refs.form.getRoleLevel()
      this.$refs.form.dialog = true
    },
    // 导出
    download() {
      this.downloadLoading = true
      import('@/utils/export2Excel').then(excel => {
        const tHeader = ['ID', '用户名', '邮箱', '头像地址', '状态', '注册日期', '最后修改密码日期']
        const filterVal = ['id', 'username', 'email', 'avatar', 'enabled', 'createTime', 'lastPasswordResetTime']
        const data = this.formatJson(filterVal, this.data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    // 数据转换
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createTime' || j === 'lastPasswordResetTime') {
          return parseTime(v[j])
        } else if (j === 'enabled') {
          return parseTime(v[j]) ? '启用' : '禁用'
        } else {
          return v[j]
        }
      }))
    },
    edit(data) {
      const _this = this.$refs.form
      _this.roles = this.roles
      _this.getRoleLevel()
      _this.isAdd = false
      _this.roleIds = []
      // _this.form = { id: data.id,
      //   username: data.username,
      //   phone: data.phone,
      //   email: data.email,
      //   enabled: data.enabled.toString(),
      //   roles: [],
      //   password: '',
      //   repassword: '',
      //   party: data.party.partyId }
      _this.form = JSON.parse(JSON.stringify(data))
      // _this.form.username = data.username
      if (!data.party) {
        _this.partyId = ''
      } else {
        _this.partyId = data.party.partyId
      }
      data.roles.forEach(function(data, index) {
        _this.roleIds.push(data.id)
      })
      _this.dialog = true
    },
    getPartys(para) {
      if (!para) {
        para = ''
      }
      getPartysByNameOrCode(para).then(res => {
        this.partys = res
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    getRoles() {
      getAllRole().then(res => {
        this.roles = res
        console.log(this.roles)
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.getPartys(query)
        }, 200)
      } else {
        this.partys = []
      }
    }
  }
}
</script>

<style scoped>
</style>
