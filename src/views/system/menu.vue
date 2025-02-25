<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="菜单名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        添加菜单
      </el-button>
    </div>

    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        prop="name"
        label="菜单名称"
        width="180"
      />
      <el-table-column
        prop="icon"
        label="图标"
        width="100"
      >
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="path"
        label="路由路径"
        width="180"
      />
      <el-table-column
        prop="component"
        label="组件路径"
        width="180"
      />
      <el-table-column
        prop="sort"
        label="排序"
        width="80"
      />
      <el-table-column
        prop="type"
        label="类型"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" type="primary">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === 2" type="warning">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="permission"
        label="权限标识"
        width="150"
      />
      <el-table-column
        prop="visible"
        label="可见性"
        width="100"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.visible"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="true"
            :inactive-value="false"
            @change="handleVisibleChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="dialogStatus === 'create' ? '添加菜单' : '编辑菜单'" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 80%; margin: 0 auto;">
        <el-form-item label="上级菜单">
          <el-cascader
            v-model="temp.parentId"
            :options="menuOptions"
            :props="{ checkStrictly: true, value: 'id', label: 'name' }"
            clearable
            placeholder="请选择上级菜单"
          />
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="temp.type">
            <el-radio :label="0">目录</el-radio>
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="图标" prop="icon" v-if="temp.type !== 2">
          <el-input v-model="temp.icon" placeholder="请输入图标类名">
            <template slot="prepend"><i :class="temp.icon"></i></template>
          </el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="temp.sort" :min="0" :max="999" controls-position="right" />
        </el-form-item>
        <el-form-item label="路由路径" prop="path" v-if="temp.type !== 2">
          <el-input v-model="temp.path" placeholder="请输入路由路径" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component" v-if="temp.type === 1">
          <el-input v-model="temp.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="权限标识" prop="permission" v-if="temp.type !== 0">
          <el-input v-model="temp.permission" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item label="可见性" prop="visible" v-if="temp.type !== 2">
          <el-switch
            v-model="temp.visible"
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
  </div>
</template>

<script>
export default {
  name: 'Menu',
  data() {
    return {
      tableData: [
        {
          id: 1,
          name: '系统管理',
          icon: 'el-icon-setting',
          path: '/system',
          component: 'Layout',
          sort: 1,
          type: 0,
          permission: '',
          visible: true,
          children: [
            {
              id: 11,
              name: '用户管理',
              icon: 'el-icon-user',
              path: 'user',
              component: 'system/user',
              sort: 1,
              type: 1,
              permission: 'system:user:list',
              visible: true,
              children: [
                {
                  id: 111,
                  name: '用户查询',
                  icon: '',
                  path: '',
                  component: '',
                  sort: 1,
                  type: 2,
                  permission: 'system:user:query',
                  visible: true
                },
                {
                  id: 112,
                  name: '用户新增',
                  icon: '',
                  path: '',
                  component: '',
                  sort: 2,
                  type: 2,
                  permission: 'system:user:add',
                  visible: true
                },
                {
                  id: 113,
                  name: '用户修改',
                  icon: '',
                  path: '',
                  component: '',
                  sort: 3,
                  type: 2,
                  permission: 'system:user:edit',
                  visible: true
                },
                {
                  id: 114,
                  name: '用户删除',
                  icon: '',
                  path: '',
                  component: '',
                  sort: 4,
                  type: 2,
                  permission: 'system:user:remove',
                  visible: true
                }
              ]
            },
            {
              id: 12,
              name: '角色管理',
              icon: 'el-icon-s-custom',
              path: 'role',
              component: 'system/role',
              sort: 2,
              type: 1,
              permission: 'system:role:list',
              visible: true
            },
            {
              id: 13,
              name: '菜单管理',
              icon: 'el-icon-menu',
              path: 'menu',
              component: 'system/menu',
              sort: 3,
              type: 1,
              permission: 'system:menu:list',
              visible: true
            }
          ]
        },
        {
          id: 2,
          name: '业主管理',
          icon: 'el-icon-house',
          path: '/owner',
          component: 'Layout',
          sort: 2,
          type: 0,
          permission: '',
          visible: true,
          children: [
            {
              id: 21,
              name: '业主信息',
              icon: 'el-icon-user',
              path: 'info',
              component: 'owner/info',
              sort: 1,
              type: 1,
              permission: 'owner:info:list',
              visible: true
            },
            {
              id: 22,
              name: '房屋信息',
              icon: 'el-icon-office-building',
              path: 'house',
              component: 'owner/house',
              sort: 2,
              type: 1,
              permission: 'owner:house:list',
              visible: true
            }
          ]
        },
        {
          id: 3,
          name: '缴费管理',
          icon: 'el-icon-money',
          path: '/payment',
          component: 'Layout',
          sort: 3,
          type: 0,
          permission: '',
          visible: true,
          children: [
            {
              id: 31,
              name: '缴费项目',
              icon: 'el-icon-s-order',
              path: 'item',
              component: 'payment/item',
              sort: 1,
              type: 1,
              permission: 'payment:item:list',
              visible: true
            },
            {
              id: 32,
              name: '缴费记录',
              icon: 'el-icon-document',
              path: 'record',
              component: 'payment/record',
              sort: 2,
              type: 1,
              permission: 'payment:record:list',
              visible: true
            }
          ]
        },
        {
          id: 4,
          name: '报修管理',
          icon: 'el-icon-s-cooperation',
          path: '/repair',
          component: 'Layout',
          sort: 4,
          type: 0,
          permission: '',
          visible: true,
          children: [
            {
              id: 41,
              name: '报修申请',
              icon: 'el-icon-edit-outline',
              path: 'apply',
              component: 'repair/apply',
              sort: 1,
              type: 1,
              permission: 'repair:apply:list',
              visible: true
            },
            {
              id: 42,
              name: '报修处理',
              icon: 'el-icon-s-claim',
              path: 'process',
              component: 'repair/process',
              sort: 2,
              type: 1,
              permission: 'repair:process:list',
              visible: true
            }
          ]
        }
      ],
      listQuery: {
        keyword: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {
        id: undefined,
        parentId: null,
        name: '',
        icon: '',
        path: '',
        component: '',
        sort: 0,
        type: 1,
        permission: '',
        visible: true
      },
      menuOptions: [],
      rules: {
        name: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '菜单类型不能为空', trigger: 'change' }],
        sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getMenuOptions()
  },
  methods: {
    getMenuOptions() {
      // 构建菜单选项，用于上级菜单选择
      this.menuOptions = this.buildMenuOptions(this.tableData)
    },
    buildMenuOptions(menus) {
      // 递归构建菜单选项
      const options = []
      menus.forEach(menu => {
        const option = {
          id: menu.id,
          name: menu.name
        }
        if (menu.children && menu.children.length > 0 && menu.type !== 2) {
          option.children = this.buildMenuOptions(menu.children)
        }
        options.push(option)
      })
      return options
    },
    handleFilter() {
      // 实现搜索功能
      console.log('搜索关键词:', this.listQuery.keyword)
      // 实际项目中应该调用API进行搜索
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        parentId: null,
        name: '',
        icon: '',
        path: '',
        component: '',
        sort: 0,
        type: 1,
        permission: '',
        visible: true
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
          // 生成新ID
          this.temp.id = Date.now()

          // 根据parentId找到父菜单并添加
          if (this.temp.parentId) {
            const parentId = Array.isArray(this.temp.parentId)
              ? this.temp.parentId[this.temp.parentId.length - 1]
              : this.temp.parentId

            this.addMenuToParent(this.tableData, parentId, { ...this.temp })
          } else {
            // 添加到顶级菜单
            this.tableData.push({ ...this.temp })
          }

          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })

          // 更新菜单选项
          this.getMenuOptions()
        }
      })
    },
    addMenuToParent(menus, parentId, newMenu) {
      // 递归查找父菜单并添加子菜单
      for (let i = 0; i < menus.length; i++) {
        if (menus[i].id === parentId) {
          if (!menus[i].children) {
            menus[i].children = []
          }
          menus[i].children.push(newMenu)
          return true
        }
        if (menus[i].children && menus[i].children.length > 0) {
          if (this.addMenuToParent(menus[i].children, parentId, newMenu)) {
            return true
          }
        }
      }
      return false
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      // 设置parentId
      if (this.findParentId(this.tableData, row.id)) {
        this.temp.parentId = [this.findParentId(this.tableData, row.id)]
      } else {
        this.temp.parentId = null
      }

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    findParentId(menus, id, parentId = null) {
      // 递归查找父菜单ID
      for (let i = 0; i < menus.length; i++) {
        if (menus[i].id === id) {
          return parentId
        }
        if (menus[i].children && menus[i].children.length > 0) {
          const result = this.findParentId(menus[i].children, id, menus[i].id)
          if (result) {
            return result
          }
        }
      }
      return null
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // 处理parentId
          if (Array.isArray(tempData.parentId)) {
            tempData.parentId = tempData.parentId[tempData.parentId.length - 1]
          }

          // 更新菜单
          this.updateMenuById(this.tableData, tempData)

          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })

          // 更新菜单选项
          this.getMenuOptions()
        }
      })
    },
    updateMenuById(menus, updatedMenu) {
      // 递归查找并更新菜单
      for (let i = 0; i < menus.length; i++) {
        if (menus[i].id === updatedMenu.id) {
          // 保留children
          const children = menus[i].children
          menus[i] = { ...updatedMenu }
          if (children) {
            menus[i].children = children
          }
          return true
        }
        if (menus[i].children && menus[i].children.length > 0) {
          if (this.updateMenuById(menus[i].children, updatedMenu)) {
            return true
          }
        }
      }
      return false
    },
    handleDelete(row) {
      this.$confirm('确认删除该菜单及其子菜单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除菜单
        this.deleteMenuById(this.tableData, row.id)

        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })

        // 更新菜单选项
        this.getMenuOptions()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteMenuById(menus, id) {
      // 递归查找并删除菜单
      for (let i = 0; i < menus.length; i++) {
        if (menus[i].id === id) {
          menus.splice(i, 1)
          return true
        }
        if (menus[i].children && menus[i].children.length > 0) {
          if (this.deleteMenuById(menus[i].children, id)) {
            return true
          }
        }
      }
      return false
    },
    handleVisibleChange(row) {
      this.$message({
        message: `菜单 ${row.name} 已${row.visible ? '显示' : '隐藏'}`,
        type: 'success'
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