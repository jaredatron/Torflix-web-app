import Rx from 'rx-dom'
import superagent from 'superagent'
import httpRequest from '../lib/http_request'

const ORIGIN = window.location.origin
const COMPLETE_URL = /^https?:\/\//;

export default function(options){
  options.method = options.method || 'get'
  options.url = options.url.toString()
  console.log('REQUEST ->', options.method, options.url, {options})
  const request = options.serverProxy ?
    observableProxiedHttpRequest(options) :
    observableHttpRequest(options)
  return request.doOnCompleted(()=>{
    console.log('REQUEST <-', options.method, options.url, {options})
  })
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
    body: options,
  })
}
