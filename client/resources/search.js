import Rx from 'rx-dom'
import putio from '../putio'
import Torrents from '../torrents'

export default function(events){
  let stateStream = new Rx.ReplaySubject(1);

  events.subscribe( event => {
    if (event.type === 'search'){
      search(event.query)
    }
  })

  var state = {}
  var querySubscription = null

  const search = (query) => {
    if (state.query === query) return;
    if (querySubscription) querySubscription.dispose()
    state.query = query
    state.results = null
    update(state)
    querySubscription = Torrents.search(query).subscribe(
      results => {
        state.results = results
        update(state)
      },
      error => {
        state.error = error
        update(state)
      },
      complete => {
        state.complete = true
        update(state)
      }
    )
    querySubscription.query = query;
  }

  const update = (results) => {
    stateStream.onNext(results)
  }
  update(null)
  return stateStream;
}
