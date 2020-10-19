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
    <a-card>

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
    </a-card>
  </a-modal>
</template>

<script>

  import Vue from 'vue'
  import TaskModule from './form/TaskModule'
  import ProcessModule from './form/ProcessModule'
  import { getAction, postAction } from '@/api/manage'
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
    data() {
      return {
        remarksDictOptions: [],
        url: {
          getProcessTaskTransInfo: '/act/task/getProcessTaskTransInfo',
          processComplete: '/moreFilter/completeAll',
          upload: window._CONFIG['domianURL'] + '/sys/common/upload'
        },
        loading: false,
        title: '流程办理',
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
          fileList: ''
        },
        taskIds: []
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
      deal(ids) {
        this.visible = true;
        //初始化字典 - 常用语
        initDictOptions('approval_remarks').then((res) => {
          if (res.success) {
            this.remarksDictOptions = res.result;
          }
        });
        this.taskIds = ids;
        console.log('taskIds=' + this.taskIds)
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
        const that = this;
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
        let models = []
        for (let i = 0; i < this.taskIds.length; i++) {
          let model = {
            taskId: this.taskIds[i],
            nextnode: this.model.nextnode,
            nextCodeCount: this.model.nextCodeCount,
            reason: this.model.reason,
            processModel: this.model.processModel,
            rejectModelNode: this.model.rejectModelNode,
            nextUserName: this.model.nextUserName,
            nextUserId: this.model.nextUserId,
            ccUserIds: this.model.ccUserIds,
            ccUserRealNames: this.model.ccUserRealNames,
            fileList: this.model.fileList
          }
          models.push(model)
        }
        console.log(models)
        postAction(this.url.processComplete, models).then((res) => {
          if (res.success) {
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
          this.completeProcess();
        })
        // httpAction(that.url.processComplete, that.model, method).then((res) => {
        //   if (res.success) {
        //     that.$message.success(res.message);
        //     // that.$emit('complete');
        //     that.completeProcess()
        //   } else {
        //     that.$message.warning(res.message);
        //   }
        // }).finally(() => {
        //   that.loading = false;
        //   //that.close();
        // })
        // //   }
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