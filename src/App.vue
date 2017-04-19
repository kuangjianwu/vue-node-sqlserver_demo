<template>
  <div id="app">
    <p>
      <input type="text"
             v-model="account"
             placeholder="用户名">
    </p>
    <p>
      <input type="text"
             v-model="password"
             placeholder="密码">
    </p>
    <p>
      <button @click="search">submit</button>
    </p>
  </div>
</template>
<script>
var axios = require('axios');
export default {
  name: 'app',
  data() {
    return {
      account: '',
      password: ''
    }
  },
  methods: {
    search() {
      // axios向后台发送get请求
      axios.get('/api/query', {
        //get请求的参数内容
        /********************************************/
        //query 测试
        // params: {
        //   action:'queryDatabase',
        //     // updateDatabase
        //     // insertDatabase
        //     // deteleDatabase
        //   fieldList: '用户名,用户姓名,密码',
        //   tableName: 'APP_内部_登录信息',
        //   params : '',
        //   whereStr : "用户名 = '" + this.account + "'"
        // }
        /********************************************/

        /********************************************/
        //insert 测试通过
        // params: {
        //   action: 'insertDatabase',
        //   // updateDatabase
        //   // deteleDatabase
        //   fieldList: '用户名,用户姓名,密码',
        //   tableName: 'APP_内部_登录信息',
        //   params: "'" + this.account + "','张三','" + this.password + "'",
        //   whereStr: ''
        // }
        /********************************************/

        /********************************************/
        //update 测试通过
        // params: {
        //   action: 'updateDatabase',
        //   fieldList: '用户姓名',
        //   tableName: 'APP_内部_登录信息',
        //   params: "'李四'",
        //   whereStr: "用户名 = '" + this.account + "'"
        // }
        /********************************************/

        /********************************************/
        //delete 测试通过
        // params: {
        //   action: 'deteleDatabase',
        //   fieldList: '',
        //   tableName: 'APP_内部_登录信息',
        //   params: '',
        //   whereStr: "用户名 = '" + this.account + "'"
        // }
        /********************************************/
        
        /********************************************/
        //procedure 测试通过
        // params: {
        //   action: 'procedureDatabase',
        //   fieldList: '',
        //   tableName: 'ADD_TEST',
        //   params: "'用户名1','用户姓名1','密码1'",
        //   whereStr: ""
        // }
        /********************************************/

      }).then((response) => {
        //因为axios内部的回调方法 并不与父方法共享变量
        //所以此处正常写法是获取不到vue组件中 定义的password变量
        //采用箭头函数，与父方法共享变量可以解决这个问题
        this.password = response.data[0].密码;
        console.log(response.data[0]);
      })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
