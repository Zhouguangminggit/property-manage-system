<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>车位申请</span>
      </div>
      <el-form :model="applyForm" :rules="rules" ref="applyForm" label-width="100px">
        <el-form-item label="车牌号码" prop="car_number">
          <el-input v-model="applyForm.car_number" placeholder="请输入车牌号码"></el-input>
        </el-form-item>
        <el-form-item label="车辆品牌" prop="car_brand">
          <el-input v-model="applyForm.car_brand" placeholder="请输入车辆品牌"></el-input>
        </el-form-item>
        <el-form-item label="车辆型号" prop="car_model">
          <el-input v-model="applyForm.car_model" placeholder="请输入车辆型号"></el-input>
        </el-form-item>
        <el-form-item label="车辆颜色" prop="car_color">
          <el-input v-model="applyForm.car_color" placeholder="请输入车辆颜色"></el-input>
        </el-form-item>
        <el-form-item label="申请类型" prop="apply_type">
          <el-select v-model="applyForm.apply_type" placeholder="请选择申请类型">
            <el-option label="固定车位" value="fixed"></el-option>
            <el-option label="临时车位" value="temporary"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请时长" prop="duration" v-if="applyForm.apply_type === 'fixed'">
          <el-select v-model="applyForm.duration" placeholder="请选择申请时长">
            <el-option label="1个月" value="1"></el-option>
            <el-option label="3个月" value="3"></el-option>
            <el-option label="6个月" value="6"></el-option>
            <el-option label="12个月" value="12"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="applyForm.remark" placeholder="请输入备注信息"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('applyForm')">提交申请</el-button>
          <el-button @click="resetForm('applyForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card" style="margin-top: 20px;">
      <div slot="header" class="clearfix">
        <span>申请记录</span>
      </div>
      <el-table
        :data="applyList"
        border
        style="width: 100%">
        <el-table-column
          prop="car_number"
          label="车牌号码"
          width="120">
        </el-table-column>
        <el-table-column
          prop="apply_type"
          label="申请类型"
          width="120">
          <template slot-scope="scope">
            {{ scope.row.apply_type === 'fixed' ? '固定车位' : '临时车位' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="apply_time"
          label="申请时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="120">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status === '已通过'">{{ scope.row.status }}</el-tag>
            <el-tag type="danger" v-else-if="scope.row.status === '已拒绝'">{{ scope.row.status }}</el-tag>
            <el-tag type="info" v-else>{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ParkingApply',
  data() {
    return {
      applyForm: {
        car_number: '',
        car_brand: '',
        car_model: '',
        car_color: '',
        apply_type: '',
        duration: '',
        remark: ''
      },
      rules: {
        car_number: [
          { required: true, message: '请输入车牌号码', trigger: 'blur' }
        ],
        car_brand: [
          { required: true, message: '请输入车辆品牌', trigger: 'blur' }
        ],
        car_model: [
          { required: true, message: '请输入车辆型号', trigger: 'blur' }
        ],
        car_color: [
          { required: true, message: '请输入车辆颜色', trigger: 'blur' }
        ],
        apply_type: [
          { required: true, message: '请选择申请类型', trigger: 'change' }
        ],
        duration: [
          { required: true, message: '请选择申请时长', trigger: 'change' }
        ]
      },
      applyList: [
        {
          id: 1,
          car_number: '京A12345',
          apply_type: 'fixed',
          apply_time: '2023-02-20 10:00:00',
          status: '审核中',
          remark: '希望能分配靠近电梯的车位'
        },
        {
          id: 2,
          car_number: '京B67890',
          apply_type: 'temporary',
          apply_time: '2023-02-15 14:30:00',
          status: '已通过',
          remark: '临时访客车位'
        }
      ]
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message.success('申请提交成功，请等待审核')
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
</style> 