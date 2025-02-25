<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="车位编号/位置"
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
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        添加车位
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
        prop="parking_number"
        label="车位编号"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.parking_number }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="location"
        label="位置"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="area"
        label="面积(㎡)"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.area }}</span>
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
        prop="owner_name"
        label="使用业主"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.owner_name || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="start_date"
        label="开始日期"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.start_date || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="end_date"
        label="结束日期"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.end_date || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            编辑
          </el-button>
          <el-button v-if="scope.row.status === '空闲'" type="success" size="mini" @click="handleAssign(scope.row)">
            分配
          </el-button>
          <el-button v-if="scope.row.status === '已使用'" type="warning" size="mini" @click="handleRelease(scope.row)">
            释放
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

    <!-- 分配车位对话框 -->
    <el-dialog title="分配车位" :visible.sync="assignDialogVisible" width="40%">
      <el-form :model="assignForm" :rules="assignRules" ref="assignForm" label-width="100px">
        <el-form-item label="车位编号">
          <span>{{ currentParking.parking_number }}</span>
        </el-form-item>
        <el-form-item label="位置">
          <span>{{ currentParking.location }}</span>
        </el-form-item>
        <el-form-item label="业主" prop="owner_id">
          <el-select v-model="assignForm.owner_id" placeholder="请选择业主">
            <el-option
              v-for="item in ownerOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用期限" prop="date_range">
          <el-date-picker
            v-model="assignForm.date_range"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
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
  name: 'ParkingList',
  components: { Pagination },
  data() {
    return {
      list: [
        {
          id: 1,
          parking_number: 'A-101',
          location: '地下一层A区',
          area: 15,
          status: '已使用',
          owner_name: '张三',
          start_date: '2023-01-01',
          end_date: '2023-12-31'
        },
        {
          id: 2,
          parking_number: 'A-102',
          location: '地下一层A区',
          area: 15,
          status: '空闲',
          owner_name: '',
          start_date: '',
          end_date: ''
        },
        {
          id: 3,
          parking_number: 'B-101',
          location: '地下一层B区',
          area: 18,
          status: '已使用',
          owner_name: '李四',
          start_date: '2023-01-15',
          end_date: '2023-07-15'
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
        { value: '空闲', label: '空闲' },
        { value: '已使用', label: '已使用' },
        { value: '维修中', label: '维修中' }
      ],
      assignDialogVisible: false,
      currentParking: {},
      assignForm: {
        owner_id: '',
        date_range: []
      },
      assignRules: {
        owner_id: [
          { required: true, message: '请选择业主', trigger: 'change' }
        ],
        date_range: [
          { required: true, message: '请选择使用期限', trigger: 'change' }
        ]
      },
      ownerOptions: [
        { id: 1, name: '张三' },
        { id: 2, name: '李四' },
        { id: 3, name: '王五' }
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
      if (status === '空闲') return 'success'
      if (status === '已使用') return 'primary'
      if (status === '维修中') return 'warning'
      return 'info'
    },
    handleCreate() {
      this.$router.push('/parking-manage/parking-add')
    },
    handleUpdate(row) {
      this.$router.push(`/parking-manage/parking-add?id=${row.id}`)
    },
    handleAssign(row) {
      this.currentParking = row
      this.assignForm = {
        owner_id: '',
        date_range: []
      }
      this.assignDialogVisible = true
    },
    confirmAssign() {
      this.$refs.assignForm.validate((valid) => {
        if (valid) {
          // 模拟分配操作
          const index = this.list.findIndex(item => item.id === this.currentParking.id)
          const owner = this.ownerOptions.find(item => item.id === this.assignForm.owner_id)
          this.list[index].status = '已使用'
          this.list[index].owner_name = owner.name
          this.list[index].start_date = this.assignForm.date_range[0]
          this.list[index].end_date = this.assignForm.date_range[1]
          this.assignDialogVisible = false
          this.$message({
            type: 'success',
            message: '车位分配成功!'
          })
        }
      })
    },
    handleRelease(row) {
      this.$confirm('确认要释放该车位吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 模拟释放操作
        const index = this.list.findIndex(item => item.id === row.id)
        this.list[index].status = '空闲'
        this.list[index].owner_name = ''
        this.list[index].start_date = ''
        this.list[index].end_date = ''
        this.$message({
          type: 'success',
          message: '车位释放成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消释放'
        })
      })
    },
    handleDelete(row) {
      this.$confirm('确认要删除该车位吗?', '提示', {
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
</style> 