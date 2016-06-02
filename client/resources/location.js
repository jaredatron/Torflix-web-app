import Rx from 'rx-dom'

export default function location(events){
  let eventsStream = new Rx.ReplaySubject(1);

  const publish = () => {
    eventsStream.onNext({
      path:   window.location.pathname,
      params: searchToObject(window.location.search),
    })
  }

  Rx.Observable.fromEvent(window, 'popstate').map(publish)

  let setLocation = (path, params, replace) => {
    var href = hrefFor(path, params);
    if (replace){
      history.replaceState(null, null, href);
    }else{
      history.pushState(null, null, href);
    }
    publish()
  }

  events.subscribe(
    event => {
      if (event.type === 'changeLocation'){
        setLocation(event.path, event.params, event.replace)
      }
    }
  )

  publish()
  return eventsStream;
}

const locationToString = (path, params) => {
  return ensureSlashPrefix(path).replace(/ /g, '+')+objectToSearch(params)
}

const hrefFor = (path, params) => {
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
