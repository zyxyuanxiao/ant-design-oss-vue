<template>
  <div>
    <a-checkbox-group
      v-model="item.conf.default_value"
      :disabled="item.disabled || item.is_readOnly"
      name="checkboxGroup"
      :options="item.conf.params"
      @change="onChange"
    />
  </div>
</template>

<script>
export default {
  name: 'From-Checkbox',
  props: {
    item: {
      type: Object
    },
    value: {
      type: Array
    }
  },
  data () {
    return {
      valueCheckbox: this.value
    }
  },
  watch: {
    value(newVal, oldVal) {
      this.valueCheckbox = newVal
    }
  },
  methods: {
    onChange() {
      this.$emit('input', this.valueCheckbox)
      this.$emit('onChange', this.valueCheckbox)
    }
  }
}
</script>

<style scoped>

</style>