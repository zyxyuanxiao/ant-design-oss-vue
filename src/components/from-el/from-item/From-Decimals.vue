<template>
  <div>
    <a-input-number
      :size="item.size ? item.size : 'default'"
      :max="item.conf.double_max"
      :min="item.conf.double_min"
      :disabled="item.disabled || item.is_readOnly"
      :step="0.1"
      style="width: 100%"
      v-model="valueDecimals"
      :placeholder="item.placeholder"
      @change="onChange"
    />
  </div>
</template>

<script>
export default {
  name: 'From-Decimals',
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
      valueDecimals: this.value
    }
  },
  watch: {
    value(newVal, oldVal) {
      this.valueDecimals = newVal
    }
  },
  methods: {
    onChange() {
      this.$emit('input', this.valueDecimals)
      this.$emit('onChange', this.valueDecimals)
    }
  }
}
</script>

<style scoped>

</style>
