<template>
  <div>
    <a-cascader
      :size="item.size ? item.size : 'default'"
      :options="item.conf.params"
      :disabled="item.disabled || item.readOnly"
      :showSearch="{ cascaderFilter }"
      placeholder=""
      v-model="item.conf.default_value"
    />
  </div>
</template>

<script>
export default {
  name: 'From-Cascader',
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
  mounted () {
    if (this.item.conf.default_value === '') {
      this.item.conf.default_value = []
    }
  },
  methods: {
    cascaderFilter (inputValue, path) {
      // 级联过滤函数
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    }
  }
}
</script>

<style scoped>

</style>