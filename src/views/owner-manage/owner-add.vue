<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>添加业主</span>
      </div>
      <el-form :model="ownerForm" :rules="rules" ref="ownerForm" label-width="100px" class="owner-form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ownerForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ownerForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="ownerForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ownerForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="楼栋" prop="building">
          <el-select v-model="ownerForm.building" placeholder="请选择楼栋">
            <el-option label="A栋" value="A栋"></el-option>
            <el-option label="B栋" value="B栋"></el-option>
            <el-option label="C栋" value="C栋"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单元" prop="unit">
          <el-select v-model="ownerForm.unit" placeholder="请选择单元">
            <el-option label="1单元" value="1单元"></el-option>
            <el-option label="2单元" value="2单元"></el-option>
            <el-option label="3单元" value="3单元"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房号" prop="room">
          <el-input v-model="ownerForm.room" placeholder="请输入房号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ownerForm.password" type="password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="ownerForm.confirmPassword" type="password" placeholder="请再次输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="ownerForm.remark" placeholder="请输入备注信息"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ownerForm')">立即创建</el-button>
          <el-button @click="resetForm('ownerForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'OwnerAdd',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ownerForm.confirmPassword !== '') {
          this.$refs.ownerForm.validateField('confirmPassword')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ownerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ownerForm: {
        username: '',
        name: '',
        phone: '',
        email: '',
        building: '',
        unit: '',
        room: '',
        password: '',
        confirmPassword: '',
        remark: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        building: [
          { required: true, message: '请选择楼栋', trigger: 'change' }
        ],
        unit: [
          { required: true, message: '请选择单元', trigger: 'change' }
        ],
        room: [
          { required: true, message: '请输入房号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            message: '业主添加成功',
            type: 'success'
          })
          this.resetForm(formName)
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
.owner-form {
  width: 600px;
  margin: 0 auto;
}
</style> 