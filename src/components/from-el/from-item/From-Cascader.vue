<template>
  <div>
    <a-cascader
      :size="item.size ? item.size : 'default'"
      :options="item.conf.params"
      :disabled="item.disabled || item.is_readOnly"
      :showSearch="{ cascaderFilter }"
      placeholder=""
      v-model="valueCascader"
      @change="onChange"
    />
  </div>
</template>

<script>
export default {
  name: 'From-Cascader',
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
      valueCascader: this.value
    }
  },
  mounted () {
    if (this.item.conf.default_value === '') {
      this.item.conf.default_value = []
    }
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal === '') {
        this.valueCascader = []
        return
      }
      this.valueCascader = newVal
    }
  },
  methods: {
    onChange() {
      this.$emit('input', this.valueCascader)
      this.$emit('onChange', this.valueCascader)
    },
    cascaderFilter (inputValue, path) {
      // 级联过滤函数
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    }
  }
}
</script>

<style scoped>

</style>