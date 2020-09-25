<template>
  <div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form >
        <a-row>
          <a-col :md="8" :sm="12">
            <a-form-item label="工单类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select v-model="queryParam.processDefinitionName" placeholder="请选择工单类型" >
                <a-select-option v-for="type in typeList" :key="type.procName" @click="codeChange(type.desformCode)">{{ type.procName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="12" v-show="!flag">
            <a-form-item label="创建人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-search placeholder="选择创建人"  @search="handleSelect" v-model="model.userName" >
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

           <a-col :md="6" :sm="8" >
            <span style="float: right;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
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
            <a-form-item
              :label="item.text"
              v-if="item.value === 'repair_from'||item.value === 'patrol_type'"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-cascader :options="optionsType" placeholder="请选择" v-model="item.defaultValue"/>
            </a-form-item>
            <!-- 下拉框 -->
            <a-form-item
              :label="item.text"
              v-else-if="item.type === 'select'"
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
              <a-range-picker :show-time="{format: 'YYYY-MM-DD HH:mm:ss'}" @change="onChange" style="width:100%;" v-model="item.defaultValue"></a-range-picker>
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
        :expandRowByClick = "true"
        :expandIconAsCell="false"
        :expandIconColumnIndex=-1
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
             <a  @click="selectEntruster(record)">
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
          <j-ellipsis :value="text" :length="15" />
        </span>

         <div slot="expandedRowRender"
        class="expansionWrapper"
        >
          <div
          class="expansionWrapper-item"
          :key='item.dataIndex'
          v-for="item in selectedData">
          <div
          v-if="item.value"
          >
          {{item.title}} : {{item.value}}
          </div>
          </div>
        </div>
       
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
   
  },
  data() {
    return {
      expandedKeys:[],
      // innerData:[],
      // innerColumns: [],
      selectedData: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      
      items:[],
      values: [],
      plainOptions: [],
      flag: false,
      dates: [],
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
          title: '创建时间',
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
        codeChange: '/act/task/codeChange',
        detail: '/moreFilter/detail',
      },
      fieldList: [],
      param: [],
      taskId: '',
      optionsType:[]
    }
  },
  created() {
    this.initList()
    let options1 = [{label: '优盘',value: '优盘'} ,{label: '移动硬盘',value: '移动硬盘'},{label: '显示器',value: '显示器'} ,{label: '投影仪',value: '投影仪'} ,{label: '台式机',value: '台式机'} ,{label: '扫描仪',value: '扫描仪'} ,{label: '光盘刻录机',value: '光盘刻录机'} ,{label: '电话机',value: '电话机'} ,{label: '打印机',value: '打印机'} ,{label: '传真机',value: '传真机'} ,{label: '操作系统及通用软件',value: '操作系统及通用软件'}]
    let options2= [ {label: '桌面安全 ',value: '桌面安全'},{label: '网络安全 ',value: '网络安全'},{label: '身份认证 ',value: '身份认证'},{label: '鉴章卡 ',value: '鉴章卡'},{label: '加密机 ',value: '加密机'},{label: '防病毒系统 ',value: '防病毒系统'}]
    let options3= [ {label: '中间件系统 ',value: '中间件系统'},{label: '数据库系统 ',value: '数据库系统'},{label: '操作系统 ',value: '操作系统'},{label: '其他系统软件',value: '其他系统软件'}]
    let options4 = [{label: '综合布线',value: '综合布线'} ,{label: '智能化机房系统',value: '智能化机房系统'},{label: '有线电视',value: '有线电视'} ,{label: '一卡通',value: '一卡通'} ,{label: '网络设备',value: '网络设备'} ,{label: '庭审系统',value: '庭审系统'} ,{label: '视频会议系统',value: '视频会议系统'} ,{label: '叫号系统',value: '叫号系统'} ,{label: '会议系统',value: '会议系统'} ,{label: '公告显示',value: '公告显示'} ,{label: '服务器',value: '服务器'},{label: '存储设备',value: '存储设备'},{label: '程控交换机',value: '程控交换机'},{label: '安保监控',value: '安保监控'},{label: 'BA系统',value: 'BA系统'}]
    let options5= [ {label: '在线技术支持 ',value: '在线技术支持'},{label: '现场运维保障 ',value: '现场运维保障'},{label: '系统运维 ',value: '系统运维'},{label: '推文发布',value: '推文发布'},{label: '视频转换上网',value: '视频转换上网'},{label: '文书撤回',value: '文书撤回'},{label: '系统赋权',value: '系统赋权'},{label: '文件扫描',value: '文件扫描'},{label: '网站信息修改	',value: '网站信息修改'},{label: '网站信息上网',value: '网站信息上网'}]
    let options6= [ {label: '院史馆 ',value: '院史馆'},{label: '院史馆高院诉讼服务大厅',value: '院史馆高院诉讼服务大厅'},{label: '诉讼服务平台移动端',value: '诉讼服务平台移动端'}]
    let opts = [{label: '桌面终端',value: '桌面终端',children:options1} ,{label: '信息安全',value: '信息安全',children:options2},{label: '系统软件',value: '系统软件',children:options3},{label: '基础设备',value: '基础设备',children:options4},{label: '数据服务',value: '数据服务',children:options5},{label: '应用软件',value: '应用软件',children:options6}]
    this.optionsType = opts;
  },
  methods: {
    onExpand(expanded, record){
      if(expanded){
         this.expandedKeys = []
         this.detail(record.processInstanceId)
         this.onExpandedRowsChange(record);
      }else{
        this.expandedKeys = []
      }
    },
    onExpandedRowsChange(rows) {
     
      this.expandedKeys.push(rows.id);
      console.log(this.expandedKeys)
    },
    detail(id){
      console.log("id="+id)
     getAction(this.url.detail,{id:id}).then((res)=>{
        const { data,columns } = res.result
        console.log(data,columns)
        const result = columns.map((item) =>{
          return {
            ...item,
            value: data[0][item.dataIndex]
          }
        })
        const filteredResult = result.filter(item => item.value)
        this.selectedData = [...filteredResult]
        this.innerData = data
        this.innerColumns = columns
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
      //分页、排序、筛选变化时触发
      //TODO 筛选
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
    handleSuperQuery() {
      console.log(param)
    },
   

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
          endDate: this.queryParam.endTime,
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
