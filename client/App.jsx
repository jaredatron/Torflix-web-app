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
    this.state = router.getRoute();
    this.setRouteState = this.setRouteState.bind(this);
  }

  componentDidMount() {
    router.onChange(this.setRouteState);
    router.start();
  }

  componentWillUnmount() {
    router.stop();
  }

  setRouteState(){
    this.setState(router.getRoute());
  }

  getChildContext() {
    return {
      setPathAndProps: this.setPathAndProps.bind(this)
    };
  }

  setPathAndProps(path, props, replace) {
    router.setRoute(path, props, replace);
    // history.pushState({}, document.title, path);
    // this.onPopState();
  }

  render() {
    return <this.state.Page {...this.state} />
  }

}

App.render = (DOMNode) => {
  ReactDOM.render(React.createElement(App,null), DOMNode);
}
