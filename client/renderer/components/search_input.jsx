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
    const { location, Page } = this.context.state
    const params = Page.name === "SearchPage" ? location.params : {}
    this.context.emit({
      type: 'setLocation',
      location: {
        path: '/search/'+event.target.value,
        params: params,
      }
    })
  }

  render() {
    const query = this.context.state.route.params.query
    return <input
      {...this.props}
      ref="input"
      className={"search-input "+(this.props.className||'')}
      defaultValue={query}
      onKeyDown={this.onKeyDown}
      autoFocus={this.props.autoFocus}
    />
  }
}
