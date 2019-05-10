<template>
  <div class="login_page fillcontain">
    <transition name="form-fade" mode="in-out">
      <section class="form_contianer" v-show="showLogin">
        <div class="manage_tip">
          <p>智慧医疗养老院管理系统</p>
        </div>
        <el-form :model="registerForm" :rules="rules" ref="registerForm">
          <el-form-item prop="employerId">
            <el-input v-model="registerForm.employerId" placeholder="员工编号"></el-input>
          </el-form-item>
          <el-form-item prop="username">
            <el-input v-model="registerForm.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="密码" v-model="registerForm.password"></el-input>
          </el-form-item>
          <el-form-item prop="checkPassword">
            <el-input type="password" placeholder="密码" v-model="registerForm.checkPassword"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('registerForm')">注册</el-button>
            <el-button @click="resetForm('registerForm')">重置</el-button>
          </el-form-item>
        </el-form>
        <p class="tip">温馨提示：</p>
        <p class="tip">通过员工号、用户名、密码注册</p>
        <p class="tip">注册过的用户可凭账号密码登录</p>
      </section>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      registerForm: {
        employerId: "",
        username: "",
        password: "",
        checkPassword: ""
      },
      rules: {
        employerId: [
          { required: true, message: "请输入员工编号", trigger: "blur" }
        ],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        checkPassword: [
          {
            required: true,
            message: "请再次输入密码",
            trigger: "blur"
          }
        ]
      },
      showLogin: true
    };
  },
  mounted() {},
  methods: {
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.registerForm.password != this.registerForm.checkPassword) {
            this.$notify.error({
              title: "错误",
              message: "两次输入的密码不一致",
              offset: 100
            });
          } else {
            let form = new FormData();
            form.append("employerId", this.registerForm.employerId);
            form.append("username", this.registerForm.username);
            form.append("password", this.registerForm.password);
            this.$http.post("user/register", form).then(res => {
              if (res.data.code == 1) {
                this.$message({
                  type: "success",
                  message: "注册成功"
                });
                this.$router.push("login");
              } else {
                this.$message({
                  type: "error",
                  message: "注册失败"
                });
              }
            });
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: "请输入正确的员工编号、用户名、密码",
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

<style lang="less" scoped>
@import "../style/mixin";
.login_page {
  background-color: #324057;
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
  .wh(320px, 350px);
  .ctp(320px, 350px);
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
  font-size: 12px;
  color: red;
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
