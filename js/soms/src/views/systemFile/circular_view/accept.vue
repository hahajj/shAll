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
      <el-select
        v-model="query.organizationId"
        :remote-method="remoteMethod"
        filterable
        remote
        placeholder="船舶"
        clearable
        class="filter-item"
        style="width: 200px"
        @change="toQuery"
      >
        <el-option
          v-for="(item, index) in shipOrganizations"
          :key="item.name + index"
          :label="item.label"
          :value="item.organizationId"
        />
      </el-select>
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
import { del, get, add } from '@/api/s2lCircular'
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
    changeCircularType(v) {
      if (v.length > 1) {
        this.query.circularType.shift()
      }
      this.toQuery()
    },
    beforeInit() {
      this.url = 'api/s2lCircular'
      const sort = this.sort
      this.params = { page: this.page, size: this.size, sort: sort }
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
      this.$refs.form.recevieList = []
    },
    viewDetail(data) {
      const recevieList = []
      // data.circularReceives.forEach(item => {
      //   recevieList.push(item.receiveOrganizationId)
      // })

      this.isAdd = false
      const _this = this.$refs.form
      _this.shipOrganizations = this.shipOrganizations,
      _this.form = {
        circularId: data.circularId,
        circularType: data.circularType,
        circularTypeName: data.circularType.circularTypeName,
        contents: data.contents,
        title: data.title,
        recevieList: recevieList,

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

