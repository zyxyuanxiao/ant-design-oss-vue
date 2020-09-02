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
        <a-form-item label="流程环节名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-multi-select-tag type="list_multi" v-decorator="['actId', validatorRules.actId]" :trigger-change="true" dictCode="actName" placeholder="请选择流程环节名称"/>
        </a-form-item>
        <a-form-item label="排版脚本" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea v-decorator="['typoScript']" rows="4" placeholder="请输入排版脚本"/>
        </a-form-item>
        <a-form-item label="改派脚本" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea v-decorator="['reassignmentScript']" rows="4" placeholder="请输入改派脚本"/>
        </a-form-item>
        <a-form-item label="下一节点处理人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="radio" v-decorator="['isPolicy', validatorRules.isPolicy]" :trigger-change="true" dictCode="isPolicy" placeholder="请选择下一节点处理人"/>
        </a-form-item>
        <a-form-item label="按钮名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-multi-select-tag type="list_multi" v-decorator="['btnId']" :trigger-change="true" dictCode="btnId" placeholder="请选择按钮名称"/>
        </a-form-item>
        <a-form-item label="处理人脚本" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea v-decorator="['policyScript']" rows="4" placeholder="请输入处理人脚本"/>
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
    name: "TicketModelConfModal",
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
              { required: true, message: '请输入流程环节名称!'},
            ]
          },
          isPolicy: {
            rules: [
              { required: true, message: '请输入下一节点处理人!'},
            ]
          },
        },
        url: {
          add: "/ticket/ticketModelConf/add",
          edit: "/ticket/ticketModelConf/edit",
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
          this.form.setFieldsValue(pick(this.model,'modelId','actId','typoScript','reassignmentScript','isPolicy','btnId','policyScript','createTime'))
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
        this.form.setFieldsValue(pick(row,'modelId','actId','typoScript','reassignmentScript','isPolicy','btnId','policyScript','createTime'))
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