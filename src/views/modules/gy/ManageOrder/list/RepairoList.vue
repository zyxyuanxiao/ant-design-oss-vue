<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('报修流程上报表单')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
        selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
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
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" height="25px" alt=""
               style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="uploadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>

    <repairo-modal ref="modalForm" @ok="modalFormOk"></repairo-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import RepairoModal from './task/RepairoModal'

  export default {
    name: 'RepairoList',
    mixins: [JeecgListMixin, mixinDevice],
    components: {
      RepairoModal
    },
    data() {
      return {
        description: '报修流程上报表单管理页面',
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
          {
            title: '上报时间',
            align: 'center',
            dataIndex: 'sbsj',
            customRender: function (text) {
              return !text ? '' : (text.length > 10 ? text.substr(0, 10) : text)
            }
          },
          {
            title: '流程编码',
            align: 'center',
            dataIndex: 'lcbm'
          },
          {
            title: '报修时间',
            align: 'center',
            dataIndex: 'bxsj',
            customRender: function (text) {
              return !text ? '' : (text.length > 10 ? text.substr(0, 10) : text)
            }
          },
          {
            title: '报修人',
            align: 'center',
            dataIndex: 'bxr'
          },
          {
            title: '报修部门',
            align: 'center',
            dataIndex: 'bxbm'
          },
          {
            title: '优先级',
            align: 'center',
            dataIndex: 'yxj'
          },
          {
            title: '报修标题',
            align: 'center',
            dataIndex: 'bxbt'
          },
          {
            title: '法院',
            align: 'center',
            dataIndex: 'fy'
          },
          {
            title: '法院编码',
            align: 'center',
            dataIndex: 'fybm'
          },
          {
            title: '报修描述',
            align: 'center',
            dataIndex: 'bxms'
          },
          {
            title: '报修类型',
            align: 'center',
            dataIndex: 'bxlx'
          },
          {
            title: '维修人员',
            align: 'center',
            dataIndex: 'wxry'
          },
          {
            title: '维修公司',
            align: 'center',
            dataIndex: 'wxgs'
          },
          {
            title: '解决时间',
            align: 'center',
            dataIndex: 'jjsj',
            customRender: function (text) {
              return !text ? '' : (text.length > 10 ? text.substr(0, 10) : text)
            }
          },
          {
            title: '工时',
            align: 'center',
            dataIndex: 'gs'
          },
          {
            title: '解决方案简述',
            align: 'center',
            dataIndex: 'jjfajs'
          },
          {
            title: '流程状态',
            align: 'center',
            dataIndex: 'lczt'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            // fixed:"right",
            width: 147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: '/cascade/repairo/list',
          delete: '/cascade/repairo/delete',
          deleteBatch: '/cascade/repairo/deleteBatch',
          exportXlsUrl: '/cascade/repairo/exportXls',
          importExcelUrl: 'cascade/repairo/importExcel',
        },
        dictOptions: {},
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      initDictConfig() {
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>