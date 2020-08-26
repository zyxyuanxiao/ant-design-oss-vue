<template>
  <div>
    <a-spin :spinning="spinnings">
      <a-form-model :model="formConfig" ref="formConfig" style="display: flex;flex-wrap:wrap">
        <a-form-model-item
          v-bind:class="[item.type === 'multiRowText' || item.type === 'table' || item.type === 'timeAxis' ||  item.type === 'attachfile' ? 'form-width-row': 'form-width']"
          :hidden="item.is_hidden"
          v-for="(item, index) in formConfig.formFiles"
          :label="item.name"
          :label-col="item.type === 'multiRowText' || item.type === 'table'|| item.type === 'timeAxis' || item.type === 'attachfile' ?  labelCol : labelCol2"
          :prop="'formFiles.'+ index +'.conf.default_value'"
          :key="item.code"
          :rules="{
            required: item.is_required === 1,
            message: item.name + '不能为空',
            trigger: 'blur',
            }"
          :wrapper-col="item.type === 'multiRowText' || item.type === 'table' || item.type === 'timeAxis' ||  item.type === 'attachfile' ?  wrapperCol : wrapperCol2"
        >
          <text-test :item="item" v-if="item.type === 'singleRowText'"></text-test>
          <radio-test :item="item" v-else-if="item.type === 'singleSel'"></radio-test>
          <checkbox-test :item="item" v-else-if="item.type === 'multiSel'"></checkbox-test>
          <select-test :item="item" v-else-if="item.type === 'listSel'"></select-test>
          <time-test :item="item" v-else-if="item.type === 'dateTime'"></time-test>
          <cascade-test :item="item" v-else-if="item.type === 'cascader'"></cascade-test>
          <tree-sel-test :item="item" v-else-if="item.type === 'treeSel'"></tree-sel-test>
          <integer-test :item="item" v-else-if="item.type === 'int'"></integer-test>
          <multi-row-test :item="item" v-else-if="item.type === 'multiRowText'"></multi-row-test>
          <attachfile-test :item="item" v-else-if="item.type === 'attachfile'"
                           @onUpLoad="onUpLoad"></attachfile-test>
          <decimals-test :item="item" v-else-if="item.type === 'double'"></decimals-test>
          <table-test :item="item" v-else-if="item.type=== 'table'"></table-test>
          <table-test :item="item" v-else-if="item.type=== 'timeAxis'"></table-test>
          <!--<dynamic-form-part-item
            :items="item instanceof Array?item[1]:item">
          </dynamic-form-part-item>-->
        </a-form-model-item>
      </a-form-model>
      <div style="display: flex;justify-content:center" v-show="allotShow">
        <div v-for="(item, index) in submitBtn" :key="index" style="padding: 15px 10px;">
          <a-button style="padding: 0 15px;height: 35px;"
                    type="primary"
                    @click="submitForm('formConfig', item)"
          >
            {{item.btnName}}
          </a-button>
        </div>
        <div style="padding: 15px 10px;" v-if="operation === 'details'">
          <a-button type="primary" block @click="updateFeedback('formConfig')">保存</a-button>
        </div>
        <!--v-if="operation === 'details'"-->
        <div style="padding: 15px 10px;" v-if="operation === 'details'">
          <a-select style="width: 80px;height: 35px;" placeholder="更多" @change="handleChange">
            <a-select-option value="reassign">
              改派
            </a-select-option>
            <a-select-option value="putUp">
              挂起
            </a-select-option>
          </a-select>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { FormModel } from 'ant-design-vue'
import DynamicFormPartItem from '../from-el/TicketsFromPartItem'
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
import tableTest from './from-item/From-Table'

export default {
  name: 'Tickets-From',
  props: ['formConfig', 'submitBtn', 'allotShow', 'operation', 'spinnings'],
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      labelCol2: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 }
      },
      wrapperCol2: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      typeList: ['multiRowText', 'table', 'attachfile'],
      isShow: true
    }
  },
  mounted () {
    console.log(this.formConfig)
  },
  methods: {
    submitForm (formName, item) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('click', item)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleChange (value) {
      console.log(value)
    },
    updateFeedback (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('updateFeedback', '')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onUpLoad (fileList) {
      this.$emit('uploadFile', fileList)
    },
    isShowData () {
      this.isShow = !this.isShow
    }
  },
  components: {
    [FormModel.name]:
    FormModel,
    DynamicFormPartItem,
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
    decimalsTest,
    tableTest
  }
}
</script>

<style scoped>
  .form-width {
    width: 50%;
  }

  .form-width-row {
    width: 100%;
  }
</style>