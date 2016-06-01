var superagent = require('superagent');

module.exports = function(request, response){
  console.log('request.body', request.body);
  var settings = request.body;
  console.log('settings', settings);
  // Request
  // response.send('LOLZ')
  superagent(settings).pipe(res);
};
