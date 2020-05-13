import { a } from "./module";
//import {$} from"jquery";  //实际如果不eslint，可以不引。因为webpack已经导到全局了

//import {_} from "lodash";   //实际如果不eslint，可以不引。因为webpack已经导到全局了
//import {chunk} from "lodash" 
//js tree shaking 利用的是 es 的模块系统。而 lodash.js 没有使用 CommonJS 或者 ES6 的写法。
//安装 lodash.js 的 es 写法的版本



console.log("subPageA.js");
a(); //自带js的treeshaking ,三个方法，只拿回了a方法
console.log(_.chunk([1, 2, 3], 2));  //将第三方库进行tree shaking


$(function () {  //检验第三方库是否被设置为全局属性
    $("p").click(function () { alert("pppp") });
});



class Temp {
    show() {
        console.log('es6的代码是否被编译掉了----this.Age :', this.Age);
    }
    get Age() {
        return this._age;
    }
    set Age(val) {
        this._age = val + 1;
    }
}
let t = new Temp();
t.Age = 19;
t.show();


export default "subPageA";
