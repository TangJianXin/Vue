<template>
  <div>
    <head-top></head-top>
    <div id="heart" style="width: 100%;height:400px;"></div>
    <div style="text-align:center">
      <el-select v-model="oldPeopleId" placeholder="选择老人">
        <el-option
          v-for="item in menuOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="handle">{{info}}</el-button>
    </div>
  </div>
</template>

<script>
import headTop from "@/components/headTop";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/tooltip";
export default {
  data() {
    return {
      heart: "",
      breathe: "",
      temperature: "",
      hearts: [30],
      breathes: [30],
      temperatures: [30],
      times: [],
      oldPeopleId: "",
      menuOptions: [],
      info: "采集"
    };
  },
  components: {
    headTop
  },
  created() {},
  activated: function() {
    this.websocket();
    this.initData();
    this.myChart = echarts.init(document.getElementById("heart"));
    this.draw();
    this.getOldPeoples();
  },
  mounted() {},
  methods: {
    async initData() {
      for (var i = 0; i < 30; i++) {
        this.times[i] = i + 1;
      }
    },
    //获取所有员工
    async getOldPeoples() {
      this.menuOptions = [];
      try {
        this.$http.get("oldPeople/findAll").then(res => {
          const menu = res.data.data;
          menu.forEach((item, index) => {
            this.menuOptions.push({
              label: item.oldPeople.name,
              value: item.oldPeople.oldPeopleId
            });
          });
        });
      } catch (err) {
        console.log("获取老人失败", err);
      }
    },
    websocket() {
      let ws = new WebSocket("ws://localhost:8081/websocket");
      ws.onopen = () => {
        // Web Socket 已连接上，使用 send() 方法发送数据
        //console.log("数据发送中...");
        //console.log("数据发送完成");
        console.log("连接成功...");
      };
      ws.onmessage = evt => {
        var s = evt.data;
        var str = s.split(",");
        this.heart = str[0];
        this.breathe = str[1];
        this.temperature = str[2];
        if (this.heart < 59) {
          this.$notify.error({
            title: "危险",
            message: "心率过低",
            offset: 100
          });
        }
        if (this.breathe < 59) {
          this.$notify.error({
            title: "危险",
            message: "呼吸次数过低",
            offset: 100
          });
        }
        if (this.temperature > 38.1) {
          this.$notify.error({
            title: "危险",
            message: "体温过高",
            offset: 100
          });
        }
        this.moveHeart();
        this.moveBreathe();
        this.moveTemperature();
        this.draw();
      };
      ws.onclose = function() {
        // 关闭 websocket
        console.log("连接已关闭...");
      };
      // 路由跳转时结束websocket链接
      this.$router.afterEach(function() {
        ws.close();
      });
    },
    moveHeart() {
      if (this.hearts.length < 30) {
        this.hearts.push(this.heart);
      } else {
        for (var i = 0; i < 29; i++) {
          this.hearts[i] = this.hearts[i + 1];
        }
        this.hearts[29] = this.heart;
      }
    },
    moveBreathe() {
      if (this.breathes.length < 30) {
        this.breathes.push(this.breathe);
      } else {
        for (var i = 0; i < 29; i++) {
          this.breathes[i] = this.breathes[i + 1];
        }
        this.breathes[29] = this.breathe;
      }
    },
    moveTemperature() {
      if (this.temperatures.length < 30) {
        this.temperatures.push(this.temperature);
      } else {
        for (var i = 0; i < 29; i++) {
          this.temperatures[i] = this.temperatures[i + 1];
        }
        this.temperatures[29] = this.temperature;
      }
    },
    draw() {
      const option = {
        title: {
          text: "实时体征指标"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["心率", "呼吸次数", "体温"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.times
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "心率",
            type: "line",
            stack: "总量",
            data: this.hearts
          },
          {
            name: "呼吸次数",
            type: "line",
            stack: "总量",
            data: this.breathes
          },
          {
            name: "体温",
            type: "line",
            stack: "总量",
            data: this.temperatures
          }
        ]
      };
      this.myChart.setOption(option);
    },
    async handle() {
      if (this.info == "采集") {
        this.hearts.splice(0, this.hearts.length);
        this.breathes.splice(0, this.breathes.length);
        this.temperatures.splice(0, this.temperatures.length);
        try {
          let form = new FormData();
          form.append("oldPeopleId", this.oldPeopleId);
          this.$http.post("schedule/start", form).then(res => {
            if (res.data.code == 1) {
              this.$message({
                type: "success",
                message: "开启采集成功！"
              });
              this.info = "关闭";
            } else {
              this.$message.error("开启采集失败！");
            }
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          this.$http.post("schedule/stop").then(res => {
            if (res.data.code == 1) {
              this.$message({
                type: "success",
                message: "关闭采集成功！"
              });
              this.info = "采集";
            } else {
              this.$message.error("关闭采集失败！");
            }
          });
        } catch (err) {
          console.log(err);
        }
      }
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
