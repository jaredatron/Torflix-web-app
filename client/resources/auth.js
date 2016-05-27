import Rx from 'rx-dom'
import putio from '../putio'

export default function(events){
  let state = {};
  let stateStream = new Rx.ReplaySubject(1);


  events.subscribe( event => {
    if (event.type === 'auth:logout') {
      putio.accessToken = null;
      update();
    }
  })

  let update = () => {
    if (putio.accessToken){
      stateStream.onNext({})
      putio.accountInfo().subscribe(
        creds => { stateStream.onNext(creds) },
        error => { console.error(error); stateStream.onNext({error:error}) }
      )

    }else{
      stateStream.onNext(null)
    }
  }

  update();
  return stateStream;
}
