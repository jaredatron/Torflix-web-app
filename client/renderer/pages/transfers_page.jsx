import React from 'react'
import Page from '../page.js'
import Layout from '../components/layout.jsx'

export default class TransfersPage extends Page {

  onEnter(){
    this.emit('transfers:startPolling')
  }

  onExit(){
    this.emit('transfers:stopPolling')
  }

  render(props) {
    const transfers = props.transfers.loaded ?
      <TransfersList transfers={props.transfers} /> :
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
