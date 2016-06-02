import Rx from 'rx-dom'
import Torrents from '../torrents'

export default function(events){
  var state = {}
  let stateStream = new Rx.ReplaySubject(1);
  const publish = () => { stateStream.onNext(state) }

  events.subscribe( event => {
    if (event.type === 'search'){
      search(event.query)
    }
  })

  var querySubscription = null

  const search = (query) => {
    if (state.query === query) return;
    if (querySubscription) querySubscription.dispose()
    state.query = query
    state.error = null
    state.results = null
    publish()
    querySubscription = Torrents.search(query).subscribe(
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
