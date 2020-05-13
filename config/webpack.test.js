//生成eslint报告
const webpack = require("webpack");
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    mode: 'development', //development 开发环境 
    module: {
        rules: [
            {
                test: /\.jsx?$/i,
                exclude: /(node_modules)/, // 加快编译速度，不包含node_modules文件夹内容
                use: ["babel-loader", {
                    loader: 'eslint-loader',
                    options: {
                        //生成代码检测的resports报告，到docs目录下去
                        outputReport: {
                            filePath: '../docs/eslint/eslint.html',  
                            formatter: require('eslint/lib/formatters/html')
                        }
                    }
                }]
            },
        ]
    },
    plugins:[
        new CleanWebpackPlugin(),
    ]
}