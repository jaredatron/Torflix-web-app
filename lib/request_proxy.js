var Request = require('request')

module.exports = function(request, response){
  console.log('request.body', request.body);
  var settings = JSON.parse(request.body)
  console.log('settings', settings);
  // Request
  // response.send('LOLZ')
  Request(settings).pipe(res);
};
