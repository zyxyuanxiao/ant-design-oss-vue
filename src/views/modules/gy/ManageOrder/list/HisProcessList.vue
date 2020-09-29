<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper test">
      <a-form>
        <a-row>
          <a-col :md="8" :sm="12">
            <!-- <a-form-item label="工单类型">
              <a-input placeholder="请输入工单类型" v-model="queryParam.processName"></a-input>
            </a-form-item>-->
            <a-form-item label="工单类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select v-model="queryParam.processName" style="width: 100%" placeholder="请选择工单类型">
                <a-select-option
                  v-for="type in typeList"
                  :key="type.procName"
                  @click="codeChange(type.desformCode)"
                >{{ type.procName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="12" v-show="!flag">
            <a-form-item label="工单标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="请输入工单标题" v-model="queryParam.bpmBizTitle"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="12" v-show="flag">
            <a-form-item label="更多查询" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select
                mode="multiple"
                @change="changeSel"
                v-model="values"
                style="width: 100%"
                placeholder="请选择需要查询的字段"
              >
                <a-select-option v-for="type in fieldList" :key="type.text">{{ type.text }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <span
              style="float: right;position:relative;top:4px"
              class="table-page-search-submitButtons"
            >
              <a-button
                type="primary"
                @click="searchQuery"
                icon="search"
                style="margin-left: 4px;"
              >查询</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 4px;"
              >重置</a-button>
              <!-- v-has = "'his:delete'" -->
              <a-button
                v-show="btn"
                v-has="'his:delete'"
                style="margin-left: 4px"
                type="primary"
                @click="deleteAll"
                icon="close-circle"
              >批量删除</a-button>
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
              <a-range-picker :show-time="{format: 'YYYY-MM-DD HH:mm:ss'}" @change="onChange" style="width:100%;"
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
      <!-- :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"  选择框 -->
      <a-table
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange  }"
        :expandedRowKeys="expandedKeys"
        @expand="onExpand"
        :expandRowByClick="true"
        :expandIconAsCell="false"
        :expandIconColumnIndex="-1"
        ref="table"
        bordered
        size="middle"
        rowKey="processInstanceId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
        class="components-table-demo-nested"

      >
        <span slot="action" slot-scope="text, record">
          <template v-if="record.endTime&&record.endTime!=''">
            <!-- <a @click="showHistory(record)">历史</a> -->
            <a-dropdown>
              <a class="ant-dropdown-link">
                更多
                <a-icon type="down"/>
              </a>
              <a-menu slot="overlay">
                <a-menu-item @click="showHistory(record)">历史</a-menu-item>
                <a-menu-item>
                  <a-popconfirm
                    title="确定要删除流程吗?"
                    @confirm="() => delectOne(record.processInstanceId)"
                  >
                    <a v-has="'his:delete'">删除流程</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
          <template v-else>
            <a-dropdown>
              <a class="ant-dropdown-link">
                更多
                <a-icon type="down"/>
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a-popconfirm title="确定要作废流程吗?" @confirm="() => invalidProcess(record)">
                    <a>作废流程</a>
                  </a-popconfirm>
                </a-menu-item>
                <!-- <a-menu-item >
                      <a-popconfirm title="确定要取回流程吗?" @confirm="() => callBackProcess(record)">
                        <a>
                          取回流程
                        </a>
                      </a-popconfirm>
                </a-menu-item>-->
                <a-menu-item @click="showHistory(record)">历史</a-menu-item>
                <a-menu-item>
                  <a-popconfirm
                    title="确定要删除流程吗?"
                    @confirm="() => delectOne(record.processInstanceId)"
                  >
                    <a v-has="'his:delete'">删除流程</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
        </span>

        <!-- 字符串超长截取省略号显示-->
        <span slot="bpmBizTitle" slot-scope="text">
          <j-ellipsis :value="text" :length="10"/>
        </span>

        <!-- <a-table 
          rowKey="id"
          slot="expandedRowRender"
          :columns="innerColumns"
          :data-source="innerData"
          :pagination="false"
        ></a-table>-->
        <div slot="expandedRowRender" class="expansionWrapper">
          <div class="expansionWrapper-item" :key="item.dataIndex" v-for="item in selectedData">
            <div v-if="item.value">{{item.title}} : {{item.value}}</div>
          </div>
        </div>
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
  import { postAction } from '../../../../../api/manage'

  export default {
    name: 'HisProcessList',
    mixins: [JeecgListMixin, BpmNodeInfoMixin],
    components: {
      HisTaskDealModal,
      JEllipsis,
      JDate,
    },
    data() {
      return {

        optionsType: [],
        dateString: [],
        btn: false,
        selectedRowKeys: [],
        expandedKeys: [],
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

        values: [],

        flag: false,
        description: '历史流程',

        queryParam: {},
        dataSource: [],
        typeList: [],

        dates: [],
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
            title: '创建时间',
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
            width: 100,
            scopedSlots: { customRender: 'action' },
            align: 'center',
          },
        ],
        url: {
          list: '/act/task/historyProcessList',
          invalidProcess: '/act/task/invalidProcess',
          callBackProcess: '/act/task/callBackProcess',
          getDynamicData: '/moreFilter/getDynamicData',
          roleDegisnList: '/designform/designFormCommuse/roleDegisnList',
          codeChange: '/act/task/codeChange',
          detail: '/moreFilter/detail',
          delete: '/moreFilter/delete',
          // hide:'/sys/order/getHisDeletePermission'
        },
        path: 'modules/bpm/task/form/FormLoading',
        formData: {},
        fieldList: [],
        items: [],
        paginationOld: { current: 1, pageSize: 10 }
        // hide:false

      }
    },
    created() {
      this.initList()
      let options1 = [{ label: '优盘', value: '优盘' }, { label: '移动硬盘', value: '移动硬盘' }, {
        label: '显示器',
        value: '显示器'
      }, { label: '投影仪', value: '投影仪' }, { label: '台式机', value: '台式机' }, {
        label: '扫描仪',
        value: '扫描仪'
      }, { label: '光盘刻录机', value: '光盘刻录机' }, { label: '电话机', value: '电话机' }, {
        label: '打印机',
        value: '打印机'
      }, { label: '传真机', value: '传真机' }, { label: '操作系统及通用软件', value: '操作系统及通用软件' }, { label: '其他', value: '其他' }]
      let options2 = [{ label: '桌面安全 ', value: '桌面安全' }, { label: '网络安全 ', value: '网络安全' }, {
        label: '身份认证 ',
        value: '身份认证'
      }, { label: '鉴章卡 ', value: '鉴章卡' }, { label: '加密机 ', value: '加密机' }, { label: '防病毒系统 ', value: '防病毒系统' }]
      let options3 = [{ label: '中间件系统 ', value: '中间件系统' }, { label: '数据库系统 ', value: '数据库系统' }, {
        label: '操作系统 ',
        value: '操作系统'
      }, { label: '其他系统软件', value: '其他系统软件' }]
      let options4 = [{ label: '综合布线', value: '综合布线' }, { label: '智能化机房系统', value: '智能化机房系统' }, {
        label: '有线电视',
        value: '有线电视'
      }, { label: '一卡通', value: '一卡通' }, { label: '网络设备', value: '网络设备' }, {
        label: '庭审系统',
        value: '庭审系统'
      }, { label: '视频会议系统', value: '视频会议系统' }, { label: '叫号系统', value: '叫号系统' }, {
        label: '会议系统',
        value: '会议系统'
      }, { label: '公告显示', value: '公告显示' }, { label: '服务器', value: '服务器' }, {
        label: '存储设备',
        value: '存储设备'
      }, { label: '程控交换机', value: '程控交换机' }, { label: '安保监控', value: '安保监控' }, { label: 'BA系统', value: 'BA系统' }]
      let options5 = [{ label: '在线技术支持 ', value: '在线技术支持' }, { label: '现场运维保障 ', value: '现场运维保障' }, {
        label: '系统运维 ',
        value: '系统运维'
      }, { label: '推文发布', value: '推文发布' }, { label: '视频转换上网', value: '视频转换上网' }, {
        label: '文书撤回',
        value: '文书撤回'
      }, { label: '系统赋权', value: '系统赋权' }, { label: '文件扫描', value: '文件扫描' }, {
        label: '网站信息修改	',
        value: '网站信息修改'
      }, { label: '网站信息上网', value: '网站信息上网' }]
      let options6 = [{ label: '院史馆 ', value: '院史馆' }, {
        label: '院史馆高院诉讼服务大厅',
        value: '院史馆高院诉讼服务大厅'
      }, { label: '诉讼服务平台移动端', value: '诉讼服务平台移动端' }, { label: '其他', value: '其他' }]
      let opts = [{ label: '桌面终端', value: '桌面终端', children: options1 }, {
        label: '信息安全',
        value: '信息安全',
        children: options2
      }, { label: '系统软件', value: '系统软件', children: options3 }, {
        label: '基础设备',
        value: '基础设备',
        children: options4
      }, { label: '数据服务', value: '数据服务', children: options5 }, { label: '应用软件', value: '应用软件', children: options6 }]
      this.optionsType = opts;
    },
    methods: {
      // hide(){
      //   getAction(this.url.hide,{}).then((res)=>{
      //     if(res.success){
      //       this.hide = res.result;
      //     }
      //   })
      // },
      // onChange(value, dateString) {
      //   let startTime = dateString[0]
      //   let endTime = dateString[1]
      //   value = [startTime,endTime]
      // },
      delectOne(id) {
        let ids = [id]
        postAction(this.url.delete, ids).then((res) => {
          if (res.success) {
            this.$message.success('删除成功')
            this.searchQuery()
          } else {
            this.$message.error('删除失败')
          }
        })
      },
      deleteAll() {
        let ids = this.selectedRowKeys
        let url = this.url.delete
        var that = this
        this.$confirm({
          title: '确认要删除这些流程吗?',
          onOk() {
            console.log(ids)
            postAction(url, ids).then((res) => {
              if (res.success) {
                that.$message.success('已成功删除' + res.result + '条流程')
                that.searchQuery()
                that.btn = false
              } else {
                that.$message.error('系统异常')
              }
            })

            // that.$message.success('已成功删除'+count+'条流程')
          },
          onCancel() {
          },
        })
      },
      onSelectChange(selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys)

        this.selectedRowKeys = selectedRowKeys
        if (selectedRowKeys.length > 0) {
          this.btn = true
        } else {
          this.btn = false
        }

        console.log(this.selectedRowKeys)
      },
      onExpand(expanded, record) {
        if (expanded) {
          this.expandedKeys = []
          this.detail(record.processInstanceId)
          this.onExpandedRowsChange(record)
        } else {
          this.expandedKeys = []
        }
      },
      onExpandedRowsChange(rows) {
        this.expandedKeys.push(rows.processInstanceId)
      },
      detail(id) {
        console.log('请求发送了')
        console.log('id=' + id)
        getAction(this.url.detail, { id: id }).then((res) => {
          const { data, columns } = res.result
          console.log(data, columns)
          const result = columns.map((item) => {
            return {
              ...item,
              value: data[0][item.dataIndex],
            }
          })
          const filteredResult = result.filter((item) => item.value)
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
        this.ipagination = pagination
        this.queryParam.pageNo = pagination.current
        this.queryParam.pageSize = pagination.pageSize

        this.searchQuery()

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
        this.fieldList = []
        this.expandedKeys = []
        this.selectedRowKeys = []
        this.btn = false
      },

      searchQuery() {
        this.loading = true
        if (this.paginationOld.current == this.ipagination.current && this.paginationOld.pageSize == this.ipagination.pageSize) {
          this.ipagination.current = 1
          this.queryParam.pageNo = 1
        }
        console.log(this.loading)
        let code = this.queryParam.code
        let param = {}
        if (code != null) {

          for (let i = 0; i < this.items.length; i++) {
            let name = this.items[i].value
            let value = this.items[i].defaultValue
            param[name] = value
          }

          console.log(param)
          postAction(this.url.getDynamicData, param, {
            tableName: this.queryParam.code,
            tag: 'all',
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
        this.paginationOld = this.ipagination
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
            console.log('--->>', this.fieldList)
          }
        })

        this.dates = []
        this.values = []
        this.items = []
      },
      close() {
        this.queryParam = {}
        this.flag = false
        this.dates = []
        this.items = []
        this.values = []
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

      // 流程作废
      invalidProcess(record) {
        var that = this
        var params = {
          processInstanceId: record.processInstanceId,
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
      callBackProcess(record) {
        var that = this
        var params = {
          processInstanceId: record.processInstanceId,
        } //查询条件
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
      showHistory(record) {
        this.getHisProcessNodeInfo(record)
      },
      // 加载下拉
      initList() {
        httpAction(this.url.roleDegisnList, {}, 'GET').then((data) => {
          console.log(data)
          this.typeList = data.result
        })
      },
    },
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