<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="部门编号" prop="departmentId"></el-table-column>
        <el-table-column label="部门名称" prop="departmentName"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index,scope.row)">修改</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
            <el-button
              size="small"
              type="info"
              @click="showAllEmployers(scope.$index, scope.row)"
            >员工</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination" style="text-align: left;margin-top: 10px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="5"
          layout="total, prev, pager, next"
          :total="count"
        ></el-pagination>
        <el-dialog title="修改部门信息" v-model="dialogFormVisible">
          <el-form :model="selectTable">
            <el-form-item label="部门名称" label-width="100px">
              <el-input v-model="selectTable.departmentName" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取 消</el-button>
            <el-button type="primary" @click="updateDepartment">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="部门员工" v-model="dialogTableVisible">
          <el-table :data="employers">
            <el-table-column property="employerId" label="员工编号"></el-table-column>
            <el-table-column property="name" label="姓名"></el-table-column>
            <el-table-column property="position" label="职位"></el-table-column>
          </el-table>
        </el-dialog>
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
      employers: [],
      departments: [],
      tableData: [],
      offset: 0,
      limit: 5,
      count: 0,
      currentPage: 1,
      selectTable: {},
      dialogFormVisible: false,
      dialogTableVisible: false,
      index: 0,
      role: "",
      isAdmin: false
    };
  },
  components: {
    headTop
  },
  activated: function() {
    //this.initData();
  },
  mounted() {
    this.initData();
  },
  created() {},
  methods: {
    async initData() {
      try {
        this.$http.get("department/findAll").then(res => {
          this.departments = res.data.data;
          this.count = this.departments.length;
          this.getTableData();
        });
      } catch (err) {
        console.log("获取数据失败", err);
      }
    },
    handleEdit(index, row) {
      this.selectTable = row;
      this.dialogFormVisible = true;
      this.index = index;
    },
    handleCancel() {
      this.dialogFormVisible = false;
      this.getTableData();
    },
    async handleDelete(index, row) {
      try {
        this.$http
          .delete("department/deleteById", {
            data: {
              departmentId: row.departmentId
            }
          })
          .then(res => {
            if (res.data.code == 1) {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.tableData.splice(index, 1);
              this.departments.splice(this.offset + index, 1);
              this.count = this.departments.length;
              this.getTableData();
            } else {
              this.$message.error("部门删除失败！");
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
    async showAllEmployers(index, row) {
      this.dialogTableVisible = true;
      try {
        this.$http
          .get("department/findAllEmployer", {
            params: {
              departmentId: row.departmentId
            }
          })
          .then(res => {
            if (res.data.code == 1) {
              this.employers = res.data.data;
            }
          });
      } catch (err) {
        console.log("获取数据失败", err);
      }
    },
    async updateDepartment() {
      try {
        this.dialogFormVisible = false;
        this.departments[this.index] = this.selectTable;
        let form = new FormData();
        form.append("departmentId", this.selectTable.departmentId);
        form.append("departmentName", this.selectTable.departmentName);
        this.$http.put("department/modifyInformation", form).then(res => {
          if (res.data.code == 1) {
            this.initData();
            this.$message({
              type: "success",
              message: "更新信息成功！"
            });
          }
        });
      } catch (error) {
        this.$message.error("更新部门信息失败！");
        console.log(error);
      }
    },
    getTableData() {
      this.tableData.splice(0, this.tableData.length);
      var i = this.offset;
      var index = i + this.limit;
      if (index >= this.departments.length) {
        index = this.departments.length;
      }
      for (i; i < index; i++) {
        const tableData = {};
        tableData.departmentId = this.departments[i].departmentId;
        tableData.departmentName = this.departments[i].departmentName;
        this.tableData.push(tableData);
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getTableData();
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
