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

        <a-form-item label="上报时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择上报时间" v-decorator="['sbsj']" :trigger-change="true" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="流程编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['lcbm']" placeholder="请输入流程编码"></a-input>
        </a-form-item>
        <a-form-item label="报修时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择报修时间" v-decorator="['bxsj']" :trigger-change="true" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="报修人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['bxr']" placeholder="请输入报修人"></a-input>
        </a-form-item>
        <a-form-item label="报修部门" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['bxbm']" placeholder="请输入报修部门"></a-input>
        </a-form-item>
        <a-form-item label="优先级" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['yxj']" placeholder="请输入优先级"></a-input>
        </a-form-item>
        <a-form-item label="报修标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['bxbt']" placeholder="请输入报修标题"></a-input>
        </a-form-item>
        <a-form-item label="法院" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['fy']" placeholder="请输入法院"></a-input>
        </a-form-item>
        <a-form-item label="法院编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['fybm']" placeholder="请输入法院编码"></a-input>
        </a-form-item>
        <a-form-item label="报修描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['bxms']" placeholder="请输入报修描述"></a-input>
        </a-form-item>
        <a-form-item label="报修类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['bxlx']" placeholder="请输入报修类型"></a-input>
        </a-form-item>
        <a-form-item label="维修人员" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['wxry']" placeholder="请输入维修人员"></a-input>
        </a-form-item>
        <a-form-item label="维修公司" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['wxgs']" placeholder="请输入维修公司"></a-input>
        </a-form-item>
        <a-form-item label="解决时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择解决时间" v-decorator="['jjsj']" :trigger-change="true" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="工时" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="['gs']" placeholder="请输入工时" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="解决方案简述" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['jjfajs']" placeholder="请输入解决方案简述"></a-input>
        </a-form-item>
        <a-form-item label="流程状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['lczt']" placeholder="请输入流程状态"></a-input>
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
    name: "RepairoModal",
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
        },
        url: {
          add: "/cascade/repairo/add",
          edit: "/cascade/repairo/edit",
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
          this.form.setFieldsValue(pick(this.model,'sbsj','lcbm','bxsj','bxr','bxbm','yxj','bxbt','fy','fybm','bxms','bxlx','wxry','wxgs','jjsj','gs','jjfajs','lczt'))
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
        this.form.setFieldsValue(pick(row,'sbsj','lcbm','bxsj','bxr','bxbm','yxj','bxbt','fy','fybm','bxms','bxlx','wxry','wxgs','jjsj','gs','jjfajs','lczt'))
      },

      
    }
  }
</script>