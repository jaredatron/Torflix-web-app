import Rx from 'rx-dom'
import putio from '../putio'

export default function(events){
  let stateStream = new Rx.ReplaySubject(1);

  events.subscribe( event => {
    if (event.type === 'search'){
      search(event.query)
    }
  })

  var currentQuery = null

  const search = (query) => {
    currentQuery = query
    update({wtf: 232321})
    // putio.transfers().subscribe( transfers => {
    //   console.log('transfers', transfers);
    //   state.transfers = transfers;
    //   state.loaded = true;
    // })
    setTimeout(()=>{
      update({ results: [] })
    }, 5000)
  }

  const update = (results) => {
    stateStream.onNext(results)
  }
  update(null)
  return stateStream;
}
