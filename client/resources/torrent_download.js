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
        downloadState.magnetLink = update.magnetLink
        publish()

        if (downloadState.magnetLink){
          downloadState.addTransferSubscription = putio.addTransfer(downloadState.magnetLink).subscribe(
            transfer => {
              console.log('addTransfer transfer', transfer)
              downloadState.transfer = transfer
              publish()
            },

            error => {
              downloadState.error = error
              publish()
            }
          )
        }

      },
      error => {
        downloadState.error = error
        publish()
      },
    )
  }

  publish()
  return stateStream;
}
