"use strict";
const express = require('express');
const router = express.Router();
const DB = require('./db');

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

router.get('/api/query', (req, res) => {

    // 后期扩展:参数中包含一个company 指定对应的名字 如果是第一次登录:开始查询 公司服务器地址对应的数据库，找到匹配的字段 然后将其中的行记录对应的
    // 数据库名，地址，用户名，密码 都取出来 存到localstorage中(只存当前公司的) 用以初始化connect 对象
    // 如果非第一次登录:从localstorage中取出 数据库对象，初始化connect对象 根据此connect对象再建立连接 进行查询
    // 从请求体中获取到所有的参数
    let actionObject = {
        fieldList: req.query['fieldList'],
        tableName: req.query['tableName'],
        whereStr: req.query['whereStr'],
        params: req.query['params']
    };
    //从请求体中获取到 数据库操作动作 参数
    let action = req.query['action'];
    // DB[action] : DB.queryDatabase, DB.updateDatabase
    // DB.insertDatabase,DB.deteleDatabase
    DB[action](actionObject, function (rows) {

        if (action === "queryDatabase") {
            //当前的列名
            var name = rows[0][0].metadata.colName;
            // 存储 格式化完成 结果的resultArray
            let resultArray = new Array;
            // console.log(resultArray); 将resultArray写入到response中
            dataNormalizeCallBack(resultArray, rows, function () {
                res.send(resultArray);
            });
        }else{
            res.send('success');
        }
    });
});

module.exports = router;