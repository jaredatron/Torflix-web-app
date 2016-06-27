import Rx from 'rx-dom'
import Torrents from '../torrents'

export default function(events){
  var state = {}
  let stateStream = new Rx.ReplaySubject(1);
  const publish = () => { stateStream.onNext(state) }

  events.subscribe( event => {
    if (event.type === 'search'){
      search(event)
    }
  })

  var querySubscription = null

  const search = ({query, order, verified}) => {
    query = typeof query === 'undefined' ? '' : query+'';
    if (state.query === query && state.order === order) return;
    if (querySubscription) querySubscription.dispose()
    state.query = query
    state.order = order
    state.error = null
    state.results = null
    publish()
    querySubscription = Torrents.search({query, order, verified}).subscribe(
      results => {
        state.results = results
        publish()
      },
      error => {
        state.error = error
        publish()
      },
      complete => {
        state.complete = true
        publish()
      }
    )
  }


  publish()
  return stateStream;
}
