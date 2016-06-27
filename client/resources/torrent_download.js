import Rx from 'rx-dom'
import putio from '../putio'
import Torrents from '../torrents'

export default function(events){
  let stateStream = new Rx.ReplaySubject(1);

  events.subscribe( event => {
    if (event.type === 'download-torrent'){
      downloadTorrent(event.torrent)
    }
  })

  var state = {
    downloads: {}
  }
  const publish = () => {
    state.ids = Object.keys(state.downloads)
    stateStream.onNext(state)
  }

  var querySubscription = null

  const downloadTorrent = (torrent) => {
    const {id, name} = torrent
    if (state.downloads[id]) return
    downloadTorrentStream(torrent).subscribe(
      downloadState => {
        state.downloads[id] = downloadState
        publish()
      },
      error => {
        console.warn('downloadTorrent Error', error)
        state.downloads[id] = {
          id: id,
          name: name,
          error: error
        }
        publish()
      },
      complete => {
        delete state.downloads[id]
        publish()
      }
    )
    publish()
  }

  publish()
  return stateStream;
}


const downloadTorrentStream = ({id, name}) => {
  return Rx.Observable.create( observer => {
    let state = {
      id: id,
      name: name,
    }
    var getMagnetLinkSubscription
    var addTransferSubscription
    const publish = () => { observer.onNext(state) }

    getMagnetLinkSubscription = Torrents.getMagnetLink(id).subscribe(
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
