<template>
  <div class="hardDick">
    <a-drawer :title="'NVRIP：' + detailRow.ip + ' ' + '硬盘数量：' + detailRow.count"
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
          <a-select v-model="queryParam.state" default-value="all" style="width: 20%" @change="handleChange">
            <a-select-option value="">
              全部
            </a-select-option>
            <a-select-option value="1">
              正常
            </a-select-option>
            <a-select-option value="0">
              异常
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
                   :rowKey="record => record.name"
                   :columns="columns"
                   :dataSource="dataSource"
                   :pagination="ipagination"
                   :loading="loading"
                   @change="handleTableChange"
                   class="j-table-force-nowrap">
            <template slot="state"
                      slot-scope="text, record">
              <img v-if="text === '1'" src="../../assets/spOnline.png" alt="">
              <img v-else src="../../assets/spOffline.png" alt="">
            </template>
            <template slot="size"
                      slot-scope="text, record">
              <span>{{converSize(text)}}</span>
            </template>
          </a-table>
        </div>
      </div>
    </a-drawer>
  </div>
</template>
<script>

import { getAction } from '@/api/manage'
import JSuperQuery from '@/components/jeecg/JSuperQuery'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

export default {
  name: 'HardDiskDrawer',
  mixins: [JeecgListMixin],
  components: {},
  props: {
    detailRow: {
      required: true
    }
  },
  watch: {
    detailRow (newVal) {
      if (newVal != null) {
        this.queryParam['ip'] = this.detailRow.ip
        this.loadData()
      }
    }
  },
  data () {
    return {
      modalWidth: 800,
      visible: false,
      url: {
        list: '/api/nvr/info/queryDetails'
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
          dataIndex: 'model',
          align: 'center',
          key: 'ip'
        },
        {
          title: '盘符',
          dataIndex: 'driveletter',
          align: 'center',
          key: 'driveletter'
        },
        {
          title: '总容量(TB)',
          dataIndex: 'size',
          align: 'center',
          key: 'size',
          scopedSlots: { customRender: 'size' }
        },
        {
          title: '剩余容量(GB)',
          dataIndex: 'sursize',
          align: 'center',
          key: 'sursize'
        },
        {
          title: '硬盘状态',
          dataIndex: 'state',
          align: 'center',
          key: 'state',
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '获取时间',
          dataIndex: 'time',
          align: 'center',
          key: 'time'
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
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    converSize (limit) {
      let size = ''
      if (limit < 0.1 * 1024) { //如果小于0.1KB转化成B
        size = limit.toFixed(2) + 'B'

      } else if (limit < 0.01 * 1024 * 1024) {//如果小于0.01MB转化成KB
        size = (limit / 1024).toFixed(2) + 'KB'

      } else if (limit < 0.01 * 1024 * 1024 * 1024) { //如果小于0.01GB转化成MB
        size = (limit / (1024 * 1024)).toFixed(2) + 'MB'

      } else if (limit < 0.01 * 1024 * 1024 * 1024 * 1024) { //如果小于0.01TB转化成GB
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB'

      } else { //其他转化成TB
        size = (limit / (1024 * 1024 * 1024 * 1024)).toFixed(2) + 'TB'
      }

      let sizeStr = size + ''
      let len = sizeStr.indexOf('\.')
      let dec = sizeStr.substr(len + 1, 2)
      if (dec === '00') {//当小数点后为00时 去掉小数部分
        return sizeStr.substring(0, len) + sizeStr.substr(len + 3, 2)
      }
      return sizeStr
    },
    callback (key) {
      console.log(key)
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