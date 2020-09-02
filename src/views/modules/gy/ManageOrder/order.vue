<template>
  <a-card class="gy-ticket">
    <a-col>
      <a-col :xs="12" :sm="10" :md="8" :lg="6" :xl="4" v-for="data in dataListTj" :key="data.id" style="padding: 5px;min-width: 242px;">
        <a-card class="box-card" :body-style="{ padding: '0px',boxShadow: '0 2px 12px 0 rgba(97,111,255,.2)'}" @click="start(data)">
          <!-- <div class="actCard" style="display:flex;"> -->
          <!-- <div style="line-height:25px;height:60px;">
            <div class='long'>
              <span :title="data.name" style="font-size:18px;">{{data.name}}</span>
            </div>
            <div style="width:60px;text-align: center;rgba(106, 146, 103, 0.1);">
              <span class="gy_numStyle" style="">{{data.sum}}</span>
            </div>
          </div>
          <div class="icon">
              <a-icon type="plus-circle" style="transform: scale(1.8)" @click="start(data)" /> -->
          <!-- <img style="transform: scale(0.7); width: 100px; height: 100px" src="./icon/add.png">
        </div> -->
          <div class="actCard" style="cursor: pointer;display:flex;">
            <div class="icon-style1">
              <img class="ticket-icon" src="./icon/ticket.png">
            </div>
            <!-- <div style="height: 90px;flex:1;text-align: center;line-height: 45px;"> -->
            <div style="width: 100%;text-align: center;">
              <div><span class="gy_numStyle">{{data.sum}}</span></div>
              <div class='long'><span style="font-size:18px;color: #000;">{{data.name}}</span></div>
            </div>
            <!-- <div class="icon-style">
              <img class="add-icon" style="transform: scale(0.7); width: 90px; height: 90px" src="./icon/add1.png" @click="start(data)">
            </div> -->
          </div>
        </a-card>
      </a-col>
    </a-col>
    <a-col :span="24">
      <a-tabs id="tabs" :default-active-key="tabName" v-model="tabName" @tabClick="handleClick">
        <a-tab-pane tab="我的待办" key="todo">
          <a-tabs defaultActiveKey="1" tabPosition="left" @tabClick="handleClickT">
            <!-- 我的任务 -->
            <a-tab-pane key="1">
              <span slot="tab">
                <a-icon type="user"/>
                <span>已接任务</span>
              </span>
              <my-running-task-list ref="todoList"></my-running-task-list>

            </a-tab-pane>
            <!-- 组任务 -->
            <a-tab-pane key="2" forceRender>
              <span slot="tab">
                <a-icon type="team"/>
                <span>待接任务</span>
              </span>
              <my-group-task-list ref="groupList"></my-group-task-list>
            </a-tab-pane>
          </a-tabs>
        </a-tab-pane>
        <a-tab-pane tab="我参与的" key="partin">
          <part-his-process-list ref="partinList"></part-his-process-list>
        </a-tab-pane>
        <a-tab-pane tab="全部工单" key="all" v-has="'order:all'" v-if="allOrderPermission">
          <his-process-list ref="AllList"></his-process-list>
        </a-tab-pane>
      </a-tabs>

    </a-col>

    <auto-desform-data-modal ref="desformModal" :dialogOptions="dialogOptions"
                             @added="handleDesformDataAdded"></auto-desform-data-modal>
  </a-card>
</template>

<script>
  import AutoDesformDataModal from '../process/AutoDesformDataModal.vue'
  import { httpAction, postAction, getAction } from '@/api/manage'
  import JEllipsis from '@/components/jeecg/JEllipsis'
  import MyRunningTaskList from './list/MyRunningTaskList'
  import MyGroupTaskList from './list/MyGroupTaskList'
  import HisProcessList from './list/HisProcessList'
  import PartHisProcessList from './list/PartHisProcessList'
  import ACol from 'ant-design-vue/es/grid/Col'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  // import cw from './icon/add.png'
  export default {
    data() {
      return {
        vars: [
          {
            'key': 'userName',
            'value': ''
          }
        ],
        allOrderPermission: false,
        searchForm: {
          beginDate: '',
          endDate: '',
          vars: {
            keys: '',
            values: ''
          },
          name: '',
          sex: '',
          inDate: ''
        },
        /* 分页参数 */
        ipagination: {
          current: 1,
          pageSize: 5,
          pageSizeOptions: ['5', '10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + '-' + range[1] + ' 共' + total + '条'
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        searchDates: '',
        searchtimes: '',

        tabName: 'todo',
        tabData: {
          todoList: [],
          partInList: [],
          allList: []
        },
        visible: false,
        processInstanceId: '',
        dataList: [],
        dataList2: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        orderBy: '',
        dataListSelections: [],
        isSearchCollapse: true,
        isCreateCollapse: false,
        loading: false,
        dataListTj: [],
        flowCodePre: 'desform_',
        dialogOptions: { top: 60, width: 1000, padding: { top: 25, right: 25, bottom: 30, left: 25 } },
        url: {
          list: '/act/process/lists',
          start: '/act/process/starttest',
          roleDegisnList: '/designform/designFormCommuse/roleDegisnList',
          queryByCode: '/desform/queryByCode',
          add: '/process/extActDesignFlowData/add',
          startProcess: '/process/extActProcess/startDesFormMutilProcess'
        }
      }
    },
    components: {
      ACol,
      AutoDesformDataModal,
      JEllipsis,
      MyRunningTaskList,
      MyGroupTaskList,
      HisProcessList,
      PartHisProcessList
    },
    created() {
      this.refreshTypeSumList("todo"),
      this.isAllOrder()
    },
    watch: {
      searchDates() {
        if (this.searchDates) {
          this.searchForm.beginDate = this.searchDates[0]
          this.searchForm.endDate = this.searchDates[1]
        } else {
          this.searchForm.beginDate = ''
          this.searchForm.endDate = ''
        }
      }
    },
    methods: {
      random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower
      },
      addById() {
        this.$router.push({ path: '../order/create' })
        // this.$refs.leaveFormForm.init('add', '')
      },
      // 获取工单类型列method表
      refreshType() {
        this.loading = true
        this.$http({
          url: '/flowable/process/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            ...this.searchForm
          }
        }).then(({ data }) => {
          if (data && data.success) {
            this.dataList2 = data.page.list
            // this.total = data.page.count
            this.loading = false
          }
        })
      },
      resetForm() {
        // this.$refs.searchForm.resetFields()
        this.searchForm.procDefKey = ''
      },
      // 获取数据列表
      refreshList() {
        if (this.tabName === 'todo') {
          this.refreshToDoList()
        } else if (this.tabName === 'partin') {
          this.refreshPartList()
        } else {
          this.refreshAllList()
        }
      },
      // 顶部根据工单类型统计工单数据
      refreshTypeSumList (name) {

        this.$http.get('/gy/count/countbytype?name='+name).then((data) => {
          if (data && data.success) {
            console.log(data)
            this.dataListTj = data.result
          }
        })
      },
      // 切换主tabs
      handleClick (tab, event) {
        if(tab === 'partin'){
          this.refreshTypeSumList('part')
          this.$refs.partinList ? this.$refs.partinList.init('/act/task/partProcessList') : ''
          this.$refs.partinList ? this.$refs.partinList.close() : ''
        } else if(tab === 'todo') {
          this.refreshTypeSumList('todo')
          this.$refs.todoList ? this.$refs.todoList.init('/act/task/list') : ''
          this.$refs.todoList ? this.$refs.todoList.close() : ''
        } else if(tab === 'all') {
          this.refreshTypeSumList('all')
          this.$refs.AllList ? this.$refs.AllList.init('/act/task/historyProcessList') : ''
          this.$refs.AllList ? this.$refs.AllList.close() : ''
         
        }
      },
      handleClickT (tab, event) {
        if(tab === '1'){
          this.refreshTypeSumList('todo')
          this.$refs.todoList ? this.$refs.todoList.init('/act/task/list') : ''
          this.$refs.todoList ? this.$refs.todoList.close() : ''
        } else if(tab === '2') {
          this.refreshTypeSumList('group')
          this.$refs.groupList ? this.$refs.groupList.init('/act/task/taskGroupList') : ''
          // this.$refs.groupList.close()
        }
      },
      // 代办工单列表
      refreshToDoList() {
        this.loading = true
        this.$http({
          url: '/act/task/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            ...this.searchForm
          }
        }).then((data) => {
          if (data && data.success) {
            this.tabData.todoList = data.result.records
            this.ipagination.total = data.result.total
            console.log(data.result.records)
            this.loading = false
          }
        })
      },
      // 参与数据列表
      refreshPartList() {
        this.loading = true
        this.$http({
          url: '/wa/flowable/task/partin/',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            ...this.searchForm
          }
        }).then(({ data }) => {
          if (data && data.success) {
            this.tabData.partInList = data.page.list
            this.total = data.page.count
            this.loading = false
          }
        })
      },
      // 所有工单列表
      refreshAllList() {
        this.loading = true
        this.$http({
          url: '/act/task/historyProcessList',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            ...this.searchForm
          }
        }).then((data) => {
          if (data && data.success) {
            this.tabData.allList = data.result.records
            this.ipagination.total = data.result.total
            console.log(data.result.records)
            this.loading = false
          }
        })
      },
      // 加载表单
      start(data) {
        var title = '表单【' + data.desformName + '】发起申请'
        var mode = 'add'
        var desform = data
        var dataId = null
        getAction(this.url.queryByCode, {
          desformCode: data.desformCode
        }).then(res => {
          if (res.success) {
            let designJson = res.result.desformDesignJson
            let json = JSON.parse(designJson)
            // 保存 dialogConfig
            let dialogOptions = json.config.dialogOptions
            if (dialogOptions) {
              this.dialogOptions = dialogOptions
            }
            this.$refs.desformModal.open(mode, desform, dataId, title)
          }

        })
      },
      /** 流程数据保存成功后触发该事件 */
      handleDesformDataAdded(event) {
        // 将流程保存至后台
        let { desform, dataId } = event
        this.loading = true
        httpAction(this.url.add, {
          desformId: desform.id,
          desformCode: desform.desformCode,
          desformDataId: dataId,
          desformName: desform.desformName,
          processName: desform.procName,
          flowCode: this.flowCodePre + desform.desformCode,
          titleExp: desform.titleExp
        }, 'POST').then(res => {
          if (!res.success) {
            this.$message.error(res.message)
            return
          }
          this.startDesFormProcess(desform, event.desformDataJson, res.result)
          // this.$router.push({ path: '/extbpm/process/ExtActDesignFlowDataList'})
        })
      },
      startDesFormProcess(record, desformDataJson, id) {
        var jsonData = desformDataJson
        var param = {
          flowCode: this.flowCodePre + record.desformCode,
          id: id,
          formUrl: '{{DOMAIN_URL}}/desform/detail/' + record.desformCode + '/${BPM_DES_DATA_ID}?token={{TOKEN}}&taskId={{TASKID}}',
          formUrlMobile: '{{DOMAIN_URL}}/desform/detail/' + record.desformCode + '/${BPM_DES_DATA_ID}?token={{TOKEN}}&taskId={{TASKID}}',
          jsonData: jsonData
        }
        postAction(this.url.startProcess, param).then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.loadData()
            this.onClearSelected()
          } else {
            this.$message.warning(res.message)
          }
        }).finally(() => this.loading = false)
      },
      todo(row) {
        // 处理
        this.$http.get('/flowable/task/getTaskDef', {
          params: {
            taskId: row.task.id,
            taskName: row.task.name,
            taskDefKey: row.task.taskDefinitionKey,
            procInsId: row.task.processInstanceId,
            procDefId: row.task.processDefinitionId,
            status: row.status
          }
        }).then(({ data }) => {
          if (data.success) {
            this.$router.push({
              path: '/gy/task/TaskForm',
              query: {
                formTitle: `${row.vars.title}`,
                title: `审批【${row.task.name || ''}】`, ...pick(data.flow, 'formType', 'formReadOnly', 'formUrl', 'procDefKey', 'taskDefKey', 'procInsId', 'procDefId', 'taskId', 'status', 'title', 'businessId')
              }
            })
          }
        })
      },
      trace(row) {
        // 查看进度
        this.processInstanceId = row.processInstanceId || row.task.processInstanceId
        this.visible = true
        this.$nextTick(() => {
          this.$refs.preview.init()
        })
      },
      claim(row) {
        // 签收任务
        this.$http.post('/flowable/task/claim', { taskId: row.task.id }).then(({ data }) => {
          if (data.success) {
            // this.$message.success(data.msg)
            this.todo(row) // 签收后处理
          }
        })
      },
      // 每页数
      sizeChangeHandle(val) {
        this.pageSize = val
        this.pageNo = 1
        this.refreshList()
      },
      // 当前页
      currentChangeHandle(val) {
        this.pageNo = val
        this.refreshList()
      },
      //
      searchReset() {
        this.searchForm = {}
      },
      // 查看
      view(id) {
        this.$refs.testDataMainFormForm.init('view', id)
      },
      // 删除
      del(id) {
        let ids = id || this.dataListSelections.map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http({
            url: '/test/onetomany/testDataMainForm/delete',
            method: 'delete',
            params: { 'ids': ids }
          }).then(({ data }) => {
            if (data && data.success) {
              this.$message.success(data.msg)
              this.refreshList()
            }
            this.loading = false
          })
        })
      },
      // 查看历史
      detail(row) {
        console.log(row)
        this.$http.get('/flowable/task/getTaskDef', {
          params: {
            procInsId: row.processInstanceId || row.proc.processInstanceId,
            procDefId: row.processDefinitionId || row.proc.processDefinitionId
          }
        }).then(({ data }) => {
          if (data.success) {
            this.$router.push({
              path: '/gy/task/TaskFormDetail',
              query: {
                readOnly: true,
                title: row.vars.title,
                formTitle: row.vars.title, ...pick(data.flow, 'formType', 'formUrl', 'procDefKey', 'taskDefKey', 'procInsId', 'procDefId', 'taskId', 'status', 'title', 'businessId')
              }
            })
          }
        })
      },
      details(row) {
        this.$http.get('/flowable/task/getTaskDef', {
          params: {
            procInsId: row.processInstanceId,
            procDefId: row.processDefinitionId
          }
        }).then(({ data }) => {
          if (data.success) {
            this.$router.push({
              path: '/gy/task/TaskFormDetail',
              query: {
                readOnly: true,
                title: row.processVariables.title,
                formTitle: row.processVariables.title, ...pick(data.flow, 'formType', 'formUrl', 'procDefKey', 'taskDefKey', 'procInsId', 'procDefId', 'taskId', 'status', 'title', 'businessId')
              }
            })
          }
        })
      },
      // 导入成功
      uploadSuccess(res, file) {
        if (res.success) {
          this.$message.success({
            dangerouslyUseHTMLString: true,
            message: res.msg
          })
        } else {
          this.$message.error(res.msg)
        }
      },
      // 下载模板
      downloadTpl() {
        this.$utils.download('/test/onetomany/testDataMainForm/import/template')
      },
      exportExcel() {
        this.$utils.download('/test/onetomany/testDataMainForm/export')
      },
      resetSearch() {
        // this.$refs.searchForm.resetFields()
        this.refreshList()
      },

      isAllOrder() {
        const v_token = Vue.ls.get(ACCESS_TOKEN);
        this.$http({
          url: '/sys/order/getAllOrderPermission',
          method: 'get',
          params: { 'token': v_token }
        }).then((data) => {
          if (data && data.success) {
            this.allOrderPermission = data.result
          }
        })
      }

    }
  }
</script>
<style>
  .gd-query-form {
    margin: 10px;
    border: 1px solid #EBEEF5;
    background-color: #FFF;
    padding: 25px 25px 0px;
  }

  #tabs .el-tabs__item {
    font-size: 18px;
  }

  .gy-ticket .short {
    height: 50px;
    flex: 1;
    text-align: center;
    line-height: 50px;
  }

  .ticket-icon {
    transform: scale(0.8);
    width: 90px;
    height: 90px;
    background-color: #1890ff;
    border-radius: 55px;
  }

  .add-icon {
    transform: scale(0.6);
    width: 90px;
    height: 90px;
  }

  @media (max-width: 1600) {
    .gy-ticket .ant-col-xl-4 {
      width: 16.66666667%;
    }
  }

  .gy-ticket .box-card:hover {
    border: 1px solid #e8e8e8;
  }

  .gy-ticket .box-card {
    border: 1px solid rgba(0, 0, 0, 0);
  }

  .gy-ticket .ant-table, .gy-ticket .ant-form label, .ant-tabs-nav-scroll {
    font-size: 16px;
  }

  .gy-ticket .long {
    /* height: 50px;
    flex:1;
    text-align: center;
    padding: 4px; */
    line-height: 22px;
    /* padding: 13px 0px 0px 10px; */
    /* position: absolute;
    top: 40px;
    left: 100px;
    padding-left: 5px; */
    /* height: 50px; */
    display: inline-block;
    text-align: center;
    /* overflow: hidden;
    width: 150px;
    text-overflow: ellipsis;
    white-space: nowrap; */
  }

  .gy-ticket .icon {
    height: 50px;
    color: white;
    width: 50px;
    text-align: center;
    line-height: 50px;
    background: #BBBBBB;
  }

  .gy_numStyle {
    font-size: 28px;
  }

  .icon-style {
    height: 80px;
    float: right;
    width: 80px;
    text-align: center;
    line-height: 80px;
  }

  .icon-style1 {
    /* height: 80px; */
    float: left;
    /* width: 80px; */
    /* text-align: center; */
    /* line-height: 80px; */
    /* background-color: #6183FF; */
  }
</style>