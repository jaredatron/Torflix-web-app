import Rx from 'rx-dom'
import React from 'react'
import ReactDOM from 'react-dom'

require('./renderer/style/main.sass')

const renderer = {
  render(DOMNode, emit, page, state) {
    const props = {
      emit: emit,
      page: page,
      state: state,
    }
    return ReactDOM.render(React.createElement(App, props), DOMNode);
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
