import Rx from 'rx-dom'
import putio from '../putio'
import TorrentSearch from '../torrent_search'

export default function(events){
  let stateStream = new Rx.ReplaySubject(1);

  events.subscribe( event => {
    if (event.type === 'search'){
      search(event.query)
    }
  })

  var querySubscription = null

  const search = (query) => {
    if (querySubscription) querySubscription.dispose()
    var state = {}
    update(state)
    querySubscription = TorrentSearch.search(query).subscribe(
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
  }

  const update = (results) => {
    stateStream.onNext(results)
  }
  update(null)
  return stateStream;
}
