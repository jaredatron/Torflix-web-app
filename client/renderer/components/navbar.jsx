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
    const { auth, renderCount, route } = this.context.state
    const path = route.path
    // const activeLink = getActiveLink(route.path)

    const NavbarLink = (props) => {
      const active = (
        props.path === "/" ? path === "/" :
        path.includes(props.path)
      )
      let className = active ? 'active' : ''
      return <Link {...props} className={className}>{props.children}</Link>
    }


    return <div className="navbar theme-dark columns">
      <NavbarLink path="/"          >Torflix</NavbarLink>
      <NavbarLink path="/transfers" >Transfers</NavbarLink>
      <NavbarLink path="/files"     >Files</NavbarLink>
      <NavbarLink path="/tv-shows"  >TV Shows</NavbarLink>
      <div className="grow" />
      <div><SearchInput autoFocus /></div>
      <LogoutLink tabIndex="-1">Logout</LogoutLink>
      <div>{auth.username}</div>
    </div>
  }
}


const getActiveLink = (path) => {
  const matches = path.match(/^\/([^\/]+)/)
  if (matches) return matches[0]
}
