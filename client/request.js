import Rx from 'rx-dom'
import { RxHttpRequest } from 'rx-http-request';
import URI from 'urijs'

const ORIGIN = window.location.origin
const COMPLETE_URL = /^https?:\/\//;

const HttpRequest = (options) => {
  if (!COMPLETE_URL.test(options.url)){
    if (options.url[0] !== '/') options.url = '/'+options.url;
    options.url = ORIGIN+'/'+options.url;
  }
  console.info('HTTP REQUEST', options)
  return RxHttpRequest._call(options.method, options.url, options)
}

export default function(options){
  options.method = options.method || 'get'
  if (options.serverProxy){
    var proxyOptions = {
      method: 'post',
      url: '/_proxy',
      body: JSON.stringify(options),
      headers: {
        'Content-Type': 'application/json',
      }
    }

    return HttpRequest(proxyOptions).map(proxyResponse => {
      console.log('AJAX PROXY RESPONSE:', proxyResponse);
      return JSON.parse(proxyResponse.response)
      // debugger
      // return proxyResponse;
    }).catch(error => {
      console.warn('AJAX PROXY ERROR');
      console.error(error);
      return Rx.Observable.return( error );
      return Rx.Observable.throw( error );
    })

  }else{
    return HttpRequest(options).map(response => {
      console.log('AJAX RESPONSE:', response);
      // debugger
      return response;
    }).catch(error => {
      console.warn('AJAX ERROR');
      console.error(error);
      return Rx.Observable.return( error );
      return Rx.Observable.throw( error );
    })
  }
}
