<template>

  <el-form-item :label="label" :prop="conf.isRequired==0?name:'acc'" label-width="120px">
    <el-input
      :value="currentValue"
      :placeholder="placeholder"
      :type="conf.fieldType==0?'number':label=='备注'?'textarea':'text'"
      :row="label=='备注'?2:''"
      :style="{width:(label=='备注'?'700px':'')}"
      :disabled="conf.isRequired==2||onlySee"
      :configkey="configkey"
      size="mini"
      @input="onInputEvent"/>
  </el-form-item>
</template>

<script>
import formMixins from '@/mixins/form-model'
export default {
  name: 'TextInput',
  mixins: [formMixins],
  props: ['placeholder', 'label', 'name', 'value', 'fieldtype', 'groupName', 'configkey','onlySee'],
  data() {
    return {
      currentValue: this.value
    }
  }
}
</script>

<style scoped>
</style>
