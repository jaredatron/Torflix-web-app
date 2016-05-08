var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './client.js',
  output: { path: __dirname+'/public', filename: 'client.js' },
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
      }
    ]
  },
};
