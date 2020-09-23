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

        <a-form-item label="设备名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['sbmc', validatorRules.sbmc]" placeholder="请输入设备名称"></a-input>
        </a-form-item>
        <a-form-item label="国标编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['gbbh', validatorRules.gbbh]" placeholder="请输入国标编码"></a-input>
        </a-form-item>
        <a-form-item label="设备类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['sblx', validatorRules.sblx]" placeholder="请输入设备类型"></a-input>
        </a-form-item>
        <a-form-item label="品牌" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['pp', validatorRules.pp]" placeholder="请输入品牌"></a-input>
        </a-form-item>
        <a-form-item label="型号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['xh', validatorRules.xh]" placeholder="请输入型号"></a-input>
        </a-form-item>
        <a-form-item label="IP地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['ip', validatorRules.ip]" placeholder="请输入IP地址"></a-input>
        </a-form-item>
        <a-form-item label="用户名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['yhm', validatorRules.yhm]" placeholder="请输入用户名"></a-input>
        </a-form-item>
        <a-form-item label="密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['mm', validatorRules.mm]" placeholder="请输入密码"></a-input>
        </a-form-item>
        <a-form-item label="所属区域" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['ssqy', validatorRules.ssqy]" placeholder="请输入所属区域"></a-input>
        </a-form-item>
        <a-form-item label="安装位置" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['azwz', validatorRules.azwz]" placeholder="请输入安装位置"></a-input>
        </a-form-item>
        <a-form-item label="建设时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['jssj', validatorRules.jssj]" placeholder="请输入建设时间"></a-input>
        </a-form-item>
        <a-form-item label="维护单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['whdw', validatorRules.whdw]" placeholder="请输入维护单位"></a-input>
        </a-form-item>
        <a-form-item label="资产归属" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['zcgs', validatorRules.zcgs]" placeholder="请输入资产归属"></a-input>
        </a-form-item>
        <a-form-item label="标识人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['identityPeople']" placeholder="请输入标识人"></a-input>
        </a-form-item>
        <a-form-item label="标识时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择标识时间" v-decorator="['identityTime']" :trigger-change="true" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="是否上报" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['isReport', validatorRules.isReport]" :trigger-change="true" dictCode="is_report" placeholder="请选择是否上报"/>
        </a-form-item>
        <a-form-item label="上报时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择上报时间" v-decorator="['reportTime']" :trigger-change="true" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="上报状态 " :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['reportStatus', validatorRules.reportStatus]" placeholder="请输入上报状态 "></a-input>
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
    name: "SjFrontCameraModal",
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
          sbmc: {
            rules: [
              { required: true, message: '请输入设备名称!'},
            ]
          },
          gbbh: {
            rules: [
              { required: true, message: '请输入国标编码!'},
            ]
          },
          sblx: {
            rules: [
              { required: true, message: '请输入设备类型!'},
            ]
          },
          pp: {
            rules: [
              { required: true, message: '请输入品牌!'},
            ]
          },
          xh: {
            rules: [
              { required: true, message: '请输入型号!'},
            ]
          },
          ip: {
            rules: [
              { required: true, message: '请输入IP地址!'},
            ]
          },
          yhm: {
            rules: [
              { required: true, message: '请输入用户名!'},
            ]
          },
          mm: {
            rules: [
              { required: true, message: '请输入密码!'},
            ]
          },
          ssqy: {
            rules: [
              { required: true, message: '请输入所属区域!'},
            ]
          },
          azwz: {
            rules: [
              { required: true, message: '请输入安装位置!'},
            ]
          },
          jssj: {
            rules: [
              { required: true, message: '请输入建设时间!'},
            ]
          },
          whdw: {
            rules: [
              { required: true, message: '请输入维护单位!'},
            ]
          },
          zcgs: {
            rules: [
              { required: true, message: '请输入资产归属!'},
            ]
          },
          isReport: {
            rules: [
              { required: true, message: '请输入是否上报!'},
            ]
          },
          reportStatus: {
            rules: [
              { required: true, message: '请输入上报状态 !'},
            ]
          },
        },
        url: {
          add: "/cascade/sjFrontCamera/add",
          edit: "/cascade/sjFrontCamera/edit",
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
          this.form.setFieldsValue(pick(this.model,'sbmc','gbbh','sblx','pp','xh','ip','yhm','mm','ssqy','azwz','jssj','whdw','zcgs','identityPeople','identityTime','isReport','reportTime','reportStatus'))
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
        this.form.setFieldsValue(pick(row,'sbmc','gbbh','sblx','pp','xh','ip','yhm','mm','ssqy','azwz','jssj','whdw','zcgs','identityPeople','identityTime','isReport','reportTime','reportStatus'))
      },

      
    }
  }
</script>