<template>
  <div style="width: 100%">
    <a-date-picker
      :disabled="item.disabled || item.is_readOnly"
      :placeholder="item.placeholder"
      :defaultValue="moment(valueTime, 'YYYY-MM-DD HH:mm:ss')"
      :showTime="showTime"
      :format="dateFormat"
      @change="onChange"
    />
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'From-Date-Picker',
  props: {
    item: {
      type: Object
    },
    value: {
      type: String
    }
  },
  data () {
    return {
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      showTime: true,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      valueTime: this.value
    }
  },
  watch: {
    value (newVal, oldVal) {
      this.valueTime = newVal
    }
  },
  methods: {
    moment,
    handleDateChange (mom, dateStr) {
      this.$emit('change', dateStr)
    },
    onChange(mom, dateStr) {
      this.$emit('change', dateStr)
      this.$emit('input', this.valueTime)
      this.$emit('onChange', this.valueTime)
    }
  }
}
</script>

<style scoped>

</style>