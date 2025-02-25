<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ isEdit ? '编辑账单' : '添加账单' }}</span>
      </div>
      <el-form :model="billForm" :rules="rules" ref="billForm" label-width="100px" class="bill-form">
        <el-form-item label="业主" prop="owner_id">
          <el-select v-model="billForm.owner_id" placeholder="请选择业主" filterable>
            <el-option
              v-for="item in ownerOptions"
              :key="item.id"
              :label="`${item.name} (${item.building}${item.unit}${item.room})`"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="费用类型" prop="type">
          <el-select v-model="billForm.type" placeholder="请选择费用类型">
            <el-option label="物业费" value="物业费"></el-option>
            <el-option label="水电费" value="水电费"></el-option>
            <el-option label="车位费" value="车位费"></el-option>
            <el-option label="维修费" value="维修费"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额(元)" prop="amount">
          <el-input-number v-model="billForm.amount" :min="0" :precision="2"></el-input-number>
        </el-form-item>
        <el-form-item label="截止日期" prop="deadline">
          <el-date-picker
            v-model="billForm.deadline"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="billForm.status">
            <el-radio label="未缴费">未缴费</el-radio>
            <el-radio label="已缴费">已缴费</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="billForm.remark" placeholder="请输入备注信息"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('billForm')">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'PaymentAdd',
  data() {
    return {
      billForm: {
        owner_id: '',
        type: '',
        amount: 0,
        deadline: '',
        status: '未缴费',
        remark: ''
      },
      rules: {
        owner_id: [
          { required: true, message: '请选择业主', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择费用类型', trigger: 'change' }
        ],
        amount: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ],
        deadline: [
          { required: true, message: '请选择截止日期', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      ownerOptions: [
        { id: 1, name: '张三', building: 'A栋', unit: '1单元', room: '101' },
        { id: 2, name: '李四', building: 'A栋', unit: '1单元', room: '102' },
        { id: 3, name: '王五', building: 'B栋', unit: '2单元', room: '201' }
      ],
      isEdit: false,
      billId: null
    }
  },
  created() {
    // 判断是否为编辑模式
    if (this.$route.query.id) {
      this.isEdit = true
      this.billId = parseInt(this.$route.query.id)
      this.getBillDetail()
    }
  },
  methods: {
    getBillDetail() {
      // 模拟获取账单详情
      if (this.billId === 1) {
        this.billForm = {
          owner_id: 1,
          type: '物业费',
          amount: 800,
          deadline: '2023-03-31',
          status: '未缴费',
          remark: '2023年第一季度物业费'
        }
      } else if (this.billId === 2) {
        this.billForm = {
          owner_id: 1,
          type: '水电费',
          amount: 320.5,
          deadline: '2023-03-15',
          status: '未缴费',
          remark: '2023年2月水电费'
        }
      } else if (this.billId === 3) {
        this.billForm = {
          owner_id: 2,
          type: '物业费',
          amount: 800,
          deadline: '2023-01-31',
          status: '已缴费',
          remark: '2023年第一季度物业费'
        }
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 模拟提交
          this.$message({
            message: this.isEdit ? '账单更新成功' : '账单添加成功',
            type: 'success'
          })
          this.$router.push('/payment-manage/payment-list')
        } else {
          return false
        }
      })
    },
    cancel() {
      this.$router.push('/payment-manage/payment-list')
    }
  }
}
</script>

<style scoped>
.bill-form {
  width: 600px;
  margin: 0 auto;
}
</style> 