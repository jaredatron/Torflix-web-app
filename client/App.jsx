import React from 'react';
import ReactDOM from 'react-dom';
import router from './router';

require('./style/main.sass')

export default class App extends React.Component {

  static childContextTypes = {
    setLocation: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = router.getRoute();
    this.setRouteState = this.setRouteState.bind(this);
  }

  componentDidMount() {
    router.onChange = this.setRouteState;
    router.start();
  }

  componentWillUnmount() {
    delete router.onChange;
    router.stop();
  }

  setRouteState(){
    this.setState(router.getRoute());
  }

  getChildContext() {
    return {
      setLocation: this.setLocation.bind(this)
    };
  }

  setLocation(path, props, replace) {
    router.setLocation(path, props, replace);
    // history.pushState({}, document.title, path);
    // this.onPopState();
  }

  render() {
    return <this.state.page {...this.state} />
  }

}

App.render = (DOMNode) => {
  ReactDOM.render(React.createElement(App,null), DOMNode);
}
