<template>
  <div class="hardDick">
    <a-card :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline"
                @keyup.enter.native="searchQuery"
                class="serch-form">
          <a-row :gutter="24">
            <a-col :md="6"
                   :sm="8">
              <a-form-item label="NVRIP">
                <a-input placeholder="请输入NVRIP"
                         v-model="queryParam.ip"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6"
                   :sm="12">
              <a-form-item label="NVR厂商">
                <a-select v-model="queryParam.company"  placeholder="请选择NVR厂商">
                  <a-select-option value="">
                    全部
                  </a-select-option>
                  <a-select-option value="大华">
                    大华
                  </a-select-option>
                  <a-select-option value="海康">
                    海康
                  </a-select-option>
                  <a-select-option value="华为">
                    华为
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6"
                   :sm="12">
              <a-form-item label="硬盘状态">
                <a-select v-model="queryParam.status" >
                  <a-select-option value="">
                    全部
                  </a-select-option>
                  <a-select-option value="1">
                    在线
                  </a-select-option>
                  <a-select-option value="0">
                    离线
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6"
                   :sm="8">
              <span style="float: left;overflow: hidden;"
                    class="table-page-search-submitButtons">
                <a-button type="primary"
                          @click="searchQuery"
                          icon="search">查询</a-button>
                <a-button type="primary"
                          @click="searchReset"
                          icon="reload"
                          style="margin-left: 8px">重置</a-button>
              </span>
            </a-col>

          </a-row>
        </a-form>
      </div>

      <!-- 操作按钮区域 -->
      <div class="table-operator">
        <!-- <a-button type="primary"
                icon="plus">新增</a-button> -->
        <a-button type="primary"
                  icon="download"
                  @click="handleExportXls('在线监测结果')">导出</a-button>
        <!-- <a-button type="primary"
                  icon="import">导入</a-button> -->
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
                 :rowKey="record => record.ip"
                 :columns="columns"
                 :dataSource="dataSource"
                 :pagination="ipagination"
                 :loading="loading"
                 :scroll="{x:true}"
                 :rowSelection="{selectedRowKeys: selectedRowKeys,selectedRows:selectedRows, onChange: onSelectChange,fixed: true}"
                 @change="handleTableChange"
                 class="j-table-force-nowrap">

          <template slot="status"
                    slot-scope="text, record">
            <img v-if="text === '1'" src="../../assets/spOnline.png">
            <img v-else src="../../assets/spOffline.png">
          </template>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import JSuperQuery from '@/components/jeecg/JSuperQuery'
  import HardDiskDrawer from './HardDiskDrawer'
  export default {
    name: 'HardDiskOnline',
    mixins: [JeecgListMixin],
    components: {
      JSuperQuery,
      HardDiskDrawer
    },
    data () {
      return {
        description: '在线监测管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            align: 'center',
            customRender: function (t, r, index) {
              return parseInt(index) + 1
            }
          },
          {
            title: 'NVRIP',
            dataIndex: 'ip',
            align: 'left',
            key: 'ip'
          },
          {
            title: 'nvr厂商',
            dataIndex: 'company',
            align: 'left',
            key: 'company'
          },
          {
            title: '管理单位',
            dataIndex: 'dept',
            align: 'left',
            key: 'dept'
          },
          {
            title: '在线状态',
            dataIndex: 'status',
            align: 'left',
            key: 'status',
            scopedSlots: { customRender: 'status' }
          },
          {
            title: '获取时间',
            dataIndex: 'updatetime',
            align: 'left',
            key: 'updatetime'
          }
        ],
        url: {
          list: '/api/video/ping/query',
          exportXlsUrl: '/api/video/ping/export'
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
        VideoMark: [],
        detailRow: {},
        dotPosition: '全部'
      }
    },
    created () {
    },
    methods: {
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>
<style lang="less">
  /** 横向滚动设置配合样式 */
  .hardDick .ant-table td,
  th {
    white-space: nowrap;
  }
  .hardDick .anty-row-operator button {
    margin: 0 5px;
  }

  .hardDick .ant-btn-danger {
    background-color: #ffffff;
  }

  .valid-error-cust {
    .ant-select-selection {
      border: 2px solid #f5222d;
    }
  }
  .top-count {
    padding: 20px;
    margin: 0 auto;
    margin-bottom: 10px;
    background: #ffffff;
  }
  .serch-form {
    clear: both;
  }
  .top-count ul li {
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .top-count ul {
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
    text-align: center;
    margin: 0 80px;
  }
  .top-count li {
  }
  .top-count .ver {
    position: relative;
    top: -1.06em;
    display: inline-block;
    width: 1px;
    height: 1.9em;
    margin: 0 8px;
    vertical-align: middle;
  }
  .nums {
    font-size: 24px;
    color: #101010;
  }
</style>
