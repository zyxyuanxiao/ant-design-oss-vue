<template>
  <div class="tickets-list">
    <a-card :bordered="false">
      <div class="topbar">
        <div class="topbar-item item1">
          <header class="header">
            今日工单数:
            <strong>{{workCount.toDay.count ? workCount.toDay.count : 0}}</strong>
          </header>
          <div class="content">
            <div class="info-left">
              监控类:
              <strong>{{workCount.toDay.monitor ? workCount.toDay.monitor : 0}}</strong>
            </div>
            <div class="info-right">其他:{{workCount.toDay.other ? workCount.toDay.other : 0}}</div>
          </div>
        </div>
        <div class="topbar-item item2">
          <header class="header">
            未完成工单数:
            <strong>{{workCount.undone.count ? workCount.undone.count : 0}}</strong>
          </header>
          <div class="content">
            <div class="info-left">
              监控类:
              <strong>{{workCount.undone.monitor ? workCount.undone.monitor : 0}}</strong>
            </div>
            <div class="info-right">其他:{{workCount.undone.other ? workCount.undone.other : 0}}</div>
          </div>
        </div>
        <div class="topbar-item item3">
          <header class="header">
            逾期工单数:
            <strong>{{workCount.overdue.count ? workCount.overdue.count : 0}}</strong>
          </header>
          <div class="content">
            <div class="info-left">
              监控类:
              <strong>{{workCount.overdue.monitor ? workCount.overdue.monitor : 0}}</strong>
            </div>
            <div class="info-right">其他:{{workCount.overdue.other ? workCount.overdue.other : 0}}</div>
          </div>
        </div>
      </div>
    </a-card>
    <a-card :bordered="false" style="margin-top: 8px;">
      <!-- 查询区域 -->
      <!-- <div style="margin-bottom: 20px">
         <div style="display: flex;width: 100%;margin-bottom: 15px;margin-right: 20px;">
           <div class="gd-status-sjzy">
             <div style="text-align:right;border-bottom: 1px solid white">
               <span class="gd-status-text">监控类：<span style="font-size: 20px;">11110</span></span>
               <span class="gd-status-text">其他类：<span style="font-size: 20px;">122222</span></span>
             </div>
             <a-row>
               <a-col :span="12">
                 <a-row>
                   <a-col :span="24">
                     <div class="gd-status-total">今日工单数</div>
                     <div class="gd-status-total-num">1000</div>
                   </a-col>
                 </a-row>
               </a-col>
               <a-col :span="12" style="text-align: right">
                 <a-icon type="fund" style="font-size: 62px;color: white;padding-right: 30px;padding-top: 15px;"/>
               </a-col>
             </a-row>
           </div>
           <div class="gd-status-ztsy">
             <div class="gd-status-total">当前未完成工单数： <span style="font-size: 28px;">10</span></div>
             <div style="display: flex;">
               <div style="background-color: white;color: #f78463;width: 50%">监控类：<span style="font-size: 28px;">8</span></div>
               <div class="gd-status-text">其他类：<span style="font-size: 28px;">2</span></div>
             </div>
           </div>
           <div class="gd-status-yxj">
             <div class="gd-status-total">逾期工单数： <span style="font-size: 28px;">10</span></div>
             <div style="display: flex;">
               <div class="gd-status-text">监控类：<span style="font-size: 28px;">10</span></div>
               <div class="gd-status-text">其他类：<span style="font-size: 28px;">0</span></div>
             </div>
           </div>
         </div>
       </div>-->

      <!-- 操作按钮区域 -->
      <div class="btn-query">
        <div style="float: left;">
          <a-button @click="handleAddBpm" type="primary" icon="plus">发起流程</a-button>
        </div>
        <div style="float: right">
          <a-input-search @search="searchQuery" v-model="formData.flowNo" style="width: 220px;"
                          placeholder="请输入流水号"></a-input-search>
          <a-button-group style="margin-left: 10px;">
            <a-button @click="handleToggleSearch" :icon="toggleSearchStatus ? 'down' : 'up'">更多</a-button>
            <a-button @click="handleAddBpm" icon="to-top">导入</a-button>
            <a-button @click="handleAddBpm" icon="vertical-align-bottom">导出</a-button>
          </a-button-group>
        </div>
      </div>
      <div class="form-query" v-show="toggleSearchStatus">
        <a-form-model ref="ruleForm" :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row :gutter="24" style="margin-bottom: 0">    
            <!--  <a-col :xl="6" :lg="8" :md="8" :sm="24">
                <a-form-model-item label="工单标题" prop="title">            
                  <a-input placeholder="请输入工单标题" v-model="formData.title"></a-input>
                </a-form-model-item>
              </a-col>-->
            <!-- <a-col :xl="6" :lg="8" :md="8" :sm="24">
               <a-form-model-item label="流水号" prop="flowNo">            
                 <a-input placeholder="请输入流水号" v-model="formData.flowNo"></a-input>
               </a-form-model-item>
             </a-col>-->
            <!-- <a-col :xl="6" :lg="8" :md="8" :sm="24">
               <a-form-model-item label="报修人" prop="repairman">            
                 <a-input placeholder="请输入报修人" v-model="formData.repairman"></a-input>
               </a-form-model-item>
             </a-col>-->
            <a-col :xl="6" :lg="8" :md="8" :sm="24">
              <a-form-model-item label="报修时间" prop="createTime">
                <a-range-picker
                  style="width: 100%;"
                  :ranges="{ '今天' : [moment(), moment()], '这个月': [moment(), moment().endOf('month')] }"
                  show-time
                  v-model="formData.createTime"
                  format="YYYY-MM-DD HH:mm:ss"
                  @change="onChangeDate"
                />
                <!--  <j-date style="width: 100%" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择开始时间"
                          v-model="formData.bxsj"></j-date>-->
              </a-form-model-item>
            </a-col>
            <a-col :xl="6" :lg="8" :md="8" :sm="24">
              <a-form-model-item label="地点" prop="dd">
                <a-input placeholder="请输入地点" v-model="formData.dd"></a-input>
              </a-form-model-item>
            </a-col>
            <!-- <a-col :xl="6" :lg="8" :md="8" :sm="24">
               <a-form-model-item label="工单模板" prop="modelId">            
                 <a-select mode="tags" v-model="formData.modelId" style="width: 100%" placeholder="请选择工单模板">
                   <a-select-option v-for="item in workTypeList" :key="item.id">
                     {{item.name}}
                   </a-select-option>
                 </a-select>
               </a-form-model-item>
             </a-col>-->
            <a-col :xl="6" :lg="8" :md="8" :sm="24">
              <a-form-model-item label="工单状态" prop="hiddenOrderSate">           
                <a-select
                  showSearch
                  mode="multiple"
                  :options="orderSateList"
                  :filterOption="filterOption"
                  v-model="formData.hiddenOrderSate"
                  placeholder="请选择工单状态"
                  allowClear
                />
              </a-form-model-item>
            </a-col>
            <a-col :xl="6" :lg="8" :md="8" :sm="24">
              <a-form-model-item label="设备编码" prop="deviceid">
                <a-input placeholder="请输入设备编码" v-model="formData.deviceid"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :xl="6" :lg="8" :md="8" :sm="24">
              <a-form-model-item label="设备IP" prop="IP">
                <a-input placeholder="请输入设备IP" v-model="formData.IP"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :xl="6" :lg="8" :md="8" :sm="24">
              <a-form-model-item label="报修类型" prop="bxlx">
                <a-select
                  showSearch
                  mode="multiple"
                  :options="repairsTypeList"
                  :filterOption="filterOption"
                  v-model="formData.bxlx"
                  placeholder="请选择报修类型"
                  allowClear
                />
              </a-form-model-item>
            </a-col>
            <a-col :xl="6" :lg="8" :md="8" :sm="24">
              <a-form-model-item label="工单等级" prop="gddj">
                <a-select
                  showSearch
                  mode="multiple"
                  :options="ticketsLevel"
                  :filterOption="filterOption"
                  v-model="formData.gddj"
                  placeholder="请选择工单等级"
                  allowClear
                />
              </a-form-model-item>
            </a-col>
            <a-col :xl="6" :lg="8" :md="8" :sm="24">
              <a-form-model-item label="工单类型" prop="gdlx">
                <a-select
                  showSearch
                  mode="multiple"
                  :options="orderTypeList"
                  :filterOption="filterOption"
                  v-model="formData.gdlx"
                  placeholder="请选择工单类型"
                  allowClear
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
        <div
          style="width: 100%;position: relative;display: inline-block;cursor: pointer;padding: 0 10px;color: #464c55;">
          <div style="float: right">
            <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
            <a-button icon="reload" @click="searchReset" style="margin-left: 8px;">重置</a-button>
          </div>
        </div>
      </div>
      <!-- table区域-begin -->
      <div>
        <a-spin :spinning="spinningShow">
          <a-tabs v-model="activeKey" @change="onChangeTabs">
            <a-tab-pane key="1">
              <span slot="tab">
                <a-icon type="solution" style="font-size: 16px;"/>
                我的待办
              </span>
            </a-tab-pane>
            <a-tab-pane key="2">
              <span slot="tab">
                <a-icon type="file-done" style="font-size: 16px;"/>
                全部工单
              </span>
            </a-tab-pane>
          </a-tabs>
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="flowNo"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="false"
          >
            <span slot="status" slot-scope="status">
              <a-tag v-if="item.value === status +''" :color="item.color"
                     v-for="item in orderSateList"> {{item.label}}</a-tag>
            </span>
            <template slot="type" slot-scope="type">
              <span v-if="item.value === type +''" :color="item.color"
                    v-for="item in orderTypeList"> {{item.label}}
              </span>
            </template>
            <span slot="executors" slot-scope="executors, record">
              <j-ellipsis :value="getExecutors(executors)" :length="15"/>
            </span>
            <span slot="executionGroups" slot-scope="executionGroups, record">
              <j-ellipsis :value="getExecutionGroups(executionGroups)" :length="15"/>
            </span>
            <span slot="create_time" slot-scope="create_time">
              {{getLongTime(create_time, true)}}
            </span>
            <span slot="action" slot-scope="text, record">
              <a-button @click="handleDetail(record)">查看详情</a-button>
              <!-- <a-dropdown>
                 <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
                 <a-menu slot="overlay">
                   <template v-if="record.bpmStatus === '1'">
                     <a-menu-item>
                       <a @click="handleEdit(record)">编辑</a>
                     </a-menu-item>
                   </template>
                   <a-menu-item>
                     <a href="javascript:;" @click="handleDetail(record)">详情</a>
                   </a-menu-item>
                   <a-menu-item v-if="record.bpmStatus === '1'">
                     <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                       <a>删除</a>
                     </a-popconfirm>
                   </a-menu-item>
                   <a-menu-item v-else @click="handleTrack(record)">审批进度</a-menu-item>
                 </a-menu>
               </a-dropdown>-->
            </span>
            <!--<span slot="modelName" slot-scope="text, record">
              <j-ellipsis :value="'工单【'+text+'】'" :length="15"/>
            </span>-->
            <!-- 字符串超长截取省略号显示-->
          </a-table>
          <a-pagination
            style="text-align: right;margin-top: 15px;"
            :total="total"
            show-size-changer
            :show-total="(total, range) => `${range[0]}-${range[1]} 共 ${total} 条`"
            :page-size="data.pageSize"
            :default-current="1"
            @change="onChange"
            @showSizeChange="onShowSizeChange"
          />
        </a-spin>
      </div>
      <!-- table区域-end -->
      <!--模型选择区域-->
      <a-modal
        :title="ModalText"
        :width="1000"
        :visible="visibleModel"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
        :footer="null"
        style="min-height: 500px;"
      >
        <div>
          <tickets-model-type :items="workTypeList" @click="getModelDetails"></tickets-model-type>
        </div>
      </a-modal>

      <!-- 表单区域 -->
      <a-modal
        :title="ModalText"
        :width="widthModel"
        :centered="true"
        :visible="visible"
        :confirm-loading="confirmLoading"
        @cancel="handleCancel"
        :footer="null"
      >
        <tickets-from-flow
          :form-files="formFileds"
          :form-val="formVal"
          :form-index="formIndex"
          :is-permission="isPermission"
          :submit-btn="submitBtn"
          :allot-show="allotShow"
          :operation="operation"
          :spinnings="spinning"
          :flow-list="flowList"
          v-if="operation === 'details'"
          @updateFeedback="updateOrder"
          @uploadFile="uploadFile"
          @signTickets="signTickets"
          @click="onSubmit">
        </tickets-from-flow>
        <tickets-form
          :form-files="formFileds"
          :form-val="formVal"
          :form-index="formIndex"
          :submit-btn="submitBtn"
          :allot-show="allotShow"
          :spinnings="spinning"
          :operation="operation"
          @updateFeedback="updateOrder"
          @uploadFile="uploadFile"
          @click="onSubmit"
          v-if="operation === 'add'"
        >
        </tickets-form>
      </a-modal>
      <a-modal
        title="请选择下一节点处理人"
        :width="600"
        :centered="true"
        :visible="showRollback"
        @cancel="handleCancelShow"
        @ok="handleShow"
      >
        <a-spin :spinning="spinningShow">
          <a-form-model :labelCol="labelCol2" :wrapperCol="wrapperCol2">
            <a-form-model-item label="处理人" v-if="userList.length>0">
              <a-select
                showSearch
                mode="multiple"
                :options="userList"
                :filterOption="filterOption"
                v-model="userIdList"
                ref="userIdList"
                placeholder="请选择处理人"
                allowClear
                @change="selectChangeUser"
              />
            </a-form-model-item>
            <a-form-model-item label="用户组" v-if="userGroup.length>0">
              <a-select
                showSearch
                mode="multiple"
                :options="userGroup"
                :filterOption="filterOption"
                v-model="groupIdList"
                ref="groupIdList"
                placeholder="请选择用户组"
                allowClear
                @change="selectChangeGroup"
              />
            </a-form-model-item>
          </a-form-model>
        </a-spin>
      </a-modal>
    </a-card>
  </div>
</template>

<script>
import {
  getTicketsList, getTicketsDetails, getModelList,
  getModelDetails, saveWorkOrder, handleOrder, updateTickets,
  uploadFileByTicketId, getTicketTodoCountByUser, getTicketsProcess,
  getMytodoList, getUserGroup, getTicketAllCountByUser, updateFeedback
} from '../../api/tickets'
import JEllipsis from '@/components/jeecg/JEllipsis'
import JDate from '@/components/jeecg/JDate.vue'
import TicketsFromFlow from '../../components/from-el/Tickets-From-Flow'
import TicketsForm from '../../components/from-el/Tickets-Form'
import TicketsModelType from './modules/TicketsModelType'
import { getSelectTime } from '../../utils/util'
import { mapGetters } from 'vuex'
import moment from 'moment/moment'

export default {
  name: 'TicketsListView',
  components: {
    TicketsModelType,
    TicketsForm,
    TicketsFromFlow,
    JEllipsis,
    JDate
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
        xl: { span: 6 },
        lg: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
        xl: { span: 18 },
        lg: { span: 17 }
      },
      labelCol2: {
        xs: { span: 24 },
        sm: { span: 3 },
        xl: { span: 3 },
        lg: { span: 7 }
      },
      wrapperCol2: {
        xs: { span: 24 },
        sm: { span: 20 },
        xl: { span: 20 },
        lg: { span: 15 }
      },
      rolesList: [],
      widthModel: '85%',
      workTypeList: [],
      ModalText: '创建工单',
      visible: false,
      /**
       * 显示选择模型
       */
      visibleModel: false,
      confirmLoading: false,
      loading: false,
      toggleSearchStatus: false,
      // 表头
      columns: [
        /* {
           title: '#',
           dataIndex: '',
           key: 'rowIndex',
           width: 60,
           align: 'center',
           customRender: function(t, r, index) {
             return parseInt(index) + 1
           }
         },*/
        {
          title: '状态',
          align: 'center',
          width: 110,
          dataIndex: 'formData.orderSate',
          scopedSlots: { customRender: 'status' }
        },
        /* {
          title: '工单标题',
          align: 'center',
          width: 230,
          dataIndex: 'title'
        },*/
        {
          title: '流水号',
          align: 'center',
          width: 180,
          dataIndex: 'flowNo'
        },
        /*{
          title: '流程名称',
          align: 'center',
          width: 220,
          dataIndex: 'model_name',
          scopedSlots: { customRender: 'modelName' }
        },*/
        {
          title: '工单类型',
          align: 'center',
          width: 180,
          dataIndex: 'formData.gdfl',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '地点',
          align: 'center',
          width: 250,
          dataIndex: 'formData.dd'
        },
        /* {
           title: '设备编码',
           align: 'center',
           width: 220,
           dataIndex: 'formData.deviceid'
         },*/
        {
          title: '设备IP',
          align: 'center',
          width: 220,
          dataIndex: 'formData.IP'
        },
        {
          title: '内容',
          align: 'center',
          width: 220,
          dataIndex: 'formData.nr'
        },
        /* {
           title: '流程环节',
           align: 'center',
           width: 180,
           dataIndex: 'activityName'
         },*/
        /* {
           title: '当前流程环节',
           align: 'center',
           width: 150,
           dataIndex: 'formData.repairman'
         },
         {
           title: '报修人联系方式',
           align: 'center',
           width: 150,
           dataIndex: 'formData.telephone'
         },*/
        /*  {
            title: '签收人',
            align: 'center',
            width: 150,
            dataIndex: 'formData.qsr'
          },*/
        {
          title: '处理人',
          align: 'center',
          width: 200,
          dataIndex: 'executorCN',
          scopedSlots: { customRender: 'executors' }
        },
        {
          title: '处理组',
          align: 'center',
          width: 200,
          dataIndex: 'executionGroupCN',
          scopedSlots: { customRender: 'executionGroups' }
        },
        {
          title: '报修时间',
          align: 'center',
          width: 180,
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '当前流程环节',
          align: 'center',
          width: 150,
          dataIndex: 'activityName'
        },
        {
          title: '操作',
          width: 150,
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      dataSource: [],
      orderInfo: {},
      submitBtn: [],
      formVal: {},
      formIndex: {},
      flowList: [],  // 流程数据
      formData: {
        title: '',
        repairman: '',
        modelId: [],
        createTime: [],
        flowNo: '',
        deviceid: '',
        gdlx: [],
        bxlx: [],
        IP: '',
        dd: '',
        hiddenOrderSate: [],
        gddj: []
      },
      formFileds: [],
      orderSateList: [
        {
          value: 'wcl',
          label: '未处理',
          color: 'rgb(73,171,222)'
        },
        {
          label: '未签收',
          value: 'wjs',
          color: 'rgb(98,112,193)'
        },
        {
          value: 'wfk',
          label: '未反馈',
          color: 'rgb(239,139,32)'
        },
        {
          value: 'yfk',
          label: '已反馈',
          color: 'rgb(5,209,227)'
        },
        {
          value: 'js',
          label: '结束',
          color: 'rgb(163,162,162)'
        },
        {
          value: 'ywc',
          label: '已完成',
          color: 'rgb(69, 195, 88)'
        }
      ],
      orderTypeList: [
        {
          'label': '摄像机类',
          'value': 'sxjl'
        },
        {
          'label': '服务器类',
          'value': 'fwql'
        },
        {
          'label': '网络类',
          'value': 'wll'
        },
        {
          'label': '动环类',
          'value': 'dhl'
        },
        {
          'label': '其他类',
          'value': 'qtl'
        }
      ],
      repairsTypeList: [
        {
          value: 'zdxj',
          label: '自动报修'
        },
        {
          value: 'rgxj',
          label: '人工报修'
        },
        {
          value: 'dhbx',
          label: '电话报修'
        },
        {
          value: 'wxbx',
          label: '微信报修'
        },
        {
          value: 'dsf',
          label: '第三方对接'
        },
        {
          value: 'qt',
          label: '其他'
        }
      ],
      isFile: 0,
      isShow: false,
      showRollback: false,
      workForm: {},
      conductor: [],
      conductorGroup: [],
      modeId: '',
      imgs: [],
      images: [],
      operation: '',
      allotShow: false,
      isPermission: false,
      spinning: false,
      signFlag: false,
      upFlag: false,
      spinningShow: false,
      activeKey: '1',
      imgUrl: window._CONFIG['domianURL'] + '/api/itsm/getFileById?isOnLine=true&fileId=',
      /**
       * 查询参数
       */
      data: {
        pageSize: 10,
        pageNum: 1,
        conditions: [],
        ass: []
      },
      total: 0, // 列表数据总数
      workCount: {
        overdue: {},
        toDay: {},
        undone: {}
      },
      ticketsLevel: [
        {
          value: 'lingji',
          label: '0'
        },
        {
          value: 'yiji',
          label: '1'
        },
        {
          value: 'erji',
          label: '2'
        },
        {
          value: 'sanji',
          label: '3'
        }
      ],
      userList: [],
      userIdList: [],
      userGroup: [],
      groupIdList: [],
      subItem: {},
      // 保存当前登录人角色信息
      identity: '',
      //保存当前登录人所在部门
      departName: ''
    }
  },
  methods: {
    moment,
    onSubmit (item) {
      this.subItem = item
      if (item.policy === 0) {
        this.showRollback = true
        this.userList = []
        this.userGroup = []
        item.user.forEach((itemA) => { // 转换成select组件需要的格式
          let objA = {
            value: itemA.id,
            label: itemA.name
          }
          this.userList.push(objA)
        })
        item.group.forEach((itemA) => {
          let objA = {
            value: itemA.id,
            label: itemA.name
          }
          this.userGroup.push(objA)
        })
        return
      }
      if (this.operation === 'add') {
        this.saveTickets(item)
        return
      }
      this.handleTickets(item)
    },
    saveTickets (item) {
      this.spinning = true
      this.formFileds.forEach((itemA) => {
        if (itemA.type === 'attachfile') {
          if (itemA.conf.default_value.length > 0) {
            this.images = itemA.conf.default_value
          }
        }
      })
      let handleRules = {
        route_id: item.route_id
      }
      if (item.nextActivityId) {
        handleRules.executors_groups = {
          [item.nextActivityId]: {}
        }
      }
      this.workForm = this.formVal
      delete this.workForm.file
      let data = {
        description: this.workForm.ticketDesc,
        form: this.workForm,
        handle_rules: handleRules,
        model_id: this.modeId,
        ticket_source: 'web',
        title: this.workForm.title,
        urgent_level: '2'
      }
      let apiKey = this.userInfo().apikey
      saveWorkOrder(data, apiKey).then(response => {
        if (this.isFile === 1 && this.images.length > 0) {
          this.uploadFile(response.result.id, this.images)
        } else {
          this.$message.success(response.message)
          this.showRollback = false
          this.spinning = false
          this.visible = false
          this.spinningShow = false
          this.getTicketsList()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleTickets (item) {
      this.spinning = true
      this.formFileds.forEach((itemA) => {
        if (itemA.type === 'attachfile') {
          if (itemA.conf.default_value.length > 0) {
            this.images = itemA.conf.default_value
          }
        }
      })
      let handleRules = {
        route_id: item.route_id
      }
      if (item.nextActivityId) {
        handleRules.executors_groups = {
          [item.nextActivityId]: {}
        }
      }
      this.workForm = this.formVal
      delete this.workForm.file
      let data = {
        activity_id: this.orderInfo.activity_id,
        handle_type: 1,
        model_id: this.orderInfo.model_id,
        ticket_id: this.orderInfo.ticketId,
        form: this.workForm,
        description: this.workForm.ticketDesc,
        title: this.workForm.title,
        ticket_source: 'wchart',
        urgent_level: '2',
        handle_rules: handleRules
      }
      let apiKey = this.userInfo().apikey
      handleOrder(data, apiKey).then(response => {
        this.spinning = false
        if (this.isFile === 1 && this.images.length > 0) {
          this.uploadFile(this.orderInfo.ticketId, this.images)
        } else {
          this.$message.success(response.message)
          this.showRollback = false
          this.visible = false
          this.spinningShow = false
          this.getTicketsList()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleShow () {
      this.formFileds.forEach((itemA) => {
        if (itemA.type === 'attachfile') {
          if (itemA.conf.default_value.length > 0) {
            this.images = itemA.conf.default_value
          }
        }
      })
      let handleRules = {
        route_id: this.subItem.route_id
      }
      if (this.userIdList.length > 0 || this.groupIdList.length > 0) {
        if (this.subItem.nextActivityId) {
          handleRules.executors_groups = {
            [this.subItem.nextActivityId]: {}
          }
        }
        if (this.userList.length > 0) {
          handleRules.executors_groups = {
            [this.subItem.nextActivityId]: {
              user: this.userIdList
            }
          }
        }
        if (this.userGroup.length > 0) {
          handleRules.executors_groups = {
            [this.subItem.nextActivityId]: {
              group: this.groupIdList
            }
          }
        }
      } else {
        this.$message.warning('请选择下一节点处理人')
        return
      }
      this.spinningShow = true
      this.workForm = this.formVal
      delete this.workForm.file
      let data = {
        activity_id: this.orderInfo.activity_id,
        handle_type: 1,
        model_id: this.orderInfo.model_id,
        ticket_id: this.orderInfo.ticketId,
        form: this.workForm,
        description: this.workForm.ticketDesc,
        title: this.workForm.title,
        ticket_source: 'wchart',
        urgent_level: '2',
        handle_rules: handleRules
      }
      let apiKey = this.userInfo().apikey
      handleOrder(data, apiKey).then(response => {
        if (this.isFile === 1 && this.images.length > 0) {
          this.uploadFile(this.orderInfo.ticketId, this.images)
        } else {
          this.$message.success(response.message)
          this.visible = false
          this.showRollback = false
          this.spinningShow = false
          this.loading = false
          this.visibleModel = false
          this.getTicketsList()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    updateTicketsInfo () {
      let data = {
        form: {
          orderSate: 'wfk',
          qsr: this.userInfo().username,
          qsrlxdh: this.userInfo().phone,
          qsgs: this.departName,
          fxrz: this.departName
        },
        ticket_id: this.orderInfo.ticketId
      }
      if (this.formVal.bxfl === 'zdbx' && this.formVal.gzpd === 'lx') {
        data.form.shr = this.formVal.repairman
      }
      let apiKey = this.userInfo().apikey
      updateTickets(data, apiKey).then(response => {
        this.$message.success('操作成功')
        this.getQueryTerms()
        this.getTicketsList()
        this.allotShow = true
        this.formFileds.forEach((itemA) => {
          this.$set(itemA, 'disabled', false)
        })
        this.visible = false
      }).catch(error => {
        console.log(error)
      })
    },
    updateOrder () {
      this.loading = true
      this.formFileds.forEach((itemA) => {
        if (itemA.type === 'attachfile') {
          if (itemA.conf.default_value.length > 0) {
            this.images = itemA.conf.default_value
          }
        }
      })
      this.workForm = this.formVal
      delete this.workForm.file
      let data = {
        ticket_id: this.orderInfo.ticketId,
        form: this.workForm
      }
      let apiKey = this.userInfo().apikey
      updateTickets(data, apiKey).then(response => {
        this.loading = false
        if (this.isFile === 1 && this.images.length > 0) {
          this.uploadFile(this.orderInfo.ticketId, this.images)
        } else {
          this.$message.success(response.message)
          this.getTicketsList()
          this.showRollback = false
          this.visible = false
          this.spinningShow = false
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleDetail (record) {
      this.spinningShow = true
      this.formFileds = []
      this.formIndex = {}
      this.formVal = {}
      this.workForm = {}
      this.orderInfo = {}
      this.submitBtn = []
      let params = {
        id: record.ticketId,
        apikey: this.userInfo().apikey
      }
      getTicketsDetails(params).then(response => {
        this.orderInfo = response.result
        this.formFileds = response.result.formFileds
        this.submitBtn = response.result.submitBtn
        this.imgs = []
        sessionStorage.setItem('tickedId', response.result.ticketId)
        this.ModalText = '工单详情'
        let url = ''
        let type = 'attachfile'
        let fileType = this.formFileds.find((item) => type === item.type)
        if (fileType !== undefined) {
          this.isFile = 1
          this.formFileds.forEach((itemA, index) => {
            if (itemA.type === 'attachfile') {
              if (this.orderInfo.files) {
                this.orderInfo.files.forEach((item) => {
                  url = this.imgUrl + item
                  this.imgs.push({
                    url: url,
                    uid: index + 20,
                    name: 'image' + index + '.png',
                    status: 'done'
                  })
                })
                this.$set(itemA, 'fileList', this.imgs)
              } else {
                this.$set(itemA, 'fileList', [])
              }
            }
          })
        } else {
          this.isFile = 0
        }
        this.formFileds.forEach((itemA, index) => {
          if (itemA.type === 'dateTime') {
            if (itemA.conf.default_value === '') {
              itemA.conf.default_value = getSelectTime(new Date(), true)
            }
          } else if (itemA.type === 'cascader') {
            if (itemA.conf.default_value === '') {
              itemA.conf.default_value = []
            }
          } else if (itemA.code === 'sgdw') {
            localStorage.setItem('sgdw', itemA.conf.default_value)
          }
          this.$set(this.formVal, itemA.code, itemA.conf.default_value)
          this.$set(this.formIndex, itemA.code, index)
        })
        this.getUserInfo(record.executionGroup, record.executor)
        this.operation = 'details'
        this.showRollback = false
        this.spinningShow = false
        this.visible = true
        this.spinning = false
      }).catch(error => {
        console.log(error)
      })
      this.getTicketsProcess(record.ticketId)
    },
    getModelDetails (id) {
      this.spinning = true
      this.formFileds = [] //清空数据
      this.submitBtn = []
      this.workForm = {}
      this.formVal = {}
      this.formIndex = {}
      let apiKey = this.userInfo().apikey
      getModelDetails(apiKey, id).then(response => {
        this.modeId = id
        this.formFileds = response.result.formFileds
        this.submitBtn = response.result.submitBtn
        this.ModalText = '创建工单'
        let type = 'attachfile'
        let fileType = this.formFileds.find((item) => type === item.type)
        if (fileType !== undefined) {
          this.isFile = 1
          this.formFileds.forEach((itemA, index) => {
            if (itemA.type === 'attachfile') {
              if (this.orderInfo.files) {
                this.orderInfo.files.forEach((item) => {
                  url = this.imgUrl + item
                  this.imgs.push({
                    url: url,
                    uid: index + 20,
                    name: 'image' + index + '.png',
                    status: 'done'
                  })
                })
                this.$set(itemA, 'fileList', this.imgs)
              } else {
                this.$set(itemA, 'fileList', [])
              }
            }
          })
        } else {
          this.isFile = 0
        }
        this.formFileds.forEach((itemA, index) => {
          if (itemA.type === 'dateTime') {
            if (itemA.conf.default_value === '') {
              itemA.conf.default_value = getSelectTime(new Date(), true)
            }
          } else if (itemA.type === 'cascader') {
            if (itemA.conf.default_value === '') {
              itemA.conf.default_value = []
            }
          } else if (itemA.code === 'sgdw') {
            localStorage.setItem('sgdw', itemA.conf.default_value)
          }
          this.$set(this.formVal, itemA.code, itemA.conf.default_value)
          this.$set(this.formIndex, itemA.code, index)
        })
        this.operation = 'add'
        this.visibleModel = false
        this.visible = true
        this.spinning = false
      }).catch(error => {
        console.log(error)
      })
    },
    uploadFile (ticketId, fileList) {
      this.loading = true
      let data = {
        ticketId: ticketId,
        filesBase64: fileList
      }
      let apiKey = this.userInfo().apikey
      uploadFileByTicketId(data, apiKey).then(response => {
        this.$message.success(response.message)
        this.loading = false
        this.visibleModel = false
        this.spinningShow = false
        this.visible = false
        this.loading = false

      }).catch(error => {
        console.log(error)
      })
    },
    handleEdit (record) {
      // this.visible = true
    },
    signTickets () {
      // this.signFlag = false
      if (((Array.isArray(this.conductorGroup) && this.conductorGroup.length === 1) || (Array.isArray(this.conductor) && this.conductor.length === 1))) {
        this.updateTicketsInfo()
        return
      }
      this.spinning = true
      let data = {
        ticket_id: this.orderInfo.ticketId,
        activity_id: this.orderInfo.activity_id,
        handle_type: 0
      }
      let apiKey = this.userInfo().apikey
      handleOrder(data, apiKey).then(response => {
        this.updateTicketsInfo()
      }).catch(error => {
        console.log(error)
      })
    },
    handleOk (e) {
      this.confirmLoading = true
      setTimeout(() => {
        this.showRollback = false
        this.visible = false
        this.spinningShow = false
        this.visibleModel = false
        this.confirmLoading = false
      }, 2000)
    },
    handleCancel () {
      this.showRollback = false
      this.visible = false
      this.visibleModel = false
      this.spinningShow = false
    },
    handleCancelShow () {
      this.showRollback = false
    },
    /** 发起流程 */
    handleAddBpm () {
      this.ModalText = '选择报修模型'
      this.visibleModel = true
    },
    getTicketsList () {
      // this.data.executors = [this.userInfo().uyunid]
      // this.getQueryTerms()
      this.loading = true
      getTicketsList(this.data).then((res) => {
        this.dataSource = res.result.dataList
        this.total = res.result.totalRecords
        this.loading = false
      })
    },
    getUserGroup () {
      this.loading = true
      getUserGroup(this.data).then((res) => {
        this.loading = false
      })
    },
    getMyToDoList () {
      this.loading = true
      delete this.data.param
      let param = {
        uyunId: [this.userInfo().uyunid],
        rodeId: []
      }
      getMytodoList(this.data).then((res) => {
        this.dataSource = res.result.ticket_list
        this.total = res.result.counts
        this.loading = false
      })
    },
    getTicketsProcess (id) {
      let ticketId = id
      this.loading = true
      getTicketsProcess(ticketId).then((res) => {
        this.flowList = res.result
        this.loading = false
      })
    },
    getModelList () {
      let apiKey = this.userInfo().apikey
      this.loading = true
      getModelList(apiKey).then(response => {
        this.workTypeList = response.result
        this.loading = false
      }).catch(error => {
        console.log(error)
      })
    },
    ...mapGetters(['userInfo', 'rolesA', 'departs']),
    getUserInfo (executionGroups, executors) {
      this.signFlag = false
      this.conductor = []
      this.conductorGroup = []
      let uyunId = this.userInfo().uyunid
      let rolesB = this.rolesA()

      let executor = undefined
      if (executors !== '' && executors != null && executors.length > 0) {
        executor = executors.find((item) => uyunId === item && this.orderInfo.activity_name !== '结束')
      }
      let executionGroup = undefined
      if(executionGroups != null && executionGroups.length > 0) {
        executionGroup = executionGroups.filter((item) => rolesB.indexOf(item) > -1 && this.orderInfo.activity_name !== '结束')
      }
      // 判断executionGroup为[]的情况
      if (Array.isArray(executionGroup) && executionGroup.length === 0) {
        executionGroup = undefined
      }
      // 判断工单状态为未签收并且是内场或者外场实施办理环节，如都满足则显示签收按钮
      this.allotShow = !(this.formVal.orderSate === 'wjs' && (this.orderInfo.activity_id === '4ee67d3f2b2a4f65a73775e5525e3867' || this.orderInfo.activity_id === 'df6c26bedae34a7dae2396ec1dac14f5'))
      this.isPermission = executor || executionGroup
      let isEdit = this.isPermission ? !this.allotShow : true
      this.formFileds.forEach((itemA) => {
        this.$set(itemA, 'disabled', isEdit)
      })
      this.conductor = executors
      this.conductorGroup = executionGroups
    },
    getTicketTodoCountByUser () {
      let data = {
        userid: this.userInfo().uyunid,
        roleid: this.rolesA()[0]
      }
      this.workCount.overdue = {}
      this.workCount.toDay = {}
      this.workCount.undone = {}
      getTicketTodoCountByUser(data).then(response => {
        this.workCount.overdue = response.result.overdue
        this.workCount.toDay = response.result.toDay
        this.workCount.undone = response.result.undone
        this.loading = false
      }).catch(error => {
        console.log(error)
      })
    },
    getTicketAllCountByUser () {
      let data = {}
      if (this.identity === '') {
        data = {}
      } else {
        data = {
          userid: this.userInfo().uyunid,
          roleid: this.rolesA()[0],
          [this.identity]: this.departName
        }
      }
      this.workCount.overdue = {}
      this.workCount.toDay = {}
      this.workCount.undone = {}
      getTicketAllCountByUser(data).then(response => {
        this.workCount.overdue = response.result.overdue
        this.workCount.toDay = response.result.toDay
        this.workCount.undone = response.result.undone
        this.loading = false
      }).catch(error => {
        console.log(error)
      })
    },
    getLongTime (val, isFull) {
      if (val === '' || val === 0) {
        return '- -'
      }
      return getSelectTime(new Date(val), isFull)
    },
    getExecutors (arr) {
      return arr != null && arr.length >= 0 ? arr.join(',') : ' '
    },
    getExecutionGroups (arr) {
      return arr != null && arr.length >= 0 ? arr.join(',') : ' '
    },
    onChange (page, pageSize) {
      this.data.pageNum = page
      this.data.pageSize = pageSize
      this.getTicketsList()
    },
    onChangeTabs (key) {
      this.getQueryTerms()
      this.getTicketsList()
      if (key === '1') {
        this.getTicketTodoCountByUser()
      } else {
        this.getTicketAllCountByUser()
      }
    },
    onShowSizeChange (current, size) {
      this.data.pageNum = current
      this.data.pageSize = size
      this.getTicketsList()
    },
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    searchQuery () {
      this.getQueryTerms()
      for (let key in this.formData) {
        if (typeof (this.formData[key]) === 'string') {
          if (this.formData[key] !== '') {
            if (key === 'title' || key === 'flowNo') {
              let obj = {
                field: key + '',
                value: this.formData[key],
                operator: 'like'
              }
              this.data.conditions.push(obj)
            } else {
              let obj = {
                field: 'formData.' + key + '',
                value: this.formData[key],
                operator: 'like'
              }
              this.data.conditions.push(obj)
            }
          }
        } else if (Array.isArray(this.formData[key])) {
          let obj = {}
          if (this.formData[key].length > 0) {
            if (key === 'modelId') {
              obj = {
                field: key + '',
                value: this.formData[key],
                operator: 'in'
              }
              this.data.conditions.push(obj)
            } else if (key === 'createTime') {
              obj = {
                field: key + '',
                value: this.formData[key],
                operator: 'range'
              }
              this.data.conditions.push(obj)
            } else {
              obj = {
                field: 'formData.' + key + '',
                value: this.formData[key],
                operator: 'in'
              }
              this.data.conditions.push(obj)
            }
          }
        }
      }
      this.getTicketsList()
    },
    searchReset () {
      this.$refs.ruleForm.resetFields()
      this.getQueryTerms()
      this.getTicketsList()
    },
    handleToggleSearch () {
      this.toggleSearchStatus = !this.toggleSearchStatus
    },
    getQueryTerms () {
      let rolesB = this.rolesA()
      // 测试环境sungcor
      // let serviceGroups = ['3468e3f179ec47a993aa71cebf611465']
      // let outfields = ['5b5933ff232f481a8a075671fd45ee5d', '5e11e156b8ce4a69a5d77d565fbaedf2', 'e41ec02e58e2448c910e72094ba2f34e', '7f1a367b62ed41bcabe83574a745115a', '880ccd34d1cf43228ba0f4cc15587f30', 'd276a5d0cacc479d887db9a10dc6b9f0', 'dc975edf71f943e9bcd3a8c482121edc']
      // let infields = ['748caa36dbb44da2940e83dc24d651d7', '7c750dfd5f0641fcb3dbcfd92c5877f7']
      // 线上环境闵行
      let serviceGroups = ['fd24c7055e944f0782b38de052e0dfd7']
      let outfields = ['beec1f6e57224be68c03b3b369cdfe23', '3a8b1896c2f146e99b4a75d6236b935e', 'c7e14e68f230422f86315fb43ebce962', '66e2105d899247bfa62f9ad8ee9479bb', '2619762664a349378ccb110bd789652f', 'cb56995665754864a0d96beaaa5fca1c', 'cdd0a93880cb4c58b18b9284fef0e933']
      let infields = ['0c917d00166e47558f56603c1dc6d2cc', '7c750dfd5f0641fcb3dbcfd92c5877f7']
      let normalUser = []
      let departId = this.userInfo().departIds ? this.userInfo().departIds : []
      let departIds = this.departs()
      let departObj = departIds.filter((item) => departId.indexOf(item.id) > -1)
      let departName = ''
      if ((Array.isArray(departObj) && departObj.length > 0) && departObj) {
        departName = departObj[0].departName
      }
      this.departName = departName // 保存部门名称在统计时使用
      localStorage.setItem('departName', this.departName)
      let dataArr2 = []
      dataArr2 = [
        {
          cjt: 'or',
          conditions: [
            {
              field: 'executor',
              value: [this.userInfo().uyunid],
              operator: 'in'
            },
            {
              field: 'executionGroup',
              value: this.rolesA(),
              operator: 'in'
            }
          ]
        }
      ]
      if (this.activeKey === '1') {
        let dataArr = []
        dataArr = [
          {
            field: 'status',
            value: [1, 2],
            operator: 'in'
          }
        ]
        this.data.conditions = dataArr
        this.data.ass = dataArr2
      } else {
        this.data.conditions = []
        let cond = [
          {
            field: 'participation',
            value: [this.userInfo().uyunid],
            operator: 'in'
          }
        ]
        dataArr2.forEach((item) => {
          item.conditions = [...item.conditions, ...cond]
        })
        /*if (serviceGroups.indexOf(rolesB[0]) > -1) {
          this.identity = ''
          dataArr2 = []
        } else if (outfields.indexOf(rolesB[0]) > -1) {
          this.identity = 'sgdw'
          let cond = [
            {
              field: 'participation',
              value: [this.userInfo().uyunid],
              operator: 'in'
            }, {
              field: 'formData.sgdw',
              value: departName,
              operator: 'like'
            }
          ]
          dataArr2.forEach((item) => {
            item.conditions = [...item.conditions, ...cond]
          })
        } else if (infields.indexOf(rolesB[0]) > -1) {
          this.identity = 'cjdw'
          let cond = [
            {
              field: 'participation',
              value: [this.userInfo().uyunid],
              operator: 'in'
            },
            {
              field: 'formData.cjdw',
              value: departName,
              operator: 'like'
            }
          ]
          dataArr2.forEach((item) => {
            item.conditions = [...item.conditions, ...cond]
          })
        } else if (normalUser.indexOf(rolesB[0]) > -1) {
          this.identity = 'bxbm'
          let cond = [
            {
              field: 'participation',
              value: [this.userInfo().uyunid],
              operator: 'in'
            },
            {
              field: 'formData.bxbm',
              value: departName,
              operator: 'like'
            }

          ]
          dataArr2.forEach((item) => {
            item.conditions = [...item.conditions, ...cond]
          })
        }*/
        this.data.ass = dataArr2
      }
    },
    onChangeDate (dates, dateStrings) {
      console.log('From: ', dates[0], ', to: ', dates[1])
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
    },
    selectChangeUser () {
      this.$refs.userIdList.blur()
    },
    selectChangeGroup () {
      this.$refs.groupIdList.blur()
    }
  }
  ,
  created () {
    // this.getUserGroup()
  }
  ,
  mounted () {
    // this.getMyToDoList()
    this.getQueryTerms()
    this.getTicketsList()
    this.getModelList()
    this.getTicketTodoCountByUser()
    // this.initDictConfig()
  }
}
</script>
<style lang="less">
  @import '~@assets/less/common.less';

  .tickets-list .ant-card-body {
    padding: 15px 20px;
  }

  .gd-status-sjzy {
    width: 23%;
    border: 1px solid #65c6f3;
    background-color: #65c6f3;
    border-radius: 5px;
    margin-left: 20px;
    box-shadow: 2px 2px 6px #aaaaaa;
  }

  .gd-status-ztsy {
    width: 25%;
    border: 1px solid #f78463;
    background-color: #f78463;
    border-radius: 5px;
    margin-left: 35px;
    box-shadow: 2px 2px 6px #aaaaaa;
  }

  .gd-status-yxj {
    width: 25%;
    border: 1px solid #8aaaf5;
    background-color: #8aaaf5;
    border-radius: 5px;
    margin-left: 35px;
    box-shadow: 2px 2px 6px #aaaaaa;
  }

  .gd-status-total {
    color: white;
    font-size: 17px;
    margin-left: 20px;
    margin-top: 15px;
  }

  .gd-status-total-num {
    font-size: 32px;
    color: white;
    margin-left: 20px;
    margin-top: -5px;
    margin-bottom: 10px;
  }

  .gd-status-text {
    color: white;
    font-size: 12px;
    margin-right: 10px;
  }

  .topbar {
    position: relative;
    display: flex;

    .topbar-item {
      overflow: hidden;
      width: 300px;
      height: 100px;
      border-radius: 10px;
      margin-right: 20px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      //box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      .header {
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        font-size: 24px;
      }

      .content {
        position: relative;
        border-bottom: 1px solid rgb(241, 241, 241);
        height: 50px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

        .info-left,
        .info-right {
          display: inline-block;
          box-sizing: border-box;
          height: 40px;
          line-height: 40px;
          text-align: center;
          color: rgb(165, 165, 165);
          font-size: 16px;
        }

        .info-left {
          width: 58%;

          strong {
            font-size: 24px;
          }
        }

        .info-right {
          position: relative;
          top: -4px;
          width: 42%;
          font-size: 16px;
        }
      }

      &.item1 {

        .header {
          background: linear-gradient(180deg,
          rgb(14, 145, 254) 35%,
          rgb(16, 183, 248));
          // background-color: rgb(16,175,249) ;
        }

        .content {
          border: 4px solid rgb(16, 183, 248);
          border-bottom: 6px solid rgb(16, 183, 248);

          .info-left {
            color: rgb(14, 145, 254);
            border-right: 2px solid rgb(16, 183, 248);
          }
        }
      }

      &.item2 {
        .header {
          background: linear-gradient(180deg,
          rgb(235, 156, 23) 25%,
          rgb(255, 190, 61));
          //background-color:rgb(255,205,61) ;
        }

        .content {
          border: 4px solid rgb(255, 190, 61);
          border-bottom: 6px solid rgb(255, 190, 61);

          .info-left {
            color: rgb(235, 156, 23);
            border-right: 2px solid rgb(255, 190, 61);
          }
        }
      }

      &.item3 {
        .header {
          background: linear-gradient(180deg,
          rgb(251, 84, 83) 30%,
          rgb(255, 123, 123));
          // background-color:rgb(253,120,100) ;
        }

        .content {
          border: 4px solid rgb(255, 123, 123);
          border-bottom: 6px solid rgb(255, 123, 123);

          .info-left {
            color: rgb(255, 123, 123);
            border-right: 2px solid rgb(255, 123, 123);
          }
        }
      }
    }
  }

  .form-query {
    border: 1px solid #e6eaef;
    padding-top: 10px;
    padding-right: 10px;
    background-color: #f4f7fd;
    margin-bottom: 15px;
    padding-bottom: 10px;
    margin-top: 10px;
  }

  .form-query .ant-row {
    position: relative;
    height: auto;
    margin-right: 0;
    margin-left: 0;
    margin-bottom: 10px;
    zoom: 1;
    display: block;
  }

  .btn-query {
    width: 100%;
    position: relative;
    display: inline-block;
    cursor: pointer;
    color: #464c55;
  }

  .btn-query .ant-btn {
    line-height: 1.5;
  }
</style>