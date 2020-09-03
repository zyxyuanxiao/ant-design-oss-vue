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
                   :sm="12">
              <a-form-item label="点位名称">
                <a-input placeholder="请输入点位名称"
                         v-model="queryParam.name"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6"
                   :sm="12">
              <a-form-item label="键盘编号">
                <a-input placeholder="请输入键盘编号"
                         v-model="queryParam.jpbh"></a-input>
              </a-form-item>
            </a-col>

            <template v-if="toggleSearchStatus">
              <a-col :md="6"
                     :sm="8">
                <a-form-item label="IP">
                  <a-input placeholder="请输入点位IP地址"
                           v-model="queryParam.ip"></a-input>
                </a-form-item>
              </a-col>
            </template>

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
                <a @click="handleToggleSearch"
                   style="margin-left: 8px">
                  {{ toggleSearchStatus ? '收起' : '展开' }}
                  <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
                </a>
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
                  @click="handleExportXls('视频诊断结果')">导出</a-button>
        <!-- <a-button type="primary"
                  icon="import">导入</a-button> -->
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1"
                         @click="batchInsertMark">
              <a-icon type="plus-circle"
                      theme="outlined" />
              批量标记
            </a-menu-item>
            <a-menu-item key="2"
                         @click="recallBatchInsertMark">
              <a-icon type="close-circle"
                      theme="outlined" />
              取消标记
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
                 :rowKey="record => record.devcode"
                 :columns="columns"
                 :dataSource="dataSource"
                 :pagination="ipagination"
                 :loading="loading"
                 :scroll="{x:true}"
                 :rowSelection="{selectedRowKeys: selectedRowKeys,selectedRows:selectedRows, onChange: onSelectChange,fixed: true}"
                 @change="handleTableChange"
                 class="j-table-force-nowrap">

          <template slot="onlinestatus"
                    slot-scope="text, record">
          </template>

          <template slot="streamstatus"
                    slot-scope="text, record">
          </template>

          <template slot="imgstatus"
                    slot-scope="text, record">
          </template>

          <template slot="action" slot-scope="text, record">
            <a @click="handleDetail(record)">查看详情</a>
          </template>
        </a-table>
      </div>
    </a-card>
    <hard-disk-drawer :detailRow="detailRow"
                      ref="hardDiskDrawer">

    </hard-disk-drawer>
  </div>
</template>

<script>
import { postAction, getAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JSuperQuery from '@/components/jeecg/JSuperQuery'
import HardDiskDrawer from './HardDiskDrawer'
export default {
  name: 'HardDiskMonitoring',
  mixins: [JeecgListMixin],
  components: {
    JSuperQuery,
    HardDiskDrawer
  },
  data () {
    return {
      description: '硬盘监测管理页面',
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
          dataIndex: 'jpbh',
          align: 'left',
          key: 'jpbh'
        },
        {
          title: '管理单位',
          dataIndex: 'dept',
          align: 'left',
          key: 'dept'
        },
        {
          title: '硬盘数量',
          dataIndex: 'funtype',
          align: 'left',
          key: 'funtype'
        },
        {
          title: '硬盘状态',
          dataIndex: 'onlinestatus',
          align: 'left',
          key: 'onlinestatus',
          scopedSlots: { customRender: 'onlinestatus' }
        },
        {
          title: '获取时间',
          dataIndex: 'streamstatus',
          align: 'left',
          key: 'streamstatus',
          scopedSlots: { customRender: 'streamstatus' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          fixed: "right",
          scopedSlots: { customRender: 'action' },
          align: 'left',
          width: 170
        }
      ],
      url: {
        list: '/api/video/view/list',
        getcountResult: '/api/video/view/getcountResult',
        insertMarks: '/api/video/view/insertMarks',
        exportXlsUrl: '/api/video/view/exportXls'
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
      count: {
        total: 0,
        online: 0,
        onlineRate: 0,
        imgIntegrityRate: 0
      },
      VideoMark: [],
      detailRow: {},
      dotPosition: '全部'
    }
  },
  created () {
    this.getcountResult()
  },
  methods: {
    getcountResult () {
      getAction(this.url.getcountResult).then((res) => {
        if (res.success) {
          this.count.total = res.result.total
          this.count.online = res.result.online
          this.count.onlineRate = res.result.onlineRate
          this.count.imgIntegrityRate = res.result.imgIntegrityRate
        }
      })
    },
    handleMark (record) {
      this.VideoMark = []
      let ismark = 1
      if (record.ismark === 1) {
        ismark = 0
      }
      this.VideoMark.push({ 'cameraid': record.cameraid, 'ismark': ismark })
      postAction(this.url.insertMarks, this.VideoMark).then((res) => {
        if (res.success) {
          this.$message.success(res.message);
          this.loadData();
        }
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    batchInsertMark () {
      this.VideoMark = []
      for (let rows of this.selectedRows) {
        this.VideoMark.push({ 'cameraid': rows.cameraid, 'ismark': 1 })
      }
      postAction(this.url.insertMarks, this.VideoMark).then((res) => {
        if (res.success) {
          this.$message.success(res.message);
          this.loadData();
        }
      })
      this.selectedRowKeys = []
    },
    recallBatchInsertMark () {
      this.VideoMark = []
      for (let rows of this.selectedRows) {
        this.VideoMark.push({ 'cameraid': rows.cameraid, 'ismark': 0 })
      }
      postAction(this.url.insertMarks, this.VideoMark).then((res) => {
        if (res.success) {
          this.$message.success(res.message);
          this.loadData();
        }
      })
      this.selectedRowKeys = []
    },
    handleDetail (record) {
      this.detailRow = record
      this.$refs.hardDiskDrawer.visible = true
    },
    radioOnChange (e) {
      delete this.queryParam.ismark
      delete this.queryParam.onlinestatus
      let value = e.target.value
      if (value === '全部') {
        this.queryParam = []
        this.loadData()
      } else if (value === '离线') {
        this.queryParam['onlinestatus'] = 0
        this.loadData()
      } else if (value === '在线') {
        this.queryParam['onlinestatus'] = 1
        this.loadData()
      } else if (value === '已标记') {
        this.queryParam['ismark'] = 1
        this.loadData()
      }
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
