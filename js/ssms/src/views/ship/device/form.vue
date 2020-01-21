<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :visible.sync="dialog"
    :before-close="resetForm"
    :title="isAdd ? '新增' : '编辑'"
    width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备编号" prop="deviceNo">
            <el-input v-model="form.deviceNo" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="软件版本" prop="softwareVer">
            <el-input v-model="form.softwareVer"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="视频码流" prop="videoStreamType">
            <el-select v-model="form.videoStreamType" placeholder="请选择" size="mini">
              <el-option
                v-for="item in videoStreamTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="定位间隔(S)" prop="positionInterval">
            <el-input v-model="form.positionInterval" type="number" min="1" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="通道位数" >
            <el-input v-model="form.channelAmount" type="number" min="1" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关联船名">
            <el-select v-model="form.shipId" placeholder="请选择" size="mini">
              <el-option
                v-for="item in shipData"
                :key="item.shipId"
                :label="item.name"
                :value="item.shipId"/>
            </el-select>
          </el-form-item>
        </el-col>
        <div v-if="!isAdd">
          <el-col v-for="(item,index) in form.deviceCrmeras" :key="index" :span="12">
            <el-form-item :label="'通道'+(index+1)">
              <el-input v-model="item.name" min="1"/>
            </el-form-item>
          </el-col>
        </div>
        <div v-if="isAdd">
          <el-col v-for="(item,index) in deviceCrmeras" :key="index" :span="12">
            <el-form-item :label="'通道'+(index+1)">
              <el-input v-model="item.name" />
            </el-form-item>
          </el-col>
        </div>

    </el-row></el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/device'
import { parseTime } from '@/utils/index'

export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
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
      loading: false, dialog: false,
      videoStreamTypeList: [
        { label: '高清', value: 'hd' }, { label: '标清', value: 'sd' }
      ],
      form: {
        deviceCrmeras: [], videoStreamType: '', positionInterval: '', channelAmount: 8, shipId: '', deviceNo: '', softwareVer: ''
      },
      shipData: [],
      deviceCrmeras: [],
      rules: {
        deviceNo: [
          { required: true, message: '请输入设备编号', trigger: 'blur' }
        ],
        softwareVer: [
          { required: true, trigger: 'blur', validator: validVersion }
        ],
        videoStreamType: [
          { required: true, message: '请输入视频码流', trigger: 'blur' }
        ],
        positionInterval: [
          { required: true, message: '请输入定位间隔', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    form: {
      handler: function(val, oldval) {
      },
      deep: true
    },
    'form.checkPeriod'(val, oldVal) {
      this.changeDate()
    },
    'form.lastCheckDate'(val, oldVal) {
      this.changeDate()
    }
  },
  methods: {
    changeDate() {
      if (this.form.lastCheckDate && this.form.checkPeriod) {
        const oldDate = new Date(this.form.lastCheckDate.replace(/\-/g, '/'))
        const newDate = oldDate.setMonth(parseInt(oldDate.getMonth()) + parseInt(this.form.checkPeriod))
        this.form.newCheckDate = parseTime(newDate)
      } else {
        this.form.newCheckDate = ''
      }
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else this.doEdit()
        }
      })
    },
    doAdd() {
      this.form.deviceCrmeras = this.deviceCrmeras
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      console.log(JSON.stringify(this.form))
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.deviceCrmeras = []
      this.form = {
        deviceCrmeras: [], videoStreamType: '', positionInterval: '', channelAmount: '8', shipId: '', deviceNo: '', softwareVer: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
