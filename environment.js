if (process.env.NODE_ENV !== 'production'){
  require('dotenv').load();
}

process.env.ROOT_PATH = __dirname;
module.exports = process.env;
