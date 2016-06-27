import React from 'react'
import ReactDOM from 'react-dom'
import Page from '../page.js'
import Link from '../components/link.jsx'
import Layout from '../components/layout.jsx'
import SearchResults from '../components/search_results.jsx'

export default class SearchPage extends Page {

  onEnter(props){
    let {query, order, verified} = props.route.params
    this.search({query, order, verified})
  }

  search({query, order, verified}){
    let type = 'search'
    this.emit({type, query, order, verified})
  }

  render(props) {
    let {query, order} = props.route.params
    const search = props.search || {}
    return <Layout className="search-page">
      <SearchControls params={props.route.params}/>
      <SearchResults search={search}/>
    </Layout>
  }

}


const SearchControls = ({params}) => {
  let { query, order, verified } = params

  return <div className="search-page-controls columns">
    <ol className="inline-list separated-list">
      <VerifiedLink verified={verified}/>
      <SearchLink active={query === "movies"   } query="movies"/>
      <SearchLink active={query === "tv"       } query="tv"/>
      <SearchLink active={query === "music"    } query="music"/>
      <SearchLink active={query === "games"    } query="games"/>
      <SearchLink active={query === "peer>2000"} query="peer>2000"/>
      <SearchLink active={query === "added:7d" } query="added:7d"/>
    </ol>
    <div className="grow" />
    <ol className="inline-list separated-list">
      <SetSearchOrderLink active={order === "rating"} order="rating"/>
      <SetSearchOrderLink active={order === "date" } order="date"/>
      <SetSearchOrderLink active={order === "size" } order="size"/>
      <SetSearchOrderLink active={order === "peers"} order="peers"/>
    </ol>
  </div>
}


const SetSearchOrderLink = ({order, active}) => {
  return <Link
    inheritParams
    params={{order: order}}
    className={active ? 'active ' : ''}
  >{order}</Link>
}

const VerifiedLink = ({verified}) => {
  return <Link
    inheritParams
    params={{verified: !verified}}
    className={verified ? 'active' : ''}
  >verified</Link>
}

const SearchLink = ({query, active}) => {
  return <Link
    inheritParams
    path={'/search/'+query}
    className={active ? 'active' : ''}
  >{query}</Link>
}
