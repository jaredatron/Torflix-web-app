import React from 'react'
import ReactDOM from 'react-dom'
import Link from '../components/link.jsx'

export default class SearchResults extends React.Component {
  render(){
    let {query, results} = this.props.search
    const content = (
      results ?
        results.length === 0 ?
          <h2>No Results Found for {query}</h2> :
        results.map(result => <SearchResult key={result.id} result={result} />) :
      <h2>Loading...</h2>
    )
    return <div className="search-results">{content}</div>
  }
}

const SearchResult = (props) => {
  const result = props.result
  return <div className="search-result">
    <div>
      <DownloadTorrentLink torrentId={result.id}>{result.name}</DownloadTorrentLink>
    </div>
    <ol className="search-result-details inline-list separated-list">
      <li><SearchResultRating rating={result.rating} /></li>
      <li>{result.createdAtAgo}</li>
      <li>{result.size}</li>
      <li>{result.seeders}/{result.leechers}</li>
    </ol>
  </div>
}

const SearchResultRating = (props) => {
  const rating = props.rating;
  let className = "search-results-rating rating-" + (
    rating > 6 ? 'awesome' :
    rating > 4 ? 'great' :
    rating > 2 ? 'good' :
    'neutral'
  )

  return <span className={className}>{rating}</span>
}

class DownloadTorrentLink  extends React.Component {

  static contextTypes = {
    emit: React.PropTypes.func.isRequired
  }

  onClick(event) {
    if (event.metaKey === false) return true;
    event.preventDefault()
    this.context.emit({
      type: 'download-torrent',
      torrentId: this.props.torrentId,
    })
  }

  render() {
    const path = '/download/torrent/'+this.props.torrentId
    return <Link path={path} onClick={this.onClick.bind(this)}>{this.props.children}</Link>
  }

}
