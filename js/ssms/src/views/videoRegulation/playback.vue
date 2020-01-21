<template>
  <div>
    <el-main
      v-loading="loading"
      element-loading-text="加载中。。。"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="0px">
        <el-row :gutter="40">
          <!--角色管理-->
          <el-col :xs="12" :sm="6" :md="6" :lg="5" :xl="5">
            <el-form-item prop="sn">
              <el-select v-model="form.sn " placeholder="船舶">
                <el-option
                  v-for="(item,index) in deviceList"
                  :key="index"
                  :label="item.name"
                  :value="item.sn"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :md="6" :lg="5" :xl="5">
            <el-form-item prop="cameraId">
              <el-select v-model="form.cameraId" placeholder="摄像头序号">
                <el-option
                  v-for="(item,index) in cameraList"
                  :key="index"
                  :label="item.name"
                  :value="item.cameraId"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="9" :xl="9">
            <el-form-item prop="time">
              <el-date-picker
                v-model="form.time"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="small"
                value-format="timestamp"
                style="width: 350px"/>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="4" :md="4" :lg="5" :xl="5">
            <el-button style="float: right" type="primary" @click="playbackvideo(form)">录像回看</el-button>
          </el-col>
        </el-row>
        <eYinghsi
          v-if="showES"
          ref="eYinghsi"
          :url-list="urlList"
          source="aaa"
          style="width: 100%; ;margin-bottom: 50px"/>
      </el-form>
    </el-main>
  </div>
</template>

<script>
import { getBackOut } from '@/api/get_ship_device'
import eYinghsi from './video_yingshi'

export default {
  components: { eYinghsi },
  props: {
    deviceList: {
      type: Array,
      required: true,
      default: []
    }
  },
  data: function() {
    return {
      loading: false,
      showES: false,
      urlList: '',
      cameraList: this.deviceList[0].children,
      dialog: false,
      firstDocumentClassData: [],
      form: {
        time: [],
        sn: '',
        cameraId: ''
      },
      rules: {
        sn: [
          { required: true, message: '请输入设备序列号', trigger: 'change' }
        ],
        cameraId: [
          { required: true, message: '请输入摄像头序号', trigger: 'change' }
        ],
        time: [
          { required: true, message: '请输入开始时间和结束时间', trigger: 'blur' }
        ]

      }
    }
  },
  created() {
    console.log(this.deviceList)
  },
  methods: {
    playbackvideo(form) {
      var _this = this
      this.showES = false
      this.loading = true
      const submitForm = JSON.parse(JSON.stringify(form))
      const fd = new FormData()
      submitForm.startTime = submitForm.time.length === 0 ? '' : submitForm.time[0]
      submitForm.endTime = submitForm.time.length === 0 ? '' : submitForm.time[1]
      submitForm.csrfmiddlewaretoken = 'EFifz8BBU3D6HzgCljSvWbgOKZTIWlKJvCyIEBoIlg0UEQ4CVJPMpS5dzi1C776T'
      var obj = {
        sn: submitForm.sn,
        cameraId: submitForm.cameraId,
        startTime: submitForm.startTime,
        endTime: submitForm.endTime

      }
      try {
        console.log(11111)
        getBackOut(obj).then(res => {
          console.log(1111111)
          _this.urlList = res.playUrl
          _this.showES = true
          setTimeout(function() {
            _this.loading = false
          }, 500)
        })
      } catch (e) {
        console.log(11111112222)
        _this.showES = true
        _this.loading = false
      }
    },
    // changeSn(id) {
    //   this.form.cameraId = ''
    //   this.cameraList = this.deviceList.find(item => {
    //     return item.deviceId === id
    //   }).deviceCrmeras
    // },
    acc(id) {
      this.form.parentClass = this.firstDocumentClassData.filter(item => {
        return item.id === id
      })
    },
    cancel() {
      this.resetForm()
    },
    resetForm: function() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        time: [],
        sn: '',
        cameraId: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
