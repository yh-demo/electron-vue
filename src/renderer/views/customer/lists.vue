<template>
  <div class="app-container">
     <div class="block">
       <el-button type="primary" @click="handleCreate({})">创建</el-button>
       <el-form :inline="true" :model="listQuery" style="display:inline">

      <el-form-item>
        <el-input v-model="listQuery.keyword" placeholder="用户名/手机号"></el-input>
      </el-form-item>
    
      <el-form-item>
        <el-button type="primary" @click="getList(true)">查询</el-button>
      </el-form-item>
  </el-form>

  </div>
    
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column   prop="id" label='ID' width="60"/> 
      <el-table-column prop="name" label="联系人" width="150" show-overflow-tooltip />
      <el-table-column prop="tel" label="电话"  width="180"/>
      <el-table-column prop="remark" label="备注" min-width="250" show-overflow-tooltip />
      <el-table-column align="center" prop="created_at" label="操作" min-width="200">
        <template slot-scope="{row,$index}">
           <el-button type="primary" @click="handleCreate(row)" >编辑</el-button>
           <el-button type="danger" @click="handleDel(row,$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background :page-size="listQuery.limit" layout="prev, pager, next" v-if="total>0" @current-change="onPageChange" :total="total" />

      <!-- 新增或编辑 -->
      <NeCustomer
       ref="ne-customer"
       @handleRefresh="onHandleRefresh"
      />
      
  </div>
</template>

<script>
// import { req } from '@/api/index'
import NeCustomer from './components/ne-customer'
export default {
  components: { NeCustomer },
  props: {

  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
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
      this.$req('/qyjz/customerList', this.listQuery).then(({ data }) => {
        this.list = data.list
        this.total = data.total || 0
        this.listLoading = false
      }).catch(e => {
        this.listLoading = false
        console.log(e)
      })
    },
    handleCreate(item) {
      // console.log(item)
      this.$refs['ne-customer'].showDialog(item)
    },

    onPageChange(page) {
      this.listQuery.page = page
      this.getList()
    },
    onHandleRefresh() {
      console.log('-onHandleRefresh-')
      this.getList(true)
    },
    handleDel(item, index) {
      // 删除
      this.$confirm('确定删除该记录？', '提示', { type: 'error' }).then(v => {
        this.$req('/qyjz/customerDel', { id: item.id }).then(({ code, msg }) => {
          this.list.splice(index, 1)
        })
      }).catch(() => {
      })
    }
  }
}
</script>
