<template>
  <div class="visitorpie">
    <div id="visitorpie" class style="width: 90%;height:450px;"></div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts";
// 引入柱状图
import "echarts/lib/chart/pie";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";

export default {
  data() {
    return {
      ages: []
    };
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById("visitorpie"));
    this.initData();
  },
  props: ["pieData"],
  methods: {
    initData() {
      try {
        this.$http.get("oldPeople/getAge").then(res => {
          if (res.data.code == 1) {
            this.ages = res.data.data;
            const option = {
              title: {
                text: "老人年龄分布",
                subtext: "",
                x: "center"
              },
              tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                orient: "vertical",
                left: "left",
                data: ["50-55岁", "55-60岁", "60-65岁", "65-70岁", "70岁以上"]
              },
              series: [
                {
                  name: "年龄分布",
                  type: "pie",
                  radius: "55%",
                  center: ["50%", "60%"],
                  data: [
                    { value: this.ages[0], name: "50-55岁" },
                    { value: this.ages[1], name: "55-60岁" },
                    { value: this.ages[2], name: "60-65岁" },
                    { value: this.ages[3], name: "65-70岁" },
                    { value: this.ages[4], name: "70岁以上" }
                  ],
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: "rgba(0, 0, 0, 0.5)"
                    }
                  }
                }
              ]
            };
            this.myChart.setOption(option);
          }
        });
      } catch (err) {
        this.$message.error("查询失败！");
        console.log("获取数据失败", err);
      }
    }
  },
  watch: {
    pieData: function() {
      this.initData();
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.visitorpie {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
