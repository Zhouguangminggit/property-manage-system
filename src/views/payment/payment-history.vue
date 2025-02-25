<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>缴费历史</span>
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
          <el-select v-model="typeFilter" placeholder="费用类型" clearable style="width: 120px; margin-left: 10px;">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-button type="primary" icon="el-icon-search" style="margin-left: 10px;" @click="handleFilter">查询</el-button>
        </div>
      </div>
      <el-table
        :data="paymentList"
        border
        style="width: 100%">
        <el-table-column
          prop="bill_number"
          label="账单编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="type"
          label="费用类型">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="金额(元)"
          width="120">
        </el-table-column>
        <el-table-column
          prop="pay_time"
          label="缴费时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="pay_method"
          label="支付方式"
          width="120">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="120">
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleDetail(scope.row)">详情</el-button>
            <el-button type="text" size="mini" @click="handleDownload(scope.row)">下载凭证</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog title="缴费详情" :visible.sync="dialogVisible" width="30%">
      <div class="payment-detail">
        <p><strong>账单编号：</strong>{{ currentPayment.bill_number }}</p>
        <p><strong>费用类型：</strong>{{ currentPayment.type }}</p>
        <p><strong>金额：</strong>{{ currentPayment.amount }} 元</p>
        <p><strong>缴费时间：</strong>{{ currentPayment.pay_time }}</p>
        <p><strong>支付方式：</strong>{{ currentPayment.pay_method }}</p>
        <p><strong>状态：</strong>{{ currentPayment.status }}</p>
        <p><strong>备注：</strong>{{ currentPayment.remark || '无' }}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleDownload(currentPayment)">下载凭证</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'PaymentHistory',
  data() {
    return {
      dateRange: '',
      typeFilter: '',
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
      typeOptions: [
        { value: '物业费', label: '物业费' },
        { value: '水电费', label: '水电费' },
        { value: '车位费', label: '车位费' },
        { value: '维修费', label: '维修费' }
      ],
      paymentList: [
        {
          id: 1,
          bill_number: 'WY202301001',
          type: '物业费',
          amount: 800,
          pay_time: '2023-01-15 10:30:45',
          pay_method: '支付宝',
          status: '已缴费',
          remark: '2023年第一季度物业费'
        },
        {
          id: 2,
          bill_number: 'SD202301001',
          type: '水电费',
          amount: 245.8,
          pay_time: '2023-01-10 14:20:30',
          pay_method: '微信支付',
          status: '已缴费',
          remark: '2023年1月水电费'
        },
        {
          id: 3,
          bill_number: 'CW202301001',
          type: '车位费',
          amount: 300,
          pay_time: '2023-01-05 09:15:20',
          pay_method: '银行卡',
          status: '已缴费',
          remark: '2023年1月车位费'
        }
      ],
      currentPage: 1,
      pageSize: 10,
      total: 3,
      dialogVisible: false,
      currentPayment: {}
    }
  },
  methods: {
    handleFilter() {
      // 根据筛选条件过滤数据
      this.$message.success('查询成功')
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    handleDetail(payment) {
      this.currentPayment = payment
      this.dialogVisible = true
    },
    handleDownload(payment) {
      this.$message.success(`已下载 ${payment.bill_number} 的缴费凭证`)
    }
  }
}
</script>

<style scoped>
.filter-container {
  float: right;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
.payment-detail p {
  margin: 10px 0;
}
</style> 