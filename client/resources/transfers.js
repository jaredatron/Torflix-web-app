import Rx from 'rx'
// import putio from '../putio'

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
    state.loaded = true;
    update()
  }

  const update = () => stateStream.onNext(state)
  update()
  return stateStream;
}
