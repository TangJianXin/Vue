<template>
  <div>
    <head-top></head-top>
    <div style="margin-top: 20px;">
      <div id="people" style="width: 600px;height:500px; float:left"></div>
      <div id="equipment" style="width: 400px;height:500px; float:left"></div>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import echarts from "echarts/lib/echarts";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/chart/line";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/pie";
import "echarts/lib/component/tooltip";
export default {
  data() {
    return {
      departments: [],
      equipmentCounts: [],
      peopleCounts: []
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.myChart1 = echarts.init(document.getElementById("people"));
    this.myChart2 = echarts.init(document.getElementById("equipment"));
    this.initData();
  },
  methods: {
    async initData() {
      try {
        this.$http.get("department/getCount").then(res => {
          if (res.data.code == 1) {
            this.departments = res.data.data;
            for (var i = 0; i < this.departments.length; i++) {
              this.equipmentCounts.push(this.departments[i].equipmentCount);
              this.peopleCounts.push(this.departments[i].peopleCount);
            }
           this.drawPeople();
           this.drawEquipment();
          } else {
            this.$message.error("获取数据失败");
          }
        });
      } catch (err) {
        console.log("获取数据失败", err);
      }
    },
    drawEquipment() {
      const option = {
        title: {
          text: "部门设备",
          subtext: "",
          x: "center"
        },
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: [
              "院长办公室",
              "管理部",
              "医疗部",
              "护工部",
              "保卫处",
              "财务处",
              "后勤处",
              "人事处"
            ],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "设备数量",
            type: "bar",
            barWidth: "60%",
            data: this.equipmentCounts
          }
        ]
      };
      this.myChart1.setOption(option);
    },
    drawPeople() {
      const option = {
        title: {
          text: "部门员工",
          subtext: "",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "left",
          data: [
            "院长办公室",
            "管理部",
            "医疗部",
            "护工部",
            "保卫处",
            "财务处",
            "后勤处",
            "人事处"
          ]
        },
        series: [
          {
            name: "部门人数",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: this.peopleCounts[0], name: "院长办公室" },
              { value: this.peopleCounts[1], name: "管理部" },
              { value: this.peopleCounts[2], name: "财务处" },
              { value: this.peopleCounts[3], name: "后勤处" },
              { value: this.peopleCounts[4], name: "保卫处" },
              { value: this.peopleCounts[5], name: "医疗部" },
              { value: this.peopleCounts[6], name: "护工部" },
              { value: this.peopleCounts[7], name: "人事处" }
            ]
          }
        ]
      };
      this.myChart2.setOption(option);
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
</style>
