<template>
  <div class="app-container">
    <div class="head-container" style="padding-bottom: 0"/>
    <el-row>
      <el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="3" style="padding-top: 20px;">
        <div style="height: 330px;">
          <span style="margin: 20px 20px;color: rgb(24, 144, 255);font-weight: 500;">我的船队</span>
          <!--v-if="treeFlash"-->
          <el-tree

            ref="menu"
            :data="markerOptions"
            :props="defaultProps"
            :default-checked-keys="defaultList"
            :render-content="renderContent"
            disabled="true"
            default-expand-all
            style="margin-top: 12px;max-height: 300px;overflow-y: auto"
            show-checkbox
            node-key="id"
            @check="changeMarker"/>
        </div>
        <shipAlarm/>
      </el-col>
      <el-col :xs="24" :sm="24" :md="20" :lg="20" :xl="21" style="padding-top: 20px;">
        <div style="position: relative">
          <el-main
            v-loading="loading"
            element-loading-text="正在为您读取数据，请稍后"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)">
            <div style="position: absolute;right: 15%; z-index: 9999;top: 6%;">
              <span style="line-height: 1;font-size: 14px;display: inline-block;color: #303133">电子围栏</span>
              <el-switch
                v-model="electronicFence"
                active-color="#13ce66"
                inactive-color="#ff4949"
                style="margin-right: 10px" />
              <el-switch
                v-model="mapType"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="BMAP_NORMAL_MAP"
                inactive-value="BMAP_HYBRID_MAP"
                active-text="行政地图"
                inactive-text="卫星图"
                @change="changeMapType(mapType)"
              />
            </div>

            <baidu-map
              :style="{width:map.width,height:map.height}"
              :zoom="map.zoom"
              :center="{lng: map.center.lng, lat: map.center.lat}"
              :scroll-wheel-zoom="zoomFlag"
              :map-type="mapType"
              :min-zoom="3"
              :max-zoom="19"
              class="map"
              @zoomstart="changZoom"
              @ready="handler"
            >
              <!--比例尺控件-->
              <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"/>
              <!--缩放控件-->
              <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT"/>
              <div v-if="!track&&treeFlash">
                <bm-marker
                  v-for="(item,index) in markerOption"
                  v-if="!item.disabled"
                  :key="index"
                  :position="{ lng: item.lng, lat: item.lat }"
                  :dragging="false"
                  :icon="item.lng&&item.lat?shipIcon:shipIconDel"
                  @click="infoWindow(item)">
                  <bm-label
                    v-if="item.lng"
                    :label-style="{color: '#fff', fontSize : '12px',background:(item.status === 'USE' || item.status === 'MOVE') ? '#33cc66' : item.status === 'OFFLINE' ? '#949494' : item.status === 'STOP' ? '#5694e7' :'#ff6600',border:'0px'}"
                    :offset="{width: 0, height: 30}"
                    :content="item.name"/>
                  <bm-info-window
                    :position="{lng: item.lng, lat: item.lat}"
                    :show="item.show"
                    @close="infoWindowClose(item)"
                  >
                    <!--@close="infoWindowClose(item)"-->
                    <!--@open="infoWindowOpen(item)"-->
                    <el-tabs
                      id="shipCard"
                      v-model="activeName"
                      type="card"
                      style="font-size: 14px;width: 240px"
                      @tab-click="handleClick">
                      <el-tab-pane label="船舶信息" name="first">
                        <p>船名:{{ item.name }}</p>
                        <p>船级: {{ item.shipClass }}</p>
                        <p>船舶类型: {{ item.shipType.shipTypeName }}</p>
                        <!--<p>位置: </p>-->
                        <p>时速: {{ item.devices.length>0?item.devices[0].speed?item.devices[0].speed+'节':'':'' }}</p>
                        <!--<p>方位：</p>-->
                        <p>参考载货量:{{ item.refLoading?item.refLoading+'吨':'' }}</p>
                        <p>上次上报时间:{{ item.devices.length>0? parseTime(item.devices[0].deviceReportTime):'' }}</p>

                        <p style="font-size: 18px;color: #1890ff;">经纬度地址</p>
                        <p>经度：{{ item.lng }}</p>
                        <p>纬度：{{ item.lat }}</p>
                        <el-button type="success" style="float: right" @click="trackButton=true;checkedDeviceId=item.deviceId">轨迹查询</el-button>
                      </el-tab-pane>
                      <el-tab-pane label="终端信息" name="second">
                        <div v-if="item.devices.length>0">
                          <p>设备编号: {{ item.devices[0].deviceNo }}</p>
                          <p>通道数: 8</p>
                          <p>软件版本: {{ item.devices[0].softwareVer }}</p>
                          <p>视频码流: {{ item.devices[0].videoStreamType=='hd'?'高清':'标清' }}</p>
                          <p>时速: {{ item.devices[0].speed?item.devices[0].speed+'节':'' }}</p>
                          <p>定位上传间隔: {{ item.devices[0].positionInterval?item.devices[0].positionInterval+'秒':'' }}</p>
                          <el-button type="success" style="float: right" @click="LinkTo(item.shipId,item.name)">视频监管</el-button>
                        </div>
                        <span v-else>未绑定设备！</span>

                      </el-tab-pane>
                    </el-tabs>
                  </bm-info-window>
                </bm-marker>
              </div>
              <!--商标-->
              <bm-copyright
                :copyright="[{id: 1, content: '', bounds: {ne: {lng: 110, lat: 40}, sw:{lng: 0, lat: 0}}}, {id: 2, content: '<a>©盛航海运</a>'}]"
                anchor="BMAP_ANCHOR_TOP_RIGHT"/>
              <!--围栏-->
              <div id="shipmapstatus_span" style="position: absolute;z-index: 9999;left: 10%;bottom: 6%;">
                <div style="width: 45px;float: left;margin-right: 15px" >
                  <span class="statusSpanShip" style="background:#33cc66;    float: left;"/>
                  <span style="display: inline-block;    float: right;font-size: 12px">在线</span>
                </div>
                <div style="width: 45px;float: left;margin-right: 15px" >
                  <span class="statusSpanShip" style="background:#5694e7;    float: left;"/>
                  <span style="display: inline-block;    float: right;font-size: 12px">停靠</span>
                </div>
                <div style="width: 45px;float: left;margin-right: 15px" >
                  <span class="statusSpanShip" style="float: left;"/>
                  <span style="display: inline-block;    float: right;font-size: 12px">告警</span>
                </div>
                <div style="width: 45px;float: left;margin-right: 15px" >
                  <span class="statusSpanShip" style="background:#949494;    float: left;"/>
                  <span style="display: inline-block;    float: right;font-size: 12px">离线</span>
                </div>

              </div>
              <div v-if="electronicFence">
                <bm-polygon :path="polygonPath" :stroke-opacity="0.5" :stroke-weight="2" :editing="true" :fill-opacity="0.7" stroke-color="blue" @lineupdate="updatePolygonPath" @mouseover="mouseoverPath"/>
              </div>
              <div v-if="track">
                <!--:landmark-pois="landmarkPois"-->
                <!--<bml-lushu-->
                <!--:path="polylinePath"-->
                <!--:icon="icon"-->
                <!--:speed="speed"-->
                <!--:play="play"-->
                <!--@start="reset"-->
                <!--@stop="resets"-->
                <!--@pause="resetsss"-->
                <!--/>-->
                <!--:play="track"-->
                <span v-for="(item,index) in markers" :key="index">
                  <bm-marker :position="{ lng: item.lng, lat: item.lat }" :dragging="false" :offset="{width: 3, height: 4}" :icon="{ url: remoteJsUrl + 'static/template/标注.png', size: { width: 20, height: 36 }}">
                    <bm-label
                      :label-style="{color: 'red', fontSize : '8px',background:'#fff',border:'0px'}"
                      :offset="{width: 15, height: 0}"
                      :content="item.time"/>
                  </bm-marker>
                </span>
                <bm-polyline
                  :auto-view="true"
                  :path="polylinePath"
                  :stroke-opacity="0.5"
                  :stroke-weight="4"
                  :editing="false"
                  :mass-clear="false"
                  stroke-style="dashed  "
                  stroke-color="#18a45b"/>
                <bm-marker :position="polylinePath[polylinePath.length-1]" :dragging="false" :icon="lineIcon('start')" :offset="{width: 3, height: -20}" />
                <bm-marker :position="polylinePath[0]" :dragging="false" :icon="lineIcon('end')" :offset="{width: 3, height: -20}" />
              </div>
              <bm-control style="position: absolute;left: 20px !important;top: 20px !important;">
                <div v-if="trackButton" >
                  <el-date-picker
                    v-model="queryDate"
                    :picker-options="pickerOptions"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    mini="mini"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="showLineFun()"/>
                  <!--<el-button type="success" @click="showLineFun()">查询</el-button>-->
                  <el-button type="warning" @click="goback()">关闭轨迹</el-button>
                </div>
              </bm-control>
              <div v-if="electronicFence" style="position: absolute;right: 20px !important;top: 15% !important;width: 30%;opacity: 0.8;min-width: 410px">
                <el-card class="box-card" style="float: right;width: 100%">
                  <div slot="header" class="clearfix">
                    <span>电子围栏设置</span>
                  </div>
                  <el-form ref="form" size="small" label-width="80px" >
                    <el-row>
                      <div v-for="(item,index) in polygonPath" :key="index">
                        <el-col :span="12">
                          <el-form-item :label="labelName(index,1)" >
                            <el-input v-model="item.lng" type="number" placeholder="请输入内容" style="min-width: 100px"/>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item :label="labelName(index,2)" >
                            <el-input v-model="item.lat" type="number" placeholder="请输入内容" style="min-width: 100px"/>
                          </el-form-item>
                        </el-col>
                      </div>
                    </el-row>
                  </el-form>
                  <el-button v-loading="loading" type="success" style="float: right;margin-bottom: 10px;" @click="addShipFence()">保存</el-button>
                </el-card>
              </div>
            </baidu-map>
          </el-main>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { get } from '@/api/deviceLocation'
import { getShip, getFence, addFence, updateFence } from '@/api/ship'
import { parseTime } from '@/utils/index'
import { BmlLushu } from 'vue-baidu-map'
import shipAlarm from '@/views/ship/shipAlarm/shipAlarm'

const remoteJsUrl = process.env.NODE_ENV === 'production' ? '/ssms/' : '../../'// 静态资源地址
export default {
  name: 'Map',
  components: { BmlLushu, shipAlarm },
  data() {
    return {
      treeFlash: true, //  双向绑定真的很垃圾
      data: [], // 备用字段
      path: [], // 备用字段
      lushuPlay: true, // 路书开关 貌似被删除了
      speed: 4000, // 路书速度 貌似被删除了
      play: false, // 路书运动开关 貌似被删除了
      landmarkPois: [], // 貌似被删除了

      /* 静态资源*/
      remoteJsUrl: remoteJsUrl, // 静态资源地址

      /* 地图基本设置*/
      mapType: 'BMAP_NORMAL_MAP', // 地图类型 默认常规
      defaultMapCenter: { lng: 113.41, lat: 30 }, // 地图中心点默认
      map: { center: { lng: 113.41, lat: 30 }, width: '100%', height: '700px', zoom: 7 }, // 地图默认属性
      zoomFlag: true, // 允许滚轮 缩放层级

      /* 船队信息*/
      shipIcon: { url: remoteJsUrl + 'static/template/3D船_32.png', size: { width: 32, height: 32 }}, // 基础船图标
      shipIconDel: { url: remoteJsUrl + 'static/template/3D船_32.png', size: { width: 0, height: 0 }}, // 基础船图标 Del
      markerOptions: [
        // { id: 1, lng: 105.41, lat: 30, name: '南炼1', show: false }
      ], // 船队 默认集合
      markerOption: [], // 地图船位置坐标集合
      organizationId: '', // 船队组织id
      defaultProps: {
        label: 'name',
        disabled: 'disabled',
        text: 'status'
      }, // 船队tree 默认设置
      defaultList: [], // 船队默认选中id集合

      /* 电子围栏*/
      electronicFence: false, // 电子围栏开关
      basePolygonPath: [
        { lng: 109.412732, lat: 27 },
        { lng: 116.403461, lat: 27 },
        { lng: 116.403461, lat: 35 },
        { lng: 109.39455, lat: 35 }
      ], // 电子围栏 默认值
      polygonPath: [{ lng: 109.412732, lat: 27 },
        { lng: 116.403461, lat: 27 },
        { lng: 116.403461, lat: 35 },
        { lng: 109.39455, lat: 35 }], // 电子围栏
      fenceId: '', // 电子围栏id

      /* 路线及打点*/
      polylinePath: [], // 路线集合
      basePolylinePath: [], // 路线数据 未处理基本数据
      spaceBetween: '', // 间距/天
      checkedDeviceId: '', // 选择的船 设备id 做查询
      markers: [], // 路线 打点集合
      icon: {
        url: remoteJsUrl + 'static/template/定位.png',
        size: { width: 52, height: 26 },
        opts: { anchor: { width: 27, height: 13 }}
      }, // 路线图标属性

      loading: false, // 加载模态框总开关
      activeName: 'first', // 船舶详情 activeName默认
      track: false, // 路线查询开关
      trackButton: false, // 路线查询按钮开关

      /* 查询日期*/
      queryDate: '', // 查询日期
      pickerOptions: {
        shortcuts: [{
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }],
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24 * 30 || time.getTime() > Date.now()
        }
      }// 日期规则
    }
  },
  watch: {
    electronicFence(val, oldval) {
      if (val) {
        this.map.center.lng = (this.polygonPath[0].lng + this.polygonPath[2].lng) / 2
        this.map.center.lat = (this.polygonPath[0].lat + this.polygonPath[2].lat) / 2
      }
    },
    // 监测电子围栏变动
    polygonPath(val, oldval) {
      var flag = []
      var arr1 = val.map(JSON.stringify)
      var arr2 = oldval.map(JSON.stringify)
      // 对比新旧对象 获取不同的index
      arr1.concat(arr2).filter(function(v, i, arr) {
        if (arr.indexOf(v) === arr.lastIndexOf(v)) {
          flag.push(i)
        }
        return arr.indexOf(v) === arr.lastIndexOf(v)
      }).map(JSON.parse)
      this.changeFlag(flag[0])
    }
  },
  created() {
    // 超管不限制轨迹查询日期
    if (this.$store.state.user.user.roles[0] === 'ADMIN') {
      this.pickerOptions.disabledDate = null
    }
    this.loading = true
    // 船 和围栏数据 调取及处理
    getShip().then(res => {
      this.markerOptions = res.map((item, index) => {
        item.show = false
        item.disabled = item.devices.length === 0 || (item.devices.length > 0 && item.devices[0].status === 'DISABLE')
        // item.disabled = item.devices.length>0&&item.devices[0].status  === 'OFFLINE' || (item.devices.length > 0 && (item.devices[0].status === 'DISABLE' || item.devices[0].status === 'OFFLINE'))
        if (item.devices[0] && item.devices[0].xy) {
          item.lng = item.devices[0].xy.split(',')[0]
          item.lat = item.devices[0].xy.split(',')[1]
          if (index === 0) {
            this.defaultMapCenter = { lng: item.lng, lat: item.lat }
          }
          item.deviceId = item.devices[0].deviceId
        }
        item.id = item.shipId
        this.defaultList.push(item.id)
        return item
      })
      this.map.center = JSON.parse(JSON.stringify(this.defaultMapCenter))
      this.markerOption = JSON.parse(JSON.stringify(this.markerOptions))
      return res
    }, err => {
      this.loading = false
      this.$notify({
        title: '网络故障',
        message: '网络故障',
        type: 'warning'
      })
    }).then(res => {
      // 查询电子围栏
      this.organizationId = res[0].organizationId
      this.polygonPath = this.basePolygonPath
      getFence({ organizationId: res[0].organizationId }).then(res => {
        if (!!res.content && res.content.length > 0) {
          const row = res.content[0]
          this.fenceId = row.fenceId
          this.polygonPath = [
            { lng: row.butLeftLng, lat: row.butLeftLat },
            { lng: row.butRightLng, lat: row.butRightLat },
            { lng: row.topRightLng, lat: row.topRightLat },
            { lng: row.topLeftLng, lat: row.topLeftLat }
          ]
        } else {
          this.polygonPath = JSON.parse(JSON.stringify(this.basePolygonPath))
        }
        this.loading = false
      }, err => {
        this.loading = false
        this.$notify({
          title: '网络故障',
          message: '网络故障',
          type: 'warning'
        })
        throw new Error(err)
      })
    })
  },
  methods: {
    parseTime,
    renderContent(h, { node, data, store }) {
      console.log(data)
      const flag = data.devices.length > 0 ? (data.devices[0].status === 'USE') : false
      return (
        <span class='custom-tree-node' style='width: 120px;font-size:14px'>
          <span>{node.label}</span>
          {
            (!flag) ? (<span class='statusSpanShip' style='background:#949494'></span>) : (data.deviceStatus === 'USE' || data.deviceStatus === 'MOVE') ? (<span class='statusSpanShip' style='background:#33cc66'></span>) : data.deviceStatus === 'STOP' ? (<span class='statusSpanShip' style='background:#5694e7'></span>) : (<span class='statusSpanShip' style='background:#33cc66' ></span>)

          }
        </span>
      )
    },
    LinkTo(id, name) {
      this.$router.push({ path: 'videoRegulation/index', query: { id: id, name: name }})
    },
    // 更改船图标
    changeMapType(type) {
      // console.log((type === 'BMAP_NORMAL_MAP'))
      if (type === 'BMAP_NORMAL_MAP') {
        this.shipIcon.url = remoteJsUrl + 'static/template/3D船_32.png' // 基础船图标
      } else {
        this.shipIcon.url = remoteJsUrl + 'static/template/3D船_32_1.png' // 基础船图标
      }
    },
    // 新增fence
    addShipFence: function() {
      const Obj = {
        butLeftLng: this.polygonPath[0].lng,
        butLeftLat: this.polygonPath[0].lat,
        butRightLng: this.polygonPath[1].lng,
        butRightLat: this.polygonPath[1].lat,
        topRightLng: this.polygonPath[2].lng,
        topRightLat: this.polygonPath[2].lat,
        topLeftLng: this.polygonPath[3].lng,
        topLeftLat: this.polygonPath[3].lat,
        organizationId: this.organizationId,
        status: 'USE'
      }
      if (this.fenceId) { // 判断该阻止是否有电子围栏 有改无增
        Obj.fenceId = this.fenceId
        updateFence(Obj).then(res => {
          this.$notify({
            title: '成功',
            message: '成功',
            type: 'success'
          })
        }, err => {
          this.$notify({
            title: '网络故障',
            message: '网络故障',
            type: 'warning'
          })
        })
      } else {
        addFence(Obj).then(res => {
          this.$notify({
            title: '成功',
            message: '成功',
            type: 'success'
          })
        }, err => {
          this.$notify({
            title: '网络故障',
            message: '网络故障',
            type: 'warning'
          })
        })
      }
    },
    // 确保电子围栏是矩形
    changeFlag(type) {
      // 0123 分别代表左下 右下 右上 左上
      if (type === 0) {
        this.polygonPath[1].lat = this.polygonPath[0].lat
        this.polygonPath[3].lng = this.polygonPath[0].lng
      } else if (type === 1) {
        this.polygonPath[2].lng = this.polygonPath[1].lng
        this.polygonPath[0].lat = this.polygonPath[1].lat
      } else if (type === 2) {
        this.polygonPath[1].lng = this.polygonPath[2].lng
        this.polygonPath[3].lat = this.polygonPath[2].lat
      } else if (type === 3) {
        this.polygonPath[0].lng = this.polygonPath[3].lng
        this.polygonPath[2].lat = this.polygonPath[3].lat
      }
    },
    // 监测鼠标是否移动至电子围栏  隐藏除四点外其他点
    mouseoverPath(e) {
      this.hidePathbox(e)
    },
    // 更改电子围栏四点
    updatePolygonPath(e) {
      // console.log(e)
      // 百度地图API 和baiduvueApi 有不兼容 相互影响    若两者都使用  请修改参数
      // na 为百度api 和baiduvueapi 一起引用时     只用baiduvue ia或to
      var arry = JSON.parse(JSON.stringify(e.target.to))
      this.polygonPath = arry.splice(0, 4)
      this.hidePathbox(e)
    },
    // 隐藏除四点外其他点
    hidePathbox(e) {
      // rc ba  为百度api 和baiduvueapi 一起引用时     只用baiduvue   oc  kH
      // console.log(e)
      e.target.oc.forEach((item, index) => {
        if (index % 2 === 1) {
          if (!item.kH.attributes[1].value.includes('display')) {
            item.kH.attributes[1].value = item.kH.attributes[1].value + 'display:none;'
          }
        }
      })
    },
    // 电子围栏key值
    labelName(x, y) {
      // y为经纬度 x0123 分别代表左下 右下 右上 左上
      var label = ''
      if (y === 1) {
        if (x === 0) {
          label += '左下'
        } else if (x === 1) {
          label += '右下'
        } else if (x === 2) {
          label += '右上'
        } else if (x === 3) {
          label += '左上'
        }
        label += '经度'
      } else {
        label += '纬度'
      }
      return label
    },
    // 轨迹移动 已弃用
    reset() {
      console.log(arguments, '开始')
      // this.play = true
    },
    resets() {
      console.log(arguments, '停止')
      // this.play = true
    },
    resetsss() {
      console.log(arguments, '暂停')
      // this.play = true
    },
    // 标注 已弃用
    cionMarker() {
      return { url: remoteJsUrl + 'static/template/标注.png', size: { width: 28, height: 36 }}
    },
    // 轨迹起终点图像
    lineIcon(type) {
      if (type === 'start') {
        return { url: remoteJsUrl + 'static/template/起点.png', size: { width: 28, height: 36 }}
      } else {
        return { url: remoteJsUrl + 'static/template/终点.png', size: { width: 28, height: 36 }}
      }
    },
    /**
     * 滚轮滚动控制  点数
     */
    changZoom() {
      if (!this.track) { // 不在轨迹查询阶段 不调用
        return false
      }
      var _this = this
      _this.zoomFlag = false// 阻止第二次缩放地图
      _this.loading = true
      const a = arguments[0]
      setTimeout(function() { // 必须定时器 否则无法刷新数据 ！！！
        var gap// 策略  层级<7 每天显示1；   层级==7 每天显示2 ；以此类推  层级最大10 gap==6 数据10分钟一条 显示每个小时数据
        if (a.target.Oa < 7) {
          gap = Math.floor(_this.basePolylinePath.length / 1 / _this.spaceBetween)
        } else if (a.target.Oa === 7) {
          gap = Math.floor(_this.basePolylinePath.length / 2 / _this.spaceBetween)
        } else if (a.target.Oa === 8) {
          gap = Math.floor(_this.basePolylinePath.length / 4 / _this.spaceBetween)
        } else if (a.target.Oa === 9) {
          gap = Math.floor(_this.basePolylinePath.length / 8 / _this.spaceBetween)
        } else if (a.target.Oa >= 10) {
          gap = 6
        }
        _this.markers = []// 重置打点
        _this.basePolylinePath.map((item, index) => {
          if (index % gap === 0) {
            _this.markers.push({ lng: item.positionXY.split(',')[0], lat: item.positionXY.split(',')[1], show: false, time: parseTime(item.timestamp) })
          }
        })
        _this.zoomFlag = true// 允许缩放地图
        _this.loading = false
      }, 1000)
    },
    // 展示轨迹
    showLineFun() {
      if (!this.queryDate || this.queryDate.length === 0) { // 不选时间 阻止
        this.$notify({
          title: '时间必选！',
          message: '时间必选！',
          type: 'warning'
        })
        return false
      }
      // this.lushuPlay = false
      this.loading = true
      // 天数
      this.spaceBetween = Math.floor((new Date(this.queryDate[1].substring(0, 19).replace(/-/g, '/')).getTime() - new Date(this.queryDate[0].substring(0, 19).replace(/-/g, '/')).getTime()) / 1000 / 60 / 60 / 24)
      get({
        endTime: this.queryDate[1],
        startTime: this.queryDate[0],
        deviceId: this.checkedDeviceId,
        timestamp: 'sort',
        size: 9999,
        sort: 'timestamp'
      }).then(res => {
        this.$nextTick(() => {
          this.markers = []
          const gap = Math.floor(res.length / 2 / this.spaceBetween)
          this.basePolylinePath = res
          const lines = res.map((item, index) => {
            if (index % gap === 0) {
              this.markers.push({ lng: item.positionXY.split(',')[0], lat: item.positionXY.split(',')[1], show: false, time: parseTime(item.timestamp) })
            }
            return { lng: item.positionXY.split(',')[0], lat: item.positionXY.split(',')[1] }
          })
          this.polylinePath = lines
          this.map.zoom = 7
          this.map.center = this.polylinePath[Math.round(this.polylinePath.length / 2)]// 选取中间节点为地图中心  有误差不准
        })
      }, err => {
        this.track = true
        this.loading = false
      }).then(res => {
        this.track = true
        this.loading = false
      })
    },
    // 初始化地图中心及其他操作
    goback() {
      this.map.center = this.defaultMapCenter
      this.map.zoom = 7
      this.trackButton = false, this.track = false
    },
    infoWindow(data) {
      if (data.show) {
        this.infoWindowClose(data)
      } else {
        this.infoWindowOpen(data)
      }
    },
    // 窗口开关
    infoWindowClose(data) {
      data.show = false
    },
    infoWindowOpen(data) {
      data.show = true
    },
    // 切换窗口数据
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    // 选中船队
    changeMarker() {
      this.treeFlash = false// 双向绑定真的很垃圾
      setTimeout(() => { // 双向绑定真的很垃圾
        this.markerOption = JSON.parse(JSON.stringify(arguments[1].checkedNodes))
        this.defaultList = JSON.parse(JSON.stringify(this.markerOption.map(item => {
          return item.id
        })))
        this.treeFlash = true
      }, 1)
    },
    // 查看修改地图实例参数
    handler({ BMap, map }) {
      // console.log(BMap, map)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  #shipCard {
    width: 240px !important;
  }
  #shipCard .el-range-editor.el-input__inner {
    width: 240px !important;
    &.el-range-input {
      width: 30% !important;
    }&.el-range-separator {
           width: 20% !important;
         }
  }
  /*#shipCard .el-range-input,.el-range-input {*/
    /*width: 30% !important;*/
  /*}*/
  /*#shipCard .el-range-separator {*/
    /*width: 20% !important;*/
  /*}*/

  /*#shipCard  .el-date-editor,#shipCard .el-range-input {*/
    /*width: 30% !important;*/
  /*}*/
</style>
<style>
  .statusSpanShip{
    border-radius: 6px;background: #ff6600;height: 12px;width: 12px;display: inline-block;float: right;
  }
  .active{
    background: yellow
  }
</style>
