import Page from '../page.js'
import Layout from '../components/layout.jsx'
import React from 'react'
import Link from '../components/link.jsx'
import putio from '../../putio'

export default class LoginPage extends Page {
  render(props) {
    return <div>
      <LoginButton>Login via Put.io</LoginButton>
    </div>
  }
}


class LoginButton extends React.Component {
  render(){
    const href = putio.oauthUrl()
    return <Link href={href}>{this.props.children}</Link>
  }
}
