import "basecss"// 在配置项  resolve.alias 这里面了，简洁的把路径配置成了basecss
import "./css/index.css"
import "./css/qw.less"
import(/* webpackChunkName: "subPageB" */"./subPageB");  //这样可以把异步加载的包单独导出chunk文件
import "./subPageA";

console.log("66666666666677777")

export default "index";
