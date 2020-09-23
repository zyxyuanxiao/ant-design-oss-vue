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

        <a-form-item label="数据类型编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['dataTypeCode', validatorRules.dataTypeCode]" placeholder="请输入数据类型编码"></a-input>
        </a-form-item>
        <a-form-item label="数据类型名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['dataTypeName', validatorRules.dataTypeName]" placeholder="请输入数据类型名称"></a-input>
        </a-form-item>
        <a-form-item label="数值" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['dataTypeValue', validatorRules.dataTypeValue]" placeholder="请输入数值"></a-input>
        </a-form-item>
        <a-form-item label="上报日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择上报日期" v-decorator="['reportDate']" :trigger-change="true" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="上报时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择上报时间" v-decorator="['reportTime']" :trigger-change="true" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="标识人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['identityPeople']" placeholder="请输入标识人"></a-input>
        </a-form-item>
        <a-form-item label="标识时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择标识时间" v-decorator="['identityTime']" :trigger-change="true" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="上报状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['reportStatus', validatorRules.reportStatus]" placeholder="请输入上报状态"></a-input>
        </a-form-item>

      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { validateDuplicateValue } from '@/utils/util'
  import JDate from '@/components/jeecg/JDate'  



  export default {
    name: "SjDeviceStatusCheckListModal",
    components: { 
      JDate,
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
          dataTypeCode: {
            rules: [
              { required: true, message: '请输入数据类型编码!'},
            ]
          },
          dataTypeName: {
            rules: [
              { required: true, message: '请输入数据类型名称!'},
            ]
          },
          dataTypeValue: {
            rules: [
              { required: true, message: '请输入数值!'},
            ]
          },
          reportStatus: {
            rules: [
              { required: true, message: '请输入上报状态!'},
            ]
          },
        },
        url: {
          add: "/cascade/sjDeviceStatusCheckList/add",
          edit: "/cascade/sjDeviceStatusCheckList/edit",
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
          this.form.setFieldsValue(pick(this.model,'dataTypeCode','dataTypeName','dataTypeValue','reportDate','reportTime','identityPeople','identityTime','reportStatus'))
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
        this.form.setFieldsValue(pick(row,'dataTypeCode','dataTypeName','dataTypeValue','reportDate','reportTime','identityPeople','identityTime','reportStatus'))
      },

      
    }
  }
</script>