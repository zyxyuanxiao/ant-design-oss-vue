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

        <a-form-item label="所属部门" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-search-select-tag v-decorator="['affiliatedUnit']" dict="affiliatedUnit" />
        </a-form-item>
        <a-form-item label="总量" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="['count']" placeholder="请输入总量" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="在线数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="['onlineCount']" placeholder="请输入在线数量" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="分配数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="['assignCount']" placeholder="请输入分配数量" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="在线率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="['onlineRate']" placeholder="请输入在线率" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="分配率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="['assignRate']" placeholder="请输入分配率" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="统计时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择统计时间" v-decorator="['createTime', validatorRules.createTime]" :trigger-change="true" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"/>
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
  import JSearchSelectTag from '@/components/dict/JSearchSelectTag'



  export default {
    name: "IpmCountAffiliatedunitInfoModal",
    components: { 
      JDate,
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
          createTime: {
            rules: [
              { required: true, message: '请输入统计时间!'},
            ]
          },
        },
        url: {
          add: "/ipm/ipmCountAffiliatedunitInfo/add",
          edit: "/ipm/ipmCountAffiliatedunitInfo/edit",
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
          this.form.setFieldsValue(pick(this.model,'affiliatedUnit','count','onlineCount','assignCount','onlineRate','assignRate','createTime'))
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
        this.form.setFieldsValue(pick(row,'affiliatedUnit','count','onlineCount','assignCount','onlineRate','assignRate','createTime'))
      },

      
    }
  }
</script>