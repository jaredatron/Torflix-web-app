Location = {

  update(){
    this.path   = location.pathname;
    this.params = searchToObject(location.search);
    console.log('Location update', this.path, this.params);
    if (this.onChange) this.onChange(this);
    return this;
  },

  for(path, params){
    return locationToString(path || this.path, params || this.params);
  },

  set(path, params, replace){
    var value = this.for(path, params);

    if (value === this.for()){
      console.warn('SAME LOCATION', value)
      return false;
    }

    value = ensureSlashPrefix(value);

    if (replace){
      window.history.replaceState({}, window.document.title, value)
    }else{
      window.history.pushState({}, window.document.title, value)
    }
    this.update();
  },

  setPath(path, replace){
    this.set(this.for(path), replace)
  },

  setParams(params, replace){
    this.set(this.for(null, params), replace)
  },

  updateParams(params, replace){
    this.setParams(Object.assign({}, this.params, params), replace)
  },

  clearHash(){
    this.set(this.for(), true)
  },
};

addEventListener('popstate', event => Location.update());

const ensureSlashPrefix = (string) => {
  return string[0] == '/' ? string : '/'+string;
}

const objectToSearch = (params) => {
  var search = objectToQueryString(params);
  return search.length === 0 ? '' : '?'+search;
}

const locationToString = (path, params) => {
  return ensureSlashPrefix(path)+objectToSearch(params);
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

export default Location.update();
