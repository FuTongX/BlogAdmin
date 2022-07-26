import VueRouter from "vue-router";
import Login from "../views/Login";
import Home from "../views/Home.vue";
import Welcome from "../views/Welcome.vue";
import AddArticle from "../views/article/AddArticle.vue";
import ArticleList from "../views/article/ArticleList.vue";
import Category from "../views/classify/Category.vue";
import Tag from "../views/classify/Tag.vue";
import Message from "../views/Other/Message.vue";
import Global from "../views/Other/Global.vue";

let router = new VueRouter({
  routes: [
    {
      path: "/",
      redirect: "/login", //重定向到login
    },
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/home",
      component: Home,
      redirect: "/welcome",
      children: [
        {
          path: "/welcome",
          component: Welcome,
        },
        {
          path: "/addarticle",
          component: AddArticle,
        },
        {
          path: "/articlelist",
          component: ArticleList,
        },
        {
          path: "/category",
          component: Category,
        },
        {
          path: "/tag",
          component: Tag,
        },
        {
          path: "/message",
          component: Message,
        },
        {
          path: "/global",
          component: Global,
        },
      ],
    },
  ],
});

//前置路由守卫，初始化和每次路由切换之前被调用
router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next();
  if (!window.sessionStorage.getItem("token")) {
    return next("/login");
  }
  next();
});

export default router;
