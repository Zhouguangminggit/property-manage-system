<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="报修单号/业主姓名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.type" placeholder="报修类型" clearable style="width: 120px; margin-left: 10px;">
        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 120px; margin-left: 10px;">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        添加报修
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
        prop="repair_number"
        label="报修单号"
        align="center"
        width="150"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.repair_number }}</span>
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
        label="报修类型"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="报修描述"
        align="center"
      >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.description" placement="top-start">
            <span>{{ scope.row.description | ellipsis }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="报修时间"
        align="center"
        width="160"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
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
        width="220"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            编辑
          </el-button>
          <el-button v-if="scope.row.status === '待处理'" type="success" size="mini" @click="handleProcess(scope.row)">
            处理
          </el-button>
          <el-button v-if="scope.row.status === '处理中'" type="warning" size="mini" @click="handleComplete(scope.row)">
            完成
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

    <!-- 处理报修对话框 -->
    <el-dialog :title="dialogStatus === 'process' ? '处理报修' : '完成报修'" :visible.sync="dialogVisible" width="40%">
      <el-form :model="repairForm" :rules="rules" ref="repairForm" label-width="100px">
        <el-form-item label="报修单号">
          <span>{{ repairForm.repair_number }}</span>
        </el-form-item>
        <el-form-item label="业主姓名">
          <span>{{ repairForm.owner_name }}</span>
        </el-form-item>
        <el-form-item label="报修类型">
          <span>{{ repairForm.type }}</span>
        </el-form-item>
        <el-form-item label="报修描述">
          <span>{{ repairForm.description }}</span>
        </el-form-item>
        <el-form-item label="报修时间">
          <span>{{ repairForm.create_time }}</span>
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'process'" label="维修人员" prop="worker">
          <el-select v-model="repairForm.worker" placeholder="请选择维修人员">
            <el-option v-for="item in workerOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'complete'" label="维修结果" prop="result">
          <el-input type="textarea" v-model="repairForm.result" placeholder="请输入维修结果"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'complete'" label="维修费用" prop="cost">
          <el-input-number v-model="repairForm.cost" :min="0" :precision="2"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm('repairForm')">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  name: 'RepairList',
  components: { Pagination },
  filters: {
    ellipsis(value) {
      if (!value) return ''
      if (value.length > 20) {
        return value.slice(0, 20) + '...'
      }
      return value
    }
  },
  data() {
    return {
      list: [
        {
          id: 1,
          repair_number: 'BX202302001',
          owner_name: '张三',
          type: '水电维修',
          description: '厨房水管漏水，地面已经积水',
          create_time: '2023-02-15 09:30:45',
          status: '待处理',
          worker: '',
          result: '',
          cost: 0
        },
        {
          id: 2,
          repair_number: 'BX202302002',
          owner_name: '李四',
          type: '门窗维修',
          description: '卧室窗户无法关闭，可能需要更换窗户把手',
          create_time: '2023-02-16 14:20:30',
          status: '处理中',
          worker: '王师傅',
          result: '',
          cost: 0
        },
        {
          id: 3,
          repair_number: 'BX202301001',
          owner_name: '王五',
          type: '电器维修',
          description: '客厅灯具不亮，可能是线路问题',
          create_time: '2023-01-10 16:45:20',
          status: '已完成',
          worker: '李师傅',
          result: '更换了灯具开关和部分线路',
          cost: 150
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
        { value: '水电维修', label: '水电维修' },
        { value: '门窗维修', label: '门窗维修' },
        { value: '电器维修', label: '电器维修' },
        { value: '家具维修', label: '家具维修' },
        { value: '其他', label: '其他' }
      ],
      statusOptions: [
        { value: '待处理', label: '待处理' },
        { value: '处理中', label: '处理中' },
        { value: '已完成', label: '已完成' },
        { value: '已取消', label: '已取消' }
      ],
      workerOptions: [
        { value: '王师傅', label: '王师傅 (水电)' },
        { value: '李师傅', label: '李师傅 (电器)' },
        { value: '张师傅', label: '张师傅 (门窗)' },
        { value: '赵师傅', label: '赵师傅 (家具)' }
      ],
      dialogVisible: false,
      dialogStatus: '',
      repairForm: {
        id: undefined,
        repair_number: '',
        owner_name: '',
        type: '',
        description: '',
        create_time: '',
        status: '',
        worker: '',
        result: '',
        cost: 0
      },
      rules: {
        worker: [
          { required: true, message: '请选择维修人员', trigger: 'change' }
        ],
        result: [
          { required: true, message: '请输入维修结果', trigger: 'blur' }
        ],
        cost: [
          { required: true, message: '请输入维修费用', trigger: 'blur' }
        ]
      }
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
      if (status === '待处理') return 'info'
      if (status === '处理中') return 'warning'
      if (status === '已完成') return 'success'
      if (status === '已取消') return 'danger'
      return ''
    },
    handleCreate() {
      this.$router.push('/repair-manage/repair-add')
    },
    handleUpdate(row) {
      this.$router.push(`/repair-manage/repair-add?id=${row.id}`)
    },
    handleProcess(row) {
      this.dialogStatus = 'process'
      this.repairForm = Object.assign({}, row)
      this.dialogVisible = true
    },
    handleComplete(row) {
      this.dialogStatus = 'complete'
      this.repairForm = Object.assign({}, row)
      this.dialogVisible = true
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const index = this.list.findIndex(item => item.id === this.repairForm.id)
          
          if (this.dialogStatus === 'process') {
            this.list[index].status = '处理中'
            this.list[index].worker = this.repairForm.worker
            this.$message({
              type: 'success',
              message: '报修单已分配给维修人员'
            })
          } else if (this.dialogStatus === 'complete') {
            this.list[index].status = '已完成'
            this.list[index].result = this.repairForm.result
            this.list[index].cost = this.repairForm.cost
            this.$message({
              type: 'success',
              message: '报修单已完成'
            })
          }
          
          this.dialogVisible = false
        } else {
          return false
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确认要删除该报修单吗?', '提示', {
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