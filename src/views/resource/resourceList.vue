<template>
  <a-card :bordered="false">
    <a-layout>
      <a-layout-content>
        <a-layout>
          <a-layout-sider style="background: #fff">
            <a-tree @select="onSelect">
              <a-icon slot="icon"
                      type="carry-out" />
              <a-tree-node v-for="item in tree"
                           :key="item.code">
                <a-icon slot="icon"
                        type="carry-out" />
                <span slot="title">{{ item.name }}</span>
                <a-tree-node v-for="tail in item.cmdbTreeDetailList"
                             :key="tail.code"
                             :title="tail.name">
                  <a-icon slot="icon"
                          type="carry-out" />
                </a-tree-node>
              </a-tree-node>
            </a-tree>
          </a-layout-sider>
          <a-layout-content :style="{minHeight: '280px',padding:'20px',background:'#fff'}">
            <!-- 查询区域 -->
            <div class="table-page-search-wrapper">
              <a-form layout="inline">
                <a-row :gutter="24">

                  <a-col :xl="6"
                         :lg="7"
                         :md="8"
                         :sm="24">
                    <a-form-item label="设备IP">
                      <a-input placeholder="请输入ip"></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :xl="6"
                         :lg="7"
                         :md="8"
                         :sm="24">
                    <a-form-item label="设备名称">
                      <a-input placeholder="请输入设备名称"></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :xl="6"
                         :lg="7"
                         :md="8"
                         :sm="24">
                    <a-form-item label="序列号">
                      <a-input placeholder="请输入设备序列号"></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :xl="6"
                         :lg="7"
                         :md="8"
                         :sm="24">
                    <span style="float: left;overflow: hidden;"
                          class="table-page-search-submitButtons">
                      <a-button type="primary"
                                icon="search">查询</a-button>
                      <a-button type="primary"
                                icon="reload"
                                style="margin-left: 8px">重置</a-button>
                    </span>
                  </a-col>
                </a-row>
              </a-form>
            </div>

            <!-- 操作按钮区域 -->
            <div class="table-operator">
              <a-button type="primary"
                        icon="plus">新增</a-button>
              <a-button type="primary"
                        icon="download"
                        @click="handleExportXls('在线图表')">导出</a-button>
              <a-button type="primary"
                        icon="import">导入</a-button>
              <a-dropdown v-if="selectedRowKeys.length > 0">
                <a-menu slot="overlay">
                  <a-menu-item key="1"
                               @click="batchDeleteCust">
                    <a-icon type="delete" />
                    删除
                  </a-menu-item>
                </a-menu>
                <a-button> 批量操作
                  <a-icon type="down" />
                </a-button>
              </a-dropdown>
            </div>

            <!-- table区域-begin -->
            <div>
              <div class="ant-alert ant-alert-info"
                   style="margin-bottom: 16px;">
                <i class="anticon anticon-info-circle ant-alert-icon"></i>
                已选择
                <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>
                项
                <a style="margin-left: 24px"
                   @click="onClearSelected">清空</a>
              </div>

              <a-table ref="table"
                       size="middle"
                       bordered
                       rowKey="id"
                       :columns="columns"
                       :dataSource="tableData"
                       :pagination="ipagination"
                       :loading="loading"
                       :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                       @change="handleTableChange">

                <template slot="action"
                          slot-scope="text, record">
                  <a @click="handleEdit(record)">编辑</a>

                  <a-divider type="vertical" />
                  <a class="ant-dropdown-link">更多
                    <a-icon type="down" />
                  </a>
                </template>
              </a-table>
            </div>
            <!-- table区域-end -->
          </a-layout-content>
        </a-layout>
      </a-layout-content>
    </a-layout>
  </a-card>
</template>

<script>
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import OnlCgformHeadModal from '@views/modules/online/cgform/modules/OnlCgformHeadModal'
import { deleteAction, postAction, getAction } from '@/api/manage'
import JMultiSelectTag from '@comp/dict/JMultiSelectTag'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import Clipboard from 'clipboard'
import JSuperQuery from '@/components/jeecg/JSuperQuery'
import EnhanceJs from '@views/modules/online/cgform/modules/EnhanceJs'
import EnhanceSql from '@views/modules/online/cgform/modules/EnhanceSql'
import EnhanceJava from '@views/modules/online/cgform/modules/EnhanceJava'
import TransDb2Online from '@views/modules/online/cgform/modules/TransDb2Online'
import CodeGenerator from '@views/modules/online/cgform/modules/CodeGenerator'
import OnlCgformButtonList from '@views/modules/online/cgform/button/OnlCgformButtonList'
import { filterObj } from '@/utils/util';

export default {
  name: 'OnlCgformHeadList',
  mixins: [JeecgListMixin],
  components: {
    OnlCgformHeadModal,
    EnhanceJs,
    EnhanceSql,
    EnhanceJava,
    TransDb2Online,
    CodeGenerator,
    OnlCgformButtonList,
    JMultiSelectTag,
    JSuperQuery
  },
  data () {
    return {
      description: '资产数据管理页面',
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          }
        }
      ],
      url: {
        treeList: '/resource/tree/select',
        list: '/resource/table/select',
        selectDesignJson: '/resource/table/selectDesignJson'
      },
      tableTypeDictOptions: [],
      sexDictOptions: [],
      syncModalVisible: false,
      syncFormId: '',
      synMethod: 'normal',
      syncLoading: false,
      onlineUrlTitle: '',
      onlineUrlVisible: false,
      onlineUrl: '',
      selectedRowKeys: [],
      selectedRows: [],
      confirmVisible: false,

      tree: [],
      condition: {
        pageSize: 10,
        pageNo: 1,
        tableName: 'switch'
      },
      tableData: [],
      desformCode: '',
      designJson: {}
    }
  },
  created () {
    this.getTreeList()
    this.getTableData()
    this.getDesignJson()
  },
  methods: {
    onSelect (selectedKeys, info) {
      this.condition.tableName = selectedKeys[0]
      console.log('selected', selectedKeys[0]);
      console.log('selected', selectedKeys);
      this.getTableData()
    },
    getTreeList () {
      getAction(this.url.treeList).then((res) => {
        if (res.success) {
          this.tree = res.result
        }
      })
    },
    getTableData () {
      postAction(this.url.list, this.condition).then((res) => {
        if (res.success) {
          this.tableData = res.result.list
        }
      })
      console.log(this.tableData)
    },
    getDesignJson () {
      this.desformCode = this.condition.tableName
      getAction(this.url.selectDesignJson, { desformCode: this.desformCode }).then((res) => {
        if (res.success) {
          let list = res.result.list
          for (let item of list) {
            this.columns.push({ 'title': item.name, 'dataIndex': item.model })
          }
          let scopedSlots = { customRender: 'action' }
          this.columns.push({ 'title': '操作', 'dataIndex': 'action', 'align': 'center', 'scopedSlots': scopedSlots, 'width': '15%' })
        }
      })
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
<style lang="less" scoped>
/** 横向滚动设置配合样式 */
.ant-table td,
th {
  white-space: nowrap;
}
.anty-row-operator button {
  margin: 0 5px;
}

.ant-btn-danger {
  background-color: #ffffff;
}

.valid-error-cust {
  .ant-select-selection {
    border: 2px solid #f5222d;
  }
}
</style>