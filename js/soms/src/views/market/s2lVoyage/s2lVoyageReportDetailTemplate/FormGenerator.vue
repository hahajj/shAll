<template>
  <div>
    <el-row>
      <el-form ref="formData" :rules="rule" :inline="true" :model="formData" class="demo-form-inline" style="padding-bottom: 100px">
        <div v-for="(value,key) in config" :span="8" :key="key">
          <div v-if="key!='船位'&&key!='时间点'&&key!='时长(小时)'" style="clear: both;"/>
          <div v-if="key!='buttons'" >
            <el-col v-if="(value.length>1||key==='计量')&&value[0].detailGroupName!='时间点'" :span="24" style="clear: both">
              <label style="color: #409eff;">{{ key= key==='消耗总量'?reportType==='正午'?'日消耗量':'航次消耗总量':key }}</label>
            </el-col>
            <div v-if="key=='计量'" >
              <div v-for="(items, indexs) in value" :key="indexs" style="clear:both">
                <el-col v-for="(field, index) in items" :key="index" :span="8">
                  <component
                    :is="typeFlag(field.fieldType)"
                    :key="key+indexs"
                    :label="field.detailName"
                    :value="formData[field.name]"
                    v-bind="field"
                    :options="field.options"
                    :ref="field.name"
                    :fieldtype="field.fieldType"
                    :configkey="key+','+indexs+','+index"
                    :conf="field"
                    :only-see="onlySee"
                    @input="updateForm"
                  />
                </el-col>
              </div>

            </div>
            <div v-else style="position: relative">
              <el-col v-for="(field, index) in value" :span="field.detailName=='备注'?24:8" :key="index" :style="{clear:field.detailKey=='xhpjhgyl'?'both':''}" style="position: relative">
                <component
                  :is="typeFlag(field.fieldType)"
                  :key="key+index"
                  :label="field.detailName"
                  :value="formData[field.name]"
                  v-bind="field"
                  :options="field.options"
                  :ref="field.name"
                  :fieldtype="field.fieldType"
                  :configkey="key+','+index"
                  :conf="field"
                  :only-see="onlySee||(!isAdd&&field.detailName==='时间点'&&reportType==='正午')"
                  @input="updateForm"
                  @timeChange="timeChange"
                />
                <!--<span v-if="field.detailName.includes('新增')">{{ field.name.replace('加油,新增', '') }}</span>-->
                <el-button v-if="field.detailName.includes('新增')&&!onlySee" type="danger" size="mini" style="position: absolute;top: 5px;" @click="deleteDiy(value,index,field.name)">删除</el-button>
              </el-col>
              <el-button v-if="key=='加油'&&!onlySee" type="primary" size="mini" style="position: absolute;right: -10px;top: 22px;" @click="addDiy(value)">自定义</el-button>
            </div>

          </div>
        </div>
      </el-form>
    </el-row>
    <div style="clear: both"/>
    <div v-if="!onlySee" style="float: right">
      <slot name="buttons" >
        <el-button type="primary" size="small" @click="submit">{{ onSubmitText }}</el-button>
        <el-button v-if="isAdd" type="default" size="small" @click="reset">{{ onResetText }}</el-button>
      </slot>
    </div>
    <div style="clear: both"/>
  </div>
</template>
<script>
import SelectList from '@/components/dynamicForm/SelectList'
import TextInput from '@/components/dynamicForm/TextInput'
import TimeSelector from '@/components/dynamicForm/TimeSelector'
import { queryLastedNoonOil, queryVoyageOil, queryTheLastReportTimePoint, queryVolumeError } from '@/api/s2lVoyageReportDetailTemplate'
import { parseTimeNoMin, parseTime } from '@/utils/index'

export default {
  name: 'FormGenerator',
  components: { SelectList, TextInput, TimeSelector },
  props: ['config', 'value', 'reportType', 'reportObj', 'rules', 'isAdd', 'onlySee', 'reportLabel'],
  data() {
    return {
      formData: this.value,
      onSubmitText: this.config.buttons.onSubmitText || '提交',
      onResetText: this.config.buttons.onResetText || '重置',
      rule: this.rules,
      oil: {},
      time: '',
      queryVolume: {}
    }
  },
  mounted() {
    if (this.reportType === '卸货离泊' && this.reportLabel === '航次结束') {
      queryVoyageOil({ voyageId: this.reportObj.voyageId }).then(res => {
        if (res) {
          this.oil = res
        } else {
          this.oil = {
            heavyOil: 0,
            lightOil: 0,
            lubricatingOil: 0
          }
        }
      })
    } else if (this.reportType === '正午') {
      if (this.isAdd) {
        var curDate = new Date()
        curDate = new Date(parseTimeNoMin(curDate) + ' 12:00:00').getTime()
        this.formData['时间点,timePoint'] = curDate
        this.formData = JSON.parse(JSON.stringify(this.formData))
        this.config['时间点'][0].detailValue = curDate
      }
      var obj = this.isAdd ? '' : { voyageReportId: this.reportObj.voyageReportId }
      queryLastedNoonOil(obj).then(res => {
        if (res) {
          this.oil = res
        } else {
          this.oil = {
            heavyOil: 0,
            lightOil: 0,
            lubricatingOil: 0
          }
        }
        return this.oil
      }).then(data => {

      })
    } else if (this.reportType === '停止卸货') {
      if (this.isAdd) {
        this.$notify({
          title: '请确认存在装货，本表单请优先填写时间点！且修改时间会清空数据',
          type: 'warning',
          duration: 5000
        })
      } else {
        this.queryVolumeError()
      }
    }
    if (this.reportLabel === '航次开始' && this.config['时间点'][0].detailValue) {
      this.config['时间点'][0].isRequired = 2
    }
  },
  methods: {
    queryVolumeError() {
      if (!this.formData['时间点,timePoint']) {
        this.$notify({
          title: '优先填写时间点！且修改时间会清空数据',
          type: 'warning',
          duration: 2500
        })
        return false
      }
      queryVolumeError({ voyageId: this.reportObj.voyageId, reportDate: parseTime(Number(this.formData['时间点,timePoint'])) }).then(res => {
        if (res) {
          this.queryVolume = res
          this.$notify({
            title: '此操作为修改时间点，会清空数据',
            type: 'warning',
            duration: 2500
          })
        }
      })
    },
    deleteDiy(value, index, name) {
      const newIndex = index
      value.splice(index, 1)
      delete this.formData[name]
      for (var i = newIndex; i < value.length; i++) {
        value[i].voyageReportDetailTemplateId = null
        value[i].s2lVoyageReportDetailId = null
        value[i].detailName = '新增' + (Number(value[i].detailName.replace('新增', '')) - 1)
        value[i].detailKey = value[i].detailName
      }
    },
    addDiy(val) {
      if (val.length < 6) {
        var obj = Object.assign({}, val[val.length - 1])
        obj.detailKey = '新增' + (val.length - 3 + 1)
        obj.detailName = '新增' + (val.length - 3 + 1)
        if (val.length > 3) {
          obj.name = '加油,新增' + (Number(val[val.length - 1].name.replace('加油,新增', '')) + 1)
        } else {
          obj.name = '加油,新增' + 1
        }
        obj.detailValue = ''
        obj.sortNum = Number(obj.sortNum) + 1
        obj.voyageReportDetailTemplateId = null
        obj.s2lVoyageReportDetailId = null
        obj.isRequired = 1
        obj.fieldType = 1
        val.push(obj)
      } else {
        this.$notify({
          title: '目前只支持三个自定义',
          type: 'warning',
          duration: 2500
        })
      }
    },
    typeFlag(fieldType) {
      return fieldType === '2' ? 'TimeSelector' : 'TextInput'
    },
    updateForm(fieldName, value, key, conf) { // config.name(即formdata Name)  ，value值 ，key值 , config
      if (this.isAdd && Object.keys(this.queryVolume).length === 0 && !key.includes('时间点') && this.reportType === '停止卸货' && !this.formData['时间点,timePoint'] && !key.includes('船位')) { // 停止卸货必须有限填写时间点
        this.$notify({
          title: '本表单请优先填写时间点！',
          type: 'warning',
          duration: 2500
        })
        this.formData[fieldName] = ''
        return false
      }
      const oldValue = this.formData[fieldName]// 记录之前的值 用于修改消耗油量
      this.formData[fieldName] = value
      if (key.split(',').length === 2) {
        this.config[key.split(',')[0]][key.split(',')[1]].detailValue = value
      } else {
        this.config[key.split(',')[0]][key.split(',')[1]][key.split(',')[2]].detailValue = value
      }
      if (!conf.detailName.includes('新增') && (this.reportType === '正午' || this.reportType === '卸货离泊') && (conf.detailGroupName === '主机' || conf.detailGroupName === '辅机' || conf.detailGroupName === '锅炉' || conf.detailGroupName === '加油') && fieldName.split(',')[1] !== 'speed') {
        const str = fieldName.split(',')[1]
        if (this.isAdd || (this.reportType === '卸货离泊' && this.reportLabel === '航次结束' && !this.config['消耗总量'][key.split(',')[1]].comments)) { // 新增则正常操作   修改则在目前基础上操作(卸货离泊航次结束 比较特殊第一次为新增  第二次为修改 comments字段为修改了几次)
          if (this.oil[str] == 0) {
            this.formData['消耗总量,' + str] = 0
            this.config['消耗总量'][key.split(',')[1]].detailValue = ''
          } else {
            // 卸货离泊 不存在加油
            this.formData['消耗总量,' + str] = this.oil[str] + (this.reportType === '卸货离泊' ? 0 : Number(this.formData['加油,' + str])) - (Number(this.formData['主机,' + str]) + Number(this.formData['辅机,' + str]) + Number(this.formData['锅炉,' + str] ? this.formData['锅炉,' + str] : 0))
            this.config['消耗总量'][key.split(',')[1]].detailValue = this.formData['消耗总量,' + str]
          }
        } else if (this.reportType !== '卸货离泊') {
          if (key.includes('加油')) {
            this.formData['消耗总量,' + str] = Number(this.formData['消耗总量,' + str]) + Number(value) - Number(oldValue)
            this.config['消耗总量'][key.split(',')[1]].detailValue = this.formData['消耗总量,' + str]
          } else {
            this.formData['消耗总量,' + str] = Number(this.formData['消耗总量,' + str]) - Number(value) + Number(oldValue)
            this.config['消耗总量'][key.split(',')[1]].detailValue = this.formData['消耗总量,' + str]
          }
        }
      } else if ((fieldName.includes('计量,shipVolume') || fieldName.includes('计量,shoreVolume')) && this.config[key.split(',')[0]][key.split(',')[1]].length > 4) { // length > 4为停止卸货
        // "shipVolumeError"  "shoreVolumeError"
        const valKey = this.config[key.split(',')[0]][key.split(',')[1]][key.split(',')[2]].detailKey// 获取key  key为shipVolume 4  key为shoreVolume 5
        const num = valKey === 'shipVolume' ? 4 : valKey === 'shoreVolume' ? 5 : null
        // 获取货物名称
        const detailGroupValue = this.config[key.split(',')[0]][key.split(',')[1]][key.split(',')[2]].detailGroupValue
        // 获取累计  值(岸基，船)
        const oldValue = this.queryVolume[detailGroupValue][valKey]
        // 相减取绝对值
        const newValue = Math.abs(Number(value) - Number(oldValue))
        // 如果存在 则修改form 及  config值
        if (num) {
          this.config[key.split(',')[0]][key.split(',')[1]][num].detailValue = newValue
          const valName = '计量' + ',' + this.config[key.split(',')[0]][key.split(',')[1]][key.split(',')[2]].detailKey + 'Error' + ',' + fieldName.split(',')[2]// formname
          this.formData[valName] = newValue
        }
      }
      // 强制刷新 数据  实现双向绑定
      this.formData = JSON.parse(JSON.stringify(this.formData))
    },
    timeChange(val) { // 时长需要通过时间点查询做计算
      queryTheLastReportTimePoint({ voyage: { voyageId: this.reportObj.voyageId }, voyageReportId: this.reportObj.voyageReportId, reportDate: val, reportType: this.reportType }).then(res => {
        this.formData['时长(小时),duration'] = res
        if (this.reportType !== '正午') {
          this.config['时长(小时)'][0].detailValue = res
        }
      })
      if (this.reportType === '停止卸货') { // 停止卸货需要优先填写时间点
        for (var name in this.formData) {
          if (name !== '时间点,timePoint' && !name.includes('计量,goodsType')) {
            this.formData[name] = null
          }
        }
        this.formData = JSON.parse(JSON.stringify(this.formData))
        this.queryVolumeError()
      }
    },
    submit() {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.$emit('submit', this.formData, this.config)
        }
      })
    },
    reset() {
      for (var name in this.formData) {
        if (!name.includes('计量,goodsType')) {
          this.formData[name] = null
        }
      }
      this.formData = JSON.parse(JSON.stringify(this.formData))
    }
  }
}
</script>
