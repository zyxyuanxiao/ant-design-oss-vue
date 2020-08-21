<template>
  <div>
    <a-select
      style="width: 100%"
      showSearch
      :disabled="item.disabled || item.readOnly"
      :options="item.conf.params"
      :filterOption="filterOption"
      :size="item.size ? item.size : 'default'"
      v-model="item.conf.default_value"
      allowClear
    />
  </div>
</template>

<script>
export default {
  name: 'From-Select',
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
  },
  methods: {
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
</script>

<style scoped>

</style>