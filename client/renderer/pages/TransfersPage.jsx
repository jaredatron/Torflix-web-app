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
    const transfers = this.props.transfers.loaded ?
      <TransfersList transfers={this.props.transfers} /> :
      'Loading...'

    return <Layout>
      <h1>Transfers</h1>
      <small>{JSON.stringify(this.props)}</small>
      {transfers}
    </Layout>
  }

}


class TransfersList extends React.Component {
  render(){
    return <table className="TransfersList">
      <thead>
        <tr>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Adobé Photoshop</td>
        </tr>
      </tbody>
    </table>
  }
}
