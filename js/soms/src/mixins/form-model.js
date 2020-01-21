export default {
  props: ['name', 'value', 'configkey', 'conf'],

  data() {
    return {
      currentValue: this.value
    }
  },
  methods: {
    onInputEvent(value) {
      this.$emit('input', this.name, value, this.configkey, this.conf)// input父类  name value   configkey[detailKey，index] conf所有参数
    },
    reset() {
      this.currentValue = ''
    }
  },
  watch: {
    value(val) {
      this.currentValue = val
    }
  }
}
