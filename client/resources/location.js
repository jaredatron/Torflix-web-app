import Rx from 'rx'

export default function location(events){
  let setLocationStream = new Rx.ReplaySubject(1);
  setLocationStream.onNext();
  let popstateStream = Rx.Observable.fromEvent(window, 'popstate');

  let state = Rx.Observable.merge(
    setLocationStream, popstateStream
  ).map(()=>{
    console.log('locationStream fired')
    return {
      path:   window.location.pathname,
      params: searchToObject(window.location.search),
    }
  });

  return state;
}


export function setLocation(path, params, replace){
  var href = hrefFor(path, params);
  if (replace){
    history.replaceState(null, null, href);
  }else{
    history.pushState(null, null, href);
  }
  setLocationStream.onNext();
}


export function locationToString(path, params){
  return ensureSlashPrefix(path)+objectToSearch(params);
}


export function hrefFor(path, params){
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




// let manualLocationChangeStream = new Rx.ReplaySubject(1);
// let popstateStream = Rx.Observable.fromEvent(window, 'popstate');

// Location = {

//   stream: Rx.Observable.merge(
//     manualLocationChangeStream,
//     popstateStream
//   ).map(event => Location.update().get()),

//   update(){
//     this.path   = location.pathname;
//     this.params = searchToObject(location.search);
//     console.log('Location update', this.path, this.params);
//     if (this.onChange) this.onChange(this);
//     return this;
//   },

//   get(){
//     return {
//       path: this.path,
//       params: this.params,
//     }
//   },

//   set(path, params, replace){
//     var value = this.for(path, params);

//     if (value === this.for()){
//       console.warn('SAME LOCATION', value)
//       return false;
//     }

//     if (replace){
//       window.history.replaceState({}, window.document.title, value)
//     }else{
//       window.history.pushState({}, window.document.title, value)
//     }
//     manualLocationChangeStream.onNext();
//     return this;
//   },

//   for(path, params){
//     return locationToString(path || this.path, params || this.params);
//   },

//   setPath(path, replace){
//     return this.set(this.for(path), replace)
//   },

//   setParams(params, replace){
//     return this.set(this.for(null, params), replace)
//   },

//   updateParams(params, replace){
//     return this.setParams(Object.assign({}, this.params, params), replace)
//   },

//   clearHash(){
//     return this.set(this.for(), true);
//   },
// };

// // addEventListener('popstate', event => Location.update());





// const locationToString = (path, params) => {
//   return ensureSlashPrefix(path)+objectToSearch(params);
// }

// const searchToObject = (search) => {
//   let params = {};
//   search = search.substring(search.indexOf('?') + 1, search.length);
//   if (search.length === 0) return params;
//   search.split(/&+/).forEach( param => {
//     let [key, value] = param.split('=');
//     key = decodeURIComponent(key);
//     value = value ? decodeURIComponent(value) : true;
//     params[key] = value;
//   });
//   return params;
// }



// export default Location.update();
