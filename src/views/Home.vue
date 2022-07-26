<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <h1  @click="toWelcome">博客管理系统</h1>
      </div>
      <el-button type="info" @click="logout"> 退出 </el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="asideWidth">
        <button @click="toggleFunc" :class="toggleBtnStyle"></button>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#66d9ef"
          :collapse-transition="false"
          :collapse="isCollapse"
          :router="true"
        >
          <el-submenu v-for="item in menuList" :key="item.id" :index="item.id">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.authName }}</span>
            </template>
            <el-menu-item
              v-for="subItem in item.children"
              :index="subItem.path"
              :key="subItem.id"
            >
              <i :class="subItem.icon"></i>
              {{ subItem.authName }}
            </el-menu-item>
          </el-submenu>

          <el-menu-item
            v-for="item1 in menuList2"
            :key="item1.id"
            :index="item1.path"
          >
            <i :class="item1.icon"></i>
            <span slot="title">{{ item1.authName }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 右侧主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "BlogAdminHome",
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.replace("/login");
    },
    toggleFunc() {
      this.isCollapse = !this.isCollapse;
    },
    toWelcome() {
      this.$router.push("welcome");
    },
  },
  data() {
    return {
      isCollapse: false,
      menuList: [
        {
          id: "101",
          authName: "文章管理",
          icon: "el-icon-document-copy",
          path: "/article",
          children: [
            {
              id: "102",
              authName: "添加文章",
              icon: "el-icon-document-add",
              path: "/addarticle",
            },
            {
              id: "103",
              authName: "文章列表",
              icon: "el-icon-receiving",
              path: "/articlelist",
            },
          ],
        },
        {
          id: "201",
          authName: "分类管理",
          icon: "el-icon-folder-opened",
          path: "/classify",
          children: [
            {
              id: "202",
              authName: "类别管理",
              icon: "el-icon-document",
              path: "/category",
            },
            {
              id: "203",
              authName: "标签管理",
              icon: "el-icon-collection-tag",
              path: "/tag",
            },
          ],
        },
      ],
      menuList2: [
        {
          id: "301",
          authName: "评论管理",
          icon: "el-icon-chat-dot-square",
          path: "/message",
        },
        {
          id: "401",
          authName: "全局管理",
          icon: "el-icon-setting",
          path: "/global",
        },
      ],
    };
  },
  computed: {
    asideWidth() {
      if (this.isCollapse) {
        return "60px";
      } else {
        return "200px";
      }
    },
    toggleBtnStyle() {
      return {
        "toggle-btn": true,
        "el-icon-s-fold": !this.isCollapse,
        "el-icon-s-unfold": this.isCollapse,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/element-variables.scss";
.el-container {
  height: 100%;
}
.el-header {
  background-color: $bg-color1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h1 {
    font-size: 20px;
    font-weight: bold;
    color: #909399;
  }
}
.el-aside {
  width: 30px;
  background-color: $bg-color2;
  .toggle-btn {
    width: 100%;
    height: 40px;
    border: none;
    font-size: 18px;
    background-color: $bg-color2;
    color: #909399;
  }
  .el-menu {
    width: 100%;
  }
}
.el-main {
  background-color: $bg-color3;
}
</style> 