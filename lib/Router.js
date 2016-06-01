export default class Router {

  constructor(spec) {
    this.routes = [];
    if (spec) spec(this);
  }

  routeFor(location){
    var match;
    this.routes.find(route => match = route.match(location.path, location.params));
    return match;
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
      params[paramName] = decodeURIComponent(parts.shift());
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
