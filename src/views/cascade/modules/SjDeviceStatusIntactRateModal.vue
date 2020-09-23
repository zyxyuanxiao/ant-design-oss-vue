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

        <a-form-item label="摄像机在线率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['sxzzxl', validatorRules.sxzzxl]" placeholder="请输入摄像机在线率"></a-input>
        </a-form-item>
        <a-form-item label="摄像机GB28181注册率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['sxjzcl28181', validatorRules.sxjzcl28181]" placeholder="请输入摄像机GB28181注册率"></a-input>
        </a-form-item>
        <a-form-item label="摄像机GA/T1400注册率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['sxjzcl1400', validatorRules.sxjzcl1400]" placeholder="请输入摄像机GA/T1400注册率"></a-input>
        </a-form-item>
        <a-form-item label="摄像机出流率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['sxjcll', validatorRules.sxjcll]" placeholder="请输入摄像机出流率"></a-input>
        </a-form-item>
        <a-form-item label="摄像机时钟同步率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['sxzsztbl', validatorRules.sxzsztbl]" placeholder="请输入摄像机时钟同步率"></a-input>
        </a-form-item>
        <a-form-item label="字符叠加合格率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['zfdjhgl', validatorRules.zfdjhgl]" placeholder="请输入字符叠加合格率"></a-input>
        </a-form-item>
        <a-form-item label="NVR在线率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['nvrzxl', validatorRules.nvrzxl]" placeholder="请输入NVR在线率"></a-input>
        </a-form-item>
        <a-form-item label="DVR在线率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['dvrzxl', validatorRules.dvrzxl]" placeholder="请输入DVR在线率"></a-input>
        </a-form-item>
        <a-form-item label="NVR存储总容量" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['nvrcczrl', validatorRules.nvrcczrl]" placeholder="请输入NVR存储总容量"></a-input>
        </a-form-item>
        <a-form-item label="DVR存储总容量" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['dvrcczrl', validatorRules.dvrcczrl]" placeholder="请输入DVR存储总容量"></a-input>
        </a-form-item>
        <a-form-item label="NVR故障率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['nvrgzl', validatorRules.nvrgzl]" placeholder="请输入NVR故障率"></a-input>
        </a-form-item>
        <a-form-item label="DVR故障率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['dvrgzl', validatorRules.dvrgzl]" placeholder="请输入DVR故障率"></a-input>
        </a-form-item>
        <a-form-item label="上报日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择上报日期" v-decorator="['reportDate']" :trigger-change="true" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="上报时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择上报时间" v-decorator="['reportTime']" :trigger-change="true" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="上报状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['reportStatus']" placeholder="请输入上报状态"></a-input>
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
    name: "SjDeviceStatusIntactRateModal",
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
          sxzzxl: {
            rules: [
              { required: true, message: '请输入摄像机在线率!'},
            ]
          },
          sxjzcl28181: {
            rules: [
              { required: true, message: '请输入摄像机GB28181注册率!'},
            ]
          },
          sxjzcl1400: {
            rules: [
              { required: true, message: '请输入摄像机GA/T1400注册率!'},
            ]
          },
          sxjcll: {
            rules: [
              { required: true, message: '请输入摄像机出流率!'},
            ]
          },
          sxzsztbl: {
            rules: [
              { required: true, message: '请输入摄像机时钟同步率!'},
            ]
          },
          zfdjhgl: {
            rules: [
              { required: true, message: '请输入字符叠加合格率!'},
            ]
          },
          nvrzxl: {
            rules: [
              { required: true, message: '请输入NVR在线率!'},
            ]
          },
          dvrzxl: {
            rules: [
              { required: true, message: '请输入DVR在线率!'},
            ]
          },
          nvrcczrl: {
            rules: [
              { required: true, message: '请输入NVR存储总容量!'},
            ]
          },
          dvrcczrl: {
            rules: [
              { required: true, message: '请输入DVR存储总容量!'},
            ]
          },
          nvrgzl: {
            rules: [
              { required: true, message: '请输入NVR故障率!'},
            ]
          },
          dvrgzl: {
            rules: [
              { required: true, message: '请输入DVR故障率!'},
            ]
          },
        },
        url: {
          add: "/cascade/sjDeviceStatusIntactRate/add",
          edit: "/cascade/sjDeviceStatusIntactRate/edit",
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
          this.form.setFieldsValue(pick(this.model,'sxzzxl','sxjzcl28181','sxjzcl1400','sxjcll','sxzsztbl','zfdjhgl','nvrzxl','dvrzxl','nvrcczrl','dvrcczrl','nvrgzl','dvrgzl','reportDate','reportTime','reportStatus'))
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
        this.form.setFieldsValue(pick(row,'sxzzxl','sxjzcl28181','sxjzcl1400','sxjcll','sxzsztbl','zfdjhgl','nvrzxl','dvrzxl','nvrcczrl','dvrcczrl','nvrgzl','dvrgzl','reportDate','reportTime','reportStatus'))
      },

      
    }
  }
</script>