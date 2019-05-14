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
          <el-form-item label="金额" prop="amount">
            <el-input v-model.number="formData.amount"></el-input>
          </el-form-item>
          <el-form-item label="说明" prop="detail">
            <el-select v-model="formData.detail" placeholder="请选择说明">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型" prop="flag">
            <el-select v-model="formData.flag" placeholder="请选择类型">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="button_submit">
            <el-button type="primary" @click="submitForm('formData')">添加流水</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import headTop from "@/components/headTop";
import storage from "../store/storage.js";
import { type } from "os";
export default {
  data() {
    return {
      menuOptions: [],
      formData: {
        amount: "",
        flag: "",
        employerId: "",
        detail: ""
      },
      rules: {
        amount: [
          { required: true, message: "请输入金额" },
          { type: "number", message: "金额必须是数字" }
        ],
        detail: [{ required: true, message: "请选择说明", trigger: "blur" }],
        flag: [{ required: true, message: "请选择类型", trigger: "blur" }]
      },
      options1: [{ value: "1", label: "收入" }, { value: "2", label: "支出" }],
      options2: [
        { value: "采购", label: "采购" },
        { value: "工资", label: "工资" },
        { value: "月费", label: "月费" },
        { value: "其它", label: "其它" },
        { value: "设备维护", label: "设备维护" }
      ]
    };
  },
  components: {
    headTop
  },
  inject: ["reload"],
  mounted() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            let form = new FormData();
            this.formData.employerId = storage.get(
              "1"
            ).entity.employerByEmployerId.employerId;
            form.append("employerId", this.formData.employerId);
            form.append("amount", this.formData.amount);
            form.append("detail", this.formData.detail);
            form.append("flag", this.formData.flag);
            this.$http.post("funds/add", form).then(res => {
              if (res.data.code == 1) {
                this.$message({
                  type: "success",
                  message: "添加流水记录成功！"
                });
                this.reload();
              } else {
                this.$message.error("添加流水记录失败！");
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
