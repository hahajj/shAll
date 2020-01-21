<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <el-row :gutter="20" style="margin: 20px">
        <el-col :xs="7" :sm="6" :md="4" :lg="4" :xl="4">
          <el-input v-model="deviceNo" clearable placeholder="输入设备编号" style="width: 100%;" class="filter-item"/>
        </el-col>
        <el-col :xs="7" :sm="6" :md="4" :lg="4" :xl="4">
          <el-select v-model="getShipId" placeholder="请选择船舶" size="mini">
            <el-option
              v-for="item in shipData"
              :key="item.shipId"
              :label="item.name"
              :value="item.shipId"/>
          </el-select>
        </el-col>
        <el-col :xs="7" :sm="6" :md="4" :lg="4" :xl="4">
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
        </el-col>
        <el-col :xs="7" :sm="6" :md="4" :lg="4" :xl="4">
          <el-button
            v-permission="['ADMIN','DEVICE_ALL','DEVICE_CREATE']"
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
      <el-table-column prop="deviceNo" label="设备编号"/>
      <el-table-column prop="shipName" label="关联船名"/>
      <el-table-column prop="channelAmount" label="通道数"/>
      <el-table-column prop="softwareVer" label="软件版本"/>
      <el-table-column prop="videoStreamType" label="视频码流"/>
      <el-table-column prop="positionInterval" label="定位间隔(S)"/>
      <el-table-column prop="status" label="状态" >
        <template slot-scope="scope">
          {{ scope.row.status=='USE'?'已启动':'已停用' }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkPermission(['ADMIN','DEVICE_ALL','DEVICE_EDIT','SHIP_DELETE'])&&!loading"
        label="操作"
        width="330px"
        align="center">
        <template slot-scope="scope">
          <el-button
            v-permission="['ADMIN','DEVICE_ALL','DEVICE_EDIT']"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="edit(scope.row)"/>
          <el-button
            v-permission="['ADMIN','DEVICE_ALL','DEVICE_EDIT']"
            :icon="scope.row.status=='USE'?'el-icon-video-pause':'el-icon-caret-right'"
            size="mini"
            type="primary"
            @click="changeStatus(scope.row.deviceId,scope.row.status)"/>
          <el-button v-permission="['ADMIN','DEVICE_ALL','DEVICE_DELETE']" :loading="delLoading" type="danger" size="mini" icon="el-icon-delete" @click="subDelete(scope.row.deviceId)"/>
          <el-popover
            placement="right"
            width="250"
            trigger="click"
            style="background: #f6f6f6">
            <el-row style="margin: 0px 20px">
              <el-col :span="24" style="color:#409eff;margin: 0 0 10px 0" ><span >关联船名</span></el-col>
              <el-col :span="12">
                <el-select v-model="shipId" placeholder="请选择" size="mini">
                  <el-option
                    v-for="item in shipData"
                    :key="item.shipId"
                    :label="item.name"
                    :value="item.shipId"/>
                </el-select>
              </el-col>
              <el-col :span="12" style="text-align: center" >
                <el-button type="success" size="mini" @click="changeShip(scope.row.deviceId,shipId)">确定</el-button>
              </el-col>
            </el-row>
            <!--v-permission="['ADMIN','DEVICE_ALL','DEVICE_EDIT']"-->
            <el-button
              v-if="scope.row.status=='USE'"
              slot="reference"
              size="mini"
              type="primary"
              @click="changeShipId(scope.row.shipId)">
              关联船名
            </el-button>
          </el-popover>

          <el-popover
            placement="right"
            width="250"
            trigger="click"
            style="background: #f6f6f6">

            <el-form ref="configData" :model="configData" :rules="configDataRules" size="small" label-width="80px">
              <el-col :span="24" style="color:#409eff;margin: 0 0 10px 0" ><span >下发配置</span></el-col>
              <el-row style="margin: 0px 0px 0px 0px">
                <el-col :span="24">
                  <el-form-item label="定位模式" >
                    <el-select v-model="configData.mode" placeholder="请选择" clearable size="mini">
                      <el-option
                        v-for="item in modeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="定位间隔" >
                    <el-input v-model="configData.positionInterval" type="number" min="1" />
                  </el-form-item>
                </el-col>
                <!--<el-col :span="24">-->
                <!--<el-form-item label="视频模式" prop="videoStreamType">-->
                <!--<el-select v-model="configData.videoStreamType" placeholder="请选择" size="mini">-->
                <!--<el-option-->
                <!--v-for="item in videoStreamTypeList"-->
                <!--:key="item.value"-->
                <!--:label="item.label"-->
                <!--:value="item.value"/>-->
                <!--</el-select>-->
                <!--</el-form-item>-->
                <!--</el-col>-->
                <el-col :span="24">
                  <el-form-item prop="softwareVer" label="版本升级">
                    <el-input v-model="configData.softwareVer" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="版本地址" >
                    <el-input v-model="configData.url"/>
                  </el-form-item>
                </el-col>
                <el-col :span="24" style="text-align: center" >
                  <el-button type="success" size="mini" style="float: right" @click="nextConfig(scope.row)">确定下发</el-button>
                </el-col>
              </el-row>

            </el-form>
            <el-button
              v-if="scope.row.status=='USE'"
              slot="reference"
              size="mini"
              type="success"
              @click="changeShipId(scope.row.shipId,scope.row)">
              下发配置
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
import { del, operateDeviceStatus } from '@/api/device'
import { getShip, updateShipDevice } from '@/api/ship'
import { parseTime, parseTimeNoMin, formatJson } from '@/utils/index'
import { validateURL } from '@/utils/validate'
import { changeDevicePosition, ship_update1 } from '@/api/get_ship_device'
import eForm from './form'
import { edit } from '@/api/device'

export default {
  components: { eForm },
  mixins: [initData],
  data() {
    const validVersion = (rule, value, callback) => {
      const reg = /^([1-9]\d|[1-9])(\.([1-9]\d|\d)){2}$/
      if (value && !reg.test(value)) {
        callback(new Error('正确的版本号为xx.xx.xx'))
      } else {
        callback()
      }
    }
    return {
      videoStreamTypeList: [
        { label: '高清', value: 'hd' }, { label: '标清', value: 'sd' }
      ],
      modeList: [
        { label: '北斗', value: '1' }, { label: 'gps', value: '2' }, { label: '混合模式', value: '3' }
      ],
      configData: {},
      getShipId: '',
      shipId: '',
      deviceNo: '',
      sort: 'deviceId', // 默认排序
      delLoading: false,
      shipData: [],
      downloadLoading: false,
      configDataRules: {
        softwareVer: [
          { required: false, trigger: 'blur', validator: validVersion }
        ]
      }

    }
  },
  created() {
    getShip({ size: 999 }).then(res => {
      if (res) {
        this.shipData = res
        this.$nextTick(() => {
          this.init()
        })
      }
    })
  },
  methods: {
    parseTime,
    checkPermission,
    parseTimeNoMin,
    formatJson,
    operateDeviceStatus,
    nextConfig(row) {
      this.$refs['configData'].validate((valid) => {
        if (!valid) {
          return false
        } else {
          // 下发版本
          if (this.configData.softwareVer || this.configData.url) {
            if (!this.configData.softwareVer || !this.configData.url) {
              this.$notify({
                title: '更新版本 版本号和版本地址必填！',
                type: 'warning',
                duration: 3000
              })
              return false
            }
            var newArry = this.configData.softwareVer.split('.')
            var oldArry = row.softwareVer.split('.')
            var newSoftwareVer = Number(newArry[0] * 10000) + Number(newArry[1] * 100) + Number(newArry[2] ? newArry[2] : 0)
            var oldSoftwareVer = Number(oldArry[0] * 10000) + Number(oldArry[1] * 100) + Number(oldArry[2] ? oldArry[2] : 0)

            if (Number(newSoftwareVer) <= Number(oldSoftwareVer)) {
              this.$notify({
                title: '版本号必须高于当前版本号！',
                type: 'warning',
                duration: 3000
              })
              return false
            } else {
              if (!validateURL(this.configData.url)) {
                this.$notify({
                  title: '地址格式错误！',
                  type: 'warning',
                  duration: 3000
                })
                return false
              }

              const fd = new FormData()
              fd.append('csrfmiddlewaretoken', 'EFifz8BBU3D6HzgCljSvWbgOKZTIWlKJvCyIEBoIlg0UEQ4CVJPMpS5dzi1C776T')
              fd.append('sn', row.deviceNo)
              fd.append('packageUrl', this.configData.url)
              try {
                ship_update1(fd).then(res => {
                  this.$notify({
                    title: '版本下发成功',
                    type: 'success',
                    duration: 2500
                  })
                  return this.configData.softwareVer
                }).then(data => {
                  // 完成之后修改本地
                  edit({ deviceId: row.deviceId, softwareVer: this.configData.softwareVer }).then(res => {
                    this.init()
                  }).catch(err => {
                    console.log(err)
                  })
                })
              } catch (e) {
                this.$notify({
                  title: '版本下发失败',
                  type: 'warning',
                  duration: 2500
                })
              }
            }
          }

          // 下发定位模式
          if (this.configData.mode) {
            const fd = new FormData()
            fd.append('csrfmiddlewaretoken', 'EFifz8BBU3D6HzgCljSvWbgOKZTIWlKJvCyIEBoIlg0UEQ4CVJPMpS5dzi1C776T')
            fd.append('sn', row.deviceNo)
            fd.append('key', 'mode')
            fd.append('value', this.configData.mode)

            try {
              changeDevicePosition(fd).then(res => {
                this.$notify({
                  title: '定位模式下发成功',
                  type: 'success',
                  duration: 2500
                })
                this.init()
              })
            } catch (e) {
              this.$notify({
                title: '定位模式下发失败',
                type: 'warning',
                duration: 2500
              })
            }
          }

          // 下发位置
          if (this.configData.positionInterval && this.configData.positionInterval !== row.positionInterval) {
            const fd = new FormData()
            fd.append('csrfmiddlewaretoken', 'EFifz8BBU3D6HzgCljSvWbgOKZTIWlKJvCyIEBoIlg0UEQ4CVJPMpS5dzi1C776T')
            fd.append('sn', row.deviceNo)
            fd.append('key', 'timeInterval')
            fd.append('value', this.configData.positionInterval)

            try {
              changeDevicePosition(fd).then(res => {
                // 完成之后修改本地
                edit({ deviceId: row.deviceId, positionInterval: this.configData.positionInterval }).then(res => {
                  this.init()
                }).catch(err => {
                  console.log(err)
                })
                this.$notify({
                  title: '定位间隔下发成功',
                  type: 'success',
                  duration: 2500
                })
              })
            } catch (e) {
              this.$notify({
                title: '定位间隔下发失败',
                type: 'warning',
                duration: 2500
              })
            }
          }
        }
      })
    },
    changeStatus(id, status) {
      this.$confirm('此操作将更改设备状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        operateDeviceStatus({ deviceId: id, status: status === 'USE' ? 'DISABLE' : 'USE' }).then(
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
    changeShip(deviceId, shipId) {
      updateShipDevice({ deviceId: deviceId, shipId: this.shipId }).then(res => {
        this.$notify({
          title: '操作成功',
          type: 'success',
          duration: 2500
        })
        this.init()
      })
    },
    changeShipId(id, row) {
      this.shipId = id
      this.configData = {}
      this.configData = {
        positionInterval: row.positionInterval,
        softwareVer: row.softwareVer
      }
    },
    beforeInit() {
      const sort = this.sort
      this.url = 'api/device'
      this.params = { page: this.page, size: this.size }
      if (this.deviceNo) {
        this.params['deviceNo'] = this.deviceNo
      }
      if (this.getShipId) {
        this.params['shipId'] = this.getShipId
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
      this.$refs.form.channelAmount = 8
      this.$refs.deviceCrmeras = []
      for (var i = 0; i < 8; i++) {
        this.$refs.form.deviceCrmeras.push({ name: '' })
      }

      this.isAdd = true
      this.$refs.form.shipData = this.shipData
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      this.$refs.form.shipData = this.shipData
      data.deviceCrmeras.sort(function(p1, p2) {
        return p1.deviceCrmeraId - p2.deviceCrmeraId
      })
      _this.form = JSON.parse(JSON.stringify(data))
      console.log(_this.form)
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
