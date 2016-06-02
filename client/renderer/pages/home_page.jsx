import React from 'react';
import ReactDOM from 'react-dom'
import Page from '../page.js'
import Layout from '../components/layout.jsx';

export default class HomePage extends Page {

  render() {
    return <Layout>
      <h1>Home Page</h1>
    </Layout>
  }

}
