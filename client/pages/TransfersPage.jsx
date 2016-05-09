import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '../components/Layout.jsx';

export default class TransfersPage extends React.Component {

  render() {
    return <Layout>
      <h1>Transfers</h1>
      <pre>{JSON.stringify(this.props)}</pre>
    </Layout>
  }

}
