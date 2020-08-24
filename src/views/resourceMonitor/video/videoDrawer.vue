<template>
  <div class="body">
    <a-drawer :title="detailRow.name"
              :maskClosable="true"
              width="60%"
              placement="right"
              :headerStyle="{background:'#1890FF',color:'#ffffff'}"
              :bodyStyle="{padding:'10px'}"
              :closable="false"
              @close="handleCancel"
              :visible="visible"
              style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
      <div>
        <div class="devinfotitel">摄像机信息<span>&nbsp;&nbsp;{{ detailRow.onlinestatus | onlineStatus}}</span></div>
        <div class="devinfo">
          <div>国标编号: &nbsp;&nbsp;{{detailRow.devcode}}</div>
          <div>IP地址:&nbsp;&nbsp;{{ detailRow.ip}}</div>
          <div>归属单位:&nbsp;&nbsp;{{detailRow.dept}}</div>
        </div>
        <div class="search">
          <a-range-picker @change="onChange" />
          <a-button type="primary"
                    @click="searchQuery"
                    icon="search">查询</a-button>
        </div>

        <div>
          <a-tabs defaultActiveKey="1"
                  @change="callback">
            <a-tab-pane tab="状态统计"
                        key="1">
              <a-card :bordered="false"
                      title="在线状态"
                      :style="{ marginTop: '24px' }">
                <div id="myChart"
                     ref="myChart"
                     :style="{width: '800px', height: '200px'}">

                </div>
              </a-card>

            </a-tab-pane>
            <a-tab-pane tab="告警列表"
                        key="2"></a-tab-pane>
            <a-tab-pane tab="工单记录"
                        key="3"></a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import Vue from 'vue'
import { postAction } from '@/api/manage'

export default {
  components: {
  },
  watch: {
    detailRow (newVal) {
      if (newVal != null) {
        this.$nextTick(function () {
          this.metricForm.tags.object.push(newVal.cid)
          this.getOnlineStatus()
          setTimeout(() => {
            this.onlineLine();
          }, 1000);
        });
      }
    }
  },
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
        metricQuery: '/api/video/view/metric_query'
      },
      metricForm: {
        metric: 'img_online_status',
        tags: { object: [] },
        start: 1597420800000,
      },
      onlineLabel: [],
      onlineData: []
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
    onChange (date, dateString) {
      console.log(date, dateString);
    },
    searchQuery () {

    },
    callback (key) {
      console.log(key)
    },
    onlineLine () {
      let myChart = this.$echarts.init(this.$refs.myChart)
      // 绘制图表
      myChart.setOption({
        xAxis: {
          type: 'category',
          data: this.onlineLabel
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: this.onlineData,
          type: 'line',
          smooth: true
        }]
      });
    },
    getOnlineStatus () {
      this.metricForm.metric = 'img_online_status'
      postAction(this.url.metricQuery, this.metricForm).then(res => {
        if (res.success) {
          this.onlineLabel = res.result.label
          this.onlineData = res.result.value
          this.metricForm.tags.object = []
        }
      })
    }
  },
  filters: {
    onlineStatus (val) {
      if (val == 0) {
        return '离线'
      } else {
        return '在线'
      }
    }
  }
}
</script>
<style lang="less" scoped>
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
</style>