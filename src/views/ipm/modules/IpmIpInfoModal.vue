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

        <a-form-item label="IP地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['ip', validatorRules.ip]" placeholder="请输入IP地址"></a-input>
        </a-form-item>
        <a-form-item label="网络域" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-search-select-tag v-decorator="['domain']" dict="domain" />
        </a-form-item>
        <a-form-item label="项目信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-search-select-tag v-decorator="['project']" dict="project" />
        </a-form-item>
        <a-form-item label="网段描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-search-select-tag v-decorator="['networkDesc']" dict="networkDesc" />
        </a-form-item>
        <a-form-item label="应用单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-search-select-tag v-decorator="['affiliatedUnit']" dict="affiliatedUnit" />
        </a-form-item>
        <a-form-item label="厂商" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-search-select-tag v-decorator="['manufactor']" dict="manufactor" />
        </a-form-item>
        <a-form-item label="规划人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['planner']" placeholder="请输入规划人"></a-input>
        </a-form-item>
        <a-form-item label="负责人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['projectManager']" placeholder="请输入负责人"></a-input>
        </a-form-item>
        <a-form-item label="申请人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['applicant']" placeholder="请输入申请人"></a-input>
        </a-form-item>
        <a-form-item label="分配状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="radio" v-decorator="['usestatus', validatorRules.usestatus]" :trigger-change="true" dictCode="useStatus" placeholder="请选择分配状态"/>
        </a-form-item>
        <a-form-item label="在线状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="radio" v-decorator="['onlineStatus', validatorRules.onlineStatus]" :trigger-change="true" dictCode="onlineStatus" placeholder="请选择在线状态"/>
        </a-form-item>
        <a-form-item label="入网时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择入网时间" v-decorator="['createTime', validatorRules.createTime]" :trigger-change="true" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="上一次在线时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择上一次在线时间" v-decorator="['lastOnlineTime']" :trigger-change="true" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="检测时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择检测时间" v-decorator="['checkedTime']" :trigger-change="true" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="标签" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-multi-select-tag type="list_multi" v-decorator="['tags']" :trigger-change="true" dictCode="tags" placeholder="请选择标签"/>
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
  import JMultiSelectTag from "@/components/dict/JMultiSelectTag"
  import JSearchSelectTag from '@/components/dict/JSearchSelectTag'



  export default {
    name: "IpmIpInfoModal",
    components: { 
      JDate,
      JDictSelectTag,
      JMultiSelectTag,
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
          ip: {
            rules: [
              { required: true, message: '请输入IP地址!'},
            ]
          },
          usestatus: {
            rules: [
              { required: true, message: '请输入分配状态!'},
            ]
          },
          onlineStatus: {
            rules: [
              { required: true, message: '请输入在线状态!'},
            ]
          },
          createTime: {
            rules: [
              { required: true, message: '请输入入网时间!'},
            ]
          },
        },
        url: {
          add: "/ipm/ipmIpInfo/add",
          edit: "/ipm/ipmIpInfo/edit",
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
          this.form.setFieldsValue(pick(this.model,'ip','domain','project','networkDesc','affiliatedUnit','manufactor','planner','projectManager','applicant','usestatus','onlineStatus','createTime','lastOnlineTime','checkedTime','tags'))
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
        this.form.setFieldsValue(pick(row,'ip','domain','project','networkDesc','affiliatedUnit','manufactor','planner','projectManager','applicant','usestatus','onlineStatus','createTime','lastOnlineTime','checkedTime','tags'))
      },

      
    }
  }
</script>