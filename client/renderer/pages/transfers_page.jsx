import React from 'react';
import Layout from '../components/layout.jsx';

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
      {transfers}
    </Layout>
  }

}


class TransfersList extends React.Component {
  render(){
    const transfers = this.props.transfers.transfers.map((transfer) => {
      return <TransferListItem key={transfer.id} transfer={transfer} />
    })

    return <table className="TransfersList">
      <thead>
        <tr>
          <th>Status</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {transfers}
      </tbody>
    </table>
  }
}

class TransferListItem extends React.Component {
  render(){
    return <tr>
      <td>{this.props.transfer.status}</td>
      <td>{this.props.transfer.name}</td>
    </tr>
  }
}
