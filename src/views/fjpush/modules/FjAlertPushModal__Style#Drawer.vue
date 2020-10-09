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

        <a-form-item label="创建日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择创建日期" v-decorator="['createTime']" :trigger-change="true" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="更新日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择更新日期" v-decorator="['updateTime']" :trigger-change="true" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="分局编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['orgCode']" placeholder="请输入分局编码"></a-input>
        </a-form-item>
        <a-form-item label="告警编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['alertId']" placeholder="请输入告警编号"></a-input>
        </a-form-item>
        <a-form-item label="告警名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['name']" placeholder="请输入告警名称"></a-input>
        </a-form-item>
        <a-form-item label="告警等级" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['severity']" :trigger-change="true" dictCode="sj_alert_status" placeholder="请选择告警等级"/>
        </a-form-item>
        <a-form-item label="告警描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['description']" placeholder="请输入告警描述"></a-input>
        </a-form-item>
        <a-form-item label="告警资源名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['entityName']" placeholder="请输入告警资源名称"></a-input>
        </a-form-item>
        <a-form-item label="告警资源IP地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['entityAddr']" placeholder="请输入告警资源IP地址"></a-input>
        </a-form-item>
        <a-form-item label="首次发生时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择首次发生时间" v-decorator="['firstTime']" :trigger-change="true" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="最近发生时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择最近发生时间" v-decorator="['lastTime']" :trigger-change="true" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="告警扩展信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea v-decorator="['properties']" rows="4" placeholder="请输入告警扩展信息"/>
        </a-form-item>
        <a-form-item label="告警资源唯一标识" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['ciId']" placeholder="请输入告警资源唯一标识"></a-input>
        </a-form-item>
        <a-form-item label="处理状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['proStatus']" :trigger-change="true" dictCode="alert_pro_status" placeholder="请选择处理状态"/>
        </a-form-item>
        <a-form-item label="告警对应的工单号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['orderNo']" placeholder="请输入告警对应的工单号"></a-input>
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
  import JDate from '@/components/jeecg/JDate'  
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  
  export default {
    name: "FjAlertPushModal",
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
        },
        url: {
          add: "/fjpush/fjAlertPush/add",
          edit: "/fjpush/fjAlertPush/edit",
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
          this.form.setFieldsValue(pick(this.model,'createTime','updateTime','orgCode','alertId','name','severity','description','entityName','entityAddr','firstTime','lastTime','properties','ciId','proStatus','orderNo'))
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
        this.form.setFieldsValue(pick(row,'createTime','updateTime','orgCode','alertId','name','severity','description','entityName','entityAddr','firstTime','lastTime','properties','ciId','proStatus','orderNo'))
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