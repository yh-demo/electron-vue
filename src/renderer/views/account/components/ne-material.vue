<template>
<el-dialog
  :title="title"
  :visible.sync="dialogVisible"
  @close="handleClose"
  top="1vh" width="75%"
   >
    <el-form ref="form" :model="temp" label-width="120px" >
      <el-form-item prop="name" label="品名">
        <el-input v-model="temp.name" />
      </el-form-item> 
      <el-form-item prop="pinyin" label="拼音">
        <el-input v-model="temp.pinyin" />
      </el-form-item>
      <el-form-item prop="stock" label="库存">
        <el-input v-model="temp.stock" type="number" />
      </el-form-item>
      <el-form-item prop="sp_price" label="进货价">
        <el-input v-model="temp.sp_price" type="number" />
      </el-form-item>
      <el-form-item prop="price" label="单价">
        <el-input v-model="temp.price" type="number"/>
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
        stock: undefined,
        sp_price: undefined,
        price: undefined

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
      this.title = this.is_add ? '新增打印单' : '编辑打印单'
      for (const key in this.temp) {
        // if (item.hasOwnProperty(key)) {

        this.temp[key] = item[key]
        // }
      }
    },
    onSubmit() {
      this.submit_loading = true
      this.$req('/qyjz/materialSaveData', this.temp).then(({ code, msg, data }) => {
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
    },
    temp_list_obj(item) {
      return {
        id: item.id,
        mid: item.mid || 0, // 材质id
        name: item.name || '',
        num: item.num || 1,
        price: item.price || 0
      }
    }

  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

