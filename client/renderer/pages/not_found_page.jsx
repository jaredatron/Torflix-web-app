import React from 'react';
import ReactDOM from 'react-dom';
import Page from '../page.js'
import Layout from '../components/layout.jsx';

export default class NotFoundPage extends Page {

  render(props) {
    return <Layout>
      <h1>Page Not Found</h1>
    </Layout>
  }

}
