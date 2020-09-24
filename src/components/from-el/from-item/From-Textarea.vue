<template>
  <div>
    <a-textarea
      :placeholder="item.placeholder"
      :disabled="item.disabled || item.is_readOnly"
      v-model="valueTextarea"
      :autoSize="{ minRows: 6, maxRows: 24 }"
      @change="onChange"
    />
  </div>
</template>

<script>
export default {
  name: 'From-Textarea',
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
      valueTextarea: this.value
    }
  },
  watch: {
    value(newVal, oldVal) {
      this.valueTextarea = newVal
    }
  },
  methods: {
    onChange() {
      this.$emit('input', this.valueTextarea)
      this.$emit('onChange', this.valueTextarea)
    }
  }
}
</script>

<style scoped>

</style>