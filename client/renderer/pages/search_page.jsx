import React from 'react'
import ReactDOM from 'react-dom'
import Page from '../page.js'
import Link from '../components/link.jsx'
import Layout from '../components/layout.jsx'
import SearchResults from '../components/search_results.jsx'

export default class SearchPage extends Page {

  onStateChange(props){
    let {query, order} = props.route.params
    if (this.query !== query || this.order !== order){
      this.query = query
      this.order = order
      this.search(query, order)
    }
  }

  search(query, order){
    this.emit({
      type: 'search',
      query: query,
      order: order,
    })
  }

  render(props) {
    const query = props.route.params.query
    const search = props.search || {}
    return <Layout className="search-page">
      <SearchControls/>
      <SearchResults search={search}/>
    </Layout>
  }

}


class SearchControls extends React.Component {
  render(){
    return <ol className="inline-list separated-list">
      <Link setParams={{order:"rating"}}>rating</Link>
      <Link setParams={{order:"date"}}>date</Link>
      <Link setParams={{order:"size"}}>size</Link>
      <Link setParams={{order:"peers"}}>peers</Link>
    </ol>
  }
}
