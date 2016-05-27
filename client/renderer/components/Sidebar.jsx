import React from 'react';
import ReactDOM from 'react-dom';
import Link from './Link.jsx';

export default class Sidebar extends React.Component {

  render() {
    return <div className="theme-dark rows">
      <Link path="/"         >Torflix</Link>
      <Link path="/search"   >Search</Link>
      <Link path="/transfers">Transfers</Link>
      <Link path="/files"    >Files</Link>
      <LogoutLink>Logout</LogoutLink>
    </div>
  }

}


class LogoutLink extends React.Component {
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
    return <Link onClick={this.logout}>{this.props.children}</Link>
  }
}
