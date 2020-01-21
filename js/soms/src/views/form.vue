<template>
  <el-dialog :visible.sync="dialog" title="编辑快捷菜单" append-to-body width="500px">
    <el-card v-show="opt === '菜单分配'" class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <el-tooltip class="item" effect="dark" content="选择指定角色分配菜单" placement="top">
          <span class="role-span">菜单分配</span>
        </el-tooltip>
        <el-button
          :disabled="!showButton"
          :loading="menuLoading"
          icon="el-icon-check"
          size="mini"
          style="float: right; padding: 6px 9px"
          type="primary"
          @click="saveMenu">保存</el-button>
      </div>
      <el-tree
        ref="menu"
        :data="menus"
        :default-checked-keys="menuIds"
        :props="defaultProps"
        accordion
        show-checkbox
        node-key="id"/>
    </el-card>
  </el-dialog>
</template>

<script>
import { getOrganization } from '@/api/organization'
import { add, edit } from '@/api/role'
import { getCurrentUser, updateMenu } from '@/api/user'
import { buildMenus } from '@/api/menu'
import { filterAsyncRouter } from '@/store/modules/permission'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dateScopes: ['全部', '本级', '自定义'],
      loading: false,
      dialog: false,
      opt: '菜单分配',
      showButton: true,
      depts: [],
      organizationIds: [],
      organizations: [],
      menuLoading: false,
      menus: [], menuIds: [],
      currentId: 0,
      form: { name: '', organizations: [], remark: '', dataScope: '本级', level: 3 },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    dialog() {
      if (!this.dialog) {
        this.resetForm()
      }
    }
  },
  created() {
    this.getMenus()
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      const _this = this
      if (this.form.dataScope === '自定义' && this.organizationIds.length === 0) {
        this.$message({
          message: '自定义数据权限不能为空',
          type: 'warning'
        })
      } else {
        this.form.organizations = []
        if (this.form.dataScope === '自定义') {
          for (let i = 0; i < this.organizationIds.length; i++) {
            _this.form.organizations.push({
              organizationId: this.organizationIds[i]
            })
          }
        }
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true
            if (this.isAdd) {
              this.doAdd()
            } else this.doEdit()
          } else {
            return false
          }
        })
      }
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.form = { name: '', organizations: [], remark: '', dataScope: '本级', level: 3 }
      this.organizationIds = []
      console.log(this.form)
    },
    getOrganization() {
      getOrganization({ enabled: true }).then(res => {
        this.organizations = res.content
      })
    },
    changeScope() {
      if (this.form.dataScope === '自定义') {
        this.getOrganization()
      }
    },
    getMenus() {
      buildMenus().then(res => {
        const asyncRouter = filterAsyncRouter(res)
        console.log(asyncRouter)
        this.menus = asyncRouter
      })
    },
    getCurrentUser() {
      const _this = this
      _this.menuIds = []
      getCurrentUser().then(res => {
        res.menus.forEach(function(data, index) {
          let add = true
          for (let i = 0; i < res.menus.length; i++) {
            if (data.id === res.menus[i].pid) {
              add = false
              break
            }
          }
          if (add) {
            _this.menuIds.push(data.id)
          }
        })
        console.log(_this.menuIds)
      })
    },
    saveMenu() {
      this.menuLoading = true
      const user = { id: this.currentId, menus: [] }
      // 得到半选的父节点数据，保存起来
      this.$refs.menu.getHalfCheckedNodes().forEach(function(data, index) {
        const menu = { id: data.id }
        user.menus.push(menu)
      })
      // 得到已选中的 key 值
      this.$refs.menu.getCheckedKeys().forEach(function(data, index) {
        const menu = { id: data }
        user.menus.push(menu)
      })
      updateMenu(user).then(res => {
        this.$notify({
          title: '保存成功',
          type: 'success',
          duration: 2500
        })
        this.menuLoading = false
        this.$parent.getCurrentUser()
      }).catch(err => {
        this.menuLoading = false
        console.log(err.response.data.message)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
