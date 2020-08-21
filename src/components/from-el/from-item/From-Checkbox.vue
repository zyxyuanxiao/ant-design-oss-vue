<template>
  <div>
    <a-checkbox-group
      v-model="item.conf.default_value"
      :disabled="item.disabled || item.readOnly"
      name="checkboxGroup"
      :options="item.conf.params"
    />
  </div>
</template>

<script>
export default {
  name: 'From-Checkbox',
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