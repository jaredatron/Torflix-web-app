import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from './Sidebar.jsx';

export default class Layout extends React.Component {

  render() {
    return <div className="layer columns">
      <Sidebar auth={this.props.auth}/>
      <div className="grow">
        {this.props.children}
      </div>
    </div>
  }

}
