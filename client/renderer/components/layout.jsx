import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './navbar.jsx';

export default class Layout extends React.Component {

  render() {
    let contentClassName = ''
    if (this.props.padded) contentClassName += ' layout-padded'

    return <div {...this.props}>
      <Navbar/>
      <div className={contentClassName}>{this.props.children}</div>
    </div>
  }

}
