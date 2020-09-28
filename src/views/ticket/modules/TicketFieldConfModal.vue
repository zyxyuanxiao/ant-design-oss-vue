<template>
  <div>
    <j-modal
      :title="title"
      :width="width"
      :visible="visible"
      :confirmLoading="confirmLoading"
      switchFullscreen
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="关闭">
      <a-spin :spinning="confirmLoading">
        <a-form :form="formAdd">
          <a-form-item label="模型名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <!--<j-multi-select-tag type="list_multi" v-decorator="['modelId', validatorRules.modelId]" :trigger-change="true"
                                dictCode="modelName" placeholder="请选择模型名称"/>-->
            <a-select mode="tags"
                      @change="modelChange"
                      v-decorator="['modelId', validatorRules.modelId]"
                      placeholder="请选择模型名称">
              <a-select-option v-for="item in modelList" :key="item.id">
                {{item.name}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="流程环节" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <!--  <j-multi-select-tag type="list_multi" v-decorator="['actId', validatorRules.actId]" :trigger-change="true"
                                  dictCode="actName" placeholder="请选择流程环节"/>-->
            <a-select mode="tags"
                      @change="flowChange"
                      v-decorator="['actId', validatorRules.actId]"
                      placeholder="请选择流程环节">
              <a-select-option v-for="item in flowList" :key="item.id">
                {{item.name}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="字段名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <!--<j-search-select-tag v-decorator="['fieldName', validatorRules.fieldName]" dict="ticketFieldCode"/>-->
            <a-select
              showSearch
              v-decorator="['fieldName', validatorRules.fieldName]"
              allowClear>
              <a-select-option v-for="item in fieldList" :key="item.code">
                {{item.name}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="字段编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select
              showSearch
              v-decorator="['fieldCode', validatorRules.fieldCode]"
              allowClear>
              <a-select-option v-for="item in fieldList" :key="item.code">
                {{item.name}}
              </a-select-option>
            </a-select>
            <!--<j-search-select-tag v-decorator="['fieldCode', validatorRules.fieldCode]" dict="ticketFieldCode"/>-->
          </a-form-item>
          <a-form-item label="是否必填" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <j-dict-select-tag type="radio" v-decorator="['isRequired', validatorRules.isRequired]" :trigger-change="true"
                               dictCode="isRequired" placeholder="请选择是否必填"/>
          </a-form-item>
          <a-form-item label="是否只读" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <j-dict-select-tag type="radio" v-decorator="['isOnly', validatorRules.isOnly]" :trigger-change="true"
                               dictCode="isOnly" placeholder="请选择是否只读"/>
          </a-form-item>
          <a-form-item label="是否隐藏" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <j-dict-select-tag type="radio" v-decorator="['isHidden', validatorRules.isHidden]" :trigger-change="true"
                               dictCode="isHidden" placeholder="请选择是否隐藏"/>
          </a-form-item>
          <a-form-item label="默认值类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <j-dict-select-tag type="list" v-decorator="['defaultType', validatorRules.defaultType]"
                               :trigger-change="true" dictCode="defaultType" placeholder="请选择默认值类型"/>
          </a-form-item>
          <a-form-item label="默认值" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['defaultValue']" placeholder="请输入默认值"></a-input>
          </a-form-item>
        </a-form>
      </a-spin>
    </j-modal>
    <j-modal
      :title="title"
      :width="width"
      :visible="visible2"
      :confirmLoading="confirmLoading"
      switchFullscreen
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="关闭">
      <a-spin :spinning="confirmLoading">
        <a-form :form="formUp">
          <a-form-item label="模型名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <j-multi-select-tag type="list_multi" v-decorator="['modelId', validatorRules.modelId]" :trigger-change="true"
                                dictCode="modelName" placeholder="请选择模型名称"/>
          </a-form-item>
          <a-form-item label="流程环节" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <j-multi-select-tag type="list_multi" v-decorator="['actId', validatorRules.actId]" :trigger-change="true"
                                dictCode="actName" placeholder="请选择流程环节"/>
          </a-form-item>
          <a-form-item label="字段名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <j-search-select-tag v-decorator="['fieldName', validatorRules.fieldName]" dict="ticketFieldCode"/>
          </a-form-item>
          <a-form-item label="字段编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <j-search-select-tag v-decorator="['fieldCode', validatorRules.fieldCode]" dict="ticketFieldCode"/>
          </a-form-item>
          <a-form-item label="是否必填" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <j-dict-select-tag type="radio" v-decorator="['isRequired', validatorRules.isRequired]" :trigger-change="true"
                               dictCode="isRequired" placeholder="请选择是否必填"/>
          </a-form-item>
          <a-form-item label="是否只读" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <j-dict-select-tag type="radio" v-decorator="['isOnly', validatorRules.isOnly]" :trigger-change="true"
                               dictCode="isOnly" placeholder="请选择是否只读"/>
          </a-form-item>
          <a-form-item label="是否隐藏" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <j-dict-select-tag type="radio" v-decorator="['isHidden', validatorRules.isHidden]" :trigger-change="true"
                               dictCode="isHidden" placeholder="请选择是否隐藏"/>
          </a-form-item>
          <a-form-item label="默认值类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <j-dict-select-tag type="list" v-decorator="['defaultType', validatorRules.defaultType]"
                               :trigger-change="true" dictCode="defaultType" placeholder="请选择默认值类型"/>
          </a-form-item>
          <a-form-item label="默认值" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['defaultValue']" placeholder="请输入默认值"></a-input>
          </a-form-item>
        </a-form>
      </a-spin>
    </j-modal>
  </div>
</template>

<script>
import { httpAction } from '@/api/manage'
import { getFlowListByModeId, getFieldListByProcess } from '@/api/tickets'
import pick from 'lodash.pick'
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import JMultiSelectTag from '@/components/dict/JMultiSelectTag'
import JSearchSelectTag from '@/components/dict/JSearchSelectTag'
import { mapGetters } from 'vuex'

export default {
  name: 'TicketFieldConfModal',
  components: {
    JDictSelectTag,
    JMultiSelectTag,
    JSearchSelectTag
  },
  props: ['modelList'],
  data () {
    return {
      formAdd: this.$form.createForm(this),
      formUp: this.$form.createForm(this),
      title: '操作',
      width: 800,
      visible: false,
      visible2: false,
      model: {},
      isTypeId: 'up',
      modelIds: [],
      flowList: [],
      flowIds: [],
      fieldList: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      validatorRules: {
        modelId: {
          rules: [
            { required: true, message: '请输入模型名称!' }
          ]
        },
        actId: {
          rules: [
            { required: true, message: '请输入流程环节!' }
          ]
        },
        fieldName: {
          rules: [
            { required: true, message: '请输入字段名称!' }
          ]
        },
        fieldCode: {
          rules: [
            { required: true, message: '请输入字段编码!' }
          ]
        },
        isRequired: {
          rules: [
            { required: true, message: '请选择是否必填!' }
          ]
        },
        isOnly: {
          rules: [
            { required: true, message: '请选择是否只读!' }
          ]
        },
        isHidden: {
          rules: [
            { required: true, message: '请选择是否隐藏!' }
          ]
        },
        defaultType: {
          rules: [
            { required: true, message: '请输入默认值类型!' }
          ]
        }
      },
      url: {
        add: '/ticket/ticketFieldConf/add',
        edit: '/ticket/ticketFieldConf/edit'
      }
    }
  },
  created () {
  },
  methods: {
    ...mapGetters(['userInfo']),
    add () {
      this.edit({})
    },
    edit (record) {
      this.isTypeId = JSON.stringify(record) === '{}' ? 'add' : 'up'
      if(this.isTypeId === 'add') { //使用if结构是解决add时使用的还是up的form错乱导致报错问题
        this.formAdd.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        this.$nextTick(() => {
          this.formAdd.setFieldsValue(pick(this.model, 'modelId', 'actId', 'fieldName', 'fieldCode', 'isRequired', 'isOnly', 'isHidden', 'defaultType', 'defaultValue', 'createTime'))
        })
      } else {
        this.formUp.resetFields()
        this.model = Object.assign({}, record)
        this.visible2 = true
        this.$nextTick(() => {
          this.formUp.setFieldsValue(pick(this.model, 'modelId', 'actId', 'fieldName', 'fieldCode', 'isRequired', 'isOnly', 'isHidden', 'defaultType', 'defaultValue', 'createTime'))
        })
      }
    },
    close () {
      this.$emit('close')
      this.visible = false
      this.visible2 = false
    },
    handleOk () {
      const that = this
      // 触发表单验证
      let form = this.isTypeId === 'add' ? this.formAdd : this.formUp
      form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
          for (let key in values) {
            if (values.hasOwnProperty(key)) {  // 是否有指定的键
              if (Array.isArray(values[key])) {
                values[key] = values[key].join(',')
              }
            }
          }
          let formData = Object.assign(this.model, values)
          console.log('表单提交数据', formData)
          httpAction(httpurl, formData, method).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.$emit('ok')
            } else {
              that.$message.warning(res.message)
            }
          }).finally(() => {
            that.confirmLoading = false
            that.close()
          })
        }
      })
    },
    handleCancel () {
      this.close()
    },
    popupCallback (row) {
      let form = this.isTypeId === 'add' ? this.formAdd : this.formUp
      form.setFieldsValue(pick(row, 'modelId', 'actId', 'fieldName', 'fieldCode', 'isRequired', 'isOnly', 'isHidden', 'defaultType', 'defaultValue', 'createTime'))
    },
    getFlowListByModeId () {
      let apiKey = this.userInfo().apikey
      let data = {
        modelIds: this.modelIds
      }
      getFlowListByModeId(data, apiKey).then(response => {
        this.flowList = response.result
      }).catch(error => {
        console.log(error)
      })
    },
    getFieldListByProcess (data) {
      let apiKey = this.userInfo().apikey
      getFieldListByProcess(data, apiKey).then(response => {
        this.fieldList = response.result
      }).catch(error => {
        console.log(error)
      })
    },
    modelChange (values) {
      // console.log(values)
      this.modelIds = values
      this.getFlowListByModeId()
    },
    flowChange (values) {
      console.log(values)
      let data = {
        modelIds: this.modelIds,
        process: values
      }
      this.getFieldListByProcess(data)
    }
  }
}
</script>