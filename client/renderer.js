import React from 'react';
import ReactDOM from 'react-dom';
// import { locationStream, setLocation } from './renderer/location'

require('./renderer/style/main.sass')

let Renderer = {
  render(DOMNode, state) {
    // TODO merge streams locationStream
    this.stateSubscription = state.subscribe(
      state => {
        this.instance = ReactDOM.render(React.createElement(App, state), DOMNode);
      },
      error => {
        console.warn('App Render Error');
        console.error(error);
      },
      () => {
        throw new Error('state stream should never complete');
      },
    );
  },
};

export default Renderer

class App extends React.Component {

  // static childContextTypes = {
  //   setLocation: React.PropTypes.func.isRequired
  // }

  // getChildContext() {
  //   return {
  //     setLocation: this.setLocation.bind(this)
  //   };
  // }

  // setLocation(path, props, replace) {
  //   setLocation(path, props, replace);
  // }

  render() {
    console.log('RENDER', this.props);
    if (this.props && this.props.page){
      return <this.props.page {...this.props} />
    }else{
      return <div>
        <span>State Error:</span>
        <span>{JSON.stringify(this.props)}</span>
      </div>
    }
  }

}
