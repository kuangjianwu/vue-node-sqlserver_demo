var express = require('express'),
  webpack = require('webpack'),
  opn = require('opn'),
  proxyMiddleware = require('http-proxy-middleware'),
  // favicon = require('express-favicon'),
  config = require('./webpack.dev.conf'),
  app = express();

var compiler = webpack(config);

// for highly stable resources
app.use('/static', express.static(config.commonPath.staticDir));

// app.use(favicon(path.join(__dirname, '../favicon.ico')));

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

// serve webpack bundle output
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

// enable hot-reload and state-preserving
// compilation error display
var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

app.use(hotMiddleware)

app.use('/hrms', proxyMiddleware({target: 'http://127.0.0.1:8000', changeOrigin: true}));
//app.use('/hrms', proxyMiddleware({target: 'http://120.77.52.252:9076', changeOrigin: true}));
// app.use('/hrms', proxyMiddleware({target: 'http://172.16.0.49:8080', changeOrigin: true}));

app.listen(8000, function(err) {
   if (err) {
    console.log(err)
    return
  }
  var uri = 'http://127.0.0.1:' + 8000
  console.log('Listening at ' + uri + '\n')
  opn(uri)
});
