<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div v-permission="['ADMIN','MENU_ALL','MENU_CREATE']" style="display: inline-block;margin: 0px 2px;">
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
          @click="changExpand">{{ expand ? '折叠' : '展开' }}</el-button>
        <eForm ref="form" :is-add="true"/>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <!--<tree-table v-loading="loading" :data="data" :expand-all="expand" :columns="columns" size="small">-->
    <el-table
      v-loading="loading"
      ref="tree"
      :data="data"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      size="small"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id">
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="icon" label="图标" align="center" width="80px">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" align="center" width="100px" label="排序">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.sort }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="path" label="链接地址"/>
      <el-table-column :show-overflow-tooltip="true" prop="component" label="组件路径"/>
      <el-table-column prop="iframe" width="100px" label="内部菜单">
        <template slot-scope="scope">
          <span v-if="!scope.row.iframe">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','MENU_ALL','MENU_EDIT','MENU_DELETE'])" label="操作" width="130px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','MENU_ALL','MENU_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-button v-permission="['ADMIN','MENU_ALL','MENU_DELETE']" slot="reference" type="danger" icon="el-icon-delete" size="mini" @click="open(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>
    <!--</tree-table>-->
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import treeTable from '@/components/TreeTable'
import initData from '@/mixins/initData'
import { del } from '@/api/menu'
import { parseTime } from '@/utils/index'
import eForm from './form'
export default {
  components: { treeTable, eForm },
  mixins: [initData],
  data() {
    return {
      // columns: [
      //   {
      //     text: '名称',
      //     value: 'name'
      //   }
      // ],
      delLoading: false, expand: false
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
        this.subDelete(data.id)
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
    },
    beforeInit() {
      this.url = 'api/menus'
      const sort = 'id,desc'
      const query = this.query
      const value = query.value
      this.params = { page: this.page, size: this.size, sort: sort }
      if (value) { this.params['name'] = value }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
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
      this.$refs.form.getMenus()
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.getMenus()
      _this.form = { id: data.id, component: data.component, name: data.name, sort: data.sort, pid: data.pid, path: data.path, iframe: data.iframe.toString(), roles: [], icon: data.icon }
      _this.dialog = true
    },
    changExpand() {
      this.expand = !this.expand
      let treeData = this.$refs.tree.store.states.treeData
      for (let i in treeData) {
        treeData[i].expanded = this.expand
      }
      this.init()
    }
  }
}
</script>

<style scoped>

</style>
