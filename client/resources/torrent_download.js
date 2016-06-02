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
    downloadTorrentStream (torrentId).subscribe(
      downloadState => {
        state[torrentId] = downloadState
        publish()
      },
      error => {
        console.warn('downloadTorrent Error', error)
        state[torrentId] = {error: error}
        publish()
      },
      complete => {
        state[torrentId] = {complete: true}
        publish()
      }
    )
    publish()
  }

  publish()
  return stateStream;
}


const downloadTorrentStream = (torrentId) => {
  return Rx.Observable.create( observer => {
    var state = {}
    var getMagnetLinkSubscription
    var addTransferSubscription
    const publish = () => { observer.onNext(state) }

    getMagnetLinkSubscription = Torrents.getMagnetLink(torrentId).subscribe(
      magnetLinkState => {
        state.torrentName  = magnetLinkState.torrentName
        state.trackers     = magnetLinkState.trackers
        state.error        = magnetLinkState.error
        state.errorMessage = magnetLinkState.errorMessage
        state.magnetLink   = magnetLinkState.magnetLink
        publish()
      },

      error => {
        throw error
      },

      complete => {
        addTransferSubscription = putio.addTransfer(state.magnetLink).subscribe(
          transfer => {
            console.log('addTransfer transfer', transfer)
            state.transfer = transfer
            publish()
          },

          error => {
            throw error
          },

          complete => {
            observer.onCompleted()
          }
        )
      }
    )

    return () => {
      if (getMagnetLinkSubscription) getMagnetLinkSubscription.dispose()
      if (addTransferSubscription) addTransferSubscription.dispose()
    }
  })
}
