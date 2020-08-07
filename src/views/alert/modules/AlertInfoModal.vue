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

        <a-form-item label="告警名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['name', validatorRules.name]" placeholder="请输入告警名称"></a-input>
        </a-form-item>
        <a-form-item label="告警类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['type', validatorRules.type]" :trigger-change="true" dictCode="alertType" placeholder="请选择告警类型"/>
        </a-form-item>
        <a-form-item label="告警等级" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="radio" v-decorator="['severity', validatorRules.severity]" :trigger-change="true" dictCode="alertSeverity" placeholder="请选择告警等级"/>
        </a-form-item>
        <a-form-item label="告警时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择告警时间" v-decorator="['createTime', validatorRules.createTime]" :trigger-change="true" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="上一次告警时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择上一次告警时间" v-decorator="['beforealerttime']" :trigger-change="true" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="设备名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['devicename']" placeholder="请输入设备名称"></a-input>
        </a-form-item>
        <a-form-item label="设备地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['deviceip']" placeholder="请输入设备地址"></a-input>
        </a-form-item>
        <a-form-item label="告警详情" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea v-decorator="['description', validatorRules.description]" rows="4" placeholder="请输入告警详情"/>
        </a-form-item>
        <a-form-item label="扩展字段" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea v-decorator="['property']" rows="4" placeholder="请输入扩展字段"/>
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
  import JDictSelectTag from "@/components/dict/JDictSelectTag"



  export default {
    name: "AlertInfoModal",
    components: { 
      JDate,
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
          name: {
            rules: [
              { required: true, message: '请输入告警名称!'},
            ]
          },
          type: {
            rules: [
              { required: true, message: '请输入告警类型!'},
            ]
          },
          severity: {
            rules: [
              { required: true, message: '请输入告警等级!'},
            ]
          },
          createTime: {
            rules: [
              { required: true, message: '请输入告警时间!'},
            ]
          },
          description: {
            rules: [
              { required: true, message: '请输入告警详情!'},
            ]
          },
        },
        url: {
          add: "/alert/alertInfo/add",
          edit: "/alert/alertInfo/edit",
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
          this.form.setFieldsValue(pick(this.model,'name','type','severity','createTime','beforealerttime','devicename','deviceip','description','property'))
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
        this.form.setFieldsValue(pick(row,'name','type','severity','createTime','beforealerttime','devicename','deviceip','description','property'))
      },

      
    }
  }
</script>