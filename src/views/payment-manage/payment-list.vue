<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="账单编号/业主姓名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.type" placeholder="费用类型" clearable style="width: 120px; margin-left: 10px;">
        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 120px; margin-left: 10px;">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        添加账单
      </el-button>
    </div>

    <el-table
      :data="list"
      border
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        prop="id"
        label="ID"
        sortable="custom"
        align="center"
        width="80"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="bill_number"
        label="账单编号"
        align="center"
        width="150"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.bill_number }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="owner_name"
        label="业主姓名"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.owner_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="费用类型"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        label="金额(元)"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="deadline"
        label="截止日期"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.deadline }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="pay_time"
        label="缴费时间"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.pay_time || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="180"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            编辑
          </el-button>
          <el-button v-if="scope.row.status === '未缴费'" type="success" size="mini" @click="handlePay(scope.row)">
            缴费
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 缴费对话框 -->
    <el-dialog title="缴费确认" :visible.sync="payDialogVisible" width="30%">
      <div class="pay-info">
        <p><strong>账单编号：</strong>{{ currentBill.bill_number }}</p>
        <p><strong>业主姓名：</strong>{{ currentBill.owner_name }}</p>
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
        <el-button @click="payDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmPay">确认支付</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  name: 'PaymentList',
  components: { Pagination },
  data() {
    return {
      list: [
        {
          id: 1,
          bill_number: 'WY202302001',
          owner_name: '张三',
          type: '物业费',
          amount: 800,
          deadline: '2023-03-31',
          status: '未缴费',
          pay_time: ''
        },
        {
          id: 2,
          bill_number: 'SD202302001',
          owner_name: '张三',
          type: '水电费',
          amount: 320.5,
          deadline: '2023-03-15',
          status: '未缴费',
          pay_time: ''
        },
        {
          id: 3,
          bill_number: 'WY202301001',
          owner_name: '李四',
          type: '物业费',
          amount: 800,
          deadline: '2023-01-31',
          status: '已缴费',
          pay_time: '2023-01-15 10:30:45'
        }
      ],
      total: 3,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: '',
        type: '',
        status: '',
        sort: '+id'
      },
      typeOptions: [
        { value: '物业费', label: '物业费' },
        { value: '水电费', label: '水电费' },
        { value: '车位费', label: '车位费' },
        { value: '维修费', label: '维修费' }
      ],
      statusOptions: [
        { value: '未缴费', label: '未缴费' },
        { value: '已缴费', label: '已缴费' }
      ],
      payDialogVisible: false,
      currentBill: {},
      payMethod: 'alipay'
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      // 模拟API请求
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.listQuery.sort = order === 'ascending' ? '+id' : '-id'
      }
      this.getList()
    },
    getStatusType(status) {
      if (status === '未缴费') return 'danger'
      if (status === '已缴费') return 'success'
      return 'info'
    },
    handleCreate() {
      this.$router.push('/payment-manage/payment-add')
    },
    handleUpdate(row) {
      this.$router.push(`/payment-manage/payment-add?id=${row.id}`)
    },
    handlePay(row) {
      this.currentBill = row
      this.payMethod = 'alipay'
      this.payDialogVisible = true
    },
    confirmPay() {
      // 模拟支付操作
      const index = this.list.findIndex(item => item.id === this.currentBill.id)
      this.list[index].status = '已缴费'
      this.list[index].pay_time = new Date().toLocaleString()
      this.payDialogVisible = false
      this.$message({
        type: 'success',
        message: '支付成功!'
      })
    },
    handleDelete(row) {
      this.$confirm('确认要删除该账单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 模拟删除操作
        const index = this.list.findIndex(item => item.id === row.id)
        this.list.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>
.filter-container {
  padding-bottom: 10px;
}
.filter-item {
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 10px;
}
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