<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>文章列表</el-breadcrumb-item>
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
          <el-form-item label="公开:">
            <el-radio-group
              @change="onChangePublic"
              v-model="form.public"
              size="mini"
            >
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="true">公开</el-radio-button>
              <el-radio-button label="false">私有</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="分类:">
            <el-cascader
              @change="onCategoryChange"
              :options="categoryList"
              :props="props"
              clearable
            ></el-cascader>
          </el-form-item>

          <el-form-item label="标签">
            <el-select v-model="form.tags" placeholder="请选择标签" multiple>
              <el-option
                v-for="tag in tagsList"
                :key="tag.id"
                :label="tag.name"
                :value="tag.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <!-- 表格区域 -->
      <el-table :data="articleList.list" stripe style="width: 100%">
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="cover" label="图片">
          <template v-slot="data">
            <el-image
              style="width: 100px; height: 100px"
              :src="data.row.cover"
              fit="contain"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述"> </el-table-column>
        <el-table-column prop="author" label="作者"> </el-table-column>
        <el-table-column prop="public" label="是否公开">
          <template v-slot="data">
            <el-switch
              @change="onPublicChange(data.row, $event)"
              active-color="#13ce66"
              v-model="data.row.public"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="star" label="点赞数"> </el-table-column>
        <el-table-column prop="views" label="阅读人数"> </el-table-column>
        <el-table-column prop="tags" label="标签">
          <template v-slot="data">
            <el-tag v-for="tag in data.row.tags" :key="tag.name" size="mini">
              {{ tag.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="category.name" label="分类"> </el-table-column>
        <el-table-column prop="createdAt" label="创建时间">
          <template slot-scope="data">
            {{ data.row.createdAt | TimeFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="最后修改时间">
          <template slot-scope="data">
            {{ data.row.updatedAt | TimeFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="data">
            <el-button
              type="text"
              size="mini"
              @click="() => showEditDialog(data.row)"
            >
              修改
            </el-button>
            <el-button type="text" size="mini" @click="() => remove(data.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @current-change="onCurrentChange"
        :total="articleList.count"
        :page-size="pagesize"
        :current-page.sync="curpage"
        layout="prev, pager, next"
      >
      </el-pagination>
    </el-card>

    <!-- 修改对话框 -->
    <el-dialog title="修改对话框" :visible.sync="dialogVisible" width="80%">
      <el-form ref="form" :rules="rules" :model="editform" label-width="80px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="editform.title"></el-input>
        </el-form-item>
        <el-form-item label="封面链接" prop="cover">
          <el-input v-model="editform.cover"></el-input>
        </el-form-item>
        <el-form-item label="文章描述" prop="description">
          <el-input v-model="editform.description" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="category_id">
          <el-cascader
            @change="onCategoryModifyChange"
            :options="categoryList"
            :props="props"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="文章标签" prop="tags">
          <el-select v-model="editform.tags" placeholder="请选择标签" multiple>
            <el-option
              v-for="tag in tagsList"
              :key="tag.id"
              :label="tag.name"
              :value="tag.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <el-input
            v-model="editform.content"
            :rows="18"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { editArticlePublic, deleteArticle, editArticle } from "../../api";
import { validateUrl } from "../../utils/validator";
export default {
  name: "BlogAdminArticleList",
  data() {
    return {
      pagesize: 6,
      curpage: 1,
      dialogVisible: false,
      keyword: "",
      form: {
        category_id: -1,
        tags: [],
        public: "all",
      },
      editform: {
        id: 0,
        title: "",
        cover: "",
        description: "",
        category_id: -1,
        tags: [],
        content: "",
      },
      props: {
        value: "id",
        label: "name",
        children: "children",
        leaf: "isLeaf",
      },
      rules: {
        title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
        cover: [{ validator: validateUrl, required: true, trigger: "blur" }],
        description: [
          { required: true, message: "请输入文章描述", trigger: "blur" },
        ],
        category_id: [
          { required: true, message: "请选择文章类别", trigger: "blur" },
        ],
        tags: [{ required: true, message: "请选择文章标签", trigger: "blur" }],
        content: [
          { required: true, message: "请输入文章内容", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapState(["tagsList", "categoryList", "articleList"]),

    tagsOptions() {
      return this.tagsList.map((val) => {
        return val.id;
      });
    },
    query() {
      return {
        category_id: this.form.category_id,
        tags: this.form.tags.toString(),
        public: this.form.public,
        curpage: this.curpage,
        pagesize: this.pagesize,
      };
    },
    getPublicBool(str) {
      if (str == "true") {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    form: {
      deep: true,
      handler() {
        this.getArticleList();
      },
    },
  },
  methods: {
    handleCheckAllChange(val) {
      this.form.tags = val ? this.tagsOptions : [];
      this.isIndeterminate = false;
    },
    onCategoryChange(ids) {
      if (ids.length > 0) {
        this.form.category_id = ids[ids.length - 1];
      } else {
        this.form.category_id = -1;
      }
    },
    onCategoryModifyChange(ids) {
      if (ids.length > 0) {
        this.editform.category_id = ids[ids.length - 1];
      } else {
        this.editform.category_id = -1;
      }
    },
    onChangePublic(val) {
      this.form.public = val;
    },
    onSearch() {
      let data = {
        ...this.query,
        keyword: this.keyword,
      };
      this.$store.dispatch("GetArticleList", data);
    },
    async onPublicChange(data, state) {
      let obj = { id: data.id, public: state };
      let res = await editArticlePublic(obj);
      if (res.meta.status == 200) {
        this.$message.success(res.meta.msg);
      } else {
        this.$message.error(res.meta.msg);
      }
    },
    //编辑
    showEditDialog(node) {
      this.editform.id = node.id;
      this.editform.title = node.title;
      this.editform.cover = node.cover;
      this.editform.content = node.content;
      this.editform.description = node.description;
      this.editform.category_id = node.category_id;
      this.editform.tags = node.tags.map((item) => {
        return item.id;
      });
      this.dialogVisible = true;
    },
    async onEdit() {
      let res = await editArticle(this.editform);
      if (res.meta.status == 200) {
        this.dialogVisible = false;
        this.getArticleList();
        this.$message.success(res.meta.msg);
      }
    },
    async remove(node) {
      this.$confirm("此操作将永久删除该类别, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await deleteArticle(node.id);
          if (res.meta.status == 204) {
            this.getArticleList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    onCurrentChange(page) {
      this.curpage = page;
      this.getArticleList();
    },
    getArticleList() {
      let obj = {
        category_id: this.form.category_id,
        tags: this.form.tags.toString(),
        public: this.form.public,
        curpage: this.curpage,
        pagesize: this.pagesize,
      };
      this.$store.dispatch("GetArticleList", obj);
    },
  },
  beforeMount() {
    this.getArticleList();
  },
};
</script>

<style lang="scss" scoped>
.box {
  margin-top: 20px;
}
.el-radio-button {
  margin-right: 10px;
  margin-bottom: 10px;
}
::v-deep .el-radio-button__inner {
  border: 1px solid rgb(237, 234, 234);
  border-radius: 4px !important;
}
.el-checkbox-button {
  margin-right: 10px;
  margin-bottom: 10px;
}
::v-deep .el-checkbox-button__inner {
  border: 1px solid rgb(237, 234, 234);
  border-radius: 4px !important;
}
.el-pagination {
  text-align: center;
}
</style> 
 