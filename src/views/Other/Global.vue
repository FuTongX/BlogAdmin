<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>全局管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 个人信息区域 -->
      <el-card shadow="never">
        <div slot="header">
          <span>用户信息</span>
          <el-button
            style="float: right; padding: 5px"
            @click="onChangeInfo"
            type="primary"
            size="small"
            >操作</el-button
          >
        </div>
        <el-descriptions :column="2" size="large">
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              用户昵称
            </template>
            {{ editForm.nickName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-camera"></i>
              头像
            </template>
            <el-avatar :src="editForm.avatar"></el-avatar>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-link"></i>
              github
            </template>
            {{ editForm.github }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-link"></i>
              座右铭
            </template>
            {{ editForm.motto }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-link"></i>
              博客名称
            </template>
            {{ editForm.blogName }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-divider></el-divider>

      <!-- 打字机名人名言设置区域 -->
      <el-card shadow="never">
        <div slot="header">
          <span>格言列表</span>
        </div>
        <el-form
          ref="proverbForm"
          :inline="true"
          :model="proverbForm"
          :rules="proverbFormRules"
        >
          <el-form-item label="格言" prop="content">
            <el-input
              size="medium"
              clearable
              v-model="proverbForm.content"
            ></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="author">
            <el-input
              size="medium"
              clearable
              v-model="proverbForm.author"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onAddProverb">添加</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="tableData" height="250" border style="width: 100%">
          <el-table-column prop="content" label="格言"> </el-table-column>
          <el-table-column prop="author" label="作者" width="80">
          </el-table-column>
          <el-table-column prop="createdAt" label="日期" width="100">
            <template slot-scope="data">
              {{ data.row.createdAt | TimeFormat }}
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                @click="onDeleteProverb(scope.row)"
                type="danger"
                size="small"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-card>

    <!-- 修改个人信息对话框 -->
    <el-dialog title="用户信息修改" :visible.sync="dialogVisible" width="60%">
      <el-form
        ref="editInfoForm"
        :rules="editRules"
        :model="editForm"
        label-width="80px"
      >
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="editForm.nickName"></el-input>
        </el-form-item>
        <el-form-item label="头像链接" prop="avatar">
          <el-input v-model="editForm.avatar"></el-input>
        </el-form-item>
        <el-form-item label="github" prop="github">
          <el-input v-model="editForm.github"></el-input>
        </el-form-item>
        <el-form-item label="座右铭" prop="motto">
          <el-input v-model="editForm.motto"></el-input>
        </el-form-item>
        <el-form-item label="博客名称" prop="blogName">
          <el-input v-model="editForm.blogName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitInfoChange">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  editUserInfo,
  createOneProverb,
  getProverbList,
  deleteProverbById,
} from "../../api";
export default {
  name: "BlogAdminGlobal",
  data() {
    return {
      dialogVisible: false,
      proverbDialogVisible: false,
      tableData: [],
      proverbForm: {
        content: "",
        author: "佚名",
      },
      proverbFormRules: {
        content: [{ required: true, message: "请输入格言", trigger: "blur" }],
      },
      editForm: {
        nickName: "",
        avatar: "",
        github: "",
        motto: "",
        blogName: "",
        id: 1,
      },
      editRules: {
        nickName: [
          { required: true, message: "请输入用户昵称", trigger: "blur" },
        ],
        avatar: [
          { required: true, message: "请输入用户头像链接", trigger: "blur" },
        ],
        github: [
          { required: true, message: "请输入用户github链接", trigger: "blur" },
        ],
        motto: [{ required: true, message: "请输入座右铭", trigger: "blur" }],
        blogName: [
          { required: true, message: "请输入博客名称", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    onChangeInfo() {
      this.dialogVisible = true;
      this.editForm = JSON.parse(window.sessionStorage.getItem("userinfo"));
    },
    //添加谚语
    onAddProverb() {
      this.$refs.proverbForm.validate(async (pass) => {
        if (pass) {
          let res = await createOneProverb(this.proverbForm);
          if (res.meta.status == 201) {
            //
            let { data } = await getProverbList();
            this.tableData = data.list;
          } else {
            this.$message.error(res.meta.msg);
          }
        }
      });
    },
    onSubmitInfoChange() {
      this.dialogVisible = false;
      this.$refs.editInfoForm.validate(async (pass) => {
        if (pass) {
          //修改info信息
          let res = await editUserInfo(this.editForm);
          if (res.meta.status == 200) {
            this.$message.success(res.meta.msg);
            window.sessionStorage.setItem(
              "userinfo",
              JSON.stringify(this.editForm)
            );
          } else {
            this.$message.error(res.meta.msg);
          }
        }
      });
    },
    async onDeleteProverb(data) {
      let res = await deleteProverbById(data.id);
      if (res.meta.status == 204) {
        let { data } = await getProverbList();
        this.tableData = data.list;
      }
    },
  },

  beforeMount() {
    this.editForm = JSON.parse(window.sessionStorage.getItem("userinfo"));
  },
  async beforeCreate() {
    let { data } = await getProverbList();
    this.tableData = data.list;
  },
};
</script>

<style lang="scss" scoped>
</style> 
 