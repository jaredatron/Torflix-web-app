import React from 'react';
import Layout from '../components/Layout.jsx';

export default class TransfersPage extends React.Component {

  static contextTypes = {
    emit: React.PropTypes.func.isRequired
  }

  componentDidMount(){
    if (!this.props.transfers.loaded){
      this.context.emit('transfers:load')
    }
  }

  render() {
    return <Layout>
      <h1>Transfers</h1>
      <pre>{JSON.stringify(this.props)}</pre>
    </Layout>
  }

}
