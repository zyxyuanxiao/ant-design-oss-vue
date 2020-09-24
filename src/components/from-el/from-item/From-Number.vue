<template>
  <div>
    <a-input-number
      :size="item.size ? item.size : 'default'"
      :max="item.conf.int_max"
      :min="item.conf.int_min"
      :disabled="item.disabled || item.is_readOnly"
      style="width: 100%"
      v-model="valueNumber"
      :placeholder="item.placeholder"
      @change="onChange"
    />
  </div>
</template>

<script>
export default {
  name: 'From-Number',
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
      valueNumber: this.value
    }
  },
  watch: {
    value(newVal, oldVal) {
      this.valueNumber = newVal
    }
  },
  methods: {
    onChange() {
      this.$emit('input', this.valueNumber)
      this.$emit('onChange', this.valueNumber)
    }
  }
}
</script>

<style scoped>

</style>