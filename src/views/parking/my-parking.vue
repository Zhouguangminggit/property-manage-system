<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>我的车位</span>
      </div>
      <div v-if="parkingList.length > 0">
        <el-table :data="parkingList" border style="width: 100%">
          <el-table-column prop="parking_number" label="车位编号" width="180">
          </el-table-column>
          <el-table-column prop="location" label="位置"> </el-table-column>
          <el-table-column prop="area" label="面积(㎡)" width="120">
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.status === '已使用'">{{
                scope.row.status
              }}</el-tag>
              <el-tag type="info" v-else>{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="start_date" label="开始日期" width="180">
          </el-table-column>
          <el-table-column prop="end_date" label="结束日期" width="180">
          </el-table-column>
        </el-table>
      </div>
      <div v-else class="empty-data">
        <el-empty description="暂无车位信息"></el-empty>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "MyParking",
  data() {
    return {
      parkingList: [
        {
          id: 1,
          parking_number: "A-101",
          location: "地下一层A区",
          area: 15,
          status: "已使用",
          start_date: "2023-01-01",
          end_date: "2023-12-31",
        },
      ],
    };
  },
};
</script>

<style scoped>
.empty-data {
  padding: 30px 0;
}
</style>
