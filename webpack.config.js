var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './client.js',
  output: { path: __dirname+'/public', filename: 'client.js' },
  devtool: "source-map",
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
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
