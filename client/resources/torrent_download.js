import Rx from 'rx-dom'
import putio from '../putio'
import TorrentSearch from '../torrent_search'

export default function(events){
  let stateStream = new Rx.ReplaySubject(1);

  events.subscribe( event => {
    if (event.type === 'download-torrent'){
      downloadTorrent(event.torrentId)
    }
  })

  var state = {}
  const update = () => {
    stateStream.onNext(state)
  }

  var querySubscription = null

  const downloadTorrent = (torrentId) => {
    if (state[torrentId]) return
    let downloadState = state[torrentId] = {}
    update()
    downloadState.querySubscription = TorrentSearch.getTorrent(torrentId).subscribe(
      results => {
        state.results = results
        update()
      },
      error => {
        state.error = error
        update()
      },
      complete => {
        state.complete = true
        update()
      }
    )
  }


  update()
  return stateStream;
}
