<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>报修申请</span>
      </div>
      <el-form :model="repairForm" :rules="rules" ref="repairForm" label-width="100px">
        <el-form-item label="报修类型" prop="type">
          <el-select v-model="repairForm.type" placeholder="请选择报修类型">
            <el-option label="水电维修" value="水电维修"></el-option>
            <el-option label="家具维修" value="家具维修"></el-option>
            <el-option label="电器维修" value="电器维修"></el-option>
            <el-option label="公共设施" value="公共设施"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报修标题" prop="title">
          <el-input v-model="repairForm.title" placeholder="请输入报修标题"></el-input>
        </el-form-item>
        <el-form-item label="报修内容" prop="content">
          <el-input type="textarea" v-model="repairForm.content" placeholder="请详细描述报修内容" :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="repairForm.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="期望上门时间" prop="expected_time">
          <el-date-picker
            v-model="repairForm.expected_time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['09:00:00', '18:00:00']">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="图片上传">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :file-list="fileList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="handleChange">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('repairForm')">提交申请</el-button>
          <el-button @click="resetForm('repairForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'RepairApply',
  data() {
    return {
      repairForm: {
        type: '',
        title: '',
        content: '',
        phone: '',
        expected_time: '',
        images: []
      },
      rules: {
        type: [
          { required: true, message: '请选择报修类型', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入报修标题', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入报修内容', trigger: 'blur' },
          { min: 5, max: 500, message: '长度在 5 到 500 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        expected_time: [
          { required: true, message: '请选择期望上门时间', trigger: 'change' }
        ]
      },
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 处理图片上传
          this.repairForm.images = this.fileList.map(file => file.url || URL.createObjectURL(file.raw))
          this.$message.success('报修申请提交成功')
          this.resetForm(formName)
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.fileList = []
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-5) // 限制最多上传5张图片
    }
  }
}
</script>

<style scoped>
</style> 