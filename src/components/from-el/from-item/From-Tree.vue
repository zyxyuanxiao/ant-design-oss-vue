<template>
  <div>
    <a-form-model-item
      :ref="item.code"
      :label="item.name"
      :prop="item.code"
      :label-col="labelCol"
      :rules="{
        required: item.is_required === 1,
        message: item.name + '不能为空',
        trigger: 'blur',
      }"
      :wrapper-col="wrapperCol">
      <a-tree-select
        v-model="item.conf.default_value"
        style="width: 100%"
        :tree-data="treeData"
        tree-checkable
        :disabled="item.disabled || item.readOnly"
        :show-checked-strategy="SHOW_PARENT"
        search-placeholder="Please select"
      />
    </a-form-model-item>
  </div>
</template>

<script>
import { TreeSelect } from 'ant-design-vue'

const SHOW_PARENT = TreeSelect.SHOW_PARENT
export default {
  name: 'From-Tree',
  props: ['item'],
  data () {
    return {
      value: ['0-0-0'],
      treeData: [],
      SHOW_PARENT,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
  }
}
</script>

<style scoped>

</style>