<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ isEdit ? '编辑公告' : '添加公告' }}</span>
      </div>
      <el-form :model="noticeForm" :rules="rules" ref="noticeForm" label-width="100px" class="notice-form">
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="noticeForm.title" placeholder="请输入公告标题"></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <div class="editor-container">
            <!-- 这里可以集成富文本编辑器，如 Tinymce、Quill 等 -->
            <el-input type="textarea" v-model="noticeForm.content" :rows="10" placeholder="请输入公告内容"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="发布状态" prop="status">
          <el-radio-group v-model="noticeForm.status">
            <el-radio label="已发布">立即发布</el-radio>
            <el-radio label="草稿">保存为草稿</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('noticeForm')">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'NoticeAdd',
  data() {
    return {
      noticeForm: {
        title: '',
        content: '',
        status: '已发布'
      },
      rules: {
        title: [
          { required: true, message: '请输入公告标题', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入公告内容', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择发布状态', trigger: 'change' }
        ]
      },
      isEdit: false,
      noticeId: null
    }
  },
  created() {
    // 判断是否为编辑模式
    if (this.$route.query.id) {
      this.isEdit = true
      this.noticeId = parseInt(this.$route.query.id)
      this.getNoticeDetail()
    }
  },
  methods: {
    getNoticeDetail() {
      // 模拟获取公告详情
      if (this.noticeId === 1) {
        this.noticeForm = {
          title: '物业管理系统上线通知',
          content: '<p>尊敬的业主：</p><p>物业管理系统已正式上线，欢迎使用！</p>',
          status: '已发布'
        }
      } else if (this.noticeId === 2) {
        this.noticeForm = {
          title: '2023年物业费缴纳通知',
          content: '<p>尊敬的业主：</p><p>请于2023年3月31日前缴纳2023年度物业费。</p>',
          status: '已发布'
        }
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 模拟提交
          this.$message({
            message: this.isEdit ? '公告更新成功' : '公告发布成功',
            type: 'success'
          })
          this.$router.push('/notice-manage/notice-list')
        } else {
          return false
        }
      })
    },
    cancel() {
      this.$router.push('/notice-manage/notice-list')
    }
  }
}
</script>

<style scoped>
.notice-form {
  width: 800px;
  margin: 0 auto;
}
.editor-container {
  min-height: 300px;
}
</style> 