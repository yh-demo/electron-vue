<template>
<el-dialog
  :title="title"
  :visible.sync="dialogVisible"
  @close="handleClose"
  top="1vh" width="75%"
   >
    <el-form ref="form" :model="temp" label-width="120px" size="mini">
      <el-form-item prop="name" label="用户名">
        <el-input v-model="temp.name" />
      </el-form-item> 
      <el-form-item prop="pinyin" label="拼音">
        <el-input v-model="temp.pinyin" />
      </el-form-item>
      <el-form-item prop="tel" label="电话">
        <el-input v-model="temp.tel"  />
      </el-form-item>
      <el-form-item prop="remark" label="备注">
        <el-input v-model="temp.remark" type="textarea"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" v-loading="submit_loading">保存</el-button>
      </el-form-item>
    </el-form>
</el-dialog>
  
</template>

<script>
import pinyin from 'pinyin'
export default {
  data() {
    return {
      is_add: true,
      submit_loading: false,
      title: '',
      dialogVisible: false,
      material: [],
      temp: {
        id: undefined,
        name: undefined,
        pinyin: undefined,
        tel: undefined,
        remark: undefined

      }
    }
  },
  watch: {
    'temp.name': function(value, oldval) {
      const _pinyin = pinyin(value, {
        style: pinyin.STYLE_FIRST_LETTER, // 设置拼音风格
        heteronym: true
      })
      this.temp.pinyin = _pinyin.join('').toUpperCase()
    }
  },
  created() {

  },
  methods: {
    showDialog(item) {
      this.dialogVisible = true
      this.is_add = !item.hasOwnProperty('id')
      this.title = this.is_add ? '新增客户' : '编辑客户'
      for (const key in this.temp) {
        // if (item.hasOwnProperty(key)) {

        this.temp[key] = item[key]
        // }
      }
    },
    onSubmit() {
      this.submit_loading = true
      this.$req('/qyjz/customerSaveData', this.temp).then(({ code, msg, data }) => {
        this.$message({ message: msg, type: 'success' })
        this.submit_loading = false
        // this.dialogVisible = false
      }).catch(v => {
        this.submit_loading = false
      })
    },
    onPrint() {
      // 打印
    },
    handleClose() {
      console.log('handleClose')
      this.$emit('handleRefresh')
    }

  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

