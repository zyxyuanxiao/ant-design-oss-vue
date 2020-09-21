<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="模型名称">
              <j-multi-select-tag placeholder="请选择模型名称" dictCode="modelName" v-model="queryParam.modelId"/>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="流程环节">
              <j-multi-select-tag placeholder="请选择流程环节" dictCode="actName" v-model="queryParam.actId"/>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="字段名称">
                <j-search-select-tag placeholder="请选择字段名称" v-model="queryParam.fieldName" dict=",,ticketFieldCode"/>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="字段编码">
                <j-search-select-tag placeholder="请选择字段编码" v-model="queryParam.fieldCode" dict=",,ticketFieldCode"/>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="是否必填">
                <j-dict-select-tag placeholder="请选择是否必填" v-model="queryParam.isRequired" dictCode="isRequired"/>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="是否隐藏">
                <j-dict-select-tag placeholder="请选择是否隐藏" v-model="queryParam.isHidden" dictCode="isHidden"/>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="默认值类型">
                <j-dict-select-tag placeholder="请选择默认值类型" v-model="queryParam.defaultType" dictCode="defaultType"/>
              </a-form-item>
            </a-col>
            <a-col :xl="10" :lg="11" :md="12" :sm="24">
              <a-form-item label="创建时间">
                <j-date :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择开始时间"
                        class="query-group-cust" v-model="queryParam.createTime_begin"></j-date>
                <span class="query-group-split-cust"></span>
                <j-date :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择结束时间"
                        class="query-group-cust" v-model="queryParam.createTime_end"></j-date>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('流程字段配置')">导出</a-button>
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
      <a-button type="primary" icon="cloud-sync" @click="insertBatch()">同步字典值</a-button>
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

       <!-- <template slot="modelId" slot-scope="text">
          <div>{{getModelText(text)}}</div>
        </template>-->
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
    <ticketFieldConf-modal :model-list="modelList" ref="modalForm" @ok="modalFormOk"></ticketFieldConf-modal>
  </a-card>
</template>

<script>

import '@/assets/less/TableExpand.less'
import { getModelList, getInsertBatch } from '@/api/tickets'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import TicketFieldConfModal from './modules/TicketFieldConfModal'
import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
import JDate from '@/components/jeecg/JDate.vue'
import { filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import JMultiSelectTag from '@/components/dict/JMultiSelectTag'
import JSearchSelectTag from '@/components/dict/JSearchSelectTag'
import { mapGetters } from 'vuex'

export default {
  name: 'TicketFieldConfList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    JDictSelectTag,
    JDate,
    JMultiSelectTag,
    JSearchSelectTag,
    TicketFieldConfModal
  },
  data () {
    return {
      description: '流程字段配置管理页面',
      modelList: [],
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
          title: '模型名称',
          align: 'center',
          dataIndex: 'modelId_dictText'
        },
        {
          title: '流程环节',
          align: 'center',
          dataIndex: 'actId_dictText'
        },
        {
          title: '字段名称',
          align: 'center',
          dataIndex: 'fieldName_dictText'
        },
        {
          title: '字段编码',
          align: 'center',
          dataIndex: 'fieldCode_dictText'
        },
        {
          title: '是否只读',
          align: 'center',
          dataIndex: 'isOnly_dictText'
        },
        {
          title: '是否必填',
          align: 'center',
          dataIndex: 'isRequired_dictText'
        },
        {
          title: '是否隐藏',
          align: 'center',
          dataIndex: 'isHidden_dictText'
        },
        {
          title: '默认值类型',
          align: 'center',
          dataIndex: 'defaultType_dictText'
        },
        {
          title: '默认值',
          align: 'center',
          dataIndex: 'defaultValue'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
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
        list: '/ticket/ticketFieldConf/list',
        delete: '/ticket/ticketFieldConf/delete',
        deleteBatch: '/ticket/ticketFieldConf/deleteBatch',
        exportXlsUrl: '/ticket/ticketFieldConf/exportXls',
        importExcelUrl: 'ticket/ticketFieldConf/importExcel'
      },
      dictOptions: {}
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  created () {
    this.getModelList()
  },
  methods: {
    ...mapGetters(['userInfo']),
    initDictConfig () {
    },
    getModelList () {
      let apiKey = this.userInfo().apikey
      getModelList(apiKey).then(response => {
        this.modelList = response.result
      }).catch(error => {
        console.log(error)
      })
    },
    insertBatch() {
      getInsertBatch().then(response => {
        // this.workTypeList = response.result
      }).catch(error => {
        console.log(error)
      })
    },
    getModelText (ids) {
      let name = ''
      this.workTypeList.forEach((item) => {
        if (ids.indexOf(item.id) != -1) {
          name = name + item.name + '，'
        }
      })
      name = name.substr(0, name.length - 1)
      return name
      // let idsArr = ids.split(',')
    }

  }
}
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>