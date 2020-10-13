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
        <a-form-item label="巡检公司" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['xjgs']" placeholder="请输入巡检公司"></a-input>
        </a-form-item>
        <a-form-item label="巡检人员" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['xjry']" placeholder="请输入巡检人员"></a-input>
        </a-form-item>
        <a-form-item label="法院" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['fy']" placeholder="请输入法院"></a-input>
        </a-form-item>
        <a-form-item label="工作量" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="['gs']" placeholder="请输入工作量" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="巡检时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择巡检时间" v-decorator="['xjsj']" :trigger-change="true" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="巡检结果" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['xjjg']" placeholder="请输入巡检结果"></a-input>
        </a-form-item>
        <a-form-item label="巡检类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['xjlx']" placeholder="请输入巡检类型"></a-input>
        </a-form-item>
        <a-form-item label="巡检标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['title']" placeholder="请输入巡检标题"></a-input>
        </a-form-item>
        <a-form-item label="巡检详情" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['xjbt']" placeholder="请输入巡检详情"></a-input>
        </a-form-item>
        <a-form-item label="法院编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['fybm']" placeholder="请输入法院编码"></a-input>
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
    name: "PatrolModal",
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
          add: "/cascade/patrol/add",
          edit: "/cascade/patrol/edit",
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
          this.form.setFieldsValue(pick(this.model,'sbsj','lcbm','xjgs','xjry','fy','gs','xjsj','xjjg','xjlx','title','xjbt','fybm'))
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
        this.form.setFieldsValue(pick(row,'sbsj','lcbm','xjgs','xjry','fy','gs','xjsj','xjjg','xjlx','title','xjbt','fybm'))
      },

      
    }
  }
</script>