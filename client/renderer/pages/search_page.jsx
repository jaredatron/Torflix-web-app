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
    let {query, order} = props.route.params
    const search = props.search || {}
    return <Layout className="search-page">
      <SearchControls order={order}/>
      <SearchResults search={search}/>
    </Layout>
  }

}


const SearchControls = (props) => {
  let { order } = props
  return <ol className="search-page-controls inline-list separated-list">
    <SetSearchOrderLink active={order == "rating"} order="rating"/>
    <SetSearchOrderLink active={order == "date" } order="date"/>
    <SetSearchOrderLink active={order == "size" } order="size"/>
    <SetSearchOrderLink active={order == "peers"} order="peers"/>
  </ol>
}


const SetSearchOrderLink = (props) => {
  return <Link
    setParams={{order: props.order}}
    className={(props.active ? 'active ' : '')+props.className}
  >{props.order}</Link>
}
