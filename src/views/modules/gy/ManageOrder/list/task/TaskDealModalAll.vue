<template>
  <!--style="width: calc(100% - 100px); height: calc(100% - 55px);"-->
  <!-- 弹出框 -->
  <a-modal
    :title="title"
    :visible="visible"
    width="30%"
    heigth="40%"
    destroyOnClose
    :bodyStyle="bodyStyle"
    style="top: 20%;bottom:20%"
    :footer="null"
    @cancel="handleModalCancel">

    <a-tab>

      <div style="width: 100%;padding: 10px;z-index:10;background:rgb(244,244,244)">
        <!-- 处理意见 -->
        <div style="width: 100%;margin-bottom: 5px">
          <a-col :md="8" :sm="12">
            <div style="margin-bottom: 5px">
              处理意见：
              <a-select style="width: 100%" placeholder="常用审批语" :getPopupContainer="(target) => target.parentNode"
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
            <a-button type="primary">确认提交</a-button>
          </template>
        </div>
      </div>
    </a-tab>
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
  import { postAction } from '../../../../../../api/manage';

  export default {
    name: 'TaskDealModalAll',
    components: {
      DynamicLink,
      TaskModule,
      ProcessModule
    },
    // computed: {
    //   isComp: function () {
    //     this.model.taskId = this.formData.taskId
    //     this.getProcessTaskTransInfo(this.formData)
    //     var TOKEN = Vue.ls.get(ACCESS_TOKEN);
    //     var DOMAIN_URL = window._CONFIG['domianURL'];
    //     var TASKID = this.formData.taskDefKey;
    //     var URL = (this.path || '').replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2)); // URL支持{{ window.xxx }}占位符变量
    //     // console.log("isComp组件名称：",URL);
    //     if (isURL(URL)) {
    //       this.iframeUrl = URL;
    //       return false;
    //     }
    //     return true;
    //   }
    // },
    // watch: {
    //   // iframeUrl: function (newVal,oldVal) {
    //   //   if (newVal) {
    //   //     this.$message.warning(newVal)
    //   //     setTimeOut(() => {this.hiddenButtom()},1000)
    //   //   }
    //   // }
    // },
    data() {
      return {
        remarksDictOptions: [],
        url: {
          getProcessTaskTransInfo: '/act/task/getProcessTaskTransInfo',
          processCompleteAll: '/moreFilter/completeAll',
          upload: window._CONFIG['domianURL'] + '/sys/common/upload'
        },
        loading: false,
        title: '批量办理流程',
        visible: false,
        bodyStyle: {
          padding: '0',
          height: 40 + '%',
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
          ids: []
        },
        ids: []
      }
    },
    created() {
      // alert('111')
    },
    methods: {
      handleModalCancel() {
        this.visible = false
      },
      handleChangeSelect(value) {
        this.model.reason = value;
      },
      deal(ids) {
        this.visible = true;
        //初始化字典 - 常用语
        initDictOptions('approval_remarks').then((res) => {
          if (res.success) {
            this.remarksDictOptions = res.result;
          }
        });
        this.ids = ids;
        console.log('ids=' + ids)
      },
      completeProcess() {
        this.visible = false;
        this.$emit('ok');
        // this.searchQuery()
      },
      getProcessTaskTransInfo(taskId) {
        var params = { taskId: taskId };//查询条件
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
        // const that = this;
        // var iframe = document.getElementById('ifrmae');//获取那个iframe，也可以bai用$('#iframe')[0]替代
        // var iframeWindow = iframe.contentWindow;//获取iframe里的duwindow对象
        // var ifr_document = iframe.contentWindow.document;//iframe中的文档内容
        // var bList = ifr_document.getElementsByClassName('el-button--small')
        // bList[bList.length - 1].click()

        this.model.fileList = JSON.stringify(this.fileList)
        if (!this.model.reason || this.model.reason.length == 0) {
          this.model.reason = '同意'
        }
        if (nextnode) {
          this.model.nextnode = nextnode;
        }

        this.model.ids = this.ids

        postAction(this.model.processCompleteAll, this.model).then((res) => {
          if (res.result.success > 0) {
            this.$message.success('已成功办理' + res.result.success + '条流程工单')
          }
        })

        // for (let i = 0; i < that.ids.length; i++) {
        //   this.model.taskId = that.ids[i];
        //   var method = 'post';
        //   // this.$confirm({
        //   //   title: "提示",
        //   //   content: "确认提交审批吗?",
        //   //   onOk: function(){
        //
        //   that.model.fileList = JSON.stringify(that.fileList)
        //   httpAction(that.url.processComplete, that.model, method).then((res) => {
        //     if (res.success) {
        //       counts.push(that.ids[i])
        //       console.log(counts)
        //     }
        //   }).finally(() => {
        //     //that.close();
        //   })
        // }

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