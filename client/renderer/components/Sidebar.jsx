import React from 'react';
import ReactDOM from 'react-dom';
import Link from './Link.jsx';

export default class Sidebar extends React.Component {

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
    return <div className="theme-dark rows">
      <Link path="/"         >Torflix</Link>
      <Link path="/search"   >Search</Link>
      <Link path="/transfers">Transfers</Link>
      <Link path="/files"    >Files</Link>
      <LogoutLink>Logout</LogoutLink>
      <div>
        <img src={auth.avatar_url} />
      </div>
      <div>{auth.username}</div>
      <Link onClick={this.logState}>Log State</Link>
      <small>{now+''}</small>
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
