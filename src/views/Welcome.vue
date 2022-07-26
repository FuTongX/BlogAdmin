<template>
  <div class="container">
    <el-row>
      <el-col>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-card class="box-card">
              <div class="info">
                <span class="count">{{ statisticsData.articleCount }}</span>
                <span class="title">文章</span>
              </div>
              <div class="tag">
                <i class="el-icon-document"></i>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6"
            ><el-card class="box-card">
              <div class="info">
                <span class="count">{{ statisticsData.categoryCount }}</span>
                <span class="title">分类</span>
              </div>
              <div class="tag">
                <i class="el-icon-folder"></i></div></el-card
          ></el-col>
          <el-col :span="6"
            ><el-card class="box-card">
              <div class="info">
                <span class="count">{{ statisticsData.tagCount }}</span>
                <span class="title">标签</span>
              </div>
              <div class="tag">
                <i class="el-icon-collection-tag"></i>
              </div> </el-card
          ></el-col>
          <el-col :span="6"
            ><el-card class="box-card">
              <div class="info">
                <span class="count">{{ statisticsData.commentCount }}</span>
                <span class="title">留言</span>
              </div>
              <div class="tag">
                <i class="el-icon-chat-line-square"></i>
              </div> </el-card
          ></el-col>
        </el-row>
      </el-col>
      <el-col>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-card ref="c1">
              <div slot="header">
                <span>分类文章统计</span>

                >
              </div>
              <div id="category" style="width: 400px; height: 200px"></div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card>
              <div slot="header">
                <span>文章访问Top10</span>
                <el-button style="float: right; padding: 3px 0" type="text"
                  >操作按钮</el-button
                >
              </div>
              <el-table
                size="mini"
                :data="lastViewsArticle"
                max-height="200"
                style="width: 100%"
              >
                <el-table-column prop="title" label="标题"> </el-table-column>
                <el-table-column prop="views" label="访问数" width="60">
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card>
              <div slot="header">
                <span>访问地区统计</span>
              </div>
              <div id="VisitorAddr" style="width: 400px; height: 200px"></div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-card>
              <div slot="header">
                <span>近期评论</span>
              </div>

              <el-table
                height="200"
                size="mini"
                :data="lastComment"
                style="width: 100%"
              >
                <el-table-column prop="visitor.ip" label="发起人">
                </el-table-column>
                <el-table-column prop="content" label="内容" width="60">
                </el-table-column>
                <el-table-column prop="article.title" label="分类">
                </el-table-column>
                <el-table-column prop="createdAt" label="评论时间">
                  <template slot-scope="data">
                    {{ data.row.createdAt | timeFormat }}
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card>
              <div slot="header">
                <span>近期文章</span>
              </div>

              <el-table
                size="mini"
                :data="lastCreateArticle"
                style="width: 100%"
                height="200"
              >
                <el-table-column prop="title" label="标题"> </el-table-column>
                <el-table-column prop="category.name" label="分类" width="60">
                </el-table-column>
                <el-table-column prop="views" label="访问数"> </el-table-column>
                <el-table-column prop="createdAt" label="发表时间">
                  <template slot-scope="data">
                    {{ data.row.createdAt | TimeFormat }}
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from "vuex";

import { getArticleCategory, getVisitor } from "@/api";
export default {
  name: "BlogAdminWelcome",
  beforeMount() {
    this.$store.dispatch("GetTagList");
    this.$store.dispatch("GetCategoryList");
    this.$store.dispatch("getStatisticsData");
    this.$store.dispatch("getLastViewsArticletTop");
    this.$store.dispatch("getLastCommentTop");
    this.$store.dispatch("getLastCreatedArticletTop");
  },
  mounted() {
    this.chartCategory();
    this.getVisitorAddr();
  },
  data() {
    return {
      option: {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "bottom",
        },
        series: [
          {
            type: "pie",
            radius: "50%",
            labelLine: {
              show: false,
            },
            label: {
              show: false,
              position: "center",
            },
            data: [],
          },
        ],
      },
      option1: {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "bottom",
        },
        series: [
          {
            type: "pie",
            radius: "50%",
            labelLine: {
              show: false,
            },
            label: {
              show: false,
              position: "center",
            },
            data: [],
          },
        ],
      },
    };
  },
  computed: {
    ...mapState([
      "statisticsData",
      "lastViewsArticle",
      "lastComment",
      "lastCreateArticle",
      "articleCategory",
    ]),
  },

  methods: {
    async chartCategory() {
      let res = await getArticleCategory();
      if (res.meta.status == 200) {
        this.option.series[0].data = res.data.list;
        let myChart = this.$echarts.init(document.getElementById("category"));
        window.addEventListener("resize", () => {
          myChart.resize();
        });
        // 绘制图表
        myChart.setOption(this.option);
      }
    },

    async getVisitorAddr() {
      let res = await getVisitor();
      if (res.meta.status == 200) {
        this.option1.series[0].data = res.data.list;
        let myChart = this.$echarts.init(
          document.getElementById("VisitorAddr")
        );
        window.addEventListener("resize", () => {
          myChart.resize();
        });
        // 绘制图表
        myChart.setOption(this.option1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  .el-row {
    margin-bottom: 10px;
  }
  .box-card {
    height: 80px;
  }
}
::v-deep .el-card__body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .info {
    span {
      display: block;
    }
    .count {
      color: #778795;
      font-size: 30px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .title {
      color: #b8b8b8;
      font-size: 10px;
      text-align: center;
    }
  }
  .tag {
    font-size: 35px;
    color: #b8b8b8;
    margin-bottom: 10px;
  }
}
</style> 