var httpRequest = require('./http_request');

module.exports = function(request, response){
  console.log('request.body', request.body);
  var options = request.body;
  console.log('options', options);
  httpRequest(options).pipe(response);
};
