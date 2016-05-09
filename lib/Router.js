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

  }

  map(spec) {
    spec.call(this);
    return this;
  }

  match(expression, page) {
    let route = new Route(expression, page)
    // route.id = this.routes.length;
    this.routes.push(route);
    return this;
  }

  getRoute(){
    var path = location.pathname
    var params = {} // location.search TODO
    var route, match;
    for (route in this.routes) {
      match = route.match(path, params)
      if (match) break;
    }
    throw new Error('route not found for '+path+' '+JSON.stringify(params))
  }

  redirectTo(path, params) {
    params = params || {};
    return () => {
      // require('./RedirectComponent')(path: path, params: params)
    }
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

  }
}


const escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g
const namedParams  = /\/?(:|\*)([^\/?]+)/g
const parseRouteExpression = (expression) => {
  let paramNames = []
  expression = expression.replace(escapeRegExp, '\\$&')
  expression = expression.replace(namedParams, (_, type, paramName) => {
    paramNames.push(paramName)
    if (type === ':') return '/([^/?]+)';
    if (type === '*') return '/(.*?)';
  })
  let regexp = new RegExp("^#{expression}$")
  return {
    paramNames: paramNames,
    regexp: regexp,
  }
}
