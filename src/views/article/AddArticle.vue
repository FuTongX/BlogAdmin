<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加文章</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-form
        ref="articleForm"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="80px"
      >
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="封面链接" prop="cover">
          <el-input v-model="form.cover"></el-input>
        </el-form-item>
        <el-form-item label="文章描述" prop="description">
          <el-input v-model="form.description" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="category_id">
          <el-cascader
            @change="onCategoryChange"
            :options="categoryList"
            :props="props"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="文章标签" prop="tags">
          <el-select v-model="form.tags" placeholder="请选择标签" multiple>
            <el-option
              v-for="tag in tagsList"
              :key="tag.id"
              :label="tag.name"
              :value="tag.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建日期" prop="createdAt">
          <el-date-picker
            v-model="form.createdAt"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否公开">
          <el-radio-group v-model="form.public">
            <el-radio :label="true">公开</el-radio>
            <el-radio :label="false">私密</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <el-input
            v-model="form.content"
            :rows="18"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="onResetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { addArticle } from "../../api";
import { validateUrl } from "../../utils/validator";

export default {
  name: "BlogAdminAddArticle",
  data() {
    return {
      form: {
        title: "",
        cover: "",
        description: "",
        category_id: "",
        tags: [],
        createdAt: "",
        public: false,
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
        createdAt: [{ required: true, message: "请选择时间", trigger: "blur" }],
        content: [
          { required: true, message: "请输入文章内容", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    async onSubmit() {
      this.$refs.articleForm.validate(async (pass) => {
        if (pass) {
          let res = await addArticle(this.form);
          console.log(res);
        } else {
          //弹出提示
          this.$message.error("请完成内容填写");
        }
      });
    },
    onResetForm() {
      this.$refs["articleForm"].resetFields();
    },
    onCategoryChange(ids) {
      this.form.category_id = ids[ids.length - 1];
    },
    filter(node, key) {
      console.log(node, key);
    },
  },

  computed: {
    ...mapState(["tagsList", "categoryList"]),
  },
};
</script>

<style lang="scss" scoped>
</style> 
 