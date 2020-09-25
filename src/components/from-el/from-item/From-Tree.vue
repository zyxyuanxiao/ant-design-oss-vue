<template>
  <div>
    <a-tree-select
      v-model="valueTree"
      style="width: 100%"
      :tree-data="treeData"
      tree-checkable
      :disabled="item.disabled || item.is_readOnly"
      :show-checked-strategy="SHOW_PARENT"
      search-placeholder="Please select"
      @change="onChange"
    />
  </div>
</template>

<script>
import { TreeSelect } from 'ant-design-vue'

const SHOW_PARENT = TreeSelect.SHOW_PARENT
export default {
  name: 'From-Tree',
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
      value: ['0-0-0'],
      treeData: [],
      valueTree: this.value,
      SHOW_PARENT
    }
  },
  watch: {
    value(newVal, oldVal) {
      this.valueTree = newVal
    }
  },
  methods: {
    onChange() {
      this.$emit('input', this.valueTree)
      this.$emit('onChange', this.valueTree)
    }
  }
}
</script>

<style scoped>

</style>