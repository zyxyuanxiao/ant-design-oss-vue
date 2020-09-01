<template>
  <div class="j-super-query-box">
    <slot
      name="button"
      :isActive="superQueryFlag"
      :isMobile="izMobile"
      :open="handleOpen"
      :reset="handleReset"
    >
      <a-tooltip v-if="superQueryFlag" v-bind="tooltipProps" :mouseLeaveDelay="0.2">
        <!-- begin 不知道为什么不加上这段代码就无法生效 -->
        <span v-show="false">{{tooltipProps}}</span>
        <!-- end 不知道为什么不加上这段代码就无法生效 -->
       
        <a-button-group>
          <a-button type="primary" @click="handleOpen">
            <a-icon type="appstore" theme="twoTone" spin />
            <span>高级查询</span>
          </a-button>
          <a-button v-if="izMobile" type="primary" icon="delete" @click="handleReset" />
        </a-button-group>
      </a-tooltip>
      <a-button v-else type="primary" icon="filter" @click="handleOpen">高级查询</a-button>
    </slot>

    <j-modal
      title="高级查询"
      width="40%"
      :visible="visible"
      @cancel="handleCancel"
      :mask="false"
      :fullscreen="izMobile"
      class="j-super-query-modal"
      style="top:5%;max-height: 95%;"
    >
      <template slot="footer">
        <div style="float: left">
          <a-button :loading="loading" @click="handleReset">重置</a-button>
        </div>
        <a-button :loading="loading" @click="handleCancel">关闭</a-button>
        <a-button :loading="loading" type="primary" @click="handleOk">保存</a-button>
      </template>

      <a-spin :spinning="loading">
        <a-row>
          <a-col :sm="20" :md="24-2">
            <a-empty v-if="queryParamsModel.length === 0" style="margin-bottom: 12px;">
              <div slot="description">
                <span>没有任何查询条件</span>
                <a-divider type="vertical" />
                <a @click="handleAdd">点击新增</a>
              </div>
            </a-empty>

            <a-form v-else layout="inline">
              <a-row
                type="flex"
                style="margin-bottom:10px"
                :gutter="16"
                v-for="(item, index) in queryParamsModel"
                :key="index"
              >
                <a-col :md="10" :xs="12" style="margin-bottom: 12px;">
                  <a-tree-select
                    v-model="item.field"
                    :treeData="fieldTreeData"
                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                    placeholder="选择查询字段"
                    allowClear
                    treeDefaultExpandAll
                    :getPopupContainer="node=>node.parentNode"
                    style="width: 100%"
                    @select="(val,option)=>handleSelected(option,item)"
                  ></a-tree-select>
                </a-col>

                <a-col :md="8" :xs="24" style="margin-bottom: 12px;">
                <a-select
                  v-if="item.options instanceof Array"
                  v-model="item.val"
                  :options="item.options"
                  allowClear
                  placeholder="请选择"
                  :mode="allowMultiple(item)?'multiple':''"
                />
               
                <a-input v-else v-model="item.val" placeholder="请输入值"/>
              </a-col>

                <a-col :md="4" :xs="0" style="margin-bottom: 12px;">
                  <a-button @click="handleAdd" icon="plus"></a-button>&nbsp;
                  <a-button @click="handleDel( index )" icon="minus"></a-button>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
        </a-row>
      </a-spin>
    </j-modal>
  </div>
</template>

<script>
import moment from 'moment'
import * as utils from '@/utils/util'

import JSelectDepart from '@/components/jeecgbiz/JSelectDepart'
import JSelectMultiUser from '@/components/jeecgbiz/JSelectMultiUser'
import JMultiSelectTag from '@/components/dict/JMultiSelectTag'
import JAreaLinkage from '@comp/jeecg/JAreaLinkage'

export default {
  name: 'SuperQuery',

  components: { JAreaLinkage, JMultiSelectTag, JSelectDepart, JSelectMultiUser },
  props: {
    fieldList: {
      type: Array,
      required: true,
    },
    /*
     * 这个回调函数接收一个数组参数 即查询条件
     * */
    callback: {
      type: String,
      required: false,
      default: 'handleSuperQuery',
    },
    // 当前是否在加载中
    loading: {
      type: Boolean,
      default: false,
    },

    // 保存查询条件的唯一 code，通过该 code 区分
    // 默认为 null，代表以当前路由全路径为区分Code
    saveCode: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      moment,
      fieldTreeData: [],
      visible: false,
      queryParamsModel: [],
      treeIcon: <a-icon type="file-text" />,
      // 保存查询条件的treeData
      saveTreeData: [],
      // 保存查询条件的前缀名
      saveCodeBefore: 'JSuperQuerySaved_',
      // 查询类型，过滤条件匹配（and、or）
      matchType: 'and',
      superQueryFlag: false,
      querys:[]
    }
  },
  computed: {
    izMobile() {
      return this.device === 'mobile'
    },
    tooltipProps() {
      return this.izMobile ? { visible: false } : {}
    },
    fullSaveCode() {
      let saveCode = this.saveCode
      if (saveCode == null || saveCode === '') {
        saveCode = this.$route.fullPath
      }
      return this.saveCodeBefore + saveCode
    },
  },
  watch: {
    // 当 saveCode 变化时，重新查询已保存的条件
    fullSaveCode: {
      immediate: true,
      handler() {
        let list = this.$ls.get(this.fullSaveCode)
        if (list instanceof Array) {
          this.saveTreeData = list.map((i) => this.renderSaveTreeData(i))
        }
      },
    },
    fieldList: {
      deep: true,
      immediate: true,
      handler(val) {
        let mainData = [],
          subData = []
        val.forEach((item) => {
          let data = { ...item }
          data.label = data.label || data.text
          let hasChildren = data.children instanceof Array
          data.disabled = hasChildren
          data.selectable = !hasChildren
          if (hasChildren) {
            data.children = data.children.map((item2) => {
              let child = { ...item2 }
              child.label = child.label || child.text
              child.label = data.label + '-' + child.label
              child.value = data.value + ',' + child.value
              child.val = ''
              return child
            })
            data.val = ''
            subData.push(data)
          } else {
            mainData.push(data)
          }
        })
        this.fieldTreeData = mainData.concat(subData)
      },
    },
  },

  methods: {
    show() {
      if (!this.queryParamsModel || this.queryParamsModel.length === 0) {
        this.resetLine()
      }
      this.visible = true
    },
    handleOk() {
      if (!this.isNullArray(this.queryParamsModel)) {
        let event = {
          matchType: this.matchType,
          params: this.removeEmptyObject(this.queryParamsModel),
        }
        this.visible = false
        this.emitCallback(event)
      } else {
        this.$message.warn('查询条件不能为空')
      }
    },
    emitCallback(event = {}) {
      let { params = [], matchType = this.matchType } = event
      this.superQueryFlag = params && params.length > 0
      for (let param of params) {
        if (Array.isArray(param.val)) {
          param.val = param.val.join(',')
        }
      }
      
      this.querys = [];
      for (let i = 0; i < params.length; i++) {
        let name = params[i].field
        let value = params[i].val
        let newObj = { name: name, value: value }
        this.querys.push(newObj)
      }

      console.log(this.querys)

      

      // console.debug('---高级查询参数--->', { params, matchType })
      // this.$emit(this.callback, params, matchType)
    },
    getValue () {
      return this.querys
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleAdd() {
      this.addNewLine()
    },
    addNewLine() {
      this.queryParamsModel.push({ rule: 'eq' })
    },
    resetLine() {
      this.superQueryFlag = false
      this.queryParamsModel = []
      this.addNewLine()
    },
    handleDel(index) {
      this.queryParamsModel.splice(index, 1)
    },
    handleSelected(node, item) {
      let { type, options, dictCode, dictTable, customReturnField, popup } = node.dataRef
      item['type'] = type
      item['options'] = options
      item['dictCode'] = dictCode
      item['dictTable'] = dictTable
      item['customReturnField'] = customReturnField
      if (popup) {
        item['popup'] = popup
      }
      this.$set(item, 'val', undefined)
    },
    handleOpen() {
      this.show()
    },
    handleReset() {
      this.resetLine()
      this.emitCallback()
    },

    handleTreeSelect(idx, event) {
      if (event.selectedNodes[0]) {
        let { matchType, records } = event.selectedNodes[0].data.props
        // 将保存的matchType取出，兼容旧数据，如果没有保存就还是使用原来的
        this.matchType = matchType || this.matchType
        this.queryParamsModel = utils.cloneObject(records)
      }
    },


    isNullArray(array) {
      //判断是不是空数组对象
      if (!array || array.length === 0) {
        return true
      }
      if (array.length === 1) {
        let obj = array[0]
        if (!obj.field || obj.val == null || obj.val === '' || !obj.rule) {
          return true
        }
      }
      return false
    },
    // 去掉数组中的空对象
    removeEmptyObject(arr) {
      let array = utils.cloneObject(arr)
      for (let i = 0; i < array.length; i++) {
        let item = array[i]
        if (item == null || Object.keys(item).length <= 0) {
          array.splice(i--, 1)
        } else {
          if (Array.isArray(item.options)) {
            // 如果有字典属性，就不需要保存 options 了
            if (item.dictCode) {
              // 去掉特殊属性
              delete item.options
            }
          }
        }
      }
      return array
    },

    /** 渲染保存查询条件的 title（加个删除按钮） */
    renderSaveTreeData(item) {
      item.icon = this.treeIcon
      item.originTitle = item['title']
      item.title = (arg1, arg2) => {
        let vNode
        // 兼容旧版的Antdv
        if (arg1.dataRef) {
          vNode = arg1
        } else if (arg2.dataRef) {
          vNode = arg2
        } else {
          return <span style="color:red;">Antdv版本不支持</span>
        }
        let { originTitle } = vNode.dataRef
        return (
          <div class="j-history-tree-title">
            <span>{originTitle}</span>

            <div class="j-history-tree-title-closer" onClick={(e) => this.handleRemoveSaveTreeItem(e, vNode)}>
              <a-icon type="close-circle" />
            </div>
          </div>
        )
      }
      return item
    },

    /** 判断是否允许多选 */
    allowMultiple(item) {
      return item.rule === 'in'
    },

    handleRuleChange(item, newValue) {
      let oldValue = item.rule
      this.$set(item, 'rule', newValue)
      // 上一个规则是否是 in，且type是字典或下拉
      if (oldValue === 'in') {
        if (item.dictCode || item.options instanceof Array) {
          let value = item.val
          if (typeof item.val === 'string') {
            value = item.val.split(',')[0]
          } else if (Array.isArray(item.val)) {
            value = item.val[0]
          }
          this.$set(item, 'val', value)
        }
      }
    },

    handleChangeJPopup(item, e, values) {
      item.val = values[item.popup['destFields']]
    },
  },
}
</script>

<style lang="less" scoped>
.j-super-query-box {
  display: inline-block;
}

.j-super-query-modal {
  .j-super-query-history-card {
    /deep/ .ant-card-body,
    /deep/ .ant-card-head-title {
      padding: 0;
    }

    /deep/ .ant-card-head {
      padding: 4px 8px;
      min-height: initial;
    }
  }

  .j-super-query-history-empty {
    /deep/ .ant-empty-image {
      height: 80px;
      line-height: 80px;
      margin-bottom: 0;
    }

    /deep/ img {
      width: 80px;
      height: 65px;
    }

    /deep/ .ant-empty-description {
      color: #afafaf;
      margin: 8px 0;
    }
  }

  .j-super-query-history-tree {
    .j-history-tree-title {
      width: calc(100% - 24px);
      position: relative;
      display: inline-block;

      &-closer {
        color: #999999;
        position: absolute;
        top: 0;
        right: 0;
        width: 24px;
        height: 24px;
        text-align: center;
        opacity: 0;
        transition: opacity 0.3s, color 0.3s;

        &:hover {
          color: #666666;
        }

        &:active {
          color: #333333;
        }
      }

      &:hover {
        .j-history-tree-title-closer {
          opacity: 1;
        }
      }
    }

    /deep/ .ant-tree-switcher {
      display: none;
    }

    /deep/ .ant-tree-node-content-wrapper {
      width: 100%;
    }
  }
}
</style>