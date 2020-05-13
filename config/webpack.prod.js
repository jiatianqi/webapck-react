const webpack = require("webpack");
const path = require("path");
const CleanWebpackPlugin = require('clean-webpack-plugin'); //清除打包目录文件dist
var ProgressBarPlugin = require('progress-bar-webpack-plugin');// 打包显示进度条插件

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');//压缩css的插件


module.exports = {
    mode: 'production', // production 自带压缩、js的treeshaking等
    plugins: [
        new OptimizeCSSAssetsPlugin({  //压缩css的配置
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
            canPrint: true
        }),
        new CleanWebpackPlugin(), //从2版本开始，只接受传递给一个对象
        new ProgressBarPlugin(),  //确实会显示打包时候的进度条！！！！！！
        
    ],
    
}