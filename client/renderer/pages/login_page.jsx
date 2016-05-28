import React from 'react';
import Layout from '../components/layout.jsx';
import Link from '../components/link.jsx';
import putio from '../../putio'

export default class TransfersPage extends React.Component {

  static contextTypes = {
    emit: React.PropTypes.func.isRequired
  }

  render() {
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
