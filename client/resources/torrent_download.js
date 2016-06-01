import Rx from 'rx-dom'
import putio from '../putio'
import Torrents from '../torrents'

export default function(events){
  let stateStream = new Rx.ReplaySubject(1);

  events.subscribe( event => {
    if (event.type === 'download-torrent'){
      downloadTorrent(event.torrentId)
    }
  })

  var state = {}
  const publish = () => {
    stateStream.onNext(state)
  }

  var querySubscription = null

  const downloadTorrent = (torrentId) => {
    if (state[torrentId]) return
    let downloadState = state[torrentId] = {}
    publish()
    downloadState.querySubscription = Torrents.getMagnetLink(torrentId).subscribe(
      update => {
        downloadState.torrentName = update.torrentName
        downloadState.trackers = update.trackers
        downloadState.error = update.error
        downloadState.errorMessage = update.errorMessage
        publish()
      },
      error => {
        downloadState.error = error
        publish()
      },
      complete => {
        downloadState.complete = true
        publish()
      }
    )
  }


  publish()
  return stateStream;
}
