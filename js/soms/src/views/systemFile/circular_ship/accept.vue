<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-cascader
        v-model="query.circularType"
        :show-all-levels="false"
        :options="circularTypes"
        clearable
        placeholder="基本参数类型"
        class="filter-item"
        @change="changeCircularType(query.circularType)"
      />
      <!--<treeselect-->
      <!--v-model="query.organizationId"-->
      <!--:options="landOrganizations"-->
      <!--style="width: 200px;"-->
      <!--class="filter-item"-->
      <!--placeholder="请选择发送部门"-->
      <!--@change="toQuery"-->
      <!--/>-->
      <el-input
        v-model="query.title"
        clearable
        placeholder="发布主题搜索"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="toQuery"
      />
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="toQuery"
      >搜索</el-button>

      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','S2LCIRCULAR_ALL','S2LCIRCULAR_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add"
        >新增</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" />
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column type="index" min-width="16%" label="序号" />
      <el-table-column prop="circularType.circularTypeName" label="基本参数类别" />
      <el-table-column prop="createdDate" label="操作时间" sortable="custom">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="senderOrganizationParty.name" label="发送人" />
      <el-table-column prop="senderOrganizationParty.organization.name" label="发送部门" />
      <el-table-column prop="title" label="主题" />
      <el-table-column label="详情" width="150px" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-view"
            @click="viewDetail(scope.row)"
          />
          <el-button v-permission="['ADMIN','S2LCIRCULAR_ALL','S2LCIRCULAR_DELETE']" slot="reference" type="danger" icon="el-icon-delete" size="mini" @click="open(scope.row)"/>
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
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import { getPartysByNameOrCode } from '@/api/party'
import { getOrganizationByCriteria } from '@/api/organization'
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del } from '@/api/s2lCircular'
import { parseTime } from '@/utils/index'
import eForm from './acceptform'
import { getCircularType } from '@/api/circularType'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      sort: 'createdDate,desc', // 默认排序
      partys: [],
      shipOrganizations: [],
      landOrganizations: {},
      delLoading: false,
      circularTypes: [],
      activeName: 'send'
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    // this.getPartys()
    getCircularType().then(res => {
      this.circularTypes = res.content
    })

    this.getOrganizations()
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
        this.subDelete(data.circularId)
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
    },
    changeCircularType(v) {
      if (v.length > 1) {
        this.query.circularType.shift()
      }
      this.toQuery()
    },
    beforeInit() {
      this.url = 'api/s2lCircular'
      const sort = this.sort
      this.params = { page: this.page, size: this.size, sort: sort, organizationId: this.$store.state.user.user.partyDTO.organization.organizationId }
      const query = this.query
      const circularType = query.circularType
      const organizationId = query.organizationId
      const title = query.title
      if (title) {
        this.params['title'] = title
      }
      if (circularType) {
        this.params['circularType'] = circularType[0]
      }
      if (organizationId) {
        this.params['organizationId'] = organizationId
      }
      return true
    },
    // 部门数据点击事件
    getOrganizations() {
      // TODO 登陆员工所在部门类型

      getOrganizationByCriteria({ organizationType: 'SHIP_DEPT' }).then(res => {
        this.shipOrganizations = res
      })
      // getOrganizationByCriteria({ organizationType: 'LAND_DEPT' }).then(res => {
      //   this.landOrganizations = res
      // })
    },
    getPartys(para) {
      if (!para) {
        para = ''
      }
      getPartysByNameOrCode(para)
        .then(res => {
          this.partys = res
        })
        .catch(err => {
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
    },
    sortChange(column, prop, order) {
      if (column.prop == null || column.order == null) {
        this.queryData.prop = ''
        this.queryData.order = ''
      } else {
        if (column.order === 'ascending') this.sort = column.prop + ',asc'
        else this.sort = column.prop + ',desc'
      }
      this.init()
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
      this.$refs.form.circularTypes = this.circularTypes
      this.$refs.form.shipOrganizations = this.shipOrganizations
    },
    subDelete(partyId) {
      this.delLoading = true
      del(partyId).then(res => {
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
    viewDetail(data) {
      this.isAdd = false
      const recevieList = data.s2lCircularReceive[0].confirm
      const _this = this.$refs.form
      _this.recevieList = recevieList,
      _this.shipOrganizations = this.shipOrganizations,
      _this.form = {
        circularId: data.circularId,
        circularType: data.circularType,
        circularTypeName: data.circularType.circularTypeName,
        contents: data.contents,
        title: data.title,

        createdDate: data.createdDate,
        createdBy: data.createdBy,
        lastModifiedDate: data.lastModifiedDate,
        lastModifiedBy: data.lastModifiedBy,
        senderPartyId: data.senderPartyId
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>
</style>

