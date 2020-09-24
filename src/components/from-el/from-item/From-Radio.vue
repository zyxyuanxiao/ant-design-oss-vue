<template>
  <div>
    <a-radio-group
      buttonStyle="solid"
      :disabled="item.disabled || item.is_readOnly"
      v-model="valueRadio"
      @change="onChange"
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
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      value1: 0,
      valueRadio: this.value
    }
  },
  watch: {
    value(newVal, oldVal) {
      this.valueRadio = newVal
    }
  },
  methods: {
    onChange() {
      this.$emit('input', this.valueRadio)
      this.$emit('onChange', this.valueRadio)
    }
  }
}
</script>

<style scoped>

</style>