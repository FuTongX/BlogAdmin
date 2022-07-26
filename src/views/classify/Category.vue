<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
      <el-breadcrumb-item>类别管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="类别列表" name="categoryTree">
          <el-table
            :data="categoryList"
            style="width: 100%; margin-bottom: 20px"
            row-key="id"
            border
            default-expand-all
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          >
            <el-table-column type="index" label="#" width="80">
            </el-table-column>
            <el-table-column prop="name" label="类别名" sortable width="200">
            </el-table-column>
            <el-table-column width="120" label="图片地址">
              <template v-slot="data">
                <el-image
                  style="width: 100px; height: 100px"
                  :src="data.row.cover"
                  fit="scale-down"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" width="190">
            </el-table-column>
            <el-table-column label="叶子节点" width="80">
              <template  v-slot="data">
                <el-tag type="info">{{ data.row.isLeaf }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="180">
              <template v-slot="data">
                <el-button
                  type="text"
                  size="mini"
                  @click="() => showEditDialog(data.row)"
                >
                  修改
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="() => remove(data.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="新增类别" name="newCategory">
          <el-form ref="form" :model="form" :rules="rules" label-width="90px">
            <el-form-item label="父节点">
              <el-cascader
                :options="categoryListNoLeaf"
                :props="props"
                @change="parentIdChange"
              >
              </el-cascader>
            </el-form-item>
            <el-form-item label="叶子节点">
              <el-radio-group v-model="form.isLeaf">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="类别名:" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="描述:" prop="description">
              <el-input type="textarea" v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item label="图片链接:" prop="cover">
              <el-input v-model="form.cover"></el-input>
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
        <el-form-item label="父节点">
          <el-cascader
            @change="onCategoryChange"
            :options="categoryEditList"
            :props="props"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="类名:" prop="name">
          <el-input v-model="editform.name"></el-input>
        </el-form-item>
        <el-form-item label="图片链接:" prop="cover">
          <el-input v-model="editform.cover"></el-input>
        </el-form-item>
        <el-form-item label="描述:" prop="description">
          <el-input type="textarea" v-model="editform.description"></el-input>
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
import { mapGetters, mapState } from "vuex";
import { setCategory, deleteCategory, editCategory } from "../../api";
import { validateUrl } from "../../utils/validator";
import { cloneDeep } from "lodash";
export default {
  name: "BlogAdminCategory",
  data() {
    return {
      dialogVisible: false,
      activeName: "categoryTree",
      form: {
        name: "",
        isLeaf: false,
        parentId: -1,
        cover: "",
        description: "",
      },
      editform: {
        name: "",
        cover: "",
        description: "",
        isLeaf: false,
        parentId: -1,
      },
      rules: {
        name: [{ required: true, message: "请输入类别名称", trigger: "blur" }],
        description: [
          { required: true, message: "请输入类别描述", trigger: "blur" },
        ],
        cover: [{ validator: validateUrl, required: true, trigger: "blur" }],
      },
      props: {
        value: "id",
        label: "name",
        children: "children",
        checkStrictly: true,
      },
      categoryEditList: [],
    };
  },
  computed: {
    ...mapState(["categoryList"]),
    ...mapGetters(["categoryListNoLeaf"]),
  },

  methods: {
    showEditDialog(node) {
      this.editform = { ...node };
      this.dialogVisible = true;

      this.filterNode(node.id);
    },
    async onEdit() {
      let res = await editCategory(this.editform);
      if (res.meta.status == 200) {
        this.dialogVisible = false;
        this.$store.dispatch("GetCategoryList");
        this.$store.dispatch("GetCategoryListNoLeaf");
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
          let obj = { id: node.id };
          let res = await deleteCategory(obj);
          console.log(res);
          if (res.meta.status == 204) {
            this.$store.dispatch("GetCategoryList");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //修改父节点
    onCategoryChange(node) {
      if (node.length > 0) {
        this.editform.parentId = node[node.length - 1];
      } else {
        this.editform.parentId = -1;
      }
    },
    //过滤
    filterNode(id) {
      this.categoryEditList = cloneDeep(this.categoryListNoLeaf);
      for (let i = 0; i < this.categoryEditList.length; i++) {
        if (this.categoryEditList[i].id == id) {
          this.categoryEditList.splice(i, 1);
          break;
        }
      }
      for (let i = 0; i < this.categoryEditList.length; i++) {
        this.deleteNode(this.categoryEditList[i], null, id, -1);
      }
    },
    deleteNode(node, parent, id, index) {
      if (node) {
        if (node.id == id) {
          if (index != -1) {
            delete parent.children[index];
          }
        }
        if (node.children) {
          for (let i = 0; i < node.children.length; i++) {
            this.deleteNode(node.children[i], node, id, i);
          }
        }
      }
    },
    onSubmit() {
      this.$refs.form.validate(async (pass) => {
        if (pass) {
          let res = await setCategory(this.form);
          if (res.meta.status == 201) {
            this.$store.dispatch("GetCategoryList");
            this.$store.dispatch("GetCategoryListNoLeaf");
          }
        }
      });
    },
    onReset() {
      this.$refs.form.resetFields();
      this.form.parentId = -1;
    },

    parentIdChange(ids) {
      if (ids.length > 0) {
        this.form.parentId = ids[ids.length - 1];
      } else {
        this.form.parentId = -1;
      }
    },
  },
  beforeMount() {
    this.$store.dispatch("GetCategoryListNoLeaf");
  },
};
</script>

<style lang="scss" scoped>
.custom-tree-node {
  span {
    margin-right: 20px;
  }
}
</style> 
 