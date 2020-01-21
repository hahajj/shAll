<template>
  <div>
    <el-row>
      <el-form ref="formData" :rules="rule" :inline="true" :model="formData" class="demo-form-inline" style="padding-bottom: 100px">
        <div v-for="(value,key) in config" :span="8" :key="key">
          <div v-if="key!='buttons'">
            <el-col v-if="value.length>1&&value[0].detailGroupName!='时间点'" :span="24" style="clear: both">
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
            <div v-else>
              <el-col v-for="(field, index) in value" :span="field.detailName=='备注'?24:8" :key="index" :style="{clear:field.detailKey=='xhpjhgyl'?'both':''}">
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
                  :only-see="onlySee"
                  @input="updateForm"
                />
              </el-col>
            </div>

          </div>
        </div>
      </el-form>
    </el-row>

  </div>
</template>
<script>
import SelectList from '@/components/dynamicForm/SelectList'
import TextInput from '@/components/dynamicForm/TextInput'
import TimeSelector from '@/components/dynamicForm/TimeSelector'
export default {
  name: 'FormGenerator',
  components: { SelectList, TextInput, TimeSelector },
  props: ['config', 'value', 'reportType', 'reportObj', 'rules', 'isAdd', 'onlySee'],
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
  },
  methods: {
    typeFlag(fieldType) {
      return fieldType === '2' ? 'TimeSelector' : 'TextInput'
    },
    updateForm(fieldName, value, key, conf) {
    },
    agreeSub() {

    },
    rejectSub() {
    }
  }
}
</script>
