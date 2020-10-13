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

        <a-form-item label="服务器IP" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['serverIp']" placeholder="请输入服务器IP"></a-input>
        </a-form-item>
        <a-form-item label="服务器名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['serverName']" placeholder="请输入服务器名称"></a-input>
        </a-form-item>
        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['remark']" placeholder="请输入备注"></a-input>
        </a-form-item>
        <a-form-item label="服务器添加时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['serverAddTime']" placeholder="请输入服务器添加时间"></a-input>
        </a-form-item>
        <a-form-item label="安装时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['anZhuangFangShi']" placeholder="请输入安装时间"></a-input>
        </a-form-item>
        <a-form-item label="包件" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['baoJian']" placeholder="请输入包件"></a-input>
        </a-form-item>
        <a-form-item label="电箱编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['boxNumber']" placeholder="请输入电箱编号"></a-input>
        </a-form-item>
        <a-form-item label="IP段" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['ipSegement']" placeholder="请输入IP段"></a-input>
        </a-form-item>
        <a-form-item label="最后通讯时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['lastTime']" placeholder="请输入最后通讯时间"></a-input>
        </a-form-item>
        <a-form-item label="电箱IP" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['powerBoxIp']" placeholder="请输入电箱IP"></a-input>
        </a-form-item>
        <a-form-item label="电箱MAC地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['powerBoxMac']" placeholder="请输入电箱MAC地址"></a-input>
        </a-form-item>
        <a-form-item label="电箱名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['boxName']" placeholder="请输入电箱名称"></a-input>
        </a-form-item>
        <a-form-item label="电箱端口" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="['powerBoxPort']" placeholder="请输入电箱端口" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="取电方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['quDianFangShi']" placeholder="请输入取电方式"></a-input>
        </a-form-item>
        <a-form-item label="服务器编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['serverId']" placeholder="请输入服务器编号"></a-input>
        </a-form-item>
        <a-form-item label="电箱状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['powerStatus']" placeholder="请输入电箱状态"></a-input>
        </a-form-item>
        <a-form-item label="区域名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['areaName']" placeholder="请输入区域名称"></a-input>
        </a-form-item>
        <a-form-item label="创建时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-date placeholder="请选择创建时间" v-decorator="['createTime']" :trigger-change="true" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="区域区域编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['projectAreaId']" placeholder="请输入区域区域编号"></a-input>
        </a-form-item>
        <a-form-item label="电箱区域父亲节点" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['parentId']" placeholder="请输入电箱区域父亲节点"></a-input>
        </a-form-item>
        <a-form-item label="交流电220V电流" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['ac220']" placeholder="请输入交流电220V电流"></a-input>
        </a-form-item>
        <a-form-item label="交流电24V电流" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['ac24']" placeholder="请输入交流电24V电流"></a-input>
        </a-form-item>
        <a-form-item label="直流电12V电流" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['dc12']" placeholder="请输入直流电12V电流"></a-input>
        </a-form-item>
        <a-form-item label="湿度" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="['humidity']" placeholder="请输入湿度" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="温度" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="['temperature']" placeholder="请输入温度" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="门开关" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['door']" placeholder="请输入门开关"></a-input>
        </a-form-item>
        <a-form-item label="空气开关" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="radio" v-decorator="['airSwitch']" :trigger-change="true" dictCode="bag_box_status" placeholder="请选择空气开关"/>
        </a-form-item>
        <a-form-item label="12V防雷" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="radio" v-decorator="['antiThunder12vModule']" :trigger-change="true" dictCode="bag_box_status" placeholder="请选择12V防雷"/>
        </a-form-item>
        <a-form-item label="24V防雷装填" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="radio" v-decorator="['antiThunder24vModule']" :trigger-change="true" dictCode="bag_box_status" placeholder="请选择24V防雷装填"/>
        </a-form-item>
        <a-form-item label="220V防雷" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag type="radio" v-decorator="['antiThunder220vModule']" :trigger-change="true" dictCode="bag_box_status" placeholder="请选择220V防雷"/>
        </a-form-item>
        <a-form-item label="温空报警个数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['temperatureAlarmCount']" placeholder="请输入温空报警个数"></a-input>
        </a-form-item>
        <a-form-item label="湿度报警个数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['humidityAlarmCount']" placeholder="请输入湿度报警个数"></a-input>
        </a-form-item>
        <a-form-item label="直流12V报警个数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="['dc12AlarmCount']" placeholder="请输入直流12V报警个数" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="交流24V报警个数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="['ac24AlarmCount']" placeholder="请输入交流24V报警个数" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="交流220V报警个数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number v-decorator="['ac220AlarmCount']" placeholder="请输入交流220V报警个数" style="width: 100%"/>
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
    name: "LinkBagBoxViewModal",
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
          add: "/bagBox/linkBagBoxView/add",
          edit: "/bagBox/linkBagBoxView/edit",
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
          this.form.setFieldsValue(pick(this.model,'serverIp','serverName','remark','serverAddTime','anZhuangFangShi','baoJian','boxNumber','ipSegement','lastTime','powerBoxIp','powerBoxMac','boxName','powerBoxPort','quDianFangShi','serverId','powerStatus','areaName','createTime','projectAreaId','parentId','ac220','ac24','dc12','humidity','temperature','door','airSwitch','antiThunder12vModule','antiThunder24vModule','antiThunder220vModule','temperatureAlarmCount','humidityAlarmCount','dc12AlarmCount','ac24AlarmCount','ac220AlarmCount'))
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
        this.form.setFieldsValue(pick(row,'serverIp','serverName','remark','serverAddTime','anZhuangFangShi','baoJian','boxNumber','ipSegement','lastTime','powerBoxIp','powerBoxMac','boxName','powerBoxPort','quDianFangShi','serverId','powerStatus','areaName','createTime','projectAreaId','parentId','ac220','ac24','dc12','humidity','temperature','door','airSwitch','antiThunder12vModule','antiThunder24vModule','antiThunder220vModule','temperatureAlarmCount','humidityAlarmCount','dc12AlarmCount','ac24AlarmCount','ac220AlarmCount'))
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