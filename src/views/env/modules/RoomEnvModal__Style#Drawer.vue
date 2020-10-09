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
          <a-input v-decorator="['orgCode', validatorRules.orgCode]" placeholder="请输入机构代码"></a-input>
        </a-form-item>
        <a-form-item label="机房代码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['rmCode', validatorRules.rmCode]" placeholder="请输入机房代码"></a-input>
        </a-form-item>
        <a-form-item label="机房环境健康度" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['envHealthValue']" placeholder="请输入机房环境健康度"></a-input>
        </a-form-item>
        <a-form-item label="机房动力系统健康度" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['powerHealthValue']" placeholder="请输入机房动力系统健康度"></a-input>
        </a-form-item>
        <a-form-item label="市电实时功率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['electrRealPower']" placeholder="请输入市电实时功率"></a-input>
        </a-form-item>
        <a-form-item label="UPS实时功率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['upsRealPower']" placeholder="请输入UPS实时功率"></a-input>
        </a-form-item>
        <a-form-item label="机房平均温度" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['roomAverTemp']" placeholder="请输入机房平均温度"></a-input>
        </a-form-item>
        <a-form-item label="机房平均湿度" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['roomAverHum']" placeholder="请输入机房平均湿度"></a-input>
        </a-form-item>
        <a-form-item label="漏水监测状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['waterLeakStatus']" :trigger-change="true" dictCode="sj_isok" placeholder="请选择漏水监测状态"/>
        </a-form-item>
        <a-form-item label="消防监测状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['fireStatus']" :trigger-change="true" dictCode="sj_isok" placeholder="请选择消防监测状态"/>
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
    name: "RoomEnvModal",
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
          orgCode: {
            rules: [
              { required: true, message: '请输入机构代码!'},
            ]
          },
          rmCode: {
            rules: [
              { required: true, message: '请输入机房代码!'},
            ]
          },
        },
        url: {
          add: "/cgauto/roomEnv/add",
          edit: "/cgauto/roomEnv/edit",
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
          this.form.setFieldsValue(pick(this.model,'orgCode','rmCode','envHealthValue','powerHealthValue','electrRealPower','upsRealPower','roomAverTemp','roomAverHum','waterLeakStatus','fireStatus'))
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
        this.form.setFieldsValue(pick(row,'orgCode','rmCode','envHealthValue','powerHealthValue','electrRealPower','upsRealPower','roomAverTemp','roomAverHum','waterLeakStatus','fireStatus'))
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