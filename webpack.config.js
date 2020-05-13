const argv = require("yargs-parser")(process.argv.slice(2));  //选项解析器
const _mode = argv.mode || "development";  //获取到命令行的参数 --mode的值
const _eslint = argv.eslint || "";  ////获取到命令行的参数 --eslint的值

const webpack = require("webpack");// 用于访问内置插件
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const ExtractTextPlugin = require("extract-text-webpack-plugin"); //npm install --save-dev extract-text-webpack-plugin@next 安装这个才对
const PurifyCSS = require('purifycss-webpack');
const glob = require("glob-all");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const merge = require("webpack-merge");  //引入merge这个库，用来合并
const devConfig = require("./config/webpack.dev");//引入开发环境
const prodConfig = require("./config/webpack.prod");//引入生产环境
const esliConfig = require("./config/webpack.test");//引入eslint环境

const json = require("./webpack.config.json"); //这是一种思路，可以让配置项提取出来，这里只用到入口文件





const commonConfig = env => { //公共配置，拿到 传进来的实参 _mode ，用形参env根据上线环境还是生产环境进行判断

    let htmlWebpackPlugin = new HtmlWebpackPlugin({
        title: "yd",  //实际开发不要用这个属性，因为会和html-loader有冲突，导致效果失效
        template: "./src/index.html",
        path: path.resolve(__dirname, "dist"),
        filename: "index.html",
        chunks: ["index", "vendor"],  //构建对应入口文件的chunks，尤其注意第二个参数，是给optimization.splitChunks使用的！！！！！！！
        meta: { viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no' },  //注入meta标签
        minify: {//也可以设置为 true
            collapseWhitespace: true,   //压缩空白
            removeAttributeQuotes: false //删除属性双引号，默认false
        },
        hash: true   //防止缓存,,这个能让html文件引入的css、js后面加上hash参数
    })

    let extractTextPlugin = new ExtractTextPlugin({
        filename: "css/[name].css",
        allChunks: true
    });

    let purifyCSS = new PurifyCSS({
        paths: glob.sync([
            // 要做CSS Tree Shaking的路径文件
            path.resolve(__dirname, "./src/*.html"),
            path.resolve(__dirname, "./src/*.js")
        ])
    });

    return {
        entry: json.entry,
        output: {
            //publicPath: "./", // js引用路径或者CDN地址  ,,输出解析文件的目录，url 相对于 HTML 页面
            path: path.resolve(__dirname, "dist"), // 打包文件的输出目录
            filename: "[name]-bundle.js",
            chunkFilename: "static/js/[name].chunk.js"  //决定了非入口(subPageA) 的chunk文件名称。
        },
        resolve: {
            // resolve.extensions 用于配置在尝试过程中用到的后缀列表，默认是：extensions: ['.js', '.json']
            extensions: [".ts", ".tsx", ".js", ".json"],//假如你想让 Webpack 优先使用目录下的 TypeScript 文件，可以这样配置

            //配置别名可以加快webpack查找模块的速度
            alias: {
                basecss: "./css/base.css"  //为入口index.js配置简洁的引入文件方式
            },

            //resolve.modules  配置 Webpack 去哪些目录下寻找第三方模块，默认是只会去  node_modules  目录下寻找。
            // modules:[]
        },
        module: {
            //不去解析属性值代表的库的依赖
            noParse: /jquery/,//不去解析jquery中的是否有依赖其他库  ,,普通写法
            //noParse: (content) => /jquery/.test(content),   //函数写法
            rules: [
                //css
                {
                    test: /\.css$/i,
                    include: path.join(__dirname, 'src'), //限制范围，如果使用第三方UI库？？？？？？？？？？？？？？
                    exclude: [
                        path.resolve(__dirname, "node_modules")
                    ],
                    /**
                     *  { include: Condition }:匹配特定条件。一般是提供一个字符串或者字符串数组，但这不是强制的。
                        { exclude: Condition }:排除特定条件。一般是提供一个字符串或字符串数组，但这不是强制的。
                        { and: [Condition] }:必须匹配数组中的所有条件
                        { or: [Condition] }:匹配数组中任何一个条件
                        { not: [Condition] }:必须排除这个条件
                     */
                    use: [{
                        loader: "style-loader",
                        options: {
                            singleton: true  //插入到单一的style标签中去
                        }
                    }, "css-loader", "postcss-loader"]
                },
                //less文件提取
                {
                    test: /\.less$/i,
                    include: path.join(__dirname, 'src'), //限制范围，提高打包速度
                    exclude: /(node_modules)/,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",  //这个是排除style-loader的
                        use: ["css-loader", 'postcss-loader', {
                            loader: "less-loader",
                        }],
                        publicPath: '../'  //解决css背景图片问题，路径问题
                    }),
                },
                //js
                {
                    test: /\.jsx?$/i,
                    include: path.join(__dirname, 'src'), //限制范围，如果使用第三方UI库？？？？？？？？？？？？？？
                    exclude: /(node_modules)/, // 加快编译速度，不包含node_modules文件夹内容
                    use: ["babel-loader"]
                },

                //用于html文件中的图片
                {
                    test: /\.html?$/i,
                    use: ["html-loader"]
                },
                //url-loader: 处理图片, Base64编码
                {
                    test: /\.(gif|png|jpe?g|svg)$/i,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 8192, //这个数字是按B来算的  当超过这个大小,img就不转为base64。
                            outputPath: 'images/', //图片打包出去的目录
                            name: '[name]-[hash:5].[ext]'   //默认把图片文件的名称修改掉
                        }
                    },
                        //image-webpack-loader 压缩图片  在linux下报错了。。？？？？？？？？？？？？？？？？？
                        // {
                        //     loader: 'image-webpack-loader',
                        //     options: {
                        //         mozjpeg: {
                        //             progressive: true,
                        //             quality: 65
                        //         },
                        //         // optipng.enabled: false will disable optipng
                        //         optipng: {
                        //             enabled: false,
                        //         },
                        //         pngquant: {
                        //             quality: '65-90',
                        //             speed: 4
                        //         },
                        //         gifsicle: {
                        //             interlaced: false,
                        //         },
                        //         // the webp option will enable WEBP
                        //         webp: {
                        //             quality: 75
                        //         }
                        //     }
                        // },
                    ]
                },
            ]
        },

        plugins: [
            htmlWebpackPlugin,
            extractTextPlugin,
            purifyCSS,
            new CopyWebpackPlugin([
                {
                    from: path.resolve(__dirname, "src/copy/"),   //复制文件夹比较靠谱
                    to: path.resolve(__dirname, "dist/copy/"),
                    ignore: ['.*']
                }
            ]),
            new webpack.ProvidePlugin({
                // npm i jquery -S 安装jquery，然后利用ProvidePlugin这个webpack内置API将jquery设置为全局引入，从而无需单个页面import引入
                $: "jquery",
                _: "lodash-es"  //所有页面都会引入 _ 这个变量，不用再import引入
            }),
        ],
        //用于提取公共代码，跟`entry`是同一层级！！！！
        optimization: {   //提取第三库（包括css、js等） ，，也可以为多页入口提取公共js做准备
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,  //这里正则目前只匹配第三方库
                        name: "vendor",  ///输出的名字（提出来的第三方库）
                        chunks: "initial",  //只对入口文件进行处理   
                    }
                }
            }
        },
    };
}
module.exports = () => {
    console.log("argv=", argv)   //打印出所有的配置项
    console.log("_mode=", _mode) //查看 _mode是生产还是开发

    //通过 _eslint 和 _mode 来共同决定 merge 哪个配置文件
    let config = _eslint === "eslint" ? esliConfig : (_mode === "production" ? prodConfig : devConfig);
    return merge(commonConfig(_mode), config);  // 合并 公共配置 和 环境配置
};