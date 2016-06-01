var superagent = require('superagent');

module.exports = (options, callback) => {
  var method = options.method.toLowerCase();
  var url = options.url;
  var request = superagent[method](url);
  if (options.query) request.query(options.query)
  if (method === 'post' && options.body) request.send(options.body)
  if (options.type)    request.type(options.type)
  if (options.accept)  request.accept(options.accept)
  if (options.headers) request.set(options.headers)
  return request.end(callback);
}
