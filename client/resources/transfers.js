import Rx from 'rx-dom'
import putio from '../putio'

export default function(events){
  let state = {};
  let stateStream = new Rx.ReplaySubject(1);
  // events.subscribe()


  events.subscribe( event => {
    if (event.type === 'transfers:load'){
      loadTransfers()
    }
  })

  const loadTransfers = () => {
    putio.transfers().subscribe( transfers => {
      console.log('transfers', transfers);
      state.transfers = transfers;
      state.loaded = true;
    })
    update()
  }

  const update = () => stateStream.onNext(state)
  update()
  return stateStream;
}
