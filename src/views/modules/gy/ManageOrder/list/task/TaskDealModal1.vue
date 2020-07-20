<template>
    <!--style="width: calc(100% - 100px); height: calc(100% - 55px);"-->
    <!-- 弹出框 -->
    <a-modal
      :title="title"
      :visible="visible"
      width="100%"
      destroyOnClose
      :bodyStyle ="bodyStyle"
      style="top: 0px;"
      :footer="null"
      @cancel="handleModalCancel">
      <a-tabs defaultActiveKey="1" tabPosition="left">
        <a-tab-pane key="1">
          <span slot="tab">
            <a-icon type="file-text"/>
            <span>附加单据</span>
          </span>
          <div class="component_div">
            <template v-if="isComp">
              <dynamic-link :path="path" :formData="formData"></dynamic-link>
            </template>
            <template v-else>
              <iframe :src="iframeUrl" frameborder="0" width="100%" :height="height" scrolling="auto"></iframe>
            </template>
          </div>
          <div style="bottom:55px;position: fixed;width: 90%;padding: 10px;z-index:10;background:rgb(244,244,244)">
            <!-- 处理意见 -->
            <div style="width: 100%;margin-bottom: 5px">
              <div style="margin-bottom: 5px">
                处理意见：
                <a-select style="width: 300px" placeholder="常用审批语" :getPopupContainer = "(target) => target.parentNode" @change="handleChangeSelect">
                  <a-icon slot="suffixIcon" type="smile" />
                  <a-select-option v-for="(item, key) in remarksDictOptions" :key="key" :value="item.value">{{ item.text }}</a-select-option>
                </a-select>
              </div>
              <a-textarea rows="3" v-model="model.reason" />
            </div>
            <!-- 流转按钮 -->
            <div style="text-align:center;">
              <template v-if="model.processModel==1">
                <template v-for="(item) in resultObj.transitionList">
                  <a-button type="primary" @click="handleProcessComplete(item.nextnode)" :key="item.nextnode">{{ item.Transition }}</a-button>
                </template>
              </template>
              <template v-else>
                <a-button type="primary" @click="handleManyProcessComplete()">确认提交</a-button>
              </template>
            </div>
          </div>
        </a-tab-pane>

        <!-- <a-tab-pane key="2">
          <span slot="tab">
            <a-icon type="user"/>
            <span>任务处理</span>
          </span>
          <task-module :formData="formData" @complete = "completeProcess"></task-module>
        </a-tab-pane> -->

        <a-tab-pane key="3">
          <span slot="tab">
            <a-icon type="sliders"/>
            <span>流转记录</span>
          </span>
          <process-module :formData="formData"></process-module>
        </a-tab-pane>

      </a-tabs>
    </a-modal>
</template>

<script>

  import Vue from 'vue'
  import TaskModule from './form/TaskModule'
  import ProcessModule from './form/ProcessModule'
  import { getAction, httpAction } from '@/api/manage'
  import {initDictOptions} from '@/components/dict/JDictSelectUtil'
  import DynamicLink from "./form/DynamicLink.vue";
  import { isURL } from '@/utils/validate'
  import { ACCESS_TOKEN } from '@/store/mutation-types'

  export default {
    name: 'TaskDealModal1',
    components: {
      DynamicLink,
      TaskModule,
      ProcessModule
    },
    props: ['path','formData'],
    computed: {
      isComp: function () {
        console.log(this.formData)
        this.model.taskId = this.formData.taskId
        this.getProcessTaskTransInfo(this.formData)
        // console.log("isComp组件名称：",this.path);
        var TOKEN = Vue.ls.get(ACCESS_TOKEN);
        var DOMAIN_URL = window._CONFIG['domianURL'];
        var TASKID = this.formData.taskDefKey;
        var URL = (this.path|| '').replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2)); // URL支持{{ window.xxx }}占位符变量
        // console.log("isComp组件名称：",URL);
        if (isURL(URL)) {
          this.iframeUrl = URL;
          return false;
        }
        return true;
      }
    },
    data() {
      return {
        remarksDictOptions: [],
        url: {
          getProcessTaskTransInfo: '/act/task/getProcessTaskTransInfo',
          processComplete:'/act/task/processComplete',
          upload:window._CONFIG['domianURL']+"/sys/common/upload"
        },
        loading: false,
        title: "流程",
        visible: false,
        bodyStyle:{
          padding: "0",
          height:(window.innerHeight-80)+"px",
          "overflow-y":"auto"
        },
        height:(window.innerHeight-120)+"px",
        iframeUrl:"",
        resultObj:{
          transitionList: []
        },
        model:{
          taskId:"",
          nextnode:"",
          nextCodeCount:"",
          reason:"",
          processModel:1,
          rejectModelNode:"",
          nextUserName:"",
          nextUserId:"",
          ccUserIds:"",
          ccUserRealNames:"",
          fileList:"",
        }
      }
    },
    created() {
      console.log(111)
      // this.getProcessTaskTransInfo(this.formData)
    },
    methods: {
      // 关闭模态框
      handleModalCancel() {
        this.visible = false
      },
      handleChangeSelect (value) {
        this.model.reason = value;
      },
      deal(record){
        this.visible = true;
        // this.getProcessTaskTransInfo(this.formData)
        //初始化字典 - 常用语
        initDictOptions('approval_remarks').then((res) => {
          if (res.success) {
            this.remarksDictOptions = res.result;
          }
        });
      },
      completeProcess(){
        this.visible = false;
        this.$emit('ok');
      },
      getProcessTaskTransInfo(formData){
        var params = {taskId:formData.taskId};//查询条件
        this.loading = true;
        getAction(this.url.getProcessTaskTransInfo,params).then((res)=>{
          if(res.success){
            console.log("流程流转信息",res);
            this.resultObj = res.result;
          }
          this.loading = false;
        }).finally(() => {
          this.loading = false;
        })
      },
      handleProcessComplete (nextnode) {
        const that = this;
        if(!this.model.reason || this.model.reason.length==0){
          // this.$message.warning("请填写处理意见");
          // return
          this.model.reason = '同意'
        }
        if(nextnode){
          this.model.nextnode = nextnode;
        }
        console.log("流程办理数据：",this.model);
        var method = 'post';
        this.$confirm({
          title: "提示",
          content: "确认提交审批吗?",
          onOk: function(){
            that.loading = true;
            that.model.fileList = JSON.stringify(that.fileList)
            httpAction(that.url.processComplete,that.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                // that.$emit('complete');
                that.completeProcess()
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.loading = false;
              //that.close();
            })
          }
        });
      }
    }

  }
</script>

<style  lang="less" scoped>
.ant-tabs-left-content{
    padding-top: 10px !important;
  }
.component_div{
  margin-top: 5px;
  bottom: 55px;
}
</style>