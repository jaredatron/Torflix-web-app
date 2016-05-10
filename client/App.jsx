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
    console.log(router);
    this.state = {
      path:   router.path,
      params: router.params,
      page:   router.page,
    };
  }

  componentDidMount() {
    // router.onChange = this.setRouteState;
    // router.start();
    router.stream.subscribe(
      route => {
        console.log('route change', route);
        this.setState(route);
      },
      error => {
        console.error('routing error', error);
      }
    );
  }

  componentWillUnmount() {

  }

  getChildContext() {
    return {
      setLocation: this.setLocation.bind(this)
    };
  }

  setLocation(path, props, replace) {
    router.setLocation(path, props, replace);
  }

  render() {
    return <this.state.page {...this.state} />
  }

}

App.render = (DOMNode) => {
  ReactDOM.render(React.createElement(App,null), DOMNode);
}
