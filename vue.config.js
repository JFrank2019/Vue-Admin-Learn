module.exports = {
  devServer: {
    port: 8888,
    host: 'localhost', // 主机名   真机调试时设置为 0.0.0.0
    https: false, // 不启动https
    open: true,
    // 开发环境代理
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_APP_SERVICE_URL,
        // 开启代理：活在本地创建一个虚拟服务端，然后发送请求的数据
        // 并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        changeOrigin: true, // 开启代理
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  },

  lintOnSave: true, // 格式检查
  productionSourceMap: false // 打包时不会生成 .map 文件 ，加快打包速度
}
