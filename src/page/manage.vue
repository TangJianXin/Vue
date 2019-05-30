<template>
  <div class="manage_page fillcontain">
    <el-row style="height: 100%;">
      <el-col :span="4" style="min-height: 100%; background-color: #324057;">
        <el-menu
          :default-active="defaultActive"
          style="min-height: 100%;"
          theme="dark"
          router
        >
          <el-menu-item index="manage">
            <i class="el-icon-menu"></i>首页
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-document"></i>信息管理
            </template>
            <el-menu-item index="OldPeopleList">老人管理</el-menu-item>
            <el-menu-item v-if="isAdmin" index="employerList">员工管理</el-menu-item>
            <el-menu-item v-if="isAdmin" index="departmentList">部门管理</el-menu-item>
            <el-menu-item index="bedList">床位管理</el-menu-item>
            <el-menu-item index="equipmentList">设备管理</el-menu-item>
            <el-menu-item index="fundsList">资金流水</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-plus"></i>添加信息
            </template>
            <el-menu-item index="addOldPeople">添加老人</el-menu-item>
            <el-menu-item v-if="isAdmin" index="addEmployer">添加员工</el-menu-item>
            <el-menu-item v-if="isAdmin" index="addDepartment">添加部门</el-menu-item>
            <el-menu-item index="addBed">添加床位</el-menu-item>
            <el-menu-item index="addEquipment">添加设备</el-menu-item>
            <el-menu-item index="addFunds">资金记录</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-warning"></i>监控指标
            </template>
            <el-menu-item index="addQuota">指标采集</el-menu-item>
            <el-menu-item index="quotaList">体征指标</el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-star-on"></i>图表统计
            </template>
            <el-menu-item index="ageFigure">年龄画像</el-menu-item>
            <el-menu-item index="fundsFigure">资金用途</el-menu-item>
            <el-menu-item index="departmentFigure">部门数据</el-menu-item>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-setting"></i>账号
            </template>
            <el-menu-item index="adminSet">个人中心</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="20" style="height: 100%;overflow: auto;">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import storage from "../store/storage.js";
export default {
  data() {
    return {
      isAdmin: false,
      role: ""
    };
  },
  created() {
    this.role = storage.get("1").role;
    if (this.role == "管理员") {
      this.isAdmin = true;
    }
  },
  computed: {
    defaultActive: function() {
      return this.$route.path.replace("/", "");
    }
  }
};
</script>


<style lang="less" scoped>
@import "../style/mixin";
.manage_page {
}
</style>
