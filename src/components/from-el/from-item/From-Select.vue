<template>
  <div>
    <a-select
      style="width: 100%"
      showSearch
      :disabled="item.disabled || item.is_readOnly"
      :options="item.conf.params"
      :filterOption="filterOption"
      :size="item.size ? item.size : 'default'"
      v-model="valueSelect"
      allowClear
      @change="onChange"
    />
  </div>
</template>

<script>
export default {
  name: 'From-Select',
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
      valueSelect: this.value
    }
  },
  watch: {
    value (newVal, oldVal) {
      this.valueSelect = newVal
    }
  },
  methods: {
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    onChange() {
      this.$emit('input', this.valueSelect);
      this.$emit('onChange', this.valueSelect);
    }
  }
}
</script>

<style scoped>

</style>