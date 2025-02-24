<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>个人信息</span>
      </div>
      <div class="user-profile">
        <div class="box-center">
          <el-avatar :size="100" :src="user.avatar" />
          <div class="user-name">{{ user.name }}</div>
        </div>
        <div class="box-center">
          <div class="user-role">{{ user.user_type === 'admin' ? '管理员' : '业主' }}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Profile',
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'userType'
    ]),
    user() {
      return {
        name: this.name,
        avatar: this.avatar,
        user_type: this.userType
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
  text-align: center;
}

.user-profile {
  .user-name {
    font-weight: bold;
    margin-top: 20px;
  }
  .user-role {
    padding-top: 10px;
    font-weight: 400;
    color: #666;
  }
}
</style> 