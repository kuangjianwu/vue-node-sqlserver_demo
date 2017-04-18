// 引入编写好的api
const api = require('./dbapi'); 
// 引入文件模块
const fs = require('fs');
// 引入处理路径的模块
const path = require('path');
// 引入处理post数据的模块
// 引入Express
const express = require('express');
const app = express();

const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(api);
// 访问静态资源文件 这里是访问所有dist目录下的静态资源文件
app.use(express.static(path.resolve(__dirname, '/')))

// 监听8088端口
app.listen(8088);
console.log('success listen…………');