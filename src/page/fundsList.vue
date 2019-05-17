<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-col :span="5">
        <el-date-picker type="date" v-model="beginDate" placeholder="选择开始日期" style="width: 195px;"></el-date-picker>
      </el-col>
      <el-col :span="5">
        <el-date-picker type="date" v-model="endDate" placeholder="选择结束日期" style="width: 195px;"></el-date-picker>
      </el-col>
      <el-button type="primary" @click="findByDate">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="fundsId" label="流水号"></el-table-column>
        <el-table-column prop="amount" label="金额"></el-table-column>
        <el-table-column prop="detail" label="说明"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="operator" label="操作人"></el-table-column>
        <el-table-column width="200" prop="date" label="时间"></el-table-column>
        <el-table-column label="操作" v-if="isAdmin">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
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
      dialogFormVisible: false,
      tableData: [],
      selectTable: [],
      funds: [],
      offset: 0,
      limit: 10,
      count: 0,
      currentPage: 1,
      index: 0,
      role: "",
      isAdmin: false,
      beginDate: "",
      endDate: ""
    };
  },
  components: {
    headTop
  },
  created() {
    this.role = storage.get("1").role;
    if (this.role == "管理员") {
      this.isAdmin = true;
    }
  },
  mounted() {
    this.initData();
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
        this.$http.get("funds/findAll").then(res => {
          this.funds = res.data.data;
          this.count = this.funds.length;
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
      if (index >= this.funds.length) {
        index = this.funds.length;
      }
      for (i; i < index; i++) {
        const tableData = {};
        tableData.fundsId = this.funds[i].fundsId;
        tableData.amount = this.funds[i].amount;
        tableData.detail = this.funds[i].detail;
        if (this.funds[i].flag == 1) {
          tableData.type = "收入";
        } else {
          tableData.type = "支出";
        }
        tableData.operator = this.funds[i].employerByOperator.name;
        tableData.date = this.getDate(this.funds[i].date);
        this.tableData.push(tableData);
      }
    },
    async handleDelete(index, row) {
      try {
        let form = new FormData();
        form.append("fundsId", row.fundsId);
        this.$http.post("funds/deleteById", form).then(res => {
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
    async findByDate() {
      try {
        var begin = this.getDate1(this.beginDate);
        var end = this.getDate1(this.endDate);
        this.$http
          .get("funds/findByDate", {
            params: {
              begin: begin,
              end: end
            }
          })
          .then(res => {
            if (res.data.code == 1) {
              this.funds = res.data.data;
              this.count = this.funds.length;
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


