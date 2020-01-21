<template>
  <el-form-item :label="label">
    <el-select v-model="currentValue" @input="onInputEvent" size="mini">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
  </el-form-item>
</template>

<script>
import formMixins from '@/mixins/form-model'
export default {
  name: 'SelectList',
  mixins: [formMixins],
  props: ['name', 'label', 'value', 'options','fieldtype'],
  data() {
    return {
      currentValue: this.value
    }
  }
}
</script>
