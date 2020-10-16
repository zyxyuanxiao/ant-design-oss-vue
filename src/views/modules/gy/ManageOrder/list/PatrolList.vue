<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form>
        <a-row>
          <a-col :md="8" :sm="12">
            <a-form-item label="法院名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select v-model="queryParam.fymc" placeholder="请选择法院">
                <a-select-option v-for="type in courtNames" :key="type.label">{{
                  type.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="12">
            <a-form-item label="更多查询" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select mode="multiple" @change="changeSel" v-model="values" placeholder="请选择需要查询的字段">
                <a-select-option v-for="type in fieldList" :key="type.comment">{{ type.comment }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!--查询-->
          <a-col :md="6" :sm="8">
            <span style="float: right;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>

        <!--更多查询-->
        <a-row>

          <a-col :md="8" :sm="12" v-for="item in items" :key="item.name">
            <!-- 下拉框 -->
            <a-form-item
              :label="item.comment"
              v-if="item.type === 'select'"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select v-model="item.value" :options="item.options" placeholder="请选择"></a-select>
            </a-form-item>

            <!-- 时间选择框 -->
            <a-form-item
              :label="item.comment"
              v-else-if="item.type === 'datetime'"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <!-- @change="onChange" -->
              <a-range-picker
                :show-time="{format: 'YYYY-MM-DD HH:mm:ss'}"
                style="width:100%;"
                v-model="item.value"></a-range-picker>
            </a-form-item>

            <!-- 文本框 -->
            <a-form-item
              :label="item.comment"
              v-else-if="item.type === 'varchar'"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-model="item.value" placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!--<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <!--<a-button type="primary" icon="download" @click="handleExportXls('巡检流程上报表单')">导出</a-button>-->
      <!--<a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"-->
      <!--@change="handleImportExcel">-->
      <!--<a-button type="primary" icon="import">导入</a-button>-->
      <!--</a-upload>-->
      <!--<a-dropdown v-if="selectedRowKeys.length > 0">-->
      <!--<a-menu slot="overlay">-->
      <!--<a-menu-item key="1" @click="batchDel">-->
      <!--<a-icon type="delete"/>-->
      <!--删除-->
      <!--</a-menu-item>-->
      <!--</a-menu>-->
      <!--<a-button style="margin-left: 8px"> 批量操作-->
      <!--<a-icon type="down"/>-->
      <!--</a-button>-->
      <!--</a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <!--<div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">-->
      <!--<i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{-->
      <!--selectedRowKeys.length }}</a>项-->
      <!--<a style="margin-left: 24px" @click="onClearSelected">清空</a>-->
      <!--</div>-->


      <!--:rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"-->
      <a-table
        :expandedRowKeys="expandedKeys"
        @expand="onExpand"
        :expandRowByClick="true"
        :expandIconAsCell="false"
        :expandIconColumnIndex=-1
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <div slot="expandedRowRender"
             class="expansionWrapper"
        >
          <div
            class="expansionWrapper-item"
            :key='item.dataIndex'
            v-for="item in selectedData">
            <div
              v-if="item.value"
            >
              {{item.title}} : {{item.value}}
            </div>
          </div>
        </div>

      </a-table>
    </div>

    <patrol-modal ref="modalForm" @ok="modalFormOk"></patrol-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import PatrolModal from './task/PatrolModal'
  import { deleteAction, getAction, postAction, putAction, httpAction } from '@/api/manage'

  export default {
    name: 'PatrolList',
    mixins: [JeecgListMixin, mixinDevice],
    components: {
      PatrolModal
    },
    data() {
      return {
        description: '巡检流程上报表单管理页面',
        values: [],
        expandedKeys: [],
        selectedData: [],
        flag: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: 'center',
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          // {
          //   title: '创建时间',
          //   align: 'center',
          //   dataIndex: 'createTime'
          // },
          {
            title: '巡检标题',
            align: 'center',
            dataIndex: 'xjbt'
          },
          {
            title: '上报时间',
            align: 'center',
            dataIndex: 'sbsj',

          },
          // {
          //   title: '流程状态',
          //   align: 'center',
          //   dataIndex: 'lczt'
          // },
          {
            title: '巡检公司',
            align: 'center',
            dataIndex: 'xjgs'
          },
          {
            title: '巡检人员',
            align: 'center',
            dataIndex: 'xjry'
          },
          {
            title: '法院名称',
            align: 'center',
            dataIndex: 'fymc'
          },
          // {
          //   title: '工作量',
          //   align: 'center',
          //   dataIndex: 'gs'
          // },
          {
            title: '巡检时间',
            align: 'center',
            dataIndex: 'xjsj',

          },
          {
            title: '巡检结果',
            align: 'center',
            dataIndex: 'xjjg'
          },
          // {
          //   title: '巡检类型',
          //   align: 'center',
          //   dataIndex: 'xjlx'
          // },

          // {
          //   title: '巡检详情',
          //   align: 'center',
          //   dataIndex: 'xjxq'
          // },
          // {
          //   title: '法院编码',
          //   align: 'center',
          //   dataIndex: 'fybm'
          // },
          // {
          //   title: '流程编号',
          //   align: 'center',
          //   dataIndex: 'lcbh'
          // },
          // {
          //   title: '操作',
          //   dataIndex: 'action',
          //   align: 'center',
          //   // fixed:"right",
          //   width: 147,
          //   scopedSlots: { customRender: 'action' }
          // }
        ],
        url: {
          list: '/cascade/patrol/list',
          delete: '/cascade/patrol/delete',
          deleteBatch: '/cascade/patrol/deleteBatch',
          exportXlsUrl: '/cascade/patrol/exportXls',
          importExcelUrl: 'cascade/patrol/importExcel',
          courtName: 'cascade/patrol/courtName',
          columns: 'cascade/patrol/columns',
          searchQuery: 'cascade/patrol/searchQuery'
        },
        dictOptions: {},
        courtNames: [],
        fieldList: [],
        items: [],
        paginationOld: { current: 1, pageSize: 10 },
        columnList: []
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    created() {
      this.courtName()
      this.getColumns()
    },
    methods: {
      onExpand(expanded, record) {
        if (expanded) {
          this.expandedKeys = []
          this.detail(record.id)
          this.expandedKeys.push(record.id);
        } else {
          this.expandedKeys = []
        }
      },
      detail(id) {
        this.selectedData = []
        let record = {}
        for (let i = 0; i < this.dataSource.length; i++) {
          if (id === this.dataSource[i].id) {
            record = this.dataSource[i]
          }
        }
        let columnList = this.columnList;
        for (let i = 0; i < columnList.length; i++) {
          let title = columnList[i].comment;
          let value = record[columnList[i].name];
          let param = { 'title': title, value: value };
          this.selectedData.push(param);
        }
        // console.log(this.selectedData);
      },
      handleTableChange(pagination) {
        //分页、排序、筛选变化时触发
        //TODO 筛选
        console.log(pagination)
        this.ipagination = pagination;
        this.queryParam.pageNo = pagination.current;
        this.queryParam.pageSize = pagination.pageSize
        this.searchQuery();
      },
      searchReset() {
        this.loading = true
        this.expandedKeys = []
        this.queryParam = {}
        this.loadData(1)
      },
      searchQuery() {
        this.loading = true;
        let param = {};
        if (this.paginationOld.current == this.ipagination.current && this.paginationOld.pageSize == this.ipagination.pageSize) {
          this.ipagination.current = 1
          this.queryParam.pageNo = 1
        }
        for (let i = 0; i < this.items.length; i++) {
          let name = this.items[i].name
          let value = this.items[i].value
          param[name] = value
        }
        if (this.param.fymc != '' && this.queryParam.fymc) {
          param.fymc = this.queryParam.fymc
        }
        postAction(this.url.searchQuery, param, {
          pageNo: this.ipagination.current,
          pageSize: this.ipagination.pageSize
        }).then((res) => {
          this.dataSource = res.result.records
          this.ipagination.total = res.result.total
          this.loading = false
        })
        this.expandedKeys = []
        this.paginationOld = this.ipagination
      },

      changeSel() {
        this.items = []
        for (let i = 0; i < this.values.length; i++) {
          let comment = this.values[i]
          for (let j = 0; j < this.fieldList.length; j++) {
            let arr = {}
            let t = this.fieldList[j].comment
            if (t === comment) {
              arr = this.fieldList[j]
              this.items.push(arr)
            }
          }
        }
        console.log(this.items)
      },
      getColumns() {
        // this.flag = true
        getAction(this.url.columns, {
          tableName: 'patrol'
        }).then((res) => {
          if (res.success) {
            this.columnList = res.result
            for (let i = 0; i < this.columnList.length; i++) {
              let name = this.columnList[i].name;
              if (name != 'fybm' && name != 'gs' && name != 'lczt' && name != 'fymc' && name != 'xjxq') {
                this.fieldList.push(this.columnList[i])
              }
            }
          }
        })
      },
      courtName() {
        getAction(this.url.courtName, {}).then((res) => {
          if (res.success) {
            this.courtNames = res.result;
          }
        })
      },
      initDictConfig() {
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';

  .expansionWrapper {
    display: flex;
    flex-wrap: wrap;
    border-radius: 5px;
    font-size: 18px;
    font-weight: 800;
    width: 100%;
    margin: auto;
  }

  .expansionWrapper-item {
    width: 33%;
    padding: 10px 40px;
  }
</style>