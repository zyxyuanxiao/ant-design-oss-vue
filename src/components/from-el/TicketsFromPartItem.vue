<script type="text/jsx">
import textTest from './from-item/From-Text'
import selectTest from './from-item/From-Select'
import timeTest from './from-item/From-Date-Picker'
import treeSelTest from './from-item/From-Tree'
import checkboxTest from './from-item/From-Checkbox'
import cascadeTest from './from-item/From-Cascader'
import radioTest from './from-item/From-Radio'
import integerTest from './from-item/From-Number'
import multiRowTest from './from-item/From-Textarea'
import attachfileTest from './from-item/From-Upload'
import decimalsTest from './from-item/From-Decimals'

export default {
  name: 'DynamicFormPartItem',
  props: ['items'],
  components: {
    textTest,
    selectTest,
    timeTest,
    treeSelTest,
    checkboxTest,
    cascadeTest,
    radioTest,
    integerTest,
    multiRowTest,
    attachfileTest,
    decimalsTest
  },
  data () {
    return {}
  },
  methods: {},
  render () {
    let item = this.items
    // 如果是input输入框
    if (item.type === 'singleRowText') {
      return (<text-test item={item}></text-test>)
    } else if (item.type === 'listSel') {
      return (<select-test item={item}></select-test>)
    } else if (item.type === 'multiSel') {
      return (<checkbox-test item={item}></checkbox-test>)
    } else if (item.type === 'dateTime') {
      return (<time-test item={item}></time-test>)
    } else if (item.type === 'singleSel') {
      return (<radio-test item={item}></radio-test>)
    } else if (item.type === 'cascader') {
      return (<cascade-test item={item}></cascade-test>)
    } else if (item.type === 'treeSel') {
      return (<tree-sel-test item={item}></tree-sel-test>)
    } else if (item.type === 'int') {
      return (<integer-test item={item}></integer-test>)
    } else if (item.type === 'multiRowText') {
      return (<multi-row-test item={item}></multi-row-test>)
    } else if (item.type === 'attachfile') {
      return (<attachfile-test item={item}></attachfile-test>)
    } else if (item.type === 'double') {
      return (<decimals-test item={item}></decimals-test>)
    } else {
      return (<div>未识别的组件类型：【{item.type}】!</div>)
    }
  },

}
</script>
