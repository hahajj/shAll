<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :before-close="resetForm" title="查看" width="750px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="110px" status-icon style="width:90%">
      <el-row :gutter="15">
        <el-col v-if="!isSee" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="航次号" prop="">
            <el-input v-model="form.code" disabled />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="船名" prop="">
            <el-select v-model="form.organizationId.organizationId" filterable placeholder="请选择" disabled>
              <el-option
                v-for="item in organizationData"
                :key="item.organizationId"
                :label="item.label"
                :value="item.organizationId"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="关联合同" prop="">
            <el-select v-model="form.contractsIds" filterable multiple placeholder="请选择" disabled>
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
              <el-form-item :label="voyageLabel(index)" prop="" >
                <el-input v-model="item.cargo.name" disabled/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="货物总量(吨)" prop="" >
                <el-input v-model="item.amount" type="number" disabled/>
              </el-form-item>
            </el-col>
          </div>
          <div style="clear: both"/>
        </div>
        <div style="clear: both"/>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="航线" prop="">
            <el-select v-model="form.sailing.sailingCode" filterable placeholder="请选择" disabled >
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
          <el-form-item label="受载日期" prop="">
            <el-date-picker
              v-model="form.loadDate"
              disabled
              type="date"
              size="mini"
              style="width: 179px;"
              placeholder="选择日期"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="延期天数±" prop="">
            <el-input v-model="form.delayDays" type="number" min="1" disabled/>
          </el-form-item>
        </el-col>
        <div style="clear: both"/>

        <span class="spanLabel">指令信息</span>
        <!--<span class="spanAdd" >-->
        <!--<el-button type="success" size="mini" @click="form.voyageInstructions.push({})"> 新增指令</el-button>-->
        <!--</span>-->
        <div style="padding-left: 0;margin-top: 10px;width: 715px">

          <el-table :data="form.voyageInstructions" style="width: 100%;font-size: 12px">
            <el-table-column
              label="装卸动作">
              <template slot-scope="scope">
                <el-input v-model="scope.row.actionType" disabled size="mini" />
              </template>
            </el-table-column>
            <el-table-column
              width="120px"
              label="港口">
              <template slot-scope="scope">
                <el-select v-model="scope.row.portName" filterable placeholder="请选择" disabled size="mini">
                  <el-option
                    v-for="(item,index) in portData"
                    :key="item.name+index"
                    :label="item.name"
                    :value="item.name"/>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column
              label="装卸总时(h)">
              <template slot-scope="scope">
                <el-input v-model="scope.row.actionTime" type="number" size="mini" disabled/>
              </template>
            </el-table-column>

            <el-table-column
              label="装卸总量(吨)">
              <template slot-scope="scope">
                <el-input v-model="scope.row.amount" type="number" size="mini" disabled/>
              </template>
            </el-table-column>
            <el-table-column
              width="120px"
              label="货物交接方式">
              <template slot-scope="scope">
                <el-input v-model="scope.row.cargoHandoverType" size="mini" disabled/>
              </template>
            </el-table-column>
            <el-table-column
              width="120px"
              label="质量交接方式">
              <template slot-scope="scope">
                <el-input v-model="scope.row.qualityHandoverType" size="mini" disabled/>
              </template>
            </el-table-column>
        </el-table></div>
        <el-form-item label="备注" style="margin-top: 30px">
          <el-input v-model="form.comments" :rows="2" type="textarea" disabled />
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">关闭</el-button>
      <!--<el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>-->
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/voyage'
import pdf from '@/components/pdf'
import { getPort } from '@/api/port'
import { getContract } from '@/api/contract'
import { parseTime } from '@/utils/index'
import { getSailing } from '@/api/sailing'
import { getOrganizationByCriteria } from '@/api/organization'

export default {
  components: { 'v-pdf': pdf },
  props: {
    isSee: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
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
      portData: [],
      contactData: [],
      sailingData: [],
      organizationData: [],
      rules: {
        // companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        // supplyScope: [{ required: true, message: '请输入供货范围', trigger: 'blur' }],
        // contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        // contactPhone: [{ required: true, validator: validateContactPhone, trigger: 'blur' }]
      }
    }
  },

  watch: {
  },
  created() {
    getOrganizationByCriteria({ organizationType: 'SHIP_DEPT' }).then(res => {
      this.organizationData = res
    })
    getPort({ sort: 'createdDate,desc' }).then((res) => {
      this.portData = res.content
    })
    getContract({ status: 'SIGN,EXECUTE,FINISH' }).then(res => {
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
    changeContracts(id, type) {
      console.log(id, type)
      if (type) {
        var a = JSON.parse(JSON.stringify(this.form.voyageCargoInfos)).concat(this.contactData.find(item => {
          return item.contractId === id
        }).contractCargoInfos.map(j => {
          return j
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
        var a = this.form.voyageCargoInfos.map((item) => {
          if (item.contractId === id) {
            return null
          } else {
            return item
          }
        }).filter(item => {
          return item
        })
        var b = this.form.voyageInstructions.map((item) => {
          if (item.contractId === id) {
            return null
          } else {
            return item
          }
        }).filter(item => {
          return item
        })

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
      console.log()
      this.form.contractsIds.map(item => {
        this.form.contracts.push(this.contactData.find(value => {
          return value.contractId == item
        }))
      })
      console.log(this.form)
      const fd = this.form
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isSee) {
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
        voyageInstructions: []
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
