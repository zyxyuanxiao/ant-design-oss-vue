<template>
  <a-card :bordered="false">
    <a-card >
      <a-card-grid v-for="data in typeList" :key="data.id" style="width:25%;text-align:center" @click="start(data)">
        {{data.procName}}
      </a-card-grid>
    </a-card>
    <auto-desform-data-modal ref="desformModal" :dialogOptions="dialogOptions"  @added="handleDesformDataAdded"></auto-desform-data-modal>
  </a-card>
</template>

<script>
  import { httpAction, postAction, getAction } from '@/api/manage'
  import AutoDesformDataModal from "./process/AutoDesformDataModal.vue"
  export default {
    name: "CreateProcessInstance",
    components: {
     AutoDesformDataModal
    },
    created () {
      this.initList()
    },
    data() {
      return {
        description: '发起流程',
        mode: 'add',
        dataId: null,
        desform: {},
        typeList: [],
        flowCodePre:"desform_",
        dialogOptions: { top: 60, width: 1000, padding: { top: 25, right: 25, bottom: 30, left: 25 } },
        // 查询条件
        queryParam: {},
        taskId:"",
        url: {
          list: "/act/process/lists",
          start: "/act/process/start_",
          roleDegisnList: "/designform/designFormCommuse/roleDegisnList",
          queryByCode: '/desform/queryByCode',
          add: '/process/extActDesignFlowData/add',
          startProcess: "/process/extActProcess/startDesFormMutilProcess"
        }
      }
    },
    computed: {
      fullScreenProps() {
        let props = {
          height: null,
          modalWidth: this.modalWidth,
          style: { top: '40px' },
          bodyStyle: { padding: '0' }
        }
        let { dialogOptions: options } = this
        if (options != null) {
          if (!this.fullScreen) {
            props.modalWidth = options.width + 'px'
          }
          props.style.top = options.top + 'px'
          let { top, right, bottom, left } = options.padding
          props.bodyStyle = { padding: `${top}px ${right}px ${bottom}px ${left}px` }
        }
        if (this.forceFullScreen) {
          props.height = '100vh'
          props.style.top = '0px'
          props.modalWidth = '100%'
        }
        return props
      }
    },
    methods: {
      initList(){
        // httpAction(this.url.list, {}, "GET").then((data) => {
        //   console.log(data)
        //   this.typeList = data.result
        // })
        httpAction(this.url.roleDegisnList, {}, "GET").then((data) => {
          console.log(data)
          this.typeList = data.result
        })
      },
      queryByCode (data) {
        var title = "表单【"+data.desformName+"】发起申请"
        var mode = 'add'
        var desform = data
        var dataId = null
        getAction(this.url.queryByCode, {
          desformCode: data.desformCode
        }).then(res => {
          if (res.success) {
            let designJson = res.result.desformDesignJson;
            let json = JSON.parse(designJson)
            // 保存 dialogConfig
            let dialogOptions = json.config.dialogOptions
            if (dialogOptions) {
              this.dialogOptions = dialogOptions
            }
            this.$refs.desformModal.open(mode, desform, dataId, title)
          }

        })
      },
      start (pa) {
        var that = this
        this.$confirm({
          title: '提示',
          content: '确认同步'+pa.desformName+'吗?',
          onOk: function(){
            getAction(that.url.start+pa.desformCode, {
              'desformCode': pa.desformCode,
              'id': pa.id,
              'desformName': pa.desformName
              }).then((data) => {
              console.log(data)
              // this.typeList = data.result.records
            })
          }
        });
      },
      handleSuccess(event) {
        if (this.dataId == null) {
          this.$emit('added', { desform: this.desform, dataId: event.dataId })
        } else {
          this.$emit('edited', { desform: this.desform, dataId: this.dataId })
        }
        this.close()
      },
      handleDialogChange(data) {
        this.forceFullScreen = data
      },
      /** 流程数据保存成功后触发该事件 */
      handleDesformDataAdded(event) {
        // 将流程保存至后台
        let { desform, dataId } = event;
        this.loading = true;
        httpAction(this.url.add, {
          desformId: desform.id,
          desformCode: desform.desformCode,
          desformDataId: dataId,
          desformName: desform.desformName,
          processName: desform.procName,
          flowCode: this.flowCodePre+desform.desformCode,
          titleExp: desform.titleExp
        }, 'POST').then(res => {
          if (!res.success) {
            this.$message.error(res.message);
            return;
          }
          this.startDesFormProcess(desform, event.desformDataJson, res.result)
          // this.$router.push({ path: '/extbpm/process/ExtActDesignFlowDataList'})
        })
      },
      startDesFormProcess (record, desformDataJson, id){ 
        var jsonData = desformDataJson;
        var param = {
          flowCode:this.flowCodePre+record.desformCode,
          id: id,
          formUrl:"{{DOMAIN_URL}}/desform/detail/"+record.desformCode+"/${BPM_DES_DATA_ID}?token={{TOKEN}}&taskId={{TASKID}}",
          formUrlMobile:"{{DOMAIN_URL}}/desform/detail/"+record.desformCode+"/${BPM_DES_DATA_ID}?token={{TOKEN}}&taskId={{TASKID}}",
          jsonData:jsonData,
        }
        postAction(this.url.startProcess,param).then((res)=>{
          if(res.success){
            this.$message.success(res.message);
            this.loadData();
            this.onClearSelected();
          }else{
            this.$message.warning(res.message);
          }
        }).finally(() => this.loading = false)
      }
    }
  }
</script>
<style scoped>
  .ant-card-body .table-operator {
    margin-bottom: 18px;
  }

  .ant-table-tbody .ant-table-row td {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .anty-row-operator button {
    margin: 0 5px
  }

  .ant-btn-danger {
    background-color: #ffffff
  }

  .ant-modal-cust-warp {
    height: 100%
  }

  .ant-modal-cust-warp .ant-modal-body {
    height: calc(100% - 110px) !important;
    overflow-y: auto
  }

  .ant-modal-cust-warp .ant-modal-content {
    height: 90% !important;
    overflow-y: hidden
  }
</style>
