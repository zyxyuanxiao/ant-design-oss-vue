<template>
  <div>
    <a-textarea
      :placeholder="item.placeholder"
      :disabled="item.disabled || item.readOnly"
      v-model="item.conf.default_value"
      :autoSize="{ minRows: 6, maxRows: 24 }"
    />
  </div>
</template>

<script>
export default {
  name: 'From-Textarea',
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