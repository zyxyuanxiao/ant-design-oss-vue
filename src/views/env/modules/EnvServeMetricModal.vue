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
        <a-form-item label="资产编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['ciId']" placeholder="请输入资产编号"></a-input>
        </a-form-item>
        <a-form-item label="设备在线状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['devOnlineState']" :trigger-change="true" dictCode="sj_isonline" placeholder="请选择设备在线状态"/>
        </a-form-item>
        <a-form-item label="设备响应时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['devResponseTime']" placeholder="请输入设备响应时间"></a-input>
        </a-form-item>
        <a-form-item label="设备告警等级" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['devAlertLevel']" :trigger-change="true" dictCode="sj_alert_status" placeholder="请选择设备告警等级"/>
        </a-form-item>
        <a-form-item label="设备CPU利用率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['devCpuRate']" placeholder="请输入设备CPU利用率"></a-input>
        </a-form-item>
        <a-form-item label="设备内存利用率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['devMemRate']" placeholder="请输入设备内存利用率"></a-input>
        </a-form-item>
        <a-form-item label="设备磁盘使用率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['devDiskRate']" placeholder="请输入设备磁盘使用率"></a-input>
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



  export default {
    name: "EnvServeMetricModal",
    components: { 
      JDictSelectTag,
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
          add: "/cgauto/envServeMetric/add",
          edit: "/cgauto/envServeMetric/edit",
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
          this.form.setFieldsValue(pick(this.model,'orgCode','ciId','devOnlineState','devResponseTime','devAlertLevel','devCpuRate','devMemRate','devDiskRate'))
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
        this.form.setFieldsValue(pick(row,'orgCode','ciId','devOnlineState','devResponseTime','devAlertLevel','devCpuRate','devMemRate','devDiskRate'))
      },

      
    }
  }
</script>