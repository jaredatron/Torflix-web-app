var path = require('path');

if (process.env.NODE_ENV !== 'production'){
  require('dotenv').load();
}

process.env.ROOT_PATH = path.resolve(__dirname, '..');
module.exports = process.env;
