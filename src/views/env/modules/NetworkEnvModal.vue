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

        <a-form-item label="机构代码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['orgCode']" placeholder="请输入机构代码"></a-input>
        </a-form-item>
        <a-form-item label="设备健康指数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['netdevHealthValue']" placeholder="请输入设备健康指数"></a-input>
        </a-form-item>
        <a-form-item label="设备在线率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['netdevOnlineRate']" placeholder="请输入设备在线率"></a-input>
        </a-form-item>
        <a-form-item label="设备平均CPU负载" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['netdevAverCpuRate']" placeholder="请输入设备平均CPU负载"></a-input>
        </a-form-item>
        <a-form-item label="设备平均内存负载" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['netdevAverMemRate']" placeholder="请输入设备平均内存负载"></a-input>
        </a-form-item>

      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { validateDuplicateValue } from '@/utils/util'



  export default {
    name: "NetworkEnvModal",
    components: { 
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
        },
        url: {
          add: "/cgauto/networkEnv/add",
          edit: "/cgauto/networkEnv/edit",
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
          this.form.setFieldsValue(pick(this.model,'orgCode','netdevHealthValue','netdevOnlineRate','netdevAverCpuRate','netdevAverMemRate'))
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
        this.form.setFieldsValue(pick(row,'orgCode','netdevHealthValue','netdevOnlineRate','netdevAverCpuRate','netdevAverMemRate'))
      },

      
    }
  }
</script>