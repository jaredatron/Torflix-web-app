import React from 'react'
import Page from '../page.js'
import Layout from '../components/layout.jsx'
import Link from '../components/link.jsx'

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
    transfers.reverse()

    return <div className="transfers-list">{transfers}</div>
  }
}

class TransferListItem extends React.Component {
  render(){
    const transfer = this.props.transfer

    const name = transfer.file_id ?
      <Link path={`/files/${transfer.file_id}`}>{transfer.name}</Link> :
      <div>{transfer.name}</div>

    return <div className="transfers-list-transfer">
      {name}
      <div>
        <small>{transfer.status_message}</small>
      </div>
    </div>
  }
}
