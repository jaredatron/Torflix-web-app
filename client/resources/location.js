import Rx from 'rx-dom'
import URI from 'urijs'

/*

A location looks like this

{
  domain: 'example.com',
  url:    'http://example.com/about?a=1',
  path:   '/about',
  search: '?a=1',
  params: {},
}


*/

export default function location(events){
  const eventsStream = new Rx.ReplaySubject(1);

  const publish = () => {
    eventsStream.onNext(currentLocation())
  }

  Rx.Observable.fromEvent(window, 'popstate').forEach(publish)

  const setLocation = ({path, params}, replace) => {
    var href = pathAndParamsToHref(path, params);
    if (href === currentHref()){
      console.warn('refusing to change to same location '+href)
      return;
    }
    if (replace){
      history.replaceState(null, null, href);
    }else{
      history.pushState(null, null, href);
    }
    publish()
  }

  const setPath = (path) => {
    setLocation(path, currentParams())
  }

  const setParams = (params) => {
    let newParams = Object.assign(currentParams(), params)
    setLocation(currentPath(), newParams)
  }

  events.subscribe(
    event => {
      if (event.type === 'setLocation'){
        setLocation(event.location, event.replace)
      }
      if (event.type === 'setPath'){
        setPath(event.path, event.replace)
      }
      if (event.type === 'setParams'){
        setParams(event.params, event.replace)
      }
    }
  )

  publish()
  return eventsStream;
}


const currentLocation = () => {
  // const path = currentPath()
  // const params = currentParams()
  // const asString = pathAndParamsToHref(path, params)
  return parseUri(window.location.toString())
}


export const parseUri = (href) => {
  href = URI(href+'')
  return {
    domain:   href.domain(),
    url:      href.toString(),
    path:     href.path(),
    search:   href.search(),
    params:   searchToObject(href.query()),
  }
}

const currentPath = () => {
  // parseHref(window.location)
  return window.location.pathname;
}

const currentParams = () => {
  return searchToObject(window.location.search);
}
const currentHref = () =>{
  return pathAndParamsToHref(currentPath(), currentParams());
}

const locationToString = (path, params) => {
  return ensureSlashPrefix(path).replace(/ /g, '+')+objectToSearch(params)
}

export const pathAndParamsToHref = (path, params) => {
  return locationToString(path || '/', params || {});
}

const ensureSlashPrefix = (string) => {
  return string[0] == '/' ? string : '/'+string;
}

const objectToSearch = (params) => {
  var search = objectToQueryString(params);
  return search.length === 0 ? '' : '?'+search;
}

const objectToQueryString = (params) => {
  if (!params) return;
  let pairs = []
  Object.keys(params).forEach( key => {
    let value = params[key]
    if (value === true){
      return pairs.push(encodeURIComponent(key));
    }
    if (value === false || value === null || value === undefined){
      return;
    }
    pairs.push(encodeURIComponent(key)+'='+encodeURIComponent(value));
  });
  return pairs.join('&');
}

const searchToObject = (search) => {
  let params = {};
  search = search.substring(search.indexOf('?') + 1, search.length);
  if (search.length === 0) return params;
  search.split(/&+/).forEach( param => {
    let [key, value] = param.split('=');
    key = decodeURIComponent(key);
    value = value ? decodeURIComponent(value) : true;
    params[key] = value;
  });
  return params;
}
