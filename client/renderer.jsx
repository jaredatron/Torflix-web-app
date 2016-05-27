import React from 'react';
import ReactDOM from 'react-dom';

require('./renderer/style/main.sass')

let Renderer = {
  render(DOMNode, stateStream, emit) {
    return stateStream.subscribe(
      state => {
        let props = {
          emit: emit,
          state: state,
        }
        this.instance = ReactDOM.render(React.createElement(App, props), DOMNode);
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

  static PropTypes = {
    emit:  React.PropTypes.func.isRequired,
    state: React.PropTypes.object.isRequired,
  }

  static childContextTypes = {
    emit:   React.PropTypes.func.isRequired,
    path:   React.PropTypes.string.isRequired,
    params: React.PropTypes.object.isRequired,
  }

  getChildContext() {
    return {
      emit:   this.props.emit,
      path:   this.props.state.path,
      params: this.props.state.params,
    };
  }

  render() {
    console.log('RENDER', this.props);
    const state = this.props.state
    if (state){
      return <state.page {...state} />
    }else{
      return <div>
        <span>State Error:</span>
        <span>{JSON.stringify(this.props)}</span>
      </div>
    }
  }

}
