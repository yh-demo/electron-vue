<template>
  <div class="dashboard-container">
    <div class="dashboard-text">截止今日总单数 :{{total_task_count}}</div>
    <div class="dashboard-text">截止今日累计总额 :{{total_money}}</div>
    <div class="dashboard-text">截止今日累计耗材 :{{sum_total_num}}</div>
    <div id="echarts" style="width:100%;height:400px;margin-top:20px"></div>
    <!-- <div class="dashboard-text">roles:<span v-for='role in roles' :key='role'>{{role}}</span></div> -->
  </div>
</template>

<script>
import echarts from 'echarts'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
export default {
  name: 'dashboard',
  data() {
    return {
      total_task_count: 0, // 总任务次数
      total_money: 0, // 总金额
      sum_total_num: 0, // 材料数量
      date_data: [],
      echarts_series: {
        legend_data: ['任务数量', '今日总额', '材料总数'],
        x_axis_data: [],
        series: [{
          name: '任务数量',
          type: 'line',
          data: []
        }, {
          name: '今日总额',
          type: 'line',
          data: []
        }, {
          name: '材料总数',
          type: 'line',
          data: []
        }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'token',
      'name',
      'roles'
    ])
    // echarts_series() {
    //   const data =

    //   console.log('/////////', data.series)
    //   return data
    // }
  },
  watch: {
    date_data(value, oldvalue) {
      value.map((item) => {
        this.echarts_series.x_axis_data.push(item.date)
        this.echarts_series.series[0].data.push(item.task_count)
        this.echarts_series.series[1].data.push(item.sum_total_money)
        this.echarts_series.series[2].data.push(item.sum_total_num)
      })

      this.initCharts()
    }
  },
  created() {
    this._initData()
  },

  mounted() {
    console.log('--mounted--index', getToken())
    console.log('--mounted--token', this.token)
  },
  methods: {
    _initData() {
      this.$req('/qyjz/indexData').then(({ data }) => {
        console.log(data)
        // this.date_data = this.date_data.concat(data.date_data)
        this.date_data = data.date_data || []
        this.total_money = data.total_money || 0
        this.total_task_count = data.total_task_count || 0
        this.sum_total_num = data.sum_total_num || 0
      }).catch(v => {
        console.error(v)
      })
    },
    initCharts() {
      this.chart = echarts.init(document.getElementById('echarts'))
      this.setOptions()
    },
    setOptions() {
      this.chart.setOption({
        title: {
          text: '近30日数据汇总'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.echarts_series.legend_data,
          selected: {
            '今日总额': false // 图例为‘全部’的一项默认置灰
          }
        },

        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.echarts_series.x_axis_data // ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: this.echarts_series.series
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
