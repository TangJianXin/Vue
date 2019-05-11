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
          <el-form-item label="设备编号" prop="equipmentId">
            <el-input v-model="formData.equipmentId"></el-input>
          </el-form-item>
          <el-form-item label="设备名称" prop="equipmentName">
            <el-input v-model="formData.equipmentName"></el-input>
          </el-form-item>
          <el-form-item label="生产日期" prop="productionDate">
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="formData.productionDate"
                style="width: 195px;"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="购买日期" prop="purchaseDate">
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="formData.purchaseDate"
                style="width: 195px;"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="所属部门" prop="departmentId">
            <el-select v-model="formData.departmentId" placeholder="请选择部门">
              <el-option
                v-for="item in menuOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="button_submit">
            <el-button type="primary" @click="submitForm('formData')">添加设备</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import headTop from "@/components/headTop";
export default {
  data() {
    return {
      menuOptions: [],
      formData: {
        equipmentId: "",
        departmentId: "",
        equipmentName: "",
        productionDate: "",
        purchaseDate: ""
      },
      rules: {
        equipmentId: [
          { required: true, message: "请输入设备编号", trigger: "blur" }
        ],
        equipmentName: [
          { required: true, message: "请输入设备名称", trigger: "blur" }
        ],
        productionDate: [
          {
            required: true,
            message: "请选择生产日期",
            trigger: "blur",
            type: "date"
          }
        ],
        purchaseDate: [
          {
            required: true,
            message: "请选择购买日期",
            trigger: "blur",
            type: "date"
          }
        ],
        departmentId: [
          { required: true, message: "请选择所属部门", trigger: "blur" }
        ]
      }
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
    async initData() {
      this.getDepartments();
    },
    //格式化时间
    getDate(birthday) {
      var d = new Date(birthday);
      var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      return date;
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
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            this.formData.productionDate = this.getDate(
              this.formData.productionDate
            );
            this.formData.purchaseDate = this.getDate(
              this.formData.purchaseDate
            );
            let form = new FormData();
            form.append("equipmentId", this.formData.equipmentId);
            form.append("equipmentName", this.formData.equipmentName);
            form.append("productionDate", this.formData.productionDate);
            form.append("purchaseDate", this.formData.purchaseDate);
            form.append("departmentId", this.formData.departmentId);
            this.$http.post("equipment/add", form).then(res => {
              if (res.data.code == 1) {
                this.$message({
                  type: "success",
                  message: "添加设备信息成功！"
                });
                this.reload();
              } else {
                this.$message.error("添加设备信息失败！");
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
