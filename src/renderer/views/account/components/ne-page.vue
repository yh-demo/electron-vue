<template>
<el-dialog
  :title="title"
  :visible.sync="dialogVisible"
  @close="handleClose"
  top="1vh" width="75%"
   >
    <el-form ref="form" :model="temp" label-width="120px" size="mini">
      <el-form-item prop="contacts" label="联系人">
        <el-input v-model="temp.contacts" />
      </el-form-item>
      <el-form-item prop="phone" label="联系电话">
        <el-input v-model="temp.phone" />
      </el-form-item>
      <el-form-item prop="total_money"  label="总金额">
        <el-input v-model="temp.total_money" type="number"/>
      </el-form-item>
      <el-form-item prop="group_date_time"  label="工作日期">
           <el-date-picker v-model="temp.group_date_time" type="datetime" placeholder="选择日期时间" default-time="09:00:00" value-format="yyyy-MM-dd HH:mm:ss">
    </el-date-picker>
      </el-form-item>
    
      
      <el-form-item prop="remark"  label="备注">
        <el-input v-model="temp.remark" type="textarea"/>
      </el-form-item>
      <el-form-item   label="产品列表">
           <label slot="label"><el-button type="primary" size="mini" icon="el-icon-plus" @click="handleMore(-1)">增加产品</el-button></label>
        <el-table :data="temp.list"   size="mini" border fit highlight-current-row>
            
            <el-table-column prop="name" label="产品名" min-width="180">
                <template slot-scope="{row,$index}">
                    <el-autocomplete 
                    v-model="row.name"  
                    class="inline-input"
                    :fetch-suggestions="handleMaterialQuerySearch"
                     @select="handleQueryStringSelect($event,$index)"
                     placeholder="请输入产品名"
                    >
                    <template slot-scope="{ item }">
                        <div class="name">{{ item.input_search_value }}</div>
                    </template>
                    </el-autocomplete>
                </template>
            </el-table-column>
            <el-table-column prop="phone" label="数量"  width="120" >
                <template slot-scope="{row}">
                    <el-input v-model="row.num" type="number" />
                </template>
            </el-table-column>
            <el-table-column prop="price" label="单价"  width="120" >
                <template slot-scope="{row}">
                    <el-input v-model="row.price" type="number"  />
                </template>
            </el-table-column>
            <el-table-column label="总金额"  width="120" >
                <template slot-scope="{row}">
                    {{row.num*row.price|numberFixed}}
                </template>
            </el-table-column>
            <el-table-column label="操作"  width="120" >
                <template slot-scope="{$index}">
                    <i class="el-icon-delete"  size="mini" type="danger" @click="handleMore($index)" style="color:red;cursor: pointer;font-size: 16px;" />
                </template>
            </el-table-column>
           
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" v-loading="submit_loading">保存</el-button>
        <el-button type="warning" @click="onPrint" v-if="!is_add">打印</el-button>
      </el-form-item>
    </el-form>
</el-dialog>
  
</template>

<script>
// import { ipcRenderer } from 'electron'
export default {
  props: {
    handlePrint: {
      type: Function,
      default: (item) => {}
    }
  },
  data() {
    return {
      payload: {},
      is_add: true,
      submit_loading: false,
      title: '',
      dialogVisible: false,
      material: [],
      temp: {
        id: undefined,
        contacts: undefined,
        phone: undefined,
        total_money: undefined,
        group_date_time: undefined,
        remark: undefined,
        list: []

      }
    }
  },
  watch: {
    'temp.list': {
      handler: function(value, oldVal) {
        let total_money = 0
        value.map((item) => {
          total_money += item.price * item.num
        })
        //   console.log(total_money)
        this.temp.total_money = total_money.toFixed(2)
      },
      deep: true
    }
  },
  filters: {
    numberFixed(value) {
      return (value - 0).toFixed(2)
    }
  },
  created() {
    this._initData()
  },
  methods: {
    _initData() {
      this.$req('/qyjz/defInfo', { type: 'order' }).then(({ data }) => {
        this.material = data.material || []
      }).catch(v => {

      })
    },
    showDialog(item) {
      this.payload = item
      this.dialogVisible = true
      this.is_add = !item.hasOwnProperty('id')
      this.title = this.is_add ? '新增打印单' : '编辑打印单'
      for (const key in this.temp) {
        // if (item.hasOwnProperty(key)) {

        this.temp[key] = item[key]
        // }
      }
      this.temp.list = item.item_list || []
    //   console.log(item, this.temp)
    },
    onSubmit() {
      this.submit_loading = true
      this.$req('/qyjz/taskSave', this.temp).then(({ code, msg, data }) => {
        this.$message({ message: msg, type: 'success' })
        this.submit_loading = false
        // this.dialogVisible = false
      }).catch(v => {
        this.submit_loading = false
      })
    },
    onPrint() {
      console.log('-onPrint-')
      this.handlePrint(this.payload)
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
    },
    handleMore(index) {
      if (index >= 0) {
        // 删除
        this.temp.list.splice(index, 1)
      } else {
        // 新增
        this.temp.list.push(this.temp_list_obj({}))
      }
    },
    // 文本内容搜索
    handleMaterialQuerySearch(queryString, cb) {
      this._querySearch(queryString, cb, this.material || [])
    },
    handleQueryStringSelect(item, index) {
      this.$set(this.temp.list, index, this.temp_list_obj({ mid: item.id, name: item.name, price: item.price }))
    },
    _querySearch(queryString, cb, restaurants = []) {
      var results = queryString ? restaurants.filter(this._createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    _createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.input_search_value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
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

