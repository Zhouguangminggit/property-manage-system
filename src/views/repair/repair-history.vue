<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>报修历史</span>
        <div class="filter-container">
          <el-select v-model="statusFilter" placeholder="状态" clearable style="width: 120px; margin-right: 10px;">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 350px; margin-right: 10px;"
          />
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        </div>
      </div>
      <el-table
        :data="repairList"
        border
        style="width: 100%">
        <el-table-column
        prop="repair_number"
        label="报修编号"
        width="180">
        </el-table-column>
        <el-table-column
          prop="type"
          label="报修类型">
        </el-table-column>
        <el-table-column
          prop="title"
          label="报修标题">
        </el-table-column>
        <el-table-column
          prop="apply_time"
          label="申请时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="120">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog title="报修详情" :visible.sync="dialogVisible" width="50%">
      <div class="repair-detail">
        <h3>{{ currentRepair.title }}</h3>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="报修编号">{{ currentRepair.repair_number }}</el-descriptions-item>
          <el-descriptions-item label="报修类型">{{ currentRepair.type }}</el-descriptions-item>
          <el-descriptions-item label="申请时间">{{ currentRepair.apply_time }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(currentRepair.status)">{{ currentRepair.status }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ currentRepair.phone }}</el-descriptions-item>
          <el-descriptions-item label="期望上门时间">{{ currentRepair.expected_time }}</el-descriptions-item>
          <el-descriptions-item label="报修内容" :span="2">
            {{ currentRepair.content }}
          </el-descriptions-item>
          <el-descriptions-item label="处理结果" :span="2" v-if="currentRepair.result">
            {{ currentRepair.result }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'RepairHistory',
  data() {
    return {
      statusFilter: '',
      dateRange: '',
      statusOptions: [
        { value: '待处理', label: '待处理' },
        { value: '处理中', label: '处理中' },
        { value: '已完成', label: '已完成' },
        { value: '已取消', label: '已取消' }
      ],
      repairList: [
        {
          id: 1,
          repair_number: 'WX202302001',
          type: '水电维修',
          title: '厨房水管漏水',
          content: '厨房水槽下方的水管接口处漏水，地面已有积水',
          phone: '13800138001',
          expected_time: '2023-02-20 09:00 - 2023-02-20 12:00',
          apply_time: '2023-02-19 10:30:00',
          status: '已完成',
          result: '已更换漏水管道接口，测试正常'
        },
        {
          id: 2,
          repair_number: 'WX202302002',
          type: '电器维修',
          title: '空调不制冷',
          content: '客厅空调开机后不制冷，可能是缺氟利昂',
          phone: '13800138001',
          expected_time: '2023-02-22 14:00 - 2023-02-22 18:00',
          apply_time: '2023-02-21 16:45:00',
          status: '处理中',
          result: ''
        }
      ],
      dialogVisible: false,
      currentRepair: {}
    }
  },
  methods: {
    handleFilter() {
      // 根据筛选条件过滤数据
      this.$message.success('查询成功')
    },
    handleDetail(repair) {
      this.currentRepair = repair
      this.dialogVisible = true
    },
    getStatusType(status) {
      switch (status) {
        case '待处理':
          return 'info'
        case '处理中':
          return 'warning'
        case '已完成':
          return 'success'
        case '已取消':
          return 'danger'
        default:
          return 'info'
      }
    }
  }
}
</script>

<style scoped>
.filter-container {
  float: right;
}
.repair-detail h3 {
  text-align: center;
  margin-bottom: 20px;
}
</style> 