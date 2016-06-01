import React from 'react'
import ReactDOM from 'react-dom'
import Layout from '../components/layout.jsx'
import SearchResults from '../components/search_results.jsx'

export default class TorrentDownloadPage extends React.Component {

  static contextTypes = {
    emit: React.PropTypes.func.isRequired,
  }

  torrentId(props){
    props = props || this.props
    return props.route.params.torrentId
  }

  downloadTorrnet(torrentId){
    this.context.emit({
      type: 'download-torrent',
      torrentId: torrentId,
    })
  }

  componentDidMount(){
    this.downloadTorrnet(this.torrentId())
  }

  componentWillReceiveProps(props){
    const a = this.torrentId(this.props)
    const b = this.torrentId(props)
    if (a !== b) this.downloadTorrnet(b)
  }

  render() {
    const torrentId = this.torrentId()
    const downloadState = this.props.torrentDownload[torrentId] || {}
    // console.info('downloadState', downloadState)
    const torrentName = downloadState.torrentName || torrentId
    const stateDescription = downloadState.trackers ?
      'Searching for magnet link' :
      'Searching for trackers'
    return <Layout>
      <h1>Downloading {torrentName}</h1>
      <h2>{stateDescription}</h2>
    </Layout>
  }

}
