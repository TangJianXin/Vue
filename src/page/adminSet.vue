<template>
  <div class="fillcontain">
    <head-top></head-top>
    <header class="admin_title">个人中心</header>
    <div class="admin_set">
      <ul>
        <li>
          <span>姓名：</span>
          <span>{{employer.name}}</span>
        </li>
        <li>
          <span>权限：</span>
          <span>{{role}}</span>
        </li>
        <li>
          <span>用户名：</span>
          <span>{{entity.username}}</span>
        </li>
        <li>
          <span>注册时间：</span>
          <span>{{getDate(entity.registerDate)}}</span>
        </li>
        <li>
          <span>更换头像：</span>
          <el-upload
            class="avatar-uploader"
            name="photo"
            action="http://localhost:8081/file/photo/employer"
            :show-file-list="false"
            :on-success="uploadImg"
            :before-upload="beforeImgUpload"
          >
            <img :src="url" class="avatar">
          </el-upload>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import storage from "../store/storage.js";
import { mapState } from "vuex";
import { baseUrl, baseImgPath } from "@/config/env";

export default {
  data() {
    return {
      baseUrl,
      baseImgPath,
      role: "",
      entity: {},
      employer: {},
      url: "",
      object: {},
    };
  },
  created() {
    this.object = storage.get("1");
    this.role = this.object.role;
    this.entity = this.object.entity;
    this.employer = this.object.entity.employerByEmployerId;
    if (this.object.url != null) {
      this.url = storage.get("1").url;
    } else {
      this.url = this.baseImgPath + this.adminInfo.avatar;
    }
  },
  components: {
    headTop
  },
  inject: ["reload"],

  computed: {
    ...mapState(["adminInfo"])
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
    uploadImg(res, file) {
      if (res.code == 1) {
        this.entity.image = res.data.photo;
        this.url = res.data.url;
        this.object.entity.image = res.data.photo;
        this.object.url = res.data.url;
        storage.set("1", this.object);
        var url = "";
        if (this.object.role == "管理员") {
          url = "admin/uploadImage";
        } else {
          url = "user/uploadImage";
        }
        let form = new FormData();
        form.append("username", this.entity.username);
        form.append("image", this.entity.image);
        this.$http.post(url, form).then(res => {
          if (res.data.code == 1) {
            this.$message({
              type: "success",
              message: "头像更新成功"
            });
          } else {
            this.$message.error("头像更新失败");
          }
        });
        this.reload();
      } else {
        this.$message.error("头像更新失败");
      }
    },
    beforeImgUpload(file) {
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
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.explain_text {
  margin-top: 20px;
  text-align: center;
  font-size: 20px;
  color: #333;
}
.admin_set {
  width: 60%;
  background-color: #f9fafc;
  min-height: 400px;
  margin: 20px auto 0;
  border-radius: 10px;
  ul > li {
    padding: 20px;
    span {
      color: #666;
    }
  }
}
.admin_title {
  margin-top: 20px;
  .sc(24px, #666);
  text-align: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  margin-top: 10px;
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
