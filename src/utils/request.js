import axios from "axios";

import Vue from "vue";

// 请求
const http = axios.create({
  baseURL: "api/v1",
  timeout: 4000,
});

// 请求拦截
http.interceptors.request.use(
  (config) => {
    //请求头设置 登录成功后token 每次发送请求带上sessionStorage中的token
    let token = sessionStorage.getItem("token") || "";
    config.headers.Authorization = "Bearer " + token;
    return config; // 将配置完成的config对象返回出去 如果不返回 请求讲不会进行
  },
  (err) => {
    console.log(err); // 请求发生错误时的相关处理 抛出错误
  }
);

// 响应拦截
http.interceptors.response.use(
  (arr) => {
    // 对响应码的处理
    switch (arr.data.meta.status) {
      // case 200:
      //   Vue.prototype.$message({
      //     message: arr.data.meta.msg,
      //     type: "success",
      //   });
      //   break;
      case 201:
        Vue.prototype.$message({
          message: arr.data.meta.msg,
          type: "success",
        });
        break;
      case 204:
        Vue.prototype.$message({
          message: arr.data.meta.msg,
          type: "success",
        });
        break;
      case 400:
        Vue.prototype.$message({
          message: arr.data.meta.msg,
          type: "warning",
        });
        break;
      case 401:
        Vue.prototype.$message({
          message: arr.data.meta.msg,
          type: "warning",
        });
        break;
      case 403:
        Vue.prototype.$message({
          message: arr.data.meta.msg,
          type: "warning",
        });
        break;
      case 404:
        Vue.prototype.$message({
          message: arr.data.meta.msg,
          type: "warning",
        });
        break;
      case 422:
        Vue.prototype.$message({
          message: arr.data.meta.msg,
          type: "warning",
        });
        break;
      case 500:
        Vue.prototype.$message({
          message: arr.data.meta.msg,
          type: "error",
        });
        break;
    }
    return arr.data;
  },
  (err) => {
    console.log(err);
  }
);

function request({ method = "get", url, data = {}, params = {} }) {
  return http({
    method,
    url,
    data, // data: params, // (一般post请求，我们习惯使用 data属性来传参)
    params, //(一般get请求，我们习惯使用params属性来传参）
  });
}

export default request;
