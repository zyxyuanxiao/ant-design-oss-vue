<template>
  <a-drawer
    :title="title"
    :width="width"
    placement="right"
    :closable="false"
    @close="close"
    :visible="visible">
  
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item label="模型名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-multi-select-tag type="list_multi" v-decorator="['modelId', validatorRules.modelId]" :trigger-change="true" dictCode="modelName" placeholder="请选择模型名称"/>
        </a-form-item>
        <a-form-item label="流程环节" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-multi-select-tag type="list_multi" v-decorator="['actId', validatorRules.actId]" :trigger-change="true" dictCode="actName" placeholder="请选择流程环节"/>
        </a-form-item>
        <a-form-item label="字段名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['fieldName', validatorRules.fieldName]" placeholder="请输入字段名称"></a-input>
        </a-form-item>
        <a-form-item label="字段编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['fieldCode', validatorRules.fieldCode]" placeholder="请输入字段编码"></a-input>
        </a-form-item>
        <a-form-item label="是否必填" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="radio" v-decorator="['isRequired', validatorRules.isRequired]" :trigger-change="true" dictCode="isRequired" placeholder="请选择是否必填"/>
        </a-form-item>
        <a-form-item label="是否隐藏" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="radio" v-decorator="['isHidden', validatorRules.isHidden]" :trigger-change="true" dictCode="isHidden" placeholder="请选择是否隐藏"/>
        </a-form-item>
        <a-form-item label="默认值类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['defaultType', validatorRules.defaultType]" :trigger-change="true" dictCode="defaultType" placeholder="请选择默认值类型"/>
        </a-form-item>
        <a-form-item label="默认值" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['defaultValue']" placeholder="请输入默认值"></a-input>
        </a-form-item>
        
      </a-form>
    </a-spin>
    <a-button type="primary" @click="handleOk">确定</a-button>
    <a-button type="primary" @click="handleCancel">取消</a-button>
  </a-drawer>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { validateDuplicateValue } from '@/utils/util'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import JMultiSelectTag from "@/components/dict/JMultiSelectTag"
  
  export default {
    name: "TicketFieldConfModal",
    components: { 
      JDictSelectTag,
      JMultiSelectTag,
    },
    data () {
      return {
        form: this.$form.createForm(this),
        title:"操作",
        width:800,
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
          modelId: {
            rules: [
              { required: true, message: '请输入模型名称!'},
            ]
          },
          actId: {
            rules: [
              { required: true, message: '请输入流程环节!'},
            ]
          },
          fieldName: {
            rules: [
              { required: true, message: '请输入字段名称!'},
            ]
          },
          fieldCode: {
            rules: [
              { required: true, message: '请输入字段编码!'},
            ]
          },
          isRequired: {
            rules: [
              { required: true, message: '请输入是否必填!'},
            ]
          },
          isHidden: {
            rules: [
              { required: true, message: '请输入是否隐藏!'},
            ]
          },
          defaultType: {
            rules: [
              { required: true, message: '请输入默认值类型!'},
            ]
          },
        },
        url: {
          add: "/ticket/ticketFieldConf/add",
          edit: "/ticket/ticketFieldConf/edit",
        }
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'modelId','actId','fieldName','fieldCode','isRequired','isHidden','defaultType','defaultValue','createTime'))
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model, values);
            console.log("表单提交数据",formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }
         
        })
      },
      handleCancel () {
        this.close()
      },
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'modelId','actId','fieldName','fieldCode','isRequired','isHidden','defaultType','defaultValue','createTime'))
      }
      
    }
  }
</script>

<style lang="less" scoped>
/** Button按钮间距 */
  .ant-btn {
    margin-left: 30px;
    margin-bottom: 30px;
    float: right;
  }
</style>