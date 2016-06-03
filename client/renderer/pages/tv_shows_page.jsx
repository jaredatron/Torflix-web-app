import React from 'react'
import Page from '../page.js'
import Layout from '../components/layout.jsx'
import Link from '../components/link.jsx'

export default class TvShowsPage extends Page {

  onEnter(){
    this.emit('tv-shows:load')
  }

  onExit(){
    // this.emit('files:stopPolling')
  }

  onStateChange(state){

  }

  render(state) {
    const content = (
      state.tvShows.loading ? 'Loading...' :
      state.tvShows.tvShows.map(tvShow => <TvShow key={tvShow.id} tvShow={tvShow} />)
    )
    return <Layout className="files-page">
      <h1>TV Shows</h1>
      {content}
    </Layout>
  }

}


class TvShow extends React.Component {
  render(){
    const tvShow = this.props.tvShow
    return <div>
      <Link path={`/tv-shows/${tvShow.id}`}>{tvShow.name}</Link>
    </div>
  }
}
