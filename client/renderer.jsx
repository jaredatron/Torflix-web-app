import Rx from 'rx-dom'
import React from 'react'
import ReactDOM from 'react-dom'
import LoginPage from './renderer/pages/login_page.jsx'

require('./renderer/style/main.sass')

let Renderer = {
  render(DOMNode, props) {
    return ReactDOM.render(React.createElement(App, props), DOMNode);
  }
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
  }

  getChildContext() {
    return {
      emit:   this.props.emit,
      state:  this.props.state,
    };
  }

  render() {
    // console.log('RENDER', this.props);
    const state = this.props.state
    if (!state) return <div>App State null!</div>
    if (!state.auth) return <LoginPage {...state} />
    return state.page.render(state)
  }

}
