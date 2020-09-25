<template>
  <div class="from-table">
    <!--<a-table rowKey="value" :columns="columns" :data-source="data" :pagination="false" bordered>
      <template
        v-for="col in dataList"
        :slot="col"
        slot-scope="text, record, index"
      >
        <div :key="col" v-if="record.isCol">
          <a-input
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, index, col)"
          />
        </div>
        <div :key="col" v-else>
          <template>
            {{ text }}
          </template>
        </div>
      </template>
      <div
        slot="filterDropdown"
        style="padding: 8px;border: 0"
        @click="edit"
      >
      </div>
      <a-icon
        slot="filterIcon"
        slot-scope="filtered"
        type="search"
        :style="{ color: filtered ? '#108ee9' : undefined }"
      />
      <template slot="operation" slot-scope="text, record, index">
        <div class="editable-row-operations" v-if="record.isCol">
        <span v-if="record.isCol">
          <a-button @click="() => save(record.key)"> 提交 </a-button>
          <a-button @click="() => cancel(index)" style="margin-left: 10px;"> 删除 </a-button>
        </span>
        </div>
      </template>
    </a-table>-->
    <div style="padding-top: 15px;">
      <a-timeline>
        <template v-for="(itemC, index) in dataList">
          <a-timeline-item v-if="index=== dataList.length-1" color="green" style="color: #42bf42">
            <template v-for="(val, key, index) in itemC">
              <span v-if="list[index].label ==='时间'">{{list[index].label}}：<span style="color: #42bf42">【{{val}}】</span></span>
              <span style="margin-left: 15px;"
                    v-else-if="list[index].label ==='提交人'">{{list[index].label}}：{{val}}</span>
              <p v-else>{{list[index].label}}： {{val}}</p>
            </template>
          </a-timeline-item>
          <a-timeline-item v-else>
            <template v-for="(val, key, index) in itemC">
              <span v-if="list[index].label ==='时间'">{{list[index].label}}：<span style="color: #218af4">【{{val}}】</span></span>
              <span style="margin-left: 15px;" v-else-if="list[index].label ==='提交人'">{{list[index].label}}：{{val}}</span>
              <p v-else>{{list[index].label}}： {{val}}</p>
            </template>
          </a-timeline-item>
        </template>
      </a-timeline>
    </div>
    <div v-if="!item.disabled">
      <a-button @click="() => edit()" type="primary" :disabled="item.disabled">提交反馈</a-button>
    </div>
    <!-- <div style="margin-top: 15px;">
       <a-carousel :dot-position="dotPosition" :dots="false" autoplay>
         <div style="text-align: left;padding: 5px 10px; font-size: 12px;" @click="checkFlow">
           <div>
             <div style="float: left">
               反馈时间：
             </div>
             <div style="float: left">
               2020-09-11 14:30:21
             </div>
           </div>
           <div style="clear: both;display: flex;margin-top: 5px;">
             <div style="display: inline-block;
             vertical-align: middle;width: 50px;padding-top: 5px;">
               <img src="../../../assets/flowImg.png" style="height: 35px;width: 35px;"/>
             </div>
             <div style="display: inline-block;">
               <div style="color: #4099ff">名称：左宏波</div>
               <div>内容：维修完成测试数据周五测试完成了</div>
             </div>
           </div>
         </div>
         <div style="text-align: left;padding: 5px 10px; font-size: 12px;" @click="checkFlow">
           <div>
             <div style="float: left">
               反馈时间：
             </div>
             <div style="float: left">
               2020-09-11 14:30:21
             </div>
           </div>
           <div style="clear: both;display: flex;margin-top: 5px;">
             <div style="display: inline-block;
             vertical-align: middle;width: 50px;padding-top: 5px;">
               <img src="../../../assets/flowImg.png" style="height: 35px;width: 35px;"/>
             </div>
             <div style="display: inline-block;">
               <div style="color: #4099ff">名称：左宏波</div>
               <div>内容：维修完成测试数据周五测试完成了</div>
             </div>
           </div>
         </div>
         <div style="text-align: left;padding: 5px 10px; font-size: 12px;" @click="checkFlow">
           <div>
             <div style="float: left">
               反馈时间：
             </div>
             <div style="float: left">
               2020-09-11 14:30:21
             </div>
           </div>
           <div style="clear: both;display: flex;margin-top: 5px;">
             <div style="display: inline-block;
             vertical-align: middle;width: 50px;padding-top: 5px;">
               <img src="../../../assets/flowImg.png" style="height: 35px;width: 35px;"/>
             </div>
             <div style="display: inline-block;">
               <div style="color: #4099ff">名称：左宏波</div>
               <div>内容：测试呀测试呀测试呀</div>
             </div>
           </div>
         </div>
         <div style="text-align: left;padding: 5px 10px; font-size: 12px;" @click="checkFlow">
           <div>
             <div style="float: left">
               反馈时间：
             </div>
             <div style="float: left">
               2020-09-10 14:30:21
             </div>
           </div>
           <div style="clear: both;display: flex;margin-top: 5px;">
             <div style="display: inline-block;
             vertical-align: middle;width: 50px;padding-top: 5px;">
               <img src="../../../assets/flowImg.png" style="height: 35px;width: 35px;"/>
             </div>
             <div style="display: inline-block;">
               <div style="color: #4099ff">名称：刘芷含</div>
               <div>内容：测试数据完成测试99999</div>
             </div>
           </div>
         </div>
         &lt;!&ndash; <div><h3>2</h3></div>
          <div><h3>3</h3></div>
          <div><h3>4</h3></div>&ndash;&gt;
       </a-carousel>
     </div>-->
    <a-modal v-model="visible" title="" ok-text="确认" cancel-text="取消" @ok="hideModal">
      <a-form-model ref="ruleForm" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row :gutter="24" style="margin-bottom: 0">    
          <a-col :xl="24" :lg="24" :md="24" :sm="24">
            <a-form-model-item label="内容" prop="description">            
              <a-textarea placeholder="请输入内容" v-model="description" :rows="4"/>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { getSelectTime } from '../../../utils/util'
import { updateTickets } from '../../../api/tickets'
import { mapGetters } from 'vuex'

export default {
  name: 'From-Table',
  props: ['item', 'value'],
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        xl: { span: 24 },
        lg: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        xl: { span: 24 },
        lg: { span: 17 }
      },
      valueTable: this.value,
      data: [],
      columns: [],
      dataList: [],
      list: [],
      searchText: '',
      description: '',
      searchInput: null,
      visible: false,
      searchedColumn: '',
      dotPosition: 'right'
    }
  },
  watch: {
    // 页面不刷新，监听值的变化，重新绑定数据
    value(newVal, oldVal) {
      if (newVal === '') {
        this.valueTable = []
      }
      this.dataList = newVal
      console.log(this.dataList)
    },
    'item.conf.params': function(newValue) {
      this.list = newValue
    }
  },
  mounted () {
    this.list = this.item.conf.params
    if (this.value === '') {
      this.dataList  = []
      return
    }
    this.dataList = this.value
  },
  methods: {
    edit () {
      this.visible = true
    },
    ...mapGetters(['userInfo']),
    cancel (index) {
      const newData = [...this.data]
      newData.splice(index, 1)
      this.data = newData
    },
    hideModal () {
      // console.log(this.userInfo())
      let departName = localStorage.getItem('departName') ? localStorage.getItem('departName') : ''
     /* let sgdw = localStorage.getItem('sgdw')
      if (!sgdw.includes(departName)) {
        sgdw = sgdw + '，' + departName
      }*/
      let lcObj = {}
      this.list.forEach((item) => {
        if (item.label === '时间') {
          item.description = getSelectTime(new Date(), true)
        } else if (item.label === '提交人') {
          let username = this.userInfo().username ? this.userInfo().username : ''
          let telephone = this.userInfo().phone ? '(' + this.userInfo().phone + ')' : ''
          if (departName) {
            item.description = username + telephone + '，' + departName
          } else {
            item.description = username + telephone
          }
        } else {
          item.description = this.description
        }
        lcObj[item.value] = item.description
      })
      this.dataList.push(lcObj)
      let data = {
        form: {
          fkjl: this.dataList,
          orderSate: 'yfk'
        },
        ticket_id: sessionStorage.getItem('tickedId')
      }
      let apiKey = this.userInfo().apikey
      updateTickets(data, apiKey).then(response => {
        this.$message.success('提交成功')
        this.description = ''
        this.visible = false
        this.$emit('input', this.dataList)
        this.$emit('onChange', this.dataList)
      }).catch(error => {
        console.log(error)
      })
    },
  }
}
</script>
<style>
  .from-table .ant-timeline-item-last > .ant-timeline-item-content {
    min-height: 0;
  }

  .from-table .ant-timeline-item {
    padding: 0 0 10px;
  }
</style>