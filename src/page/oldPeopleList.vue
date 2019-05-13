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
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="性别：">
                <span>{{ props.row.sex }}</span>
              </el-form-item>
              <el-form-item label="身份证号：">
                <span>{{ props.row.idCard }}</span>
              </el-form-item>
              <el-form-item label="家庭住址：">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="联系方式：">
                <span>{{ props.row.telephone }}</span>
              </el-form-item>
              <el-form-item label="家属电话：">
                <span>{{ props.row.familyPhone }}</span>
              </el-form-item>
              <el-form-item label="出生日期：">
                <span>{{ getDate(props.row.birthday) }}</span>
              </el-form-item>
              <el-form-item label="入院日期：">
                <span>{{ getDate(props.row.entryDate) }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="老人编号" prop="oldPeopleId"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="联系方式" prop="telephone"></el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button size="small" type="primary" @click="handleDelete(scope.$index, scope.row)">出院</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="count"
        ></el-pagination>
      </div>
      <el-dialog title="修改老人信息" v-model="dialogFormVisible">
        <el-form :model="selectTable">
          <el-form-item label="姓名" label-width="100px">
            <el-input v-model="selectTable.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" label-width="100px">
            <el-input v-model="selectTable.sex"></el-input>
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
          <el-form-item label="联系电话" label-width="100px">
            <el-input v-model="selectTable.telephone"></el-input>
          </el-form-item>
          <el-form-item label="家属电话" label-width="100px">
            <el-input v-model="selectTable.familyPhone"></el-input>
          </el-form-item>
          <el-form-item label="出生日期" label-width="100px">
            <el-input v-model="selectTable.birthday"></el-input>
          </el-form-item>
          <el-form-item label="照片" label-width="100px">
            <el-upload
              class="avatar-uploader"
              name="photo"
              action="http://localhost:8081/file/photo/oldPeople"
              :show-file-list="false"
              :on-success="handleOldPeopleAvatarScucess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="selectTable.url" :src="selectTable.url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="updateOldPeople">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import { cityGuess, searchplace } from "@/api/getData";
export default {
  data() {
    return {
      city: {},
      offset: 0,
      limit: 10,
      count: 0,
      tableData: [],
      currentPage: 1,
      selectTable: {},
      dialogFormVisible: false,
      address: {},
      oldPeoples: [],
      index: 0
    };
  },
  mounted() {
    this.initData();
  },
  created() {
    //this.initData();
  },
  components: {
    headTop
  },
  inject: ["reload"],
  methods: {
    getDate(Timestamp) {
      /*
            格式化时间
        */
      var d = new Date(Timestamp);
      var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      return date;
    },
    async initData() {
      try {
        this.city = await cityGuess();
        this.$http.get("oldPeople/findAll").then(res => {
          this.oldPeoples = res.data.data;
          this.count = this.oldPeoples.length;
          this.getTableData();
        });
      } catch (err) {
        console.log("获取数据失败", err);
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getTableData();
    },
    getTableData() {
      this.tableData.splice(0, this.tableData.length);
      var i = this.offset;
      var index = i + this.limit;
      if (index >= this.oldPeoples.length) {
        index = this.oldPeoples.length;
      }
      for (i; i < index; i++) {
        const tableData = {};
        tableData.name = this.oldPeoples[i].oldPeople.name;
        tableData.address = this.oldPeoples[i].oldPeople.address;
        tableData.photo = this.oldPeoples[i].oldPeople.photo;
        tableData.oldPeopleId = this.oldPeoples[i].oldPeople.oldPeopleId;
        tableData.telephone = this.oldPeoples[i].oldPeople.telephone;
        tableData.sex = this.oldPeoples[i].oldPeople.sex;
        tableData.birthday = this.oldPeoples[i].oldPeople.birthday;
        tableData.familyPhone = this.oldPeoples[i].oldPeople.familyPhone;
        tableData.idCard = this.oldPeoples[i].oldPeople.idCard;
        tableData.entryDate = this.oldPeoples[i].oldPeople.entryDate;
        tableData.url = this.oldPeoples[i].url;
        this.tableData.push(tableData);
      }
    },
    handleEdit(index, row) {
      this.selectTable = row;
      this.address.address = row.address;
      this.selectTable.birthday = this.getDate(this.selectTable.birthday);
      this.dialogFormVisible = true;
      this.index = index;
    },
    handleCancel() {
      this.dialogFormVisible = false;
      this.getTableData();
    },
    async handleDelete(index, row) {
      let form = new FormData();
      form.append("oldPeopleId", row.oldPeopleId);
      try {
        this.$http.post("oldPeople/deleteById", form).then(res => {
          if (res.data.code == 1) {
            this.$message({
              type: "success",
              message: "办理出院成功"
            });
            this.tableData.splice(index, 1);
            this.oldPeoples.splice(this.offset + index, 1);
            this.count = this.oldPeoples.length;
            this.getTableData();
          } else {
            this.$message.error("办理出院失败！");
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
    handleOldPeopleAvatarScucess(res, file) {
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
    async updateOldPeople() {
      this.dialogFormVisible = false;
      try {
        Object.assign(this.selectTable, this.address);
        let form = new FormData();
        form.append("name", this.selectTable.name);
        form.append("oldPeopleId", this.selectTable.oldPeopleId);
        form.append("photo", this.selectTable.photo);
        form.append("idCard", this.selectTable.idCard);
        form.append("telephone", this.selectTable.telephone);
        form.append("address", this.selectTable.address);
        form.append("sex", this.selectTable.sex);
        form.append("birthday", this.selectTable.birthday);
        form.append("familyPhone", this.selectTable.familyPhone);
        form.append("entryDate", this.selectTable.entryDate);
        this.$http.put("oldPeople/modifyInformation", form).then(res => {
          if (res.data.code == 1) {
            this.reload();
            this.$message({
              type: "success",
              message: "更新信息成功！"
            });
          }
        });
      } catch (error) {
        this.$message.error("更新老人信息失败！");
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
