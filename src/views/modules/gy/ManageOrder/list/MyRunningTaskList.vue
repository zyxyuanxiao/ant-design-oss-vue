<template>
  <div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form>
        <a-row>
          <a-col :md="8" :sm="12">
            <a-form-item label="工单类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select v-model="queryParam.processDefinitionName" placeholder="请选择工单类型">
                <a-select-option v-for="type in typeList" :key="type.procName" @click="codeChange(type.desformCode)">{{
                  type.procName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="12" v-show="!flag">
            <a-form-item label="创建人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-search placeholder="选择创建人" @search="handleSelect" v-model="model.userName">
                <a-button slot="enterButton" icon="search">选择</a-button>
              </a-input-search>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="12" v-show="flag">
            <a-form-item label="更多查询" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select
                mode="multiple"
                @change="changeSel"
                v-model="values"

                placeholder="请选择需要查询的字段"
              >
                <a-select-option v-for="type in fieldList" :key="type.text">{{ type.text }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <span style="float: right;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
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
              <a-button
                type="primary"
                icon="edit"
                @click="handleProcessAll"
                v-show="btn"
                style="margin-left: 8px">批量办理</a-button>
            </span>
          </a-col>
        </a-row>
        <!-- 更多查询 -->
        <a-row v-show="flag">
          <!-- <a-col :md="8" :sm="12" >
            <a-form-item label="开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-range-picker :show-time="{format: 'YYYY-MM-DD HH:mm:ss'}" @change="onChange"  style="width:100%;" v-model="dates"></a-range-picker>
            </a-form-item>
          </a-col> -->
          <a-col :md="8" :sm="12" v-for="item in items" :key="item.text">
            <!-- 级联选择框 -->
            <!--<a-form-item-->
            <!--:label="item.text"-->
            <!--v-if="item.value === 'repair_from'||item.value === 'patrol_type'"-->
            <!--:labelCol="labelCol"-->
            <!--:wrapperCol="wrapperCol"-->
            <!--&gt;-->
            <!--<a-cascader :options="optionsType" placeholder="请选择" v-model="item.defaultValue"/>-->
            <!--</a-form-item>-->
            <!-- 下拉框 -->
            <a-form-item
              :label="item.text"
              v-if="item.type === 'select'"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select v-model="item.defaultValue" :options="item.options" placeholder="请选择"></a-select>
            </a-form-item>

            <!-- 时间选择框 -->
            <a-form-item
              :label="item.text"
              v-else-if="item.type === 'datetime'"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <!-- @change="onChange" -->
              <a-range-picker
                :show-time="{format: 'YYYY-MM-DD HH:mm:ss'}"
                @change="onChange"
                style="width:100%;"
                v-model="item.defaultValue"></a-range-picker>
            </a-form-item>

            <!-- 文本框 -->
            <a-form-item
              :label="item.text"
              v-else-if="item.type === 'varchar'"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-model="item.defaultValue" placeholder="请输入"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table

        @expand="onExpand"
        :expandedRowKeys="expandedKeys"
        :expandRowByClick="true"
        :expandIconAsCell="false"
        :expandIconColumnIndex="-1"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        ref="table"
        size="middle"
        bordered
        rowKey="processInstanceId"
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
            <a @click="selectEntruster(record)">
              委托
            </a>
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
          <j-ellipsis :value="text" :length="15"/>
        </span>

        <div
          slot="expandedRowRender"
          class="expansionWrapper"
        >
          <div
            class="expansionWrapper-item"
            :key="item.dataIndex"
            v-for="item in selectedData">
            <div
              v-if="item.value"
            >
              {{ item.title }} : {{ item.value }}
            </div>
          </div>
        </div>

      </a-table>
    </div>
    <!-- 弹出框 -->
    <task-deal-modal ref="taskDealModal" :path="path" :formData="formData" @ok="handleOk"></task-deal-modal>
    <task-deal-modal-all ids="ids" ref="taskDealModalAll" :path="path" :formData="formData"
                         @ok="handleOk"></task-deal-modal-all>
    <select-entruster-modal ref="selectEntrusterModal" @selectFinished="handleEntruster"></select-entruster-modal>
    <task-notify-me-modal ref="taskNotifyMeModal"></task-notify-me-modal>
    <select-single-user-modal ref="selectSingleUserModal" @selectFinished="selectUserOK"></select-single-user-modal>
  </div>
</template>

<script>
  import { filterObj } from '@/utils/util'
  import { deleteAction, getAction, postAction, putAction, httpAction } from '@/api/manage'
  import TaskDealModal from './task/TaskDealModal1'
  import TaskDealModalAll from './task/TaskDealModalAll'
  import SelectEntrusterModal from '../../../bpm/task/form/SelectEntrusterModal'
  import JEllipsis from '@/components/jeecg/JEllipsis'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { BpmNodeInfoMixin } from '@/views/modules/bpm/mixins/BpmNodeInfoMixin'
  import TaskNotifyMeModal from '../../../extbpm/process/TaskNotifyMeModal.vue'
  import SelectSingleUserModal from '../../../bpm/task/form/SelectSingleUserModal.vue'
  import JDate from '@/components/jeecg/JDate'

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
      TaskDealModalAll

    },
    data() {
      return {

        expandedKeys: [],
        // innerData:[],
        // innerColumns: [],
        selectedRowKeys: [],
        selectedData: [],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },

        items: [],
        values: [],
        plainOptions: [],
        flag: false,
        dates: [],
        description: '我的任务',
        // 查询条件
        queryParam: {},
        typeList: [],
        model: {
          userName: ''
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
            }
          },
          {
            title: '工单标题',
            align: 'center',
            dataIndex: 'bpmBizTitle',
            scopedSlots: { customRender: 'bpmBizTitle' }
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
            dataIndex: 'processDefinitionName'
          },
          //  {
          //   title: '工单编号',
          //   align: 'center',
          //   dataIndex: 'processInstanceId'
          // },
          {
            title: '创建人',
            align: 'center',
            dataIndex: 'processApplyUserName'
          },
          {
            title: '创建时间',
            align: 'center',
            dataIndex: 'taskBeginTime'
          },
          {
            title: '当前环节',
            align: 'center',
            dataIndex: 'taskName'
          },
          {
            title: '操作',
            align: 'center',
            dataIndex: 'action',

            width: 150,
            scopedSlots: { customRender: 'action' }
          }
        ],
        path: 'modules/bpm/task/form/FormLoading',
        formData: {},
        url: {
          list: '/act/task/list',
          claim: '/act/task/claim',
          taskEntrust: '/act/task/taskEntrust',
          roleDegisnList: '/designform/designFormCommuse/roleDegisnList',
          getDynamicData: '/moreFilter/getDynamicData',
          codeChange: '/act/task/codeChange',
          detail: '/moreFilter/detail',
          completeAll: '/moreFilter/completeAll',
          claimAll: '/moreFilter/claimAll'
        },
        fieldList: [],
        param: [],
        taskId: '',
        optionsType: [],
        paginationOld: { current: 1, pageSize: 10 },
        btn: false,
        tasks: [],
        ids: [],
        taskIds: []
      }
    },
    created() {
      this.initList()

    },
    methods: {
      handleProcessAll() {
        this.taskIds = []
        let tasks = this.tasks;
        console.log(tasks)
        let self = this
        for (let i = 0; i < tasks.length; i++) {
          if (tasks[i].taskAssigneeName && tasks[i].taskAssigneeName !== '') {
            self.taskIds.push(tasks[i].taskId)
          } else {
            putAction(self.url.claim, { taskId: tasks[i].taskId }).then((res) => {
              if (res.success) {
                self.taskIds.push(tasks[i].taskId)
              }
            })
          }
        }
        console.log(self.taskIds)
        setTimeout(() => {
          if (tasks.length !== this.taskIds.length) {
            this.$message.warning((tasks.length - this.taskIds.length) + '条工单流程签收失败换或已被他人签收')
          }
          if (this.taskIds.length > 0) {
            this.$refs.taskDealModalAll.getProcessTaskTransInfo(this.taskIds[0]);
            this.$refs.taskDealModalAll.deal(this.taskIds);
          }
        }, 100);
      },
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = []
        this.tasks = []
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        let name = '';
        let id = selectedRowKeys[0];
        let records = this.dataSource
        let rows = []
        for (let i = 0; i < records.length; i++) {
          if (records[i].processInstanceId === id) {
            name = records[i].processDefinitionName
          }
          for (let j = 0; j < selectedRowKeys.length; j++) {
            if (records[i].processInstanceId === selectedRowKeys[j]) {
              rows.push(records[i])
            }
          }
        }
        console.log(rows)

        for (let i = 0; i < rows.length; i++) {
          if (rows[i].processDefinitionName === name) {
            this.selectedRowKeys.push(rows[i].processInstanceId)
            let task = {
              taskId: rows[i].id,
              taskAssigneeName: rows[i].taskAssigneeName
            }
            this.tasks.push(task)
          }
        }

        if (this.selectedRowKeys.length > 0) {
          this.btn = true
        } else {
          this.btn = false
        }

        console.log(this.selectedRowKeys)
        console.log(this.tasks)
      },
      onExpand(expanded, record) {
        if (expanded) {
          this.expandedKeys = []
          this.detail(record.processInstanceId)
          this.onExpandedRowsChange(record);
        } else {
          this.expandedKeys = []
        }
      },
      onExpandedRowsChange(rows) {
        this.expandedKeys.push(rows.processInstanceId);
        console.log(this.expandedKeys)
      },
      detail(id) {
        console.log('id=' + id)
        getAction(this.url.detail, { id: id }).then((res) => {
          const { data, columns } = res.result
          console.log(data, columns)
          const result = columns.map((item) => {
            return {
              ...item,
              value: data[0][item.dataIndex]
            }
          })
          const filteredResult = result.filter(item => item.value)
          this.selectedData = [...filteredResult]

        })
      },

      changeSel() {
        this.items = []
        console.log(this.values)
        for (let i = 0; i < this.values.length; i++) {
          let text = this.values[i]
          for (let j = 0; j < this.fieldList.length; j++) {
            let arr = {}
            let t = this.fieldList[j].text
            if (t === text) {
              arr = this.fieldList[j]
              // arr.defaultValue = ''
              this.items.push(arr)
            }
          }
        }
        console.log(this.items)
      },
      handleTableChange(pagination) {
        // 分页、排序、筛选变化时触发
        // TODO 筛选
        console.log(pagination)
        this.ipagination = pagination;
        this.queryParam.pageNo = pagination.current;
        this.queryParam.pageSize = pagination.pageSize
        console.log(this.queryParam)
        this.searchQuery();
      },
      // onChange(value, dateString) {
      //   this.queryParam.startTime = dateString[0]
      //   this.queryParam.endTime = dateString[1]
      //   console.log('Formatted Selected Time: ', dateString)

      //   console.log(this.queryParam.startTime)
      //   console.log(this.queryParam.endTime)
      // },
      // handleSuperQuery() {
      //   console.log(param)
      // },

      search() {
        this.loading = true
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

        this.search()
        this.flag = false
        this.dates = []
        this.model.userName = ''
        this.loadData(1)
        this.expandedKeys = []
      },

      searchQuery() {
        this.loading = true
        let code = this.queryParam.code
        if (this.paginationOld.current == this.ipagination.current && this.paginationOld.pageSize == this.ipagination.pageSize && this.items.length > 0) {
          this.ipagination.current = 1
          this.queryParam.pageNo = 1
        }

        if (code != null) {
          let param = {}

          for (let i = 0; i < this.items.length; i++) {
            let name = this.items[i].value
            let value = this.items[i].defaultValue
            param[name] = value
          }
          console.log(param)
          postAction(this.url.getDynamicData, param, {
            tableName: this.queryParam.code,
            tag: 'todo',
            pageNo: this.ipagination.current,
            pageSize: this.ipagination.pageSize,
            startDate: this.queryParam.startTime,
            endDate: this.queryParam.endTime
          }).then((res) => {
            this.dataSource = res.result.records
            this.ipagination.total = res.result.total
            this.loading = false
          })
        } else {
          console.log('query为空')
          this.search()
        }
        this.expandedKeys = []
        this.paginationOld = this.ipagination
        this.selectedRowKeys = []
        this.btn = false
      },

      codeChange(code) {
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
        this.dates = []
        this.items = []
        this.values = []
      },

      close() {
        this.queryParam = {}
        this.flag = false
        this.dates = []
        this.items = []
        this.expandedKeys = []
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
        // this.searchQuery()
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
            that.searchQuery()
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
                that.searchQuery()
              } else {
                that.$message.warning(res.message)
                that.searchQuery()
              }
            })
          }
        })
      },
      handleOk() {
        this.searchQuery()
        // this.loadData()
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
          taskAssignee: data.username
        }
        // 查询条件
        console.log('委托', params)
        putAction(that.url.taskEntrust, params).then((res) => {
          if (res.success) {
            that.$message.success(res.message)
            that.searchQuery()
          } else {
            that.$message.warning(res.message)
            that.searchQuery()
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
      }
    }
  }
</script>
<style lang="less" scoped>
  /** Button按钮间距 */
  .ant-btn {
    margin-left: 3px;
  }

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
