import React from 'react';
import ReactDOM from 'react-dom';
import PageLink from './PageLink.jsx';

export default class Sidebar extends React.Component {

  render() {
    return <div className="theme-dark rows">
      <PageLink href="/"         >Torflix</PageLink>
      <PageLink href="/search"   >Search</PageLink>
      <PageLink href="/transfers">Transfers</PageLink>
      <PageLink href="/files"    >Files</PageLink>
    </div>
  }

}
