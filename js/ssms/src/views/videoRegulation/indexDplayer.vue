<!--suppress ALL -->
<template>
  <div class="app-container">
    <div class="head-container">
      <el-row>
        <!--单页面JS引入-->
        <dingtalk/>
        <span style="margin: 0 20px;font-weight: 500;">选择模式</span>
        <el-radio-group v-model="radio" fill="#67c23a">
          <el-radio-button label="1" style="margin-right: 15px;">单个</el-radio-button>
          <el-radio-button label="4" style="margin-right: 15px;border-left: 1px solid #dcdfe6;">四宫格</el-radio-button>
          <el-radio-button label="9" style="margin-right: 15px;border-left: 1px solid #dcdfe6;">九宫格</el-radio-button>
        </el-radio-group>
        <el-button style="float: right" type="primary" @click="drawer = true">录像回看</el-button>
      </el-row>
    </div>
    <el-row>
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6" style="padding-top: 20px;">
        <span style="margin: 20px 20px;color: rgb(24, 144, 255);font-weight: 500;">设备列表</span>
        <el-tree
          ref="menu"
          :data="devicesData"
          :props="defaultProps"
          disabled=true
          default-expand-all
          style="margin-top: 12px;"
          @current-change="handleCheckChange"
          :check-strictly='true'
          show-checkbox
          node-key="id"/>

      </el-col>
      <el-main>
        <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="18">
          <!--<eYinghsi ref="eYinghsi" source="aaa" :urlList="urlList" v-if="showES"-->
          <!--style="width: 100%; ;margin-bottom: 50px" :closeE="closeFlag"></eYinghsi>-->
          <el-row :gutter="20" style="margin-top: 50px;height: 65%;overflow-y: auto">
            <el-col v-for="(item,index) in videoList" :key="index" :xs="span" :sm="span" :md="span" :lg="span"
                    :xl="span" v-bind:class="{clearBoth_span:(span*index)%24==0}" style="text-align: center">
              <!--行列处理-->
              <span v-if="item.name">设备：{{item.name}}</span>
              <span v-else>无设备</span>
              <dPlay ref="dPlay" :source="item.value" v-if="item.key+1" style="width: 100%; ;margin-bottom: 50px"/>
            </el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="18">
          <div style="clear: both;">foot</div>
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
        <ePlayback ref="form" v-if="drawer"/>
      </div>
    </el-drawer>
  </div>
</template>
<script>
  import checkPermission from '@/utils/permission'
  import dPlay from '../VueDPlayerHls'
  import {get} from '@/api/get_ship_device'
  import ePlayback from "./playback"
  import eYinghsi from "./video_yingshi"
  import dingtalk from '@/utils/remoteJs'
  import $ from 'jquery'


  export default {
    components: {dPlay, ePlayback, dingtalk, eYinghsi,},
    data() {
      return {
        urlList: 'wss://jsdecoder.ys7.com:20006/live?dev=D50406103&chn=2&stream=2&checkCode=CUMYAS&auth=1&biz=4&cln=100&ssn=ot.16xj5hmm4v93kobs75yfj0pc20bk2n31-7hyd9g75j5-064d1na-18xchmnvp',
        closeFlag: false,
        showES: false,
        drawer: false,
        disabledFlag: true,
        direction: 'rtl',
        defaultProps: {
          children: 'children',
          label: 'sn',
          disabled: 'disabled'
        },
        radio: '1',
        devicesData: [
          {
            sn: '362425040027867', id: 1, children: [
              {
                sn: 'Camera 01',
                disabled: true,
                url: '../../static/template/mda-ij1trgnbf0k18qka.mp4',
                id: 101
              },
              {
                sn: 'Camera 02',
                disabled: true,
                url: '../../static/template/SampleVideo_1280x720_1mb.mp4',
                id: 102
              },
              {
                sn: 'IPCamera 03',
                disabled: true,
                url: '../../static/template/mda-ij1trgnbf0k18qka.mp4',
                id: 103
              },
              {
                sn: 'IPCamera 04',
                disabled: true,
                url: '../../static/template/SampleVideo_1280x720_1mb.mp4',
                id: 104
              },
              {
                sn: 'IPCamera 05',
                disabled: true,
                url: '../../static/template/mda-ij1trgnbf0k18qka.mp4',
                id: 105
              },
              {
                sn: 'IPCamera 06',
                disabled: true,
                url: '../../static/template/SampleVideo_1280x720_1mb.mp4',
                id: 106
              },
              {
                sn: 'IPCamera 07',
                disabled: true,
                url: '../../static/template/mda-ij1trgnbf0k18qka.mp4',
                id: 107
              },
              {
                sn: 'IPCamera 08',
                disabled: true,
                url: '../../static/template/SampleVideo_1280x720_1mb.mp4',
                id: 108
              }]
          },
          {
            sn: '362425040027868', disabled: true, id: 2, children: [
              {
                sn: 'Camera 01',
                disabled: true,
                url: '../../static/template/mda-ij1trgnbf0k18qka.mp4',
                id: 201
              },
              {
                sn: 'Camera 02',
                disabled: true,
                url: '../../static/template/SampleVideo_1280x720_1mb.mp4',
                id: 202
              },
              {
                sn: 'Camera 03',
                disabled: true,
                url: '../../static/template/mda-ij1trgnbf0k18qka.mp4',
                id: 203
              },
              {
                sn: 'Camera 04',
                disabled: true,
                url: '../../static/template/SampleVideo_1280x720_1mb.mp4',
                id: 204
              },
              {
                sn: 'Camera 05',
                disabled: true,
                url: '../../static/template/mda-ij1trgnbf0k18qka.mp4',
                id: 205
              },
              {
                sn: 'Camera 06',
                disabled: true,
                url: '../../static/template/SampleVideo_1280x720_1mb.mp4', id: 206
              },
              {
                sn: 'Camera 07',
                disabled: true,
                url: '../../static/template/mda-ij1trgnbf0k18qka.mp4',
                id: 207
              },
              {
                sn: 'Camera 08',
                disabled: true,
                url: '../../static/template/SampleVideo_1280x720_1mb.mp4',
                id: 208
              }]
          }
        ],

        videoList: [{
          id: 0,
          name: "",
          key: 0, value: {
            video: {
              url: '',
              pic: ''
              // type: 'hls'
            },
            contextmenu: [
              {
                text: 'GitHub',
                link: 'https://github.com/MoePlayer/vue-dplayer'
              }
            ]
          }
        }],
        span: 24
      }
    },
    watch: {
      radio: function (val, oldval) {
        setTimeout(() => {
          this.showES = true;
        }, 200)
        setTimeout(() => {
          this.closeFlag = false;
        }, 500)


        if (val == 1) {//控制单个视频大小
          this.span = 24
        } else if (val == 4) {
          this.span = 12
        } else if (val == 9) {
          this.span = 8
        }


        if (oldval > val) {//由多变少
          this.videoList.length = val
          let obj = JSON.parse(JSON.stringify(this.$refs.menu.getCheckedNodes()))
          obj = obj.filter((item, index) => {
            return this.videoList.find(j => {
              return item.id == j.id
            })
          })
          this.$refs.menu.setCheckedNodes(obj);
        } else if (oldval < val) {//由少变多
          for (let i = 0; i < val - oldval; i++) {

            this.videoList.push({
              key: i + Number(oldval), name: '', value: {
                video: {
                  url: ''
                },
                contextmenu: [
                  {
                    text: 'GitHub',
                    link: 'https://github.com/MoePlayer/vue-dplayer'
                  }
                ]
              }
            })
          }
        }

      },
    },
    computed: {},
    created() {
      get({page: 0, size: 2})

      this.$nextTick(() => {
      })
    },
    beforeDestroy() {
      this.closeFlag = true
    },
    mounted() {

    },
    methods: {
      checkPermission,
      handleClose(done) {//弹出 关闭前
        done();
      },
      handleCheckChange(data, checked, indeterminate) {
        if (data.children) {//父节点不处理
          return false
        }
        let obj = JSON.parse(JSON.stringify(this.$refs.menu.getCheckedNodes()))
        if (checked.checked) {//已选中 作删除操作
          obj = obj.filter((item, index) => {
            return item.id != data.id
          })
          this.$refs.menu.setCheckedNodes(obj);
          this.videoList.filter((item, index) => {//删除已有的
            if (item.id == data.id) {//方案1 清空已有位置的参数
              this.$nextTick(() => {
                this.videoList[index].value.video.url = ''
                this.videoList[index].name = ''
                const a = this.videoList[index].key
                this.videoList[index].key = -1
                setTimeout(() => {
                  this.videoList[index].key = a
                }, 100)
              })
            }
            return true
            // if (item.id == data.id) {//方案2 真删除 尾部添加 注意序号key
            //   this.videoList.splice(index,1)
            //   this.videoList.push()
            // }
            // return item.id != data.id
          })

        } else if (this.$refs.menu.getCheckedNodes().length >= this.radio) {//超出长度提示
          this.$notify({
            title: '已达到最多数量',
            type: 'warning',
            duration: 2500
          })
          return false
        } else {//正常添加
          obj.push(arguments[0])
          this.$refs.menu.setCheckedNodes(obj);
          let jishu = true
          this.videoList.find((item, index) => {
            if (!item.value.video.url && jishu) {
              jishu = false
              this.$nextTick(() => {
                this.videoList[index].value.video.url = data.url
                this.videoList[index].id = data.id
                this.videoList[index].name = data.name
                const a = this.videoList[index].key
                this.videoList[index].key = -1
                setTimeout(() => {
                  this.videoList[index].key = a
                }, 100)
              })
              return
            }
            if (index == this.videoList.length - 1 && jishu) {
              this.$notify({
                title: '已达到最多数量',
                type: 'warning',
                duration: 2500
              })
              return false
            }
          })
        }


      },
    }
  }
</script>

<style>
  .is-current {
    color: rgb(24, 144, 255);
  }

  .clearBoth_span {
    clear: both;
  }
</style>
