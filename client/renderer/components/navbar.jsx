import React from 'react'
import ReactDOM from 'react-dom'
import Link from './link.jsx'
import SearchInput from './search_input.jsx'
import LogoutLink from './logout_link.jsx'

export default class Navbar extends React.Component {
  static contextTypes = {
    state: React.PropTypes.object.isRequired
  }

  render() {
    const { auth, now, renderCount } = this.context.state
    return <div className="navbar theme-dark columns">
      <Link path="/"         >Torflix</Link>
      <Link path="/transfers">Transfers</Link>
      <Link path="/files"    >Files</Link>
      <div className="grow" />
      <div>{now+''}</div>
      <div>{renderCount+''}</div>
      <div><SearchInput autoFocus /></div>
      <LogoutLink tabIndex="-1">Logout</LogoutLink>
      <div>{auth.username}</div>
    </div>
  }
}
