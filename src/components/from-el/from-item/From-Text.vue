<template>
  <a-input
    :maxLength="maxLength"
    :disabled="item.disabled || item.is_readOnly"
    v-model="item.conf.default_value"
  />
</template>

<script>
export default {
  name: 'From-Text',
  props: ['item'],
  data () {
    return {
      maxLength: 100,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      con: ''
    }
  },
  watch: {
    /* 'item.conf.default_value'(newVal, oldVal){
       if(newVal !== '') {
         this.item.is_required = 0
         return
       }
       this.item.is_required = 1
     }*/
  },
  methods: {
  }
}
</script>

<style scoped>

</style>