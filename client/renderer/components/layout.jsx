import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './navbar.jsx';

export default class Layout extends React.Component {

  render() {
    return <div {...this.props}>
      <Navbar/>
      {this.props.children}
    </div>
  }

}
