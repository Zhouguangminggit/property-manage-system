<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="角色名称/标识"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        添加角色
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
        prop="name"
        label="角色名称"
        align="center"
        width="150"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="key"
        label="角色标识"
        align="center"
        width="150"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间"
        align="center"
        width="180"
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
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="true"
            :inactive-value="false"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="250"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            编辑
          </el-button>
          <el-button type="success" size="mini" @click="handlePermission(scope.row)">
            权限
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

    <!-- 添加或修改角色对话框 -->
    <el-dialog :title="dialogStatus === 'create' ? '添加角色' : '编辑角色'" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="角色标识" prop="key">
          <el-input v-model="temp.key" :disabled="dialogStatus === 'update'" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="temp.description" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="temp.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="true"
            :inactive-value="false"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确认</el-button>
      </div>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="permissionDialogVisible">
      <el-form label-position="left" label-width="100px">
        <el-form-item label="角色名称">
          <span>{{ currentRole.name }}</span>
        </el-form-item>
        <el-form-item label="角色标识">
          <span>{{ currentRole.key }}</span>
        </el-form-item>
        <el-form-item label="权限分配">
          <el-tree
            ref="permissionTree"
            :data="permissionData"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            default-expand-all
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePermission">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  name: 'Role',
  components: { Pagination },
  data() {
    return {
      list: [
        {
          id: 1,
          name: '超级管理员',
          key: 'admin',
          description: '拥有所有权限',
          create_time: '2023-01-01 00:00:00',
          status: true
        },
        {
          id: 2,
          name: '业主',
          key: 'owner',
          description: '业主权限',
          create_time: '2023-01-01 00:00:00',
          status: true
        },
        {
          id: 3,
          name: '物业人员',
          key: 'property',
          description: '物业管理人员权限',
          create_time: '2023-01-01 00:00:00',
          status: true
        }
      ],
      total: 3,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: '',
        sort: '+id'
      },
      temp: {
        id: undefined,
        name: '',
        key: '',
        description: '',
        status: true
      },
      dialogFormVisible: false,
      dialogStatus: '',
      permissionDialogVisible: false,
      currentRole: {},
      permissionData: [
        {
          id: 1,
          label: '系统管理',
          children: [
            { id: 11, label: '用户管理' },
            { id: 12, label: '角色管理' },
            { id: 13, label: '菜单管理' }
          ]
        },
        {
          id: 2,
          label: '业主管理',
          children: [
            { id: 21, label: '业主信息' },
            { id: 22, label: '房屋信息' }
          ]
        },
        {
          id: 3,
          label: '缴费管理',
          children: [
            { id: 31, label: '缴费项目' },
            { id: 32, label: '缴费记录' },
            { id: 33, label: '缴费统计' }
          ]
        },
        {
          id: 4,
          label: '报修管理',
          children: [
            { id: 41, label: '报修申请' },
            { id: 42, label: '报修处理' }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        key: [{ required: true, message: '角色标识不能为空', trigger: 'blur' }]
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
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        key: '',
        description: '',
        status: true
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = this.list.length + 1
          this.temp.create_time = new Date().toLocaleString()
          this.list.unshift(this.temp)
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // 复制对象，避免修改原始数据
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const index = this.list.findIndex(v => v.id === this.temp.id)
          this.list.splice(index, 1, this.temp)
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除该角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.list.findIndex(v => v.id === row.id)
        this.list.splice(index, 1)
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleStatusChange(row) {
      this.$message({
        message: `角色 ${row.name} 状态已${row.status ? '启用' : '禁用'}`,
        type: 'success'
      })
    },
    handlePermission(row) {
      this.currentRole = Object.assign({}, row)
      this.permissionDialogVisible = true
      this.$nextTick(() => {
        // 根据角色已有权限设置选中节点
        // 这里简单模拟，实际应该根据后端返回的权限数据设置
        if (row.key === 'admin') {
          // 超级管理员拥有所有权限
          this.$refs.permissionTree.setCheckedNodes(this.getAllPermissionNodes(this.permissionData))
        } else if (row.key === 'owner') {
          // 业主只有部分权限
          this.$refs.permissionTree.setCheckedKeys([21, 31, 32, 41])
        } else if (row.key === 'property') {
          // 物业人员权限
          this.$refs.permissionTree.setCheckedKeys([21, 22, 31, 32, 33, 41, 42])
        }
      })
    },
    getAllPermissionNodes(data) {
      let nodes = []
      data.forEach(item => {
        if (item.children) {
          nodes = nodes.concat(this.getAllPermissionNodes(item.children))
        }
        nodes.push(item)
      })
      return nodes
    },
    savePermission() {
      const checkedKeys = this.$refs.permissionTree.getCheckedKeys()
      const halfCheckedKeys = this.$refs.permissionTree.getHalfCheckedKeys()
      const allKeys = checkedKeys.concat(halfCheckedKeys)
      
      this.$notify({
        title: '成功',
        message: `已成功分配 ${allKeys.length} 个权限给角色 ${this.currentRole.name}`,
        type: 'success',
        duration: 2000
      })
      this.permissionDialogVisible = false
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