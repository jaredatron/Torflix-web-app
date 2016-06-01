import Rx from 'rx-dom'
import superagent from 'superagent'
import httpRequest from '../lib/http_request'

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
  options.url = options.url.toString()
  if (options.serverProxy){
    return observableProxiedHttpRequest(options)
  }else{
    return observableHttpRequest(options)
  }
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
  console.info('PROXY REQUEST', options)
  return observableHttpRequest({
    method: 'post',
    url: ORIGIN+'/_proxy',
    body: options,
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
