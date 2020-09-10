<template>
  <div class="hardDick">
    <a-drawer :title="'NVRIP：' + detailRow.ip + ' ' + '硬盘数量：' + detailRow.jpbh"
              :maskClosable="true"
              width="70%"
              placement="right"
              :headerStyle="{background:'#1890FF',color:'#ffffff'}"
              :bodyStyle="{padding:'10px'}"
              :closable="false"
              @close="handleCancel"
              :visible="visible"
              style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;color: white">
      <div>
        <div class="search">
          <a-select default-value="all" style="width: 20%" @change="handleChange">
            <a-select-option value="all">
              全部
            </a-select-option>
            <a-select-option value="online">
              在线
            </a-select-option>
            <a-select-option value="offline">
              离线
            </a-select-option>
          </a-select>
          <a-button type="primary"
                    style="margin-left: 15px;"
                    @click="searchQuery"
                    icon="search">查询
          </a-button>
        </div>

        <div>
          <a-table ref="table"
                   size="middle"
                   :rowKey="record => record.devcode"
                   :columns="columns"
                   :dataSource="dataSource"
                   :pagination="ipagination"
                   :loading="loading"
                   @change="handleTableChange"
                   class="j-table-force-nowrap">
            <template slot="onlinestatus"
                      slot-scope="text, record">
            </template>
          </a-table>
        </div>
      </div>
    </a-drawer>
  </div>
</template>
<script>

import { postAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JSuperQuery from '@/components/jeecg/JSuperQuery'

export default {
  name: 'HardDiskDrawer',
  components: {},
  mixins: [JeecgListMixin],
  props: {
    detailRow: {
      required: true
    }
  },
  data () {
    return {
      modalWidth: 800,
      visible: false,
      url: {
        list: '/api/video/view/list',
      },
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          align: 'center',
          key: 'name'
        },
        {
          title: '型号',
          dataIndex: 'ip',
          align: 'center',
          key: 'ip'
        },
        {
          title: '盘符',
          dataIndex: 'jpbh',
          align: 'center',
          key: 'jpbh'
        },
        {
          title: '总容量(TB)',
          dataIndex: 'dept',
          align: 'center',
          key: 'dept'
        },
        {
          title: '剩余容量(GB)',
          dataIndex: 'funtype',
          align: 'center',
          key: 'funtype'
        },
        {
          title: '硬盘状态',
          dataIndex: 'onlinestatus',
          align: 'center',
          key: 'onlinestatus',
          scopedSlots: { customRender: 'onlinestatus' }
        },
        {
          title: '获取时间',
          dataIndex: 'streamstatus',
          align: 'center',
          key: 'streamstatus',
          scopedSlots: { customRender: 'streamstatus' }
        }
      ],
      onlineLabel: [],
      onlineData: [],
      streamLabel: [],
      streamData: [],
      imgLabel: [],
      imgDate: []
    }
  },
  mounted () {

  },
  methods: {
    handleCancel () {
      this.visible = false
    },
    toggleScreen () {

    },
    searchQuery () {

    },
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    callback (key) {
      console.log(key)
    },
    getOnlineStatus () {
      postAction(this.url.metricQuery, this.onlineMetricForm).then(res => {
        if (res.success) {
          this.onlineLabel = res.result.label
          this.onlineData = res.result.value
          this.onlineMetricForm.tags.object = []
        }
      })
    },
    getStreamStatus () {
      postAction(this.url.metricQuery, this.streamMetricForm).then(res => {
        if (res.success) {
          this.streamLabel = res.result.label
          this.streamData = res.result.value
          this.streamMetricForm.tags.object = []
        }
      })
    },
    getimgStatus () {
      postAction(this.url.metricQuery, this.imgMetricForm).then(res => {
        if (res.success) {
          this.imgLabel = res.result.label
          this.imgData = res.result.value
          this.imgMetricForm.tags.object = []
        }
      })
    }
  }
}
</script>
<style lang="less">
  .devinfo div {
    display: inline-block;
    padding: 5px 10px;
  }

  .devinfotitel {
    padding: 5px 10px;
  }

  .search {
    padding: 10px 0px;
  }

  .search span {
    padding: 0px 10px;
  }

  .ant-drawer-right .ant-drawer-title {
    color: white;
  }
</style>