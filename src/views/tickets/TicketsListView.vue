<template xmlns:>
  <a-card :bordered="false">
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
    <div class="topbar">
      <div class="topbar-item item1">
        <header class="header">
          今日工单数:
          <strong>{{workCount.toDay.toDayCount}}</strong>
        </header>
        <div class="content">
          <div class="info-left">
            监控类:
            <strong>{{workCount.toDay.jkTypeTodayCount}}</strong>
          </div>
          <div class="info-right">其他:{{workCount.toDay.otherTypeTodayCount}}</div>
        </div>
      </div>
      <div class="topbar-item item2">
        <header class="header">
          未完成工单数:
          <strong>{{workCount.finish.unFinishCount}}</strong>
        </header>
        <div class="content">
          <div class="info-left">
            监控类:
            <strong>{{workCount.finish.jkUnFinishCount}}</strong>
          </div>
          <div class="info-right">其他:{{workCount.finish.otherUnFinishCount}}</div>
        </div>
      </div>
      <div class="topbar-item item3">
        <header class="header">
          逾期工单数:
          <strong>{{workCount.overdue.overdueStateCount}}</strong>
        </header>
        <div class="content">
          <div class="info-left">
            监控类:
            <strong>{{workCount.overdue.jkTypeYqztCount}}</strong>
          </div>
          <div class="info-right">其他:{{workCount.overdue.otherTypeYqztCount}}</div>
        </div>
      </div>
    </div>
    <div
      style="border: 1px solid #f1f1f1;padding-top: 15px;padding-right:10px;background-color: #f1f1f1;margin-bottom: 20px;">
      <!-- <a-form layout="inline">
         <a-row :gutter="24">
           <a-col :md="6" :sm="8">
             <a-form-item label="工单状态">
               <a-select
                 showSearch
                 mode="multiple"
                 :options="statusList"
                 :filterOption="filterOption"
                 v-model="stateList"
                 placeholder="请选择状态"
                 allowClear
               />
             </a-form-item>
           </a-col>
           <a-col :md="6" :sm="8">
             <a-form-item label="工单标题">
               <a-input placeholder="请输入工单标题" v-model="workName"></a-input>
             </a-form-item>
           </a-col>
           &lt;!&ndash; <a-col :md="6" :sm="8">
              <a-form-item label="流程名称">
                <a-input placeholder="请输入流程名称" v-model="queryParam.processName"></a-input>
              </a-form-item>
            </a-col>&ndash;&gt;
           <a-col :md="6" :sm="8">
             <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
               <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
               <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
             </span>
           </a-col>
         </a-row>
       </a-form>-->
      <a-form-model ref="ruleForm" :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row :gutter="24">    
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-model-item label="工单标题" prop="title">            
              <a-input placeholder="请输入工单标题" v-model="formData.title"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-model-item label="工单模板" prop="modelId">            
              <a-select mode="tags" v-model="formData.modelId" style="width: 100%" placeholder="请选择工单模板">
                <a-select-option v-for="item in workTypeList" :key="item.id">
                  {{item.name}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-model-item label="流水号" prop="flowNo">            
                <a-input placeholder="请输入流水号" v-model="formData.flowNo"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-model-item label="报修人" prop="repairman">            
                <a-input placeholder="请输入报修人" v-model="formData.repairman"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
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
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-model-item label="工单状态" prop="orderSate">           
                <a-select
                  showSearch
                  mode="multiple"
                  :options="orderSateList"
                  :filterOption="filterOption"
                  v-model="formData.orderSate"
                  placeholder="请选择工单状态"
                  allowClear
                />
              </a-form-model-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-model-item label="设备编码" prop="deviceid">
                <a-input placeholder="请输入设备编码" v-model="formData.deviceid"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-model-item label="设备IP" prop="IP">
                <a-input placeholder="请输入设备IP" v-model="formData.IP"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-model-item label="报修类型" prop="bxlx">
                <a-select
                  showSearch
                  mode="multiple"
                  :options="repairsTypeList"
                  :filterOption="filterOption"
                  v-model="formData.bxlx"
                  placeholder="请选择报修类"
                  allowClear
                />
              </a-form-model-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
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
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
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
          </template>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;padding-left: 25px;" class="table-page-search-submitButtons">
              <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
              <a-button type="primary" icon="reload" @click="searchReset" style="margin-left: 8px;">重置</a-button>
              <a @click="handleToggleSearch()" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form-model>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAddBpm" type="primary" icon="plus">发起流程</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
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
        :loading="loading"
      >
        <span slot="status" slot-scope="status">
       <!--   <a-icon type="exclamation-circle" />-->
          <a-tag v-if="item.value === status +''" :color="item.color"
                 v-for="item in orderSateList"> {{item.label}}</a-tag>
        </span>
        <template slot="type" slot-scope="type">
          <span v-if="item.value === type +''" :color="item.color"
                v-for="item in orderTypeList"> {{item.label}}
          </span>
        </template>
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

        <span slot="modelName" slot-scope="text, record">
          <j-ellipsis :value="'工单【'+text+'】'" :length="15"/>
        </span>
        <!-- 字符串超长截取省略号显示-->
        <span slot="executors" slot-scope="executors, record">
          <j-ellipsis :value="getExecutors(executors)" :length="15"/>
        </span>
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
        :form-config="formConfig"
        :submit-btn="submitBtn"
        :allot-show="allotShow"
        :operation="operation"
        :spinning="spinning"
        :flow-list="flowList"
        v-if="operation === 'details'"
        @updateFeedback="updateOrder"
        @uploadFile="uploadFile"
        @click="onSubmit">
      </tickets-from-flow>
      <!--    <div style="width: 65%;border: 1px solid #dee3ea;height: 700px;">
            <div style="border-bottom: 1px solid #dee3ea;background-color: #f4f7fd" class="work-detail-main-title"
                 @click="isShowData()">
              <div class="header-left-icon"></div>
              <span style="margin-left: 8px">基本信息</span>
              <div style="text-align: right;float: right">
                <a-icon :type="isShow ?'down' : 'right'" class="work-detail-title-icon"/>
              </div>
            </div>
            <div style="padding-right: 25px;padding-top: 15px;height:655px;overflow-x: hidden" v-show="isShow">
              <tickets-from :form-config="formConfig"
                            :submit-btn="submitBtn"
                            :allot-show="allotShow"
                            :operation="operation"
                            @updateFeedback="updateOrder"
                            @uploadFile="uploadFile"
                            @click="onSubmit">
              </tickets-from>
            </div>
          </div>
          <div style="width: 35%;border: 1px solid #dee3ea;margin-left:20px;">
            <div style="background-color: #f4f7fd" class="work-detail-main-title">
              <div class="header-left-icon"></div>
              <span style="margin-left: 8px">流程信息</span>
            </div>
            <div style="padding-left: 25px;padding-top: 20px;">
              <a-timeline>
                <a-timeline-item>
                  <p>流程环节：【开始】</p>
                  <p>事件：admin 创建 了工单给 赵墨希</p>
                  <p>开始时间：2020-08-18 15:45:36</p>
                </a-timeline-item>
                <a-timeline-item>
                  <p>时间：2020-08-18 15:45:36</p>
                  <p>流程环节：【开始】</p>
                  <p>事件：2020-08-18 15:45:36</p>
                  <p>时间：2020-08-18 15:45:36</p>
                </a-timeline-item>
                <a-timeline-item>
                  <p>时间：2020-08-18 15:45:36</p>
                  <p>流程环节：【开始】</p>
                  <p>事件：2020-08-18 15:45:36</p>
                  <p>时间：2020-08-18 15:45:36</p>
                </a-timeline-item>
                <a-timeline-item>
                  <p>时间：2020-08-18 15:45:36</p>
                  <p>流程环节：【开始】</p>
                  <p>事件：2020-08-18 15:45:36</p>
                  <p>时间：2020-08-18 15:45:36</p>
                </a-timeline-item>
              </a-timeline>
            </div>
          </div>-->
      <tickets-form
        :form-config="formConfig"
        :submit-btn="submitBtn"
        :allot-show="allotShow"
        :operation="operation"
        @updateFeedback="updateOrder"
        @uploadFile="uploadFile"
        @click="onSubmit"
        v-if="operation === 'add'"
      >
      </tickets-form>
    </a-modal>
  </a-card>
</template>

<script>
import {
  getTicketsList, getTicketsDetails, getModelList,
  getModelDetails, saveWorkOrder, handleOrder, updateTickets,
  uploadFileByTicketId, getTicketCountByUser, getTicketsProcess
} from '../../api/tickets'
import JEllipsis from '@/components/jeecg/JEllipsis'
import JDate from '@/components/jeecg/JDate.vue'
import TicketsFromFlow from '../../components/from-el/Tickets-From-Flow'
import TicketsForm from '../../components/from-el/Tickets-Form'
import TicketsModelType from './modules/TicketsModelType'
import { getSelectTime, filterObj } from '../../utils/util'
import { mapGetters } from 'vuex'
import moment from 'moment'

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
        sm: { span: 4 },
        xl: { span: 6 },
        lg: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        xl: { span: 18 },
        lg: { span: 17 }
      },
      widthModel:'85%',
      workTypeList: [],
      ModalText: '创建工单',
      visible: false,
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
          width: 100,
          dataIndex: 'formData.orderSate',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '工单标题',
          align: 'center',
          width: 180,
          dataIndex: 'title'
        },
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
          dataIndex: 'formData.gdlx',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '当前阶段',
          align: 'center',
          width: 180,
          dataIndex: 'activityName'
        },
        {
          title: '报修人',
          align: 'center',
          width: 150,
          dataIndex: 'formData.repairman'
        },
        {
          title: '报修人联系方式',
          align: 'center',
          width: 150,
          dataIndex: 'formData.telephone'
        },
        {
          title: '签收人',
          align: 'center',
          width: 150,
          dataIndex: 'formData.qsr'
        },
        /* {
           title: '处理人',
           align: 'center',
           width: 200,
           dataIndex: 'executors',
           scopedSlots: { customRender: 'executors' }
         },*/
        {
          title: '创建时间',
          align: 'center',
          width: 180,
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'createTime' }
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
      formConfig: {
        formFiles: []
      },
      flowList: [],  // 流程数据
      formData: {
        title: '',
        repairman: '',
        modelId: [],
        createTime: '',
        flowNo: '',
        deviceid: '',
        gdlx: [],
        bxlx: [],
        IP: '',
        orderSate: [],
        gddj: []
      },
      formFileds: [],
      statusList: [
        {
          value: '1',
          label: '待处理',
          color: 'rgb(73,171,222)'
        },
        {
          value: '2',
          label: '处理中',
          color: 'rgb(82,237,203)'
        },
        {
          value: '3',
          label: '已完成',
          color: 'rgb(69, 195, 88)'
        },
        {
          value: '7',
          label: '已关闭',
          color: 'rgb(255,82,42)'
        },
        {
          value: '10',
          label: '挂起',
          color: 'rgb(255,174,47)'
        },
        {
          value: '11',
          label: '已废除',
          color: 'rgb(250,220,35)'
        }
      ],
      orderSateList: [
        {
          value: 'wcl',
          label: '未处理',
          color: 'rgb(73,171,222)'
        },
        {
          value: 'wjs',
          label: '未签收',
          color: 'rgb(76,197,171)'
        },
        {
          value: 'yqs',
          label: '已签收',
          color: 'rgb(69, 195, 88)'
        },
        {
          value: 'wfk',
          label: '未反馈',
          color: 'rgb(255,82,42)'
        },
        {
          value: 'yfk',
          label: '已反馈',
          color: 'rgb(255,174,47)'
        },
        {
          value: 'js',
          label: '结束',
          color: 'rgb(250,220,35)'
        },
        {
          value: 'ywc',
          label: '已完成',
          color: 'rgb(69, 195, 88)'
        }
      ],
      orderTypeList: [
        {
          'select': 0,
          'label': '监控类',
          'value': '监控类',
          'descEnable': 0
        },
        {
          'select': 0,
          'label': '其他监控类',
          'value': '其他监控类',
          'descEnable': 0
        },
        {
          'select': 0,
          'label': '计算机类',
          'value': '计算机类',
          'descEnable': 0
        },
        {
          'select': 0,
          'label': '任务类',
          'value': '任务类',
          'descEnable': 0
        },
        {
          'select': 0,
          'label': '求助类',
          'value': '求助类',
          'descEnable': 0
        },
        {
          'select': 0,
          'label': '会议保障类',
          'value': '会议保障类',
          'descEnable': 0
        },
        {
          'select': 0,
          'label': '会议系统类',
          'value': '会议系统类',
          'descEnable': 0
        },
        {
          'select': 0,
          'label': '网络类',
          'value': '网络类',
          'descEnable': 0
        },
        {
          'select': 0,
          'label': '有线通信类',
          'value': '有线通信类',
          'descEnable': 0
        },
        {
          'select': 0,
          'label': '无线网络类',
          'value': '无线网络类',
          'descEnable': 0
        },
        {
          'select': 0,
          'label': '其他',
          'value': '其他',
          'descEnable': 0
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
      userGroup: [],
      workForm: {},
      modeId: '',
      imgs: [],
      images: [],
      operation: '',
      allotShow: false,
      spinning: false,
      activeKey: '1',
      imgUrl: 'http://192.168.1.103:8080/oss/api/itsm/getFileById?isOnLine=true&fileId=',
      data: {
        pageSize: 10,
        pageNum: 1,
        param: []
      },
      total: 0, // 列表数据总数
      workCount: {
        overdue: {},
        toDay: {},
        finish: {}
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
      ]
    }
  },
  methods: {
    moment,
    onSubmit (item) {
      this.subItem = item
      /* if (this.policy === 0) {
         this.showRollback = true
         this.userList = item.user
         this.userGroup = item.groups
         return
       }*/
      // alert(JSON.stringify(this.formFileds))
      if (this.operation === 'add') {
        this.saveTickets(item)
        return
      }
      this.handleTickets(item)
    },
    saveTickets (item) {
      this.spinning = true
      this.formFileds.forEach((itemA) => {
        if (itemA.type !== 'attachfile') {
          this.$set(this.workForm, itemA.code, itemA.conf.default_value)
        } else {
          this.$set(this.workForm, itemA.code, '')
          if (itemA.conf.default_value.length > 0) {
            this.imgs = itemA.conf.default_value
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
        this.$message.success(response.message)
        this.spinning = false
        this.visible = false
        this.getTicketsList()
      }).catch(error => {
        console.log(error)
      })
    },
    handleTickets (item) {
      this.spinning = true
      this.formFileds.forEach((itemA) => {
        if (itemA.type !== 'attachfile') {
          this.$set(this.workForm, itemA.code, itemA.conf.default_value)
        } else {
          this.$set(this.workForm, itemA.code, '')
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
        this.disabled = true
        this.spinning = false
        if (this.isFile === 1 && this.images.length > 0) {
          // this.uploadFileByTicketId()
        } else {
          this.$message.success(response.message)
          this.visible = false
          this.getTicketsList()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    updateOrder () {
      this.loading = true
      this.formFileds.forEach((itemA) => {
        if (itemA.type !== 'attachfile') {
          this.$set(this.workForm, itemA.code, itemA.conf.default_value)
        } else {
          this.$set(this.workForm, itemA.code, '')
          if (itemA.conf.default_value.length > 0) {
            this.images = itemA.conf.default_value
          }
        }
      })
      let data = {
        ticket_id: this.orderInfo.ticketId,
        form: this.workForm
      }
      let apiKey = this.userInfo().apikey
      updateTickets(data, apiKey).then(response => {
        this.loading = false
        if (this.isFile === 1 && this.images.length > 0) {
          this.uploadFileByTicketId()
        } else {
          this.$message.success(response.message)
          this.getTicketsList()
          this.visible = false
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleDetail (record) {
      this.loading = true
      this.formFileds = []
      this.submitBtn = []
      let params = {
        id: record.ticketId,
        apikey: this.userInfo().apikey
      }
      getTicketsDetails(params).then(response => {
        this.orderInfo = response.result
        this.formFileds = response.result.formFileds
        this.submitBtn = response.result.submitBtn
        this.formConfig.formFiles = this.formFileds
        this.getUserInfo()
        sessionStorage.setItem('tickedId', response.result.ticketId)
        this.ModalText = '工单详情'
        let url = ''
        this.formFileds.forEach((itemA, index) => {
          if (itemA.type === 'attachfile') {
            this.isFile = 1
            if (this.orderInfo.files) {
              this.orderInfo.files.forEach((item) => {
                url = this.imgUrl + item
                this.imgs.push({
                  url: url,
                  uid: index - 20,
                  name: 'image' + index + '.png',
                  status: 'done'
                })
              })
              this.$set(itemA, 'fileList', this.imgs)
            } else {
              this.$set(itemA, 'fileList', [])
            }
          } else if (itemA.type === 'dateTime') {
            if (itemA.conf.default_value === '') {
              itemA.conf.default_value = getSelectTime(new Date(), true)
            }
          } else if (itemA.type === 'cascader') {
            if (itemA.conf.default_value === '') {
              itemA.conf.default_value = []
            }
          }
          this.isFile = 0
        })
        this.operation = 'details'
        this.visible = true
        this.loading = false
      }).catch(error => {
        console.log(error)
      })
      this.getTicketsProcess(record.ticketId)
    },
    getModelDetails (id) {
      this.loading = true
      this.formFileds = [] //清空数据
      this.submitBtn = []
      let apiKey = this.userInfo().apikey
      getModelDetails(apiKey, id).then(response => {
        this.modeId = id
        this.formFileds = response.result.formFileds
        this.submitBtn = response.result.submitBtn
        this.formConfig.formFiles = this.formFileds
        this.ModalText = '创建工单'
        this.formFileds.forEach((itemA) => {
          if (itemA.type === 'attachfile') {
            this.isFile = 1
            this.$set(itemA, 'fileList', [])
            return
          } else if (itemA.type === 'dateTime') {
            itemA.conf.default_value = getSelectTime(new Date(), true)
          }
          this.isFile = 0
        })
        this.operation = 'add'
        this.visibleModel = false
        this.allotShow = true
        this.visible = true
        this.loading = false
      }).catch(error => {
        console.log(error)
      })
    },
    uploadFile (fileList) {
      this.loading = true
      let data = {
        ticketId: this.orderInfo.ticketId,
        filesBase64: fileList
      }
      let apiKey = this.userInfo().apikey
      uploadFileByTicketId(data, apiKey).then(response => {
        this.loading = false
        this.$message.success(response.message)
      }).catch(error => {
        console.log(error)
      })
    },
    handleEdit (record) {
      // this.visible = true
    },
    handleOk (e) {
      this.ModalText = 'The modal will be closed after two seconds'
      this.confirmLoading = true
      setTimeout(() => {
        this.visible = false
        this.visibleModel = false
        this.confirmLoading = false
      }, 2000)
    },
    handleCancel () {
      this.visible = false
      this.visibleModel = false
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
        this.dataSource = res.result.ticket_list
        this.total = res.result.counts
        console.log(this.total)
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
    ...mapGetters(['userInfo']),
    getUserInfo () {
      let executors = this.orderInfo.executors
      let uyunId = this.userInfo().uyunid
      let executor = executors.find((item) => uyunId === item && this.orderInfo.activity_name !== '结束')
      if (executor) {
        this.allotShow = true
        this.showIcon = 'ellipsis'
        this.formFileds.forEach((itemA) => {
          this.$set(itemA, 'disabled', false)
        })
      } else {
        this.allotShow = false
        this.formFileds.forEach((itemA) => {
          this.$set(itemA, 'disabled', true)
        })
      }
    },
    getTicketCountByUser () {
      let userId = this.userInfo().uyunid
      getTicketCountByUser(userId).then(response => {
        this.workCount.overdue = response.result.overdue
        this.workCount.toDay = response.result.toDay
        this.workCount.finish = response.result.finish
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
      if (arr.length < 0) {
        return ' '
      }
      return arr.join(',')
    },
    onChange (page, pageSize) {
      this.data.pageNum = page
      this.data.pageSize = pageSize
      this.getTicketsList()
    },
    onChangeTabs (key) {
      this.getQueryTerms()
      this.getTicketsList()
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
      console.log(input)
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    searchQuery () {
      this.getQueryTerms()
      for (let key in this.formData) {
        //console.log(key + '--->' + this.formData[key].length)
        if (typeof (this.formData[key]) === 'string') {
          if (this.formData[key] !== '') {
            if(key === 'title' || key === 'flowNo'){
              let obj = {
                field: key+'',
                value: this.formData[key],
                operator: 'like'
              }
              this.data.param.push(obj)
            }else {
              let obj = {
                field: 'formData.' + key+'',
                value: this.formData[key],
                operator: 'like'
              }
              this.data.param.push(obj)
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
              this.data.param.push(obj)
            }else if (key === 'createTime') {
              obj = {
                field: key + '',
                value: this.formData[key],
                operator: 'BETWEEN'
              }
              this.data.param.push(obj)
            }else {
              obj = {
                field: 'formData.' + key + '',
                value: this.formData[key],
                operator: 'in'
              }
              this.data.param.push(obj)
            }
          }
        }
      }
      console.log(this.data.param)
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
      if (this.activeKey === '1') {
        let dataArr = []
        dataArr = [
          {
            field: 'executor',
            value: [this.userInfo().uyunid],
            operator: 'in'
          },
          {
            field: 'status',
            value: [1, 2],
            operator: 'in'
          }
        ]
        this.data.param = dataArr
      } else {
        let dataArr = []
        dataArr = [
          {
            field: 'participation',
            value: [this.userInfo().uyunid],
            operator: 'in'
          }
        ]
        this.data.param = dataArr
      }
    },
    onChangeDate(dates, dateStrings) {
      console.log('From: ', dates[0], ', to: ', dates[1]);
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    },
  },
  mounted () {
    this.getQueryTerms()
    this.getTicketsList()
    this.getModelList()
    this.getTicketCountByUser()
    // this.initDictConfig()
  }
}
</script>
<style lang="less" scoped>
  @import '~@assets/less/common.less';

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
    // justify-content: space-between;
    // align-items: center;
    // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding-bottom: 20px;

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
</style>