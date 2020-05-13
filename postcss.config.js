module.exports = {
    plugins: {
        'postcss-preset-env': { //cssnext编译
            stage: 0,
            features: {
                'nesting-rules': true
            }
        },
        "autoprefixer": {  // 添加前缀
            "grid": true,
            "browsers": ['> 0.15% in CN']
        }
    }
}