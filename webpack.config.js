var path = require('path');
var webpack = require('webpack');
var ENV = require('./config/environment');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var constants = new webpack.DefinePlugin({
  PUTIO_APPLICATION_SECRET: JSON.stringify(ENV.PUTIO_APPLICATION_SECRET),
  PUTIO_CLIENT_ID:          JSON.stringify(ENV.PUTIO_CLIENT_ID),
  PUTIO_OAUTH_TOKEN:        JSON.stringify(ENV.PUTIO_OAUTH_TOKEN),
  PUTIO_REDIRECT_URI:       JSON.stringify(ENV.PUTIO_REDIRECT_URI),
})


module.exports = [
  {
    entry: [
      './client/renderer/style.sass',
      // "file?name=[name].[ext]!extract!css!"
    ],
    output: {
      publicPath: '/',
      path: path.resolve(__dirname, 'public'),
      filename: 'style.css'
    },
    // devtool: "source-map",
    plugins: [
      new ExtractTextPlugin("style.css")
    ],
    module: {
      loaders: [
        {
          test: /\.sass$/,
          // loaders: ["css", "sass"]
          loader: ExtractTextPlugin.extract("style", "css!sass")
        }
      ]
    },
    sassLoader: {
      // data: "$env: " + process.env.NODE_ENV + ";"
    }
  },
  {
    entry: './client.js',
    output: {
      publicPath: '/',
      path: path.resolve(__dirname, 'public'),
      filename: 'client.js'
    },
    // devtool: "source-map",
    plugins: [
      constants
    ],
    resolve: {
      modulesDirectories: [path.resolve(__dirname, 'node_modules')],
    },
    module: {
      noParse: /node_modules\/json-schema\/lib\/validate\.js/,
      loaders: [
        // {
        //   test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        //   loader: "url-loader?limit=10000&mimetype=application/font-woff"
        // },
        // {
        //   test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        //   loader: "file-loader"
        // },
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
        }
      ]
    },
    sassLoader: {
      // includePaths: [path.resolve(__dirname, "./some-folder")]
      // https://github.com/deadlyicon/Torflix-web-app/blob/master/webpack.config.js#L25
    }
  }

];
