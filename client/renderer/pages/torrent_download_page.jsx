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
    // downloadState
    return <Layout>
      Searching for torrent {torrentId}
    </Layout>
  }

}
