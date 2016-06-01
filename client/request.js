import Rx from 'rx-dom'
import superagent from 'superagent'
import URI from 'urijs'

const ORIGIN = window.location.origin
const COMPLETE_URL = /^https?:\/\//;

// const httpRequest = (options) => {
//   if (!COMPLETE_URL.test(options.url)){
//     if (options.url[0] !== '/') options.url = '/'+options.url;
//     options.url = ORIGIN+'/'+options.url;
//   }
//   console.info('HTTP REQUEST', options)



//   var request = superagent[options.method.toLowerCase()](options.url, options)
//   debugger
//   return Rx.Observable.create(function (observer) {
//     observer.onNext(42);
//     observer.onCompleted();

//     // Note that this is optional, you do not have to return this if you require no cleanup
//     return function () {
//       request.abort();
//     };
//   });
// }

export default function(options){
  options.method = options.method || 'get'
  if (options.serverProxy){
    return observableProxiedHttpRequest(options)
  }else{
    return observableHttpRequest(options)
  }
}

const httpRequest = (options, callback) => {
  var method = options.method.toLowerCase();
  var url = options.url;
  var request = superagent[method](url);
  if (options.query) request.query(options.query)
  if (method === 'post' && options.body) request.send(options.body)
  if (options.type) request.type(options.type)
  if (options.accept) request.accept(options.accept)
  if (options.headers){
    Object.keys(options.headers).forEach( key => {
      request.set(key, options.headers[key])
    })
  }
  return request.end(callback);
}

const observableHttpRequest = (options) => {
  var request = httpRequest(options)
  return Rx.Observable.create( observer => {
    request.on('response', response => {
      observer.onNext(response)
    })
    request.on('error', error => {
      observer.onError(error)
    })
    request.on('end', error => {
      observer.onCompleted()
    })
    return () => {
      request.abort()
    }
  });
}

const observableProxiedHttpRequest = (options) => {
  return observableHttpRequest({
    method: 'post',
    url: ORIGIN+'/_proxy',
    body: JSON.stringify(options),
  })
}
//     var proxyOptions = {
//       method: 'post',
//       url: '/_proxy',
//       body: JSON.stringify(options),
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     }

//     return HttpRequest(proxyOptions).map(proxyResponse => {
//       console.log('AJAX PROXY RESPONSE:', proxyResponse);
//       return JSON.parse(proxyResponse.response)
//       // debugger
//       // return proxyResponse;
//     }).catch(error => {
//       console.warn('AJAX PROXY ERROR');
//       console.error(error);
//       return Rx.Observable.return( error );
//       return Rx.Observable.throw( error );
//     })

//   }else{
//     return HttpRequest(options).map(response => {
//       console.log('AJAX RESPONSE:', response);
//       // debugger
//       return response;
//     }).catch(error => {
//       console.warn('AJAX ERROR');
//       console.error(error);
//       return Rx.Observable.return( error );
//       return Rx.Observable.throw( error );
//     })
//   }
// }
