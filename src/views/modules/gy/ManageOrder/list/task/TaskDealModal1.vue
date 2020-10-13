<template>
  <!--style="width: calc(100% - 100px); height: calc(100% - 55px);"-->
  <!-- 弹出框 -->
  <a-modal
    :title="title"
    :visible="visible"
    width="100%"
    destroyOnClose
    :bodyStyle="bodyStyle"
    style="top: 0px;"
    :footer="null"
    @cancel="handleModalCancel">
    <a-row>
      <div style="text-align: left;margin-top: 5px;font-size: 18px;margin-left: 180px;display: flex;">
        <div style="width: 250px">
          <span>创建人：</span>{{onedata.processApplyUserName}}
        </div>
        <div style="width: 350px">
          <span>流程发起时间：</span>{{onedata.taskBeginTime}}
        </div>
        <div style="width: 250px">
          <span>当前环节：</span>{{onedata.taskName}}
        </div>
      </div>
    </a-row>
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
            <iframe id="ifrmae" :src="iframeUrl" frameborder="0" width="100%" :height="height"
                    scrolling="auto"></iframe>
          </template>
        </div>
        <div style="bottom: 24px;position: fixed;width: 91%;padding: 10px;z-index:10;background:rgb(244,244,244)">
          <!-- 处理意见 -->
          <div style="width: 100%;margin-bottom: 5px">
            <a-col :md="8" :sm="12">
              <div style="margin-bottom: 5px">
                处理意见：
                <a-select style="width: 300px" placeholder="常用审批语" :getPopupContainer="(target) => target.parentNode"
                          @change="handleChangeSelect">
                  <a-icon slot="suffixIcon" type="smile"/>
                  <a-select-option v-for="(item, key) in remarksDictOptions" :key="key" :value="item.value">{{ item.text
                    }}
                  </a-select-option>
                </a-select>
              </div>
            </a-col>
            <a-textarea rows="3" v-model="model.reason"/>
          </div>
          <!-- 流转按钮 -->
          <div style="text-align:center;">
            <template v-if="model.processModel==1">
              <template v-for="(item) in resultObj.transitionList">
                <a-button type="primary" @click="handleProcessComplete(item.nextnode)" :key="item.nextnode">{{
                  item.Transition }}
                </a-button>
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
  import { initDictOptions } from '@/components/dict/JDictSelectUtil'
  import DynamicLink from './form/DynamicLink.vue';
  import { isURL } from '@/utils/validate'
  import { ACCESS_TOKEN } from '@/store/mutation-types'

  export default {
    name: 'TaskDealModal1',
    components: {
      DynamicLink,
      TaskModule,
      ProcessModule
    },
    props: ['path', 'formData'],
    computed: {
      isComp: function () {
        this.model.taskId = this.formData.taskId
        this.getProcessTaskTransInfo(this.formData)
        var TOKEN = Vue.ls.get(ACCESS_TOKEN);
        var DOMAIN_URL = window._CONFIG['domianURL'];
        var TASKID = this.formData.taskDefKey;
        var URL = (this.path || '').replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2)); // URL支持{{ window.xxx }}占位符变量
        // console.log("isComp组件名称：",URL);
        if (isURL(URL)) {
          this.iframeUrl = URL;
          return false;
        }
        return true;
      }
    },
    watch: {
      // iframeUrl: function (newVal,oldVal) {
      //   if (newVal) {
      //     this.$message.warning(newVal)
      //     setTimeOut(() => {this.hiddenButtom()},1000)
      //   }
      // }
    },
    data() {
      return {
        remarksDictOptions: [],
        onedata: {},
        lczt: '',
        url: {
          getProcessTaskTransInfo: '/act/task/getProcessTaskTransInfo',
          processComplete: '/act/task/processComplete',
          upload: window._CONFIG['domianURL'] + '/sys/common/upload'
        },
        loading: false,
        title: '流程',
        visible: false,
        bodyStyle: {
          padding: '0',
          height: (window.innerHeight - 80) + 'px',
          'overflow-y': 'auto'
        },
        height: (window.innerHeight - 220) + 'px',
        iframeUrl: '',
        resultObj: {
          transitionList: []
        },
        model: {
          taskId: '',
          nextnode: '',
          nextCodeCount: '',
          reason: '',
          processModel: 1,
          rejectModelNode: '',
          nextUserName: '',
          nextUserId: '',
          ccUserIds: '',
          ccUserRealNames: '',
          fileList: '',
        }
      }
    },
    created() {
      // alert('111')
    },
    methods: {
      // 隐藏表单中提交
      // hiddenButtom () {
      //   window.setTimeout(() => {
      //     var iframe = document.getElementById('ifrmae');//获取那个iframe，也可以bai用$('#iframe')[0]替代
      //     var iframeWindow = iframe.contentWindow;//获取iframe里的duwindow对象
      //     var ifr_document = iframe.contentWindow.document;//iframe中的文档内容
      //     var bList = ifr_document.getElementsByClassName('el-button--small')
      //     bList[0].style.visibility = 'hidden'
      //   }, 800)
      // },
      // 关闭模态框
      handleModalCancel() {
        this.visible = false
      },
      handleChangeSelect(value) {
        this.model.reason = value;
      },
      deal(record) {
        console.log(record)
        this.onedata = record
        this.lczt = this.getState(record.bpmStatus, record);
        this.visible = true;
        //初始化字典 - 常用语
        initDictOptions('approval_remarks').then((res) => {
          if (res.success) {
            this.remarksDictOptions = res.result;
          }
        });
      },
      getState(text, record) {
        if (!text && record.endTime) {
          return '已完成';
        }
        switch (text) {
          case '1':
            return '待提交';
          case '2':
            return '处理中';
          case '3':
            return '已完成';
          case 'rejectProcess':
            return '已驳回';
          case 'callBackProcess':
            return '已取回';
          case 'invalidProcess':
            return '已作废';
        }
        return text;
      },
      completeProcess() {
        this.visible = false;
        this.$emit('ok');
        // this.searchQuery()
      },
      getProcessTaskTransInfo(formData) {
        var params = { taskId: formData.taskId };//查询条件
        this.loading = true;
        getAction(this.url.getProcessTaskTransInfo, params).then((res) => {
          if (res.success) {
            console.log('流程流转信息', res);
            this.resultObj = res.result;
          }
          this.loading = false;
        }).finally(() => {
          this.loading = false;
        })
      },
      handleProcessComplete(nextnode) {
        const that = this;
        var iframe = document.getElementById('ifrmae');//获取那个iframe，也可以bai用$('#iframe')[0]替代
        var iframeWindow = iframe.contentWindow;//获取iframe里的duwindow对象
        var ifr_document = iframe.contentWindow.document;//iframe中的文档内容
        var bList = ifr_document.getElementsByClassName('el-button--small')
        bList[bList.length - 1].click()
        if (!this.model.reason || this.model.reason.length == 0) {
          this.model.reason = '同意'
        }
        if (nextnode) {
          this.model.nextnode = nextnode;
        }
        var method = 'post';
        // this.$confirm({
        //   title: "提示",
        //   content: "确认提交审批吗?",
        //   onOk: function(){
        that.loading = true;
        that.model.fileList = JSON.stringify(that.fileList)
        httpAction(that.url.processComplete, that.model, method).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            // that.$emit('complete');
            that.completeProcess()
          } else {
            that.$message.warning(res.message);
          }
        }).finally(() => {
          that.loading = false;
          //that.close();
        })
        //   }
        // });
      }
    }

  }
</script>

<style lang="less" scoped>
  .ant-tabs-left-content {
    padding-top: 10px !important;
  }

  .component_div {
    margin-top: 5px;
    // margin-bottom: 155px;
  }
</style>