<template>
  <div>
    <head-top></head-top>
    <el-row style="margin-top: 20px;">
      <el-col :span="12" :offset="4">
        <el-form
          :model="formData"
          :rules="rules"
          ref="formData"
          label-width="110px"
          class="demo-formData"
        >
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="formData.sex" placeholder="请选择性别">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="formData.idCard" :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="telephone">
            <el-input v-model.number="formData.telephone" :maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="家庭住址" prop="address">
            <el-autocomplete
              v-model="formData.address"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入地址"
              style="width: 100%;"
            ></el-autocomplete>
            <span>当前城市：{{city.name}}</span>
          </el-form-item>
          <el-form-item label="出生日期" prop="birthday">
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="formData.birthday"
                style="width: 195px;"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="入职日期" prop="entryDate">
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="formData.entryDate"
                style="width: 195px;"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="部门" prop="department">
            <el-select v-model="formData.department" placeholder="请选择部门">
              <el-option
                v-for="item in menuOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职位" prop="position">
            <el-select v-model="formData.position" placeholder="请选择性别">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="照片" prop="photo">
            <el-upload
              class="avatar-uploader"
              name="photo"
              action="http://localhost:8081/file/photo/employer"
              :show-file-list="false"
              :on-success="handleEmployerAvatarScucess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="formData.photo" :src="url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item class="button_submit">
            <el-button type="primary" @click="submitForm('formData')">添加员工</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import headTop from "@/components/headTop";
import { cityGuess, searchplace } from "@/api/getData";
export default {
  data() {
    return {
      url: "",
      city: {},
      menuOptions: [],
      formData: {
        name: "", //姓名
        sex: "", //性别
        telephone: "", //联系电话
        address: "", //家庭住址
        idCard: "", //身份证号
        birthday: "", //出生日期
        photo: "", //照片
        entryDate: "", //入院日期
        department: "", //部门
        position: "" //职位
      },
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ],
        telephone: [
          { required: true, message: "请输入联系电话" },
          { type: "number", message: "电话号码必须是数字" }
        ],
        familyPhone: [
          { required: true, message: "请输入联系电话" },
          { type: "number", message: "电话号码必须是数字" }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        photo: [{ required: true, message: "请上传头像", trigger: "blur" }],
        department: [
          { required: true, message: "请选择所属部门", trigger: "blur" }
        ],
        position: [{ required: true, message: "请选择职位", trigger: "blur" }],
        birthday: [
          {
            required: true,
            message: "请选择出生日期",
            trigger: "blur",
            type: "date"
          }
        ],
        entryDate: [
          {
            required: true,
            message: "请选择入院日期",
            trigger: "blur",
            type: "date"
          }
        ],
        idCard: [{ required: true, message: "请输入身份证号", trigger: "blur" }]
      },
      options1: [{ value: "男", label: "男" }, { value: "女", label: "女" }],
      options2: [
        { value: "文员", label: "文员" },
        { value: "财务", label: "财务" },
        { value: "护工", label: "护工" },
        { value: "经理", label: "经理" },
        { value: "副院长", label: "副院长" },
        { value: "院长", label: "院长" }
      ]
    };
  },
  components: {
    headTop
  },
  inject: ["reload"],
  mounted() {
    this.initData();
  },
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
        //获取当前城市
        this.city = await cityGuess();
        this.getDepartments();
      } catch (err) {
        console.log(err);
      }
    },
    //获取所有部门
    async getDepartments() {
      this.menuOptions = [];
      try {
        this.$http.get("department/findAll").then(res => {
          const menu = res.data.data;
          menu.forEach((item, index) => {
            this.menuOptions.push({
              label: item.departmentName,
              value: item.departmentId
            });
          });
        });
      } catch (err) {
        console.log("获取部门失败", err);
      }
    },
    //通过输入查询地理位置列表
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
    handleEmployerAvatarScucess(res, file) {
      if (res.code == 1) {
        this.formData.photo = res.data.photo;
        this.url = res.data.url;
      } else {
        this.$message.error("上传照片失败！");
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
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.formData.birthday = this.getDate(this.formData.birthday);
            this.formData.entryDate = this.getDate(this.formData.entryDate);
            let form = new FormData();
            form.append("name", this.formData.name);
            form.append("idCard", this.formData.idCard);
            form.append("sex", this.formData.sex);
            form.append("address", this.formData.address);
            form.append("telephone", this.formData.telephone);
            form.append("photo", this.formData.photo);
						form.append("departmentId", this.formData.department);
						form.append("position", this.formData.department);
            form.append("birthday", this.formData.birthday);
            form.append("entryDate", this.formData.entryDate);
            this.$http.post("employer/add", form).then(res => {
              if (res.data.code == 1) {
                this.$message({
                  type: "success",
                  message: "添加员工信息成功！"
                });
                this.reload();
              } else {
                this.$message.error("添加员工信息失败！");
              }
            });
          } catch (err) {
            console.log(err);
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: "请检查输入是否正确",
            offset: 100
          });
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.button_submit {
  text-align: left;
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
.el-table .info-row {
  background: #c9e5f5;
}

.el-table .positive-row {
  background: #e2f0e4;
}
</style>
