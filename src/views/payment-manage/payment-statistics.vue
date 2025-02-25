<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>缴费统计</span>
            <div class="filter-container">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                style="width: 350px"
              />
              <el-button type="primary" icon="el-icon-search" style="margin-left: 10px;" @click="handleFilter">查询</el-button>
            </div>
          </div>
          <div class="chart-wrapper">
            <div ref="paymentChart" class="chart-container"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>总收入</span>
          </div>
          <div class="card-panel">
            <div class="card-panel-icon-wrapper">
              <i class="el-icon-money card-panel-icon"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">总收入</div>
              <div class="card-panel-num">¥ {{ totalIncome }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>已缴费账单</span>
          </div>
          <div class="card-panel">
            <div class="card-panel-icon-wrapper">
              <i class="el-icon-s-claim card-panel-icon"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">已缴费账单</div>
              <div class="card-panel-num">{{ paidCount }} 笔</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>未缴费账单</span>
          </div>
          <div class="card-panel">
            <div class="card-panel-icon-wrapper">
              <i class="el-icon-warning card-panel-icon"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">未缴费账单</div>
              <div class="card-panel-num">{{ unpaidCount }} 笔</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>各类型收入占比</span>
          </div>
          <div class="chart-wrapper">
            <div ref="pieChart" class="chart-container"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>收入趋势</span>
          </div>
          <div class="chart-wrapper">
            <div ref="lineChart" class="chart-container"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 注意：实际项目中需要引入 echarts
// import * as echarts from 'echarts'

export default {
  name: 'PaymentStatistics',
  data() {
    return {
      dateRange: '',
      pickerOptions: {
        shortcuts: [{
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
      },
      totalIncome: '12,345.67',
      paidCount: 56,
      unpaidCount: 23
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 模拟图表初始化
      this.initCharts()
    })
  },
  methods: {
    handleFilter() {
      // 根据日期范围过滤数据
      this.$message.success('数据已更新')
      // 重新初始化图表
      this.initCharts()
    },
    initCharts() {
      // 这里只是模拟，实际项目中需要使用 echarts 绘制图表
      this.$message.info('图表已初始化（此处为模拟，实际项目中需要使用 echarts）')
      
      // 柱状图示例代码（实际项目中取消注释）
      /*
      const paymentChart = echarts.init(this.$refs.paymentChart)
      paymentChart.setOption({
        title: {
          text: '各月份收入统计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['物业费', '水电费', '车位费', '维修费']
        },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '物业费',
            type: 'bar',
            stack: 'total',
            data: [2200, 1800, 2500, 2300, 2100, 2400]
          },
          {
            name: '水电费',
            type: 'bar',
            stack: 'total',
            data: [1200, 1300, 1100, 1400, 1500, 1300]
          },
          {
            name: '车位费',
            type: 'bar',
            stack: 'total',
            data: [800, 800, 800, 900, 900, 1000]
          },
          {
            name: '维修费',
            type: 'bar',
            stack: 'total',
            data: [300, 200, 400, 100, 500, 200]
          }
        ]
      })
      
      // 饼图示例代码
      const pieChart = echarts.init(this.$refs.pieChart)
      pieChart.setOption({
        title: {
          text: '收入类型占比',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '收入占比',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 13300, name: '物业费' },
              { value: 7800, name: '水电费' },
              { value: 5200, name: '车位费' },
              { value: 1700, name: '维修费' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
      
      // 折线图示例代码
      const lineChart = echarts.init(this.$refs.lineChart)
      lineChart.setOption({
        title: {
          text: '收入趋势'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['总收入']
        },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '总收入',
            type: 'line',
            data: [4500, 4100, 4800, 4700, 5000, 4900]
          }
        ]
      })
      */
    }
  }
}
</script>

<style scoped>
.filter-container {
  float: right;
}
.chart-wrapper {
  position: relative;
  width: 100%;
  height: 340px;
}
.chart-container {
  position: absolute;
  width: 100%;
  height: 100%;
}
.card-panel {
  display: flex;
  align-items: center;
  height: 108px;
}
.card-panel-icon-wrapper {
  float: left;
  margin: 14px 0 0 14px;
  padding: 16px;
  transition: all 0.38s ease-out;
  border-radius: 6px;
  background-color: #409EFF;
}
.card-panel-icon {
  float: left;
  font-size: 48px;
  color: #fff;
}
.card-panel-description {
  float: right;
  flex: 1;
  padding: 16px;
  margin-left: 10px;
}
.card-panel-text {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.45);
  line-height: 18px;
}
.card-panel-num {
  font-size: 20px;
  margin-top: 10px;
}
</style> 