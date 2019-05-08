<template>
  <div class="header_container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-dropdown @command="handleCommand" menu-align="start">
      <img :src="url" class="avator">
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="home">个人中心</el-dropdown-item>
        <el-dropdown-item command="modifyPassword">修改密码</el-dropdown-item>
        <el-dropdown-item command="signout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog title="修改密码" v-model="dialogFormVisible">
      <el-form :model="modifyForm" :rules="rules" ref="modifyForm">
        <el-form-item prop="oldPassword">
          <el-input type="password" placeholder="密码" v-model="modifyForm.oldPassword"></el-input>
        </el-form-item>
        <el-form-item prop="newPassword">
          <el-input type="password" placeholder="新密码" v-model="modifyForm.newPassword"></el-input>
        </el-form-item>
        <el-form-item prop="checkPassword">
          <el-input type="password" placeholder="新密码" v-model="modifyForm.checkPassword"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('modifyForm')">重置</el-button>
        <el-button type="primary" @click="submitForm('modifyForm')">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { baseImgPath } from "@/config/env";
import { mapActions, mapState } from "vuex";
import storage from "../store/storage.js";

export default {
  data() {
    return {
      baseImgPath,
      url: "",
      object: {},
      dialogFormVisible: false,
      entity: {},
      modifyForm: {
        oldPassword: "",
        newPassword: "",
        checkPassword: ""
      },
      rules: {
        oldPassword: [
          { required: true, message: "请输入原密码", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
        checkPassword: [
          {
            required: true,
            message: "请再次输入密码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState(["adminInfo"])
  },
  mounted() {
    this.object = storage.get("1");
    this.entity = this.object.entity;
    if (this.object.url != null) {
      this.url = storage.get("1").url;
    } else {
      this.url = this.baseImgPath + this.adminInfo.avatar;
    }
  },
  methods: {
    async handleCommand(command) {
      if (command == "home") {
        this.$router.push("/adminSet");
      } else if (command == "modifyPassword") {
        this.dialogFormVisible = true;
      } else if (command == "signout") {
        this.$message({
          type: "success",
          message: "退出成功"
        });
        this.$router.push("/");
      }
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.modifyForm.oldPassword != this.entity.password) {
            this.$notify.error({
              title: "错误",
              message: "原密码输入错误",
              offset: 100
            });
          } else if (
            this.modifyForm.newPassword != this.modifyForm.checkPassword
          ) {
            this.$notify.error({
              title: "错误",
              message: "两次输入的密码不一致",
              offset: 100
            });
          } else {
            var url = "";
            if (this.object.role == "管理员") {
              url = "admin/modifyPassword";
            } else {
              url = "user/modifyPassword";
            }
            let form = new FormData();
            form.append("username", this.entity.username);
            form.append("password", this.modifyForm.newPassword);
            this.$http.put(url, form).then(res => {
              if (res.data.code == 1) {
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
                this.$router.push("login");
              } else {
                this.$message({
                  type: "error",
                  message: "修改失败"
                });
              }
            });
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: "请输入正确的原密码和新密码",
            offset: 100
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.header_container {
  background-color: #eff2f7;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
}
.avator {
  .wh(36px, 36px);
  border-radius: 50%;
  margin-right: 37px;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
