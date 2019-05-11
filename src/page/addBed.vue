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
          <el-form-item label="床位编号" prop="bedId">
            <el-input v-model="formData.bedId"></el-input>
          </el-form-item>
          <el-form-item label="管理人员" prop="employerId">
            <el-select v-model="formData.employerId" placeholder="请选择管理人员">
              <el-option
                v-for="item in menuOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="button_submit">
            <el-button type="primary" @click="submitForm('formData')">添加床位</el-button>
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
        bedId: "", //床位编号
        employerId: "" //员工编号
      },
      rules: {
        bedId: [{ required: true, message: "请输入床位编号", trigger: "blur" }],
        employerId: [
          {
            required: true,
            message: "请选择管理人员",
            trigger: "blur",
            type: "number"
          }
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
      this.getEmployers();
    },
    //获取所有员工
    async getEmployers() {
      this.menuOptions = [];
      try {
        this.$http.get("employer/findAll").then(res => {
          const menu = res.data.data;
          menu.forEach((item, index) => {
            this.menuOptions.push({
              label: item.employer.name,
              value: item.employer.employerId
            });
          });
        });
      } catch (err) {
        console.log("获取员工失败", err);
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            let form = new FormData();
            form.append("bedId", this.formData.bedId);
            form.append("employerId", this.formData.employerId);
            this.$http.post("bed/add", form).then(res => {
              if (res.data.code == 1) {
                this.$message({
                  type: "success",
                  message: "添加床位信息成功！"
                });
                this.reload();
              } else {
                this.$message.error("添加床位信息失败！");
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
