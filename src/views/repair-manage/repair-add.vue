<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ isEdit ? '编辑报修单' : '添加报修单' }}</span>
      </div>
      <el-form :model="repairForm" :rules="rules" ref="repairForm" label-width="100px" class="repair-form">
        <el-form-item label="业主" prop="owner_id">
          <el-select v-model="repairForm.owner_id" placeholder="请选择业主" filterable>
            <el-option
              v-for="item in ownerOptions"
              :key="item.id"
              :label="`${item.name} (${item.building}${item.unit}${item.room})`"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报修类型" prop="type">
          <el-select v-model="repairForm.type" placeholder="请选择报修类型">
            <el-option label="水电维修" value="水电维修"></el-option>
            <el-option label="门窗维修" value="门窗维修"></el-option>
            <el-option label="电器维修" value="电器维修"></el-option>
            <el-option label="家具维修" value="家具维修"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报修描述" prop="description">
          <el-input type="textarea" v-model="repairForm.description" placeholder="请详细描述问题" :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="repairForm.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="期望上门时间" prop="expected_time">
          <el-date-picker
            v-model="repairForm.expected_time"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="紧急程度" prop="urgency">
          <el-radio-group v-model="repairForm.urgency">
            <el-radio label="普通">普通</el-radio>
            <el-radio label="紧急">紧急</el-radio>
            <el-radio label="非常紧急">非常紧急</el-radio>
          </el-radio-group>
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
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="repairForm.remark" placeholder="请输入备注信息"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('repairForm')">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'RepairAdd',
  data() {
    return {
      repairForm: {
        owner_id: '',
        type: '',
        description: '',
        phone: '',
        expected_time: '',
        urgency: '普通',
        remark: ''
      },
      rules: {
        owner_id: [
          { required: true, message: '请选择业主', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择报修类型', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入报修描述', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        expected_time: [
          { required: true, message: '请选择期望上门时间', trigger: 'change' }
        ],
        urgency: [
          { required: true, message: '请选择紧急程度', trigger: 'change' }
        ]
      },
      ownerOptions: [
        { id: 1, name: '张三', building: 'A栋', unit: '1单元', room: '101' },
        { id: 2, name: '李四', building: 'A栋', unit: '1单元', room: '102' },
        { id: 3, name: '王五', building: 'B栋', unit: '2单元', room: '201' }
      ],
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      isEdit: false,
      repairId: null
    }
  },
  created() {
    // 判断是否为编辑模式
    if (this.$route.query.id) {
      this.isEdit = true
      this.repairId = parseInt(this.$route.query.id)
      this.getRepairDetail()
    }
  },
  methods: {
    getRepairDetail() {
      // 模拟获取报修详情
      if (this.repairId === 1) {
        this.repairForm = {
          owner_id: 1,
          type: '水电维修',
          description: '厨房水管漏水，地面已经积水',
          phone: '13800138000',
          expected_time: '2023-02-16 09:00:00',
          urgency: '紧急',
          remark: '希望尽快处理，谢谢'
        }
      } else if (this.repairId === 2) {
        this.repairForm = {
          owner_id: 2,
          type: '门窗维修',
          description: '卧室窗户无法关闭，可能需要更换窗户把手',
          phone: '13900139000',
          expected_time: '2023-02-17 14:00:00',
          urgency: '普通',
          remark: ''
        }
      }
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 模拟提交
          this.$message({
            message: this.isEdit ? '报修单更新成功' : '报修单提交成功',
            type: 'success'
          })
          this.$router.push('/repair-manage/repair-list')
        } else {
          return false
        }
      })
    },
    cancel() {
      this.$router.push('/repair-manage/repair-list')
    }
  }
}
</script>

<style scoped>
.repair-form {
  width: 600px;
  margin: 0 auto;
}
</style> 