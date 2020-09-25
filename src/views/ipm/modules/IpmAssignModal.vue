<template>
  <j-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row class="form-row" :gutter="0">
          <a-col :lg="12">
            <a-form-item label="应用单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-search-select-tag v-decorator="['affiliatedUnit', validatorRules.affiliatedUnit]" dict="affiliatedUnit" />
            </a-form-item>
          </a-col>
          <a-col :lg="12">
            <a-form-item label="网络域" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag v-decorator="['domain', validatorRules.domain]" :trigger-change="true" dictCode="domain" placeholder="请选择网络域"/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="0">
          <a-col :lg="12">
            <a-form-item label="网段描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-search-select-tag v-decorator="['networkDesc', validatorRules.networkDesc]" dict="networkDesc" />
            </a-form-item>
          </a-col>
          <a-col :lg="12">
            <a-form-item label="申请类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag v-decorator="['assignType', validatorRules.assignType]" :trigger-change="true" dictCode="assignType" placeholder="请选择申请类型"/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="0">
          <a-col :lg="12">
            <a-form-item label="项目信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-search-select-tag v-decorator="['project', validatorRules.project]" dict="project" />
            </a-form-item>
          </a-col>
          <a-col :lg="12">
            <a-form-item label="厂商" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-search-select-tag v-decorator="['manufactor',  validatorRules.manufactor]" dict="manufactor" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="0">
          <a-col :lg="12">
            <a-form-item label="负责人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['projectManager']" placeholder="请输入负责人"></a-input>
            </a-form-item>
          </a-col>
          <a-col :lg="12">
            <a-form-item label="申请人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['applicant',  validatorRules.applicant]" placeholder="请输入申请人">{{ selectedRowKeys.length }}</a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="0">
          <a-col :lg="12">
            <a-form-item label="标签" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-multi-select-tag type="list_multi" v-decorator="['tags']" :trigger-change="true" dictCode="tags" placeholder="请选择标签"/>
            </a-form-item>
          </a-col>
          <a-col :lg="12">
            <a-form-item label="申请数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['assignCount',  validatorRules.assignCount]" placeholder="请输入申请数量">{{ selectedRowKeys.length }}</a-input>
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 操作按钮区域 -->
<!--        <div class="table-operator">-->
<!--          <a-button type="primary" icon="download" @click="handleExportXls('一对多示例')">导出</a-button>-->
<!--          <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">-->
<!--            <a-button type="primary" icon="import">导入</a-button>-->
<!--          </a-upload>-->

<!--          <a-dropdown v-if="selectedRowKeys.length > 0">-->
<!--            <a-menu slot="overlay">-->
<!--              <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>-->
<!--            </a-menu>-->
<!--            <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>-->
<!--          </a-dropdown>-->
<!--        </div>-->

        <!-- table区域-begin -->
        <div>
          <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
            <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
            <a style="margin-left: 24px" @click="onClearSelected">移除</a>
          </div>

          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="delIpAdress(record)">移除</a>
        </span>

          </a-table>
        </div>
        <!-- table区域-end -->
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
  import JMultiSelectTag from '@/components/dict/JMultiSelectTag'
  import JSearchSelectTag from '@/components/dict/JSearchSelectTag'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "IpmAssignModal",
    mixins: [JeecgListMixin],
    components: {
      JDate,
      JDictSelectTag,
      JSearchSelectTag,
      JMultiSelectTag
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
          affiliatedUnit: {
            rules: [
              { required: true, message: '请输入应用单位!'},
            ]
          },
          applicant: {
            rules: [
              { required: true, message: '请输入申请人!'},
            ]
          },
          assignType: {
            rules: [
              { required: true, message: '请选择申请类型!'},
            ]
          },
          domain: {
            rules: [
              { required: true, message: '请输入网络域!'},
            ]
          },
          project: {
            rules: [
              { required: true, message: '请输入项目信息!'},
            ]
          },
          networkDesc: {
            rules: [
              { required: true, message: '请输入网段描述!'},
            ]
          },
          manufactor: {
            rules: [
              { required: true, message: '请输入厂商!'},
            ]
          },
          assignCount: {
            rules: [
              { required: true, message: '请输入申请数量!'},
            ]
          },
        },
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title: 'IP地址',
            align:"center",
            dataIndex: 'ip'
          },
          {
            title: '入网时间',
            align:"center",
            dataIndex: 'createTime'
          },
          {
            title: '规划人',
            align:"center",
            dataIndex: 'planner'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {

          // list: "/test/jeecgOrderMain/list",
          delete: "/test/jeecgOrderMain/delete",
          deleteBatch: "/test/jeecgOrderMain/deleteBatch",
          exportXlsUrl: "/test/jeecgOrderMain/exportXls",

          list: "/ipm/ipmIpInfo/list",
          assign: "/ipm/ipmIpInfo/assignIpsInfo",
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
        // 触发表单验证
        this.form.validateFields((err, values) => {
            let formData = Object.assign(this.model, values);
          console.log("表单提交数据",formData)
          // if (!err) {
          //   that.confirmLoading = true;
          //   let formData = Object.assign(this.model, values);
          //   httpAction(this.url.assign,formData,'post').then((res)=>{
          //     if(res.success){
          //       that.$message.success('本次申请'+res.message+'个IP');
          //       that.$emit('ok');
          //     }else{
          //       that.$message.warning(res.message);
          //     }
          //   }).finally(() => {
          //     that.confirmLoading = false;
          //     that.close();
          //   })
          // }

        })
      },
      handleCancel () {
        this.close()
      },
      popupCallback(row){
        // this.form.setFieldsValue(pick(row,'startIp','endIp','affiliatedUnit','domain','planner','networkDesc','createTime'))
      },
      delIpAdress(row){
        console.log(row)
      },

    }
  }
</script>