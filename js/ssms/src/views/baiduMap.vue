<!--<template>-->
  <!--<div class="app-container">-->
    <!--<div class="head-container" style="padding-bottom: 0"/>-->
    <!--<el-row>-->
      <!--<el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="3" style="padding-top: 20px;">-->
        <!--<span style="margin: 20px 20px;color: rgb(24, 144, 255);font-weight: 500;">我的船队</span>-->
        <!--<el-tree-->
          <!--ref="menu"-->
          <!--:data="markerOptions"-->
          <!--:props="defaultProps"-->
          <!--:default-checked-keys="defaultList"-->
          <!--disabled="true"-->
          <!--default-expand-all-->
          <!--style="margin-top: 12px;"-->
          <!--show-checkbox-->
          <!--node-key="id"-->
          <!--@check="changeMarker"/>-->
      <!--</el-col>-->
      <!--<el-col :xs="24" :sm="24" :md="20" :lg="20" :xl="21" style="padding-top: 20px;">-->
        <!--<div id="allmap" :style="mapStyle"/>-->
      <!--</el-col>-->
    <!--</el-row>-->
  <!--</div>-->
<!--</template>-->
<!--<script type="text/javascript">-->
<!--import { get } from '@/api/deviceLocation'-->
<!--import { getShip } from '@/api/ship'-->
<!--export default{-->
  <!--props: {-->
    <!--mapHeight: {-->
      <!--type: Number,-->
      <!--default: 750-->
    <!--},-->
    <!--// 经度-->
    <!--longitude: {-->
      <!--type: Number,-->
      <!--default: 113.412732-->
    <!--},-->
    <!--latitude: {-->
      <!--type: Number,-->
      <!--default: 30-->
    <!--}-->
  <!--},-->
  <!--data() {-->
    <!--return {-->
      <!--lushu:'',-->
      <!--points: [],-->
      <!--mapStyle: {-->
        <!--width: '100%',-->
        <!--height: this.mapHeight + 'px'-->
      <!--},-->
      <!--path: [],-->
      <!--play: true,-->
      <!--icon: {-->
        <!--url: '../../static/template/定位.png',-->
        <!--size: { width: 52, height: 26 },-->
        <!--opts: { anchor: { width: 27, height: 13 }}-->
      <!--},-->
      <!--queryDate: '',-->
      <!--loading: false,-->
      <!--activeName: 'first',-->
      <!--track: false,-->
      <!--trackButton: false,-->
      <!--defaultProps: {-->
        <!--label: 'name',-->
        <!--disabled: 'disabled'-->
      <!--},-->
      <!--defaultList: [],-->
      <!--defaultMapCenter: { lng: 113.41, lat: 30 },-->
      <!--map: { center: { lng: 113.41, lat: 30 }, width: '100%', height: '700px', zoom: 7 },-->
      <!--markerOptions: [-->
        <!--{ id: 1, lng: 105.41, lat: 30, name: '南炼1', show: false },-->
        <!--{ id: 2, lng: 109.41, lat: 30, name: '南炼2', show: false },-->
        <!--{ id: 3, lng: 113.41, lat: 30, name: '南炼3', show: false },-->
        <!--{ id: 4, lng: 117.41, lat: 30, name: '南炼4', show: false },-->
        <!--{ id: 5, lng: 121.41, lat: 30, name: '南炼5', show: false }-->
      <!--],-->
      <!--polygonPath: [-->
        <!--{ lng: 113.412732, lat: 30 },-->
        <!--{ lng: 116.403461, lat: 30 },-->
        <!--{ lng: 116.403461, lat: 35 },-->
        <!--{ lng: 113.39455, lat: 35 }-->
      <!--],-->
      <!--polylinePath: [-->
      <!--],-->
      <!--markerOption: []-->
    <!--}-->
  <!--},-->
  <!--mounted() {-->
    <!--var _this = this-->
    <!--// 创建-->
    <!--_this.map = new BMap.Map('allmap', { enableMapClick: true })-->
    <!--// getShip().then(res => {-->
    <!--//   this.markerOptions = res.content.map(item => {-->
    <!--//     item.show = false-->
    <!--//     item.lng = Math.random() * 30 + 100-->
    <!--//     item.lat = Math.random() * 20 + 20-->
    <!--//     item.id = item.shipId-->
    <!--//     this.defaultList.push(item.id)-->
    <!--//     return item-->
    <!--//   })-->
    <!--// }).then(res => {-->
    <!--//   get({ endTime: '2019-11-20+00:00:00', startTime: '2019-11-19+00:00:00', deviceId: '2', size: 9999, sort: 'timestamp' }).then(res => {-->
    <!--//     this.points = res.map((item, index) => {-->
    <!--//       new BMap.Point(item.positionXY.split(',')[0], item.positionXY.split(',')[1])-->
    <!--//     })-->
    <!--//     return this.points-->
    <!--//   }).then(po => {-->
    <!--//     this.lineLushu()-->
    <!--//   })-->
    <!--// })-->
    <!--get({ endTime: '2019-11-20+00:00:00', startTime: '2019-11-19+00:00:00', deviceId: '2', size: 9999, sort: 'timestamp' }).then(res => {-->
      <!--this.points = res.map((item, index) => {-->
        <!--new BMap.Point(item.positionXY.split(',')[0], item.positionXY.split(',')[1])-->
      <!--})-->
      <!--return this.points-->
    <!--}).then(po => {-->
      <!--this.lineLushu()-->
    <!--})-->

    <!--this.markerOption = JSON.parse(JSON.stringify(this.markerOptions))-->
    <!--this.ready()-->
  <!--},-->
  <!--methods: {-->
    <!--ready() {-->
      <!--var _this = this-->
      <!--var point = new BMap.Point(this.longitude, this.latitude)-->
      <!--// var marker = new BMap.Marker(point)-->
      <!--// _this.map.addOverlay(marker)-->

      <!--// 船位-->
      <!--_this.markerOptions.forEach(item => {-->
        <!--const myIcon = new BMap.Icon('../../static/template/船.png', new BMap.Size(23, 25), {-->
          <!--anchor: new BMap.Size(10, 25)-->
        <!--})-->
        <!--const points = new BMap.Point(item.lng, item.lat)-->
        <!--const marker = new BMap.Marker(points)-->
        <!--// 创建标注对象并添加到地图-->
        <!--const opts = {-->
          <!--width: 200,-->
          <!--height: 50,-->
          <!--title: '地址：'-->
        <!--}-->
        <!--var html = []-->
        <!--html.push('<table cellspacing="0" style="table-layout:fixed;width:100%;font:12px arial,simsun,sans-serif"><tbody>')-->
        <!--html.push('<tr>')-->
        <!--html.push('<td style="vertical-align:top;line-height:16px;width:38px;white-space:nowrap;word-break:keep-all">地址:</td>')-->
        <!--html.push('<td style="vertical-align:top;line-height:16px">' + 11 + ' </td>')-->
        <!--html.push('</tr>')-->
        <!--html.push('</tbody></table>')-->
        <!--const infoWindow = new BMap.InfoWindow(html.join(''), opts)-->
        <!--marker.addEventListener('click', function() {-->
          <!--_this.map.openInfoWindow(infoWindow, points)-->
        <!--})-->
        <!--_this.map.enableScrollWheelZoom(true)-->
        <!--// _this.map.openInfoWindow(infoWindow, points)-->
        <!--// _this.map.addOverlay(marker, { icon: myIcon })-->
      <!--})-->

      <!--_this.map.centerAndZoom(point, 7)-->
      <!--_this.map.enableScrollWheelZoom(true)-->

      <!--// 航线-->
      <!--var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {-->
        <!--scale: 1, // 图标缩放大小-->
        <!--strokeColor: 'red', // 设置矢量图标的线填充颜色-->
        <!--strokeWeight: '2'// 设置线宽-->
      <!--})-->

      <!--// 设置折线样式符号显示-->
      <!--var iconSequence = new BMap.IconSequence(sy, '100%', '100', false)-->
      <!--setTimeout(function() {-->
        <!--var polyline = new BMap.Polyline([-->
          <!--new BMap.Point(113.412732, 30),-->
          <!--new BMap.Point(120.403461, 40),-->
          <!--new BMap.Point(120.403461, 30),-->
          <!--new BMap.Point(125, 30),-->
          <!--new BMap.Point(110, 30),-->
          <!--new BMap.Point(110, 40)-->
        <!--], {-->
          <!--enableEditing: false, // 是否启用线编辑，默认为false-->
          <!--enableClicking: true, // 是否响应点击事件，默认为true-->
          <!--icons: [iconSequence],-->
          <!--strokeWeight: '2', // 折线的宽度，以像素为单位-->
          <!--strokeOpacity: 0.8, // 折线的透明度，取值范围0 - 1-->
          <!--strokeColor: '#18a45b' // 折线颜色-->
        <!--})-->
        <!--// _this.map.addOverlay(polyline)-->
      <!--}, 200)-->
    <!--},-->
    <!--changeMarker() {-->
      <!--this.markerOption = JSON.parse(JSON.stringify(arguments[1].checkedNodes))-->
    <!--},-->
    <!--lineLushu() {-->
      <!--var point = new BMap.Point(116.43,23.43)-->
      <!--var _this = this-->
      <!--var polyline = new BMap.Polyline(_this.points)// 创建折线-->
      <!--var icon1 = new BMap.Icon('../../static/template/船.png', new BMap.Size(19, 25), { anchor: new BMap.Size(9, 25) })// 地点-->
      <!--var icon2 = new BMap.Icon('../../static/template/船.png', new BMap.Size(30, 30), { anchor: new BMap.Size(15, 15) })-->
      <!--var markers = [-->
        <!--_this.points[7], // 饶平站-->
        <!--_this.points[15], // 潮汕站-->
        <!--_this.points[23], // 潮阳站-->
        <!--_this.points[28], // 普宁站-->
        <!--_this.points[32]// 葵潭站-->
      <!--]-->
      <!--console.log(markers)-->
      <!--// 路书-->
      <!--_this.lushu = new BMapLib.LuShu(_this.map, _this.points, {-->
        <!--landmarkPois: [-->
          <!--// { lng: markers[0].lng, lat: markers[0].lat, html: '饶平站到了', pauseTime: 1 },-->
          <!--// { lng: markers[1].lng, lat: markers[1].lat, html: '<img src="../../static/template/船.png" />潮汕站到了', pauseTime: 2 },-->
          <!--// { lng: markers[2].lng, lat: markers[2].lat, html: '潮阳站到了', pauseTime: 1 },-->
          <!--// { lng: markers[3].lng, lat: markers[3].lat, html: '普宁站到了', pauseTime: 1 },-->
          <!--// { lng: markers[4].lng, lat: markers[4].lat, html: '葵潭站到了', pauseTime: 1 }-->
        <!--], // 显示的特殊点，似乎是必选参数，可以留空，据说要和距原线路10米内才会暂停，这里就用原线的点-->
        <!--defaultContent: '动车继续前行', // 覆盖物内容，这个填上面的特殊点文字才会显示-->
        <!--speed: 2000, // 路书速度-->
        <!--icon: icon2, // 覆盖物图标，默认是百度的红色地点标注-->
        <!--autoView: true, // 自动调整路线视野-->
        <!--enableRotation: false// 覆盖物随路线走向-->
      <!--})-->
      <!--_this.map.addOverlay(polyline)// 覆盖折线到地图上-->
      <!--// for (var i = 0; i < 5; i++) {-->
      <!--//   _this.map.addOverlay(new BMap.Marker(markers[i], { icon: icon1 }))// 覆盖动车站标注到地图上-->
      <!--// }-->
      <!--_this.map.centerAndZoom(point, 10)// 设置中心坐标及默认缩放级别-->
      <!--_this.map.addEventListener('click', startlushu)// 给地图注册点击事件-->
      <!--function startlushu() {-->
        <!--_this.lushu.start()// 启动路书函数-->
      <!--}-->
    <!--}-->
  <!--}-->
<!--}-->
<!--</script>-->
<!--<style>-->
  <!--#allmap{-->
    <!--width:100%;-->
    <!--height:100%;-->
  <!--}-->
<!--</style>-->
