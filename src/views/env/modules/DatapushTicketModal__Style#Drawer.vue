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

        <a-form-item label="分局编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['orgCode']" placeholder="请输入分局编码"></a-input>
        </a-form-item>
        <a-form-item label="工单标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['jobTitle']" placeholder="请输入工单标题"></a-input>
        </a-form-item>
        <a-form-item label="工单编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['jobCode']" placeholder="请输入工单编号"></a-input>
        </a-form-item>
        <a-form-item label="创建人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['createUser']" placeholder="请输入创建人"></a-input>
        </a-form-item>
        <a-form-item label="创建人联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['createTel']" placeholder="请输入创建人联系电话"></a-input>
        </a-form-item>
        <a-form-item label="工单要求解决期限" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['jobSolveTerm']" placeholder="请输入工单要求解决期限"></a-input>
        </a-form-item>
        <a-form-item label="报修内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['content']" placeholder="请输入报修内容"></a-input>
        </a-form-item>
        <a-form-item label="故障类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['faultType']" placeholder="请输入故障类型"></a-input>
        </a-form-item>
        <a-form-item label="响应时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择响应时间" v-decorator="['responseTime']" :trigger-change="true" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="处理方案记录" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['proceRecords']" placeholder="请输入处理方案记录"></a-input>
        </a-form-item>
        <a-form-item label="处理人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['proceUser']" placeholder="请输入处理人"></a-input>
        </a-form-item>
        <a-form-item label="专管民警" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['manageUser']" placeholder="请输入专管民警"></a-input>
        </a-form-item>
        <a-form-item label="解决时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择解决时间" v-decorator="['solveTime']" :trigger-change="true" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="一次确认情况" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['oneSolve']" :trigger-change="true" dictCode="sj_ticket_solve_status" placeholder="请选择一次确认情况"/>
        </a-form-item>
        <a-form-item label="确认解决时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择确认解决时间" v-decorator="['confirmTime']" :trigger-change="true" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="满意度" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['satisfaction']" :trigger-change="true" dictCode="sj_ticket_satf" placeholder="请选择满意度"/>
        </a-form-item>
        <a-form-item label="工单状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="list" v-decorator="['status']" :trigger-change="true" dictCode="sj_ticket_status" placeholder="请选择工单状态"/>
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
    name: "DatapushTicketModal",
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
          add: "/cgauto/datapushTicket/add",
          edit: "/cgauto/datapushTicket/edit",
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
          this.form.setFieldsValue(pick(this.model,'orgCode','jobTitle','jobCode','createUser','createTel','jobSolveTerm','content','faultType','responseTime','proceRecords','proceUser','manageUser','solveTime','oneSolve','confirmTime','satisfaction','status'))
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
        this.form.setFieldsValue(pick(row,'orgCode','jobTitle','jobCode','createUser','createTel','jobSolveTerm','content','faultType','responseTime','proceRecords','proceUser','manageUser','solveTime','oneSolve','confirmTime','satisfaction','status'))
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