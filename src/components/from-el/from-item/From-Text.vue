<template>
  <a-input
    :maxLength="maxLength"
    :disabled="item.disabled || item.is_readOnly"
    v-model="valueText"
    @change="onChange"
  />
</template>

<script>
export default {
  name: 'From-Text',
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
      maxLength: 100,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      valueText: this.value
    }
  },
  watch: {
    value(newVal, oldVal) {
      this.valueText = newVal
    }
  },
  methods: {
    onChange() {
      this.$emit('input', this.valueText);
      this.$emit('onChange', this.valueText);
    }
  }
}
</script>

<style scoped>

</style>