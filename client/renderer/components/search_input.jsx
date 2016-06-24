import React from 'react';
import ReactDOM from 'react-dom';

export default class SearchInput extends React.Component {

  static contextTypes = {
    emit:  React.PropTypes.func.isRequired,
    state: React.PropTypes.object.isRequired,
  }

  constructor(){
    super()
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  onKeyDown(event){
    if (event.keyCode !== 13) return
    this.context.emit({
      type: 'changeLocation',
      path: '/search/'+event.target.value,
    })
  }

  render() {
    const query = this.context.state.route.params.query
    return <input
      {...this.props}
      ref="input"
      className={"SearchInput "+(this.props.className||'')}
      defaultValue={query}
      onKeyDown={this.onKeyDown}
      autoFocus={this.props.autoFocus}
    />
  }
}
