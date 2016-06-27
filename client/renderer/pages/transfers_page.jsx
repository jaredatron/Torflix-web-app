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
    return <Layout>
      <TorrentDownloads {...props.torrentDownload} />
      <Transfers {...props.transfers} />
    </Layout>
  }

}


class TorrentDownloads extends React.Component {
  render(){
    const downloads = this.props.ids.map(id => {
      return <TorrentDownload key={id} id={id} details={this.props.downloads[id]} />
    })
    return <div>{downloads}</div>
  }
}

class TorrentDownload extends React.Component {
  render(){
    const {id, details} = this.props
    const torrentName = details.torrentName || details.name || torrentId
    const stateDescription = (
      details.error ? 'ERROR '+details.error :
      details.magnetLink ? 'Adding magnet link to Put.io' :
      details.trackers ? 'Searching for magnet link' :
      'Searching for trackers'
    )
    return <div className="transfers-torrent-download">
      <div><strong>{torrentName}</strong></div>
      <div><small>{stateDescription}</small></div>
    </div>
  }
}

class Transfers extends React.Component {
  render(){
    if (!this.props.loaded) return <div>Loading...</div>

    const transfers = this.props.transfers.map((transfer) => {
      return <Transfer key={transfer.id} transfer={transfer} />
    })
    transfers.reverse()

    return <div className="transfers-list">{transfers}</div>
  }
}

class Transfer extends React.Component {
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
