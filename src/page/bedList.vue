<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-input v-model="bedId" style="width:160px" placeholder="输入床位查询"></el-input>
      <el-button type="primary" @click="findByBedId">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="床位编号" prop="bedId"></el-table-column>
        <el-table-column label="使用老人" prop="oldPeople"></el-table-column>
        <el-table-column label="管理人员" prop="employer"></el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">设置</el-button>
            <el-button
              v-if="isAdmin"
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
        <el-dialog title="修改床位信息" v-model="dialogFormVisible">
          <el-form :model="selectTable">
            <el-form-item label="使用老人" label-width="100px">
              <el-select
                v-model="selectIndex1"
                :placeholder="selectMenu1.label"
                @change="handleSelect1"
              >
                <el-option
                  v-for="item in menuOptions1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="管理人员" label-width="100px">
              <el-select
                v-model="selectIndex2"
                :placeholder="selectMenu2.label"
                @change="handleSelect2"
              >
                <el-option
                  v-for="item in menuOptions2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取 消</el-button>
            <el-button type="primary" @click="updateBed">确 定</el-button>
          </div>
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
      dialogFormVisible: false,
      tableData: [],
      selectTable: [],
      offset: 0,
      limit: 10,
      count: 0,
      currentPage: 1,
      beds: [],
      index: 0,
      menuOptions1: [],
      menuOptions2: [],
      selectMenu1: {},
      selectIndex1: null,
      selectMenu2: {},
      selectIndex2: null,
      role: "",
      isAdmin: false,
      bedId: ""
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
  created() {
    this.role = storage.get("1").role;
    if (this.role == "管理员") {
      this.isAdmin = true;
    }
  },
  methods: {
    async initData() {
      try {
        this.$http.get("bed/findAll").then(res => {
          this.beds = res.data.data;
          this.count = this.beds.length;
          this.getTableData();
          this.getOldPeoples();
          this.getEmployers();
        });
      } catch (err) {
        console.log("获取数据失败", err);
      }
    },
    getTableData() {
      this.tableData.splice(0, this.tableData.length);
      var i = this.offset;
      var index = i + this.limit;
      if (index >= this.beds.length) {
        index = this.beds.length;
      }
      for (i; i < index; i++) {
        const tableData = {};
        tableData.bedId = this.beds[i].bedId;
        if (this.beds[i].oldPeopleByOldPeopleId != null) {
          tableData.oldPeople = this.beds[i].oldPeopleByOldPeopleId.name;
        }
        tableData.employer = this.beds[i].employerByEmployerId.name;
        tableData.oldPeopleByOldPeopleId = this.beds[i].oldPeopleByOldPeopleId;
        tableData.employerByEmployerId = this.beds[i].employerByEmployerId;
        this.tableData.push(tableData);
      }
    },
    async getOldPeoples() {
      this.menuOptions1 = [];
      try {
        this.$http.get("oldPeople/findAllEmpty").then(res => {
          const menu = res.data.data;
          menu.forEach((item, index) => {
            this.menuOptions1.push({
              label: item.name,
              value: item.oldPeopleId,
              index
            });
          });
        });
      } catch (err) {
        console.log("获取老人失败", err);
      }
    },
    async getEmployers() {
      this.menuOptions2 = [];
      try {
        this.$http.get("employer/findAll").then(res => {
          const menu = res.data.data;
          menu.forEach((item, index) => {
            this.menuOptions2.push({
              label: item.employer.name,
              value: item.employer.employerId,
              index
            });
          });
        });
      } catch (err) {
        console.log("获取员工失败", err);
      }
    },
    handleSelect1(index) {
      this.selectIndex1 = index;
      this.selectMenu1 = this.menuOptions1[index];
      this.selectTable.oldPeopleId = this.selectMenu1.value;
      this.selectTable.oldPeople = this.selectMenu1.label;
    },
    handleSelect2(index) {
      this.selectIndex2 = index;
      this.selectMenu2 = this.menuOptions2[index];
      this.selectTable.employerId = this.selectMenu2.value;
      this.selectTable.employer = this.selectMenu2.label;
    },
    handleEdit(index, row) {
      this.selectTable = row;
      this.dialogFormVisible = true;
      this.index = index;
      var i = 0;
      for (i; i < this.menuOptions1.length; i++) {
        if (this.selectTable.oldPeople == this.menuOptions1[i].label) {
          this.selectMenu1 = this.menuOptions1[i];
          break;
        }
      }
      if (row.oldPeopleByOldPeopleId != null) {
        this.selectTable.oldPeopleId = row.oldPeopleByOldPeopleId.oldPeopleId;
      }
      this.selectTable.employerId = row.employerByEmployerId.employerId;
      var j = 0;
      for (j; j < this.menuOptions2.length; j++) {
        if (this.selectTable.employer == this.menuOptions2[j].label) {
          this.selectMenu2 = this.menuOptions2[j];
          break;
        }
      }
    },
    handleCancel() {
      this.dialogFormVisible = false;
      this.getTableData();
    },
    async handleDelete(index, row) {
      let form = new FormData();
      form.append("bedId", row.bedId);
      try {
        this.$http.post("bed/deleteById", form).then(res => {
          if (res.data.code == 1) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.tableData.splice(index, 1);
            this.beds.splice(this.offset + index, 1);
            this.count = this.beds.length;
            this.getTableData();
          } else {
            this.$message.error("床位删除失败！");
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
    handleReset() {
      this.bedId = "";
      this.initData();
    },
    async findByBedId() {
      try {
        this.$http
          .get("bed/findById", {
            params: {
              bedId: this.bedId
            }
          })
          .then(res => {
            if (res.data.code == 1) {
              this.beds = res.data.data;
              this.count = this.beds.length;
              this.getTableData();
            }
          });
      } catch (err) {
        this.$message.error("查询失败！");
        console.log("获取数据失败", err);
      }
    },
    async updateBed() {
      try {
        this.dialogFormVisible = false;
        let form = new FormData();
        form.append("bedId", this.selectTable.bedId);
        form.append("oldPeopleId", this.selectTable.oldPeopleId);
        form.append("employerId", this.selectTable.employerId);
        this.$http.put("bed/modifyInformation", form).then(res => {
          if (res.data.code == 1) {
            this.initData();
            this.$message({
              type: "success",
              message: "更新床位信息成功！"
            });
          } else {
            this.$message.error("更新床位信息失败！");
          }
        });
      } catch (error) {
        this.$message.error("更新床位信息失败！");
        console.log(error);
      }
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.table_container {
  padding: 20px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
