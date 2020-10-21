<template>
  <div style="width: 100%">
    <a-upload :file-list="item.fileList"
              :custom-request="customRequest"
              list-type="picture"
              :remove="handleRemove"
              :disabled="item.disabled || item.is_readOnly"
              :before-upload="beforeUpload">
      <a-button>
        <a-icon type="upload"/>
        选择图片
      </a-button>
    </a-upload>
   <!-- <a-button
      @click="upLoad()"
      type="primary"
      v-if="item.fileList.length !== 0"
      :disabled="item.disabled"
      :loading="uploading"
      style="margin-top: 16px"
    >
      {{ uploading ? '上传文件' : '上传文件' }}
    </a-button>-->
  </div>
</template>

<script>
export default {
  name: 'From-Upload',
  props: ['item', 'value'],
  data () {
    return {
      headers: {
        authorization: 'authorization-text'
      },
      fileNameList: [],
      uploading: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
  },
  watch: {
    value(newVal, oldVal) {
      if (newVal === '') {
        this.item.conf.default_value = []
        return
      }
      this.item.fileList = newVal
    },
    'this.item.conf.default_value': function(newValue) {
      this.item.conf.default_value = []
    }
  },
  methods: {
    handleRemove (file) {
      if(file.hasOwnProperty('url')){
        this.$message.error('已上传的图片，不能移除！')
        return
      }
      const index = this.item.fileList.indexOf(file)
      const newFileList = this.item.fileList.slice()
      const newNameList = this.fileNameList.slice()
      newFileList.splice(index, 1)
      newNameList.splice(index, 1)
      this.item.fileList = newFileList
      this.fileNameList = newNameList
      this.$emit('input', this.item.fileList)
      this.$emit('onChange', this.item.fileList)
    },
    async beforeUpload (file) {
      this.item.fileList.push(file)
      this.fileNameList.push(file.name)
      this.$emit('input', this.item.fileList)
      this.$emit('onChange', this.item.fileList)
     /*  let fileImg = this.fileNameList.find(item => file.name === item)
      if (fileImg) {
        this.$message.info('该文件已上传！')
        return false
      } else {
        this.item.fileList.push(file)
        this.fileNameList.push(file.name)
        const files = await this.getBase64(file)
        this.item.conf.default_value.push(files)
        console.log(this.item.conf.default_value)
        return true
      } */
    },
    // 自定义上传图片
    async customRequest (obj) {
      const response = {
        uid: obj.file.uid,
        name: obj.file.name,
        status: 'done',
        url: ''
      }
      // onProgress进度条
      obj.onProgress({ percent: 50 })
      const param = await this.getBase64(obj.file)
    },
    getBase64 (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    }
  }
}
</script>

<style scoped>

</style>