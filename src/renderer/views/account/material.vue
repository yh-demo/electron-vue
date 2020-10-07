<template>
  <div class="app-container">
     <div class="block">
       <el-button type="primary" @click="handleCreate({})"  >创建</el-button>
   
    <el-form :inline="true" :model="listQuery"  style="display:inline">
      <el-form-item>
        <el-input v-model="listQuery.keyword" placeholder="品名"></el-input>
      </el-form-item>
    
      <el-form-item>
        <el-button type="primary" @click="getList(true)"  >查询</el-button>
      </el-form-item>
  </el-form>
  </div>
    
    <el-table 
    :data="list" 
    v-loading.body="listLoading" 
    @row-dblclick="onRowDblClick"
    element-loading-text="Loading"   border fit highlight-current-row>

      <el-table-column prop="name" label="品名" width="120" show-overflow-tooltip >
        <template slot-scope="{row}">
          <el-input v-if="row.is_edit" v-model="row.name" placeholder="品名"   @change="handleInputChange($event,'name',row)"/>
          <div v-else>{{row.name}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="pinyin" label="拼音" width="120" show-overflow-tooltip >
        <template slot-scope="{row}">
          <el-input v-if="row.is_edit" v-model="row.pinyin" placeholder="拼音"    @change="handleInputChange($event,'pinyin',row)"/>
          <div v-else>{{row.pinyin}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="pinyin" label="库存" width="120" show-overflow-tooltip >
        <template slot-scope="{row}">
          <el-input v-if="row.is_edit" v-model="row.stock" placeholder="库存" type="number"    @change="handleInputChange($event,'stock',row)"/>
          <div v-else>{{row.stock}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="sp_price" label="供货价" width="120" show-overflow-tooltip >
        <template slot-scope="{row}">
          <el-input v-if="row.is_edit" v-model="row.sp_price" type="number" placeholder="供货价"  @change="handleInputChange($event,'sp_price',row)"/>
          <div v-else>{{row.sp_price}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="单价" width="120" show-overflow-tooltip >
        <template slot-scope="{row}">
          <el-input v-if="row.is_edit" v-model="row.price" type="number" placeholder="单价"  @change="handleInputChange($event,'price',row)"/>
          <div v-else>{{row.price}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="操作" width="300" show-overflow-tooltip >
        <template slot-scope="{row,$index}">
          <el-button type="primary" @click="handleCreate(row)" >编辑</el-button>
          <el-button type="danger" @click="handleDel(row,$index)" >删除</el-button>
          <el-button type="warning" @click="handleEsChart(row,$index)" >走势图</el-button>
        </template>
      </el-table-column>
      
      
    </el-table>

      <!-- 新增或编辑 -->
      <NeMaterial
       ref="ne-material"
       @handleRefresh="onHandleRefresh"
      />
      <!-- 新增或编辑 -->
      <EschartMatrial
       ref="eschart-material"
      />
  </div>
</template>

<script>
// import { req } from '@/api/index'
import EschartMatrial from './components/eschart-material'
import NeMaterial from './components/ne-material'
export default {
  components: {
    NeMaterial, EschartMatrial
  },
  props: {

  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      up_row: undefined,
      listQuery: {
        range_date: undefined,
        keyword: undefined,
        page: 1,
        limit: 20
      }
    }
  },

  created() {
    this.getList()
  },
  methods: {
    getList(is_rest) {
      if (is_rest === true) {
        this.listQuery.page = 1
      }
      this.listLoading = true
      this.$req('/qyjz/materialList', this.listQuery).then(({ data }) => {
        const list = data.list || []
        list.map(function(item) {
          item.is_edit = false
        })
        this.list = list
        this.total = data.total || 0
        this.listLoading = false
      }).catch(e => {
        this.listLoading = false
        console.log(e)
      })
    },
    handleCreate(item) {
      // console.log(item)
      // this.list.push({})
      this.$refs['ne-material'].showDialog(item)
    },
    handleDel(item, index) {
      this.$confirm('确定删除选中的数据', '提示', { type: 'error' }).then(v => {
        this.$req('/qyjz/materialDel', { id: item.id }).then(({ msg }) => {
          this.list.splice(index, 1)
        })
      }).catch(() => {
        console.log('cancel')
      })
    },
    onRowDblClick(row, column, event) {
      if (this.up_row) {
        this.up_row.is_edit = false
      }
      this.up_row = row
      row.is_edit = !row.is_edit
    },
    onHandleRefresh() {
      this.getList(true)
    },
    handleInputChange(value, field, item) {
      const obj = { id: item.id }
      obj[field] = value
      this.$req('/qyjz/materialModInfo', obj).catch(() => {
        this.$message({ message: '修改异常,请重新尝试', type: 'success' })
      })
    },
    handleEsChart(item, index) {
      this.$refs['eschart-material'].showDialog(item)
    }

  }
}
</script>
