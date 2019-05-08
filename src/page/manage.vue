<template>
  <div class="manage_page fillcontain">
    <el-row style="height: 100%;">
      <el-col :span="4" style="min-height: 100%; background-color: #324057;">
        <el-menu :default-active="defaultActive" style="min-height: 100%;" theme="dark" router>
          <el-menu-item index="manage">
            <i class="el-icon-menu"></i>首页
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-document"></i>数据管理
            </template>
            <el-menu-item index="departmentList">部门管理</el-menu-item>
            <el-menu-item index="OldPeopleList">老人管理</el-menu-item>
            <el-menu-item index="employerList">员工管理</el-menu-item>
            <el-menu-item index="bedList">床位管理</el-menu-item>
            <el-menu-item index="equipmentList">设备管理</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-plus"></i>添加数据
            </template>
            <el-menu-item index="addOldPeople">添加老人</el-menu-item>
            <el-menu-item index="addEmployer">添加员工</el-menu-item>
            <el-menu-item index="addDepartment">添加部门</el-menu-item>
            <el-menu-item index="addBed">添加床位</el-menu-item>
            <el-menu-item index="addEquipment">添加设备</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-star-on"></i>图表
            </template>
            <el-menu-item index="visitor">用户分布</el-menu-item>
            <!-- <el-menu-item index="newMember">用户数据</el-menu-item> -->
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-edit"></i>编辑
            </template>
            <!-- <el-menu-item index="uploadImg">上传图片</el-menu-item> -->
            <el-menu-item index="vueEdit">文本编辑</el-menu-item>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-setting"></i>设置
            </template>
            <el-menu-item index="adminSet">账号设置</el-menu-item>
            <!-- <el-menu-item index="sendMessage">发送通知</el-menu-item> -->
          </el-submenu>
          <el-submenu index="7">
            <template slot="title">
              <i class="el-icon-warning"></i>说明
            </template>
            <el-menu-item index="explain">系统说明</el-menu-item>
          </el-submenu>
          <el-menu-item index="8">
            <template slot="title">
              <i class="el-icon-share"></i>监控
            </template>
          </el-menu-item>
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
export default {
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
