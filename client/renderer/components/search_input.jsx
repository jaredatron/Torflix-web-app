import React from 'react';
import ReactDOM from 'react-dom';

export default class SearchInput extends React.Component {

  static contextTypes = {
    emit:  React.PropTypes.func.isRequired,
    state: React.PropTypes.object.isRequired,
  }

  constructor(){
    super()
    this.state = {
      value: null,
    }
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

  onChange(event){
    const value = event.target.value
    this.setState({value})
  }

  componentWillReceiveProps(nextProps){
    const { query } = this.context.state.route.params
    if (this.query !== query) this.setState({value: null})
    this.query = query
  }

  render() {
    const { query } = this.context.state.route.params
    let { value } = this.state
    if (value === null) value = query
    return <input
      {...this.props}
      ref="input"
      type="text"
      className={"search-input "+(this.props.className||'')}
      onKeyDown={this.onKeyDown}
      autoFocus={this.props.autoFocus}
      value={value}
      onChange={this.onChange.bind(this)}
    />
  }
}
