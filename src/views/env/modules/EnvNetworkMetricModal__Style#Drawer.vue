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

        <a-form-item label="机构代码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['orgCode']" placeholder="请输入机构代码"></a-input>
        </a-form-item>
        <a-form-item label="资产编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['ciId']" placeholder="请输入资产编号"></a-input>
        </a-form-item>
        <a-form-item label="设备在线状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['netdevOnlineState']" :trigger-change="true" dictCode="sj_isonline" placeholder="请选择设备在线状态"/>
        </a-form-item>
        <a-form-item label="设备响应时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['netdevResponseTime']" placeholder="请输入设备响应时间"></a-input>
        </a-form-item>
        <a-form-item label="设备告警等级" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['netdevAlertLevel']" :trigger-change="true" dictCode="sj_alert_status" placeholder="请选择设备告警等级"/>
        </a-form-item>
        <a-form-item label="设备CPU利用率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['netdevCpuRate']" placeholder="请输入设备CPU利用率"></a-input>
        </a-form-item>
        <a-form-item label="设备内存利用率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['netdevMemRate']" placeholder="请输入设备内存利用率"></a-input>
        </a-form-item>
        <a-form-item label="设备主板运行温度" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['netdevBoardTemp']" placeholder="请输入设备主板运行温度"></a-input>
        </a-form-item>
        <a-form-item label="设备上联端口入速率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['netdevUplinkPortInrate']" placeholder="请输入设备上联端口入速率"></a-input>
        </a-form-item>
        <a-form-item label="设备上联端口出速率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['netdevUplinkPortOutrate']" placeholder="请输入设备上联端口出速率"></a-input>
        </a-form-item>
        <a-form-item label="设备带宽利用率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['netdevBandwidthRate']" placeholder="请输入设备带宽利用率"></a-input>
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
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  
  export default {
    name: "EnvNetworkMetricModal",
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
          add: "/cgauto/envNetworkMetric/add",
          edit: "/cgauto/envNetworkMetric/edit",
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
          this.form.setFieldsValue(pick(this.model,'orgCode','ciId','netdevOnlineState','netdevResponseTime','netdevAlertLevel','netdevCpuRate','netdevMemRate','netdevBoardTemp','netdevUplinkPortInrate','netdevUplinkPortOutrate','netdevBandwidthRate'))
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
        this.form.setFieldsValue(pick(row,'orgCode','ciId','netdevOnlineState','netdevResponseTime','netdevAlertLevel','netdevCpuRate','netdevMemRate','netdevBoardTemp','netdevUplinkPortInrate','netdevUplinkPortOutrate','netdevBandwidthRate'))
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