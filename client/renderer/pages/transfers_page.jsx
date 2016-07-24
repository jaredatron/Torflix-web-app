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


const TorrentDownloads = ({ids, downloads}) => {
  const downloadComponents = ids.map(id => {
    return <TorrentDownload key={id} id={id} details={downloads[id]} />
  })
  return <div>{downloadComponents}</div>
}

const TorrentDownload = ({id, details}) => {
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

const Transfers = ({loaded, transfers}) => {
  if (!loaded) return <div>Loading...</div>

  const transferComponents = transfers.map((transfer) => {
    return <Transfer key={transfer.id} transfer={transfer} />
  })
  transferComponents.reverse()

  return <div className="transfers-list">{transferComponents}</div>
}

const Transfer = ({transfer}) => {

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
