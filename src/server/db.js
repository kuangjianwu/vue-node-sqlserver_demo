//引入tedious  用来连接sqlserver的插件
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

//lodash 是用来对字符串和数据以及常用引用类型的值 进行操作的库
var _ = require('lodash');

    //创建连接数据库的配置文件
    var config = {
        userName: 'WebApp',
        password: 'p@ssw0rd',
        server: '61.172.251.227',
        options: {
            database: 'ZM_ERP_JT',
            // *****************************************************************************
            // ****** Warning:只有在设置rowCollectionOnRequestCompletion : true之后
            // 查询的结果才会返回到回调函数中
            // *****************************************************************************
            // ******
            rowCollectionOnRequestCompletion: true
        }
    }
// 根据配置文件创建一个数据库连接
var connection = new Connection(config);
// 当连接创建时，可以调用对应的方法 以后这里可以调用 loading图标的start
connection.on('connect', function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("db connected!");
    }
});

//查询方法 @queryObject  查询的参数对象 @callbackFunc 查询结束后的回调函数
let queryDatabase = (queryObject, callbackFunc) => {
    // 定义默认值
    let defaultObject = {
        //查询的字段
        fieldList: ' * ',
        //查询的数据源
        tableName: '',
        //查询条件
        whereStr: ''
    };
    //调用 lodash的extend() 合并传入的对象以及默认对象的属性
    defaultObject = _.extend(defaultObject, queryObject);
    // 开始查询前提示
    console.log('Reading rows from the Table...' + defaultObject.tableName);
    // 组装查询的SQL字符串
    let queryStr = "  SELECT  " + defaultObject.fieldList + "  FROM  " + defaultObject.tableName + "  WHERE  " + defaultObject.whereStr;

    commonRequest(queryStr, callbackFunc, 'SELECT');
    // request = new Request(queryStr, function (err, rowCount, rows) {
    // console.log(rowCount + ' row(s) returned');     if (rowCount > 0) {
    // callbackFunc(rows);     } else {         return;     } });
    // connection.execSql(request);
}

//修改方法 @params 传入修改数据库 对应字段的 值 @fieldList 要修改的字段列表 @tableName  要修改的表名

let updateDatabase = (updateObject, callbackFunc) => {
    // 定义默认值
    let defaultObject = {
        //需要更新的字段
        fieldList: ' * ',
        //需要更新的表
        tableName: '',
        //更新的参数
        params: '',
        //更新的条件
        whereStr: ''
    };
    //调用 lodash的extend() 合并传入的对象以及默认对象的属性
    defaultObject = _.extend(defaultObject, updateObject);
    // 开始修改前提示
    console.log('Updating rows from the Table...' + defaultObject.tableName);
    // 组装修改的SQL字符串
    let updateStr = "  UPDATE  " + defaultObject.tableName + "  SET  " + defaultObject.fieldList + "  =  " + defaultObject.params + "  WHERE " + defaultObject.whereStr;

    console.log(updateStr);

    commonRequest(updateStr, callbackFunc, 'UPDATE');

};

// 插入方法 @insertObject.params     传入修插入数据库 对应字段的 值 @insertObject.fieldList
// 要插入的字段列表 @insertObject.tableName  要插入的表名
let insertDatabase = (insertObject, callbackFunc) => {
    // 定义默认值
    let defaultObject = {
        //需要插入的字段
        fieldList: ' * ',
        //需要插入的表
        tableName: '',
        //插入的参数
        params: ''
    };
    //调用 lodash的extend() 合并传入的对象以及默认对象的属性
    defaultObject = _.extend(defaultObject, insertObject);
    // 开始修改前提示
    console.log('Inserting into the Table...' + defaultObject.tableName);
    // 组装修改的SQL字符串
    let insertStr = "  INSERT INTO  " + defaultObject.tableName + "  (" + defaultObject.fieldList + ")  VAULES  (" + defaultObject.params + ") ";
    console.log(insertStr);

    commonRequest(insertStr, callbackFunc, 'INSERT');

};

//删除方法
let deteleDatabase = (deteleObject, callbackFunc) => {
    // 定义默认值
    let defaultObject = {
        //表名
        tableName: '',
        //条件
        whereStr: ''
    };
    //调用 lodash的extend() 合并传入的对象以及默认对象的属性
    defaultObject = _.extend(defaultObject, deteleObject);
    // 开始修改前提示
    console.log('Deleting rows from the Table...' + defaultObject.tableName);
    // 组装修改的SQL字符串
    let deleteStr = "  DELETE " + defaultObject.tableName + " WHERE " + defaultObject.whereStr;

    console.log(deleteStr);
    commonRequest(deleteStr, callbackFunc, 'DELETE');

};

// 定义调用存储过程的方法
let ProcedureDatabase = (procedureObject,callbackFunc) => {
    // 定义默认值
    let defaultObject = {
        //存储过程的名字
        tableName: '',
        //参数
        params: ''
    };
    //调用 lodash的extend() 合并传入的对象以及默认对象的属性
    defaultObject = _.extend(defaultObject, procedureObject);
    // 开始修改前提示
    console.log('start exec  the Procedure...' + defaultObject.tableName);
    // 组装修改的SQL字符串
    let procedureStr = "  EXEC " + defaultObject.tableName + " " + defaultObject.params +"";

    console.log(procedureStr);
    commonRequest(procedureStr, callbackFunc, 'PROCEDURE');
};

// @action执行动作 @callbackFunc 回调函数 @excuteStr 执行语句
let commonRequest = function (excuteStr, callbackFunc, action) {
    request = new Request(excuteStr, function (err, rowCount, rows) {
        console.log(rowCount + ' row(s) ' + action);
        callbackFunc(rows,rowCount);
    });
    connection.execSql(request);
};


module.exports.queryDatabase =queryDatabase;
module.exports.updateDatabase = updateDatabase;
module.exports.insertDatabase = insertDatabase;
module.exports.deteleDatabase = deteleDatabase;
module.exports.procedureDatabase = ProcedureDatabase;
