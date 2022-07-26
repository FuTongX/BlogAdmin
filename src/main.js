import Vue from "vue";
import VueRouter from "vue-router";
import router from "./router";
import App from "./App.vue";
import store from "./store";
//导入运行一次
import "./plugins/element";
import "element-ui/lib/theme-chalk/index.css";

import echarts from "./plugins/echarts";
Vue.prototype.$echarts = echarts;

import "./assets/css/reset.css";
import "./assets/css/global.css";
import moment from "moment";

Vue.use(VueRouter);

Vue.config.productionTip = true;

Vue.filter("TimeFormat", function (value) {
  moment.locale("zh-cn");
  return moment(value).format("lll");
});

new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount("#app");
