<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
      <el-breadcrumb-item>标签管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="标签列表" name="tagslist">
          <el-table :data="tagsList" style="width: 100%">
            <el-table-column type="index" label="#" width="100">
            </el-table-column>
            <el-table-column prop="id" label="id" width="180">
            </el-table-column>
            <el-table-column prop="name" label="标签名称" width="480">
            </el-table-column>
            <el-table-column label="操作" width="380">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row)"
                ></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="onDelete(scope.row.id)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="新增标签" name="newtag">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="标签名:" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">创建</el-button>
              <el-button @click="onReset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 修改对话框 -->
    <el-dialog title="修改对话框" :visible.sync="dialogVisible" width="50%">
      <el-form ref="form" :model="editform" label-width="80px">
        <el-form-item label="标签:" prop="name">
          <el-input v-model="editform.name"></el-input>
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
import { setTag, deleteTag, editTag } from "../../api";
export default {
  name: "BlogAdminTag",
  data() {
    return {
      activeName: "tagslist",
      dialogVisible: false,
      form: {
        name: "",
      },
      editform: {},
      rules: {
        name: [{ required: true, message: "请输入标签名称", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapState(["tagsList"]),
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(async (pass) => {
        if (pass) {
          let res = await setTag(this.form);
          if (res.meta.status == 201) {
            this.$store.dispatch("GetTagList");
          }
        }
      });
    },
    onReset() {
      this.$refs.form.resetFields();
    },

    async onDelete(id) {
      this.$confirm("此操作将永久删除该标签, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await deleteTag({ id });
          if (res.meta.status === 204) {
            this.$store.dispatch("GetTagList");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    showEditDialog(data) {
      this.editform = { ...data };
      this.dialogVisible = true;
    },
    async onEdit() {
      let res = await editTag(this.editform);
      if (res.meta.status == 200) {
        this.dialogVisible = false;
        this.$store.dispatch("GetTagList");
        this.$message.success(res.meta.msg);
      }
    },
  },
  beforeMount() {
    this.$store.dispatch("GetTagList");
  },
};
</script>

<style lang="scss" scoped>
</style> 
 