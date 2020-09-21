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

        <a-form-item label="开始IP" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['startIp', validatorRules.startIp]" placeholder="请输入开始IP"></a-input>
        </a-form-item>
        <a-form-item label="结束IP" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['endIp', validatorRules.endIp]" placeholder="请输入结束IP"></a-input>
        </a-form-item>
        <a-form-item label="应用单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-search-select-tag v-decorator="['affiliatedUnit']" dict="affiliatedUnit" />
        </a-form-item>
        <a-form-item label="网络域" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="radio" v-decorator="['domain', validatorRules.domain]" :trigger-change="true" dictCode="domain" placeholder="请选择网络域"/>
        </a-form-item>
        <a-form-item label="规划人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['planner', validatorRules.planner]" placeholder="请输入规划人"></a-input>
        </a-form-item>
        <a-form-item label="网段描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-search-select-tag v-decorator="['networkDesc', validatorRules.networkDesc]" dict="networkDesc" />
        </a-form-item>
        <a-form-item label="创建时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择创建时间" v-decorator="['createTime', validatorRules.createTime]" :trigger-change="true" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"/>
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
  import JSearchSelectTag from '@/components/dict/JSearchSelectTag'



  export default {
    name: "IpmPlanInfoModal",
    components: { 
      JDate,
      JDictSelectTag,
      JSearchSelectTag,
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
          startIp: {
            rules: [
              { required: true, message: '请输入开始IP!'},
            ]
          },
          endIp: {
            rules: [
              { required: true, message: '请输入结束IP!'},
            ]
          },
          domain: {
            rules: [
              { required: true, message: '请输入网络域!'},
            ]
          },
          planner: {
            rules: [
              { required: true, message: '请输入规划人!'},
            ]
          },
          networkDesc: {
            rules: [
              { required: true, message: '请输入网段描述!'},
            ]
          },
          createTime: {
            rules: [
              { required: true, message: '请输入创建时间!'},
            ]
          },
        },
        url: {
          add: "/ipm/ipmPlanInfo/add",
          edit: "/ipm/ipmPlanInfo/edit",
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
          this.form.setFieldsValue(pick(this.model,'startIp','endIp','affiliatedUnit','domain','planner','networkDesc','createTime'))
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
        this.form.setFieldsValue(pick(row,'startIp','endIp','affiliatedUnit','domain','planner','networkDesc','createTime'))
      },

      
    }
  }
</script>