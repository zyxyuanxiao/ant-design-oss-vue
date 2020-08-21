<template>
  <div>
    <a-table rowKey="value" :columns="columns" :data-source="data" :pagination="false" bordered>
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
    </a-table>
    <div style="margin-top: 15px;" v-if="!item.disabled">
      <a-button @click="() => edit()" type="primary" :disabled="item.disabled">增加</a-button>
      <a-button @click="() => save()" type="primary" :disabled="item.disabled" style="margin-left: 10px;"> 提交</a-button>
    </div>
  </div>
</template>

<script>
import { getSelectTime } from '../../../utils/util'
import { updateFeedback } from '../../../api/tickets'
import { mapGetters } from 'vuex'

export default {
  name: 'From-Table',
  props: ['item'],
  data () {
    return {
      data: [],
      columns: [],
      dataList: [],
      list: [],
      searchText: '',
      searchInput: null,
      searchedColumn: ''
    }
  },
  watch: {
    // 页面不刷新，监听值的变化，重新绑定数据
    'item.conf.default_value':function(newValue) {
      if(newValue === '') { this.item.conf.default_value = []}
      let data = this.item.conf.default_value
      this.data = data
    },
    'item.conf.params':function(newValue) {
      this.columns = []
      newValue.forEach((item) => {
        this.columns.push(
          {
            title: item.label,
            dataIndex: item.value,
            width: '25%',
            scopedSlots: { customRender: item.value }
          }
        )
        this.dataList.push(item.value)
      })
    }
  },
  mounted () {
    this.list = this.item.conf.params
    if (this.list) {
      this.list.forEach((item) => {
        this.columns.push(
          {
            title: item.label,
            dataIndex: item.value,
            width: '25%',
            scopedSlots: { customRender: item.value }
          }
        )
        this.dataList.push(item.value)
      })
    }
    if( this.item.conf.default_value === '') { this.item.conf.default_value = []}
    let data = this.item.conf.default_value
    this.data = data
  },
  methods: {
    handleChange (value, index, column) {
      const newData = [...this.data]
      newData[index][column] = value
      this.data = newData
    },
    edit () {
      const { count, data } = this
      let newData = {}
      this.list.forEach((item) => {
        newData[item.value] = item.label !== '时间' ? '' : getSelectTime(new Date(), true)
        newData.isCol = true
      })
      this.data = [...data, newData]
    },
    ...mapGetters(["userInfo"]),
    save () {
      this.data.forEach((item) => {
        let lcObj = {}
        if(item.isCol) {
          lcObj = item
          this.item.conf.default_value.push(lcObj)
        }
        delete item.isCol
      })
      let data = {
        form: {
          fkjl: this.item.conf.default_value
        },
        ticket_id: sessionStorage.getItem('tickedId')
      }
      let apiKey = this.userInfo().apikey
      updateFeedback(data, apiKey).then(response => {
        this.$message.success('提交成功')
        this.show = false
      }).catch(error => {
        console.log(error)
      })
    },
    cancel (index) {
      const newData = [...this.data]
      newData.splice(index, 1)
      this.data = newData
    }
  }
}
</script>
<style scoped>
  .editable-row-operations a {
    margin-right: 8px;
  }
</style>