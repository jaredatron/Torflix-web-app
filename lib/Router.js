import Location from './Location'

window.DEBUGLocation = Location;

console.log(DEBUGLocation)

export default class Router {

  constructor(spec) {
    this.routes = [];
    this.map(spec);
    this.onPopState = this.onPopState.bind(this);
  }

  start(){
    addEventListener('popstate', this.onPopState)
  }

  stop(){
    removeEventListener('popstate', this.onPopState)
  }

  onPopState(){
    this.onChange();
  }

  setLocation(path, params, replace){
    Location.set(path, params, replace);
    return this;
  }

  map(spec) {
    spec(this);
    return this;
  }

  match(expression, page) {
    let route = new Route(expression, page)
    // route.id = this.routes.length;
    this.routes.push(route);
    return this;
  }

  getRoute(){
    var path = location.pathname;
    var params = {}; // location.search TODO
    var match;
    this.routes.find(route => match = route.match(path, params));
    if (match) return match;
    throw new Error('route not found for '+path+' '+JSON.stringify(params))
  }

}


class Route {
  constructor(expression, page){
    this.expression = expression;
    this.page = page;
    let {paramNames, regexp} = parseRouteExpression(expression);
    this.paramNames = paramNames;
    this.regexp = regexp;
  }

  match(path, params){
    var parts = path.match(this.regexp)
    if (!parts){ return false; }
    parts.shift();
    params = Object.assign({}, params);
    this.paramNames.forEach( paramName => {
      params[paramName] = parts.shift();
    });
    return {
      path: path,
      params: params,
      page: this.page,
    };
  }
}


const escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g
const namedParams  = /\/?(:|\*)([^\/?]+)/g
const parseRouteExpression = (expression) => {
  let paramNames = [];
  expression = expression.replace(escapeRegExp, '\\$&')
  expression = expression.replace(namedParams, (_, type, paramName) => {
    paramNames.push(paramName)
    if (type === ':') return '/([^/?]+)';
    if (type === '*') return '/(.*?)';
  })
  let regexp = new RegExp('^'+expression+'$');
  return {
    paramNames: paramNames,
    regexp: regexp,
  }
}
