<template>
<div>
   <div>
    <webview ref="printWebview" :src="url" nodeintegration style="height:500px"/>
  </div>
</div>
  
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  data() {
    return {
      url: '',
      printList: []
    }
  },
  created() {

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
        this.handlePagePrint()
      })
    },
    print(url) {
      this.url = url
      console.log(`url=${url}`)
    },
    handlePagePrint() {
      console.log('-handlePagePrint-')
      this.$refs.printWebview.print(
        {
          // 是否是静默打印
          silent: true,
          printBackground: true,
          // 打印机的名称，就是本文一开始获得的打印机列表其中一个
          deviceName: this.printList[0]
        },
        (data) => {
          // 这个回调是打印后的回调事件，data为true就是打印成功，为false就打印失败
          console.log('webview success', data)
        },
      )
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

