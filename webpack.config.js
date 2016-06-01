var path = require('path');
var webpack = require('webpack');
var ENV = require('./config/environment')

var constants = new webpack.DefinePlugin({
  PUTIO_APPLICATION_SECRET: JSON.stringify(ENV.PUTIO_APPLICATION_SECRET),
  PUTIO_CLIENT_ID:          JSON.stringify(ENV.PUTIO_CLIENT_ID),
  PUTIO_OAUTH_TOKEN:        JSON.stringify(ENV.PUTIO_OAUTH_TOKEN),
  PUTIO_REDIRECT_URI:       JSON.stringify(ENV.PUTIO_REDIRECT_URI),
})

module.exports = {
  entry: {
    app: ['./client.js']
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'public'),
    filename: 'client.js'
  },
  devtool: "source-map",
  plugins: [
    constants
  ],
  resolve: {
    modulesDirectories: [path.resolve(__dirname, 'node_modules')],
  },
  module: {
    noParse: /node_modules\/json-schema\/lib\/validate\.js/,
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        include: __dirname,
        exclude: path.resolve(__dirname, 'node_modules'),
        query: {
          // presets: ['es2015', 'react']
          presets: ['es2015', 'react', 'stage-0']
        }
      },
      {
        test: /\.sass$/,
        loaders: ["style", "css?sourceMap", "sass?sourceMap"]
      }
    ]
  },
  sassLoader: {
    // includePaths: [path.resolve(__dirname, "./some-folder")]
    // https://github.com/deadlyicon/Torflix-web-app/blob/master/webpack.config.js#L25
  }
};
