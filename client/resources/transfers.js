import Rx from 'rx-dom'
import putio from '../putio'

export default function(events){
  let state = {};
  let stateStream = new Rx.ReplaySubject(1);

  events.subscribe( event => {
    if (event.type === 'transfers:load'){
      loadTransfers()
    }
    if (event.type === 'transfers:reload'){
      reloadTransfers()
    }
  })

  const loadTransfers = () => {
    if (!state.loaded) reloadTransfers()
  }

  const reloadTransfers = () => {
    putio.transfers().subscribe( transfers => {
      console.log('transfers loaded', transfers);
      state.transfers = transfers
      state.loaded = true
      publish()
    })
    publish()
  }

  const publish = () => stateStream.onNext(state)
  publish()
  return stateStream;
}
