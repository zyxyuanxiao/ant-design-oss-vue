<template>
  <div>
    <a-radio-group
      buttonStyle="solid"
      :disabled="item.disabled || item.is_readOnly"
      v-model="item.conf.default_value"
    >
      <a-radio v-for="(itemA, key) in item.conf.params"
               :key="key"
               :value="itemA.value+''">
        {{ itemA.label }}
      </a-radio>
    </a-radio-group>
  </div>
</template>

<script>
export default {
  name: 'From-Radio',
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
      },
      value1: 0
    }
  },
  mounted () {
    /* if (this.item.conf.default_value !== '') {
      this.item.conf.default_value = parseInt(this.item.conf.default_value)
    } */
  }
}
</script>

<style scoped>

</style>