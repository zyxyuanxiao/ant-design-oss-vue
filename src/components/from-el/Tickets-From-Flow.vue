<template>
  <div>
    <a-spin :spinning="spinnings" :tip="spinningText">
      <div style="display: flex">
        <div class="form-container" style="">
          <div style="" class="form-head" @click="isShowData()">
            <div class="header-left-icon"></div>
            <span style="margin-left: 8px">基本信息</span>
            <div style="text-align: right;float: right">
              <a-icon :type="isShow ?'down' : 'right'" class="work-detail-title-icon"/>
            </div>
          </div>
          <div style="padding-right: 25px;padding-top: 15px;height:655px;overflow-x: hidden" v-show="isShow">
            <a-form-model :model="formVal" ref="formVal" style="display: flex;flex-wrap:wrap">
              <a-form-model-item
                v-bind:class="[item.type === 'multiRowText' || item.type === 'table' || item.type === 'timeAxis' ||  item.type === 'attachfile' ? 'form-width-row': 'form-width']"
                :hidden="item.is_hidden"
                v-for="(item, index) in formFiles"
                :label="item.name"
                :label-col="item.type === 'multiRowText' || item.type === 'table'|| item.type === 'timeAxis' || item.type === 'attachfile' ?  labelCol : labelCol2"
                :prop="item.code"
                :key="item.code"
                :rules="{ required: item.is_required === 1,message: item.name + '不能为空',trigger: 'blur',}"
                :wrapper-col="item.type === 'multiRowText' || item.type === 'table' || item.type === 'timeAxis' ||  item.type === 'attachfile' ?  wrapperCol : wrapperCol2"
              >
                <text-test v-model="formVal[item.code]" :item="item" v-if="item.type === 'singleRowText'"
                           @onChange="onChangeText($event, item.code)"></text-test>
                <radio-test v-model="formVal[item.code]" :item="item"
                            v-else-if="item.type === 'singleSel'"></radio-test>
                <checkbox-test v-model="formVal[item.code]" :item="item"
                               v-else-if="item.type === 'multiSel'"></checkbox-test>
                <select-test v-model="formVal[item.code]" :item="item"
                             v-else-if="item.type === 'listSel'"></select-test>
                <time-test v-model="formVal[item.code]" :item="item" v-else-if="item.type === 'dateTime'"></time-test>
                <cascade-test v-model="formVal[item.code]" :item="item"
                              v-else-if="item.type === 'cascader'"></cascade-test>
                <tree-sel-test v-model="formVal[item.code]" :item="item"
                               v-else-if="item.type === 'treeSel'"></tree-sel-test>
                <integer-test v-model="formVal[item.code]" :item="item"
                              v-else-if="item.type === 'int'"></integer-test>
                <multi-row-test v-model="formVal[item.code]" :item="item"
                                v-else-if="item.type === 'multiRowText'"></multi-row-test>
                <attachfile-test v-model="formVal[item.code]" :item="item" v-else-if="item.type === 'attachfile'"
                                 @onUpLoad="onUpLoad"></attachfile-test>
                <decimals-test v-model="formVal[item.code]" :item="item"
                               v-else-if="item.type === 'double'"></decimals-test>
                <table-test v-model="formVal[item.code]" :item="item" v-else-if="item.type=== 'table'"
                ></table-test>
                <table-test @onChange="changeTable($event, item.code)" v-model="formVal[item.code]" :item="item"
                            v-else-if="item.type=== 'timeAxis'"
                ></table-test>
                <!--<dynamic-form-part-item
                  :items="item instanceof Array?item[1]:item">
                </dynamic-form-part-item>-->
              </a-form-model-item>
            </a-form-model>
          </div>
        </div>
        <div style="width: 35%;border: 1px solid #dee3ea;margin-left:20px;">
          <div style="background-color: #f4f7fd" class="form-head" @click="ShowFlow()">
            <div class="header-left-icon"></div>
            <span style="margin-left: 8px">流程信息</span>
            <div style="text-align: right;float: right">
              <a-icon :type="isShowFlow ?'down' : 'right'" class="work-detail-title-icon"/>
            </div>
          </div>
          <div style="padding-left: 25px;padding-top: 20px;height:655px;overflow-x: hidden" v-show="isShowFlow">
            <a-timeline>
              <template v-for="(itemC, index) in flowList">
                <a-timeline-item v-if="index===0" color="green" style="color: #42bf42">
                  <p>流程环节：<span style="color: #42bf42">【{{itemC.activityName}}】</span></p>
                  <p>处理人：{{itemC.exectorName}}</p>
                  <p>开始时间：{{itemC.exectorTime}}</p>
                  <p>事件：{{itemC.remark}}</p>
                  <p v-if="itemC.msg">留言：{{itemC.msg}}</p>
                </a-timeline-item>
                <a-timeline-item v-else>
                  <p>流程环节：<span style="color: #218af4">【{{itemC.activityName}}】</span></p>
                  <p>处理人：{{itemC.exectorName}}</p>
                  <p>开始时间：{{itemC.exectorTime}}</p>
                  <p>事件：{{itemC.remark}}</p>
                  <p v-if="itemC.msg">留言：{{itemC.msg}}</p>
                </a-timeline-item>
              </template>
            </a-timeline>
          </div>
        </div>
      </div>
      <div v-if="isPermission">
        <div style="display: flex;justify-content:center" v-show="allotShow">
          <div v-for="(item, index) in submitBtn" :key="index" style="padding: 15px 10px;">
            <a-button style="padding: 0 15px;height: 35px;"
                      type="primary"
                      @click="submitForm('formVal', item)"
            >
              {{item.btnName}}
            </a-button>
          </div>
          <!--<div style="padding: 15px 10px;" v-if="saveShow">
            <a-button type="primary" block @click="updateFeedback('formVal')">保存</a-button>
          </div>-->
          <!--v-if="operation === 'details'"-->
          <div style="padding: 15px 10px;" v-if="reassignShow">
            <a-button type="primary" block @click="handleChange()">改派工单</a-button>
          </div>
          <div style="padding: 15px 10px;" v-if="saveShow">
            <a-button type="primary" block @click="handleClose()">关闭工单</a-button>
          </div>
          <!--<div style="padding: 15px 10px;" v-show="allotShow">
            <a-select style="width: 80px;height: 35px;" placeholder="更多" @change="handleChange">
              <a-select-option value="reassign">
                改派
              </a-select-option>
              <a-select-option value="putUp">
                挂起
              </a-select-option>
            </a-select>
          </div>-->
        </div>
        <div style="display: flex;justify-content:center" v-show="!allotShow">
          <div style="padding: 15px 10px;" v-if="operation === 'details'">
            <a-button type="primary" block @click="signTickets()">签收</a-button>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { FormModel } from 'ant-design-vue'
import DynamicFormPartItem from '../from-el/TicketsFromPartItem'
import textTest from './from-item/From-Text'
import selectTest from './from-item/From-Select'
import timeTest from './from-item/From-Date-Picker'
import treeSelTest from './from-item/From-Tree'
import checkboxTest from './from-item/From-Checkbox'
import cascadeTest from './from-item/From-Cascader'
import radioTest from './from-item/From-Radio'
import integerTest from './from-item/From-Number'
import multiRowTest from './from-item/From-Textarea'
import attachfileTest from './from-item/From-Upload'
import decimalsTest from './from-item/From-Decimals'
import tableTest from './from-item/From-Table'
import { mapGetters } from 'vuex'
import { reassignOrder } from '../../api/tickets'
import consts from '../../utils/consts'

export default {
  name: 'Tickets-From',
  props: ['formFiles', 'formVal', 'formIndex', 'submitBtn', 'spinningText',
    'allotShow', 'saveShow', 'reassignShow', 'operation', 'spinnings', 'flowList', 'isPermission'],
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      labelCol2: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      },
      wrapperCol2: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      typeList: ['multiRowText', 'table', 'attachfile'],
      isShow: true,
      isShowFlow: true,
      loading: false,
      visible: false,
      userName: '',
      groupId: '',
      CONST: consts,
    }
  },
  mounted () {
  },
  methods: {
    ...mapGetters(['userInfo']),
    submitForm (formName, item) {
      let self = this
      self.$refs[formName].validate(valid => {
        if (valid) {
          let fk = this.formVal.fkjl
          if (((Array.isArray(fk) && fk.length === 0) || fk === '') && !this.saveShow) {
            self.$message.error('反馈记录请填写完整！')
            return
          }
          // 判断如果是设备报备的话 将状态改成报备状态
          // suncor 93dbe9df4a484c41ae3962583c8b79d2 || bd5667bdfe384d978094e2c304fee4d2
          // 宝山现场 755dbdc2fbeb4d36807bc38ff0dbe019 || 0fa29993092d4908bdb8b12551b224bc
          if (item.route_id === this.CONST.ROUTER.wcbb || item.route_id === this.CONST.ROUTER.ncbb) {
            self.$confirm({
              title: '您确定需要报备吗?',
              onOk () {
                self.formVal.orderSate = 'bb'
                self.$emit('click', item)
              }
            })
            return
          }
          self.$emit('click', item)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleChange (value) {
      this.$emit('reassignTickets')
    },
    updateFeedback (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('updateFeedback', '')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    signTickets () {
      this.$emit('signTickets')
    },
    handleClose() {
      this.$emit('closeTickets')
    },
    onUpLoad (fileList) {
      this.$emit('uploadFile', fileList)
    },
    isShowData () {
      this.isShow = !this.isShow
    },
    ShowFlow () {
      this.isShowFlow = !this.isShowFlow
    },
    onChangeText (value, code) {
    },
    changeTable (value, code) {
      if (code === 'fkjl') {
        this.formVal.orderSate = 'yfk'
      }
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  },
  watch: {},
  components: {
    [FormModel.name]:
    FormModel,
    DynamicFormPartItem,
    textTest,
    selectTest,
    timeTest,
    treeSelTest,
    checkboxTest,
    cascadeTest,
    radioTest,
    integerTest,
    multiRowTest,
    attachfileTest,
    decimalsTest,
    tableTest
  }
}
</script>

<style lang="less" scoped>
  .form-container {
    width: 65%;
    border: 1px solid #dee3ea;
    height: 700px;
  }

  .form-width {
    width: 50%
  }

  .form-width-row {
    width: 100%
  }

  .form-head {
    padding: 10px;
    border-bottom: 1px solid #dee3ea;
    background-color: #f4f7fd;

    .header-left-icon {
      border: 1px solid #028dea;
      width: 5px;
      float: left;
      height: 20px;
      background-color: #028dea;
    }

    span {
      font-size: 17px;
      font-weight: 600;
      line-height: 18px;
    }
  }
</style>