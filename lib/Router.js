import Rx from 'rx'
import Location from './Location'

export default class Router {

  constructor(spec) {
    this.routes = [];
    if (spec) spec(this);
    this.stream = Location.stream.map(() => this.update().get())
    this.update();
  }

  update(){
    var match;
    this.routes.find(route => match = route.match(Location.path, Location.params));
    if (!match) throw new Error('route not found for '+Location.path+' '+JSON.stringify(Location.params))
    this.path = match.path;
    this.params = match.params;
    this.page = match.page;
    return this;
  }

  get(){
    return {
      path:   this.path,
      params: this.params,
      page:   this.page,
    };
  }

  setLocation(path, params, replace){
    Location.set(path, params, replace);
    return this;
  }

  match(expression, page) {
    this.routes.push(new Route(expression, page));
    return this;
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
