import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '../components/Layout.jsx';

export default class NotFoundPage extends React.Component {

  render() {
    return <Layout auth={this.props.auth}>
      <h1>Page Not Found</h1>
    </Layout>
  }

}
