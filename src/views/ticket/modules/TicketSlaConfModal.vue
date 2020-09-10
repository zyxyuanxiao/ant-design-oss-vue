<template>
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
      <a-form :form="form">

        <a-form-item label="模型名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-multi-select-tag type="list_multi" v-decorator="['modelId', validatorRules.modelId]" :trigger-change="true" dictCode="modelName" placeholder="请选择模型名称"/>
        </a-form-item>
        <a-form-item label="开始计算的流程环节" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-multi-select-tag type="list_multi" v-decorator="['beginActId', validatorRules.beginActId]" :trigger-change="true" dictCode="actName" placeholder="请选择开始计算的流程环节"/>
        </a-form-item>
        <a-form-item label="结束计算的流程环节" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-multi-select-tag type="list_multi" v-decorator="['endActId', validatorRules.endActId]" :trigger-change="true" dictCode="actName" placeholder="请选择结束计算的流程环节"/>
        </a-form-item>
        <a-form-item label="当前逾期设置数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="['num', validatorRules.num]" placeholder="请输入当前逾期设置数" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="逾期设置单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="radio" v-decorator="['unit', validatorRules.unit]" :trigger-change="true" dictCode="unit" placeholder="请选择逾期设置单位"/>
        </a-form-item>

      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { validateDuplicateValue } from '@/utils/util'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import JMultiSelectTag from "@/components/dict/JMultiSelectTag"



  export default {
    name: "TicketSlaConfModal",
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
          beginActId: {
            rules: [
              { required: true, message: '请输入开始计算的流程环节!'},
            ]
          },
          endActId: {
            rules: [
              { required: true, message: '请输入结束计算的流程环节!'},
            ]
          },
          num: {
            rules: [
              { required: true, message: '请输入当前逾期设置数!'},
            ]
          },
          unit: {
            rules: [
              { required: true, message: '请输入逾期设置单位!'},
            ]
          },
        },
        url: {
          add: "/ticket/ticketSlaConf/add",
          edit: "/ticket/ticketSlaConf/edit",
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
          this.form.setFieldsValue(pick(this.model,'modelId','beginActId','endActId','num','unit','createTime'))
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
        this.form.setFieldsValue(pick(row,'modelId','beginActId','endActId','num','unit','createTime'))
      },

      
    }
  }
</script>