<template>
  <a-card :bordered="false">
     <!-- 操作按钮区域 -->
    <div class="table-page-search-wrapper" style="width:80%">
      <a-form layout="inline">
        <a-row :gutter="24">


          <!-- 报修流程 -->
          <a-col :md="6" :sm="8">

            <a-form-item label="报修流程">
              <a-select v-model="queryParam.processName"  style="width: 100%" placeholder="请选择报修流程" >
                <a-select-option v-for="type in typeList" :key="type.procName"   @click=codeChange(type.desformCode)>
                  {{ type.procName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>


          <!-- 年份 -->
          <a-col :md="6" :sm="8">

            <a-form-item label="年份">
              <a-select v-model="queryParam.year"  style="width: 100%" placeholder="请选择年份" >
                <a-select-option v-for="type in years" :key="type.year" @click="yearChange(type.year)">
                  {{ type.year }}年
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>


          <!-- 月份 -->
          <a-col :md="6" :sm="8">

            <a-form-item label="月份">
              <a-select v-model="queryParam.monthName"  style="width: 100%" placeholder="请选择月份" >
               <a-select-option v-for="type in months" :key="type.name"  @click="monthChange(type.month)">
                  {{ type.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>


          <a-col :md="6" :sm="8">
            <span style="float: right;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" style="margin-left: 8px" icon="reload" >重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

<!-- table区域 -->
<div style="margin-top:30px">


      <a-table
        ref="table"
        size="middle"
        bordered
        
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :loading="loading"
        :pagination="pagination"
        style="width:40%;"

        class="j-table-force-nowrap"
        @change="handleTableChange"
        >


      </a-table>



    </div>



    <!-- 条形图 -->
    <line-chart-multid style="width:80%;margin-top:60px" title="流程统计报表" :fields="fields"  :height="420"  :dataSource="dataA"/>



  </a-card>


</template>

<script>
  import { httpAction, postAction, getAction } from '@/api/manage'
  import LineChartMultid from '@/components/chart/LineChartMultid'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import Axios from 'axios'
  import { BpmNodeInfoMixin } from '@/views/modules/bpm/mixins/BpmNodeInfoMixin'


  export default {
    mixins: [JeecgListMixin, BpmNodeInfoMixin],
    name: "MocKups",
    components: {
      LineChartMultid,
      
    },

    data () {
      return {
       
        pagination:{},
        path: 'modules/bpm/task/form/FormLoading',
        queryParam:{
        },
        dataSource:[],
        fields:[],
        queryParam: {},
        dataA: [],
        typeList: [],
        years:[],
        months:[{name:'全部',month:"0"} ,{name:'1月',month:"1"},{name:'2月',month:"2"},{name:'3月',month:"3"},{name:'4月',month:"4"},{name:'5月',month:"5"},{name:'6月',month:"6"},
        {name:'7月',month:"7"},{name:'8月',month:"8"},{name:'9月',month:"9"},{name:'10月',month:"10"},{name:'11月',month:"11"},{name:'12月',month:"12"}],
        description: '流程统计',
        // 表头
        url: {
          list: '/act/task/getStatusTable',
          roleDegisnList: "/designform/designFormCommuse/roleDegisnList"
        },

        columns: [
         {
            title:'维保公司',
            align:"center",
            dataIndex: 'company'
          },
          {
            title:'工作总量（小时）',
            align:"center",
            dataIndex: 'workload'
          }
        ]

      }
    },
    created() {
      
      this.pagination.hideOnSinglePage = true;
      this.searchReset();
      this.initList();
      this.getYears();
    },

    methods: {
      yearChange(year){
         this.$forceUpdate();
      },

     

      getYears(){
        let yy = new Date().getFullYear();
        
        for(let index = 2010; index <= yy; index++) {
          let newObj = {year:index}
          this.years.push(newObj)
        }
        
      },

      monthChange(month){
        this.queryParam.month = month;
        this.$forceUpdate();
      },
      initList(){
        httpAction(this.url.roleDegisnList, {}, "GET").then((data) => {
          console.log(data)
          this.typeList = data.result
        })
      },

      searchReset(){
        let year = new Date().getFullYear(); 
        this.queryParam.month = 0
        this.queryParam.monthName = '全部'
        this.queryParam.year = year
        this.queryParam.code = 'gy_rke'
        this.queryParam.processName = '门禁制卡'
        this.searchQuery(this.queryParam)

      },

      searchQuery(){
        getAction(this.url.list,this.queryParam,"GET").then((data)=>{
          this.dataSource = data.result.dataSource;
          this.fields = data.result.fields;
          this.dataA = data.result.dataA;
        })
        var code = this.queryParam.code;
        if(code == 'gy_repairo'||code == 'gy_rme_arraignment'){
                  this.columns = [ {
                    title:'维保公司',
                    align:"center",
                    dataIndex: 'company'
                  },
                  {
                    title:'工作总量（小时）',
                    align:"center",
                    dataIndex: 'workload'
                  }]
        }else if(code == 'gy_patrol'||code == 'gy_fypatrol'){
                  this.columns = [
                    {
                    title:'巡检公司',
                    align:"center",
                    dataIndex: 'company'
                  },
                  {
                    title:'工作总量（小时）',
                    align:"center",
                    dataIndex: 'workload'
                  }]
        }else{
                  this.columns = [
                  {
                    title:'工作总量（小时）',
                    align:"center",
                    dataIndex: 'workload'
                  }]
        }
      },

      codeChange(code){
        this.queryParam.code = code;
        this.$forceUpdate();
      }

    }
  }

</script>
