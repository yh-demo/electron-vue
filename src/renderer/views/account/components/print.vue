<template>
<div style="display:inline-block; width:200px">
       <el-select v-model="print_index" placeholder="请选择打印机">
        <el-option
          v-for="(item,index) in printList"
          :key="item.name"
          :label="item.name"
          :value="index">
        </el-option>
      </el-select> 
    <webview ref="printWebview" :src="url" nodeintegration style="width:0px;height:0px"/>
</div>
  
</template>

<script>
import { ipcRenderer } from 'electron'
import { Loading } from 'element-ui'
export default {
  data() {
    return {
      loadingInstance: undefined,
      print_index: 0,
      url: '',
      printList: []
    }
  },
  created() {

  },
  computed: {
    print_obj() {
      return this.printList[this.print_index] || {}
    }
  },
  watch: {
    printList(value, oldValue) {
      let print_index = 0
      for (let i = 0; i < value.length; i++) {
        const print_obj = value[i]
        if (print_obj.isDefault) {
          print_index = i
          break
        }
      }
      this.print_index = print_index
    }
  },
  mounted() {
    this._onMounted()
  },
  methods: {
    _onMounted() {
      console.log('-onPrint-')
      // 打印
      // 使用ipcRenderer与主进程通信，并获取返回值
      ipcRenderer.send('getPrinterList')
      // 监听主线程获取到打印机列表后的回调
      ipcRenderer.once('getPrinterList', (event, data) => {
        // data就是打印机列表
        console.log(data)
        this.printList = data
      })
      // 页面挂载问题处理
      this.$refs.printWebview.addEventListener('dom-ready', (res) => {
        console.log(`--dom-ready--${this.url}`, res)
        console.log(`webview-print-do，开始打印`)

        this.loadingInstance.text = '开始打印...'

        this.handlePagePrint()
      })
    },
    print(url) {
      if (!this.print_obj.name) {
        this.$message({ message: '请选择打印机...', type: 'success' })
        return
      }
      if (!url) {
        this.$message({ message: '打印地址异常:url:' + url, type: 'success' })
        return
      }

      if (url !== this.url) {
        this.loadingInstance = Loading.service({ text: '准备打印中....', fullscreen: false })
        this.url = url
      } else {
        // 直接再次打印
        this.$confirm('已打印过，是否再次打印', '提示', { type: 'error' }).then(v => {
          this.loadingInstance = Loading.service({ text: '准备打印中....', fullscreen: false })
          this.handlePagePrint()
        }).catch(() => {
          console.log('cancel')
          this.handleLoadingClose()
        })
      }
      // this.url = url

      console.log(`url=${url}`)
    },
    handlePagePrint() {
      console.log('-handlePagePrint-')
      this.loadingInstance.text = '发起打印指令...'
      this.$refs.printWebview.print(
        {
          // 是否是静默打印
          silent: true,
          printBackground: true,
          // 打印机的名称，就是本文一开始获得的打印机列表其中一个
          deviceName: this.print_obj.name
        },
        (data) => {
          this.loadingInstance.text = '打印结束:state:' + data
          this.handleLoadingClose()
          // 这个回调是打印后的回调事件，data为true就是打印成功，为false就打印失败
          console.log('webview success', data)
        },
      )
    },
    handleLoadingClose() {
      this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
        this.loadingInstance && this.loadingInstance.close()
        this.loadingInstance = undefined
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

