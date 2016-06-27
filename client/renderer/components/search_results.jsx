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
      <DownloadResultLink result={result} />
      &nbsp;
      <Link href={`http://torrentz.com/${result.id}`} target="_blank" tabIndex="-1">
        <i className="icon icon-external-link-square"/>
      </Link>
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

class DownloadResultLink  extends React.Component {

  static contextTypes = {
    emit: React.PropTypes.func.isRequired
  }

  onClick(path, event) {
    const { result } = this.props

    if (event.metaKey === false){
      this.context.emit({
        type: 'setPath',
        path: path,
      });
    }else{
      this.context.emit({
        type: 'download-torrent',
        torrentId: result.id,
      })
      this.context.emit({
        type: 'alert',
        message: `downloading "${result.name}"`,
      })
    }
  }

  render() {
    const { result } = this.props
    const path = '/download/torrent/'+result.id
    return <Link path={path} onClick={this.onClick.bind(this, path)}>{result.name}</Link>
  }

}
