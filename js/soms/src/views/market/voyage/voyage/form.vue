<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增' : '编辑'" width="850px">
    <el-form
      v-loading="contactLoading"
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="110px"
      status-icon
      style="width:90%">
      <el-row :gutter="15">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="航次号" prop="">
            <el-input v-model="form.code" :disabled="!isAdd" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="船名" prop="organizationId.organizationId">
            <el-select v-model="form.organizationId.organizationId" filterable placeholder="请选择" >
              <el-option
                v-for="item in organizationData"
                :key="item.organizationId"
                :label="item.label"
                :value="item.organizationId"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="关联合同" prop="contractsIds">
            <el-select v-model="form.contractsIds" filterable multiple placeholder="请选择" >
              <el-option
                v-for="item in contactData"
                :key="item.contractId+'contract'"
                :label="item.code"
                :value="item.contractId"/>
            </el-select>
          </el-form-item>
        </el-col>

        <!--货物多种-->
        <div v-if="form.voyageCargoInfos.length" style="clear: both; border: 1px solid rgba(204, 204, 204, 1);padding-top: 20px;width: 110%; padding-right: 10%;margin-bottom: 20px;border-radius: 10px">
          <span class="spanLabel">货物信息</span>
          <div v-for="(item,index) in form.voyageCargoInfos" :key="index" style="margin-top: 10px">
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" style="clear: both">
              <!--<el-form-item :label="voyageLabel(index)" prop="">-->
              <!--<el-input v-model="item.cargo.name"/>-->
              <!--</el-form-item>-->
              <el-form-item :prop="'voyageCargoInfos.' + index + '.cargo.cargoId'" :rules="{ required: true, message: '货物类型不能为空', trigger: 'blur'}" :label="voyageLabel(index)">
                <!--@change="changeCargoData(item,item.cargoId,form.contractCargoInfos)"-->
                <el-select v-model="item.cargo.cargoId" :disabled="!isAdd" filterable placeholder="请选择">
                  <el-option
                    v-for="item in cargoData"
                    :key="item.cargoId+index"
                    :label="item.name"
                    :value="item.cargoId"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item :prop="'voyageCargoInfos.' + index + '.amount'" :rules="{ required: true, message: '货物总量不能为空', trigger: 'blur'}" label="货物总量(吨)" >
                <el-input-number :min="0" v-model="item.amount" :disabled="!isAdd" controls-position="right" type="number"/>
              </el-form-item>
            </el-col>
          </div>
          <div style="clear: both"/>
        </div>
        <div style="clear: both"/>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="航线" prop="sailing.sailingCode">
            <el-select v-model="form.sailing.sailingCode" filterable placeholder="请选择" >
              <el-option
                v-for="item in sailingData"
                :key="item.sailingCode"
                :label="item.name"
                :value="item.sailingCode"/>
            </el-select>
          </el-form-item>
        </el-col>
        <div style="clear: both"/>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="受载日期" prop="loadDate">
            <el-date-picker
              v-model="form.loadDate"
              type="date"
              size="mini"
              style="width: 199px;"
              placeholder="选择日期"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="延期天数±" prop="delayDays">
            <el-input-number :min="0" v-model="form.delayDays" controls-position="right" type="number" style="width: 199px;"/>
          </el-form-item>
        </el-col>
        <div style="clear: both"/>

        <span class="spanLabel">指令信息</span>
        <span class="spanAdd" >
          <el-button type="success" size="mini" @click="form.voyageInstructions.push({})"> 新增指令</el-button>
        </span>
        <div style="padding-left: 0;margin-top: 10px;width: 830px">

          <el-table :data="form.voyageInstructions" style="width: 100%;font-size: 12px">
            <el-table-column
              align="center"
              label="装卸动作">
              <template slot-scope="scope">
                <el-select v-model="scope.row.actionType" filterable placeholder="请选择" size="mini">
                  <el-option
                    v-for="(item,index) in actionData"
                    :key="index"
                    :label="item"
                    :value="item"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              width="120px"
              label="港口">
              <template slot-scope="scope">
                <el-select v-model="scope.row.portName" filterable placeholder="请选择" size="mini">
                  <el-option
                    v-for="(item,index) in portData"
                    :key="item.name+index"
                    :label="item.name"
                    :value="item.name"/>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              width="130px"
              label="装卸总时(h)">
              <template slot-scope="scope">
                <el-input-number :min="0" v-model="scope.row.actionTime" controls-position="right" type="number" size="mini"/>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              width="130px"
              label="装卸总量(吨)">
              <template slot-scope="scope">
                <el-input-number :min="0" v-model="scope.row.amount" controls-position="right" type="number" size="mini"/>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              width="130px"
              label="货物交接方式">
              <template slot-scope="scope">
                <el-select v-model="scope.row.cargoHandoverType" filterable placeholder="请选择" size="mini">
                  <el-option
                    v-for="(item,index) in cargoHandoverTypeData"
                    :key="index"
                    :label="item"
                    :value="item"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              width="130px"
              label="质量交接方式">
              <template slot-scope="scope">
                <el-select v-model="scope.row.qualityHandoverType" filterable placeholder="请选择" size="mini">
                  <el-option
                    v-for="(item,index) in qualityHandoverTypeData"
                    :key="index"
                    :label="item"
                    :value="item"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center">
              <template slot-scope="scope">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" @click="form.voyageInstructions.splice(scope.$index,1)"/>
              </template>
            </el-table-column>
        </el-table></div>
        <el-form-item label="备注" style="margin-top: 30px">
          <el-input v-model="form.comments" :rows="2" type="textarea" />
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { get } from '@/api/cargo'
import { add, edit } from '@/api/voyage'
import pdf from '@/components/pdf'
import { getPort } from '@/api/port'
import { getContract } from '@/api/contract'
import { parseTime } from '@/utils/index'
import { getSailing } from '@/api/sailing'
// import { getOrganizationByCriteria } from '@/api/organization'

export default {
  components: { 'v-pdf': pdf },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      contactLoading: true, // 控制是否监听 及 等待
      loading: false, dialog: false,
      recevieList: [],
      circularTypes: [],
      shipOrganizations: [],
      dialogPdfUrl: '',
      innerDialogVisible: false,
      dialogImageUrl: '',
      pdfCurrentPage: 0,
      pdfPageCount: 0,
      pdfNumPages: undefined,
      dialogVisible: false,
      form: {
        contractsIds: [],
        organizationId: {},
        sailing: {},
        voyageCargoInfos: [],
        voyageInstructions: []
      },
      cargoData: [],
      portData: [],
      contactData: [],
      sailingData: [],
      organizationData: [],
      actionData: [
        '装货', '卸货'
      ],
      cargoHandoverTypeData: ['商检船装', '商检罐装', '流量计'],
      qualityHandoverTypeData: ['管口样', '罐样', '船舱混合样'],
      rules: {
        'organizationId.organizationId': [{ required: true, message: '请选择船名', trigger: 'blur' }],
        contractsIds: [{ required: true, message: '请选择关联合同', trigger: 'blur' }],
        'sailing.sailingCode': [{ required: true, message: '请选择航线', trigger: 'blur' }],
        loadDate: [{ required: true, message: '请选择日期', trigger: 'blur' }],
        delayDays: [{ required: true, message: '请输入可延期日期', trigger: 'blur' }]
      }
    }
  },

  watch: {
    dialog(val) {
      setTimeout(() => {
        this.contactLoading = !val
      }, 100)
    },
    form: {
      handler: function(val, oldval) {
      },
      deep: true
    },
    'form.contractsIds'(arr1, arr2) {
      if (this.contactLoading) {
        return false
      }
      var flag = arr1.concat(arr2).filter(function(v, i, arr) {
        if (arr.indexOf(v) === arr.lastIndexOf(v)) {
          flag = i
        }
        return arr.indexOf(v) === arr.lastIndexOf(v)
      })
      this.changeContracts(flag[0], arr1.length > arr2.length)
    }
  },
  created() {
    get().then((res) => {
      this.cargoData = res.content
    })
    getPort({ sort: 'createdDate,desc' }).then((res) => {
      this.portData = res.content
    })
    getContract({ status: 'SIGN,EXECUTE' }).then(res => {
      this.contactData = res.content
    })
    getSailing({ sort: 'createdDate,desc' }).then(res => {
      this.sailingData = res.content
    })
  },
  methods: {
    parseTime,
    voyageLabel(index) {
      return '货物类型' + (index + 1)
    },
    changeCargoData(row, id, type1) {
      row.cargo = this.cargoData.find(item => {
        return item.cargoId === id
      })
      if (type1) {
        this.changeActiveCargoData(type1)
      }
    },
    changeContracts(id, type) { // type代表增删
      // debugger
      if (type) {
        var a = this.form.voyageCargoInfos.concat(([].concat(JSON.parse(JSON.stringify(this.contactData)))).find(item => {
          return item.contractId === id
        }).contractCargoInfos.map(j => {
          var newObj = this.form.voyageCargoInfos.find(value => {
            return value.cargo.name === j.cargo.name
          })
          if (newObj) {
            newObj.amount = newObj.amount + j.amount
            return null
          } else {
            return j
          }
        }).filter(values => {
          return !!values
        }))
        var b = JSON.parse(JSON.stringify(this.form.voyageInstructions)).concat(this.contactData.find(item => {
          return item.contractId === id
        }).contractPortInfos.map(j => {
          return j
        }))
        this.$nextTick(() => {
          this.form.voyageInstructions = b
          this.form.voyageCargoInfos = a
        })
      } else {
        const obj = this.contactData.find(item => {
          return item.contractId === id
        })
        var arr = []
        if (obj) {
          arr = obj.contractCargoInfos
        }

        arr.map(items => {
          this.form.voyageCargoInfos = this.form.voyageCargoInfos.filter((item, index) => {
            if (item.cargo.name === items.cargo.name) {
              item.amount = Number(item.amount) - Number(items.amount) > 0 ? Number(item.amount) - Number(items.amount) : 0
              if (item.amount) {
                return true
              } else {
                return false
              }
            }
            return true
          })
        })
        var a = this.form.voyageCargoInfos
        var b = this.form.voyageInstructions.map((item) => {
          if (item.contractId === id) {
            return null
          } else {
            return item
          }
        }).filter(item => {
          return item
        })
        console.log(this.contactData)
        this.$nextTick(() => {
          this.form.voyageInstructions = b
          this.form.voyageCargoInfos = a
        })
      }
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.form.contracts = []
      this.form.contractsIds.map(item => {
        this.form.contracts.push(this.contactData.find(value => {
          return value.contractId == item
        }))
      })
      const fd = this.form
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd(fd)
          } else this.doEdit(fd)
        }
      })
    },
    doAdd(fd) {
      add(fd).then(res => {
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
    doEdit(fd) {
      edit(fd).then(res => {
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
      this.recevieList = []
      this.$refs['form'].resetFields()
      this.form = {
        contractsIds: [],
        organizationId: {},
        sailing: {},
        voyageCargoInfos: [],
        voyageInstructions: [],
        comments: ''
      }
      this.dialog = false
    }
  }
}
</script>

<style scoped>
.spanLabel{
  color: #1890ff;
  font-size: 17px;
}
  .spanAdd{
    position: absolute;right: -25px;
  }
</style>
