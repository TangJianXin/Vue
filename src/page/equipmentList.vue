<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="equipmentId" label="设备编号"></el-table-column>
        <el-table-column prop="equipmentName" label="设备名"></el-table-column>
        <el-table-column prop="productionDate" label="生产时间"></el-table-column>
        <el-table-column prop="purchaseDate" label="购买时间"></el-table-column>
        <el-table-column prop="departmentName" label="所属部门"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button v-if="isAdmin" size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
        <el-dialog title="修改设备信息" v-model="dialogFormVisible">
          <el-form :model="selectTable">
            <el-form-item label="设备名" label-width="100px">
              <el-input v-model="selectTable.equipmentName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="生产时间" label-width="100px">
              <el-input v-model="selectTable.productionDate"></el-input>
            </el-form-item>
            <el-form-item label="购买时间" label-width="100px">
              <el-input v-model="selectTable.purchaseDate"></el-input>
            </el-form-item>
            <el-form-item label="所属部门" label-width="100px">
              <el-select
                v-model="selectIndex"
                :placeholder="selectMenu.label"
                @change="handleSelect"
              >
                <el-option
                  v-for="item in menuOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取 消</el-button>
            <el-button type="primary" @click="updateEquipment">确 定</el-button>
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
      equipments: [],
      offset: 0,
      limit: 10,
      count: 0,
      currentPage: 1,
      index: 0,
      menuOptions: [],
      selectMenu: {},
      selectIndex: null,
      role: "",
      isAdmin: false
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
    getDate(birthday) {
      /*
            格式化时间
        */
      var d = new Date(birthday);
      var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      return date;
    },
    async initData() {
      try {
        this.$http.get("equipment/findAll").then(res => {
          this.equipments = res.data.data;
          this.count = this.equipments.length;
          this.getTableData();
          this.getDepartments();
        });
      } catch (err) {
        console.log("获取数据失败", err);
      }
    },
    getTableData() {
      this.tableData.splice(0, this.tableData.length);
      var i = this.offset;
      var index = i + this.limit;
      if (index >= this.equipments.length) {
        index = this.equipments.length;
      }
      for (i; i < index; i++) {
        const tableData = {};
        tableData.equipmentId = this.equipments[i].equipmentId;
        tableData.equipmentName = this.equipments[i].equipmentName;
        tableData.productionDate = this.getDate(
          this.equipments[i].productionDate
        );
        tableData.purchaseDate = this.getDate(this.equipments[i].purchaseDate);
        tableData.departmentName = this.equipments[
          i
        ].departmentByDepartmentId.departmentName;
        tableData.departmentByDepartmentId = this.equipments[
          i
        ].departmentByDepartmentId;
        tableData.departmentId = this.equipments[
          i
        ].departmentByDepartmentId.departmentId;
        this.tableData.push(tableData);
      }
    },
    async getDepartments() {
      this.menuOptions = [];
      try {
        this.$http.get("department/findAll").then(res => {
          const menu = res.data.data;
          menu.forEach((item, index) => {
            this.menuOptions.push({
              label: item.departmentName,
              value: item.departmentId,
              index
            });
          });
        });
      } catch (err) {
        console.log("获取部门失败", err);
      }
    },
    async handleDelete(index, row) {
      try {
        this.$http
          .delete("equipment/deleteById", {
            data: {
              equipmentId: row.equipmentId
            }
          })
          .then(res => {
            if (res.data.code == 1) {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.tableData.splice(index, 1);
              this.equipments.splice(this.offset + index, 1);
              this.count = this.equipments.length;
              this.getTableData();
            } else {
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
    handleSelect(index) {
      this.selectIndex = index;
      this.selectMenu = this.menuOptions[index];
      this.selectTable.departmentId = this.selectMenu.value;
      this.selectTable.departmentName = this.selectMenu.label;
    },
    handleEdit(index, row) {
      this.selectTable = row;
      this.dialogFormVisible = true;
      this.index = index;
      var i = 0;
      for (i; i < this.menuOptions.length; i++) {
        if (this.selectTable.departmentName == this.menuOptions[i].label) {
          this.selectMenu = this.menuOptions[i];
          break;
        }
      }
    },
    handleCancel() {
      this.dialogFormVisible = false;
      this.getTableData();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getTableData();
    },
    async updateEquipment() {
      try {
        this.dialogFormVisible = false;
        let form = new FormData();
        form.append("equipmentId", this.selectTable.equipmentId);
        form.append("equipmentName", this.selectTable.equipmentName);
        form.append("purchaseDate", this.selectTable.purchaseDate);
        form.append("productionDate", this.selectTable.productionDate);
        form.append("departmentId", this.selectTable.departmentId);
        this.$http.put("equipment/modifyInformation", form).then(res => {
          if (res.data.code == 1) {
            const data = {};
            data.equipmentId = this.selectTable.equipmentId;
            data.equipmentName = this.selectTable.equipmentName;
            data.productionDate = this.selectTable.productionDate;
            data.purchaseDate = this.selectTable.purchaseDate;
            this.selectTable.departmentByDepartmentId.departmentName = this.selectTable.departmentName;
            data.departmentByDepartmentId = this.selectTable.departmentByDepartmentId;
            this.equipments[this.index] = data;
            this.$message({
              type: "success",
              message: "更新信息成功！"
            });
          } else {
            this.$message.error("更新部门信息失败！");
          }
        });
      } catch (error) {
        this.$message.error("更新部门信息失败！");
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
</style>


