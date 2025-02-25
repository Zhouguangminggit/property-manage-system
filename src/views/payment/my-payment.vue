<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>待缴费项目</span>
      </div>
      <el-table
        :data="unpaidList"
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
          prop="deadline"
          label="截止日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="120">
          <template slot-scope="scope">
            <el-tag type="danger">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handlePay(scope.row)">缴费</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 缴费对话框 -->
    <el-dialog title="缴费确认" :visible.sync="dialogVisible" width="30%">
      <div class="pay-info">
        <p><strong>账单编号：</strong>{{ currentBill.bill_number }}</p>
        <p><strong>费用类型：</strong>{{ currentBill.type }}</p>
        <p><strong>金额：</strong>{{ currentBill.amount }} 元</p>
        <p><strong>截止日期：</strong>{{ currentBill.deadline }}</p>
      </div>
      <div class="pay-method">
        <p><strong>选择支付方式：</strong></p>
        <el-radio-group v-model="payMethod">
          <el-radio label="alipay">支付宝</el-radio>
          <el-radio label="wechat">微信支付</el-radio>
          <el-radio label="bank">银行卡</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmPay">确认支付</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MyPayment',
  data() {
    return {
      unpaidList: [
        {
          id: 1,
          bill_number: 'WY202302001',
          type: '物业费',
          amount: 800,
          deadline: '2023-03-31',
          status: '未缴费'
        },
        {
          id: 2,
          bill_number: 'SD202302001',
          type: '水电费',
          amount: 320.5,
          deadline: '2023-03-15',
          status: '未缴费'
        },
        {
          id: 3,
          bill_number: 'CW202302001',
          type: '车位费',
          amount: 300,
          deadline: '2023-03-31',
          status: '未缴费'
        }
      ],
      dialogVisible: false,
      currentBill: {},
      payMethod: 'alipay'
    }
  },
  methods: {
    handlePay(bill) {
      this.currentBill = bill
      this.dialogVisible = true
    },
    confirmPay() {
      this.$message.success('支付成功')
      this.dialogVisible = false
      // 从未缴费列表中移除已支付的账单
      const index = this.unpaidList.findIndex(item => item.id === this.currentBill.id)
      if (index !== -1) {
        this.unpaidList.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>
.pay-info {
  margin-bottom: 20px;
}
.pay-info p {
  margin: 10px 0;
}
.pay-method {
  margin-top: 20px;
}
</style> 