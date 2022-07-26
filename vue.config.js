const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      "/v1": {
        //凡是带api接口的走下面这个服务器
        target: "http://127.0.0.1:4000/", //服务器地址
        // pathRewrite:{'^/api':''} //发送时候去掉/api
        changeOrigin: true, //对方服务器用什么端口,这里就用什么端口
        ws: true, //支持websocket
      },
    },
  },
  // configureWebpack: {
  //   devtool: "source-map",
  // },
});
