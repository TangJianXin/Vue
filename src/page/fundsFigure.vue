<template>
  <div>
    <head-top></head-top>
    <div id="funds" style="width: 100%;height:500px;margin-top: 20px;"></div>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import echarts from "echarts/lib/echarts";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/chart/line";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/tooltip";
export default {
  data() {
    return {
      fundsTypes: [],
      dates: [],
      purchases: [],
      pays: [],
      dues: [],
      fixs: [],
      others: []
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById("funds"));
    this.initData();
  },
  methods: {
    async initData() {
      try {
        this.$http.get("funds/getFundsType").then(res => {
          if (res.data.code == 1) {
            this.fundsTypes = res.data.data;
            for (var i = 0; i < this.fundsTypes.length; i++) {
              this.dates.push(this.fundsTypes[i].date);
              this.purchases.push(this.fundsTypes[i].purchase);
              this.pays.push(this.fundsTypes[i].pay);
              this.dues.push(this.fundsTypes[i].due);
              this.fixs.push(this.fundsTypes[i].fix);
              this.others.push(this.fundsTypes[i].other);
            }
            this.draw();
          } else {
            this.$message.error("获取数据失败");
          }
        });
      } catch (err) {
        console.log("获取数据失败", err);
      }
    },
    draw() {
      const option = {
        title: {
          text: "资金用途"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["采购", "工资", "月费", "设备维护", "其它"]
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
          data: this.dates
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "采购",
            type: "line",
            stack: "总量",
            data: this.purchases
          },
          {
            name: "工资",
            type: "line",
            stack: "总量",
            data: this.pays
          },
          {
            name: "月费",
            type: "line",
            stack: "总量",
            data: this.dues
          },
          {
            name: "设备维护",
            type: "line",
            stack: "总量",
            data: this.fixs
          },
          {
            name: "其它",
            type: "line",
            stack: "总量",
            data: this.others
          }
        ]
      };
      this.myChart.setOption(option);
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
</style>
