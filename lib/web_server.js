var ENV        = require('../environment')
var fs         = require('fs');
var express    = require('express');
var port       = ENV.PORT || 3000;
var publicDir  = ENV.ROOT_PATH + '/public';

app = express();

app.set('port', port);

if (ENV.node_env === "development"){
  var webpack = require("webpack");
  var webpackDevMiddleware = require("webpack-dev-middleware");
  var webpackConfig = require("../webpack.config")
  var compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {}));
}

app.use(express.static(publicDir));

app.get('/*', (request, response) => {
  response.sendFile(publicDir + '/index.html');
});

app.start = (callback) => {
  app.listen(app.get('port'), () => {
    callback(app);
  });
};

module.exports = app;
