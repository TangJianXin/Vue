<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-input v-model="name" style="width:160px" placeholder="输入姓名查询"></el-input>
      <el-button type="primary" @click="findByName">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="quotaId" label="采集编号"></el-table-column>
        <el-table-column prop="heart" label="心率"></el-table-column>
        <el-table-column prop="breathe" label="呼吸次数"></el-table-column>
        <el-table-column prop="temperature" label="体温"></el-table-column>
        <el-table-column prop="oldPeople" label="老人"></el-table-column>
        <el-table-column width="200" prop="date" label="采集时间"></el-table-column>
        <el-table-column label="操作" v-if="isAdmin">
          <template slot-scope="scope">
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination" style="text-align: left;margin-top: 10px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="count"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import storage from "../store/storage.js";
export default {
  data() {
    return {
      tableData: [],
      selectTable: [],
      quotas: [],
      offset: 0,
      limit: 10,
      count: 0,
      currentPage: 1,
      index: 0,
      role: "",
      isAdmin: false,
      name: ""
    };
  },
  components: {
    headTop
  },
  activated: function() {
    this.initData();
  },
  created() {
    this.role = storage.get("1").role;
    if (this.role == "管理员") {
      this.isAdmin = true;
    }
  },
  mounted() {
    //this.initData();
  },
  methods: {
    getDate(Timestamp) {
      /*
            格式化时间
        */
      var d = new Date(Timestamp);
      var date =
        d.getFullYear() +
        "-" +
        (d.getMonth() + 1) +
        "-" +
        d.getDate() +
        " " +
        d.getHours() +
        ":" +
        d.getMinutes() +
        ":" +
        d.getSeconds();
      return date;
    },
    getDate1(Timestamp) {
      /*
            格式化时间
        */
      var d = new Date(Timestamp);
      var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      return date;
    },
    async initData() {
      try {
        this.$http.get("quota/findAll").then(res => {
          this.quotas = res.data.data;
          this.count = this.quotas.length;
          this.getTableData();
        });
      } catch (err) {
        console.log("获取数据失败", err);
      }
    },
    getTableData() {
      this.tableData.splice(0, this.tableData.length);
      var i = this.offset;
      var index = i + this.limit;
      if (index >= this.quotas.length) {
        index = this.quotas.length;
      }
      for (i; i < index; i++) {
        const tableData = {};
        tableData.quotaId = this.quotas[i].quotaId;
        tableData.heart = this.quotas[i].heartRate;
        tableData.breathe = this.quotas[i].breatheRate;
        tableData.temperature = this.quotas[i].temperature.toFixed(2);
        tableData.oldPeople = this.quotas[i].oldPeopleByOldpeople.name;
        tableData.date = this.getDate(this.quotas[i].date);
        this.tableData.push(tableData);
      }
    },
    async handleDelete(index, row) {
      try {
        let form = new FormData();
        form.append("quotaId", row.quotaId);
        this.$http.post("quota/deleteById", form).then(res => {
          if (res.data.code == 1) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.initData();
          } else {
            this.$message.error("删除失败！");
            throw new Error(res.message);
          }
        });
      } catch (err) {
        this.$message({
          type: "error",
          message: err.message
        });
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getTableData();
    },
    async findByName() {
      try {
        this.$http
          .get("quota/findByName", {
            params: {
              name: this.name
            }
          })
          .then(res => {
            if (res.data.code == 1) {
              this.quotas = res.data.data;
              this.count = this.quotas.length;
              this.getTableData();
            }
          });
      } catch (err) {
        this.$message.error("查询失败！");
        console.log("获取数据失败", err);
      }
    },
    async handleReset() {
      this.initData();
      this.name = "";
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.table_container {
  padding: 20px;
}
</style>


