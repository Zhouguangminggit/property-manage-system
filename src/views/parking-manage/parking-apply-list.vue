<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="车牌号/业主姓名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 120px; margin-left: 10px;">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
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
        prop="car_number"
        label="车牌号"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.car_number }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="apply_type"
        label="申请类型"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.apply_type === 'fixed' ? '固定车位' : '临时车位' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="duration"
        label="申请时长"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.duration }}个月</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="apply_time"
        label="申请时间"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.apply_time }}</span>
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
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDetail(scope.row)">
            详情
          </el-button>
          <el-button v-if="scope.row.status === '审核中'" type="success" size="mini" @click="handleApprove(scope.row)">
            通过
          </el-button>
          <el-button v-if="scope.row.status === '审核中'" type="danger" size="mini" @click="handleReject(scope.row)">
            拒绝
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

    <!-- 详情对话框 -->
    <el-dialog title="申请详情" :visible.sync="dialogVisible" width="50%">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="业主姓名">{{ currentApply.owner_name }}</el-descriptions-item>
        <el-descriptions-item label="车牌号">{{ currentApply.car_number }}</el-descriptions-item>
        <el-descriptions-item label="车辆品牌">{{ currentApply.car_brand }}</el-descriptions-item>
        <el-descriptions-item label="车辆型号">{{ currentApply.car_model }}</el-descriptions-item>
        <el-descriptions-item label="车辆颜色">{{ currentApply.car_color }}</el-descriptions-item>
        <el-descriptions-item label="申请类型">{{ currentApply.apply_type === 'fixed' ? '固定车位' : '临时车位' }}</el-descriptions-item>
        <el-descriptions-item label="申请时长">{{ currentApply.duration }}个月</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ currentApply.apply_time }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentApply.status)">{{ currentApply.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentApply.remark || '无' }}</el-descriptions-item>
      </el-descriptions>
      <div v-if="currentApply.status === '审核中'" class="dialog-footer" style="margin-top: 20px;">
        <el-button type="success" @click="handleApprove(currentApply)">通过</el-button>
        <el-button type="danger" @click="handleReject(currentApply)">拒绝</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 分配车位对话框 -->
    <el-dialog title="分配车位" :visible.sync="assignDialogVisible" width="40%">
      <el-form :model="assignForm" :rules="assignRules" ref="assignForm" label-width="100px">
        <el-form-item label="业主姓名">
          <span>{{ currentApply.owner_name }}</span>
        </el-form-item>
        <el-form-item label="车牌号">
          <span>{{ currentApply.car_number }}</span>
        </el-form-item>
        <el-form-item label="车位" prop="parking_id">
          <el-select v-model="assignForm.parking_id" placeholder="请选择车位">
            <el-option
              v-for="item in parkingOptions"
              :key="item.id"
              :label="`${item.parking_number} (${item.location})`"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAssign">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  name: 'ParkingApplyList',
  components: { Pagination },
  data() {
    return {
      list: [
        {
          id: 1,
          owner_name: '张三',
          car_number: '京A12345',
          car_brand: '大众',
          car_model: '帕萨特',
          car_color: '黑色',
          apply_type: 'fixed',
          duration: 12,
          apply_time: '2023-02-20 10:00:00',
          status: '审核中',
          remark: '希望能分配靠近电梯的车位'
        },
        {
          id: 2,
          owner_name: '李四',
          car_number: '京B67890',
          car_brand: '丰田',
          car_model: '卡罗拉',
          car_color: '白色',
          apply_type: 'temporary',
          duration: 1,
          apply_time: '2023-02-15 14:30:00',
          status: '已通过',
          remark: '临时访客车位'
        },
        {
          id: 3,
          owner_name: '王五',
          car_number: '京C54321',
          car_brand: '本田',
          car_model: '雅阁',
          car_color: '银色',
          apply_type: 'fixed',
          duration: 6,
          apply_time: '2023-02-18 09:15:00',
          status: '已拒绝',
          remark: '希望能分配靠近出口的车位'
        }
      ],
      total: 3,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: '',
        status: '',
        sort: '+id'
      },
      statusOptions: [
        { value: '审核中', label: '审核中' },
        { value: '已通过', label: '已通过' },
        { value: '已拒绝', label: '已拒绝' }
      ],
      dialogVisible: false,
      currentApply: {},
      assignDialogVisible: false,
      assignForm: {
        parking_id: ''
      },
      assignRules: {
        parking_id: [
          { required: true, message: '请选择车位', trigger: 'change' }
        ]
      },
      parkingOptions: [
        { id: 1, parking_number: 'A-102', location: '地下一层A区' },
        { id: 2, parking_number: 'B-103', location: '地下一层B区' },
        { id: 3, parking_number: 'C-101', location: '地下一层C区' }
      ]
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
      if (status === '审核中') return 'info'
      if (status === '已通过') return 'success'
      if (status === '已拒绝') return 'danger'
      return 'info'
    },
    handleDetail(row) {
      this.currentApply = row
      this.dialogVisible = true
    },
    handleApprove(row) {
      this.currentApply = row
      this.assignForm = {
        parking_id: ''
      }
      this.dialogVisible = false
      this.assignDialogVisible = true
    },
    confirmAssign() {
      this.$refs.assignForm.validate((valid) => {
        if (valid) {
          // 模拟分配操作
          const index = this.list.findIndex(item => item.id === this.currentApply.id)
          this.list[index].status = '已通过'
          this.assignDialogVisible = false
          this.$message({
            type: 'success',
            message: '申请已通过，车位分配成功!'
          })
        }
      })
    },
    handleReject(row) {
      this.$confirm('确认要拒绝该申请吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 模拟拒绝操作
        const index = this.list.findIndex(item => item.id === row.id)
        this.list[index].status = '已拒绝'
        this.dialogVisible = false
        this.$message({
          type: 'success',
          message: '申请已拒绝!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
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
</style> 