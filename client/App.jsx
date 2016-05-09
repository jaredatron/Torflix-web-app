import React from 'react';
import ReactDOM from 'react-dom';
import router from './router';

require('./style/main.sass')

export default class App extends React.Component {

  static childContextTypes = {
    setPathAndProps: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = this.getRouteState()
    this.onPopState = this.onPopState.bind(this);
  }

  componentDidMount() {
    addEventListener('popstate', this.onPopState)
  }

  componentWillUnmount() {
    removeEventListener('popstate', this.onPopState)
  }

  getRouteState(){
    let route = router(location);
    return {
      path: route.path,
      params: route.params,
      Page: route.Page,
    };
  }

  onPopState(){
    console.info('POPSTATE', event);
    this.setState(this.getRouteState());
  }

  getChildContext() {
    return {
      setPathAndProps: this.setPathAndProps.bind(this)
    };
  }

  setPathAndProps(path, props) {
    history.pushState({}, document.title, path);
    this.onPopState();
  }

  render() {
    return <this.state.Page props={this.state} />
  }

}

App.render = (DOMNode) => {
  ReactDOM.render(React.createElement(App,null), DOMNode);
}
