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
              <j-search-select-tag v-decorator="['affiliatedUnit', validatorRules.affiliatedUnit]"
                                   dict="affiliatedUnit"/>
            </a-form-item>
          </a-col>
          <a-col :lg="12">
            <a-form-item label="网段描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-search-select-tag v-decorator="['networkDesc', validatorRules.networkDesc]" dict="networkDesc"/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="0">
          <a-col :lg="12">
            <a-form-item label="项目信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-search-select-tag v-decorator="['project', validatorRules.project]" dict="project"/>
            </a-form-item>
          </a-col>
          <a-col :lg="12">
            <a-form-item label="厂商" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-search-select-tag v-decorator="['manufactor',  validatorRules.manufactor]" dict="manufactor"/>
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
              <a-input v-decorator="['applicant',  validatorRules.applicant]" placeholder="请输入申请人"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="0">
          <a-col :lg="12">
            <a-form-item label="标签" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-multi-select-tag type="list_multi" v-decorator="['tags']" :trigger-change="true" dictCode="tags"
                                  placeholder="请选择标签"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="0">
          <a-col :lg="12">
            <a-form-item label="网络域" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag v-decorator="['domain', validatorRules.domain]" :trigger-change="true"
                                 dictCode="domain" placeholder="请选择网络域" @change="handleSelectChange"
              />
            </a-form-item>
          </a-col>
          <a-col :lg="12">
            <a-form-item label="申请数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['assignCount',  validatorRules.assignCount]"
                       placeholder="请输入申请数量" @change="handleInputChange"
              ></a-input>
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
            <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
            selectionRows.length }}</a>项
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
            <a-pagination
              style="text-align: right;margin-top: 15px;"
              :total="ipagination.total"
              show-size-changer
              :show-total="(total, range) => `${range[0]}-${range[1]} 共 ${ipagination.total} 条`"
              :page-size="ipagination.pageSize"
              :default-current="1"
              @change="onChange"
              @showSizeChange="onShowSizeChange"
            />

            <span slot="action" slot-scope="text, record,index">
          <a @click="delIpAdress(index)">移除</a>
        </span>

          </a-table>
        </div>
        <!-- table区域-end -->
      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>

import { getAction, httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import { validateDuplicateValue } from '@/utils/util'
import JDate from '@/components/jeecg/JDate'
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import JMultiSelectTag from '@/components/dict/JMultiSelectTag'
import JSearchSelectTag from '@/components/dict/JSearchSelectTag'

export default {
  name: 'IpmAssignModal',
  components: {
    JDate,
    JDictSelectTag,
    JSearchSelectTag,
    JMultiSelectTag
  },
  data () {
    return {
      form: this.$form.createForm(this),
      title: '操作',
      width: 800,
      visible: false,
      loading: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      validatorRules: {
        affiliatedUnit: {
          rules: [
            { required: true, message: '请输入应用单位!' }
          ]
        },
        applicant: {
          rules: [
            { required: true, message: '请输入申请人!' }
          ]
        },
        assignType: {
          rules: [
            { required: true, message: '请选择申请类型!' }
          ]
        },
        domain: {
          rules: [
            { required: true, message: '请输入网络域!' }
          ]
        },
        project: {
          rules: [
            { required: true, message: '请输入项目信息!' }
          ]
        },
        networkDesc: {
          rules: [
            { required: true, message: '请输入网段描述!' }
          ]
        },
        manufactor: {
          rules: [
            { required: true, message: '请输入厂商!' }
          ]
        },
        assignCount: {
          rules: [
            { required: true, message: '请输入申请数量!' }
          ]
        }
      },
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: 'IP地址',
          align: 'center',
          dataIndex: 'ip'
        },
        {
          title: '入网时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '规划人',
          align: 'center',
          dataIndex: 'planner'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      selectedRowKeys: [],
      selectionRows: [],
      dataSource: [],
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        total: 0
      },
      domain: '',
      size: '',
      url: {

        // list: "/test/jeecgOrderMain/list",
        delete: '/test/jeecgOrderMain/delete',
        deleteBatch: '/test/jeecgOrderMain/deleteBatch',
        exportXlsUrl: '/test/jeecgOrderMain/exportXls',

        list: '/ipm/ipmIpInfo/list',
        assign: '/ipm/ipmIpInfo/assignIpsInfo'
      }
    }
  },
  created () {
  },
  methods: {
    add () {
      this.edit({})
    },
    edit (record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'startIp', 'endIp', 'affiliatedUnit', 'domain', 'planner', 'networkDesc', 'createTime'))
      })
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    handleOk () {
      // 触发表单验证
      if (this.dataSource.length === 0) {
        this.$message.success('您未选择任何数据，请先选择数据！')
        return
      }
      let ips = []
      this.dataSource.forEach((item) => {
        ips.push(item.ip)
      })
      this.form.validateFields((err, values) => {
        let formData = Object.assign(this.model, values)
        console.log('表单提交数据', formData)
        if (!err) {
          this.confirmLoading = true
          let formData = Object.assign(this.model, values)
          formData.ips = ips
          delete formData.assignCount
          httpAction(this.url.assign, formData, 'post').then((res) => {
            if (res.success) {
              this.$message.success('本次共申请了 ' + res.result + ' 个IP')
              this.dataSource = []
              this.$emit('ok')
            } else {
              this.$message.warning(res.message)
            }
          }).finally(() => {
            this.confirmLoading = false
            this.close()
          })
        }

      })
    },
    handleCancel () {
      this.close()
    },
    handleTableChange (pagination) {
      //TODO 筛选
      this.ipagination = pagination
    },
    popupCallback (row) {
      // this.form.setFieldsValue(pick(row,'startIp','endIp','affiliatedUnit','domain','planner','networkDesc','createTime'))
    },
    onSelectChange (selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = [] //先清空之前选中的，避免数据冗余
      selectionRows.forEach((item, index) => {
        this.selectionRows.push(item.ip) //重新赋值
      })
    },
    onClearSelected () {
      for (let i = 0; i < this.dataSource.length; i++) {
        // 判断如有相同的IP则移除
        if (this.selectionRows.indexOf(this.dataSource[i].ip) > -1) {
          this.dataSource.splice(i, 1) // 将使后面的元素依次前移，数组长度减1
          i-- // 如果不减，将漏掉一个元素
        }
      }
      this.ipagination.total = this.dataSource.length
      this.selectionRows = []
    },
    getIpInfoList (domain, size) {
      this.loading = true
      let data = {
        domain: domain,
        usestatus: 0,
        pageSize: size
      }
      getAction(this.url.list, data).then((res) => {
        this.dataSource = res.result.records
        this.ipagination.total = res.result.records.length
      }).finally(() => {
        this.loading = false
      })
    },
    onShowSizeChange (current, size) {
      this.ipagination.current = current
      this.ipagination.pageSize = size
    },
    onChange (page, pageSize) {
      this.ipagination.current = page
      this.ipagination.pageSize = pageSize
    },
    handleSelectChange (value) {
      this.selectionRows = []
      this.selectedRowKeys = []
      this.domain = value
      if (this.size === '') return
      this.getIpInfoList(this.domain, this.size)
    },
    handleInputChange (event) {
      this.selectionRows = []
      this.selectedRowKeys = []
      this.size = event.target.value
      if (this.domain === '') return
      this.getIpInfoList(this.domain, this.size)
    },
    delIpAdress (index) {
      this.dataSource.splice(index, 1)
      this.selectionRows.splice(index, 1)
      this.ipagination.total = this.dataSource.length
    }
  }
}
</script>