<!--suppress ALL -->
<template>
  <div class="app-container">
    <div class="head-container" style="padding-bottom: 0">
      <el-row>
        <!--单页面JS引入-->
        <dingtalk/>
        <el-button style="float: right" type="primary" @click="drawer = true,showES=false" :loading="!showES">录像回看
        </el-button>
      </el-row>
    </div>
    <el-row>
      <el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="3" style="padding-top: 20px;">
        <div style="height: 330px;">
        <span style="margin: 20px 20px;color: rgb(24, 144, 255);font-weight: 500;">设备列表</span>
        <el-tree
          v-if="treeFlash"
          v-loading="!treeFlash"
          ref="menu"
          :data="devicesData"
          :props="defaultProps"
          :default-checked-keys="defaultChecked"
          disabled=true
          v-loading.fullscreen.lock="fullscreenLoading"
          style="margin-top: 12px;max-height: 300px;overflow-y: auto"
          @check="handleCheckFun"
          :render-content="renderContent"
          show-checkbox
          node-key="id"/>
          </div>
        <shipAlarm/>
      </el-col>
      <el-main>
        <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="18" :offset="2">
          <eYinghsi ref="eYinghsi" source="aaa" :urlList="urlList" v-if="showES"
                    style="width: 100%; ;margin-bottom: 20px" :closeE="closeFlag"></eYinghsi>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="18" :offset="3">
          <el-form ref="controlForm" size="small" label-width="0px">
            <el-row >
              <!--<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">-->
                 <!--<span style="color:rgb(24, 144, 255);font-size:25px">-->
                  <!--手动操作-->
                <!--</span>-->
                <!--<el-row :gutter="40" style="    margin-top: 20px;">-->
                  <!--<el-col :xs="12" :sm="6" :md="8" :lg="12" :xl="12">-->
                    <!--<el-form-item label="方向" label-width="80">-->
                      <!--<el-radio-group v-model="dirRadio">-->
                        <!--<el-row :gutter="40" style="">-->
                          <!--<el-col :xs="9" :sm="9" :md="9" :lg="12" :xl="12">-->
                            <!--<el-radio style="margin-bottom: 5px;" :label="0">上</el-radio>-->
                          <!--</el-col>-->
                          <!--<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">-->
                            <!--<el-radio style="margin-bottom: 5px;" :label="8">放大</el-radio>-->
                          <!--</el-col>-->
                          <!--<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">-->
                            <!--<el-radio style="margin-bottom: 5px;" :label="1">下</el-radio>-->
                          <!--</el-col>-->
                          <!--<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">-->
                            <!--<el-radio style="margin-bottom: 5px;" :label="9">缩小</el-radio>-->
                          <!--</el-col>-->
                          <!--<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">-->
                            <!--<el-radio style="margin-bottom: 5px;" :label="2">左</el-radio>-->
                          <!--</el-col>-->
                          <!--<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">-->
                            <!--<el-radio style="margin-bottom: 5px;" :label="10">近焦距</el-radio>-->
                          <!--</el-col>-->
                          <!--<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">-->
                            <!--<el-radio style="margin-bottom: 5px;" :label="3">右</el-radio>-->
                          <!--</el-col>-->
                          <!--<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">-->
                            <!--<el-radio style="margin-bottom: 5px;" :label="11">远焦距</el-radio>-->
                          <!--</el-col>-->
                        <!--</el-row>-->
                      <!--</el-radio-group>-->
                    <!--</el-form-item>-->
                  <!--</el-col>-->
                  <!--<el-col :xs="12" :sm="6" :md="6" :lg="12" :xl="12" style="    text-align: center;">-->
                    <!--<el-form-item label="速度" label-width="80">-->
                      <!--<el-radio-group v-model="speedRadio">-->
                        <!--<el-radio :label="0">慢</el-radio>-->
                        <!--<el-radio :label="1">中</el-radio>-->
                        <!--<el-radio :label="2">快</el-radio>-->
                      <!--</el-radio-group>-->
                    <!--</el-form-item>-->
                    <!--<el-button type="success" @click="ptz_start_con()">云台控制</el-button>-->
                  <!--</el-col>-->
                <!--</el-row>-->
              <!--</el-col>-->
              <!--<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" style="position: fixed;right: 0;bottom: 30%">-->
                <el-col  style="position: fixed;right: 0;top: 20%;width: 180px">
                  <!--:xs="3" :sm="3" :md="3" :lg="3" :xl="3"-->
                <!--<span style="color:rgb(24, 144, 255);font-size:25px">-->
                  <!--摇杆操作-->
                <!--</span>-->
                <el-row :gutter="0" style="    margin-top: 20px;">
                  <!--<el-col :xs="12" :sm="6" :md="8" :lg="12" :xl="12">-->
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="遥感速度" label-width="60">
                      <el-radio-group v-model="speedRadio">
                        <el-radio :label="0">慢</el-radio>
                        <el-radio :label="1">中</el-radio>
                        <el-radio :label="2">快</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <div style="width: 150px;height: 150px;position: relative;">
                      <img src="../../../static/template/3.jpg" alt=""
                           style="width: 150px;position: absolute;top: 0;left: 0;z-index: -1;opacity: 0.1;">
                      <div id="zone_joystick"
                           style="width: 75px;height: 75px;    position: absolute;left: 50px;top: 50px;   cursor: move;;">
                      </div>
                      <div class="up" style="width: 50px;height: 40px;position: absolute;left: 50px;cursor: pointer"
                           @click="changeDir(0)"></div>
                      <div class="left" style="width: 40px;height: 50px; position: absolute;top: 50px;cursor: pointer"
                           @click="changeDir(2)"></div>
                      <div class="right"
                           style="width: 40px;height: 50px; position: absolute;top: 50px;right: 0;cursor: pointer"
                           @click="changeDir(3)"></div>
                      <div class="down"
                           style="width: 50px;height: 40px; position: absolute;left: 50px;bottom: 0;cursor: pointer"
                           @click="changeDir(1)"></div>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-main>
    </el-row>
    <!--视频回放-->
    <el-drawer
      title="视频回放"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
      size="67%">
      <div class="demo-drawer__content">
        <ePlayback ref="form" v-if="drawer" :deviceList="devicesData"/>
      </div>
    </el-drawer>
  </div>
</template>
<script>
  import checkPermission from '@/utils/permission'
  import dPlay from '../VueDPlayerHls'
  import {ptz_start, ptz_start_stop ,getUrlOut,getDevicesOut,getCameraOut,getptz} from '@/api/get_ship_device'
  import ePlayback from "./playback"
  import eYinghsi from "./video_yingshi"
  import dingtalk from '@/utils/remoteJs'
  import $ from 'jquery'
  import nipplejs from 'nipplejs';
  import {get} from '@/api/device'
  import {getShip} from '@/api/ship'
  import shipAlarm from '@/views/ship/shipAlarm/shipAlarm'

  // defaultChecked
  export default {
    components: {dPlay, ePlayback, dingtalk, eYinghsi,shipAlarm},
    data() {
      return {
        treeFlash:true,//双向绑定真的很垃圾
        defaultChecked:[],
        defaultCheckedFlag:true,
        loadingF:'',
        fullscreenLoading: false,//加载层模态框开关
        speedRadio: 0,//调控速度
        dirRadio: 0,//方向参数
        moveFlag: true,//移动开关 摇杆
        options: null,//摇杆参数
        manager: null,//摇杆参数
        angle: null,//摇杆方向
        urlList: '',//视频 地址集合
        urlArry: [//所有正在播放的视频参数集合
        //   { id: 201,
        //   cameraId: 2,
        //   parentSn: '362425040027868',
        //   sn: "Camera 01",
        //   url: "wss://jsdecoder.ys7.com:20006/live?dev=D50406103&chn=2&stream=2&checkCode=CUMYAS&auth=1&biz=4&cln=100&ssn=ot.dupo65xab08k6tk87dujz8ls5qhnqdel-4jm4lk2kxt-17c39jl-o0spsurya"
        // }
        ],
        checkedDevice: {},//被选择视频的参数
        closeFlag: false,//销毁萤石云flag
        showES: false,//加载萤石云
        drawer: false,//回放 flag
        direction: 'rtl',//回放 组件动画方向
        defaultProps: {//tree默认属性  真
          children: 'children',
          label: 'name',
          disabled: 'disabled'
        },
        defaultProps1: {//tree默认属性  本地
          children: 'deviceCrmeras',
          label: 'name',
          disabled: 'disabled'
        },
        //排序数据??
        devicesData1: [],
        videoTime:'',
        //加载数据
        devicesData: [
          //数据模板 sn为识别号  id为tree加载索引  children默认子类
          // {
          //   sn: '362425040027867', id: 1, children: [
          //     {
          //       cameraId: 1,
          //       parentSn: '362425040027867',
          //       sn: 'Camera 01',
          //       // disabled: true,
          //       url: 'wss://jsdecoder.ys7.com:20006/live?dev=C80981268&chn=1&stream=1&checkCode=ZMDXLB&auth=1&biz=4&cln=100&ssn=ot.chdwcsji3dz9j6zsc3j7nyhcao2fvb6l-7zogdsvlso-189f31s-njhucqbwg',
          //       id: 101
          //     },
          // },
        ],
      }
    },
    computed: {},
    created() {
      this.openFullScreen(1)
      var _this=this
      _this.initVideo(_this,1)
      //定时器
     this.videoTime=setInterval(()=>{
       _this.treeFlash=false//双向绑定真的很垃圾
        _this.initVideo(_this)
      },300000)
    },
    //销毁
    beforeDestroy() {
      clearInterval(this.videoTime)
      this.closeFlag = true
    },
    mounted: function () {
      var _this = this

      /**
       * 摇杆插件
       **/
      this.options = {
        zone: document.getElementById('zone_joystick'),
        color: '#363638',
        threshold: 0.5,
        transition: 2000,
        mode: 'dynamic',//mode: 'semi','dynamic','static'
        position: {
          left: '100%',
          top: '100%'
        },
        size: 75
      };

      this.manager = nipplejs.create(this.options);
      let time = null
      this.manager.on('start', function (evt, data) {

        $(function () {
          $(".play-window").each(function (index, item) {
            if ($(this).css("border-color") != 'rgb(52, 52, 52)') {
              _this.checkedDevice = _this.urlArry[index]
            }
          })
        })
        time = setInterval(() => {
          if (_this.moveFlag && _this.angle) {
            var dir
            switch (_this.angle) {
              case 'up':
                dir = 0;
                break
              case 'down':
                dir = 1;
                break
              case 'left':
                dir = 2;
                break
              case 'right':
                dir = 3;
                break
            }

          if(!_this.checkedDevice){
            _this.$notify({
              title: "未选择设备",
              type: 'warning',
              duration: 2500
            })
            return false
          }
            var obj = {
              sn: _this.checkedDevice.parentSn,
              id: _this.checkedDevice.cameraId,
              direction: dir,
              speed:_this.speedRadio,
              stopAfter: 15,
              command:'start'
            }
            getptz(obj).then(res=>{
              _this.$notify({
                title: res.msg,
                type: 'warning',
                duration: 2500
              })
            })
          }
        }, 300);
      }).on('move', function (evt, data) {//监听
      }).on('dir:up plain:up dir:left plain:left dir:down ' +
        'plain:down dir:right plain:right',
        function (evt, data) {
          _this.angle = data.direction.angle
        }
      ).on('pressure', function (evt, data) {
      }).on('end', function (evt, data) {
        clearInterval(time);
        _this.angle = null
      })
    },
    methods: {
      checkPermission,
      ptz_start,
      ptz_start_stop,
      errorCatch(_this){
        _this.showES = true
        setTimeout(() => {
          _this.loadingF.close();
        }, 500)
      },
      initVideo(_this,type){
        var OutData;
        var _this = _this
        try {
          getDevicesOut().then(res=>{//外部接口 请求device列表数据
            // res.content[1].online=true
            OutData=res.content
            getShip().then(res => {//内部接口 请求ship device列表数据
              _this.devicesData1 = res.map(j => {//
                if (!j.devices || j.devices.length < 1) {//无设备请赶紧走！！！
                  return ''
                } else {
                  let item = JSON.parse(JSON.stringify(j.devices[0]))//return 出去修改数据结构  中间砍掉一层
                  //内部接口device数据是否有外部接口的数据 是否统一
                  const jdata=OutData.find(jd=>{
                    return jd.sn==item.deviceNo
                  })
                  if(jdata){
                    console.log(jdata.online,item)
                    item.online=item.status==='USE'&&jdata.online//在线
                    item.disabled=!(item.status==='USE'&&jdata.online)//不在线
                  }else{
                    item.disabled=true//不存在
                  }
                  item.name = j.name
                  item.sn = item.deviceNo//sn用来获取其他外部数据
                  item.id = item.shipId + item.name//唯一性
                  item.deviceCrmeras.sort(function (p1, p2) {//排序  及修改参数
                    p1.cameraId = p1.crmeraId
                    p2.cameraId = p2.crmeraId
                    p1.parentSn = item.deviceNo
                    p2.parentSn = item.deviceNo
                    p1.id = p1.deviceCrmeraId
                    p2.id = p2.deviceCrmeraId
                    return p1.deviceCrmeraId - p2.deviceCrmeraId
                  })
                  item.children = JSON.parse(JSON.stringify(item.deviceCrmeras))//修改参数  deviceCrmeras不符合规格
                  item.deviceCrmeras = null
                  return item
                }
              }).filter(values => {//去空
                return values != ''
              })

              /**
               * 视频地址diff
               * */

              Promise.all(_this.devicesData1.map(values => {//遍历整体数据
                if(values.online){//在线
                  let uri=values.sn+'/cameras'
                  getCameraOut(uri).then(res=>{//调取外部摄像头接口
                    var OutcamerasData=res
                    Promise.all(values.children.map(value => {
                      const jdcata=OutcamerasData.find(jdc=>{//判断本地数据是否和外部接口一至
                        return jdc.id.cameraId==value.cameraId
                      })
                      if(jdcata){
                        value.online=jdcata.online//在线
                        value.disabled=!jdcata.online//不在线
                      }else{
                        value.disabled=true//不存在
                      }
                      if(value.online){//如果在线
                        var url=values.sn+'/'+value.cameraId+'/'+ values.videoStreamType+'/live'
                        getUrlOut(url).then(res => {//调取视频接口
                          if(res.playUrl){//如果返回正确 接受地址
                            value.url = res.playUrl
                          }else{//否则 故障？
                            value.online=false
                            value.disabled=true
                          }
                          return value
                        },error => {//故障
                          value.online=false
                          value.disabled=true
                          return value
                        })
                      }else{
                        return value
                      }
                    })).then(res => {
                      return values
                    })
                  },err=>{
                    values.children.map(value => {
                      value.online=false
                      value.disabled=true
                    })
                    return values
                  })
                  return values
                }else{
                  values.children.map(value => {
                    value.online=false
                    value.disabled=true
                  })
                  return values
                }
              })).then(data => {
                setTimeout(()=>{
                  this.treeFlash=true//双向绑定真的很垃圾
                },200)
                _this.$nextTick(res=>{
                  _this.devicesData = data
                  if(_this.$route.query&&_this.$route.query.id&&type==1&&_this.defaultCheckedFlag){
                    _this.defaultCheckedFlag=false
                    setTimeout(() => {
                      _this.defaultChecked=[_this.$route.query.id+_this.$route.query.name]
                      setTimeout(()=>{
                        _this.handleCheckFun()
                      },500)
                    }, 500)
                  }else{
                    _this.showES = true
                    setTimeout(() => {
                      _this.loadingF.close();
                    }, 500)
                  }
                })
              })
            },error=>{
              _this.errorCatch(_this)
              throw new Error( error)
            });
          },error=>{
            _this.errorCatch(_this)
            throw new Error( error)
          })

        }catch (e) {
          _this.errorCatch(_this)
        }
      },
      renderContent(h, { node, data, store }) {//别整理格式！！！
        return (
          <span class='custom-tree-node' style='width: 120px;font-size:14px'>
          <span>{node.label}</span>
        {
          data.disabled? (<span class='statusSpanShip' style='background:#949494' ></span>) : (<span class='statusSpanShip' style='background:#33cc66'></span>)
        }
      </span>
      )
      },
      //云台控制
      ptz_start_con: function (form) {
        var _this = this
        $(function () {
          $(".play-window").each(function (index, item) {
            if ($(this).css("border-color") != 'rgb(52, 52, 52)') {
              _this.checkedDevice = _this.urlArry[index]
              var obj = {
                sn: _this.checkedDevice.parentSn,
                id: _this.checkedDevice.cameraId,
                direction: _this.dirRadio,
                speed:_this.speedRadio,
                command:'start'
              }
              getptz(obj).then(res=>{
                _this.$notify({
                  title: res.msg,
                  type: 'warning',
                  duration: 2500
                })
              })
              return false
            }
          })
        })
      },
      //連貫移動
      ptz_move_con(data) {
        this.moveFlag = false
        this.ptz_start_stop(data).then(res => {
          this.moveFlag = true
          if (res.msg) {
            this.$notify({
              title: res.msg,
              type: 'warning',
              duration: 2500
            })
          }
        })

      },
      //更改设备位置
      changeDir(dir) {
        var _this = this
        $(function () {
          $(".play-window").each(function (index, item) {
            if ($(this).css("border-color") != 'rgb(52, 52, 52)') {
              _this.checkedDevice = _this.urlArry[index]
              var obj = {
                sn: _this.checkedDevice.parentSn,
                id: _this.checkedDevice.cameraId,
                direction:dir,
                speed:_this.speedRadio,
                stopAfter: 15,
                command:'start'
              }
              getptz(obj).then(res=>{
                _this.$notify({
                  title: res.msg,
                  type: 'warning',
                  duration: 2500
                })
              })
              // let fd = new FormData();
              // fd.append('csrfmiddlewaretoken', 'DBGquChD8Kn0qKaBeFTeGyBTeVg8A97iuyWTz54KzXKOn1YBO5Qv9fqi3eo2LVts');
              // fd.append('sn6', _this.checkedDevice.parentSn);
              // fd.append('cameraId6', _this.checkedDevice.cameraId);
              // fd.append('ctl', dir);
              // fd.append('speed', _this.speedRadio);
              // fd.append('stopAfter', 15);
              // _this.ptz_start_stop(fd).then(res => {
              //   _this.$notify({
              //     title: res.msg,
              //     type: 'warning',
              //     duration: 2500
              //   })
              // })
              return false
            }
          })
        })
      },
      //弹出 关闭前
      handleClose(done) {
        setTimeout(() => {
          this.showES = true
        }, 500)
        done();
      },
      //播放初始化
      videoInit() {
        var _this = this
        _this.openFullScreen()
        // $(function () {
        //
        //   $(".el-checkbox__original").attr("disabled", "disabled")
        //   setTimeout(() => {
        //     $(".el-checkbox__original").removeAttr("disabled")
        //   }, 3000)
        // })
        this.closeFlag = true

        //子组件销毁前无法销毁jquerydom
        setTimeout(() => {
          this.showES = false;
        }, 200)
        setTimeout(() => {
          this.showES = true;
          this.closeFlag = false;
        }, 500)
      },
      //按钮点击
      handleCheckFun(data, checked) {
        this.urlList = ''
        this.urlArry = []
        var checkedList=[]
        let obj = JSON.parse(JSON.stringify(this.$refs.menu.getCheckedNodes()))
        var flag = true
        const cheakedArry = obj.filter((item, index) => {
          if (!item.children) {
            checkedList.push(item.id)
            this.urlArry.push(item)
            if (flag) {
              this.urlList += item.url
              flag = false
            } else {
              this.urlList += ',' + item.url
            }
          }
          return !item.children
        })
        this.defaultChecked=checkedList
        this.videoInit()
      },
      openFullScreen(type) {
        var _this=this
        this.loadingF = this.$loading({
          lock: true,
          text: '加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        if(type==1){

        }else{
          setTimeout(() => {
            _this.loadingF.close();
          }, 3000);
        }

      }
    }
  }
</script>

<style>
  .is-current {
    color: rgb(24, 144, 255);
  }
  .statusSpanShip{
    border-radius: 6px;background: #ff6600;height: 12px;width: 12px;display: inline-block;float: right;
  }
  .clearBoth_span {
    clear: both;
  }
</style>
