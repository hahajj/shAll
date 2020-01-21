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
          <el-form-item label="船名" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="船级" prop="shipClass">
            <el-input v-model="form.shipClass"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="编号" prop="code">
            <el-input v-model="form.code" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="船舶类型" prop="shipTypeL">
            <el-select v-model="form.shipTypeL" placeholder="请选择" size="mini">
              <el-option
                v-for="item in shipTypeList"
                :key="item.shipType"
                :label="item.shipTypeName"
                :value="item.shipType"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="总长(M)" prop="length">
            <el-input v-model="form.length" type="number" min="1" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="型深(M)" prop="depth">
            <el-input v-model="form.depth" type="number" min="1"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="型宽(M)" prop="width">
            <el-input v-model="form.width" type="number" min="1"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="空载吃水(吨)" prop="lightDraft">
            <el-input v-model="form.lightDraft" type="number" min="1"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="满载吃水(吨)" prop="loadDraft">
            <el-input v-model="form.loadDraft" type="number" min="1"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="参考载货量(吨)" prop="refLoading">
            <el-input v-model="form.refLoading" type="number" min="1"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="mmsi" prop="mmsi">
            <el-input v-model="form.mmsi" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="关联设备">
            <el-select v-model="devicesList" placeholder="请选择" size="mini">
              <el-option
                v-for="item in deviceData"
                :key="item.deviceId"
                :label="item.deviceNo"
                :value="item.deviceId"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/ship'
import { parseTime } from '@/utils/index'
import { getShipType } from '@/api/shipType'

export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        name: '',
        shipClass: '',
        mmsi: '',
        length: '',
        depth: '',
        refLoading: '',
        code: '',
        loadDraft: '',
        width: '',
        lightDraft: '',
        devicesList: [],
        shipType: {},
        shipTypeL: ''
      },
      devicesList: '',
      deviceData: [],
      shipTypeList: [],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        shipClass: [
          { required: true, message: '请输入船级', trigger: 'blur' }
        ],
        length: [
          { required: true, message: '请输入总长', trigger: 'blur' }
        ],
        depth: [
          { required: true, message: '请输入型深', trigger: 'blur' }
        ],
        width: [
          { required: true, message: '请输入型宽', trigger: 'blur' }
        ],
        lightDraft: [
          { required: true, message: '请输入空载吃水', trigger: 'blur' }
        ],
        loadDraft: [
          { required: true, message: '请输入满载吃水', trigger: 'blur' }
        ],
        refLoading: [
          { required: true, message: '请输入参考载货量', trigger: 'blur' }
        ],
        mmsi: [
          { required: true, message: '请输入mmsi', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入编号', trigger: 'blur' }
        ],
        shipTypeL: [
          { required: true, message: '请选择', trigger: 'blur' }
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
  created() {
    getShipType().then(res => {
      this.shipTypeList = res.content
    })
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
          this.form.devices = this.devicesList ? [{ deviceId: this.devicesList }] : null
          this.form.shipType = { shipType: this.form.shipTypeL }
          if (this.isAdd) {
            this.doAdd()
          } else this.doEdit()
        }
      })
    },
    doAdd() {
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
      this.devices = []
      this.devicesList = ''
      this.form = {
        name: '',
        shipClass: '',
        mmsi: '',
        length: '',
        depth: '',
        refLoading: '',
        code: '',
        shipType: {},
        devicesList: [],
        devices: [],
        shipTypeL: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
