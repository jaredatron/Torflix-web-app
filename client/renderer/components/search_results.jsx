import React from 'react'
import ReactDOM from 'react-dom'
import Link from '../components/link.jsx'

export default class SearchResults extends React.Component {
  render(){
    const results = this.props.results.map(
      result => <SearchResult key={result.id} result={result} />
    )
    return <div className="search-results">{results}</div>
  }
}


class SearchResult extends React.Component {
  render(){
    const result = this.props.result
    return <div className="search-result">
      <div>
        <Link path={'/download/torrentz/'+result.id}>{result.name}</Link>
      </div>
      <ol className="search-result-details inline-list separated-list">
        <li><SearchResultRating rating={result.rating} /></li>
        <li>{result.createdAtAgo}</li>
      </ol>
    </div>
  }
}


class SearchResultRating extends React.Component {
  render(){
    const rating = this.props.rating;
    let className = "search-results-rating rating-" + (
      rating > 6 ? 'awesome' :
      rating > 4 ? 'great' :
      rating > 2 ? 'good' :
      'neutral'
    )

    return <span className={className}>{rating}</span>
  }
}
