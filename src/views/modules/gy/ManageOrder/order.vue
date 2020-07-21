<template>
  <a-card class="gy-ticket">
    <a-row style="padding: 0px 10px 0px 10px;margin:10px" class="bg-white">
      <a-col :span="24">
        <a-row :gutter="10">
          <a-col :xs="12" :sm="10" :md="8" :lg="6" :xl="4" v-for="data in dataListTj" :key="data.id">
            <a-card class="box-card" :body-style="{ padding: '0px'}" style="margin-bottom:15px;background-color:#f2f2f7; box-shadow: none;width:91%">
              <div class="actCard" style="display:flex;">
                <div class='long'>
                  <span :title="data.name" style="font-size:18px;">{{data.name}}</span>
                </div>
                <div style="height: 50px;width:60px;text-align: center;line-height:50px;rgba(106, 146, 103, 0.1);">
                  <span class="gy_numStyle" style="">{{data.sum}}</span>
                </div>
                <div class="icon">
                  <a-icon type="plus-circle" style="transform: scale(1.8)" @click="start(data)" />
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </a-col>
    </a-row>

    <a-col :span="24">
      <a-tabs id="tabs" :default-active-key="tabName" v-model="tabName" @tabClick="handleClick">
        <a-tab-pane tab="我的待办" key="todo">
          <a-tabs defaultActiveKey="1" tabPosition="left" @tabClick="handleClickT">
            <!-- 我的任务 -->
            <a-tab-pane key="1">
              <span slot="tab">
                <a-icon type="user"/>
                <span>我的任务</span>
              </span>
              <my-running-task-list ref="todoList"></my-running-task-list>

            </a-tab-pane>
            <!-- 组任务 -->
            <a-tab-pane key="2" forceRender>
              <span slot="tab">
                <a-icon type="team"/>
                <span>组任务</span>
              </span>
              <my-group-task-list ref="groupList"></my-group-task-list>
            </a-tab-pane>
          </a-tabs>
        </a-tab-pane>
        <a-tab-pane tab="我参与的" key="partin">
          <part-his-process-list ref="partinList"></part-his-process-list>
        </a-tab-pane>
        <a-tab-pane tab="全部工单" key="all">
          <his-process-list ref="AllList"></his-process-list>
        </a-tab-pane>
      </a-tabs>

    </a-col>

    <auto-desform-data-modal ref="desformModal" :dialogOptions="dialogOptions"  @added="handleDesformDataAdded"></auto-desform-data-modal>
  </a-card>
</template>

<script>
  import AutoDesformDataModal from "../process/AutoDesformDataModal.vue"
  import { httpAction, postAction, getAction } from '@/api/manage'
  import JEllipsis from '@/components/jeecg/JEllipsis'
  import MyRunningTaskList from './list/MyRunningTaskList'
  import MyGroupTaskList from './list/MyGroupTaskList'
  import HisProcessList from './list/HisProcessList'
  import PartHisProcessList from './list/PartHisProcessList'
  export default {
    data () {
      return {
        vars: [
          {
            'key': 'userName',
            'value': ''
          }
        ],
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
        // 表头
        columnsA: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '流程名称',
            align: "center",
            dataIndex: 'prcocessDefinitionName',
          },
          {
            title: '工单标题',
            dataIndex: 'bpmBizTitle',
            scopedSlots: { customRender: 'bpmBizTitle' }
          },
          {
            title: '流程ID',
            align: "center",
            dataIndex: 'processDefinitionId',
          },
          {
            title: '流程实例',
            align: "center",
            dataIndex: 'processInstanceId',
          },
          {
            title: '发起人',
            align: "center",
            dataIndex: 'startUserName',
          },
          {
            title: '当前任务',
            align: "center",
            dataIndex: 'name',
          },
          {
            title: '办理人',
            align: "center",
            dataIndex: 'assigneeName',
          },
          {
            title: '开始时间',
            align: "center",
            dataIndex: 'startTime',
          },
          {
            title: '状态',
            align: "center",
            dataIndex: 'isSuspended',
            customRender: function (t, r, index) {
              if(t==='true'){
                return '已暂停';
              }else{
                return '已启动';
              }
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
            width: 120,
            fixed: 'right',
          }
        ],
        // 表头
        columnsT: [
          {
            title: '#',
            width: 60,
            dataIndex: '',
            key: 'rowIndex',
            align: 'center',
            customRender: function(t, r, index) {
              return parseInt(index) + 1
            }
          }, {
            title: '业务标题',
            align: 'center',
            dataIndex: 'bpmBizTitle',
            scopedSlots: { customRender: 'bpmBizTitle' }
          },{
            title: '流程编号',
            align: 'center',
            dataIndex: 'processDefinitionId'
          }, {
            title: '任务ID',
            align: 'center',
            dataIndex: 'taskId'
          }, {
            title: '流程名称',
            align: 'center',
            dataIndex: 'processDefinitionName'
          }, {
            title: '流程实例',
            align: 'center',
            dataIndex: 'processInstanceId'
          }, {
            title: '发起人',
            align: 'center',
            dataIndex: 'processApplyUserName'
          }, {
            title: '开始时间',
            align: 'center',
            dataIndex: 'taskBeginTime'
          }, {
            title: '当前环节',
            align: 'center',
            dataIndex: 'taskName'
          },{
            title: '操作',
            align: 'center',
            dataIndex: 'action',
            fixed: 'right',
            width:150,
            scopedSlots: {customRender: 'action'}
          }
        ],
        flowCodePre:"desform_",
        dialogOptions: { top: 60, width: 1000, padding: { top: 25, right: 25, bottom: 30, left: 25 } },
        url: {
          list: "/act/process/lists",
          start: "/act/process/starttest",
          roleDegisnList: "/designform/designFormCommuse/roleDegisnList",
          queryByCode: '/desform/queryByCode',
          add: '/process/extActDesignFlowData/add',
          startProcess: "/process/extActProcess/startDesFormMutilProcess"
        }
      }
    },
    components: {
      AutoDesformDataModal,
      JEllipsis,
      MyRunningTaskList,
      MyGroupTaskList,
      HisProcessList,
      PartHisProcessList
    },
    created () {
      this.refreshTypeSumList()
    },
    watch: {
      searchDates () {
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
      random (lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower
      },
      addById () {
        this.$router.push({ path: '../order/create' })
        // this.$refs.leaveFormForm.init('add', '')
      },
      // 获取工单类型列method表
      refreshType () {
        this.loading = true
        this.$http({
          url: '/flowable/process/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            ...this.searchForm
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.dataList2 = data.page.list
            // this.total = data.page.count
            this.loading = false
          }
        })
      },
      resetForm () {
        // this.$refs.searchForm.resetFields()
        this.searchForm.procDefKey = ''
      },
      // 获取数据列表
      refreshList () {
        if (this.tabName === 'todo') {
          this.refreshToDoList()
        } else if (this.tabName === 'partin') {
          this.refreshPartList()
        } else {
          this.refreshAllList()
        }
      },
      // 顶部根据工单类型统计工单数据
      refreshTypeSumList () {
        this.$http.get('/gy/count/countbytype').then((data) => {
          if (data && data.success) {
            console.log(data)
            this.dataListTj = data.result
          }
        })
      },
      // 切换主tabs
      handleClick (tab, event) {
        if(tab === 'partin'){
          this.$refs.partinList ? this.$refs.partinList.init('/act/task/partProcessList') : ''
        } else if(tab === 'todo') {
          this.$refs.todoList ? this.$refs.todoList.init('/act/task/list') : ''
        } else if(tab === 'all') {
          this.$refs.AllList ? this.$refs.AllList.init('/act/task/historyProcessList') : ''
        }
      },
      handleClickT (tab, event) {
        if(tab === '1'){
          this.$refs.todoList ? this.$refs.todoList.init('/act/task/list') : ''
        } else if(tab === '2') {
          this.$refs.groupList ? this.$refs.groupList.init('/act/task/taskGroupList') : ''
        }
      },
      // 代办工单列表
      refreshToDoList () {
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
      refreshPartList () {
        this.loading = true
        this.$http({
          url: '/wa/flowable/task/partin/',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            ...this.searchForm
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.tabData.partInList = data.page.list
            this.total = data.page.count
            this.loading = false
          }
        })
      },
      // 所有工单列表
      refreshAllList () {
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
      start (data) {
        var title = "表单【"+data.desformName+"】发起申请"
        var mode = 'add'
        var desform = data
        var dataId = null
        getAction(this.url.queryByCode, {
          desformCode: data.desformCode
        }).then(res => {
          if (res.success) {
            let designJson = res.result.desformDesignJson;
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
        let { desform, dataId } = event;
        this.loading = true;
        httpAction(this.url.add, {
          desformId: desform.id,
          desformCode: desform.desformCode,
          desformDataId: dataId,
          desformName: desform.desformName,
          processName: desform.procName,
          flowCode: this.flowCodePre+desform.desformCode,
          titleExp: desform.titleExp
        }, 'POST').then(res => {
          if (!res.success) {
            this.$message.error(res.message);
            return;
          }
          this.startDesFormProcess(desform, event.desformDataJson, res.result)
          // this.$router.push({ path: '/extbpm/process/ExtActDesignFlowDataList'})
        })
      },
      startDesFormProcess (record, desformDataJson, id){ 
        var jsonData = desformDataJson;
        var param = {
          flowCode:this.flowCodePre+record.desformCode,
          id: id,
          formUrl:"{{DOMAIN_URL}}/desform/detail/"+record.desformCode+"/${BPM_DES_DATA_ID}?token={{TOKEN}}&taskId={{TASKID}}",
          formUrlMobile:"{{DOMAIN_URL}}/desform/detail/"+record.desformCode+"/${BPM_DES_DATA_ID}?token={{TOKEN}}&taskId={{TASKID}}",
          jsonData:jsonData,
        }
        postAction(this.url.startProcess,param).then((res)=>{
          if(res.success){
            this.$message.success(res.message);
            this.loadData();
            this.onClearSelected();
          }else{
            this.$message.warning(res.message);
          }
        }).finally(() => this.loading = false)
      },
      todo (row) {
        // 处理
        this.$http.get('/flowable/task/getTaskDef', {params: {
          taskId: row.task.id,
          taskName: row.task.name,
          taskDefKey: row.task.taskDefinitionKey,
          procInsId: row.task.processInstanceId,
          procDefId: row.task.processDefinitionId,
          status: row.status
        }}).then(({data}) => {
          if (data.success) {
            this.$router.push({
              path: '/gy/task/TaskForm',
              query: {formTitle: `${row.vars.title}`, title: `审批【${row.task.name || ''}】`, ...pick(data.flow, 'formType', 'formReadOnly', 'formUrl', 'procDefKey', 'taskDefKey', 'procInsId', 'procDefId', 'taskId', 'status', 'title', 'businessId')}
            })
          }
        })
      },
      trace (row) {
        // 查看进度
        this.processInstanceId = row.processInstanceId || row.task.processInstanceId
        this.visible = true
        this.$nextTick(() => {
          this.$refs.preview.init()
        })
      },
      claim (row) {
        // 签收任务
        this.$http.post('/flowable/task/claim', {taskId: row.task.id}).then(({data}) => {
          if (data.success) {
            // this.$message.success(data.msg)
            this.todo(row) // 签收后处理
          }
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageNo = 1
        this.refreshList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageNo = val
        this.refreshList()
      },
      // 
      searchReset () {
        this.searchForm = {}
      },
      // 查看
      view (id) {
        this.$refs.testDataMainFormForm.init('view', id)
      },
      // 删除
      del (id) {
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
            params: {'ids': ids}
          }).then(({data}) => {
            if (data && data.success) {
              this.$message.success(data.msg)
              this.refreshList()
            }
            this.loading = false
          })
        })
      },
     // 查看历史
      detail (row) {
        console.log(row)
        this.$http.get('/flowable/task/getTaskDef', {params: {
          procInsId: row.processInstanceId || row.proc.processInstanceId,
          procDefId: row.processDefinitionId || row.proc.processDefinitionId
        }}).then(({data}) => {
          if (data.success) {
            this.$router.push({
              path: '/gy/task/TaskFormDetail',
              query: {readOnly: true, title: row.vars.title, formTitle: row.vars.title, ...pick(data.flow, 'formType', 'formUrl', 'procDefKey', 'taskDefKey', 'procInsId', 'procDefId', 'taskId', 'status', 'title', 'businessId')}
            })
          }
        })
      },
      details (row) {
        this.$http.get('/flowable/task/getTaskDef', {params: {
          procInsId: row.processInstanceId,
          procDefId: row.processDefinitionId
        }}).then(({data}) => {
          if (data.success) {
            this.$router.push({
              path: '/gy/task/TaskFormDetail',
              query: {readOnly: true, title: row.processVariables.title, formTitle: row.processVariables.title, ...pick(data.flow, 'formType', 'formUrl', 'procDefKey', 'taskDefKey', 'procInsId', 'procDefId', 'taskId', 'status', 'title', 'businessId')}
            })
          }
        })
      },
      // 导入成功
      uploadSuccess (res, file) {
        if (res.success) {
          this.$message.success({dangerouslyUseHTMLString: true,
            message: res.msg})
        } else {
          this.$message.error(res.msg)
        }
      },
      // 下载模板
      downloadTpl () {
        this.$utils.download('/test/onetomany/testDataMainForm/import/template')
      },
      exportExcel () {
        this.$utils.download('/test/onetomany/testDataMainForm/export')
      },
      resetSearch () {
        // this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>
<style>
  .gd-query-form {
    margin:10px;
    border: 1px solid #EBEEF5;
    background-color: #FFF;
    padding: 25px 25px 0px;
  }
  #tabs .el-tabs__item {
    font-size: 18px;
  }
  .gy-ticket .short {
    height: 50px;
    flex:1;
    text-align: center;
    line-height:50px;
  }
  .gy-ticket .long {
    /* height: 50px;
    flex:1;
    text-align: center;
    padding: 4px; */
    padding: 13px 0px 0px 10px;
    height: 50px;
    display: inline-block;
    text-align: center;
    overflow: hidden;
    width: 150px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .gy-ticket .icon {
    height: 50px;
    color:white;
    width: 50px;
    text-align: center;
    line-height:50px;
    background: #BBBBBB;
  }
  .gy_numStyle {
    font-size:20px;
    -webkit-text-fill-color: rgba(1, 9, 16, 0.96);
    -webkit-text-stroke: 0px rgba(16, 16, 16, 0.93);
  }
  /* :style="'height: 45px;flex:1;text-align: center;line-height:45px;rgba(106, 146, 103, 0.1);'+data.name.length > 6 '1':'1' +';'" */
  /* .gy-ticket .el-form{
    background-color:#F2F2F2;
  } */
  /* .gy-ticket .actCard {
    display: flex;
  } */
</style>