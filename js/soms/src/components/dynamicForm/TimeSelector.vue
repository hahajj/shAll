<template>
  <el-form-item :label="label" :prop="conf.isRequired==0?name:'acc'" label-width="120px">
    <el-date-picker
      v-model="currentValue"
      :configkey="configkey"
      :disabled="conf.isRequired==2||onlySee"
      type="datetime"
      placeholder="选择日期时间"
      size="mini"
      value-format="timestamp"
      @input="onInputEvent"
      @change="changeTime(currentValue)"/>
  </el-form-item>
</template>

<script>
import formMixins from '@/mixins/form-model'
export default {
  mixins: [formMixins],
  props: ['label', 'name', 'value', 'fieldtype', 'configkey','onlySee'],
  data() {
    return {
      currentValue: this.value
    }
  },
  methods:{
    changeTime(val){
      this.$emit('timeChange', val)
    }
  }
}
</script>
