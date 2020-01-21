<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <el-row :gutter="20" style="margin: 20px">
        <el-col :xs="7" :sm="6" :md="4" :lg="4" :xl="4">
          <el-input v-model="name" clearable placeholder="输入船舶名称搜索" style="width: 100%;" class="filter-item"/>
        </el-col>
        <el-col :xs="7" :sm="6" :md="4" :lg="4" :xl="4">
          <el-select v-model="deviceId" placeholder="请选择设备" >
            <el-option
              v-for="item in deviceData"
              :key="item.deviceId"
              :label="item.deviceNo"
              :value="item.deviceId"/>
          </el-select>
          <!--<el-input v-model="name" clearable placeholder="输入船舶名称搜索" style="width: 100%;" class="filter-item"/>-->
        </el-col>
        <el-col :xs="7" :sm="6" :md="4" :lg="4" :xl="4">
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
        </el-col>
        <el-col :xs="4" :sm="6" :md="4" :lg="4" :xl="4">
          <el-button
            v-permission="['ADMIN','SHIP_ALL','SHIP_CREATE']"
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="add">新增
          </el-button>
        </el-col>
      </el-row>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
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
      <el-table-column prop="name" label="船名"/>
      <el-table-column prop="shipClass" label="船级"/>
      <el-table-column prop="shipType.shipTypeName" label="船类"/>
      <el-table-column prop="mmsi" label="mmsi"/>
      <el-table-column prop="length" label="总长(M)"/>
      <el-table-column prop="width" label="型宽(M)"/>
      <el-table-column prop="depth" label="型深(M)"/>
      <el-table-column prop="refLoading" label="参考载货量(吨)"/>
      <!--<el-table-column prop="code" label="关联设备编号"/>-->
      <el-table-column prop="status" label="状态" >
        <template slot-scope="scope">
          {{ (scope.row.status === 'USE'||scope.row.status === 'MOVE') ? '在线' : scope.row.status === 'OFFLINE' ? '离线' : scope.row.status === 'STOP' ? '停靠':'' }}
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
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="edit(scope.row)"/>
          <!--<el-button-->
          <!--v-permission="['ADMIN','SHIP_ALL','SHIP_EDIT']"-->
          <!--:icon="scope.row.status=='USE'?'el-icon-video-pause':'el-icon-caret-right'"-->
          <!--size="mini"-->
          <!--type="primary"-->
          <!--@click="changeStatus(scope.row.shipId,scope.row.status)"/>-->
          <el-button v-permission="['ADMIN','SHIP_ALL','SHIP_DELETE']" :loading="delLoading" type="danger" size="mini" icon="el-icon-delete" @click="subDelete(scope.row.shipId)"/>
          <el-popover
            placement="right"
            width="300"
            trigger="click"
            style="background: #f6f6f6">
            <el-row style="margin: 0px 20px">
              <el-col :span="24" style="color:#409eff;margin: 0 0 10px 0" ><span >关联设备</span></el-col>
              <el-col :span="16">
                <el-select v-model="devices" placeholder="请选择" >
                  <el-option
                    v-for="item in deviceData"
                    :key="item.deviceId"
                    :label="item.deviceNo"
                    :value="item.deviceId"/>
                </el-select>
              </el-col>
              <el-col :span="8" style="text-align: center" >
                <el-button type="success" size="mini" @click="changeDevice(scope.row.shipId,devices)">确定</el-button>
              </el-col>
            </el-row>
            <!--v-permission="['ADMIN','SHIP_ALL','SHIP_EDIT']"-->
            <el-button
              v-if="scope.row.status=='USE'"
              slot="reference"
              size="mini"
              type="primary"
              @click="changeDeviceId(scope.row.devices)">
              关联设备
            </el-button>
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
import initData from './initData'
import { del, updateShipDevice, operateShipStatus } from '@/api/ship'
import { get } from '@/api/device'
import { parseTime, parseTimeNoMin, formatJson } from '@/utils/index'
import eForm from './form'

export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      devices: [],
      name: '',
      deviceId: '',
      sort: 'deviceId', // 默认排序
      delLoading: false,
      deviceData: [],
      downloadLoading: false
    }
  },
  created() {
    get().then(res => {
      this.deviceData = res.content
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
    changeStatus(id, status) {
      this.$confirm('此操作将更改船舶状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        operateShipStatus({ shipId: id, status: status === 'USE' ? 'DISABLE' : 'USE' }).then(
          res => {
            this.$notify({
              title: '操作成功',
              type: 'success',
              duration: 2500
            })
            this.init()
          }).catch(err => {
          this.delLoading = false
          console.log(err.response.data.message)
        })
      }).catch(() => {
        this.delLoading = false
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    changeDevice(shipId, deviceList) {
      updateShipDevice({ deviceId: deviceList, shipId: shipId }).then(res => {
        this.$notify({
          title: '操作成功',
          type: 'success',
          duration: 2500
        })
        this.init()
      })
    },
    changeDeviceId(deviceList) {
      console.log(deviceList)
      this.devices = !deviceList || deviceList.length < 1 ? '' : deviceList[0].deviceId
    },
    beforeInit() {
      const sort = this.sort
      this.url = 'api/ship'
      this.params = { page: this.page, size: this.size }
      if (this.name) {
        this.params['name'] = this.name
      }
      if (this.deviceId) {
        this.params['deviceId'] = this.deviceId
      }

      return true
    },
    sortChange(column, prop, order) {
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
    subDelete(id) {
      this.delLoading = true
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
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
          console.log(err.response.data.message)
        })
      }).catch(() => {
        this.delLoading = false
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.deviceData = this.deviceData
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      data.shipTypeL = data.shipType.shipType
      const _this = this.$refs.form
      this.$refs.form.deviceData = this.deviceData
      _this.form = JSON.parse(JSON.stringify(data))
      // this.$refs.form.devicesList = JSON.parse(JSON.stringify(_this.form.devices.map(item => {
      //   return item.deviceId
      // })))
      this.$refs.form.devicesList = _this.form.devices[0] ? _this.form.devices[0].deviceId : ''
      _this.dialog = true
    }
  }
}
</script>

<style scoped>
#shipDeit .el-button{
  margin: 0 !important;
}
</style>
