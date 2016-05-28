import React from 'react';
import ReactDOM from 'react-dom';
import Link from './link.jsx';
import SearchInput from './search_input.jsx';

export default class Navbar extends React.Component {

  static contextTypes = {
    state: React.PropTypes.object.isRequired
  }

  constructor(){
    super()
    this.logState = this.logState.bind(this)
  }

  logState(){
    console.info('STATE:', this.context.state)
  }

  render() {
    const auth = this.context.state.auth
    const now = this.context.state.now
    return <div className="navbar theme-dark columns">
      <Link path="/"         >Torflix</Link>
      <Link path="/search"   >Search</Link>
      <Link path="/transfers">Transfers</Link>
      <Link path="/files"    >Files</Link>
      <Link onClick={this.logState}>Log State</Link>
      <div className="grow" />
      <div><SearchInput /></div>
      <LogoutLink>Logout</LogoutLink>
      <div>{auth.username}</div>
    </div>
    // <img src={auth.avatar_url} />
    // <small>{now+''}</small>
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
