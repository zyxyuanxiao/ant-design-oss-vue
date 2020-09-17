<template>
  <div style="width: 100%">
    <a-date-picker
      :disabled="item.disabled || item.is_readOnly"
      :placeholder="item.placeholder"
      @change="handleDateChange"
      :defaultValue="moment(item.conf.default_value, 'YYYY-MM-DD HH:mm:ss')"
      :showTime="showTime"
      :format="dateFormat"
    />
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'From-Date-Picker',
  props: ['item'],
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
      }
    }
  },
  methods: {
    moment,
    handleDateChange (mom, dateStr) {
      this.$emit('change', dateStr)
    }
  }
}
</script>

<style scoped>

</style>