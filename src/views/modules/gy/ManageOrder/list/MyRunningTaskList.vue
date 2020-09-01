<template>
  <div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <!-- <a-col :md="6" :sm="12">
            <a-form-item label="流程编号">
              <a-input placeholder="请输入流程编号" v-model="queryParam.processDefinitionId"></a-input>
            </a-form-item>
          </a-col>-->
          <a-col :md="6" :sm="12">
            <!-- <a-form-item label="工单类型">
              <a-input placeholder="请输入工单类型" v-model="queryParam.processDefinitionName"></a-input>
            </a-form-item>-->
            <a-form-item label="工单类型">
              <a-select
                v-model="queryParam.processDefinitionName"
                style="width: 100%"
                placeholder="请选择工单类型"
              >
                <a-select-option
                  v-for="type in typeList"
                  :key="type.procName"
                  @click="codeChange(type.desformCode)"
                >{{ type.procName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="12" v-show="!flag">
            <a-form-item label="创建人">
              <a-input-search
                placeholder="选择创建人"
                readonly
                @search="handleSelect"
                v-model="model.userName"
              >
                <a-button slot="enterButton" icon="search">选择</a-button>
              </a-input-search>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="12" v-show="flag">
            <a-form-item label="开始时间范围">
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
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <template v-if="record.taskAssigneeName&&record.taskAssigneeName!=''">
            <a @click="handleProcess(record)">办理</a>
            <!-- <a-divider type="vertical" /> -->
            <!-- <a  @click="selectEntruster(record)">
              委托
            </a>-->
          </template>
          <template v-else>
            <!-- <a  @click="handleClaim(record)" >
              签收
            </a>-->
            <a @click="handleProcessC(record)">办理</a>
          </template>
        </span>
        <!-- 字符串超长截取省略号显示-->
        <span slot="bpmBizTitle" slot-scope="text, record">
          <a-icon
            title="催办提醒"
            v-if="record.taskUrge"
            theme="twoTone"
            twoToneColor="#eb2f96"
            @click="taskNotify(record)"
            type="notification"
          />
          <j-ellipsis :value="text" :length="15" />
        </span>
      </a-table>
    </div>
    <!-- 弹出框 -->
    <task-deal-modal ref="taskDealModal" :path="path" :formData="formData" @ok="handleOk"></task-deal-modal>
    <select-entruster-modal ref="selectEntrusterModal" @selectFinished="handleEntruster"></select-entruster-modal>
    <task-notify-me-modal ref="taskNotifyMeModal"></task-notify-me-modal>
    <select-single-user-modal ref="selectSingleUserModal" @selectFinished="selectUserOK"></select-single-user-modal>
  </div>
</template>

<script>
import { filterObj } from '@/utils/util'
import { deleteAction, getAction, postAction, putAction, httpAction } from '@/api/manage'
import TaskDealModal from './task/TaskDealModal1'
import SelectEntrusterModal from '../../../bpm/task/form/SelectEntrusterModal'
import JEllipsis from '@/components/jeecg/JEllipsis'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { BpmNodeInfoMixin } from '@/views/modules/bpm/mixins/BpmNodeInfoMixin'
import TaskNotifyMeModal from '../../../extbpm/process/TaskNotifyMeModal.vue'
import SelectSingleUserModal from '../../../bpm/task/form/SelectSingleUserModal.vue'
import JDate from '@/components/jeecg/JDate'
import SuperQuery from './task/SuperQuery.vue'

export default {
  name: 'MyRunningTaskList',
  mixins: [JeecgListMixin, BpmNodeInfoMixin],
  components: {
    SelectSingleUserModal,
    TaskNotifyMeModal,
    SelectEntrusterModal,
    TaskDealModal,
    JEllipsis,
    JDate,
    SuperQuery,
  },
  data() {
    return {
      flag: false,
      datas: [],
      description: '我的任务',
      // 查询条件
      queryParam: {},
      typeList: [],
      model: {
        userName: '',
      },
      // 表头
      columns: [
        {
          title: '#',
          width: 60,
          dataIndex: '',
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
        // {
        //   title: '流程编号',
        //   align: 'center',
        //   dataIndex: 'processDefinitionId'
        // },
        //  {
        //   title: '任务ID',
        //   align: 'center',
        //   dataIndex: 'taskId'
        // },
        {
          title: '工单类型',
          align: 'center',
          dataIndex: 'processDefinitionName',
        },
        //  {
        //   title: '工单编号',
        //   align: 'center',
        //   dataIndex: 'processInstanceId'
        // },
        {
          title: '创建人',
          align: 'center',
          dataIndex: 'processApplyUserName',
        },
        {
          title: '开始时间',
          align: 'center',
          dataIndex: 'taskBeginTime',
        },
        {
          title: '当前环节',
          align: 'center',
          dataIndex: 'taskName',
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'action',
          fixed: 'right',
          width: 150,
          scopedSlots: { customRender: 'action' },
        },
      ],
      path: 'modules/bpm/task/form/FormLoading',
      formData: {},
      url: {
        list: '/act/task/list',
        claim: '/act/task/claim',
        taskEntrust: '/act/task/taskEntrust',
        roleDegisnList: '/designform/designFormCommuse/roleDegisnList',
        getDynamicData: '/moreFilter/getDynamicData',
        codeChange: '/act/task/codeChange'
      },
      taskId: '',
      formData: {},
      fieldList: [],
      param: [],
    }
  },
  created() {
    this.initList()
  },
  methods: {
    onChange(value, dateString) {
      this.queryParam.startTime = dateString[0]
      this.queryParam.endTime = dateString[1]
      console.log('Formatted Selected Time: ', dateString)

      console.log(this.queryParam.startTime)
      console.log(this.queryParam.endTime)
    },
    handleSuperQuery() {
      console.log(param)
    },
    onChange(value, dateString) {
      this.queryParam.startTime = dateString[0]
      this.queryParam.endTime = dateString[1]

      console.log(this.queryParam.startTime)
      console.log(this.queryParam.endTime)
    },

    search() {
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

    searchReset() {
      this.queryParam = {}
      this.$refs.superQueryModal.handleReset()
      this.search()
      this.flag = false
      this.datas = []
      this.model.userName = ''
      this.loadData(1)
    },

    searchQuery() {
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
          tag: 'todo',
          pageNo: this.ipagination.pageNo,
          pageSize: this.ipagination.pageSize,
          startDate: this.queryParam.startTime,
          endDate: this.queryParam.endTime,
        }).then((res) => {
          this.dataSource = res.result.records
          this.ipagination.total = res.result.total
        })
      } else {
        console.log('query为空')
        this.search()
      }
    },

    codeChange(code) {
      this.flag = true
      this.queryParam.code = code
      console.log(code)
      getAction(this.url.codeChange, {
        code: code,
      }).then((res) => {
        if (res.success) {
          this.fieldList = res.result
        }
      })
      this.datas = []
    },

    close() {
      this.queryParam = {}
      this.flag = false
      this.datas = []
    },

    nameChange(bpmStatus) {
      this.queryParam.bpmStatus = bpmStatus
      console.log(this.queryParam)
    },
    //
    init(url) {
      getAction(url, {}, 'GET').then((data) => {
        this.dataSource = data.result.records
        this.ipagination.total = data.result.total
      })
    },

    selectUserOK: function (data) {
      this.model.userName = data.realname
      this.queryParam.userName = data.username
    },
    handleSelect: function () {
      this.$refs.selectSingleUserModal.select()
    },
    handleProcess(record) {
      this.getProcessNodeInfo(record)
    },
    // 自动签收
    handleProcessC(record) {
      var that = this
      var params = { taskId: record.id } // 查询条件
      putAction(that.url.claim, params).then((res) => {
        if (res.success) {
          this.getProcessNodeInfo(record)
        } else {
          that.$message.warning(res.message)
          that.loadData()
        }
      })
    },
    handleClaim(record) {
      var that = this
      var params = { taskId: record.id } // 查询条件
      this.$confirm({
        title: '确认签收吗',
        content: '是否签收该任务?',
        onOk: function () {
          putAction(that.url.claim, params).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
            } else {
              that.$message.warning(res.message)
              that.loadData()
            }
          })
        },
      })
    },
    handleOk() {
      this.loadData()
    },
    selectEntruster(record) {
      this.taskId = record.id
      this.$refs.selectEntrusterModal.select(record)
      this.$refs.selectEntrusterModal.title = '选择委托人'
    },
    handleEntruster(data) {
      var that = this
      var params = {
        taskId: this.taskId,
        taskAssignee: data.username,
      } //查询条件
      console.log('委托', params)
      putAction(that.url.taskEntrust, params).then((res) => {
        if (res.success) {
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.warning(res.message)
          that.loadData()
        }
      })
    },
    // 催办
    taskNotify(record) {
      this.$refs.taskNotifyMeModal.notify(record)
      this.$refs.taskNotifyMeModal.title = '催办提醒'
    },
    // 加载下拉
    initList() {
      httpAction(this.url.roleDegisnList, {}, 'GET').then((data) => {
        this.typeList = data.result
      })
    },
  },
}
</script>
<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 3px;
}
</style>
