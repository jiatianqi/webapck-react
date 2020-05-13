const webpack = require("webpack");
const path = require("path");

module.exports = {
    devtool: "source-map", //source-map开启调试
    mode: 'development', //development 开发环境 
    devServer: {
        //设置服务器访问的基本目录
        contentBase: path.resolve(__dirname, "dist"),
        //可以部署到阿里云，host改为：0.0.0.0 远程可以访问
        host: '127.0.0.1',
        port: 9000,
        //对服务器资源采用gzip压缩  // 服务器返回浏览器的时候是否启动gzip压缩
        compress: true,
        //自动打开浏览器 & 热更新
        open: true,
        hot: true,
        //绕过主机检查
        disableHostCheck: true,

       // publicPath: '/',// 此路径下的打包文件可在浏览器中访问。

        // proxy: {  // 设置代理
        //     "/api": {  // 访问api开头的请求，会跳转到  下面的target配置
        //         target: "http://192.168.0.102:8080",
        //         pathRewrite: { "^/api": "/mockjsdata/5/api" }
        //     }
        // },

        //quiet: true, // necessary for FriendlyErrorsPlugin.（需要配合这个插件） 启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。

        watchOptions: { // 监视文件相关的控制选项
            // poll: true,   // webpack 使用文件系统(file system)获取文件改动的通知。在某些情况下，不会正常工作。例如，当使用 Network File System (NFS) 时。Vagrant 也有很多问题。在这些情况下，请使用轮询. poll: true。当然 poll也可以设置成毫秒数，比如：  poll: 1000
            // ignored: /node_modules/, // 忽略监控的文件夹，正则
            aggregateTimeout: 3000 //延迟3秒，，默认值为300，当第一个文件更改，会在重新构建前增加延迟
        }
    },


}