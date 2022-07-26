<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>评论管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input v-model="keyword" placeholder="请输入搜索关键词">
            <el-button
              @click="onSearch"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"> </el-col>
      </el-row>
      <div class="box">
        <el-form>
          <el-form-item label="状态:">
            <el-radio-group
              @change="onChangePublic"
              v-model="form.state"
              size="mini"
            >
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="true">开放</el-radio-button>
              <el-radio-button label="false">屏蔽</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>

      <!-- 表格区域 -->
      <el-table :data="commentList.list" stripe style="width: 100%">
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column prop="article.title" label="评论的文章">
        </el-table-column>
        <el-table-column prop="content" label="内容"> </el-table-column>
        <el-table-column prop="visitor.ip" label="访客IP"> </el-table-column>
        <el-table-column prop="state" label="是否公开">
          <template v-slot="data">
            <el-switch
              @change="onPublicChange(data.row, $event)"
              active-color="#13ce66"
              v-model="data.row.state"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间">
          <template slot-scope="data">
            {{ data.row.createdAt | TimeFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="data">
            <el-button
              type="text"
              size="mini"
              @click="() => onRemove(data.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @current-change="onCurrentChange"
        :total="commentList.count"
        :page-size="pagesize"
        :current-page.sync="curpage"
        layout="prev, pager, next"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { deleteCommentById, editCommentState } from "@/api";
export default {
  name: "BlogAdminMessage",
  data() {
    return {
      keyword: "",
      form: {
        state: "all",
      },
      pagesize: 5,
      curpage: 1,
    };
  },
  beforeMount() {
    this.GetCommentList();
  },
  computed: {
    ...mapState(["commentList"]),
  },
  methods: {
    //搜索
    onSearch() {
      this.GetCommentList();
    },
    onChangePublic() {
      this.GetCommentList();
    },

    //选择是否公开
    async onPublicChange(data) {
      let res = await editCommentState(data.id, data.state);
      if (res.meta.status == 200) {
        this.$message.success(res.meta.msg);
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    //分页
    onCurrentChange(page) {
      this.curpage = page;
      this.GetCommentList();
    },

    //删除
    async onRemove(data) {
      this.$confirm("此操作将永久删除该评论, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await deleteCommentById(data.id);
          if (res.meta.status == 204) {
            this.GetCommentList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    GetCommentList() {
      let searchObj = {
        state: this.form.state,
        pagesize: this.pagesize,
        curpage: this.curpage,
      };
      if (String(this.keyword).trim !== "") {
        searchObj.keyword = this.keyword;
      }
      this.$store.dispatch("getCommentList", searchObj);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-pagination {
  text-align: center;
}
</style> 
 