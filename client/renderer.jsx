import Rx from 'rx-dom'
import React from 'react'
import ReactDOM from 'react-dom'
import LoginPage from './renderer/pages/login_page.jsx'

require('./renderer/style/main.sass')

const renderer = {
  render(DOMNode, emit, state) {
    const Page = state.auth ? state.route.page : LoginPage

    if (!this.page || !(this.page instanceof Page)){
      if (this.page) this.page.onExit(state)
      this.page = new Page
      this.page.emit = emit
      this.page.onEnter(state)
    }

    this.page.beforeRender(state)
    const props = {
      emit: emit,
      state: state,
      page: this.page,
    }
    const instance = ReactDOM.render(React.createElement(App, props), DOMNode);
    this.page.afterRender(state)
    return { instance, page }
  }
};

export default renderer


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
    return this.props.page.render(state)
  }

}
