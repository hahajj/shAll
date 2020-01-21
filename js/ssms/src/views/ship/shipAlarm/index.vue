<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <el-row :gutter="20" style="margin: 20px">
        <el-col :xs="7" :sm="6" :md="4" :lg="4" :xl="4">
          <el-select v-model="shipId" placeholder="请选择船舶" size="mini">
            <el-option
              v-for="item in shipData"
              :key="item.shipId"
              :label="item.name"
              :value="item.shipId"/>
          </el-select>
        </el-col>
        <el-col :xs="7" :sm="6" :md="4" :lg="4" :xl="4">
          <el-select v-model="status" placeholder="状态" >
            <el-option
              v-for="item in statusData"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-col>
        <el-col :xs="7" :sm="6" :md="4" :lg="4" :xl="4">
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      id="shipDeit"
      :data="data"
      highlight-current-row
      size="small"
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column type="index" width="50"/>
      <el-table-column prop="ship.name" label="船名"/>
      <el-table-column prop="createdDate" label="报警时间" sortable="custom">
        <template slot-scope="scope">
          {{ parseTime(scope.row.createdDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="alarmType" label="报警类型 "/>
      <el-table-column prop="ship.devices[0].deviceNo" label="终端编号"/>
      <el-table-column prop="position" label="定位信息">
        <template slot-scope="scope">
          {{ '经度：'+scope.row.lat.toFixed(3)+',纬度：'+scope.row.lng.toFixed(3) }}
        </template>
      </el-table-column>

      <el-table-column prop="alarmMsg" label="告警信息"/>

      <el-table-column prop="status" label="状态" >
        <template slot-scope="scope">
          {{ scope.row.status=='PROCESSED'?'已处理':'未处理' }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkPermission(['ADMIN','SHIP_ALL','SHIP_EDIT','SHIP_DELETE'])"
        label="操作"
        width="250px"
        align="center">
        <template slot-scope="scope">
          <el-button
            v-permission="['ADMIN','SHIP_ALL','SHIP_EDIT']"
            :disabled="scope.row.status=='PROCESSED'"
            size="mini"
            type="primary"
            @click="editRow(scope.row)">
            {{ scope.row.status=='PROCESSED'?'已处理':'未处理' }}
          </el-button>

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
import { operateShipStatus, getShip } from '@/api/ship'
import { parseTime, parseTimeNoMin, formatJson } from '@/utils/index'
import { editShipAlarm } from '@/api/shipAlarm'

export default {
  mixins: [initData],
  data: function() {
    return {
      shipId: '',
      shipData: [], status: '',
      statusData: [{ label: '已处理', value: 'PROCESSED' }, { label: '未处理', value: 'USE' }],
      sort: 'createdDate,desc', // 默认排序
      delLoading: false,
      downloadLoading: false
    }
  },
  created() {
    getShip().then(res => {
      this.shipData = res
    })

    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    parseTimeNoMin,
    formatJson,
    operateShipStatus,
    beforeInit() {
      const sort = this.sort
      this.url = 'api/shipAlarm'
      this.params = { page: this.page, size: this.size, sort: this.sort }
      if (this.shipId) {
        this.params['ship'] = this.shipId
      }
      if (this.status) {
        this.params['status'] = this.status
      }

      return true
    },
    sortChange(column, prop, order) {
      console.log(column)
      if (column.prop == null || column.order == null) {
        this.queryData.prop = ''
        this.queryData.order = ''
      } else {
        if (column.order === 'ascending') {
          this.sort = column.prop + ',asc'
        } else {
          this.sort = column.prop + ',desc'
        }
      }
      this.init()
    },
    editRow(row) {
      if (row.status === 'PROCESSED') {
        return false
      } else {
        editShipAlarm({ shipAlarmId: row.shipAlarmId, status: 'PROCESSED' }).then(res => {
            this.init()
            this.$notify({
              title: '修改成功',
              type: 'success',
              duration: 2500
            })
          })
      }
    }
  }
}
</script>

<style scoped>
#shipDeit .el-button{
  margin: 0 !important;
}
</style>
