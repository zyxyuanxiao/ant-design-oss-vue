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
            <!--<a-button @click="handleAddBpm" icon="to-top">导入</a-button>-->
            <a-button @click="handleExportXls('工单报表')" icon="vertical-align-bottom">导出</a-button>
          </a-button-group>
        </div>
      </div>
      <div class="form-query" v-show="toggleSearchStatus">
        <a-form-model ref="ruleForm" :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row :gutter="24" style="margin-bottom: 0">    
            <a-col :xl="6" :lg="8" :md="8" :sm="24">
              <a-form-model-item label="相机品牌" prop="xjpp">            
                <a-input placeholder="请输入相机品牌" v-model="formData.xjpp"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :xl="6" :lg="8" :md="8" :sm="24">
              <a-form-model-item label="项目名称" prop="wxxmmc">            
                <a-input placeholder="请输入项目名称" v-model="formData.wxxmmc"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :xl="6" :lg="8" :md="8" :sm="24">
              <a-form-model-item label="签收公司" prop="qsgs">            
                <a-input placeholder="请输入签收公司" v-model="formData.qsgs"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :xl="6" :lg="8" :md="8" :sm="24">
              <a-form-model-item label="签收人" prop="qsr">            
                <a-input placeholder="请输入签收人" v-model="formData.qsr"></a-input>
              </a-form-model-item>
            </a-col>
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
              <a-form-model-item label="工单状态" prop="orderSate">           
                <a-select
                  showSearch
                  mode="multiple"
                  :options="CONST.ORDERSTATELIST"
                  :filterOption="filterOption"
                  v-model="formData.orderSate"
                  placeholder="请选择工单状态"
                  allowClear
                />
              </a-form-model-item>
            </a-col>
            <!--<a-col :xl="6" :lg="8" :md="8" :sm="24">
              <a-form-model-item label="设备编码" prop="deviceid">
                <a-input placeholder="请输入设备编码" v-model="formData.deviceid"></a-input>
              </a-form-model-item>
            </a-col>-->
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
              <a-form-model-item label="工单类型" prop="gdfl">
                <a-select
                  showSearch
                  mode="multiple"
                  :options="CONST.ORDERTYPELIST"
                  :filterOption="filterOption"
                  v-model="formData.gdfl"
                  placeholder="请选择工单类型"
                  allowClear
                />
              </a-form-model-item>
            </a-col>
            <a-col :xl="6" :lg="8" :md="8" :sm="24">
              <a-form-model-item label="逾期状态" prop="yqpd">
                <a-select
                  :options="CONST.OVERDUE"
                  :filterOption="filterOption"
                  v-model="formData.yqpd"
                  placeholder="请选择逾期状态"
                />
              </a-form-model-item>
            </a-col>
            <a-col :xl="6" :lg="8" :md="8" :sm="24">
              <a-form-model-item label="电信是否验收" prop="dxsfys">
                <a-select
                  :options="acceptanceList"
                  :filterOption="filterOption"
                  v-model="formData.dxsfys"
                  placeholder="请选择是否验收"
                />
              </a-form-model-item>
            </a-col>
            <a-col :xl="6" :lg="8" :md="8" :sm="24">
              <a-form-model-item label="是否魔改数" prop="sfmgs">
                <a-select
                  :options="magicList"
                  :filterOption="filterOption"
                  v-model="formData.sfmgs"
                  placeholder="请选择是否魔改数"
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
            <template slot="status" slot-scope="status">
              <a-tag v-if="item.value === status +''" :color="item.color"
                     v-for="item in CONST.ORDERSTATELIST"> {{item.label}}
              </a-tag>
            </template>
            <template slot="overdue" slot-scope="overdue">
              <a-tag v-if="item.value === overdue +''" :color="item.color"
                     v-for="item in CONST.OVERDUE"> {{item.label}}
              </a-tag>
            </template>
            <template slot="type" slot-scope="type">
              <span v-if="item.value === type +''" :color="item.color"
                    v-for="item in CONST.ORDERTYPELIST"> {{item.label}}
              </span>
            </template>
            <template slot="executors" slot-scope="executors, record">
              <j-ellipsis :value="getExecutors(executors)" :length="15"/>
            </template>
            <template slot="executionGroups" slot-scope="executionGroups, record">
              <j-ellipsis :value="getExecutionGroups(executionGroups)" :length="15"/>
            </template>
            <template slot="create_time" slot-scope="create_time">
              {{getLongTime(create_time, true)}}
            </template>
            <template slot="spendTime" slot-scope="spendTime">
              {{spendTime}}h
            </template>
            <template slot="action" slot-scope="text, record">
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
            </template>
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
          :save-show="saveShow"
          :reassign-show="reassignShow"
          :operation="operation"
          :spinnings="spinning"
          :spinningText="spinningText"
          :flow-list="flowList"
          v-if="operation === 'details'"
          @updateFeedback="updateOrder"
          @uploadFile="uploadFile"
          @signTickets="signTickets"
          @closeTickets="closeUpTickets"
          @reassignTickets="reassignChange"
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
      <a-modal v-model="visibleGp" title="工单改派" ok-text="确认" cancel-text="取消" @ok="reassignTickets">
        <a-form-model ref="ruleForm">
          <a-row :gutter="24">    
            <a-col :xl="24" :lg="24" :md="24" :sm="24">
              <a-form-model-item label="指定改派组" prop="description">
                <a-select v-model="groupId" placeholder="请选择用户组">
                  <a-select-option v-for="item in reassGroup" :key="item.id">
                    {{item.name}}
                  </a-select-option>
                </a-select>
                <!-- <a-input placeholder="请输入处理人" v-model="userName"/>-->
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-modal>
    </a-card>
  </div>
</template>

<script>
import {
  getTicketsList, getTicketsDetails, getModelList,
  getModelDetails, saveWorkOrder, handleOrder, updateTickets,updataDzOnlineStatus,
  uploadFileByTicketId, getTicketTodoCountByUser, getTicketsProcess, downTicketsFile,
  getMytodoList, getUserGroup, getTicketAllCountByUser, judgmentTickets, reassignOrder
} from '../../api/tickets'
import JEllipsis from '@/components/jeecg/JEllipsis'
import JDate from '@/components/jeecg/JDate.vue'
import TicketsFromFlow from '../../components/from-el/Tickets-From-Flow'
import TicketsForm from '../../components/from-el/Tickets-Form'
import TicketsModelType from './../tickets/modules/TicketsModelType'
import { getSelectTime } from '../../utils/util'
import { mapGetters } from 'vuex'
import moment from 'moment/moment'
import consts from '../../utils/consts'

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
      CONST: consts,
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
      visibleGp: false,
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
          title: '工单状态',
          align: 'center',
          width: 100,
          dataIndex: 'formData.orderSate',
          fixed: 'left',
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
          width: 170,
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
          width: 150,
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
          width: 150,
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
          title: '耗时',
          align: 'center',
          width: 80,
          dataIndex: 'spendTime',
          sorter: (a, b) => a.spendTime - b.spendTime,
          scopedSlots: { customRender: 'spendTime' }
        },
        {
          title: '逾期状态',
          align: 'center',
          width: 110,
          dataIndex: 'formData.yqpd',
          scopedSlots: { customRender: 'overdue' }
        },
        {
          title: '当前流程环节',
          align: 'center',
          width: 150,
          dataIndex: 'activityName'
        },
        {
          title: '操作',
          width: 130,
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
        gdfl: [],
        yqpd: undefined,
        bxlx: [],
        IP: '',
        dd: '',
        orderSate: [],
        gddj: [],
        xjpp: '',
        wxxmmc: '',
        qsgs: '',
        qsr: '',
        dxsfys: undefined,
        sfmgs: undefined
      },
      formFileds: [],
      acceptanceList: [
        {
          'label': '是',
          'value': 'yes'
        },
        {
          'label': '否',
          'value': 'no'
        }
      ],
      magicList: [
        {
          'label': '是',
          'value': 'yes'
        },
        {
          'label': '否',
          'value': 'no'
        }
      ],
      repairsTypeList: [
        {
          value: 'zdbx',
          label: '自动报修'
        },
        {
          value: 'rgbx',
          label: '人工报修'
        },
        {
          value: 'dsfdj',
          label: '第三方对接'
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
      spinningText: '',
      upFlag: false,
      spinningShow: false,
      saveShow: false,
      reassignShow: false,
      reassGroup: [],
      groupId: '',
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
      ip: '',
      // 保存当前登录人角色信息
      identity: '',
      // 保存当前登录人所在部门
      departName: '',
      // 保存当前登录人能看到的所有部门信息
      departRoleNames: ''
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
      // sungcor 判断在离线/图像 router_id   1e91970928454a0aaf70dfab60821e14
      // 宝山现场 判断在离线/图像 router_id  1bdaabd3e65e44e1b756fbc5bfcb708e
      if (item.route_id === this.CONST.ROUTER.wxwc && this.formVal.gzpd === 'lx') {
        this.judgmentTickets(item)
        return
      }
      // 公司 管理员审核 361876dfea2a4300a623bd5cbe7f813e
      // 现场 管理员审核 7243282c435646038fd42eb505a8afba
      if (this.orderInfo.activity_id === this.CONST.ACTIVITY.sh) {
        this.formVal.sfht = 'no'
      }
      // 公司 内场设备报备 bd5667bdfe384d978094e2c304fee4d2 || 外场设备报备 93dbe9df4a484c41ae3962583c8b79d2 || 工单回退 e015bd378b0c449eafbf07ad71ec867e
      // 现场 内场设备报备 0fa29993092d4908bdb8b12551b224bc || 外场设备报备 755dbdc2fbeb4d36807bc38ff0dbe019 || 工单回退 2d389949940d458ba3c97c55ae4f87b2
      if (item.route_id === this.CONST.ROUTER.ncbb || item.route_id === this.CONST.ROUTER.wcbb || item.route_id === this.CONST.ROUTER.gdht) {
        this.formVal.sfht = 'yes'
      }
      this.handleTickets(item)
    },
    saveTickets (item) {
      this.spinning = true
      this.spinningText = '正在创建中。。。'
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
      delete this.workForm.fjtp
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
    async handleTickets (item) {
      this.images = []
      this.spinning = true
      for (const itemB of this.formVal.fjtp) {
        if (!itemB.hasOwnProperty('url')) {
          let files = await this.getBase64(itemB)
          this.images.push(files)
        }
      }
      let handleRules = {
        route_id: item.route_id
      }
      if (item.nextActivityId) {
        handleRules.executors_groups = {
          [item.nextActivityId]: {}
        }
      }

      this.workForm = this.formVal
      delete this.workForm.fjtp
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
    updataDzOnlineStatus(ip){
      updataDzOnlineStatus(ip).then(response => {
      }).catch(error => {
        console.log(error)
      })
    },
    judgmentTickets (item) {
      this.spinning = true
      this.spinningText = '正在检测中。。。'
      judgmentTickets(this.ip).then(response => {
        if (response.result) {
          this.updataDzOnlineStatus(this.ip)
          this.formVal.gzwcpd = 'zx'
          this.handleTickets(item)
          return
        }
        this.spinning = false
        this.$message.error('检测失败，请重新填写数据！')

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
      delete this.workForm.fjtp
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
    updateTicketsInfo (form) {
      let data = {
        form: form,
        ticket_id: this.orderInfo.ticketId
      }
      let apiKey = this.userInfo().apikey
      updateTickets(data, apiKey).then(response => {
        this.$message.success('操作成功')
        this.visible = false
        this.visibleGp = false
        this.allotShow = true
        this.formFileds.forEach((itemA) => {
          this.$set(itemA, 'disabled', false)
        })
        this.getQueryTerms()
        this.getTicketsList()
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
      delete this.workForm.fjtp
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
      this.spinningText = ''
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
                this.orderInfo.files.forEach((item, indexA) => {
                  url = this.imgUrl + item
                  this.imgs.push({
                    url: url,
                    uid: indexA + (10 + 6),
                    name: 'image' + indexA + '.png',
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
          }
          this.reassGroup = this.reassignGroup()
          this.$set(this.formVal, itemA.code, itemA.conf.default_value)
          this.$set(this.formIndex, itemA.code, index)
        })
        this.getUserInfo(record.executionGroup, record.executor)
        this.ip = record.formData.IP
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
      this.spinningText = ''
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
    reassignChange () {
      this.groupId = ''
      this.visibleGp = true
      let groupObj = this.reassGroup.find(item => item.name === this.formVal.detd)
      if (groupObj) this.groupId = groupObj.id
    },
    signTickets () {
      let upData = {
        orderSate: 'wfk',
        qsr: this.userInfo().username,
        qsrlxdh: this.userInfo().phone,
        qsgs: this.departName,
        fxrz: this.departName
      }
      if (this.formVal.bxfl === 'zdbx' && this.formVal.gzpd === 'lx') {
        upData.shr = this.formVal.repairman
      }
      if (((Array.isArray(this.conductorGroup) && this.conductorGroup.length === 1) || (Array.isArray(this.conductor) && this.conductor.length === 1))) {
        this.updateTicketsInfo(upData)
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
        this.updateTicketsInfo(upData)
      }).catch(error => {
        console.log(error)
      })
    },
    reassignTickets () {
      let params = {
        ticket_id: this.orderInfo.ticketId,
        group: this.groupId,
        tache_id: this.orderInfo.activity_id
      }
      console.log(this.reassGroup.find((item) => item.id === this.groupId))
      let groupName = this.reassGroup.find((item) => item.id === this.groupId)
      let upDate = {
        fpgs: groupName.name,
        orderSate: 'wjs'
      }
      let apiKey = this.userInfo().apikey
      reassignOrder(params, apiKey).then(response => {
        this.updateTicketsInfo(upDate)
      }).catch(error => {
        console.log(error)
      })
    },
    closeUpTickets () {
      this.spinning = true
      let dataUp = {
        form: {
          orderSate: 'js'
        },
        ticket_id: this.orderInfo.ticketId
      }
      let apiKey = this.userInfo().apikey
      updateTickets(dataUp, apiKey).then(response => {
        this.closeTickets()
      }).catch(error => {
        console.log(error)
      })
    },
    closeTickets () {
      let data = {
        ticket_id: this.orderInfo.ticketId,
        activity_id: this.orderInfo.activity_id,
        handle_type: 2
      }
      let apiKey = this.userInfo().apikey
      handleOrder(data, apiKey).then(response => {
        this.$message.success('操作成功！')
        this.visible = false
        this.getQueryTerms()
        this.getTicketsList()
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
    ...mapGetters(['userInfo', 'rolesA', 'departs', 'departRole', 'reassignGroup']),
    getUserInfo (executionGroups, executors) {
      this.conductor = []
      this.conductorGroup = []
      let uyunId = this.userInfo().uyunid
      let rolesB = this.rolesA()
      // 公司 管理员审核 361876dfea2a4300a623bd5cbe7f813e
      // 现场 管理员审核 7243282c435646038fd42eb505a8afba
      if (this.orderInfo.activity_id === this.CONST.ACTIVITY.sh) {
        if (this.formVal.sfht === 'no') {
          // 公司 回退外场 a1a5eb72e88a44ddb710c784a3e54994
          // 现场 回退外场 a4ed84c27c544fea8d0967ad0de79d01
          this.submitBtn = this.submitBtn.filter((item) => item.route_id !== this.CONST.ROUTER.htwc)
        } else {
          // 公司 审核通过 0bd853dbe934403ba7d8d2efa41822e6
          // 现场 审核通过 83f70b3ec1e64e5ea3d6950b3eea61ab
          this.submitBtn = this.submitBtn.filter((item) => item.route_id !== this.CONST.ROUTER.shtg)
        }
      }
      let executor = undefined
      if (executors !== '' && executors != null && executors.length > 0) {
        executor = executors.find((item) => uyunId === item && this.formVal.orderSate !== 'js')
      }
      let executionGroup = []
      if (executionGroups != null && executionGroups.length > 0) {
        executionGroup = executionGroups.filter((item) => rolesB.indexOf(item) > -1 && this.formVal.orderSate !== 'js')
      }
      // 判断executionGroup为[]的情况
      if (Array.isArray(executionGroup) && executionGroup.length === 0) {
        executionGroup = undefined
      }
      // 判断工单状态为未签收并且是内场或者外场实施办理环节，如都满足则显示签收按钮
      // sungcor 内场 df6c26bedae34a7dae2396ec1dac14f5  外场 4ee67d3f2b2a4f65a73775e5525e3867
      // 宝山现场  内场 8cba08cbb2514352ae75f5f324c91cb0  外场 aecd9044de5448a3bccbc0cdaad36041
      this.allotShow = !(this.formVal.orderSate === 'wjs' && (this.orderInfo.activity_id === this.CONST.ACTIVITY.wc || this.orderInfo.activity_id === this.CONST.ACTIVITY.nc))
      this.isPermission = executor || executionGroup
      // sungcor  361876dfea2a4300a623bd5cbe7f813e || 4ee67d3f2b2a4f65a73775e5525e3867
      // 宝山现场   7243282c435646038fd42eb505a8afba || aecd9044de5448a3bccbc0cdaad36041
      this.saveShow = this.isPermission && this.orderInfo.activity_id === this.CONST.ACTIVITY.sh
      this.reassignShow = this.isPermission && this.orderInfo.activity_id === this.CONST.ACTIVITY.wc
      let isEdit = this.isPermission ? !this.allotShow : true
      this.formFileds.forEach((itemA) => {
        this.$set(itemA, 'disabled', isEdit)
      })
      // 判断故障完成判断 存在 并且 故障判断值为 质量  则故障完成判断 显示图像
      if (this.formVal.hasOwnProperty('gzwcpd')) {
        this.formVal.gzwcpd = this.formVal.gzpd === 'zl' ? 'tx' : this.formVal.gzwcpd
      }
      // 分派公司默认赋值 第一阶梯填写值
      if (this.formVal.hasOwnProperty('fpgs')) {
        this.formVal.fpgs = this.formVal.fpgs ? this.formVal.fpgs : this.formVal.dytd
      }
      this.conductor = executors
      this.conductorGroup = executionGroups
    },
    getTicketTodoCountByUser () {
      let data = {
        userid: this.userInfo().uyunid,
        roleid: [this.rolesA()[0]]
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
      let data = {
        userid: this.userInfo().uyunid,
        roleid: [this.rolesA()[0]],
        roleName: this.departRoleNames
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
    searchCondition () {
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
    },
    searchQuery () {
      this.getQueryTerms()
      this.searchCondition()
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
    handleExportXls (fileName) {
      if (!fileName || typeof fileName != 'string') {
        fileName = '导出文件'
      }
      this.getQueryTerms()
      this.searchCondition()
      console.log('导出参数', this.data)
      downTicketsFile(this.data).then((data) => {
        if (!data) {
          this.$message.warning('文件下载失败')
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data], { type: 'application/vnd.ms-excel' }), fileName + '.xls')
        } else {
          let url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' }))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName + '.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) //下载完成移除元素
          window.URL.revokeObjectURL(url) //释放掉blob对象
        }
      })
    },
    getQueryTerms () {
      let departId = this.userInfo().departIds ? this.userInfo().departIds : []
      let departIds = this.departs()
      let departObj = departIds.filter((item) => departId.indexOf(item.id) > -1)
      let departName = ''
      if ((Array.isArray(departObj) && departObj.length > 0) && departObj) {
        departName = departObj[0].departName
      }
      this.departName = departName // 保存部门名称在统计时使用
      localStorage.setItem('departName', this.departName)
      let departRole = this.departRole()
      let departRoleNames = []
      departRole.forEach(item => {
        departRoleNames.push(item.name)
      })
      this.departRoleNames = departRoleNames
      if (this.activeKey === '1') {
        let dataArr = []
        dataArr = [
          {
            field: 'status',
            value: [1, 2],
            operator: 'in'
          }
        ]
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
        this.data.conditions = dataArr
        this.data.ass = dataArr2
      } else {
        let dataArr = []
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
              },
              {
                field: 'participation',
                value: [this.userInfo().uyunid],
                operator: 'in'
              },
              {
                field: 'formData.fpgs',
                value: departRoleNames,
                operator: 'in'
              }
            ]
          }
        ]
        this.data.conditions = dataArr
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
    },
    getBase64 (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    }
  },
  created () {
    // this.getUserGroup()
  },
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