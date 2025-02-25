<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>信息公告</span>
      </div>
      <div class="notice-content">
        <el-table
          v-loading="listLoading"
          :data="noticeList"
          element-loading-text="加载中..."
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="序号" width="80">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="标题" prop="title" />
          <el-table-column align="center" label="发布时间" prop="publish_time" width="180" />
          <el-table-column align="center" label="操作" width="120">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="viewNotice(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 查看公告详情对话框 -->
    <el-dialog title="公告详情" :visible.sync="dialogVisible" width="50%">
      <h3 class="notice-title">{{ currentNotice.title }}</h3>
      <div class="notice-info">
        <span>发布时间：{{ currentNotice.publish_time }}</span>
        <span>发布人：{{ currentNotice.publisher }}</span>
      </div>
      <div class="notice-detail" v-html="currentNotice.content"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Notice',
  data() {
    return {
      listLoading: false,
      noticeList: [
        {
          id: 1,
          title: '物业管理系统上线通知',
          publish_time: '2023-02-20 10:00:00',
          publisher: '系统管理员',
          content: '<p>尊敬的业主：</p><p>物业管理系统已正式上线，欢迎使用！</p>'
        },
        {
          id: 2,
          title: '2023年物业费缴纳通知',
          publish_time: '2023-02-21 14:30:00',
          publisher: '财务部',
          content: '<p>尊敬的业主：</p><p>请于2023年3月31日前缴纳2023年度物业费。</p>'
        }
      ],
      dialogVisible: false,
      currentNotice: {}
    }
  },
  methods: {
    viewNotice(notice) {
      this.currentNotice = notice
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>
.notice-content {
  margin-top: 20px;
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