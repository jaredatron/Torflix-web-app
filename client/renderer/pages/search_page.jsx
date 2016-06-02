import React from 'react'
import ReactDOM from 'react-dom'
import Page from '../page.js'
import Layout from '../components/layout.jsx'
import SearchResults from '../components/search_results.jsx'

export default class SearchPage extends Page {

  onStateChange(props){
    const query = props.route.params.query
    if (this.query != query){
      this.query = query
      this.search(query)
    }
  }

  search(query){
    this.emit({
      type: 'search',
      query: query,
    })
  }

  // componentWillReceiveProps(props){
  //   const queryA = this.props.route.params.query
  //   const queryB = props.route.params.query
  //   if (queryA !== queryB) this.search(queryB)
  // }

  render(props) {
    const query = props.route.params.query
    const search = props.search || {}
    const searchResults = search.results ?
      <SearchResults results={search.results} /> :
      <div>Loading...</div>
    return <Layout className="search-page">
      {searchResults}
    </Layout>
  }

}
