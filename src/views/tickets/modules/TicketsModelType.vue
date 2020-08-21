<template>
  <div>
    <a-row class="model-type">
      <div class="model-border" v-for="(item,index) in items" :key="item.id" @click="checkType(item, index)">
        <div style="width: 100%;line-height: 66px">
          <a-icon type="tool" theme="filled" style="font-size: 28px;vertical-align: middle;width: 30%;"/>
          <span style="font-size: 14px;">{{item.name}}</span>
        </div>
      </div>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'TicketsModelType',
  props: ['items'],
  data () {
    return {
      ModalText: '',
      confirmLoading: false,
      selectIndex: 0,
      visibleModel: false,
      modeId: ''
    }
  },
  mounted () {
  },
  methods: {
    checkType (item, index) {
      this.modeId = item.id
      this.$emit('click', item.id)
    }
  }

}
</script>

<style scoped>
  .model-type {
    display: flex;
    flex-wrap: wrap;
    margin-left: 12px;
  }

  .model-border {
    border: 1px solid #e6eaef;
    width: 31%;
    height: 66px;
    color: #666e79;
    margin-right: 16px;
    margin-bottom: 15px;
  }
  .model-border:hover {
    border: 1px solid #218af4;
    background-color: #218af4;
    color: white;
    width: 31%;
    height: 66px;
    margin-right: 16px;
    margin-bottom: 15px;
    cursor: pointer;
  }

  .model-border-blue {
    border: 1px solid #218af4;
    height: 100px;
    width: 100%;
    margin-left: 20px;
    margin-top: 30px;
    text-align: center;
  }

  .model-text {
    text-align: center;
    color: #7F7F8A;
    font-size: 12px;
    margin-top: 10px;
    margin-left: 20px;
  }

  .model-text-blue {
    text-align: center;
    color: #218af4;
    font-size: 12px;
    margin-top: 10px;
    margin-left: 20px;
  }

</style>