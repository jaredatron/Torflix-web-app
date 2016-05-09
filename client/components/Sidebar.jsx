import React from 'react';
import ReactDOM from 'react-dom';
import Link from './Link.jsx';

export default class Sidebar extends React.Component {

  render() {
    return <div className="theme-dark rows">
      <Link path="/"         >Torflix</Link>
      <Link path="/search"   >Search</Link>
      <Link path="/transfers">Transfers</Link>
      <Link path="/files"    >Files</Link>
    </div>
  }

}
