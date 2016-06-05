import React from 'react'
import ReactDOM from 'react-dom'
import Link from './link.jsx'

export default class LogoutLink extends React.Component {
  static contextTypes = {
    emit: React.PropTypes.func.isRequired
  }

  constructor(){
    super();
    this.logout = this.logout.bind(this)
  }

  logout(){
    this.context.emit('auth:logout')
  }

  render(){
    return <Link {...this.props} onClick={this.logout}>{this.props.children}</Link>
  }
}
