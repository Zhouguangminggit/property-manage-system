<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div class="user-profile">
            <div class="user-avatar">
              <el-avatar :size="100" :src="avatar"></el-avatar>
            </div>
            <div class="user-info">
              <h3>{{ name }}</h3>
              <p>{{ userType === 'admin' ? '管理员' : '业主' }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>基本资料</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="handleEdit">编辑</el-button>
          </div>
          <el-form label-position="left" label-width="100px">
            <el-form-item label="用户名">
              <span>{{ username }}</span>
            </el-form-item>
            <el-form-item label="姓名">
              <span>{{ name }}</span>
            </el-form-item>
            <el-form-item v-if="userType === 'admin'" label="工号">
              <span>{{ employeeId }}</span>
            </el-form-item>
            <el-form-item v-if="userType === 'owner'" label="手机号">
              <span>{{ phone }}</span>
            </el-form-item>
            <el-form-item label="邮箱">
              <span>{{ email }}</span>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card class="box-card" style="margin-top: 20px;">
          <div slot="header" class="clearfix">
            <span>修改密码</span>
          </div>
          <el-form :model="passwordForm" :rules="passwordRules" ref="passwordForm" label-width="100px">
            <el-form-item label="原密码" prop="oldPassword">
              <el-input v-model="passwordForm.oldPassword" type="password" show-password></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="passwordForm.newPassword" type="password" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input v-model="passwordForm.confirmPassword" type="password" show-password></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitPasswordForm">修改密码</el-button>
              <el-button @click="resetPasswordForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <!-- 编辑个人信息对话框 -->
    <el-dialog title="编辑个人信息" :visible.sync="dialogVisible" width="40%">
      <el-form :model="userForm" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="userForm.name"></el-input>
        </el-form-item>
        <el-form-item v-if="userType === 'owner'" label="手机号">
          <el-input v-model="userForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateUserInfo">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Profile',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.passwordForm.confirmPassword !== '') {
          this.$refs.passwordForm.validateField('confirmPassword')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      username: 'admin',
      email: 'admin@example.com',
      dialogVisible: false,
      userForm: {
        name: '',
        phone: '',
        email: ''
      },
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordRules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'userType',
      'employeeId',
      'phone'
    ])
  },
  created() {
    this.userForm.name = this.name
    this.userForm.phone = this.phone
    this.userForm.email = this.email
  },
  methods: {
    handleEdit() {
      this.dialogVisible = true
    },
    updateUserInfo() {
      this.$message.success('个人信息更新成功')
      this.dialogVisible = false
    },
    submitPasswordForm() {
      this.$refs.passwordForm.validate(valid => {
        if (valid) {
          this.$message.success('密码修改成功')
          this.resetPasswordForm()
        } else {
          return false
        }
      })
    },
    resetPasswordForm() {
      this.$refs.passwordForm.resetFields()
    }
  }
}
</script>

<style scoped>
.user-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}
.user-avatar {
  margin-bottom: 20px;
}
.user-info {
  text-align: center;
}
.user-info h3 {
  margin: 10px 0;
}
.user-info p {
  color: #999;
}
</style> 