<template>
  <div>
    <a-input-number
      :size="item.size ? item.size : 'default'"
      :max="item.conf.double_max"
      :min="item.conf.double_min"
      :disabled="item.disabled || item.is_readOnly"
      :step="0.1"
      style="width: 100%"
      v-model="item.conf.default_value"
      :placeholder="item.placeholder"
    />
  </div>
</template>

<script>
export default {
  name: 'From-Decimals',
  props: ['item'],
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
  }
}
</script>

<style scoped>

</style>
