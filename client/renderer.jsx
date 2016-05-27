import Rx from 'rx-dom'
import React from 'react'
import ReactDOM from 'react-dom'
import LoginPage from './renderer/pages/login_page.jsx'

require('./renderer/style/main.sass')

let Renderer = {
  render(DOMNode, stateStream, emit) {
    return stateStream.observeOn(Rx.Scheduler.requestAnimationFrame).subscribe(
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
    state:  React.PropTypes.object.isRequired,
    path:   React.PropTypes.string.isRequired,
    params: React.PropTypes.object.isRequired,
  }

  getChildContext() {
    return {
      emit:   this.props.emit,
      state:  this.props.state,
      path:   this.props.state.route.path,
      params: this.props.state.route.params,
    };
  }

  render() {
    // console.log('RENDER', this.props);
    const state = this.props.state
    if (!state) return <div>
      <span>State Error:</span>
      <span>{JSON.stringify(this.props)}</span>
    </div>

    if (!state.auth) return <LoginPage {...state} />

    return <state.route.page {...state} />
  }

}
