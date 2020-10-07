<template>
  <div class="app-container">
     <div class="block">
       <el-button type="primary" @click="handleCreate({})">创建</el-button>
       <el-form :inline="true" :model="listQuery" style="display:inline">
         <el-form-item>
    <el-date-picker
      v-model="listQuery.range_date"
      type="daterange"
      align="left"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
       value-format="yyyy-MM-dd HH:mm:ss"
      :picker-options="pickerOptions"
      @change = "onRangeDateChange"
      >
    </el-date-picker>
    </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.keyword" placeholder="用户名/手机号"></el-input>
      </el-form-item>
    
      <el-form-item>
        <el-button type="primary" @click="getList(true)">查询</el-button>
      </el-form-item>
      <el-form-item>
        <!-- 打印 -->
      <Print
       ref="print"
      />
      </el-form-item>
  </el-form>

  </div>
    
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column   prop="id" label='ID' width="60">
        
      </el-table-column>
      <el-table-column prop="contacts" label="联系人" width="100" show-overflow-tooltip />
      <el-table-column prop="phone" label="电话"  width="120"/>
      <el-table-column prop="total_money" label="金额"  width="120"/>
      <el-table-column prop="group_date_time" label="安排时间" width="180"/>
      <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip />
      <el-table-column align="center" prop="created_at" label="操作" min-width="300">
        <template slot-scope="{row,$index}">
           <el-button type="primary" @click="handleCreate(row)" >查看</el-button>
           <el-button type="warning" @click="handlePrint(row)">打印</el-button>
           <el-button type="danger" @click="handleDel(row,$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background :page-size="listQuery.limit" layout="prev, pager, next" v-if="total>0" @current-change="onPageChange" :total="total" />

      <!-- 新增或编辑 -->
      <NePage
       ref="ne-page"
       :handlePrint="handlePrint"
       @handleRefresh="onHandleRefresh"
      />
      
  </div>
</template>

<script>
// import { req } from '@/api/index'
import NePage from './components/ne-page'
import Print from './components/print'
export default {
  components: {
    NePage, Print
  },
  props: {
    pickerOptions: {
      type: String,
      default: () => {
        [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
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
      this.$req('/qyjz/taskList', this.listQuery).then(({ data }) => {
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
      this.$refs['ne-page'].showDialog(item)
    },
    onRangeDateChange(date) {
      console.log(date)
    },

    onPageChange(page) {
      this.listQuery.page = page
      this.getList()
    },
    onHandleRefresh() {
      console.log('-onHandleRefresh-')
      this.getList()
    },
    // 打印
    handlePrint(item) {
      console.log(item)
      this.$refs['print'].print(item.print_href)
    },
    handleDel(item, index) {
      // 删除
      this.$confirm('确定删除该记录？', '提示', { type: 'error' }).then(v => {
        this.$req('/qyjz/taskDel', { id: item.id }).then(({ code, msg }) => {
          this.list.splice(index, 1)
        })
      }).catch(() => {
      })
    }
  }
}
</script>
