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
    this.stateSubscription = state.subscribe(
      state => {
        console.log('App#state change', this.state, state)
        if (this.state){
          this.setState(state);
        }else{
          this.state = state;
        }
      },

      error => { console.log('STATE ERROR', error); },

      () => { console.log('STATE COMPLETE'); },
    );

    if (!this.state){
      console.error('App started with null state', this.state);
    }
    console.log('App instance', this);
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
    console.log('RENDER', this.state);
    if (this.state && this.state.page){
      return <this.state.page {...this.state} />
    }else{
      return <div>
        <span>State Error:</span>
        <span>{JSON.stringify(this.state)}</span>
      </div>
    }
  }

}

App.render = function(DOMNode){
  this.instance = ReactDOM.render(React.createElement(App,null), DOMNode);
}
