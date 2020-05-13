import { c } from "./module";
//import {$} from"jquery" //实际如果不eslint，可以不引。因为webpack已经导到全局了,由于异步加载的该模块，导致eslint报错
console.log("subPageB.js");
$(function () {  //检验第三方库是否被设置为全局属性
    $("h5").click(function () { alert("h5h5h5h5h5h5h") });
});

c();
export default "subPageB";