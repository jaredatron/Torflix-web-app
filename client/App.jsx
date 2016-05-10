import React from 'react';
import ReactDOM from 'react-dom';
import state from './state';
import { setLocation } from '../lib/Location'

require('./style/main.sass')

export default class App extends React.Component {

  static childContextTypes = {
    setLocation: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    state.subscribe( state => {
      console.log('STATE UPDATE', this.state, state)
      if (this.state){
        this.setState(state);
      }else{
        this.state = state;
      }
    })
  }

  getChildContext() {
    return {
      setLocation: this.setLocation.bind(this)
    };
  }

  setLocation(path, props, replace) {
    setLocation(path, props, replace);
  }

  render() {
    return <this.state.page {...this.state} />
  }

}

App.render = (DOMNode) => {
  ReactDOM.render(React.createElement(App,null), DOMNode);
}
