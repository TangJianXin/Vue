<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="照片：">
                <span>
                  <img style="width: 100px; height: 100px" :src="props.row.url">
                </span>
              </el-form-item>
              <el-form-item label="姓名：">
                <span>{{ props.row.name}}</span>
              </el-form-item>
              <el-form-item label="性别：">
                <span>{{ props.row.sex }}</span>
              </el-form-item>
              <el-form-item label="出生日期：">
                <span>{{ getDate(props.row.birthday) }}</span>
              </el-form-item>
              <el-form-item label="部门：">
                <span>{{ props.row.departmentName}}</span>
              </el-form-item>
              <el-form-item label="职位：">
                <span>{{ props.row.position}}</span>
              </el-form-item>
              <el-form-item label="家庭住址：">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="联系方式：">
                <span>{{ props.row.telephone }}</span>
              </el-form-item>
              <el-form-item label="身份证号：">
                <span>{{ props.row.idCard }}</span>
              </el-form-item>
              <el-form-item label="入职日期：">
                <span>{{ getDate(props.row.entryDate) }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="员工编号" prop="employerId"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="部门" prop="departmentName"></el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index,scope.row)">修改</el-button>
            <el-button v-if="isAdmin" size="small" type="primary" @click="handleDelete(scope.$index, scope.row)">离职</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="count"
        ></el-pagination>
      </div>
      <el-dialog title="修改员工信息" v-model="dialogFormVisible">
        <el-form :model="selectTable">
          <el-form-item label="姓名" label-width="100px">
            <el-input v-model="selectTable.name" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="性别" label-width="100px">
            <el-input v-model="selectTable.sex"></el-input>
          </el-form-item>
          <el-form-item label="部门" label-width="100px">
            <el-select v-model="selectIndex" :placeholder="selectMenu.label" @change="handleSelect">
              <el-option
                v-for="item in menuOptions"
                :key="item.value"
                :label="item.label"
                :value="item.index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职位" label-width="100px">
            <el-input v-model="selectTable.position"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" label-width="100px">
            <el-input v-model="selectTable.idCard"></el-input>
          </el-form-item>
          <el-form-item label="家庭住址" label-width="100px">
            <el-autocomplete
              v-model="address.address"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入地址"
              style="width: 100%;"
              @select="addressSelect"
            ></el-autocomplete>
            <span>当前城市：{{city.name}}</span>
          </el-form-item>
          <el-form-item label="联系方式" label-width="100px">
            <el-input v-model="selectTable.telephone"></el-input>
          </el-form-item>
          <el-form-item label="出生日期" label-width="100px">
            <el-input v-model="selectTable.birthday"></el-input>
          </el-form-item>
          <el-form-item label="照片" label-width="100px">
            <el-upload
              class="avatar-uploader"
              name="photo"
              action="http://localhost:8081/file/photo/employer"
              :show-file-list="false"
              :on-success="handleServiceAvatarScucess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="selectTable.url" :src="selectTable.url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="updateEmployer">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import storage from "../store/storage.js";
import { cityGuess, searchplace } from "@/api/getData";
export default {
  data() {
    return {
      city: {},
      address: {},
      offset: 0,
      limit: 10,
      count: 0,
      tableData: [],
      currentPage: 1,
      selectTable: {},
      dialogFormVisible: false,
      menuOptions: [],
      selectMenu: {},
      selectIndex: null,
      employers: [],
      index: 0,
      role: "",
      isAdmin: false
    };
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
  components: {
    headTop
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
        this.city = await cityGuess();
        this.$http.get("employer/findAll").then(res => {
          this.employers = res.data.data;
          this.count = this.employers.length;
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
      if (index >= this.employers.length) {
        index = this.employers.length;
      }
      for (i; i < index; i++) {
        const tableData = {};
        tableData.name = this.employers[i].employer.name;
        tableData.address = this.employers[i].employer.address;
        tableData.photo = this.employers[i].employer.photo;
        tableData.employerId = this.employers[i].employer.employerId;
        tableData.telephone = this.employers[i].employer.telephone;
        tableData.sex = this.employers[i].employer.sex;
        tableData.birthday = this.employers[i].employer.birthday;
        tableData.idCard = this.employers[i].employer.idCard;
        tableData.entryDate = this.employers[i].employer.entryDate;
        tableData.departmentName = this.employers[
          i
        ].employer.departmentByDepartmentId.departmentName;
        tableData.position = this.employers[i].employer.position;
        tableData.departmentId = this.employers[
          i
        ].employer.departmentByDepartmentId.departmentId;
        tableData.url = this.employers[i].url;
        tableData.departmentByDepartmentId = this.employers[
          i
        ].employer.departmentByDepartmentId;
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
    //查询地址
    async querySearchAsync(queryString, cb) {
      if (queryString) {
        try {
          const cityList = await searchplace(this.city.id, queryString);
          if (cityList instanceof Array) {
            cityList.map(item => {
              item.value = item.address;
              return item;
            });
            cb(cityList);
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
    //选择地址
    addressSelect(vale) {
      const { address, latitude, longitude } = vale;
      this.address = { address, latitude, longitude };
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getTableData();
    },
    handleEdit(index, row) {
      this.index = index;
      this.selectTable = row;
      this.address.address = row.address;
      this.selectTable.birthday = this.getDate(this.selectTable.birthday);
      var i = 0;
      for (i; i < this.menuOptions.length; i++) {
        if (this.selectTable.departmentName == this.menuOptions[i].label) {
          this.selectMenu = this.menuOptions[i];
          break;
        }
      }
      this.dialogFormVisible = true;
    },
    handleCancel() {
      this.dialogFormVisible = false;
      this.getTableData();
    },
    handleSelect(index) {
      this.selectIndex = index;
      this.selectMenu = this.menuOptions[index];
      this.selectTable.departmentId = this.selectMenu.value;
      this.selectTable.departmentName = this.selectMenu.label;
    },
    async handleDelete(index, row) {
      try {
        this.$http
          .delete("employer/deleteById", {
            data: {
              employerId: row.employerId
            }
          })
          .then(res => {
            if (res.data.code == 1) {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.tableData.splice(index, 1);
              this.employers.splice(this.offset + index, 1);
              this.count = this.employers.length;
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
    handleServiceAvatarScucess(res, file) {
      if (res.code == 1) {
        this.selectTable.photo = res.data.photo;
        this.selectTable.url = res.data.url;
      } else {
        this.$message.error("上传图片失败！");
      }
    },
    beforeAvatarUpload(file) {
      const isRightType =
        file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isRightType) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isRightType && isLt2M;
    },
    async updateEmployer() {
      this.dialogFormVisible = false;
      try {
        Object.assign(this.selectTable, this.address);
        let form = new FormData();
        form.append("name", this.selectTable.name);
        form.append("employerId", this.selectTable.employerId);
        form.append("photo", this.selectTable.photo);
        form.append("idCard", this.selectTable.idCard);
        form.append("telephone", this.selectTable.telephone);
        form.append("address", this.selectTable.address);
        form.append("sex", this.selectTable.sex);
        form.append("birthday", this.selectTable.birthday);
        form.append("position", this.selectTable.position);
        form.append("entryDate", this.selectTable.entryDate);
        form.append("departmentId", this.selectTable.departmentId);
        this.$http.put("employer/modifyInformation", form).then(res => {
          if (res.data.code == 1) {
            const data = {
              employer: {
                departmentByDepartmentId: {}
              },
              url: ""
            };
            data.employer.name = this.selectTable.name;
            data.employer.address = this.selectTable.address;
            data.employer.photo = this.selectTable.photo;
            data.employer.employerId = this.selectTable.employerId;
            data.employer.telephone = this.selectTable.telephone;
            data.employer.sex = this.selectTable.sex;
            data.employer.birthday = this.selectTable.birthday;
            data.employer.idCard = this.selectTable.idCard;
            data.employer.position = this.selectTable.position;
            data.employer.entryDate = this.selectTable.entryDate;
            this.selectTable.departmentByDepartmentId.departmentName = this.selectTable.departmentName;
            data.employer.departmentByDepartmentId = this.selectTable.departmentByDepartmentId;
            data.url = this.selectTable.url;
            this.employers[this.index] = data;
            this.$message({
              type: "success",
              message: "更新信息成功！"
            });
          }
        });
      } catch (error) {
        this.$message.error("更新员工信息失败！");
        console.log(error);
      }
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
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
.table_container {
  padding: 20px;
}
.Pagination {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
