<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="标题/内容"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        添加公告
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
        prop="title"
        label="标题"
        min-width="150"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="publisher"
        label="发布人"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.publisher }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="publish_time"
        label="发布时间"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.publish_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === '已发布' ? 'success' : 'info'">{{ scope.row.status }}</el-tag>
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
          <el-button type="success" size="mini" @click="handleView(scope.row)">
            查看
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

    <!-- 查看公告详情对话框 -->
    <el-dialog title="公告详情" :visible.sync="dialogViewVisible" width="50%">
      <h3 class="notice-title">{{ currentNotice.title }}</h3>
      <div class="notice-info">
        <span>发布时间：{{ currentNotice.publish_time }}</span>
        <span>发布人：{{ currentNotice.publisher }}</span>
      </div>
      <div class="notice-detail" v-html="currentNotice.content"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogViewVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  name: 'NoticeList',
  components: { Pagination },
  data() {
    return {
      list: [
        {
          id: 1,
          title: '物业管理系统上线通知',
          publisher: '系统管理员',
          publish_time: '2023-02-20 10:00:00',
          status: '已发布',
          content: '<p>尊敬的业主：</p><p>物业管理系统已正式上线，欢迎使用！</p>'
        },
        {
          id: 2,
          title: '2023年物业费缴纳通知',
          publisher: '财务部',
          publish_time: '2023-02-21 14:30:00',
          status: '已发布',
          content: '<p>尊敬的业主：</p><p>请于2023年3月31日前缴纳2023年度物业费。</p>'
        }
      ],
      total: 2,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: '',
        sort: '+id'
      },
      dialogViewVisible: false,
      currentNotice: {}
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
    handleCreate() {
      this.$router.push('/notice-manage/notice-add')
    },
    handleUpdate(row) {
      this.$router.push(`/notice-manage/notice-add?id=${row.id}`)
    },
    handleView(row) {
      this.currentNotice = row
      this.dialogViewVisible = true
    },
    handleDelete(row) {
      this.$confirm('确认要删除该公告吗?', '提示', {
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
.notice-title {
  text-align: center;
  margin-bottom: 20px;
}
.notice-info {
  display: flex;
  justify-content: space-between;
  color: #999;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}
.notice-detail {
  line-height: 1.8;
}
</style> 