<template>
  <div>
    <head-top></head-top>
    <section class="data_section">
      <header class="section_title">运营状况</header>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="4">
          <div class="data_list today_head">
            <span class="data_num head">当日数据：</span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data_list">
            收入：
            <span class="data_num">{{dayIncome}}</span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data_list">
            支出：
            <span class="data_num">{{dayOutlay}}</span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data_list">
            利润：
            <span class="data_num">{{dayProfit}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="data_list all_head">
            <span class="data_num head">一周数据：</span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data_list">
            收入：
            <span class="data_num">{{weekIncome}}</span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data_list">
            支出：
            <span class="data_num">{{weekOutlay}}</span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data_list">
            利润：
            <span class="data_num">{{weekProfit}}</span>
          </div>
        </el-col>
      </el-row>
    </section>
    <div id="state" style="width: 100%;height:600px;"></div>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts";
// 引入柱状图
import "echarts/lib/chart/bar";
import "echarts/lib/component/legend";
import "echarts/lib/component/tooltip";
import headTop from "../components/headTop";
export default {
  data() {
    return {
      dayIncome: 0,
      dayOutlay: 0,
      dayProfit: 0,
      weekIncome: 0,
      weekOutlay: 0,
      weekProfit: 0,
      dates: [],
      incomes: [],
      outlays: [],
      profits: [],
      moneys: []
    };
  },
  components: {
    headTop
  },
  activated: function() {},
  mounted() {
    this.myChart = echarts.init(document.getElementById("state"));
    this.initData();
  },
  methods: {
    async initData() {
      try {
        this.$http.get("funds/getWeekMoney").then(res => {
          if (res.data.code == 1) {
            this.moneys = res.data.data;
            this.dayIncome = this.moneys[6].income;
            this.dayOutlay = this.moneys[6].outlay;
            this.dayProfit = this.moneys[6].profit;
            for (var i = 0; i < 7; i++) {
              this.weekIncome = this.weekIncome + this.moneys[i].income;
              this.weekOutlay = this.weekOutlay + this.moneys[i].outlay;
              this.weekProfit = this.weekProfit + this.moneys[i].profit;
              this.incomes.push(this.moneys[i].income);
              this.outlays.push(0 - this.moneys[i].outlay);
              this.profits.push(this.moneys[i].profit);
              this.dates.push(this.moneys[i].date);
            }
            //console.log(this.incomes);
            //console.log(this.outlays);
            //console.log(this.profits);
            //console.log(this.dates);
            const option = {
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  // 坐标轴指示器，坐标轴触发有效
                  type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              legend: {
                data: ["利润", "支出", "收入"]
              },
              grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true
              },
              xAxis: [
                {
                  type: "value"
                }
              ],
              yAxis: [
                {
                  type: "category",
                  axisTick: { show: false },
                  data: this.dates
                }
              ],
              series: [
                {
                  name: "利润",
                  type: "bar",
                  label: {
                    normal: {
                      show: true,
                      position: "inside"
                    }
                  },
                  data: this.profits
                },
                {
                  name: "收入",
                  type: "bar",
                  stack: "总量",
                  label: {
                    normal: {
                      show: true
                    }
                  },
                  data: this.incomes
                },
                {
                  name: "支出",
                  type: "bar",
                  stack: "总量",
                  label: {
                    normal: {
                      show: true,
                      position: "left"
                    }
                  },
                  data: this.outlays
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
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.data_section {
  padding: 18px;
  margin-bottom: 40px;
  .section_title {
    text-align: center;
    font-size: 30px;
    margin-bottom: 10px;
  }
  .data_list {
    text-align: center;
    font-size: 18px;
    color: #333;
    border-radius: 6px;
    background: #e5e9f2;
    .data_num {
      color: #333;
      font-size: 20px;
    }
    .head {
      border-radius: 6px;
      font-size: 22px;
      padding: 4px 0;
      color: #fff;
      display: inline-block;
    }
  }
  .today_head {
    background: #ff9800;
  }
  .all_head {
    background: #20a0ff;
  }
}
.wan {
  .sc(16px, #333);
}
</style>
