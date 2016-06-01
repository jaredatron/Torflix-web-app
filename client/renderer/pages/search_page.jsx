import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '../components/layout.jsx';

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
    return <Layout>
      <h1>Search Page {query}</h1>
      {searchResults}
    </Layout>
  }

}

class SearchResults extends React.Component {
  render(){
    const results = this.props.results.map(
      result => <SearchResult key={result.id} result={result} />
    )
    return <table>
      <tbody>{results}</tbody>
    </table>
  }
}


class SearchResult extends React.Component {
  render(){
    const result = this.props.result
    return <tr>
      <td>
        <a href={result.href}>{result.name}</a>
      </td>
      <td>
        {result.rating}
      </td>
      <td>
        {result.createdAtAgo}
      </td>
    </tr>
  }
}
