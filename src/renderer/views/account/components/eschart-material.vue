<template>
<el-dialog
  title="近30日走势图"
  :visible.sync="dialogVisible"
  top="1vh" width="75%"
   >
    <div id="echarts" style="width:100%;height:400px;margin-top:20px"></div>
</el-dialog>
  
</template>

<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      dialogVisible: false,
      chart_legend_data: [],
      chart_axis_data: [],
      chart_series: [],
      chart: undefined,
      payload: {}
    }
  },
  mounted() {
    console.log('-----------')
  },
  methods: {
    showDialog(item) {
      this.dialogVisible = true
      this.payload = item
      this.getChartData()
    },
    getChartData() {
      this.$req('/qyjz/materialEcharts', { id: this.payload.id }).then(({ data }) => {
        this.chart_legend_data = data.chart_legend_data
        this.chart_axis_data = data.chart_axis_data
        this.chart_series = data.chart_series
        this.initCharts()
      })
    },
    // 统计报表
    initCharts() {
      this.chart && this.chart.dispose()
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
          data: this.chart_legend_data
        },

        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.chart_axis_data // ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: this.chart_series
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

