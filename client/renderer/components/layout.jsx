import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './navbar.jsx';

export default class Layout extends React.Component {

  render() {
    return <div>
      <Navbar auth={this.props.auth}/>
      <div className="grow">
        {this.props.children}
      </div>
    </div>
  }

}
