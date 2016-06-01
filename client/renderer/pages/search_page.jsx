import React from 'react'
import ReactDOM from 'react-dom'
import Layout from '../components/layout.jsx'
import SearchResults from '../components/search_results.jsx'

export default class SearchPage extends React.Component {

  static contextTypes = {
    emit: React.PropTypes.func.isRequired,
  }

  search(query){
    this.context.emit({
      type: 'search',
      query: query,
    })
  }

  componentDidMount(){
    this.search(this.props.route.params.query)
  }

  componentWillReceiveProps(props){
    const queryA = this.props.route.params.query
    const queryB = props.route.params.query
    if (queryA !== queryB) this.search(queryB)
  }

  render() {
    const query = this.props.route.params.query
    const search = this.props.search || {}
    const searchResults = search.results ?
      <SearchResults results={search.results} /> :
      <div>Loading...</div>
    return <Layout className="search-page">
      {searchResults}
    </Layout>
  }

}
