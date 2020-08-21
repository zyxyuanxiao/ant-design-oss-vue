<template>
  <div>
    <a-input-number
      :size="item.size ? item.size : 'default'"
      :max="item.conf.int_max"
      :min="item.conf.int_min"
      style="width: 100%"
      v-model="item.conf.default_value"
      :placeholder="item.placeholder"
    />
  </div>
</template>

<script>
export default {
  name: 'From-Number',
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