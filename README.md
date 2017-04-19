Vue-sqlserver-demo
===



涉及到的技术
---
 * vue-cli 生成主体框架
 * axios   配置前端请求  
 * express 配置服务器  
 * tedious 连接sqlserver数据库 
 * wepack  负责打包
  
  实现前后端的数据的交互Demo



外部库说明
---
###### 以下提及的库 均可在package.json中找到(如果在看相关代码时 不太明白 可以参考官方文档)

---
* "axios": "^0.16.1",  前端路由库。vue官方推荐[axios官方文档](https://github.com/mzabriskie/axios/blob/master/README.md)<br />
* "body-parser": "^1.17.1",  express 解析请求内容[body-parser官方文档](https://github.com/expressjs/body-parser)<br />
* "lodash": "^4.17.4",  工具库，包含对数组等对象截取拼接等方法[lodash 官方文档](https://lodash.com/docs/4.17.4)<br />
* "tedious": "2.0.0",   连接sqlserver的库[tediousjs 官方文档](http://tediousjs.github.io/tedious/api-connection.html)<br />
* "express": "^4.14.1",  [expressjs 官方文档](http://expressjs.com/) <br />


<br />

项目文件说明
---

首先可以看下目录结构
``` bash
├── README.md  说明文件
├── build      构建脚本 
├── config     配置脚本
├── dist       编译后的文件存放目录
├── index.html
├── node_modules  外部库存放目录
├── package.json    启动入口和依赖包安装指南
├── src        项目源码目录
├── static
└── test
```

主要看下config 和 src 目录

* config目录的文件说明

```bash
##config目录结构
├── dev.env.js
├── index.js     我对这个文件进行了修改
├── prod.env.js
└── test.env.js

##index.js的配置
##为了使用我们自己配置的服务器作为后台的数据接口，所以这里
##将dev的proxyTable属性配置为：
dev: {
    env: require('./dev.env'),
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        target: 'http://localhost:8088/api/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },

```

## src说明

>会提及的内容：
>>* src目录说明
>>* 使用tedious配置连接数据库
>>* 返回结果的处理，参数格式的设计，接口参数格式的设计

>不会提及的内容：
>>* axios配置
>>* express的基础知识，Express 的 middleware，Express.Router() 
>>* Vue组件的相关知识


1.Src目录
---

```bash
├── App.vue     唯一Vue组件，用来测试
├── assets      资源目录，并未使用
├── components  组件目录，并未使用(其中有一个Hello.vue文件是vue-router的示例组件)
├── index.html
├── main.js     入口文件
├── router      配置vue-router的入口文件
└── server      数据库访问接口

```


2.使用tedious配置连接数据库
---

* 先看目录

```bash
##server目录
├── db.js    数据库的连接 以及底层数据访问方法的定义
├── dbapi.js 数据库接口定义
└── index.js express配置服务器
```

* db.js 因为注释已经很详细，这里只突出配置
一定要记得配置config.options.rowCollectionOnRequestCompletion为true
不然查询后不会返回结果

```bash
  //创建连接数据库的配置文件
    var config = {
        userName: 'username',//数据库用户名
        password: 'password',//数据库密码
        server: '127.0.0.1',//配置你自己的数据库地址 本地或者远程地址都可以
        options: {
            database: 'DB_Name',//数据库名
            // *****************************************************************************
            // ****** Warning:只有在设置rowCollectionOnRequestCompletion : true之后
            // 查询的结果才会返回到回调函数中
            // *****************************************************************************
            // ******
            rowCollectionOnRequestCompletion: true
        }
    }
```



3.返回结果的处理，参数格式的设计和传入过程
---


* 返回结果的处理 ：./src/server/dbapi.js 方法 dataNormalizeCallBack

```javascript

// 执行查询结束后的 通用的 处理结果函数 把返回的结果 格式化为预期的格式。 对查询出来的结果进行整理 预期的格式:
// [{用户名:001,用户姓名:张三,密码:001},{用户名:002,用户姓名:李四,密码:002}...]
let dataNormalizeCallBack = function (resultArray, rows, callbackFun) {
    rows
        .map(function (row) {
            // 一行的记录 存到一个对象(singleRowObj)中
            let singleRowObj = new Object;
            //针对于每一行的查询结果遍历
            for (let index = 0; index < row.length; index++) {
                //获取当前字段名
                let rowName = row[index].metadata.colName;
                //获取当前字段名对应的值
                let rowValue = row[index].value;
                //新建并赋值到对应属性中 将singleRowObj.用户名 = 张三
                singleRowObj[rowName] = rowValue;
            }
            //将结束整行字段遍历赋值后的结果 singleRowObj push到resultArray中
            resultArray.push(singleRowObj);
        });
    callbackFun(resultArray);
};

```

* 参数传入过程:
  *  整个过程：
App.vue 发起请求  =>  
dbapi.js (收到处理请求,访问db.js)   =>  
db.js (匹配访问参数，执行对应方法，返回结果到dbapi.js)   =>   
dbapi.js(接收到返回结果，写入到response中，给到App.vue)  => 
App.vue(收到结果，渲染页面) 

 * App.vue传入(./src/App.vue):
  ```javascript
      params: {
          action:'queryDatabase',
            // updateDatabase
            // insertDatabase
            // deteleDatabase
          fieldList: '用户名,用户姓名,密码',
          tableName: 'APP_登录信息',
          params : '',
          whereStr : "用户名 = '" + this.account + "'"
        }
  ```
 * dbapi.js中接收(./src/server/dbapi.js):
  ```javascript
      let actionObject = {
        fieldList: req.query['fieldList'],
        tableName: req.query['tableName'],
        whereStr: req.query['whereStr'],
        params: req.query['params']
    };
    //从请求体中获取到 数据库操作动作 参数
    let action = req.query['action'];
  ```
 * db.js中匹配使用(./src/server/db.js):
  ```javascript
     let DB = {
    'queryDatabase': queryDatabase,
    'updateDatabase': updateDatabase,
    'insertDatabase': insertDatabase,
    'deteleDatabase': deteleDatabase,
    'procedureDatabase':ProcedureDatabase
}
  ```




Build Setup
---

``` bash
# install dependencies
# 安装所有的依赖包
npm install

#进入到./src/server/目录下 启动我们自己配置的服务器
node index.js

# serve with hot reload at localhost:8080
npm run dev

```

---

If you got some questions about this demo .You can get contact with me by this email dendise7en@gmail.com.<br />
如果你在使用的过程中出现了任何的问题：可以联系 dendise7en@gmail.com 或者提交到 Issues 中
