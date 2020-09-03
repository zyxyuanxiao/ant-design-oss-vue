<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper test">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="8" :sm="10">
            <!-- <a-form-item label="工单类型">
              <a-input placeholder="请输入工单类型" v-model="queryParam.processName"></a-input>
            </a-form-item>-->
            <a-form-item label="工单类型">
              <a-select v-model="queryParam.processName" style="width: 100%" placeholder="请选择工单类型">
                <a-select-option
                  v-for="type in typeList"
                  :key="type.procName"
                  @click="codeChange(type.desformCode)"
                >{{ type.procName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="10" v-show="!flag">
            <a-form-item label="工单标题">
              <a-input placeholder="请输入工单标题" v-model="queryParam.bpmBizTitle"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="10" v-show="flag">
            <a-form-item label="开始时间范围"  >
              <a-range-picker
                :show-time="{ format: 'HH:mm:ss' }"
                format="YYYY-MM-DD HH:mm:ss"
                style="width:auto;"
                @change="onChange"
                v-model="datas"
              >
                <template slot="renderExtraFooter">extra footer</template>
              </a-range-picker>
            </a-form-item>
          </a-col>


          <a-col :md="6" :sm="8">
            <span style="float: right;overflow: hidden;" class="table-page-search-submitButtons">
              <a-form-item>
                <!-- 高级查询区域 -->
                <super-query
                  v-show="flag"
                  v-model="param"
                  :fieldList="fieldList"
                  ref="superQueryModal"
                ></super-query>

                <a-button
                  type="primary"
                  @click="searchQuery"
                  icon="search"
                  style="margin-left: 16px"
                >查询</a-button>

                <a-button
                  type="primary"
                  @click="searchReset"
                  style="margin-left: 16px"
                  icon="reload"
                >重置</a-button>
              </a-form-item>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        :scroll="{x: 1600}"
        bordered
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="showHistory(record)">
            查看
          </a>
          <!-- <template v-if="record.endTime&&record.endTime!=''">
            <a @click="showHistory(record)">历史</a>
          </template>
          <template v-else>
            <a-dropdown>
              <a class="ant-dropdown-link">
                更多
                <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a-popconfirm title="确定要作废流程吗?" @confirm="() => invalidProcess(record)">
                    <a>作废流程</a>
                  </a-popconfirm>
                </a-menu-item> -->
                <!-- <a-menu-item >
                      <a-popconfirm title="确定要取回流程吗?" @confirm="() => callBackProcess(record)">
                        <a>
                          取回流程
                        </a>
                      </a-popconfirm>
                </a-menu-item>-->
                <!-- <a-menu-item @click="showHistory(record)">历史</a-menu-item>
              </a-menu>
            </a-dropdown>
          </template> -->
        </span>

        <!-- 字符串超长截取省略号显示-->
        <span slot="bpmBizTitle" slot-scope="text">
          <j-ellipsis :value="text" :length="10" />
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 弹出框 -->
    <his-task-deal-modal ref="taskDealModal" :path="path" :formData="formData"></his-task-deal-modal>
  </a-card>
</template>

<script>
import { filterObj } from '@/utils/util'
import { getAction, putAction, httpAction } from '@/api/manage'
import HisTaskDealModal from './task/HisTaskDealModalG'
import JEllipsis from '@/components/jeecg/JEllipsis'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { BpmNodeInfoMixin } from '@/views/modules/bpm/mixins/BpmNodeInfoMixin'
import JDate from '@/components/jeecg/JDate'
import SuperQuery from './task/SuperQuery.vue'
import { postAction } from '../../../../../api/manage'

export default {
  name: 'HisProcessList',
  mixins: [JeecgListMixin, BpmNodeInfoMixin],
  components: {
    HisTaskDealModal,
    JEllipsis,
    JDate,
    SuperQuery,
  },
  data() {
    return {
      flag: false,
      description: '历史流程',
      bpmStatusList: [
        { name: '待提交', bpmStatus: '1' },
        { name: '处理中', bpmStatus: '2' },
        { name: '已完成', bpmStatus: '3' },
        { name: '已驳回', bpmStatus: 'rejectProcess' },
        { name: '已取回', bpmStatus: 'callBackProcess' },
        { name: '已作废', bpmStatus: 'invalidProcess' },
      ],
      queryParam: {},
      dataSource: [],
      typeList: [],

      datas: [],
      loading: false,
      columns: [
        {
          title: '#',
          dataIndex: '',
          width: 60,
          key: 'rowIndex',
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '工单标题',
          align: 'center',
          dataIndex: 'bpmBizTitle',
          scopedSlots: { customRender: 'bpmBizTitle' },
        },
        {
          title: '工单类型',
          align: 'center',
          dataIndex: 'prcocessDefinitionName',
        },
        // {
        //   title: '流程编号',
        //   align: 'center',
        //   dataIndex: 'processDefinitionId'
        // },
        // {
        //   title: '工单编号',
        //   align: 'center',
        //   dataIndex: 'processInstanceId',
        // },
        // {
        //   title: '当前环节',
        //   align: 'center',
        //   dataIndex: 'bpmTaskName',
        // },
        {
          title: '创建人',
          align: 'center',
          dataIndex: 'startUserName',
        },
        {
          title: '开始时间',
          align: 'center',
          dataIndex: 'startTime',
        },
        {
          title: '当前环节',
          align: 'center',
          dataIndex: 'bpmTaskName',
        },
        // {
        //   title: '结束时间',
        //   align: 'center',
        //   dataIndex: 'endTime',
        // },
        // {
        //   title: '耗时',
        //   align: 'center',
        //   dataIndex: 'spendTimes',
        // },
        // {
        //   title: '状态',
        //   align: 'center',
        //   dataIndex: 'bpmStatus',
        //   customRender: (text, index) => {
        //     if (!text && index.endTime) {
        //       return '已完成'
        //     }
        //     switch (text) {
        //       case '1':
        //         return '待提交'
        //       case '2':
        //         return '处理中'
        //       case '3':
        //         return '已完成'
        //       case 'rejectProcess':
        //         return '已驳回'
        //       case 'callBackProcess':
        //         return '已取回'
        //       case 'invalidProcess':
        //         return '已作废'
        //     }
        //     return text
        //   },
        // },
        {
          title: '操作',
          dataIndex: 'action',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 100,
        },
      ],
      url: {
        list: '/act/task/historyProcessList',
        invalidProcess: '/act/task/invalidProcess',
        callBackProcess: '/act/task/callBackProcess',
        getDynamicData: '/moreFilter/getDynamicData',
        roleDegisnList: '/designform/designFormCommuse/roleDegisnList',
        codeChange: '/act/task/codeChange',
      },
      path: 'modules/bpm/task/form/FormLoading',
      formData: {},
      fieldList: [{ type: 'input', value: 'name', text: '姓名' }],
      param: [],
    }
  },
  created() {
    this.initList()
  },
  methods: {
    handleTableChange(pagination) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      console.log(pagination)
      this.ipagination = pagination;
      this.queryParam.pageNo = pagination.current;
      this.queryParam.pageSize = pagination.pageSize
      console.log(this.queryParam)
      this.searchQuery();

    },
    onChange (value, dateString) {
      this.queryParam.startTime = dateString[0]
      this.queryParam.endTime = dateString[1]
      console.log('Formatted Selected Time: ', dateString)

      console.log(this.queryParam.startTime)
      console.log(this.queryParam.endTime)
    },
    handleSuperQuery() {
      console.log(param)
    },
    onChange (value, dateString) {
      this.queryParam.startTime = dateString[0]
      this.queryParam.endTime = dateString[1]

      console.log(this.queryParam.startTime)
      console.log(this.queryParam.endTime)
    },

    search () {
      getAction(this.url.list, this.queryParam).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records
          this.ipagination.total = res.result.total
        }
        if (res.code === 510) {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },

    searchReset () {
      this.queryParam = {}
      this.$refs.superQueryModal.handleReset()
      this.search()
      this.flag = false
      this.datas=[]
    },

    searchQuery () {
      let code = this.queryParam.code

      if (code != null) {
        let querys = this.$refs.superQueryModal.getValue()
        let param = {}
        this.$refs.superQueryModal.handleReset()
        for (let i = 0; i < querys.length; i++) {
          let name = querys[i].name
          let value = querys[i].value
          param[name] = value
        }
        console.log(param)
        postAction(this.url.getDynamicData, param, {
          tableName: this.queryParam.code,
          tag: 'all',
          pageNo: this.ipagination.current,
          pageSize: this.ipagination.pageSize,
          startDate: this.queryParam.startTime,
          endDate: this.queryParam.endTime
        }).then((res) => {
          this.dataSource = res.result.records
          this.ipagination.total = res.result.total
        })
      } else {
        console.log('query为空')
        this.search()
      }

    },
    codeChange (code) {
      this.flag = true
      this.queryParam.code = code
      console.log(code)
      getAction(this.url.codeChange, {
        code: code
      }).then((res) => {
        if (res.success) {
          this.fieldList = res.result
        }
      })
      this.datas = []
    },
    close () {
      this.queryParam = {}
      this.flag = false
      this.datas = []
    },

    nameChange (bpmStatus) {
      this.queryParam.bpmStatus = bpmStatus
      console.log(this.queryParam)
    },
    //
    init (url) {
      getAction(url, {}, 'GET').then((data) => {
        this.dataSource = data.result.records
        this.ipagination.total = data.result.total
      })
    },
    // 流程作废
    invalidProcess (record) {
      var that = this
      var params = {
        processInstanceId: record.processInstanceId
      }
      console.log('流程作废', params)
      putAction(that.url.invalidProcess, params).then((res) => {
        if (res.success) {
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.warning(res.message)
          that.loadData()
        }
      })
    },
    // 流程取回
    callBackProcess (record) {
      var that = this
      var params = {
        processInstanceId: record.processInstanceId
      } // 查询条件
      console.log('流程取回', params)
      putAction(that.url.callBackProcess, params).then((res) => {
        if (res.success) {
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.warning(res.message)
          that.loadData()
        }
      })
    },
    // 历史
    showHistory (record) {
      this.getHisProcessNodeInfo(record)
    },
    // 加载下拉
    initList () {
      httpAction(this.url.roleDegisnList, {}, 'GET').then((data) => {
        console.log(data)
        this.typeList = data.result
      })
    }
  }
}
</script>
<style>
.ant-card-body {
  margin-bottom: 18px;
}

.table-operator button {
  margin-bottom: 18px;
  margin-right: 5px;
}

.ant-table-tbody .ant-table-row td {
  padding-top: 15px;
  padding-bottom: 15px;
}

.anty-row-operator button {
  margin: 0 5px;
}

.ant-btn-danger {
  background-color: #ffffff;
}

.ant-modal-cust-warp {
  height: 100%;
}

.ant-modal-cust-warp .ant-modal-body {
  height: calc(100% - 110px) !important;
  overflow-y: auto;
}

.ant-modal-cust-warp .ant-modal-content {
  height: 90% !important;
  overflow-y: hidden;
}

.anty-img-wrap {
  height: 25px;
  position: relative;
}

.anty-img-wrap > img {
  max-height: 100%;
}

/** Button按钮间距 */
.ant-btn {
  margin-left: 3px;
}
</style>
