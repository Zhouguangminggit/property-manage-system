<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ isEdit ? '编辑车位' : '添加车位' }}</span>
      </div>
      <el-form :model="parkingForm" :rules="rules" ref="parkingForm" label-width="100px" class="parking-form">
        <el-form-item label="车位编号" prop="parking_number">
          <el-input v-model="parkingForm.parking_number" placeholder="请输入车位编号"></el-input>
        </el-form-item>
        <el-form-item label="位置" prop="location">
          <el-input v-model="parkingForm.location" placeholder="请输入位置"></el-input>
        </el-form-item>
        <el-form-item label="面积(㎡)" prop="area">
          <el-input-number v-model="parkingForm.area" :min="1" :max="100" :precision="2"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="parkingForm.status" placeholder="请选择状态">
            <el-option label="空闲" value="空闲"></el-option>
            <el-option label="已使用" value="已使用"></el-option>
            <el-option label="维修中" value="维修中"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="parkingForm.remark" placeholder="请输入备注信息"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('parkingForm')">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ParkingAdd',
  data() {
    return {
      parkingForm: {
        parking_number: '',
        location: '',
        area: 15,
        status: '空闲',
        remark: ''
      },
      rules: {
        parking_number: [
          { required: true, message: '请输入车位编号', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        location: [
          { required: true, message: '请输入位置', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请输入面积', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      isEdit: false,
      parkingId: null
    }
  },
  created() {
    // 判断是否为编辑模式
    if (this.$route.query.id) {
      this.isEdit = true
      this.parkingId = parseInt(this.$route.query.id)
      this.getParkingDetail()
    }
  },
  methods: {
    getParkingDetail() {
      // 模拟获取车位详情
      if (this.parkingId === 1) {
        this.parkingForm = {
          parking_number: 'A-101',
          location: '地下一层A区',
          area: 15,
          status: '已使用',
          remark: '靠近电梯'
        }
      } else if (this.parkingId === 2) {
        this.parkingForm = {
          parking_number: 'A-102',
          location: '地下一层A区',
          area: 15,
          status: '空闲',
          remark: ''
        }
      } else if (this.parkingId === 3) {
        this.parkingForm = {
          parking_number: 'B-101',
          location: '地下一层B区',
          area: 18,
          status: '已使用',
          remark: '靠近出口'
        }
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 模拟提交
          this.$message({
            message: this.isEdit ? '车位更新成功' : '车位添加成功',
            type: 'success'
          })
          this.$router.push('/parking-manage/parking-list')
        } else {
          return false
        }
      })
    },
    cancel() {
      this.$router.push('/parking-manage/parking-list')
    }
  }
}
</script>

<style scoped>
.parking-form {
  width: 600px;
  margin: 0 auto;
}
</style> 