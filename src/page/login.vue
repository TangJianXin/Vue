<template>
  <div class="login_page fillcontain">
    <transition name="form-fade" mode="in-out">
      <section class="form_contianer" v-show="showLogin">
        <div class="manage_tip">
          <p>智慧医疗养老院管理系统</p>
        </div>
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="密码" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
            <el-button @click="register">注册</el-button>
          </el-form-item>
        </el-form>
      </section>
    </transition>
  </div>
</template>

<script>
import storage from "../store/storage.js";
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      showLogin: true
    };
  },
  mounted() {},
  computed: {},
  methods: {
    register() {
      this.$router.push("register");
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let form = new FormData();
          form.append("username", this.loginForm.username);
          form.append("password", this.loginForm.password);
          this.$http.post("login/all", form).then(res => {
            if (res.data.code == 1) {
              storage.set("1", res.data.data);
              this.$message({
                type: "success",
                message: "登录成功"
              });
              this.$router.push("manage");
            } else {
              this.$message({
                type: "error",
                message: "账号或密码错误"
              });
            }
          });
        } else {
          this.$notify.error({
            title: "错误",
            message: "请输入正确的用户名密码",
            offset: 100
          });
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../style/mixin";
.login_page {
  background-image: url("../assets/img/100a0a00000055pr166C2.jpg")
}
.manage_tip {
  position: absolute;
  width: 100%;
  top: -100px;
  left: 0;
  p {
    font-size: 32px;
    color: #fff;
  }
}
.form_contianer {
  .wh(320px, 180px);
  .ctp(320px, 180px);
  padding: 25px;
  border-radius: 5px;
  text-align: center;
  background-color: #fff;
  .submit_btn {
    width: 100%;
    font-size: 16px;
  }
}
.tip {
  font-size: 18px;
  text-align: right;
  color: blue;
}
.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s;
}
.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(0, -50px, 0);
  opacity: 0;
}
</style>
